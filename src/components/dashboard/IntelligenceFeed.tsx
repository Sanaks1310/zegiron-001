import { intelligenceFeed } from "@/data/mockData";
import { PanelBox } from "./PanelBox";

const severityBorder: Record<string, string> = {
  high: "border-l-destructive",
  medium: "border-l-warning",
  low: "border-l-muted-foreground",
};

function highlightSources(text: string) {
  // Highlight source IDs like RADAR-01, RF-NODE-ALPHA etc in yellow
  return text.replace(
    /(RADAR-\d+|RF-NODE-[A-Z]+|EOIR-\d+|AIS-[A-Z]+|HTL-\d+|UNK-\d+|BRSS-\d+|ZG-\d+|WATCHCON-\d+|FOXTROT-\d+)/g,
    "||$1||"
  );
}

export function IntelligenceFeed() {
  return (
    <PanelBox title="INTELLIGENCE FEED">
      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
        {intelligenceFeed.map((item, i) => (
          <div
            key={i}
            className={`border-l-2 ${severityBorder[item.severity]} pl-2.5 py-1.5 hover-glow rounded-r cursor-default`}
          >
            <div className="text-[9px] text-muted-foreground tracking-wide">{item.time}</div>
            <p className="text-[10px] text-foreground leading-relaxed mt-1">
              {highlightSources(item.text).split("||").map((part, j) =>
                j % 2 === 1 ? (
                  <span key={j} className="text-highlight glow-yellow font-bold">{part}</span>
                ) : (
                  <span key={j}>{part}</span>
                )
              )}
            </p>
            <div className="text-[9px] text-success glow-green mt-1 tracking-wide">
              SOURCE: {item.source}
            </div>
          </div>
        ))}
      </div>
    </PanelBox>
  );
}
