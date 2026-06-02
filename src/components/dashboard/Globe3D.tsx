import { useEffect, useRef, useMemo, useState } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";
import * as THREE from "three";
import { useSensorNodes, SensorCategory, SensorEntry } from "@/context/SensorNodesContext";

/* ----------------------------- coord helpers ----------------------------- */

function parseCoords(coords?: string): { lat: number; lng: number } | null {
  if (!coords) return null;
  const parts = coords.match(/(-?\d+(?:\.\d+)?)\s*°?\s*([NSEW])?/gi);
  if (!parts || parts.length < 2) return null;
  const toNum = (s: string, isLat: boolean) => {
    const m = s.match(/(-?\d+(?:\.\d+)?)\s*°?\s*([NSEW])?/i);
    if (!m) return 0;
    const v = parseFloat(m[1]);
    const dir = (m[2] || "").toUpperCase();
    if (isLat) return dir === "S" ? -Math.abs(v) : Math.abs(v);
    return dir === "W" || dir === "S" ? -Math.abs(v) : Math.abs(v);
  };
  return { lat: toNum(parts[0], true), lng: toNum(parts[1], false) };
}

/* --------------------------- sensor visual style -------------------------- */

/* Inline SVGs for unique per-category icons (lucide-style 24x24) */
const ICON_SVG: Record<SensorCategory, string> = {
  // radar dish
  radar: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19.07 4.93A10 10 0 0 0 6.99 3.34"/><path d="M4 6h.01"/><path d="M2.29 9.62A10 10 0 1 0 21.31 8.35"/><path d="M16.24 7.76A6 6 0 1 0 17.7 13.7"/><path d="M12 18v-6l4 2"/></svg>`,
  // eye for EO/IR
  eoir: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>`,
  // plane for AIS (per request)
  ais: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>`,
  // antenna for passive RF
  passiveRf: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4.5C7 7 7 11 5 13.5"/><path d="M19 4.5c2 2.5 2 6.5 0 9"/><path d="M2 8.82C3.36 7.84 5.5 7 8 7s4.64.84 6 1.82"/><path d="M22 8.82C20.64 7.84 18.5 7 16 7s-4.64.84-6 1.82"/><path d="M12 12v10"/><path d="m9 22 3-4 3 4"/></svg>`,
};

const CATEGORY_STYLE: Record<SensorCategory, { color: string; label: string; size: number }> = {
  radar:     { color: "#3da9fc", label: "RADAR",   size: 0.5 },
  eoir:      { color: "#3df0a7", label: "EO/IR",   size: 0.5 },
  ais:       { color: "#f0a93d", label: "AIS",     size: 0.5 },
  passiveRf: { color: "#d83df0", label: "PASS-RF", size: 0.5 },
};

interface PointDatum {
  lat: number; lng: number; size: number; color: string;
  category: SensorCategory; id: string; label?: string;
  status: string; range?: string;
}

/* -------------------------- slippy-tile streaming ------------------------- */
/**
 * Compute Web-Mercator slippy tiles visible around a (lat,lng) at given zoom.
 * Each tile is described as a lat/lng/width/height polygon for react-globe.gl
 * `tilesData`. We use Google hybrid (satellite + roads + place names).
 */
interface Tile {
  key: string;
  x: number; y: number; z: number;
  lat: number; lng: number; // tile center
  width: number; height: number; // size in degrees
  url: string;
}

const TILE_URL = (x: number, y: number, z: number) =>
  // Google hybrid: satellite imagery with labels & roads (lyrs=y)
  `https://mt${(x + y) % 4}.google.com/vt/lyrs=y&x=${x}&y=${y}&z=${z}`;

function altitudeToZoom(alt: number): number {
  // Map camera altitude (Earth radii) → tile zoom level
  if (alt > 2.5) return 2;
  if (alt > 1.6) return 3;
  if (alt > 1.0) return 4;
  if (alt > 0.6) return 5;
  if (alt > 0.35) return 6;
  if (alt > 0.2) return 7;
  if (alt > 0.1) return 8;
  return 9;
}

