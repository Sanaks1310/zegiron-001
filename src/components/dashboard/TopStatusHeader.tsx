import { statusBarItems } from "@/data/mockData";
import { useState, useEffect } from "react";

const statusColor: Record<string, string> = {
  operational: "bg-primary",
  degraded: "bg-warning",
  fault: "bg-destructive",
};

const statusTextColor: Record<string, string> = {
  operational: "text-primary glow-blue",
  degraded: "text-warning glow-orange",
  fault: "text-destructive glow-magenta",
};

export function TopStatusHeader() {
  return (
    <header className="h-9 flex items-center justify-between border-b border-border px-4 panel-bg shrink-0">
      <div className="flex items-center gap-6">
        <h1 className="font-display text-xl font-bold tracking-[0.2em] text-primary glow-blue">
          ZEGIRON
        </h1>
        <span className="text-[10px] text-muted-foreground tracking-wide">
          MARITIME INTELLIGENCE PLATFORM v6.2.1
        </span>
        <div className="flex items-center gap-4 ml-4">
          {statusBarItems.map((item, i) => (
            <div key={i} className="flex items-center gap-1.5">
              {["RADAR", "EO/IR", "AIS", "PASSIVE RF", "NODE-7"].includes(item.label) && (
                <span className={`w-2 h-2 rounded-full ${statusColor[item.status]} ${item.status === "fault" ? "animate-pulse-glow" : ""}`} />
              )}
              <span className={`text-[10px] uppercase tracking-wider ${statusTextColor[item.status]}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="border border-destructive/60 rounded px-3 py-0.5 animate-pulse-glow box-glow-magenta">
          <span className="text-[10px] text-destructive glow-magenta font-bold tracking-[0.15em]">
            THREAT LEVEL ELEVATED
          </span>
        </div>
        <span className="text-primary glow-blue text-sm font-bold tracking-[0.15em] font-display">
          07:28:31Z
        </span>
        <span className="text-foreground text-[10px] tracking-wide">CDR WALSH</span>
      </div>
    </header>
  );
}
