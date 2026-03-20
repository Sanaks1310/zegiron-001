const layers = [
  { label: "RADAR", color: "bg-primary" },
  { label: "EO/IR", color: "bg-success" },
  { label: "AIS", color: "bg-warning" },
  { label: "PASS RF", color: "bg-accent" },
];

const overlays = [
  { label: "SIGINT", active: true },
  { label: "ELINT", active: false },
];

export function StatusSelector() {
  return (
    <div className="absolute top-2 left-2 z-10 panel-bg border border-border p-2 space-y-2">
      {layers.map((l) => (
        <div key={l.label} className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-sm ${l.color}`} />
          <span className="text-[10px] text-foreground">{l.label}</span>
        </div>
      ))}
      <div className="border-t border-border pt-1 mt-1">
        {overlays.map((o) => (
          <div key={o.label} className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${o.active ? "bg-muted-foreground" : "border border-muted-foreground"}`} />
            <span className="text-[10px] text-muted-foreground">{o.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
