import { sensorFusion } from "@/data/mockData";
import { PanelBox } from "./PanelBox";

const barColors: Record<string, string> = {
  primary: "from-primary to-accent",
  success: "from-warning to-warning",
  warning: "from-destructive to-destructive",
  accent: "from-accent to-primary",
};

export function SensorFusionPanel() {
  return (
    <PanelBox title="SENSOR FUSION">
      <div className="space-y-2.5">
        {sensorFusion.map((s) => (
          <div key={s.label} className="flex items-center gap-2.5">
            <span className="text-[10px] text-foreground w-10 text-right tracking-wider">{s.label}</span>
            <div className="flex-1 h-3 bg-muted rounded overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${barColors[s.color]} rounded transition-all`}
                style={{ width: `${s.value}%` }}
              />
            </div>
            <span className="text-[10px] text-primary glow-blue w-8 font-display">{s.value}%</span>
          </div>
        ))}
      </div>
    </PanelBox>
  );
}
