import { SensorNodesPanel } from "./SensorNodesPanel";
import { SelectedTargetPanel } from "./SelectedTargetPanel";
import { SensorFusionPanel } from "./SensorFusionPanel";
import { IntelligenceFeed } from "./IntelligenceFeed";
import { useDashboardLayout } from "@/context/DashboardLayoutContext";
import { motion } from "framer-motion";

const panelMap: Record<string, React.FC> = {
  "sensor-nodes": SensorNodesPanel,
  "selected-target": SelectedTargetPanel,
  "sensor-fusion": SensorFusionPanel,
  "intel-feed": IntelligenceFeed,
};

export function SidebarRight() {
  const { getSidebarPanels, isVisible } = useDashboardLayout();
  const panels = getSidebarPanels().filter(p => isVisible(p.id));

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="h-full border-l border-border panel-bg flex flex-col overflow-y-auto"
    >
      {panels.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-[10px]">
          No panels visible
        </div>
      ) : (
        panels.map((panel) => {
          const Component = panelMap[panel.id];
          if (!Component) return null;
          return (
            <div key={panel.id} className="p-2 border-b border-border/30 last:border-0">
              <Component />
            </div>
          );
        })
      )}
    </motion.div>
  );
}
