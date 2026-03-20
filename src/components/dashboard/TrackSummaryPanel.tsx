import { trackSummary } from "@/data/mockData";
import { PanelBox } from "./PanelBox";

export function TrackSummaryPanel() {
  return (
    <PanelBox title="TRACK SUMMARY">
      <div className="grid grid-cols-2 gap-2">
        <div className="text-center">
          <div className="text-2xl font-display font-bold text-primary text-glow-cyan">
            {trackSummary.total}
          </div>
          <div className="text-[9px] text-muted-foreground">TOTAL</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-display font-bold text-destructive text-glow-red">
            {trackSummary.hostile}
          </div>
          <div className="text-[9px] text-muted-foreground">HOSTILE</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-display font-bold text-warning text-glow-amber">
            {trackSummary.unknown}
          </div>
          <div className="text-[9px] text-muted-foreground">UNKNOWN</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-display font-bold text-success text-glow-green">
            {trackSummary.friendly}
          </div>
          <div className="text-[9px] text-muted-foreground">FRIENDLY</div>
        </div>
      </div>
    </PanelBox>
  );
}