function tilesAround(centerLat: number, centerLng: number, zoom: number, radius = 3): Tile[] {
  const n = 2 ** zoom;
  const cx = Math.floor(((centerLng + 180) / 360) * n);
  const latRad = Math.max(-1.4844, Math.min(1.4844, (centerLat * Math.PI) / 180));
  const cy = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n
  );
  const r = Math.min(radius, Math.ceil(n / 2));
  const tiles: Tile[] = [];
  for (let dx = -r; dx <= r; dx++) {
    for (let dy = -r; dy <= r; dy++) {
      const x = ((cx + dx) % n + n) % n;
      const y = cy + dy;
      if (y < 0 || y >= n) continue;
      const lng1 = (x / n) * 360 - 180;
      const lng2 = ((x + 1) / n) * 360 - 180;
      const lat1 = (Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / n))) * 180) / Math.PI;
      const lat2 = (Math.atan(Math.sinh(Math.PI * (1 - (2 * (y + 1)) / n))) * 180) / Math.PI;
      tiles.push({
        key: `${zoom}/${x}/${y}`,
        x, y, z: zoom,
        lat: (lat1 + lat2) / 2,
        lng: (lng1 + lng2) / 2,
        width: lng2 - lng1,
        height: lat1 - lat2,
        url: TILE_URL(x, y, zoom),
      });
    }
  }
  return tiles;
}

/* --------------------------------- Globe --------------------------------- */

