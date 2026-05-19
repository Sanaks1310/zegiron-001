import { PanelBox } from "./PanelBox";
import { Activity } from "lucide-react";
import { useSensorNodes } from "@/context/SensorNodesContext";
import { useMemo } from "react";

export function SensorFusionPanel() {
  const { nodes, visible, selectedSensor } = useSensorNodes();

  const rows = useMemo(() => {
    const counts = {
      radar: nodes.radar.length,
      eoir: nodes.eoir.length,
      ais: nodes.ais.length,
      passiveRf: nodes.passiveRf.length,
    };
    const max = Math.max(1, ...Object.values(counts));
    const pct = (n: number, on: boolean) => Math.round(((on ? n : 0) / max) * 100);
    return [
      { label: "RADAR", value: pct(counts.radar, visible.radar), color: "from-primary to-accent", glow: "#3da9fc" },
      { label: "EO/IR", value: pct(counts.eoir, visible.eoir),  color: "from-success to-success", glow: "#3df0a7" },
      { label: "AIS",   value: pct(counts.ais, visible.ais),    color: "from-warning to-warning", glow: "#f0a93d" },
      { label: "PASS",  value: pct(counts.passiveRf, visible.passiveRf), color: "from-accent to-primary", glow: "#d83df0" },
    ];
  }, [nodes, visible]);

  return (
    <PanelBox title="SENSOR FUSION" icon={<Activity size={12} />}>
      <div className="space-y-2">
        {rows.map((s) => {
          const highlight = selectedSensor && (
            (s.label === "RADAR" && selectedSensor.category === "radar") ||
            (s.label === "EO/IR" && selectedSensor.category === "eoir") ||
            (s.label === "AIS"   && selectedSensor.category === "ais") ||
            (s.label === "PASS"  && selectedSensor.category === "passiveRf")
          );
          return (
            <div key={s.label} className="flex items-center gap-2">
              <span
                className="text-[9px] w-10 text-right tracking-wider transition-all"
                style={highlight ? { color: s.glow, textShadow: `0 0 6px ${s.glow}` } : { color: "hsl(var(--foreground))" }}
              >
                {s.label}
              </span>
              <div className="flex-1 h-2.5 bg-muted rounded overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${s.color} rounded transition-all duration-500`}
                  style={{ width: `${s.value}%`, boxShadow: highlight ? `0 0 8px ${s.glow}` : undefined }}
                />
              </div>
              <span className="text-[9px] text-primary glow-blue w-7 font-display">{s.value}%</span>
            </div>
          );
        })}
      </div>
    </PanelBox>
  );
}
