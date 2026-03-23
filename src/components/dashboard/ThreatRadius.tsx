import { motion } from "framer-motion";
import { AnimatedContact } from "@/hooks/useAnimatedContacts";

interface ThreatRadiusProps {
  contacts: AnimatedContact[];
  /** Radius in percentage units */
  radius?: number;
}

export function ThreatRadius({ contacts, radius = 4 }: ThreatRadiusProps) {
  const hostiles = contacts.filter((c) => c.type === "hostile");

  return (
    <svg className="absolute inset-0 w-full h-full z-[1] pointer-events-none">
      <defs>
        <radialGradient id="threat-grad">
          <stop offset="0%" stopColor="hsl(338 90% 56%)" stopOpacity="0.08" />
          <stop offset="70%" stopColor="hsl(338 90% 56%)" stopOpacity="0.04" />
          <stop offset="100%" stopColor="hsl(338 90% 56%)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {hostiles.map((c) => (
        <g key={c.id}>
          {/* Threat zone fill */}
          <circle
            cx={`${c.x}%`}
            cy={`${c.y}%`}
            r={`${radius}%`}
            fill="url(#threat-grad)"
          />

          {/* Outer pulsing ring */}
          <motion.circle
            cx={`${c.x}%`}
            cy={`${c.y}%`}
            r={`${radius}%`}
            fill="none"
            stroke="hsl(338 90% 56% / 0.35)"
            strokeWidth="1"
            strokeDasharray="4 3"
            vectorEffect="non-scaling-stroke"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: [0.6, 0.2, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Inner pulsing ring */}
          <motion.circle
            cx={`${c.x}%`}
            cy={`${c.y}%`}
            r={`${radius * 0.55}%`}
            fill="none"
            stroke="hsl(338 90% 56% / 0.2)"
            strokeWidth="0.5"
            vectorEffect="non-scaling-stroke"
            initial={{ opacity: 0.4 }}
            animate={{ opacity: [0.4, 0.1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          />

          {/* Expanding pulse wave */}
          <motion.circle
            cx={`${c.x}%`}
            cy={`${c.y}%`}
            fill="none"
            stroke="hsl(338 90% 56%)"
            strokeWidth="0.5"
            vectorEffect="non-scaling-stroke"
            initial={{ r: `${radius * 0.3}%`, opacity: 0.5 }}
            animate={{ r: `${radius * 1.2}%`, opacity: 0 }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
          />

          {/* THREAT label */}
          <text
            x={`${c.x}%`}
            y={`${c.y - radius - 1}%`}
            textAnchor="middle"
            fill="hsl(338 90% 56% / 0.6)"
            fontSize="7"
            fontFamily="monospace"
            letterSpacing="0.15em"
          >
            THREAT ZONE
          </text>
        </g>
      ))}
    </svg>
  );
}
