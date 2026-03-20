import { selectedTarget } from "@/data/mockData";
import { PanelBox } from "./PanelBox";

export function SelectedTargetPanel() {
  return (
    <PanelBox>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-primary">+</span>
          <span className="text-sm font-display font-bold text-destructive text-glow-red tracking-wider">
            {selectedTarget.id}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px]">
          <span className="text-muted-foreground">BRG</span>
          <span className="text-foreground">{selectedTarget.bearing}</span>
          <span className="text-muted-foreground">SPD</span>
          <span className="text-foreground">{selectedTarget.speed}</span>
          <span className="text-muted-foreground">POS</span>
          <span className="text-foreground">{selectedTarget.coords}</span>
        </div>

        <div className="border border-destructive/50 px-2 py-1">
          <span className="text-[11px] text-destructive text-glow-red font-bold tracking-wider">
            {selectedTarget.classification}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px]">
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
