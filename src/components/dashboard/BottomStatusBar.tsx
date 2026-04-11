import { SpectrogramBar } from "./SpectrogramBar";
import { useDashboardLayout } from "@/context/DashboardLayoutContext";

export function BottomStatusBar() {
  const { isVisible } = useDashboardLayout();

  return (
    <div className="shrink-0 border-t border-border panel-bg flex flex-col">
      {isVisible("spectrogram") && (
        <div className="h-12 border-b border-border/50">
          <SpectrogramBar />
        </div>
      )}
      <div className="h-6 flex items-center px-3 gap-6">
        <span className="text-[9px] text-success glow-green">● FUSION ENGINE ONLINE</span>
        <span className="text-[9px] text-muted-foreground">LATENCY 23ms</span>
        <span className="text-[9px] text-muted-foreground">TRACKS PROCESSED: 14,829/hr</span>
        <span className="text-[9px] text-success glow-green">● NODE HEALTH: 11/12</span>
        <span className="text-[9px] text-muted-foreground">DATA LINK: ENCRYPTED</span>
        <span className="text-[9px] text-primary glow-blue">AES-256-GCM</span>
        <span className="text-[9px] text-muted-foreground ml-auto tracking-wider">
          CLASSIFICATION: SECRET // REL TO FVEY
        </span>
      </div>
    </div>
  );
}
