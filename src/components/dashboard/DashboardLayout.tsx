import { TopStatusHeader } from "./TopStatusHeader";
import { SidebarLeft } from "./SidebarLeft";
import { MainMapDisplay } from "./MainMapDisplay";
import { SidebarRight } from "./SidebarRight";
import { BottomStatusBar } from "./BottomStatusBar";

export function DashboardLayout() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <TopStatusHeader />
      <div className="flex-1 flex min-h-0">
        <SidebarLeft />
        <MainMapDisplay />
        <SidebarRight />
      </div>
      <BottomStatusBar />
    </div>
  );
}
