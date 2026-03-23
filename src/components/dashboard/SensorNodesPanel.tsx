import { sensorNodes } from "@/data/mockData";
import { PanelBox } from "./PanelBox";
import { Radar, Eye, Ship, Radio } from "lucide-react";

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    operational: "bg-primary",
    fault: "bg-destructive animate-pulse-glow",
    monitoring: "bg-primary animate-pulse-soft",
  };
  return <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${colors[status] || "bg-muted-foreground"}`} />;
}

function SensorItem({
  id, label, range, status, vessels, coords,
}: {
  id: string; label: string; range?: string; status: string; vessels?: number; coords?: string;
}) {
  const isFault = status === "fault";
  return (
    <div className="flex items-center justify-between py-1 border-b border-border/30 last:border-0 hover-glow rounded px-1 cursor-default">
      <div className="flex items-center gap-1.5">
        <StatusDot status={status} />
        <div>
          <span className="text-[10px] text-foreground">
            {id}{label ? ` · ${label}` : ""}
          </span>
          {coords && <div className="text-[8px] text-muted-foreground">{coords}</div>}
        </div>
      </div>
      <div className="text-right">
        {isFault && (
          <span className="text-[9px] text-destructive glow-magenta font-bold">FAULT</span>
        )}
        {range && !isFault && (
          <span className="text-[9px] text-primary glow-blue">{range}</span>
        )}
        {vessels !== undefined && (
          <span className="text-[9px] text-warning glow-orange font-bold">{vessels}</span>
        )}
        {status === "monitoring" && (
          <span className="text-[9px] text-primary">MON</span>
        )}
      </div>
    </div>
  );
}

export function SensorNodesPanel() {
  return (
    <div className="space-y-1.5">
      <div className="px-2 py-1">
        <span className="text-[10px] text-primary glow-blue font-bold tracking-[0.15em] font-display">
          SENSOR NODES: <span className="text-success glow-green">12 ONLINE</span>
        </span>
      </div>

      <PanelBox title="RADAR" icon={<Radar size={12} />}>
        {sensorNodes.radar.map((s) => (
          <SensorItem key={s.id} {...s} />
        ))}
      </PanelBox>

      <PanelBox title="EO/IR" icon={<Eye size={12} />}>
        {sensorNodes.eoir.map((s) => (
          <SensorItem key={s.id} {...s} />
        ))}
      </PanelBox>

      <PanelBox title="AIS" icon={<Ship size={12} />}>
        {sensorNodes.ais.map((s) => (
          <SensorItem key={s.id} id={s.id} label={s.label} vessels={s.vessels} status={s.status} />
        ))}
      </PanelBox>

      <PanelBox title="PASSIVE-RF" icon={<Radio size={12} />} defaultCollapsed>
        {sensorNodes.passiveRf.map((s) => (
          <SensorItem key={s.id} id={s.id} label="" coords={s.coords} status={s.status} />
        ))}
      </PanelBox>
    </div>
  );
}
