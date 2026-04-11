import { SensorNodesPanel } from "./SensorNodesPanel";
import { SelectedTargetPanel } from "./SelectedTargetPanel";
import { SensorFusionPanel } from "./SensorFusionPanel";
import { IntelligenceFeed } from "./IntelligenceFeed";
import { motion } from "framer-motion";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

export function SidebarRight() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="h-full border-l border-border panel-bg flex flex-col"
    >
      <ResizablePanelGroup direction="vertical" className="flex-1">
        <ResizablePanel defaultSize={25} minSize={10}>
          <div className="h-full overflow-y-auto p-2">
            <SensorNodesPanel />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={30} minSize={15}>
          <div className="h-full overflow-y-auto p-2">
            <SelectedTargetPanel />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={20} minSize={10}>
          <div className="h-full overflow-y-auto p-2">
            <SensorFusionPanel />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={25} minSize={10}>
          <div className="h-full overflow-y-auto p-2">
            <IntelligenceFeed />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </motion.div>
  );
}
