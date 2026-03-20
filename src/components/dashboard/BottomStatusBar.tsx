export function BottomStatusBar() {
  return (
    <footer className="h-6 shrink-0 border-t border-border panel-bg flex items-center px-3 gap-6">
      <span className="text-[9px] text-success">● FUSION ENGINE ONLINE</span>
      <span className="text-[9px] text-muted-foreground">LATENCY 23ms</span>
      <span className="text-[9px] text-muted-foreground">TRACKS PROCESSED: 14,829/hr</span>
      <span className="text-[9px] text-success">● NODE HEALTH: 11/12</span>
      <span className="text-[9px] text-muted-foreground">DATA LINK: ENCRYPTED</span>
      <span className="text-[9px] text-muted-foreground">AES-256-GCM</span>
      <span className="text-[9px] text-muted-foreground ml-auto">
        CLASSIFICATION: SECRET // REL TO FVEY
      </span>
    </footer>
  );
}
