import { TopStatusHeader } from "./TopStatusHeader";
import { MainMapDisplay } from "./MainMapDisplay";
import { BottomStatusBar } from "./BottomStatusBar";

import { LayoutSettingsPanel } from "./LayoutSettingsPanel";
import { FloatingPanels } from "./FloatingPanels";
import { SelectedContactProvider } from "@/context/SelectedContactContext";
import { DashboardLayoutProvider, useDashboardLayout } from "@/context/DashboardLayoutContext";

function DashboardContent() {
  const { isVisible } = useDashboardLayout();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {isVisible("top-header") && <TopStatusHeader />}
      <div className="flex-1 min-h-0 relative">
        <MainMapDisplay />
        <FloatingPanels />
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
