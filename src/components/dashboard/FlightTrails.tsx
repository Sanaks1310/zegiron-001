import { motion } from "framer-motion";
import { AnimatedContact } from "@/hooks/useAnimatedContacts";

const strokeColors: Record<string, string> = {
  hostile: "hsl(338 90% 56%)",
  unknown: "hsl(32 95% 55%)",
  friendly: "hsl(217 95% 58%)",
};

const dotColors: Record<string, string> = {
  hostile: "hsl(338 90% 56% / 0.5)",
  unknown: "hsl(32 95% 55% / 0.4)",
  friendly: "hsl(217 95% 58% / 0.3)",
};

interface FlightTrailsProps {
  contacts: AnimatedContact[];
}

export function FlightTrails({ contacts }: FlightTrailsProps) {
  return (
    <svg className="absolute inset-0 w-full h-full z-[1] pointer-events-none">
      <defs>
        {Object.entries(strokeColors).map(([type, color]) => (
          <linearGradient key={type} id={`trail-grad-${type}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0" />
            <stop offset="100%" stopColor={color} stopOpacity="0.7" />
          </linearGradient>
        ))}
      </defs>

      {contacts.map((contact) => {
        if (contact.history.length === 0) return null;

        // Build trail from history to current position
        const allPoints = [...contact.history, { x: contact.x, y: contact.y }];
        const polyPoints = allPoints.map((p) => `${p.x},${p.y}`).join(" ");

        return (
          <g key={contact.id}>
            {/* Trail line */}
            <polyline
              points={polyPoints}
              fill="none"
              stroke={`url(#trail-grad-${contact.type})`}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />

            {/* Trail dots (history markers) */}
            {contact.history.map((p, i) => (
              <circle
                key={i}
                cx={`${p.x}%`}
                cy={`${p.y}%`}
                r={1 + i * 0.4}
                fill={dotColors[contact.type]}
                opacity={0.3 + i * 0.12}
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
}
