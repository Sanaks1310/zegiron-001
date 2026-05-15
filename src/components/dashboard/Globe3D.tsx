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
  const { nodes } = useSensorNodes();
  const [tiles, setTiles] = useState<Tile[]>([]);

  const points = useMemo<PointDatum[]>(() => {
    const out: PointDatum[] = [];
    (Object.keys(nodes) as SensorCategory[]).forEach((cat) => {
      const style = CATEGORY_STYLE[cat];
      nodes[cat].forEach((s: SensorEntry) => {
        const c = parseCoords(s.coords);
        if (!c) return;
        out.push({
          lat: c.lat, lng: c.lng, size: style.size,
          color: s.status === "fault" ? "#f0436b" : style.color,
          category: cat, id: s.id, label: s.label,
          status: s.status, range: s.range,
        });
      });
    });
    return out;
  }, [nodes]);

  const rings = useMemo(
    () =>
      points.map((p) => ({
        lat: p.lat, lng: p.lng,
        maxR: p.category === "radar" ? 6 : 3,
        propagationSpeed: 2,
        repeatPeriod: p.status === "fault" ? 800 : 1800,
        color: p.color,
      })),
    [points]
  );

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
        g.pointOfView({ lat: 54.5, lng: 1.5, altitude: 1.4 }, 600);
      } else {
        const factor = dir === "in" ? 0.65 : 1.5;
        const next = Math.max(0.08, Math.min(4, (pov.altitude || 2.2) * factor));
        g.pointOfView({ ...pov, altitude: next }, 400);
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
        /* HTML labels stuck to each sensor */
        htmlElementsData={points}
        htmlLat={(d: any) => d.lat}
        htmlLng={(d: any) => d.lng}
        htmlAltitude={0.05}
        htmlElement={(d: any) => {
          const el = document.createElement("div");
          const cat = CATEGORY_STYLE[d.category as SensorCategory];
          el.innerHTML = `
            <div style="transform:translate(-50%,-130%);pointer-events:none;font-family:ui-monospace,monospace;font-size:10px;line-height:1.1;white-space:nowrap;">
              <div style="display:flex;align-items:center;gap:4px;background:rgba(8,16,28,0.85);border:1px solid ${d.color};padding:2px 6px;border-radius:3px;color:${d.color};font-weight:700;letter-spacing:0.08em;box-shadow:0 0 8px ${d.color}55;">
                <span style="width:6px;height:6px;border-radius:9999px;background:${d.color};box-shadow:0 0 6px ${d.color};"></span>
                ${cat.label} · <span style="color:#cfe6ff;font-weight:600;">${d.id}</span>
              </div>
            </div>`;
          return el;
        }}
        pointLabel={(d: any) =>
          `<div style="background:rgba(8,16,28,0.92);border:1px solid ${d.color};padding:6px 8px;border-radius:4px;font-family:ui-monospace,monospace;font-size:11px;color:#cfe6ff;">
            <div style="color:${d.color};font-weight:700;letter-spacing:0.08em">${CATEGORY_STYLE[d.category as SensorCategory].label}</div>
            <div>${d.id}${d.label ? " · " + d.label : ""}</div>
            <div style="opacity:0.7">${d.status}${d.range ? " · " + d.range : ""}</div>
            <div style="opacity:0.6">${d.lat.toFixed(2)}°, ${d.lng.toFixed(2)}°</div>
          </div>`
        }
        /* Pulse rings */
        ringsData={rings}
        ringColor={(r: any) => () => r.color}
        ringMaxRadius="maxR"
        ringPropagationSpeed="propagationSpeed"
        ringRepeatPeriod="repeatPeriod"
      />
    </div>
  );
}
