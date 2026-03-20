import { mapContacts } from "@/data/mockData";
import { StatusSelector } from "./StatusSelector";

const contactColor: Record<string, string> = {
  hostile: "bg-destructive",
  unknown: "bg-warning",
  friendly: "bg-primary",
};

export function MainMapDisplay() {
  return (
    <div className="flex-1 relative overflow-hidden border-x border-border">
      <StatusSelector />

      {/* Grid overlay */}
      <div className="absolute inset-0 scanline pointer-events-none" />

      {/* Radar sweep placeholder */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-72 h-72">
          {/* Radar circles */}
          <div className="absolute inset-0 border border-border/30 rounded-full" />
          <div className="absolute inset-[25%] border border-border/20 rounded-full" />
          <div className="absolute inset-[50%] border border-border/10 rounded-full" />

          {/* Sweep */}
          <div className="absolute inset-0 animate-radar-sweep origin-center">
            <div
              className="absolute left-1/2 bottom-1/2 w-1/2 h-1"
              style={{
                background: "linear-gradient(90deg, hsl(180 100% 45% / 0.6), transparent)",
                transformOrigin: "left center",
              }}
            />
          </div>

          {/* Sweep cone glow */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 animate-radar-sweep"
            style={{
              background: "conic-gradient(from 0deg, hsl(180 100% 45% / 0.15) 0deg, transparent 40deg, transparent 360deg)",
              borderRadius: "50%",
            }}
          />
        </div>
      </div>

      {/* Contacts */}
      {mapContacts.map((c) => (
        <div
          key={c.id}
          className="absolute flex flex-col items-center gap-0.5"
          style={{ left: `${c.x}%`, top: `${c.y}%`, transform: "translate(-50%, -50%)" }}
        >
          <div className={`w-3 h-3 rounded-full ${contactColor[c.type]} shadow-lg`} />
          <span className="text-[9px] text-foreground whitespace-nowrap">
            {c.label || c.id}{c.speed ? ` · ${c.speed}` : ""}
          </span>
        </div>
      ))}

      {/* EOIR thumbnail */}
      <div className="absolute top-3 right-[35%] border border-border panel-bg p-1">
        <div className="w-24 h-16 bg-muted flex items-center justify-center">
          <span className="text-[8px] text-success text-glow-green">EOIR-01 THERMAL · LIVE</span>
        </div>
        <div className="text-[8px] text-primary text-center mt-0.5">LOCK TRK HTL-01</div>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 h-6 border-t border-border panel-bg flex items-center px-2 gap-4">
        <span className="text-[9px] text-muted-foreground">LAT 54.218°N</span>
        <span className="text-[9px] text-muted-foreground">LON 003.847°E</span>
        <span className="text-[9px] text-muted-foreground">ALT SL</span>
      </div>

      {/* Mode badge */}
      <div className="absolute top-3 right-[20%] border border-primary px-3 py-0.5">
        <span className="text-[10px] text-primary text-glow-cyan tracking-wider">MODE: SURVEILLANCE</span>
      </div>
    </div>
  );
}
