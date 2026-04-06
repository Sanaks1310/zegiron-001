import { SensorNodesPanel } from "./SensorNodesPanel";
import { motion } from "framer-motion";

export function SidebarLeft() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="h-full border-r border-border panel-bg flex flex-col"
    >
      <div className="h-full overflow-y-auto p-2">
        <SensorNodesPanel />
      </div>
    </motion.div>
  );
}
