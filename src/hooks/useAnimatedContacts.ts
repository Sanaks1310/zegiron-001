import { useState, useEffect, useCallback } from "react";
import { mapContacts as initialContacts } from "@/data/mockData";
import { Contact } from "@/context/SelectedContactContext";

interface TrailDefinition {
  id: string;
  type: "hostile" | "unknown" | "friendly";
  /** Waypoints the contact moves along, looping */
  waypoints: { x: number; y: number }[];
  /** Speed multiplier (1 = normal) */
  speedFactor: number;
}

const contactTrails: TrailDefinition[] = [
  {
    id: "HTL-01",
    type: "hostile",
    waypoints: [
      { x: 52, y: 62 }, { x: 54, y: 60 }, { x: 56, y: 58 },
      { x: 58, y: 56.5 }, { x: 60, y: 55 }, { x: 62, y: 53 },
      { x: 63, y: 51 }, { x: 62, y: 49 }, { x: 60, y: 48 },
      { x: 58, y: 50 }, { x: 56, y: 53 }, { x: 54, y: 56 },
    ],
    speedFactor: 1.4,
  },
  {
    id: "HTL-02",
    type: "hostile",
    waypoints: [
      { x: 48, y: 52 }, { x: 50, y: 51 }, { x: 52, y: 49.5 },
      { x: 53.5, y: 48.5 }, { x: 55, y: 48 }, { x: 56, y: 46 },
      { x: 55, y: 44 }, { x: 53, y: 43 }, { x: 51, y: 45 },
      { x: 49, y: 48 },
    ],
    speedFactor: 1.0,
  },
  {
    id: "UNK-07",
    type: "unknown",
    waypoints: [
      { x: 62, y: 38 }, { x: 63, y: 36 }, { x: 64, y: 34.5 },
      { x: 64.5, y: 33 }, { x: 65, y: 32 }, { x: 66, y: 31 },
      { x: 67, y: 32 }, { x: 66.5, y: 34 }, { x: 65, y: 35 },
      { x: 63.5, y: 37 },
    ],
    speedFactor: 0.5,
  },
  {
    id: "UNK-12",
    type: "unknown",
    waypoints: [
      { x: 50, y: 68 }, { x: 50.5, y: 69.5 }, { x: 51, y: 70.5 },
      { x: 51.5, y: 71 }, { x: 52, y: 72 }, { x: 52.5, y: 73 },
      { x: 52, y: 74 }, { x: 51, y: 73.5 }, { x: 50.5, y: 72 },
      { x: 50, y: 70 },
    ],
    speedFactor: 0.4,
  },
  {
    id: "HMS ARGYLL",
    type: "friendly",
    waypoints: [
      { x: 42, y: 60 }, { x: 43, y: 59 }, { x: 44, y: 58.5 },
      { x: 45, y: 57.8 }, { x: 46, y: 57 }, { x: 47, y: 56.5 },
      { x: 47.5, y: 57 }, { x: 47, y: 58 }, { x: 46, y: 59 },
      { x: 44, y: 59.5 },
    ],
    speedFactor: 0.3,
  },
  {
    id: "HMS DAUNTLESS",
    type: "friendly",
    waypoints: [
      { x: 32, y: 68 }, { x: 33, y: 67 }, { x: 34, y: 66 },
      { x: 35, y: 65 }, { x: 36, y: 64 }, { x: 37, y: 63 },
      { x: 37.5, y: 64 }, { x: 37, y: 65.5 }, { x: 36, y: 66.5 },
      { x: 34, y: 67.5 },
    ],
    speedFactor: 0.25,
  },
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Returns the interpolated position and a trail of recent positions */
function getPositionOnTrail(
  trail: TrailDefinition,
  progress: number // 0..1 cycling
): { x: number; y: number; history: { x: number; y: number }[] } {
  const wp = trail.waypoints;
  const totalSegments = wp.length;
  const rawIndex = progress * totalSegments;
  const segIndex = Math.floor(rawIndex) % totalSegments;
  const t = rawIndex - Math.floor(rawIndex);

  const p0 = wp[segIndex];
  const p1 = wp[(segIndex + 1) % totalSegments];

  const x = lerp(p0.x, p1.x, t);
  const y = lerp(p0.y, p1.y, t);

  // Build trail history (last 5 positions going backward)
  const history: { x: number; y: number }[] = [];
  for (let i = 1; i <= 5; i++) {
    const histProgress = ((progress * totalSegments - i * 0.5) % totalSegments + totalSegments) % totalSegments;
    const hSegIndex = Math.floor(histProgress) % totalSegments;
    const hT = histProgress - Math.floor(histProgress);
    const hp0 = wp[hSegIndex];
    const hp1 = wp[(hSegIndex + 1) % totalSegments];
    history.push({
      x: lerp(hp0.x, hp1.x, hT),
      y: lerp(hp0.y, hp1.y, hT),
    });
  }

  return { x, y, history: history.reverse() };
}

export interface AnimatedContact extends Contact {
  history: { x: number; y: number }[];
}

export function useAnimatedContacts() {
  const [contacts, setContacts] = useState<AnimatedContact[]>(() =>
    initialContacts.map((c) => ({ ...c, history: [] }))
  );

  const updatePositions = useCallback((time: number) => {
    const cycleDuration = 30000; // 30 seconds full loop

    setContacts(
      contactTrails.map((trail) => {
        const progress = ((time * trail.speedFactor) % cycleDuration) / cycleDuration;
        const { x, y, history } = getPositionOnTrail(trail, progress);
        const original = initialContacts.find((c) => c.id === trail.id)!;
        return {
          ...original,
          x: Math.round(x * 100) / 100,
          y: Math.round(y * 100) / 100,
          history,
        };
      })
    );
  }, []);

  useEffect(() => {
    let animId: number;
    const tick = (timestamp: number) => {
      updatePositions(timestamp);
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [updatePositions]);

  return contacts;
}
