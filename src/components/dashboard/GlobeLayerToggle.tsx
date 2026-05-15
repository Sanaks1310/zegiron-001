import { useSensorNodes, SensorCategory } from "@/context/SensorNodesContext";
import { Radar, Eye, Plane, Antenna, Layers } from "lucide-react";

const ITEMS: { key: SensorCategory; label: string; color: string; Icon: any }[] = [
  { key: "radar",     label: "RADAR",   color: "#3da9fc", Icon: Radar },
  { key: "eoir",      label: "EO/IR",   color: "#3df0a7", Icon: Eye },
  { key: "ais",       label: "AIS",     color: "#f0a93d", Icon: Plane },
  { key: "passiveRf", label: "PASS-RF", color: "#d83df0", Icon: Antenna },
];

export function GlobeLayerToggle() {
  const { visible, toggleCategory, nodes } = useSensorNodes();

  return (
    <div className="absolute top-3 left-3 z-[5] panel-bg border border-border rounded-md p-2 backdrop-blur-sm shadow-lg w-[150px]">
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-border/50">
        <Layers size={11} className="text-primary" />
        <span className="text-[9px] font-display tracking-[0.18em] text-primary">LAYERS</span>
      </div>
      <div className="space-y-1">
        {ITEMS.map(({ key, label, color, Icon }) => {
          const on = visible[key];
          return (
            <button
              key={key}
              onClick={() => toggleCategory(key)}
              className={`w-full flex items-center gap-2 px-1.5 py-1 rounded text-[9px] font-display tracking-[0.12em] transition-all border ${
                on
                  ? "bg-foreground/5 border-border/60"
                  : "opacity-40 hover:opacity-70 border-transparent"
              }`}
              style={on ? { color, boxShadow: `inset 0 0 0 1px ${color}33` } : { color: "#94a3b8" }}
              title={on ? `Hide ${label}` : `Show ${label}`}
            >
              <Icon size={11} />
              <span className="flex-1 text-left">{label}</span>
              <span className="text-[8px] opacity-70">{nodes[key].length}</span>
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: on ? color : "#475569", boxShadow: on ? `0 0 4px ${color}` : "none" }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
