import { sensorFusion } from "@/data/mockData";
import { PanelBox } from "./PanelBox";

const barColor: Record<string, string> = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  accent: "bg-accent",
};

export function SensorFusionPanel() {
  return (
    <PanelBox title="SENSOR FUSION">
      <div className="space-y-2">
        {sensorFusion.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground w-10 text-right">{s.label}</span>
            <div className="flex-1 h-2 bg-muted rounded-sm overflow-hidden">
              <div
                className={`h-full ${barColor[s.color]} rounded-sm`}
                style={{ width: `${s.value}%` }}
              />
            </div>
            <span className="text-[9px] text-foreground w-6">{s.value}%</span>
          </div>
        ))}
      </div>
    </PanelBox>
  );
}
