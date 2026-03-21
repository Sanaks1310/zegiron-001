import { SelectedTargetPanel } from "./SelectedTargetPanel";
import { SensorFusionPanel } from "./SensorFusionPanel";
import { IntelligenceFeed } from "./IntelligenceFeed";
import { motion } from "framer-motion";

export function SidebarRight() {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="w-64 shrink-0 border-l border-border panel-bg flex flex-col overflow-y-auto p-2 space-y-2"
    >
      <SelectedTargetPanel />
      <SensorFusionPanel />
      <IntelligenceFeed />
    </motion.aside>
  );
}
