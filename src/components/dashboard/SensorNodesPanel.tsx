import { sensorNodes } from "@/data/mockData";
import { PanelBox } from "./PanelBox";

const statusBadge: Record<string, { text: string; className: string }> = {
  operational: { text: "", className: "bg-success" },
  fault: { text: "LINK FAULT", className: "" },
  monitoring: { text: "MONITORING", className: "" },
};

function SensorItem({
  id, label, range, status, vessels, coords,
}: {
  id: string; label: string; range?: string; status: string; vessels?: number; coords?: string;
}) {
  const isFault = status === "fault";
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
      <div className="flex items-center gap-2">
        <span className={`w-1.5 h-1.5 rounded-full ${isFault ? "bg-destructive" : "bg-success"}`} />
        <div>
          <span className="text-[11px] text-foreground">{id} · {label}</span>
          {coords && <div className="text-[9px] text-muted-foreground">{coords}</div>}
        </div>
      </div>
      <div className="text-right">
        {isFault && <span className="text-[10px] text-destructive text-glow-red font-bold">LINK FAULT</span>}
        {range && !isFault && <span className="text-[10px] text-primary">{range}</span>}
        {vessels !== undefined && <span className="text-[10px] text-warning text-glow-amber">{vessels} VESSELS</span>}
        {status === "monitoring" && <span className="text-[10px] text-primary">MONITORING</span>}
      </div>
    </div>
  );
}

export function SensorNodesPanel() {
  return (
    <div className="space-y-1">
      <div className="px-2 py-1">
        <span className="text-[11px] text-primary text-glow-cyan font-bold tracking-wider">
          SENSOR NODES:<span className="text-success ml-1">12 ONLINE</span>
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
