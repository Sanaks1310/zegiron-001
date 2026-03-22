import { mapContacts } from "@/data/mockData";
import { StatusSelector } from "./StatusSelector";
import { TrackTimeline } from "./TrackTimeline";
import { WorldMapSVG } from "./WorldMapSVG";
import { FlightTrails } from "./FlightTrails";
import { useSelectedContact } from "@/context/SelectedContactContext";
import { motion } from "framer-motion";
import { Plane } from "lucide-react";

const contactColor: Record<string, string> = {
  hostile: "text-destructive",
  unknown: "text-warning",
  friendly: "text-primary",
};

const contactGlow: Record<string, string> = {
  hostile: "drop-shadow-[0_0_6px_hsl(338_90%_56%/0.8)]",
  unknown: "drop-shadow-[0_0_6px_hsl(32_95%_55%/0.7)]",
  friendly: "drop-shadow-[0_0_6px_hsl(217_95%_58%/0.6)]",
};

const contactRing: Record<string, string> = {
  hostile: "ring-destructive",
  unknown: "ring-warning",
  friendly: "ring-primary",
};

export function MainMapDisplay() {
  const { selected, setSelected } = useSelectedContact();

  return (
    <div className="flex-1 relative overflow-hidden h-full bg-card">
      {/* Map grid background */}
      <div className="absolute inset-0 z-0" style={{
        backgroundImage: `
          linear-gradient(hsl(217 95% 58% / 0.04) 1px, transparent 1px),
          linear-gradient(90deg, hsl(217 95% 58% / 0.04) 1px, transparent 1px),
          linear-gradient(hsl(217 95% 58% / 0.08) 1px, transparent 1px),
          linear-gradient(90deg, hsl(217 95% 58% / 0.08) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px, 20px 20px, 100px 100px, 100px 100px',
      }} />
      {/* Coastline-like shapes */}
      <svg className="absolute inset-0 w-full h-full z-0 opacity-20" viewBox="0 0 800 600" preserveAspectRatio="none">
        <path d="M0,200 Q100,180 150,220 T250,200 T350,240 T450,200 T550,230 T650,190 T800,220 L800,0 L0,0 Z" fill="hsl(145 40% 25% / 0.3)" stroke="hsl(145 60% 40% / 0.2)" strokeWidth="1"/>
        <path d="M0,350 Q80,320 160,360 T300,340 T400,370 T500,330 T600,360 T700,340 T800,360 L800,600 L0,600 Z" fill="hsl(145 40% 25% / 0.2)" stroke="hsl(145 60% 40% / 0.15)" strokeWidth="1"/>
        <path d="M300,250 Q340,230 380,260 T440,240 Q460,260 440,280 Q420,300 380,280 T320,270 Z" fill="hsl(145 40% 25% / 0.25)" stroke="hsl(145 60% 40% / 0.2)" strokeWidth="0.5"/>
      </svg>
      <StatusSelector />

      {/* Scanline overlay */}
      <div className="absolute inset-0 scanline pointer-events-none z-[1]" />

      {/* Radar area */}
      <div className="absolute inset-0 flex items-center justify-center z-[1] pointer-events-none">
        <div className="relative w-80 h-80">
          <div className="absolute inset-0 border border-primary/25 rounded-full" />
          <div className="absolute inset-[20%] border border-primary/20 rounded-full" />
          <div className="absolute inset-[40%] border border-primary/15 rounded-full" />
          <div className="absolute inset-[60%] border border-primary/10 rounded-full" />

          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-primary/10" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-primary/10" />

          <div
            className="absolute inset-0 animate-radar-sweep"
            style={{
              background: "conic-gradient(from 0deg, hsl(145 85% 50% / 0.2) 0deg, hsl(145 85% 50% / 0.05) 30deg, transparent 50deg, transparent 360deg)",
              borderRadius: "50%",
            }}
          />

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

      {/* Contacts as airplane icons */}
      {mapContacts.map((c, i) => (
        <motion.div
          key={c.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 * i }}
          className={`absolute flex flex-col items-center gap-0.5 cursor-pointer hover-glow rounded p-1 z-[2] transition-all -translate-x-1/2 -translate-y-1/2 ${
            selected.id === c.id ? `ring-2 ${contactRing[c.type]} ring-offset-1 ring-offset-background rounded-lg` : ""
          }`}
          style={{ left: `${c.x}%`, top: `${c.y}%` }}
          onClick={() => setSelected(c)}
        >
          <Plane
            size={16}
            className={`${contactColor[c.type]} ${contactGlow[c.type]} ${
              selected.id === c.id ? "animate-pulse" : ""
            } rotate-45`}
            fill="currentColor"
          />
          <span className="text-[9px] text-foreground whitespace-nowrap tracking-wide">
            {c.label || c.id}{c.speed ? ` · ${c.speed}` : ""}
          </span>
        </motion.div>
      ))}

      {/* EOIR thumbnail */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="absolute top-4 right-[32%] border border-border rounded panel-bg p-1.5 box-glow-blue z-[2]"
      >
        <div className="w-28 h-16 bg-muted rounded flex items-center justify-center">
          <span className="text-[8px] text-success glow-green">EOIR-01 THERMAL · LIVE</span>
        </div>
        <div className="text-[8px] text-primary text-center mt-1 glow-blue">LOCK TRK HTL-01</div>
      </motion.div>

      {/* Mode badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="absolute top-4 right-[18%] border border-primary/50 rounded px-4 py-1 box-glow-blue z-[2]"
      >
        <span className="text-[10px] text-primary glow-blue tracking-[0.2em]">MODE: SURVEILLANCE</span>
      </motion.div>

      {/* Track Timeline */}
      <div className="absolute bottom-7 left-0 right-0 h-20 border-t border-border/50 panel-bg z-[2]">
        <div className="px-2 pt-0.5">
          <span className="text-[8px] text-primary glow-blue tracking-widest">TRACK HISTORY</span>
        </div>
        <div className="h-[calc(100%-14px)]">
          <TrackTimeline />
        </div>
      </div>

      {/* Bottom coords */}
      <div className="absolute bottom-0 left-0 right-0 h-7 border-t border-border panel-bg flex items-center px-3 gap-6 z-[3]">
        <span className="text-[9px] text-muted-foreground">LAT 54.218°N</span>
        <span className="text-[9px] text-muted-foreground">LON 003.847°E</span>
        <span className="text-[9px] text-muted-foreground">ALT SL</span>
      </div>
    </div>
  );
}
