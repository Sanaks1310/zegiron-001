import { SensorNodesPanel } from "./SensorNodesPanel";
import { TrackSummaryPanel } from "./TrackSummaryPanel";

export function SidebarLeft() {
  return (
    <aside className="w-56 shrink-0 border-r border-border panel-bg flex flex-col overflow-y-auto">
      <div className="flex-1 space-y-1 p-1">
        <SensorNodesPanel />
      </div>
      <div className="p-1 border-t border-border">
        <TrackSummaryPanel />
      </div>
    </aside>
  );
}
