import { motion } from "framer-motion";

interface Trail {
  id: string;
  type: "hostile" | "unknown" | "friendly";
  /** Array of {x,y} percentage points, last point is current position */
  path: { x: number; y: number }[];
}

const trails: Trail[] = [
  {
    id: "HTL-01",
    type: "hostile",
    path: [
      { x: 52, y: 62 },
      { x: 54, y: 60 },
      { x: 56, y: 58 },
      { x: 58, y: 56.5 },
      { x: 60, y: 55 },
    ],
  },
  {
    id: "HTL-02",
    type: "hostile",
    path: [
      { x: 48, y: 52 },
      { x: 50, y: 51 },
      { x: 52, y: 49.5 },
      { x: 53.5, y: 48.5 },
      { x: 55, y: 48 },
    ],
  },
  {
    id: "UNK-07",
    type: "unknown",
    path: [
      { x: 62, y: 38 },
      { x: 63, y: 36 },
      { x: 64, y: 34.5 },
      { x: 64.5, y: 33 },
      { x: 65, y: 32 },
    ],
  },
  {
    id: "UNK-12",
    type: "unknown",
    path: [
      { x: 50, y: 68 },
      { x: 50.5, y: 69.5 },
      { x: 51, y: 70.5 },
      { x: 51.5, y: 71 },
      { x: 52, y: 72 },
    ],
  },
  {
    id: "HMS ARGYLL",
    type: "friendly",
    path: [
      { x: 42, y: 60 },
      { x: 43, y: 59 },
      { x: 44, y: 58.5 },
      { x: 45, y: 57.8 },
      { x: 46, y: 57 },
    ],
  },
  {
    id: "HMS DAUNTLESS",
    type: "friendly",
    path: [
      { x: 32, y: 68 },
      { x: 33, y: 67 },
      { x: 34, y: 66 },
      { x: 35, y: 65 },
      { x: 36, y: 64 },
    ],
  },
];

const strokeColors: Record<string, string> = {
  hostile: "hsl(338 90% 56%)",
  unknown: "hsl(32 95% 55%)",
  friendly: "hsl(217 95% 58%)",
};

const dotColors: Record<string, string> = {
  hostile: "hsl(338 90% 56% / 0.6)",
  unknown: "hsl(32 95% 55% / 0.5)",
  friendly: "hsl(217 95% 58% / 0.4)",
};

export function FlightTrails() {
  return (
    <svg className="absolute inset-0 w-full h-full z-[1] pointer-events-none">
      <defs>
        {Object.entries(strokeColors).map(([type, color]) => (
          <linearGradient key={type} id={`trail-grad-${type}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0" />
            <stop offset="100%" stopColor={color} stopOpacity="0.8" />
          </linearGradient>
        ))}
      </defs>

      {trails.map((trail) => {
        const points = trail.path;
        const pathD = points
          .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x}% ${p.y}%`)
          .join(" ");

        // Convert % to a viewBox-relative SVG path using polyline
        const polyPoints = points.map((p) => `${p.x},${p.y}`).join(" ");

        return (
          <g key={trail.id}>
            {/* Trail line */}
            <motion.polyline
              points={polyPoints}
              fill="none"
              stroke={`url(#trail-grad-${trail.type})`}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
              style={{
                // polyline uses points as percentages, but SVG needs viewBox coords
                // We'll use a percentage-based coordinate system
              }}
            />

            {/* Trail dots (history markers) */}
            {points.slice(0, -1).map((p, i) => (
              <motion.circle
                key={i}
                cx={`${p.x}%`}
                cy={`${p.y}%`}
                r={1.5 + i * 0.3}
                fill={dotColors[trail.type]}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.4 + i * 0.15, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 + i * 0.15 }}
              />
            ))}

            {/* Animated pulse on the most recent trail point */}
            <motion.circle
              cx={`${points[points.length - 2].x}%`}
              cy={`${points[points.length - 2].y}%`}
              r={3}
              fill="none"
              stroke={strokeColors[trail.type]}
              strokeWidth={0.5}
              initial={{ r: 2, opacity: 0.6 }}
              animate={{ r: 6, opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
          </g>
        );
      })}
    </svg>
  );
}
