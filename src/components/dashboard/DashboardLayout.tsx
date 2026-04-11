import { TopStatusHeader } from "./TopStatusHeader";
import { MainMapDisplay } from "./MainMapDisplay";
import { SidebarRight } from "./SidebarRight";
import { BottomStatusBar } from "./BottomStatusBar";
import { LayoutSettingsPanel } from "./LayoutSettingsPanel";
import { SelectedContactProvider } from "@/context/SelectedContactContext";
import { DashboardLayoutProvider, useDashboardLayout } from "@/context/DashboardLayoutContext";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

function DashboardContent() {
  const { isVisible } = useDashboardLayout();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {isVisible("top-header") && <TopStatusHeader />}
      <div className="flex-1 min-h-0">
        <ResizablePanelGroup direction="horizontal" className="h-full" autoSaveId="main-layout-v2">
          <ResizablePanel defaultSize={65} minSize={40}>
            {isVisible("radar-map") ? <MainMapDisplay /> : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-xs">
                Radar Map Hidden
              </div>
            )}
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={35} minSize={18} maxSize={50}>
            <SidebarRight />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      {isVisible("bottom-status") && <BottomStatusBar />}
      <LayoutSettingsPanel />
    </div>
  );
}

export function DashboardLayout() {
  return (
    <SelectedContactProvider>
      <DashboardLayoutProvider>
        <DashboardContent />
      </DashboardLayoutProvider>
    </SelectedContactProvider>
  );
}
