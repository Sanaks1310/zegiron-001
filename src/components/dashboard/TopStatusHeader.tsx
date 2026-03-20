import { statusBarItems } from "@/data/mockData";

const statusColor: Record<string, string> = {
  operational: "bg-success",
  degraded: "bg-warning",
  fault: "bg-destructive",
};

const statusTextColor: Record<string, string> = {
  operational: "text-success text-glow-green",
  degraded: "text-warning text-glow-amber",
  fault: "text-destructive text-glow-red",
};

export function TopStatusHeader() {
  return (
    <header className="h-8 flex items-center justify-between border-b border-border px-3 panel-bg shrink-0">
      <div className="flex items-center gap-6">
        <h1 className="font-display text-lg font-bold tracking-widest text-primary text-glow-cyan">
          ZEGIRON
        </h1>
        <span className="text-[10px] text-muted-foreground">
          MARITIME INTELLIGENCE PLATFORM v6.2.1
        </span>
        <div className="flex items-center gap-3 ml-4">
          {statusBarItems.map((item, i) => (
            <div key={i} className="flex items-center gap-1.5">
              {["RADAR", "EO/IR", "AIS", "PASSIVE RF", "NODE-7"].includes(item.label) && (
                <span className={`w-2 h-2 rounded-full ${statusColor[item.status]}`} />
              )}
              <span className={`text-[10px] uppercase ${statusTextColor[item.status]}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="border border-destructive px-3 py-0.5 text-[10px] text-destructive text-glow-red font-bold tracking-wider">
          THREAT LEVEL ELEVATED
        </div>
        <span className="text-primary text-glow-cyan text-sm font-bold tracking-wider">
          07:28:31Z
        </span>
        <span className="text-muted-foreground text-[10px]">CDR WALSH</span>
      </div>
    </header>
  );
}
