import { sensorNodes } from "@/data/mockData";
import { PanelBox } from "./PanelBox";

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    operational: "bg-primary",
    fault: "bg-destructive animate-pulse-glow",
    monitoring: "bg-primary animate-pulse-soft",
  };
  return <span className={`w-2 h-2 rounded-full shrink-0 ${colors[status] || "bg-muted-foreground"}`} />;
}

function SensorItem({
  id, label, range, status, vessels, coords,
}: {
  id: string; label: string; range?: string; status: string; vessels?: number; coords?: string;
}) {
  const isFault = status === "fault";
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border/40 last:border-0 hover-glow rounded px-1 cursor-default">
      <div className="flex items-center gap-2">
        <StatusDot status={status} />
        <div>
          <span className="text-[11px] text-foreground">
            {id}{label ? ` · ${label}` : ""}
          </span>
          {coords && <div className="text-[9px] text-muted-foreground">{coords}</div>}
        </div>
      </div>
      <div className="text-right">
        {isFault && (
          <span className="text-[10px] text-destructive glow-magenta font-bold">LINK FAULT</span>
        )}
        {range && !isFault && (
          <span className="text-[10px] text-primary glow-blue">{range}</span>
        )}
        {vessels !== undefined && (
          <span className="text-[10px] text-warning glow-orange font-bold">{vessels} VESSELS</span>
        )}
        {status === "monitoring" && (
          <span className="text-[10px] text-primary">MONITORING</span>
        )}
      </div>
    </div>
  );
}

export function SensorNodesPanel() {
  return (
    <div className="space-y-2">
      <div className="px-3 py-1.5">
        <span className="text-[11px] text-primary glow-blue font-bold tracking-[0.15em] font-display">
          SENSOR NODES: <span className="text-success glow-green">12 ONLINE</span>
        </span>
      </div>

      <PanelBox title="RADAR">
        {sensorNodes.radar.map((s) => (
          <SensorItem key={s.id} {...s} />
        ))}
      </PanelBox>

      <PanelBox title="EO/IR">
        {sensorNodes.eoir.map((s) => (
          <SensorItem key={s.id} {...s} />
        ))}
      </PanelBox>

      <PanelBox title="AIS">
        {sensorNodes.ais.map((s) => (
          <SensorItem key={s.id} id={s.id} label={s.label} vessels={s.vessels} status={s.status} />
        ))}
      </PanelBox>

      <PanelBox title="PASSIVE-RF">
        {sensorNodes.passiveRf.map((s) => (
          <SensorItem key={s.id} id={s.id} label="" coords={s.coords} status={s.status} />
        ))}
      </PanelBox>
    </div>
  );
}
