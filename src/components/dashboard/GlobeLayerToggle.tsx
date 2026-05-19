import { useRef, useState, useEffect } from "react";
import { useSensorNodes, SensorCategory } from "@/context/SensorNodesContext";
import { Radar, Eye, Plane, Antenna, Layers, GripVertical } from "lucide-react";

const ITEMS: { key: SensorCategory; label: string; color: string; Icon: any }[] = [
  { key: "radar",     label: "RADAR",   color: "#3da9fc", Icon: Radar },
  { key: "eoir",      label: "EO/IR",   color: "#3df0a7", Icon: Eye },
  { key: "ais",       label: "AIS",     color: "#f0a93d", Icon: Plane },
  { key: "passiveRf", label: "PASS-RF", color: "#d83df0", Icon: Antenna },
];

export function GlobeLayerToggle() {
  const { visible, toggleCategory, nodes } = useSensorNodes();
  const [pos, setPos] = useState<{ x: number; y: number }>(() => {
    try {
      const raw = localStorage.getItem("globe-layer-toggle-pos");
      if (raw) return JSON.parse(raw);
    } catch {}
    return { x: 12, y: 12 };
  });
  const dragRef = useRef<{ dx: number; dy: number } | null>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      setPos({
        x: Math.max(0, e.clientX - dragRef.current.dx),
        y: Math.max(0, e.clientY - dragRef.current.dy),
      });
    };
    const onUp = () => {
      if (dragRef.current) {
        dragRef.current = null;
        try { localStorage.setItem("globe-layer-toggle-pos", JSON.stringify(pos)); } catch {}
      }
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [pos]);

  const onDragStart = (e: React.MouseEvent) => {
    dragRef.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y };
  };

  return (
    <div
      className="absolute z-[5] panel-bg border border-border rounded-md backdrop-blur-sm shadow-lg w-[160px] select-none"
      style={{ left: pos.x, top: pos.y }}
    >
      <div
        onMouseDown={onDragStart}
        className="flex items-center gap-1.5 px-2 py-1.5 border-b border-border/50 cursor-move"
        title="Drag to move"
      >
        <GripVertical size={11} className="text-muted-foreground" />
        <Layers size={11} className="text-primary" />
        <span className="text-[9px] font-display tracking-[0.18em] text-primary">LAYERS</span>
      </div>
      <div className="space-y-1 p-2">
        {ITEMS.map(({ key, label, color, Icon }) => {
          const on = visible[key];
          return (
            <button
              key={key}
              onClick={() => toggleCategory(key)}
              className={`w-full flex items-center gap-2 px-1.5 py-1 rounded text-[9px] font-display tracking-[0.12em] transition-all border ${
                on ? "bg-foreground/5 border-border/60" : "opacity-40 hover:opacity-70 border-transparent"
              }`}
              style={on ? { color, boxShadow: `inset 0 0 0 1px ${color}33` } : { color: "#94a3b8" }}
              title={on ? `Hide ${label}` : `Show ${label}`}
            >
              <Icon size={11} />
              <span className="flex-1 text-left">{label}</span>
              <span className="text-[8px] opacity-70">{nodes[key].length}</span>
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: color, boxShadow: on ? `0 0 5px ${color}` : "none", opacity: on ? 1 : 0.4 }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
