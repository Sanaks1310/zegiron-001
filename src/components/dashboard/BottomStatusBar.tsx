import { SpectrogramBar } from "./SpectrogramBar";

export function BottomStatusBar() {
  return (
    <div className="shrink-0 border-t border-border panel-bg flex flex-col">
      {/* Spectrogram */}
      <div className="h-12 border-b border-border/50">
        <SpectrogramBar />
      </div>

      {/* Status line */}
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
