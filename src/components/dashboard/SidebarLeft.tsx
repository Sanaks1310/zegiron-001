import { SensorNodesPanel } from "./SensorNodesPanel";
import { TrackSummaryPanel } from "./TrackSummaryPanel";
import { TrackTimeline } from "./TrackTimeline";
import { PanelBox } from "./PanelBox";
import { motion } from "framer-motion";
import { History } from "lucide-react";
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
        <ResizablePanel defaultSize={50} minSize={20}>
          <div className="h-full overflow-y-auto p-2">
            <SensorNodesPanel />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={20} minSize={10}>
          <div className="h-full overflow-y-auto p-2">
            <TrackSummaryPanel />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={30} minSize={15}>
          <div className="h-full overflow-y-auto p-2">
            <PanelBox title="Track History" icon={<History className="w-3.5 h-3.5" />} defaultCollapsed={false}>
              <div className="h-28">
                <TrackTimeline />
              </div>
            </PanelBox>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </motion.div>
  );
}
