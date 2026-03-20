import { SensorNodesPanel } from "./SensorNodesPanel";
import { TrackSummaryPanel } from "./TrackSummaryPanel";

export function SidebarLeft() {
  return (
    <aside className="w-60 shrink-0 border-r border-border panel-bg flex flex-col overflow-y-auto">
      <div className="flex-1 space-y-2 p-2">
        <SensorNodesPanel />
      </div>
      <div className="p-2 border-t border-border">
        <TrackSummaryPanel />
      </div>
    </aside>
  );
}
