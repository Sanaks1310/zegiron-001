import { intelligenceFeed } from "@/data/mockData";
import { PanelBox } from "./PanelBox";

const severityBorder: Record<string, string> = {
  high: "border-l-destructive",
  medium: "border-l-warning",
  low: "border-l-muted-foreground",
};

export function IntelligenceFeed() {
  return (
    <PanelBox title="INTELLIGENCE FEED">
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {intelligenceFeed.map((item, i) => (
          <div key={i} className={`border-l-2 ${severityBorder[item.severity]} pl-2 py-1`}>
            <div className="text-[9px] text-muted-foreground">{item.time}</div>
            <p className="text-[10px] text-secondary-foreground leading-tight mt-0.5">
              {item.text}
            </p>
            <div className="text-[9px] text-success text-glow-green mt-0.5">
              SOURCE: {item.source}
            </div>
          </div>
        ))}
      </div>
    </PanelBox>
  );
}
