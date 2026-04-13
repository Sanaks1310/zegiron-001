import { useDashboardLayout } from "@/context/DashboardLayoutContext";
import { FloatingPanel } from "./FloatingPanel";
import { SensorNodesPanel } from "./SensorNodesPanel";
import { SelectedTargetPanel } from "./SelectedTargetPanel";
import { SensorFusionPanel } from "./SensorFusionPanel";
import { IntelligenceFeed } from "./IntelligenceFeed";
import { TopStatusHeader } from "./TopStatusHeader";
import { BottomStatusBar } from "./BottomStatusBar";
import { SpectrogramBar } from "./SpectrogramBar";

const floatingPanels: { id: string; title: string; component: React.FC; defaultPos: { x: number; y: number } }[] = [
  { id: "top-header", title: "TOP HEADER", component: TopStatusHeader, defaultPos: { x: 20, y: 20 } },
  { id: "bottom-status", title: "BOTTOM STATUS", component: BottomStatusBar, defaultPos: { x: 20, y: 400 } },
  { id: "spectrogram", title: "SPECTROGRAM", component: SpectrogramBar, defaultPos: { x: 350, y: 400 } },
  { id: "sensor-nodes", title: "SENSOR NODES", component: SensorNodesPanel, defaultPos: { x: 500, y: 20 } },
  { id: "selected-target", title: "SELECTED TARGET", component: SelectedTargetPanel, defaultPos: { x: 500, y: 180 } },
  { id: "sensor-fusion", title: "SENSOR FUSION", component: SensorFusionPanel, defaultPos: { x: 500, y: 340 } },
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
