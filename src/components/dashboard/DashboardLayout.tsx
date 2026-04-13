import { MainMapDisplay } from "./MainMapDisplay";
import { LayoutSettingsPanel } from "./LayoutSettingsPanel";
import { FloatingPanels } from "./FloatingPanels";
import { SelectedContactProvider } from "@/context/SelectedContactContext";
import { DashboardLayoutProvider } from "@/context/DashboardLayoutContext";

function DashboardContent() {
  return (
    <div className="h-screen w-screen overflow-hidden relative bg-background">
      {/* Full-screen map */}
      <MainMapDisplay />
      {/* Floating draggable panels */}
      <FloatingPanels />
      {/* Settings gear */}
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
