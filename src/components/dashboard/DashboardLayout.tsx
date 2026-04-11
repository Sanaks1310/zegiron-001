import { TopStatusHeader } from "./TopStatusHeader";
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
            <ResizablePanel defaultSize={65} minSize={40}>
              <MainMapDisplay />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={35} minSize={18} maxSize={50}>
              <SidebarRight />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
        <BottomStatusBar />
      </div>
    </SelectedContactProvider>
  );
}
