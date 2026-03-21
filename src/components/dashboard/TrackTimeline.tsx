import { useEffect, useRef } from "react";

const TRACK_COLORS: Record<string, string> = {
  hostile: "hsl(338 90% 56%)",
  unknown: "hsl(32 95% 55%)",
  friendly: "hsl(217 95% 58%)",
};

interface Segment {
  track: string;
  type: "hostile" | "unknown" | "friendly";
  segments: { start: number; end: number; active: boolean }[];
}

const tracks: Segment[] = [
  { track: "HTL-01", type: "hostile", segments: [{ start: 0.05, end: 0.95, active: true }] },
  { track: "HTL-02", type: "hostile", segments: [{ start: 0.2, end: 0.75, active: true }] },
  { track: "UNK-07", type: "unknown", segments: [{ start: 0.1, end: 0.4, active: true }, { start: 0.55, end: 0.85, active: true }] },
  { track: "UNK-12", type: "unknown", segments: [{ start: 0.3, end: 0.9, active: true }] },
  { track: "ARGYLL", type: "friendly", segments: [{ start: 0, end: 1, active: true }] },
  { track: "DAUNTL", type: "friendly", segments: [{ start: 0, end: 1, active: true }] },
];

export function TrackTimeline() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offsetRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      ctx.clearRect(0, 0, width, height);

      const rowH = height / tracks.length;
      const now = offsetRef.current;

      tracks.forEach((t, i) => {
        const y = i * rowH;
        // label
        ctx.fillStyle = "hsl(220 15% 45%)";
        ctx.font = "9px monospace";
        ctx.fillText(t.track, 4, y + rowH / 2 + 3);

        const barX = 50;
        const barW = width - 54;

        // background track line
        ctx.fillStyle = "hsl(220 20% 15%)";
        ctx.fillRect(barX, y + rowH / 2 - 2, barW, 4);

        // segments with scrolling shimmer
        t.segments.forEach((seg) => {
          const sx = barX + seg.start * barW;
          const sw = (seg.end - seg.start) * barW;
          const color = TRACK_COLORS[t.type];

          ctx.globalAlpha = 0.7;
          ctx.fillStyle = color;
          ctx.fillRect(sx, y + rowH / 2 - 3, sw, 6);

          // moving highlight
          ctx.globalAlpha = 0.4;
          const hlPos = ((now * 0.5) % 1) * sw;
          const grad = ctx.createLinearGradient(sx + hlPos - 10, 0, sx + hlPos + 10, 0);
          grad.addColorStop(0, "transparent");
          grad.addColorStop(0.5, "white");
          grad.addColorStop(1, "transparent");
          ctx.fillStyle = grad;
          ctx.fillRect(sx, y + rowH / 2 - 3, sw, 6);
          ctx.globalAlpha = 1;
        });

        // row separator
        ctx.strokeStyle = "hsl(220 20% 18%)";
        ctx.beginPath();
        ctx.moveTo(0, y + rowH);
        ctx.lineTo(width, y + rowH);
        ctx.stroke();
      });

      // moving time cursor
      const cursorX = 50 + ((now * 0.3) % 1) * (width - 54);
      ctx.strokeStyle = "hsl(217 95% 58% / 0.6)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cursorX, 0);
      ctx.lineTo(cursorX, height);
      ctx.stroke();

      offsetRef.current += 0.002;
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
    />
  );
}
