import React, { useState, useRef, useCallback } from "react";
import { X, GripHorizontal } from "lucide-react";
import { useDashboardLayout } from "@/context/DashboardLayoutContext";

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
  const dragging = useRef(false);
  const resizing = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const onMouseDownDrag = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };

    const onMove = (ev: MouseEvent) => {
      if (!dragging.current) return;
      const newPos = {
        x: Math.max(0, ev.clientX - offset.current.x),
        y: Math.max(0, ev.clientY - offset.current.y),
      };
      setPos(newPos);
    };
    const onUp = () => {
      dragging.current = false;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      setPos(p => { updatePanelPosition(id, p); return p; });
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, [pos, id, updatePanelPosition]);

  const onMouseDownResize = useCallback((e: React.MouseEvent) => {
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
  }, [size]);

  return (
    <div
      className="fixed z-40 rounded-lg border border-border bg-card/95 backdrop-blur-md shadow-lg flex flex-col overflow-hidden"
      style={{ left: pos.x, top: pos.y, width: size.w, height: size.h }}
    >
      {/* Title bar - draggable */}
      <div
        className="flex items-center justify-between px-2 py-1 bg-muted/50 border-b border-border cursor-grab active:cursor-grabbing select-none shrink-0"
        onMouseDown={onMouseDownDrag}
      >
        <div className="flex items-center gap-1.5">
          <GripHorizontal size={10} className="text-muted-foreground" />
          <span className="text-[9px] font-bold tracking-[0.12em] text-primary font-display">{title}</span>
        </div>
        <button
          onClick={() => toggleVisibility(id)}
          className="p-0.5 rounded hover:bg-destructive/20 transition-colors"
        >
          <X size={10} className="text-muted-foreground hover:text-destructive" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-2">
        {children}
      </div>

      {/* Resize handle */}
      <div
        className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize"
        onMouseDown={onMouseDownResize}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" className="absolute bottom-0.5 right-0.5 text-muted-foreground">
          <path d="M9 1L1 9M9 5L5 9" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
    </div>
  );
}
