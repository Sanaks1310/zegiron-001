import { SensorNodesPanel } from "./SensorNodesPanel";
import { TrackSummaryPanel } from "./TrackSummaryPanel";
import { motion } from "framer-motion";

export function SidebarLeft() {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="w-60 shrink-0 border-r border-border panel-bg flex flex-col overflow-y-auto"
    >
      <div className="flex-1 space-y-2 p-2">
        <SensorNodesPanel />
      </div>
      <div className="p-2 border-t border-border">
        <TrackSummaryPanel />
      </div>
    </motion.aside>
  );
}
