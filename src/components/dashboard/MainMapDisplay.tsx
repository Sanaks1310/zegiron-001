import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { mapContacts } from "@/data/mockData";
import { StatusSelector } from "./StatusSelector";

// Radar center coordinates (North Sea area)
const RADAR_CENTER: [number, number] = [54.5, -2.0];
const RADAR_RADIUS_KM = 250;

const contactColor: Record<string, string> = {
  hostile: "#e5395f",
  unknown: "#f59e0b",
  friendly: "#3b82f6",
};

// Map contact positions to lat/lng offsets from radar center
const contactLatLng: Record<string, [number, number]> = {
  "HTL-01": [54.88, -0.08],
  "HTL-02": [54.65, -0.92],
  "UNK-07": [55.1, 0.5],
  "UNK-12": [54.2, -1.5],
  "HMS ARGYLL": [54.5, -2.5],
  "HMS DAUNTLESS": [54.3, -3.2],
};

// Airplane SVG icon for markers
function createAirplaneIcon(color: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="${color}" stroke="${color}" stroke-width="0.5">
    <path d="M12 2L9.5 8.5H3L2 10l7 3.5L10.5 20H8l-1 2h10l-1-2h-2.5L15 13.5l7-3.5-1-1.5h-6.5L12 2z"/>
  </svg>`;
  return L.divIcon({
    html: svg,
    className: "airplane-marker",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

// Component to render radar overlay and contacts on the map
function RadarOverlay() {
  const map = useMap();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sweepAngle = useRef(0);
  const animRef = useRef<number>(0);

  useEffect(() => {
    // Create a canvas pane overlay for the radar
    const pane = map.getPane("overlayPane")!;
    const canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "400";
    pane.appendChild(canvas);
    canvasRef.current = canvas;

    function updateCanvas() {
      const size = map.getSize();
      canvas.width = size.x;
      canvas.height = size.y;
      canvas.style.width = size.x + "px";
      canvas.style.height = size.y + "px";

      // Position canvas at map origin
      const topLeft = map.containerPointToLayerPoint([0, 0]);
      L.DomUtil.setPosition(canvas, topLeft);
    }

    function drawRadar() {
      updateCanvas();
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const center = map.latLngToContainerPoint(RADAR_CENTER);
      const cx = center.x;
      const cy = center.y;

      // Calculate pixel radius based on map zoom
      const edgePoint = L.latLng(
        RADAR_CENTER[0],
        RADAR_CENTER[1] + (RADAR_RADIUS_KM / 111.32) / Math.cos(RADAR_CENTER[0] * Math.PI / 180)
      );
      const edgePx = map.latLngToContainerPoint(edgePoint);
      const radius = Math.abs(edgePx.x - cx);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Range rings (electric blue)
      for (let i = 1; i <= 4; i++) {
        const r = radius * (i / 4);
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(59, 130, 246, ${0.15 + i * 0.05})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Crosshairs
      ctx.strokeStyle = "rgba(59, 130, 246, 0.1)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, cy - radius);
      ctx.lineTo(cx, cy + radius);
      ctx.moveTo(cx - radius, cy);
      ctx.lineTo(cx + radius, cy);
      ctx.stroke();

      // Sweep cone
      const angle = sweepAngle.current;
      const grad = ctx.createConicGradient(angle, cx, cy);
      grad.addColorStop(0, "rgba(34, 197, 94, 0.25)");
      grad.addColorStop(0.08, "rgba(34, 197, 94, 0.08)");
      grad.addColorStop(0.15, "rgba(34, 197, 94, 0)");
      grad.addColorStop(1, "rgba(34, 197, 94, 0)");

      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Sweep line
      const lineEndX = cx + Math.cos(angle) * radius;
      const lineEndY = cy + Math.sin(angle) * radius;
      const lineGrad = ctx.createLinearGradient(cx, cy, lineEndX, lineEndY);
      lineGrad.addColorStop(0, "rgba(34, 197, 94, 0.9)");
      lineGrad.addColorStop(1, "rgba(34, 197, 94, 0)");
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(lineEndX, lineEndY);
      ctx.strokeStyle = lineGrad;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Center dot
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(59, 130, 246, 0.8)";
      ctx.fill();

      sweepAngle.current += 0.02;
      animRef.current = requestAnimationFrame(drawRadar);
    }

    drawRadar();
    map.on("move zoom resize", drawRadar);

    return () => {
      cancelAnimationFrame(animRef.current);
      map.off("move zoom resize", drawRadar);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, [map]);

  // Add airplane markers
  useEffect(() => {
    const markers: L.Marker[] = [];

    mapContacts.forEach((c) => {
      const pos = contactLatLng[c.id];
      if (!pos) return;
      const color = contactColor[c.type] || "#fff";
      const icon = createAirplaneIcon(color);
      const marker = L.marker(pos, { icon }).addTo(map);

      const tooltipContent = `<div style="font-family:monospace;font-size:10px;color:${color};text-shadow:0 0 6px ${color}">
        ${c.label || c.id}${c.speed ? ` · ${c.speed}` : ""}
      </div>`;
      marker.bindTooltip(tooltipContent, {
        permanent: true,
        direction: "bottom",
        offset: [0, 8],
        className: "contact-tooltip",
      });

      markers.push(marker);
    });

    return () => {
      markers.forEach((m) => m.remove());
    };
  }, [map]);

  return null;
}

export function MainMapDisplay() {
  return (
    <div className="flex-1 relative overflow-hidden">
      <StatusSelector />

      {/* Scanline overlay */}
      <div className="absolute inset-0 scanline pointer-events-none z-[1000]" />

      {/* Map */}
      <MapContainer
        center={RADAR_CENTER}
        zoom={7}
        minZoom={4}
        maxZoom={14}
        zoomControl={false}
        attributionControl={false}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        dragging={true}
        style={{ width: "100%", height: "100%", background: "hsl(222 25% 8%)" }}
        className="radar-map"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          opacity={0.5}
        />
        <RadarOverlay />
      </MapContainer>

      {/* EOIR thumbnail */}
      <div className="absolute top-4 right-[32%] border border-border rounded panel-bg p-1.5 box-glow-blue z-[1001]">
        <div className="w-28 h-16 bg-muted rounded flex items-center justify-center">
          <span className="text-[8px] text-success glow-green">EOIR-01 THERMAL · LIVE</span>
        </div>
        <div className="text-[8px] text-primary text-center mt-1 glow-blue">LOCK TRK HTL-01</div>
      </div>

      {/* Mode badge */}
      <div className="absolute top-4 right-[18%] border border-primary/50 rounded px-4 py-1 box-glow-blue z-[1001]">
        <span className="text-[10px] text-primary glow-blue tracking-[0.2em]">MODE: SURVEILLANCE</span>
      </div>

      {/* Bottom coords */}
      <div className="absolute bottom-0 left-0 right-0 h-7 border-t border-border panel-bg flex items-center px-3 gap-6 z-[1001]">
        <span className="text-[9px] text-muted-foreground">LAT 54.218°N</span>
        <span className="text-[9px] text-muted-foreground">LON 003.847°E</span>
        <span className="text-[9px] text-muted-foreground">ALT SL</span>
      </div>
    </div>
  );
}
