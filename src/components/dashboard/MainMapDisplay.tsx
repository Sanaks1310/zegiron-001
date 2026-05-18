import { useCallback, useRef } from "react";
import { StatusSelector } from "./StatusSelector";
import { Globe3D } from "./Globe3D";

import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

export function MainMapDisplay() {
  // Globe handles its own pan/rotate; zoom buttons just nudge altitude via custom event
  const containerRef = useRef<HTMLDivElement>(null);

  const dispatchZoom = useCallback((dir: "in" | "out" | "reset") => {
    window.dispatchEvent(new CustomEvent("globe-zoom", { detail: dir }));
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden bg-[#020912]">
      {/* Tactical grid overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{
        backgroundImage: `
          linear-gradient(hsl(217 95% 58% / 0.04) 1px, transparent 1px),
          linear-gradient(90deg, hsl(217 95% 58% / 0.04) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }} />

      {/* 3D Globe */}
      <Globe3D />

      {/* Scanline */}
      <div className="absolute inset-0 scanline pointer-events-none z-[1]" />

      
      

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none z-[2]" style={{
        background: "radial-gradient(circle, transparent 55%, hsl(0 0% 0% / 0.55) 100%)"
      }} />

      {/* Zoom controls */}
      <div className="absolute bottom-10 right-4 flex flex-col gap-1 z-[4] items-center">
        <button
          onClick={() => dispatchZoom("in")}
          className="w-8 h-8 rounded border border-border panel-bg flex items-center justify-center hover:bg-muted transition-colors"
          title="Zoom In"
        >
          <ZoomIn size={14} className="text-primary" />
        </button>
        <button
          onClick={() => dispatchZoom("out")}
          className="w-8 h-8 rounded border border-border panel-bg flex items-center justify-center hover:bg-muted transition-colors"
          title="Zoom Out"
        >
          <ZoomOut size={14} className="text-primary" />
        </button>
        <button
          onClick={() => dispatchZoom("reset")}
          className="w-8 h-8 rounded border border-border panel-bg flex items-center justify-center hover:bg-muted transition-colors"
          title="Reset View"
        >
          <RotateCcw size={12} className="text-muted-foreground" />
        </button>
      </div>

      {/* Bottom coords */}
      <div className="absolute bottom-0 left-0 right-0 h-6 border-t border-border panel-bg flex items-center px-3 gap-6 z-[3]">
        <span className="text-[8px] text-muted-foreground">GLOBE · WGS-84</span>
        <span className="text-[8px] text-muted-foreground">DRAG TO ROTATE · SCROLL TO ZOOM</span>
      </div>
    </div>
  );
}
