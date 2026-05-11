import React, { useState, useRef, useCallback } from "react";
import { X, Minus, Maximize2, Minimize2 } from "lucide-react";
import { useDashboardLayout } from "@/context/DashboardLayoutContext";
import { getPanelMeta } from "./panelIcons";

interface FloatingPanelProps {
  id: string;
  title: string;
  children: React.ReactNode;
  defaultPosition?: { x: number; y: number };
}

export function FloatingPanel({ id, title, children, defaultPosition }: FloatingPanelProps) {
  const { toggleVisibility, panelPositions, updatePanelPosition } = useDashboardLayout();
  const stored = panelPositions[id];
  const [pos, setPos] = useState(stored || defaultPosition || { x: 100, y: 100 });
  const [size, setSize] = useState({ w: 320, h: 250 });
  const [minimized, setMinimized] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const dragging = useRef(false);
  const resizing = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const meta = getPanelMeta(id);
  const Icon = meta.icon;

  const onMouseDownDrag = useCallback((e: React.MouseEvent) => {
    if (maximized) return;
    e.preventDefault();
    dragging.current = true;
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };

    const onMove = (ev: MouseEvent) => {
      if (!dragging.current) return;
      setPos({
        x: Math.max(0, ev.clientX - offset.current.x),
        y: Math.max(0, ev.clientY - offset.current.y),
      });
    };
    const onUp = () => {
      dragging.current = false;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      setPos(p => { updatePanelPosition(id, p); return p; });
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, [pos, id, updatePanelPosition, maximized]);

  const onMouseDownResize = useCallback((e: React.MouseEvent) => {
    if (maximized || minimized) return;
    e.preventDefault();
    e.stopPropagation();
    resizing.current = true;
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = size.w;
    const startH = size.h;

    const onMove = (ev: MouseEvent) => {
      if (!resizing.current) return;
      setSize({
        w: Math.max(200, startW + (ev.clientX - startX)),
        h: Math.max(120, startH + (ev.clientY - startY)),
      });
    };
    const onUp = () => {
      resizing.current = false;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, [size, maximized, minimized]);

  const style: React.CSSProperties = maximized
    ? { left: 8, top: 44, right: 8, bottom: 56, width: "auto", height: "auto" }
    : minimized
    ? { left: pos.x, top: pos.y, width: 220, height: "auto" }
    : { left: pos.x, top: pos.y, width: size.w, height: size.h };

  return (
    <div
      className={`fixed z-40 rounded-lg border ${meta.ring} bg-gradient-to-br from-card/95 to-card/85 backdrop-blur-md shadow-2xl shadow-black/40 flex flex-col overflow-hidden ring-1 ring-white/5`}
      style={style}
    >
      {/* Title bar */}
      <div
        className={`flex items-center justify-between px-2 py-1 bg-gradient-to-r from-muted/60 to-muted/30 border-b ${meta.ring} ${maximized ? "" : "cursor-grab active:cursor-grabbing"} select-none shrink-0`}
        onMouseDown={onMouseDownDrag}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <span className={`flex items-center justify-center w-4 h-4 rounded-sm bg-background/60 border ${meta.ring}`}>
            <Icon size={9} className={`${meta.color} ${meta.glow}`} strokeWidth={2.2} />
          </span>
          <span className={`text-[9px] font-bold tracking-[0.12em] ${meta.color} font-display truncate`}>{title}</span>
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); setMaximized(false); setMinimized(m => !m); }}
            className="p-0.5 rounded hover:bg-primary/20 transition-colors"
            title={minimized ? "Restore" : "Minimize"}
          >
            <Minus size={10} className="text-muted-foreground hover:text-primary" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setMinimized(false); setMaximized(m => !m); }}
            className="p-0.5 rounded hover:bg-primary/20 transition-colors"
            title={maximized ? "Restore" : "Maximize"}
          >
            {maximized
              ? <Minimize2 size={10} className="text-muted-foreground hover:text-primary" />
              : <Maximize2 size={10} className="text-muted-foreground hover:text-primary" />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); toggleVisibility(id); }}
            className="p-0.5 rounded hover:bg-destructive/20 transition-colors"
            title="Close"
          >
            <X size={10} className="text-muted-foreground hover:text-destructive" />
          </button>
        </div>
      </div>

      {/* Content */}
      {!minimized && (
        <div className="flex-1 overflow-auto p-2 bg-background/20">
          {children}
        </div>
      )}

      {/* Resize handle */}
      {!minimized && !maximized && (
        <div
          className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize"
          onMouseDown={onMouseDownResize}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" className="absolute bottom-0.5 right-0.5 text-muted-foreground">
            <path d="M9 1L1 9M9 5L5 9" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>
      )}
    </div>
  );
}
