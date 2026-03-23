import { trackSummary } from "@/data/mockData";
import { PanelBox } from "./PanelBox";
import { BarChart3 } from "lucide-react";

const stats = [
  { label: "TOTAL", value: trackSummary.total, className: "text-primary glow-blue" },
  { label: "HOSTILE", value: trackSummary.hostile, className: "text-destructive glow-magenta" },
  { label: "UNKNOWN", value: trackSummary.unknown, className: "text-warning glow-orange" },
  { label: "FRIENDLY", value: trackSummary.friendly, className: "text-success glow-green" },
];

export function TrackSummaryPanel() {
  return (
    <PanelBox title="TRACK SUMMARY" icon={<BarChart3 size={12} />}>
      <div className="grid grid-cols-2 gap-2">
        {stats.map((s) => (
          <div key={s.label} className="text-center hover-glow rounded p-1 cursor-default">
            <div className={`text-xl font-display font-bold ${s.className}`}>{s.value}</div>
            <div className="text-[8px] text-muted-foreground tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>
    </PanelBox>
  );
}
