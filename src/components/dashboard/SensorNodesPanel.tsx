import { useState } from "react";
import { PanelBox } from "./PanelBox";
import { Radar, Eye, Ship, Radio, Plus, X } from "lucide-react";
import { useSensorNodes, SensorCategory, SensorEntry } from "@/context/SensorNodesContext";

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    operational: "bg-primary",
    fault: "bg-destructive animate-pulse-glow",
    monitoring: "bg-primary animate-pulse-soft",
  };
  return <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${colors[status] || "bg-muted-foreground"}`} />;
}

function SensorItem({ id, label, range, status, vessels, coords, affiliation }: SensorEntry) {
  const isFault = status === "fault";
  const isHostile = affiliation === "unfriendly";
  return (
    <div className="flex items-center justify-between py-1 border-b border-border/30 last:border-0 hover-glow rounded px-1 cursor-default">
      <div className="flex items-center gap-1.5">
        <StatusDot status={status} />
        <div>
          <span className={`text-[10px] ${isHostile ? "text-destructive" : "text-foreground"}`}>
            {id}{label ? ` · ${label}` : ""}
          </span>
          {coords && <div className="text-[8px] text-muted-foreground">{coords}</div>}
        </div>
      </div>
      <div className="text-right flex flex-col items-end">
        {affiliation && (
          <span className={`text-[8px] font-bold tracking-wider uppercase ${isHostile ? "text-destructive glow-magenta" : "text-warning glow-orange"}`}>
            {isHostile ? "HOSTILE" : "FRIENDLY"}
          </span>
        )}
        {isFault && <span className="text-[9px] text-destructive glow-magenta font-bold">FAULT</span>}
        {range && !isFault && <span className="text-[9px] text-primary glow-blue">{range}</span>}
        {vessels !== undefined && <span className="text-[9px] text-warning glow-orange font-bold">{vessels}</span>}
        {status === "monitoring" && <span className="text-[9px] text-primary">MON</span>}
      </div>
    </div>
  );
}

interface AddFormProps {
  category: SensorCategory;
  onClose: () => void;
}

function AddForm({ category, onClose }: AddFormProps) {
  const { addSensor } = useSensorNodes();
  const [id, setId] = useState("");
  const [label, setLabel] = useState("");
  const [coords, setCoords] = useState("");
  const [extra, setExtra] = useState("");
  const [status, setStatus] = useState<SensorEntry["status"]>("operational");

  const extraLabel =
    category === "ais" ? "Vessels" :
    category === "passiveRf" ? "" :
    "Range";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id.trim()) return;
    const entry: SensorEntry = { id: id.trim(), status };
    if (label.trim()) entry.label = label.trim();
    if (coords.trim()) entry.coords = coords.trim();
    if (category === "ais") {
      const v = parseInt(extra, 10);
      if (!isNaN(v)) entry.vessels = v;
    } else if (extra.trim()) {
      entry.range = extra.trim();
    }
    addSensor(category, entry);
    onClose();
  };

  const inputCls = "w-full bg-background/60 border border-border/60 rounded px-1.5 py-0.5 text-[9px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60";

  return (
    <form onSubmit={handleSubmit} className="space-y-1 px-1 py-1.5 border-t border-border/40 bg-secondary/10 rounded mt-1">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[8px] text-primary tracking-[0.15em] uppercase">Add Entry</span>
        <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X size={10} />
        </button>
      </div>
      <input className={inputCls} placeholder="ID (e.g. RADAR-04)" value={id} onChange={e => setId(e.target.value)} autoFocus />
      <input className={inputCls} placeholder="Label" value={label} onChange={e => setLabel(e.target.value)} />
      <input className={inputCls} placeholder="Coords (e.g. 54.5°N 003.2°E)" value={coords} onChange={e => setCoords(e.target.value)} />
      {extraLabel && (
        <input className={inputCls} placeholder={extraLabel} value={extra} onChange={e => setExtra(e.target.value)} />
      )}
      <select
        value={status}
        onChange={e => setStatus(e.target.value as SensorEntry["status"])}
        className={inputCls}
      >
        <option value="operational">operational</option>
        <option value="monitoring">monitoring</option>
        <option value="fault">fault</option>
      </select>
      <button
        type="submit"
        className="w-full text-[9px] text-primary border border-primary/40 rounded py-0.5 hover:bg-primary/10 transition-colors tracking-wider uppercase"
      >
        + Add to dataset
      </button>
    </form>
  );
}

interface SensorSectionProps {
  title: string;
  icon: React.ReactNode;
  category: SensorCategory;
  defaultCollapsed?: boolean;
}

function SensorSection({ title, icon, category, defaultCollapsed }: SensorSectionProps) {
  const { nodes } = useSensorNodes();
  const [adding, setAdding] = useState(false);

  return (
    <PanelBox title={title} icon={icon} defaultCollapsed={defaultCollapsed}>
      {nodes[category].map((s) => (
        <SensorItem key={s.id} {...s} />
      ))}
      {!adding ? (
        <button
          onClick={() => setAdding(true)}
          className="w-full flex items-center justify-center gap-1 mt-1.5 py-1 border border-dashed border-primary/30 rounded text-[9px] text-primary/70 hover:text-primary hover:border-primary/60 hover:bg-primary/5 transition-colors tracking-wider uppercase"
        >
          <Plus size={10} /> Add {title}
        </button>
      ) : (
        <AddForm category={category} onClose={() => setAdding(false)} />
      )}
    </PanelBox>
  );
}

export function SensorNodesPanel() {
  const { nodes } = useSensorNodes();
  const total = nodes.radar.length + nodes.eoir.length + nodes.ais.length + nodes.passiveRf.length;

  return (
    <div className="space-y-1.5">
      <div className="px-2 py-1">
        <span className="text-[10px] text-primary glow-blue font-bold tracking-[0.15em] font-display">
          SENSOR NODES: <span className="text-success glow-green">{total} ONLINE</span>
        </span>
      </div>

      <SensorSection title="RADAR" icon={<Radar size={12} />} category="radar" />
      <SensorSection title="EO/IR" icon={<Eye size={12} />} category="eoir" />
      <SensorSection title="AIS" icon={<Ship size={12} />} category="ais" />
      <SensorSection title="PASSIVE-RF" icon={<Radio size={12} />} category="passiveRf" defaultCollapsed />
    </div>
  );
}
