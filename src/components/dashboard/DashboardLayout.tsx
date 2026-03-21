import { TopStatusHeader } from "./TopStatusHeader";
import { SidebarLeft } from "./SidebarLeft";
import { MainMapDisplay } from "./MainMapDisplay";
import { SidebarRight } from "./SidebarRight";
import { BottomStatusBar } from "./BottomStatusBar";
import { SelectedContactProvider } from "@/context/SelectedContactContext";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

export function DashboardLayout() {
  return (
    <SelectedContactProvider>
      <div className="h-screen flex flex-col overflow-hidden">
        <TopStatusHeader />
        <div className="flex-1 min-h-0">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={18} minSize={12} maxSize={30}>
              <SidebarLeft />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={52} minSize={30}>
              <MainMapDisplay />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={30} minSize={15} maxSize={40}>
              <SidebarRight />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
        <BottomStatusBar />
      </div>
    </SelectedContactProvider>
  );
}
