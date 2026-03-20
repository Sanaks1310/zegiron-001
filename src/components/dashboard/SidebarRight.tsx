import { SelectedTargetPanel } from "./SelectedTargetPanel";
import { SensorFusionPanel } from "./SensorFusionPanel";
import { IntelligenceFeed } from "./IntelligenceFeed";

export function SidebarRight() {
  return (
    <aside className="w-64 shrink-0 border-l border-border panel-bg flex flex-col overflow-y-auto p-2 space-y-2">
      <SelectedTargetPanel />
      <SensorFusionPanel />
      <IntelligenceFeed />
    </aside>
  );
}
