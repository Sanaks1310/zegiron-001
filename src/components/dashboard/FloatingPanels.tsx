import { useDashboardLayout } from "@/context/DashboardLayoutContext";
import { FloatingPanel } from "./FloatingPanel";
import { SensorNodesPanel } from "./SensorNodesPanel";
import { SelectedTargetPanel } from "./SelectedTargetPanel";
import { SensorFusionPanel } from "./SensorFusionPanel";
import { IntelligenceFeed } from "./IntelligenceFeed";

function ModeBadge() {
  return (
    <div className="flex items-center justify-center py-1">
      <span className="text-[9px] text-primary glow-blue tracking-[0.2em]">MODE: SURVEILLANCE</span>
    </div>
  );
}

function EOIRThumbnail() {
  return (
    <div>
      <div className="w-full h-14 bg-muted rounded flex items-center justify-center">
        <span className="text-[7px] text-success glow-green">EOIR-01 THERMAL · LIVE</span>
      </div>
      <div className="text-[7px] text-primary text-center mt-0.5 glow-blue">LOCK TRK HTL-01</div>
    </div>
  );
}

const floatingPanels: { id: string; title: string; component: React.FC; defaultPos: { x: number; y: number } }[] = [
  { id: "mode-badge", title: "MODE", component: ModeBadge, defaultPos: { x: 300, y: 20 } },
  { id: "eoir-thumbnail", title: "EOIR / LOCK TRK", component: EOIRThumbnail, defaultPos: { x: 450, y: 20 } },
  { id: "sensor-nodes", title: "SENSOR NODES", component: SensorNodesPanel, defaultPos: { x: 550, y: 20 } },
  { id: "selected-target", title: "SELECTED TARGET", component: SelectedTargetPanel, defaultPos: { x: 550, y: 180 } },
  { id: "sensor-fusion", title: "SENSOR FUSION", component: SensorFusionPanel, defaultPos: { x: 550, y: 340 } },
  { id: "intel-feed", title: "INTELLIGENCE FEED", component: IntelligenceFeed, defaultPos: { x: 20, y: 200 } },
];

export function FloatingPanels() {
  const { isVisible } = useDashboardLayout();

  return (
    <>
      {floatingPanels.map(({ id, title, component: Component, defaultPos }) =>
        isVisible(id) ? (
          <FloatingPanel key={id} id={id} title={title} defaultPosition={defaultPos}>
            <Component />
          </FloatingPanel>
        ) : null
      )}
    </>
  );
}
