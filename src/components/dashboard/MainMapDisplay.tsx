import { useState, useCallback, useRef } from "react";
import { StatusSelector } from "./StatusSelector";
import { FlightTrails } from "./FlightTrails";
import { ThreatRadius } from "./ThreatRadius";
import { useSelectedContact } from "@/context/SelectedContactContext";
import { useAnimatedContacts } from "@/hooks/useAnimatedContacts";
import { motion } from "framer-motion";
import { Plane, Ship, HelpCircle, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import worldMapImg from "@/assets/world-map-clean.png";

const contactIconMap: Record<string, typeof Plane> = {
  hostile: Plane,
  unknown: HelpCircle,
  friendly: Ship,
};

const contactColor: Record<string, string> = {
  hostile: "text-destructive",
  unknown: "text-warning",
  friendly: "text-primary",
};

const contactGlow: Record<string, string> = {
  hostile: "drop-shadow-[0_0_6px_hsl(338_90%_56%/0.8)]",
  unknown: "drop-shadow-[0_0_6px_hsl(32_95%_55%/0.7)]",
  friendly: "drop-shadow-[0_0_6px_hsl(217_95%_58%/0.6)]",
};

const contactRing: Record<string, string> = {
  hostile: "ring-destructive",
  unknown: "ring-warning",
  friendly: "ring-primary",
};

export function MainMapDisplay() {
  const { selected, setSelected } = useSelectedContact();
  const contacts = useAnimatedContacts();
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });
  const panOrigin = useRef({ x: 0, y: 0 });

  const zoomIn = useCallback(() => setZoom(z => Math.min(z + 0.3, 4)), []);
  const zoomOut = useCallback(() => setZoom(z => {
    const next = Math.max(z - 0.3, 0.5);
    if (next <= 1) setPan({ x: 0, y: 0 });
    return next;
  }), []);
  const resetZoom = useCallback(() => { setZoom(1); setPan({ x: 0, y: 0 }); }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (zoom <= 1) return;
    isPanning.current = true;
    panStart.current = { x: e.clientX, y: e.clientY };
    panOrigin.current = { ...pan };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [zoom, pan]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isPanning.current) return;
    const dx = e.clientX - panStart.current.x;
    const dy = e.clientY - panStart.current.y;
    const maxPan = (zoom - 1) * 150;
    setPan({
      x: Math.max(-maxPan, Math.min(maxPan, panOrigin.current.x + dx)),
      y: Math.max(-maxPan, Math.min(maxPan, panOrigin.current.y + dy)),
    });
  }, [zoom]);

  const handlePointerUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.15 : 0.15;
    setZoom(z => {
      const next = Math.max(0.5, Math.min(4, z + delta));
      if (next <= 1) setPan({ x: 0, y: 0 });
      return next;
    });
  }, []);

  return (
    <div className="flex-1 relative overflow-hidden h-full bg-card">
      {/* Map grid background */}
      <div className="absolute inset-0 z-0" style={{
        backgroundImage: `
          linear-gradient(hsl(217 95% 58% / 0.04) 1px, transparent 1px),
          linear-gradient(90deg, hsl(217 95% 58% / 0.04) 1px, transparent 1px),
          linear-gradient(hsl(217 95% 58% / 0.08) 1px, transparent 1px),
          linear-gradient(90deg, hsl(217 95% 58% / 0.08) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px, 20px 20px, 100px 100px, 100px 100px',
      }} />

      <StatusSelector />

      {/* Scanline overlay */}
      <div className="absolute inset-0 scanline pointer-events-none z-[1]" />

      {/* Radar area with world map image inside */}
      <div className="absolute inset-0 flex items-center justify-center z-[1] pointer-events-none">
        <div className="relative" style={{ width: "min(90vw, 90vh, 620px)", height: "min(90vw, 90vh, 620px)" }}>
          {/* Outer decorative ring with tick marks */}
          <svg className="absolute -inset-3 w-[calc(100%+24px)] h-[calc(100%+24px)]" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="98" fill="none" stroke="hsl(145 60% 40% / 0.3)" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="95" fill="none" stroke="hsl(145 60% 40% / 0.2)" strokeWidth="0.3" />
            {Array.from({ length: 72 }).map((_, i) => {
              const angle = (i * 5 * Math.PI) / 180;
              const isMajor = i % 6 === 0;
              const r1 = isMajor ? 91 : 93;
              const r2 = 96;
              return (
                <line
                  key={i}
                  x1={100 + r1 * Math.cos(angle)}
                  y1={100 + r1 * Math.sin(angle)}
                  x2={100 + r2 * Math.cos(angle)}
                  y2={100 + r2 * Math.sin(angle)}
                  stroke={`hsl(145 60% 45% / ${isMajor ? 0.5 : 0.25})`}
                  strokeWidth={isMajor ? 0.8 : 0.4}
                />
              );
            })}
            <text x="100" y="12" fill="hsl(145 60% 45% / 0.5)" fontSize="5" fontFamily="monospace" textAnchor="middle">N</text>
            <text x="100" y="195" fill="hsl(145 60% 45% / 0.5)" fontSize="5" fontFamily="monospace" textAnchor="middle">S</text>
            <text x="8" y="102" fill="hsl(145 60% 45% / 0.5)" fontSize="5" fontFamily="monospace" textAnchor="middle">W</text>
            <text x="192" y="102" fill="hsl(145 60% 45% / 0.5)" fontSize="5" fontFamily="monospace" textAnchor="middle">E</text>
          </svg>

          {/* Clipped radar content inside the circle */}
          <div className="absolute inset-0 rounded-full overflow-hidden" style={{
            boxShadow: "inset 0 0 60px hsl(145 60% 30% / 0.15), 0 0 40px hsl(145 60% 40% / 0.1)",
            backgroundColor: "#000",
          }}>
            {/* Zoomable container - map + contacts scale together */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transition: isPanning.current ? "none" : "transform 0.3s ease-out",
                cursor: zoom > 1 ? (isPanning.current ? "grabbing" : "grab") : "default",
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onWheel={handleWheel}
              onPointerCancel={handlePointerUp}
            >
              {/* World map image background */}
              <img
                src={worldMapImg}
                alt="World Map"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: "brightness(0.9) saturate(1.1)" }}
                draggable={false}
              />

              {/* Geographic grid lines overlay */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 360 180" preserveAspectRatio="none">
                {/* Latitude lines every 30° with labels */}
                {[
                  { y: 30, label: "60°N" },
                  { y: 60, label: "30°N" },
                  { y: 90, label: "0°" },
                  { y: 120, label: "30°S" },
                  { y: 150, label: "60°S" },
                ].map(({ y, label }) => (
                  <g key={`lat-${y}`}>
                    <line x1="0" y1={y} x2="360" y2={y}
                      stroke="hsl(145 60% 45% / 0.12)" strokeWidth="0.3" strokeDasharray="2 2" />
                    <text x="4" y={y - 1.5} fill="hsl(145 60% 55% / 0.5)" fontSize="4" fontFamily="monospace">{label}</text>
                  </g>
                ))}
                {/* Longitude lines every 30° with labels */}
                {[
                  { x: 30, label: "150°W" },
                  { x: 60, label: "120°W" },
                  { x: 90, label: "90°W" },
                  { x: 120, label: "60°W" },
                  { x: 150, label: "30°W" },
                  { x: 180, label: "0°" },
                  { x: 210, label: "30°E" },
                  { x: 240, label: "60°E" },
                  { x: 270, label: "90°E" },
                  { x: 300, label: "120°E" },
                  { x: 330, label: "150°E" },
                ].map(({ x, label }) => (
                  <g key={`lon-${x}`}>
                    <line x1={x} y1="0" x2={x} y2="180"
                      stroke="hsl(145 60% 45% / 0.12)" strokeWidth="0.3" strokeDasharray="2 2" />
                    <text x={x + 1} y="8" fill="hsl(145 60% 55% / 0.5)" fontSize="3.5" fontFamily="monospace">{label}</text>
                  </g>
                ))}
                {/* Equator */}
                <line x1="0" y1="90" x2="360" y2="90" stroke="hsl(145 60% 45% / 0.2)" strokeWidth="0.4" />
                {/* Prime meridian */}
                <line x1="180" y1="0" x2="180" y2="180" stroke="hsl(145 60% 45% / 0.2)" strokeWidth="0.4" />
                {/* Tropics */}
                <line x1="0" y1="66.5" x2="360" y2="66.5" stroke="hsl(145 60% 45% / 0.08)" strokeWidth="0.3" strokeDasharray="4 3" />
                <line x1="0" y1="113.5" x2="360" y2="113.5" stroke="hsl(145 60% 45% / 0.08)" strokeWidth="0.3" strokeDasharray="4 3" />
              </svg>


              {/* Contacts inside zoomable area */}
              <div className="absolute inset-0 pointer-events-auto">
                <ThreatRadius contacts={contacts} radius={5} />
                <FlightTrails contacts={contacts} />
                {contacts.map((c) => {
                  const IconComponent = contactIconMap[c.type] || Plane;
                  return (
                    <div
                      key={c.id}
                      className={`absolute flex flex-col items-center gap-0.5 cursor-pointer hover-glow rounded p-1 transition-none -translate-x-1/2 -translate-y-1/2 ${
                        selected.id === c.id ? `ring-2 ${contactRing[c.type]} ring-offset-1 ring-offset-background rounded-lg` : ""
                      }`}
                      style={{ left: `${c.x}%`, top: `${c.y}%` }}
                      onClick={() => setSelected(c)}
                    >
                      <IconComponent
                        size={14}
                        className={`${contactColor[c.type]} ${contactGlow[c.type]} ${
                          selected.id === c.id ? "animate-pulse" : ""
                        } ${c.type === "hostile" ? "rotate-45" : ""}`}
                        fill="currentColor"
                      />
                      <span className="text-[8px] text-foreground whitespace-nowrap tracking-wide">
                        {c.label || c.id}{c.speed ? ` · ${c.speed}` : ""}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Green tint overlay (scales with map) */}
              <div className="absolute inset-0 bg-[hsl(145_40%_20%/0.1)] mix-blend-overlay pointer-events-none" />
            </div>

            {/* Vignette (fixed) */}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: "radial-gradient(circle, transparent 40%, hsl(0 0% 0% / 0.4) 80%, hsl(0 0% 0% / 0.8) 100%)"
            }} />
            {/* Range rings (fixed, inside clip) */}
            <div className="absolute inset-0 border-2 border-[hsl(145_60%_40%/0.3)] rounded-full pointer-events-none" />
            <div className="absolute inset-[20%] border border-[hsl(145_60%_40%/0.2)] rounded-full pointer-events-none" />
            <div className="absolute inset-[40%] border border-[hsl(145_60%_40%/0.15)] rounded-full pointer-events-none" />
            <div className="absolute inset-[60%] border border-[hsl(145_60%_40%/0.1)] rounded-full pointer-events-none" />

            {/* Crosshairs (fixed, inside clip) */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[hsl(145_60%_40%/0.12)] pointer-events-none" />
            <div className="absolute top-1/2 left-0 right-0 h-px bg-[hsl(145_60%_40%/0.12)] pointer-events-none" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full h-px bg-[hsl(145_60%_40%/0.06)] rotate-45" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full h-px bg-[hsl(145_60%_40%/0.06)] -rotate-45" />
            </div>

            {/* Radar sweep (fixed, inside clip) */}
            <div
              className="absolute inset-0 animate-radar-sweep pointer-events-none"
              style={{
                background: "conic-gradient(from 0deg, hsl(145 85% 50% / 0.25) 0deg, hsl(145 85% 50% / 0.08) 25deg, transparent 45deg, transparent 360deg)",
                borderRadius: "50%",
              }}
            />

            {/* Sweep line (fixed, inside clip) */}
            <div className="absolute inset-0 animate-radar-sweep origin-center pointer-events-none">
              <div
                className="absolute left-1/2 bottom-1/2 w-1/2 h-0.5"
                style={{
                  background: "linear-gradient(90deg, hsl(145 85% 50% / 0.9), transparent)",
                  transformOrigin: "left center",
                }}
              />
            </div>

            {/* Center dot (fixed, inside clip) */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[hsl(145_60%_45%/0.6)] pointer-events-none" style={{
              boxShadow: "0 0 8px hsl(145 60% 45% / 0.4)"
            }} />
          </div>
        </div>
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-10 right-4 flex flex-col gap-1 z-[4] pointer-events-auto items-center">
        <span className="text-[10px] font-mono text-primary mb-0.5">{zoom.toFixed(1)}x</span>
        <button
          onClick={zoomIn}
          className="w-8 h-8 rounded border border-border panel-bg flex items-center justify-center hover:bg-muted transition-colors"
          title="Zoom In"
        >
          <ZoomIn size={14} className="text-primary" />
        </button>
        <button
          onClick={zoomOut}
          className="w-8 h-8 rounded border border-border panel-bg flex items-center justify-center hover:bg-muted transition-colors"
          title="Zoom Out"
        >
          <ZoomOut size={14} className="text-primary" />
        </button>
        <button
          onClick={resetZoom}
          className="w-8 h-8 rounded border border-border panel-bg flex items-center justify-center hover:bg-muted transition-colors"
          title="Reset Zoom"
        >
          <RotateCcw size={12} className="text-muted-foreground" />
        </button>
      </div>

      {/* EOIR thumbnail */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="absolute top-3 right-[32%] border border-border rounded panel-bg p-1 box-glow-blue z-[2]"
      >
        <div className="w-24 h-14 bg-muted rounded flex items-center justify-center">
          <span className="text-[7px] text-success glow-green">EOIR-01 THERMAL · LIVE</span>
        </div>
        <div className="text-[7px] text-primary text-center mt-0.5 glow-blue">LOCK TRK HTL-01</div>
      </motion.div>

      {/* Mode badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="absolute top-3 right-[18%] border border-primary/50 rounded px-3 py-1 box-glow-blue z-[2]"
      >
        <span className="text-[9px] text-primary glow-blue tracking-[0.2em]">MODE: SURVEILLANCE</span>
      </motion.div>

      {/* Bottom coords */}
      <div className="absolute bottom-0 left-0 right-0 h-6 border-t border-border panel-bg flex items-center px-3 gap-6 z-[3]">
        <span className="text-[8px] text-muted-foreground">LAT 54.218°N</span>
        <span className="text-[8px] text-muted-foreground">LON 003.847°E</span>
        <span className="text-[8px] text-muted-foreground">ALT SL</span>
      </div>
    </div>
  );
}
