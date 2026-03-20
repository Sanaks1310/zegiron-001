import { mapContacts } from "@/data/mockData";
import { StatusSelector } from "./StatusSelector";

const contactColor: Record<string, string> = {
  hostile: "bg-destructive",
  unknown: "bg-warning",
  friendly: "bg-primary",
};

const contactGlow: Record<string, string> = {
  hostile: "shadow-[0_0_12px_hsl(338_90%_56%/0.6)]",
  unknown: "shadow-[0_0_8px_hsl(32_95%_55%/0.5)]",
  friendly: "shadow-[0_0_8px_hsl(217_95%_58%/0.4)]",
};

export function MainMapDisplay() {
  return (
    <div className="flex-1 relative overflow-hidden">
      <StatusSelector />

      {/* Scanline overlay */}
      <div className="absolute inset-0 scanline pointer-events-none z-[1]" />

      {/* Radar area */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-80 h-80">
          {/* Electric blue range rings */}
          <div className="absolute inset-0 border border-primary/25 rounded-full" />
          <div className="absolute inset-[20%] border border-primary/20 rounded-full" />
          <div className="absolute inset-[40%] border border-primary/15 rounded-full" />
          <div className="absolute inset-[60%] border border-primary/10 rounded-full" />

          {/* Cross hairs */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-primary/10" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-primary/10" />

          {/* Vibrant green sweep cone */}
          <div
            className="absolute inset-0 animate-radar-sweep"
            style={{
              background: "conic-gradient(from 0deg, hsl(145 85% 50% / 0.2) 0deg, hsl(145 85% 50% / 0.05) 30deg, transparent 50deg, transparent 360deg)",
              borderRadius: "50%",
            }}
          />

          {/* Sweep line */}
          <div className="absolute inset-0 animate-radar-sweep origin-center">
            <div
              className="absolute left-1/2 bottom-1/2 w-1/2 h-0.5"
              style={{
                background: "linear-gradient(90deg, hsl(145 85% 50% / 0.8), transparent)",
                transformOrigin: "left center",
              }}
            />
          </div>
        </div>
      </div>

      {/* Contacts */}
      {mapContacts.map((c) => (
        <div
          key={c.id}
          className="absolute flex flex-col items-center gap-1 cursor-pointer hover-glow rounded p-1 z-[2]"
          style={{ left: `${c.x}%`, top: `${c.y}%`, transform: "translate(-50%, -50%)" }}
        >
          <div className={`w-3.5 h-3.5 rounded-full ${contactColor[c.type]} ${contactGlow[c.type]}`} />
          <span className="text-[9px] text-foreground whitespace-nowrap tracking-wide">
            {c.label || c.id}{c.speed ? ` · ${c.speed}` : ""}
          </span>
        </div>
      ))}

      {/* EOIR thumbnail */}
      <div className="absolute top-4 right-[32%] border border-border rounded panel-bg p-1.5 box-glow-blue">
        <div className="w-28 h-16 bg-muted rounded flex items-center justify-center">
          <span className="text-[8px] text-success glow-green">EOIR-01 THERMAL · LIVE</span>
        </div>
        <div className="text-[8px] text-primary text-center mt-1 glow-blue">LOCK TRK HTL-01</div>
      </div>

      {/* Mode badge */}
      <div className="absolute top-4 right-[18%] border border-primary/50 rounded px-4 py-1 box-glow-blue">
        <span className="text-[10px] text-primary glow-blue tracking-[0.2em]">MODE: SURVEILLANCE</span>
      </div>

      {/* Bottom coords */}
      <div className="absolute bottom-0 left-0 right-0 h-7 border-t border-border panel-bg flex items-center px-3 gap-6 z-[2]">
        <span className="text-[9px] text-muted-foreground">LAT 54.218°N</span>
        <span className="text-[9px] text-muted-foreground">LON 003.847°E</span>
        <span className="text-[9px] text-muted-foreground">ALT SL</span>
      </div>
    </div>
  );
}
