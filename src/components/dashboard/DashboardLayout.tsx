import { TopStatusHeader } from "./TopStatusHeader";
import { MainMapDisplay } from "./MainMapDisplay";
import { BottomStatusBar } from "./BottomStatusBar";
import { SpectrogramBar } from "./SpectrogramBar";

import { LayoutSettingsPanel } from "./LayoutSettingsPanel";
import { FloatingPanels } from "./FloatingPanels";
import { MapLegend } from "./MapLegend";
import { SelectedContactProvider } from "@/context/SelectedContactContext";
import { DashboardLayoutProvider, useDashboardLayout } from "@/context/DashboardLayoutContext";

import { SensorNodesProvider } from "@/context/SensorNodesContext";

function DashboardContent() {
  const { isVisible } = useDashboardLayout();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {isVisible("top-header") && <TopStatusHeader />}
      <div className="flex-1 min-h-0 relative">
        <MainMapDisplay />
        <MapLegend />
        <FloatingPanels />
      </div>
      <div className="h-10 shrink-0 border-t border-border bg-card/80">
        <SpectrogramBar />
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
        <SensorNodesProvider>
          <DashboardContent />
        </SensorNodesProvider>
      </DashboardLayoutProvider>
    </SelectedContactProvider>
  );
}

