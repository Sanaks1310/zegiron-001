import { useEffect, useRef, useMemo } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";
import * as THREE from "three";
import { useSensorNodes, SensorCategory, SensorEntry } from "@/context/SensorNodesContext";

/**
 * Parse coords like "54.3°N 003.6°E" -> { lat, lng }.
 * Tolerant of S/W (negative) and inconsistencies in mock data.
 */
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

const CATEGORY_STYLE: Record<SensorCategory, { color: string; label: string; size: number }> = {
  radar:     { color: "#3da9fc", label: "RADAR",   size: 0.55 },
  eoir:      { color: "#3df0a7", label: "EO/IR",   size: 0.45 },
  ais:       { color: "#f0a93d", label: "AIS",     size: 0.5  },
  passiveRf: { color: "#d83df0", label: "PASS-RF", size: 0.4  },
};

interface PointDatum {
  lat: number;
  lng: number;
  size: number;
  color: string;
  category: SensorCategory;
  id: string;
  label?: string;
  status: string;
  range?: string;
}

export function Globe3D() {
  const globeRef = useRef<GlobeMethods>();
  const { nodes } = useSensorNodes();

  const points = useMemo<PointDatum[]>(() => {
    const out: PointDatum[] = [];
    (Object.keys(nodes) as SensorCategory[]).forEach((cat) => {
      const style = CATEGORY_STYLE[cat];
      nodes[cat].forEach((s: SensorEntry) => {
        const c = parseCoords(s.coords);
        if (!c) return;
        out.push({
          lat: c.lat,
          lng: c.lng,
          size: style.size,
          color: s.status === "fault" ? "#f0436b" : style.color,
          category: cat,
          id: s.id,
          label: s.label,
          status: s.status,
          range: s.range,
        });
      });
    });
    return out;
  }, [nodes]);

  const rings = useMemo(
    () =>
      points.map((p) => ({
        lat: p.lat,
        lng: p.lng,
        maxR: p.category === "radar" ? 6 : 3,
        propagationSpeed: 2,
        repeatPeriod: p.status === "fault" ? 800 : 1800,
        color: p.color,
      })),
    [points]
  );

  // Initial camera + controls + external zoom events
  useEffect(() => {
    const g = globeRef.current;
    if (!g) return;
    g.pointOfView({ lat: 30, lng: 5, altitude: 2.2 }, 0);
    const controls: any = g.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.35;
    controls.enableDamping = true;

    const onZoom = (e: Event) => {
      const dir = (e as CustomEvent).detail as "in" | "out" | "reset";
      const pov = g.pointOfView();
      if (dir === "reset") {
        g.pointOfView({ lat: 30, lng: 5, altitude: 2.2 }, 600);
      } else {
        const factor = dir === "in" ? 0.7 : 1.4;
        const next = Math.max(0.6, Math.min(4, (pov.altitude || 2.2) * factor));
        g.pointOfView({ ...pov, altitude: next }, 400);
      }
    };
    window.addEventListener("globe-zoom", onZoom);
    return () => window.removeEventListener("globe-zoom", onZoom);
  }, []);

  // Custom globe material (dark tactical look)
  const globeMaterial = useMemo(() => {
    const mat = new THREE.MeshPhongMaterial({
      color: new THREE.Color("#0a1628"),
      emissive: new THREE.Color("#0a2540"),
      emissiveIntensity: 0.25,
      shininess: 8,
    });
    return mat;
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
        atmosphereAltitude={0.18}
        globeMaterial={globeMaterial}
        // Equirectangular dark earth + topology
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        // Sensor points
        pointsData={points}
        pointLat="lat"
        pointLng="lng"
        pointAltitude={0.02}
        pointRadius="size"
        pointColor="color"
        pointLabel={(d: any) =>
          `<div style="background:rgba(8,16,28,0.92);border:1px solid ${d.color};padding:6px 8px;border-radius:4px;font-family:ui-monospace,monospace;font-size:11px;color:#cfe6ff;">
            <div style="color:${d.color};font-weight:700;letter-spacing:0.08em">${CATEGORY_STYLE[d.category as SensorCategory].label}</div>
            <div>${d.id}${d.label ? " · " + d.label : ""}</div>
            <div style="opacity:0.7">${d.status}${d.range ? " · " + d.range : ""}</div>
            <div style="opacity:0.6">${d.lat.toFixed(2)}°, ${d.lng.toFixed(2)}°</div>
          </div>`
        }
        // Pulse rings
        ringsData={rings}
        ringColor={(r: any) => () => r.color}
        ringMaxRadius="maxR"
        ringPropagationSpeed="propagationSpeed"
        ringRepeatPeriod="repeatPeriod"
      />
    </div>
  );
}
