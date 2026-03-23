import { sensorFusion } from "@/data/mockData";
import { PanelBox } from "./PanelBox";
import { Activity } from "lucide-react";

const barColors: Record<string, string> = {
  primary: "from-primary to-accent",
  success: "from-warning to-warning",
  warning: "from-destructive to-destructive",
  accent: "from-accent to-primary",
};

export function SensorFusionPanel() {
  return (
    <PanelBox title="SENSOR FUSION" icon={<Activity size={12} />}>
      <div className="space-y-2">
        {sensorFusion.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <span className="text-[9px] text-foreground w-10 text-right tracking-wider">{s.label}</span>
            <div className="flex-1 h-2.5 bg-muted rounded overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${barColors[s.color]} rounded transition-all`}
                style={{ width: `${s.value}%` }}
              />
            </div>
            <span className="text-[9px] text-primary glow-blue w-7 font-display">{s.value}%</span>
          </div>
        ))}
      </div>
    </PanelBox>
  );
}
