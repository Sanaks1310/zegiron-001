const layers = [
  { label: "RADAR", color: "bg-primary" },
  { label: "EO/IR", color: "bg-warning" },
  { label: "AIS", color: "bg-destructive" },
  { label: "PASS RF", color: "bg-accent" },
];

const overlays = [
  { label: "SIGINT", active: true },
  { label: "ELINT", active: false },
];

export function StatusSelector() {
  return (
    <div className="absolute top-3 left-3 z-10 panel-bg border border-border rounded-md p-2.5 space-y-1.5 box-glow-blue">
      {layers.map((l) => (
        <div key={l.label} className="flex items-center gap-2.5 hover-glow rounded px-1 py-0.5 cursor-pointer">
          <span className={`w-3 h-3 rounded-sm ${l.color}`} />
          <span className="text-[10px] text-foreground tracking-wide">{l.label}</span>
        </div>
      ))}
      <div className="border-t border-border/50 pt-1.5 mt-1.5">
        {overlays.map((o) => (
          <div key={o.label} className="flex items-center gap-2.5 hover-glow rounded px-1 py-0.5 cursor-pointer">
            <span className={`w-2 h-2 rounded-full ${o.active ? "bg-muted-foreground" : "border border-muted-foreground"}`} />
            <span className="text-[10px] text-muted-foreground tracking-wide">{o.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
