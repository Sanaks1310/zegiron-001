import { intelligenceFeed } from "@/data/mockData";
import { PanelBox } from "./PanelBox";
import { FileText } from "lucide-react";
import { useSensorNodes } from "@/context/SensorNodesContext";
import { useMemo } from "react";

const severityBorder: Record<string, string> = {
  high: "border-l-destructive",
  medium: "border-l-warning",
  low: "border-l-muted-foreground",
};

function highlightSources(text: string) {
  return text.replace(
    /(RADAR-\w+|RF-NODE-[A-Z]+|EOIR-\w+|AIS-[A-Z0-9]+|HTL-\d+|UNK-\d+|BRSS-\d+|ZG-\d+|WATCHCON-\d+|FOXTROT-\d+)/g,
    "||$1||"
  );
}

export function IntelligenceFeed() {
  const { events } = useSensorNodes();

  const merged = useMemo(
    () => [...events, ...intelligenceFeed],
    [events]
  );

  return (
    <PanelBox title="INTELLIGENCE FEED" icon={<FileText size={12} />}>
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {merged.map((item, i) => (
          <div
            key={`${item.time}-${i}`}
            className={`border-l-2 ${severityBorder[item.severity]} pl-2 py-1 hover-glow rounded-r cursor-default`}
          >
            <div className="text-[8px] text-muted-foreground tracking-wide">{item.time}</div>
            <p className="text-[9px] text-foreground leading-relaxed mt-0.5">
              {highlightSources(item.text).split("||").map((part, j) =>
                j % 2 === 1 ? (
                  <span key={j} className="text-highlight glow-yellow font-bold">{part}</span>
                ) : (
                  <span key={j}>{part}</span>
                )
              )}
            </p>
            <div className="text-[8px] text-success glow-green mt-0.5 tracking-wide">
              {item.source}
            </div>
          </div>
        ))}
      </div>
    </PanelBox>
  );
}
