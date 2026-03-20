import { SelectedTargetPanel } from "./SelectedTargetPanel";
import { SensorFusionPanel } from "./SensorFusionPanel";
import { IntelligenceFeed } from "./IntelligenceFeed";

export function SidebarRight() {
  return (
    <aside className="w-60 shrink-0 border-l border-border panel-bg flex flex-col overflow-y-auto p-1 space-y-1">
      <SelectedTargetPanel />
      <SensorFusionPanel />
      <IntelligenceFeed />
    </aside>
  );
}
