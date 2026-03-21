import { SensorNodesPanel } from "./SensorNodesPanel";
import { TrackSummaryPanel } from "./TrackSummaryPanel";
import { motion } from "framer-motion";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

export function SidebarLeft() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="h-full border-r border-border panel-bg flex flex-col"
    >
      <ResizablePanelGroup direction="vertical" className="flex-1">
        <ResizablePanel defaultSize={70} minSize={30}>
          <div className="h-full overflow-y-auto p-2">
            <SensorNodesPanel />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={30} minSize={15}>
          <div className="h-full overflow-y-auto p-2">
            <TrackSummaryPanel />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </motion.div>
  );
}
