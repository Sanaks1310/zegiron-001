import { selectedTarget } from "@/data/mockData";
import { PanelBox } from "./PanelBox";

export function SelectedTargetPanel() {
  return (
    <PanelBox>
      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          <span className="text-primary glow-blue text-sm">+</span>
          <span className="text-base font-display font-bold text-destructive glow-magenta tracking-[0.15em]">
            {selectedTarget.id}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[10px]">
          <span className="text-primary glow-blue font-display tracking-wider">BRG</span>
          <span className="text-foreground">{selectedTarget.bearing}</span>
          <span className="text-primary glow-blue font-display tracking-wider">SPD</span>
          <span className="text-foreground">{selectedTarget.speed}</span>
          <span className="text-primary glow-blue font-display tracking-wider">POS</span>
          <span className="text-foreground">{selectedTarget.coords}</span>
        </div>

        <div className="border border-destructive/40 rounded px-2.5 py-1.5 box-glow-magenta">
          <span className="text-[11px] text-destructive glow-magenta font-bold tracking-[0.15em]">
            {selectedTarget.classification}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[10px]">
          <span className="text-muted-foreground">TIME</span>
          <span className="text-foreground">{selectedTarget.time}</span>
          <span className="text-muted-foreground">FIRST DETECT</span>
          <span className="text-foreground">{selectedTarget.firstDetect}</span>
          <span className="text-muted-foreground">LAST UPDATE</span>
          <span className="text-foreground">{selectedTarget.lastUpdate}</span>
          <span className="text-muted-foreground">CAT</span>
          <span className="text-foreground">{selectedTarget.category}</span>
        </div>
      </div>
    </PanelBox>
  );
}