export function Globe3D() {
  const globeRef = useRef<GlobeMethods>();
  const { nodes, visible, setSelectedSensor } = useSensorNodes();
  const [tiles, setTiles] = useState<Tile[]>([]);

  /* ---------------------- AIS animation (moving vessels) ---------------------- */
  // Per-AIS animated position + trail history (last 5 samples → 4 line segments)
  const [aisAnim, setAisAnim] = useState<Record<string, { lat: number; lng: number; history: { lat: number; lng: number }[] }>>({});
  // Per-route data including real-world-derived period (ping-pong cycle in ms).
  // Speed model: ~900 km/h cruise (commercial flight). Delhi→Bangalore ≈ 1740 km
  // → ~1.93h one-way → ~3.87h ping-pong. We compress time so the animation is
  // visible but still proportional: 1 real hour = 5 real-time seconds.
  const aisRoutesRef = useRef<Record<string, { from: { lat: number; lng: number }; to: { lat: number; lng: number }; period: number }>>({});

  // Haversine distance in km between two lat/lng points.
  const haversineKm = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
    const R = 6371;
    const toRad = (d: number) => (d * Math.PI) / 180;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const s = Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(s));
  };

  useEffect(() => {
    // Build/refresh route lookup whenever AIS nodes change.
    const SPEED_KMH = 900;        // cruise speed of a commercial flight
    const TIME_COMPRESSION = 1;   // 1:1 with real life (user requested real flight duration)
    const map: Record<string, { from: { lat: number; lng: number }; to: { lat: number; lng: number }; period: number }> = {};
    nodes.ais.forEach((s) => {
      if (!s.route) return;
      const f = parseCoords(s.route.from);
      const t = parseCoords(s.route.to);
      if (!f || !t) return;
      const distKm = haversineKm(f, t);
      const realHoursOneWay = distKm / SPEED_KMH;
      const realMsPingPong = realHoursOneWay * 2 * 3600 * 1000;
      const period = Math.max(4000, realMsPingPong / TIME_COMPRESSION);
      map[s.id] = { from: f, to: t, period };
    });
    aisRoutesRef.current = map;
  }, [nodes.ais]);

  useEffect(() => {
    // Per-route ping-pong using each route's own period (derived from real distance).
    let raf = 0;
    const lastSampleRef: Record<string, number> = {};
    const tick = (now: number) => {
      setAisAnim((prev) => {
        const next: typeof prev = { ...prev };
        const routes = aisRoutesRef.current;
        Object.entries(routes).forEach(([id, r]) => {
          const t = (now % r.period) / r.period;
          const k = t < 0.5 ? t * 2 : 2 - t * 2;
          const lat = r.from.lat + (r.to.lat - r.from.lat) * k;
          const lng = r.from.lng + (r.to.lng - r.from.lng) * k;
          // Sample history 5 times per full cycle so trail spans a visible arc.
          const sampleMs = r.period / 40;
          const last = lastSampleRef[id] ?? 0;
          const sample = now - last >= sampleMs;
          if (sample) lastSampleRef[id] = now;
          const prevEntry = prev[id];
          const history = prevEntry ? prevEntry.history : [];
          const newHistory = sample
            ? [...history, { lat, lng }].slice(-5)
            : history;
          next[id] = { lat, lng, history: newHistory };
        });
        return next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const points = useMemo<PointDatum[]>(() => {
    const out: PointDatum[] = [];
    (Object.keys(nodes) as SensorCategory[]).forEach((cat) => {
      if (!visible[cat]) return;
      const style = CATEGORY_STYLE[cat];
      nodes[cat].forEach((s: SensorEntry) => {
        let lat: number, lng: number;
        if (cat === "ais" && aisAnim[s.id]) {
          lat = aisAnim[s.id].lat;
          lng = aisAnim[s.id].lng;
        } else {
          const c = parseCoords(s.coords);
          if (!c) return;
          lat = c.lat; lng = c.lng;
        }
        out.push({
          lat, lng, size: style.size,
          color: s.affiliation === "unfriendly"
            ? "#f0436b"
            : s.status === "fault" ? "#f0436b" : style.color,
          category: cat, id: s.id, label: s.label,
          status: s.status, range: s.range,
        });
      });
    });
    return out;
  }, [nodes, visible, aisAnim]);

  /* AIS trail paths: last 4 segments behind each moving vessel */
  const aisPaths = useMemo(() => {
    if (!visible.ais) return [];
    return nodes.ais
      .map((s) => {
        const a = aisAnim[s.id];
        if (!a || a.history.length < 2) return null;
        const coords = [...a.history, { lat: a.lat, lng: a.lng }].map((p) => [p.lat, p.lng, 0.012]);
        const color = s.affiliation === "unfriendly" ? "#f0436b" : "#f0a93d";
        return { kind: "ais" as const, coords, color, id: s.id, opacity: 1 };
      })
      .filter(Boolean) as { kind: "ais"; coords: number[][]; color: string; id: string; opacity: number }[];
  }, [aisAnim, nodes.ais, visible.ais]);


  // Parse "<num> km" → degrees on globe (1° ≈ 111 km)
  const parseKmToDeg = (range?: string): number | null => {
    if (!range) return null;
    const m = range.match(/(\d+(?:\.\d+)?)\s*km/i);
    if (!m) return null;
    return parseFloat(m[1]) / 111;
  };

  // Generate points along a small-circle on the sphere centered at (lat0, lng0)
  // with angular radius `angDeg` (degrees of arc).
  const smallCircle = (lat0: number, lng0: number, angDeg: number, segs = 72): number[][] => {
    const toRad = Math.PI / 180;
    const toDeg = 180 / Math.PI;
    const φ0 = lat0 * toRad;
    const λ0 = lng0 * toRad;
    const α = angDeg * toRad;
    const pts: number[][] = [];
    for (let i = 0; i <= segs; i++) {
      const θ = (i / segs) * Math.PI * 2;
      const φ = Math.asin(Math.sin(φ0) * Math.cos(α) + Math.cos(φ0) * Math.sin(α) * Math.cos(θ));
      const λ = λ0 + Math.atan2(
        Math.sin(θ) * Math.sin(α) * Math.cos(φ0),
        Math.cos(α) - Math.sin(φ0) * Math.sin(φ)
      );
      pts.push([φ * toDeg, λ * toDeg, 0.012]);
    }
    return pts;
  };

  // Radar concentric ring paths (4 rings per radar, scaled to range)
  const radarRingPaths = useMemo(() => {
    if (!visible.radar) return [];
    const out: { kind: "radar-ring"; coords: number[][]; color: string; opacity: number; id: string }[] = [];
    points.forEach((p) => {
      if (p.category !== "radar") return;
      const deg = parseKmToDeg(p.range);
      if (!deg || deg <= 0) return;
      [0.25, 0.5, 0.75, 1.0].forEach((frac, i) => {
        out.push({
          kind: "radar-ring",
          coords: smallCircle(p.lat, p.lng, deg * frac),
          color: "#39ff14",
          opacity: i === 3 ? 1 : 0.75 + i * 0.05,
          id: `${p.id}-ring-${i}`,
        });
      });
    });
    return out;
  }, [points, visible.radar]);

  const allPaths = useMemo(() => [...aisPaths, ...radarRingPaths], [aisPaths, radarRingPaths]);

  // Rotating radar sweep wedges (custom three.js layer)
  const radarSweeps = useMemo(() => {
    if (!visible.radar) return [];
    const out: { lat: number; lng: number; radiusUnits: number; id: string }[] = [];
    points.forEach((p) => {
      if (p.category !== "radar") return;
      const deg = parseKmToDeg(p.range);
      if (!deg || deg <= 0) return;
      // GLOBE_RADIUS = 100; arc length on sphere ≈ 100 * angleRadians
      const radiusUnits = 100 * deg * (Math.PI / 180);
      out.push({ lat: p.lat, lng: p.lng, radiusUnits, id: p.id });
    });
    return out;
  }, [points, visible.radar]);

  // Per-frame rotation of sweep wedges
  const sweepMeshesRef = useRef<THREE.Mesh[]>([]);
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      sweepMeshesRef.current = sweepMeshesRef.current.filter((m) => m.parent);
      sweepMeshesRef.current.forEach((m) => { m.rotation.z -= 0.03; });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Outer expanding pulse rings (transmission signal effect) – per sensor
  const rings = useMemo(() => {
    const out: { lat: number; lng: number; maxR: number; propagationSpeed: number; repeatPeriod: number; color: string }[] = [];
    points.forEach((p) => {
      const maxR = p.category === "radar" ? 7 : p.category === "eoir" ? 5 : 4;
      const speed = 2;
      const repeatPeriod = (maxR / speed) * 1000 / 3;
      out.push({ lat: p.lat, lng: p.lng, maxR, propagationSpeed: speed, repeatPeriod, color: p.color });
    });
    return out;
  }, [points]);

  // Camera controls + tile streaming based on POV
  useEffect(() => {
    const g = globeRef.current;
    if (!g) return;
    g.pointOfView({ lat: 20, lng: 30, altitude: 2.4 }, 0);
    const controls: any = g.controls();
    controls.autoRotate = false; // off so users can read labels
    controls.enableDamping = true;
    controls.minDistance = 110;
    controls.maxDistance = 800;

    let lastKey = "";
    const refreshTiles = () => {
      const pov = g.pointOfView();
      const z = altitudeToZoom(pov.altitude);
      // Wider tile radius when zoomed in to fill the screen
      const radius = z <= 3 ? 2 : z <= 5 ? 3 : 4;
      const key = `${z}|${Math.round(pov.lat)}|${Math.round(pov.lng)}|${radius}`;
      if (key === lastKey) return;
      lastKey = key;
      setTiles(tilesAround(pov.lat, pov.lng, z, radius));
    };
    refreshTiles();

    let raf = 0;
    const onChange = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(refreshTiles);
    };
    controls.addEventListener("change", onChange);

    const onZoom = (e: Event) => {
      const dir = (e as CustomEvent).detail as "in" | "out" | "reset";
      const pov = g.pointOfView();
      if (dir === "reset") {
        g.pointOfView({ lat: 20, lng: 30, altitude: 2.4 }, 0);
      } else {
        const factor = dir === "in" ? 0.65 : 1.5;
        const next = Math.max(0.08, Math.min(4, (pov.altitude || 2.2) * factor));
        g.pointOfView({ ...pov, altitude: next }, 0);
      }
    };
    window.addEventListener("globe-zoom", onZoom);
    return () => {
      window.removeEventListener("globe-zoom", onZoom);
      controls.removeEventListener("change", onChange);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Dark base material (visible only until tiles load on top)
  const globeMaterial = useMemo(() => {
    return new THREE.MeshPhongMaterial({
      color: new THREE.Color("#0a1628"),
      emissive: new THREE.Color("#0a2540"),
      emissiveIntensity: 0.2,
      shininess: 4,
    });
  }, []);

  return (
    <div className="absolute inset-0">
      <Globe
        ref={globeRef}
        width={undefined as any}
        height={undefined as any}
        backgroundColor="rgba(0,0,0,0)"
        showAtmosphere
        atmosphereColor="#3da9fc"
        atmosphereAltitude={0.16}
        globeMaterial={globeMaterial}
        /* HD streaming tiles (Google hybrid: satellite + place names) */
        tilesData={tiles}
        tileLat={(d: any) => d.lat}
        tileLng={(d: any) => d.lng}
        tileWidth={(d: any) => d.width}
        tileHeight={(d: any) => d.height}
        tileUseGlobeProjection={true}
        tileMaterial={(d: any) => {
          const tex = new THREE.TextureLoader().load(d.url);
          tex.colorSpace = (THREE as any).SRGBColorSpace ?? tex.colorSpace;
          tex.anisotropy = 8;
          return new THREE.MeshBasicMaterial({ map: tex, transparent: true });
        }}
        /* Sensor points */
        pointsData={points}
        pointLat="lat"
        pointLng="lng"
        pointAltitude={0.04}
        pointRadius="size"
        pointColor="color"
        pointResolution={16}
        onPointClick={(d: any) => {
          setSelectedSensor({
            category: d.category, id: d.id, label: d.label,
            coords: `${d.lat.toFixed(2)}°, ${d.lng.toFixed(2)}°`,
            range: d.range, status: d.status,
          });
          const g = globeRef.current;
          if (g) g.pointOfView({ lat: d.lat, lng: d.lng, altitude: Math.max(0.4, g.pointOfView().altitude) }, 700);
        }}
        /* HTML labels stuck to each sensor */
        htmlElementsData={points}
        htmlLat={(d: any) => d.lat}
        htmlLng={(d: any) => d.lng}
        htmlAltitude={0.05}
        htmlElement={(d: any) => {
          // Inject ring keyframes once
          if (!document.getElementById("sensor-ring-kf")) {
            const style = document.createElement("style");
            style.id = "sensor-ring-kf";
            style.textContent = `
              @keyframes sensor-ring-pulse {
                0%   { transform: translate(-50%,-50%) scale(0.4); opacity: 0.9; }
                80%  { opacity: 0.15; }
                100% { transform: translate(-50%,-50%) scale(3.2); opacity: 0; }
              }
            `;
            document.head.appendChild(style);
          }
          const el = document.createElement("div");
          const cat = CATEGORY_STYLE[d.category as SensorCategory];
          const svg = ICON_SVG[d.category as SensorCategory];
          const showRings = d.category === "radar" || d.category === "eoir";
          const ringsHtml = showRings
            ? `
              <div style="position:absolute;left:50%;top:0;width:0;height:0;pointer-events:none;">
                ${[0, 0.9, 1.8].map(delay => `
                  <div style="position:absolute;left:50%;top:50%;width:30px;height:30px;border-radius:9999px;border:2px solid ${d.color};box-shadow:0 0 8px ${d.color}aa;transform:translate(-50%,-50%) scale(0.4);animation:sensor-ring-pulse 2.7s ease-out ${delay}s infinite;"></div>
                `).join("")}
              </div>`
            : "";
          el.innerHTML = `
            <div style="position:relative;transform:translate(-50%,-100%);cursor:pointer;font-family:ui-monospace,monospace;font-size:9px;line-height:1;white-space:nowrap;display:flex;flex-direction:column;align-items:center;gap:2px;">
              ${ringsHtml}
              <div style="position:relative;display:flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:9999px;background:rgba(8,16,28,0.92);border:1.5px solid ${d.color};color:${d.color};box-shadow:0 0 10px ${d.color}88, inset 0 0 6px ${d.color}44;">
                ${svg}
              </div>
              <div style="position:relative;background:rgba(8,16,28,0.85);border:1px solid ${d.color}66;padding:1px 5px;border-radius:2px;color:${d.color};font-weight:700;letter-spacing:0.06em;">
                ${cat.label}·<span style="color:#cfe6ff">${d.id}</span>
              </div>
            </div>`;
          el.addEventListener("click", (ev) => {
            ev.stopPropagation();
            setSelectedSensor({
              category: d.category, id: d.id, label: d.label,
              coords: `${d.lat.toFixed(2)}°, ${d.lng.toFixed(2)}°`,
              range: d.range, status: d.status,
            });
          });
          return el;
        }}
        pointLabel={(d: any) =>
          `<div style="background:rgba(8,16,28,0.92);border:1px solid ${d.color};padding:6px 8px;border-radius:4px;font-family:ui-monospace,monospace;font-size:11px;color:#cfe6ff;">
            <div style="color:${d.color};font-weight:700;letter-spacing:0.08em">${CATEGORY_STYLE[d.category as SensorCategory].label}</div>
            <div>${d.id}${d.label ? " · " + d.label : ""}</div>
            <div style="opacity:0.7">${d.status}${d.range ? " · " + d.range : ""}</div>
            <div style="opacity:0.6">${d.lat.toFixed(2)}°, ${d.lng.toFixed(2)}°</div>
            <div style="opacity:0.5;margin-top:2px">CLICK FOR DETAILS</div>
          </div>`
        }
        /* Pulse rings */
        ringsData={rings}
        ringColor={(r: any) => (t: number) => {
          // t: 0 (start, at center) → 1 (fully expanded). Fade out as it expands.
          const hex = r.color.replace("#", "");
          const bigint = parseInt(hex, 16);
          const cr = (bigint >> 16) & 255;
          const cg = (bigint >> 8) & 255;
          const cb = bigint & 255;
          const a = Math.max(0, 0.9 * (1 - t));
          return `rgba(${cr},${cg},${cb},${a})`;
        }}
        ringMaxRadius="maxR"
        ringPropagationSpeed="propagationSpeed"
        ringRepeatPeriod="repeatPeriod"
        /* AIS movement trails + radar concentric rings */
        pathsData={allPaths}
        pathPoints={(d: any) => d.coords}
        pathPointLat={(p: any) => p[0]}
        pathPointLng={(p: any) => p[1]}
        pathPointAlt={(p: any) => p[2]}
        pathColor={(d: any) => {
          if (d.kind === "radar-ring") {
            const c = `rgba(57,255,20,${d.opacity})`;
            return [c, c];
          }
          const hex = d.color.replace("#", "");
          const bigint = parseInt(hex, 16);
          const cr = (bigint >> 16) & 255;
          const cg = (bigint >> 8) & 255;
          const cb = bigint & 255;
          // Trail fades from transparent tail to bright head (at airplane)
          return [
            `rgba(${cr},${cg},${cb},0)`,
            `rgba(${cr},${cg},${cb},1)`,
          ];
        }}
        pathStroke={(d: any) => (d.kind === "radar-ring" ? 2.5 : 4)}
        pathDashLength={(d: any) => (d.kind === "radar-ring" ? 0 : 0.12)}
        pathDashGap={(d: any) => (d.kind === "radar-ring" ? 0 : 0.18)}
        pathDashAnimateTime={0}
        pathPointAlt={(p: any) => p[2] ?? 0.015}
        pathTransitionDuration={0}
        /* Radar sweep wedges (custom three.js layer) */
        customLayerData={radarSweeps}
        customThreeObject={(d: any) => {
          const r = d.radiusUnits;
          const geo = new THREE.CircleGeometry(r, 48, 0, Math.PI / 5);
          // Fade the wedge from bright at center to transparent at the edge
          const colors: number[] = [];
          const pos = geo.attributes.position;
          for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);
            const dist = Math.sqrt(x * x + y * y);
            const t = Math.min(1, dist / r);
            const a = (1 - t) * 0.9;
            colors.push(0.22, 1.0, 0.08, a);
          }
          geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 4));
          const mat = new THREE.MeshBasicMaterial({
            vertexColors: true,
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          });
          const mesh = new THREE.Mesh(geo, mat);
          sweepMeshesRef.current.push(mesh);
          return mesh;
        }}
        customThreeObjectUpdate={(obj: any, d: any) => {
          const g = globeRef.current;
          if (!g) return;
          const { x, y, z } = (g as any).getCoords(d.lat, d.lng, 0.004);
          obj.position.set(x, y, z);
          // Orient the wedge tangent to the globe surface (lookAt origin from outside)
          obj.lookAt(0, 0, 0);
        }}
      />
    </div>
  );
}
