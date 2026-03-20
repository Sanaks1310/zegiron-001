import { useEffect, useRef } from "react";

const COLORS = [
  "hsl(217, 95%, 58%)",   // cobalt blue
  "hsl(210, 100%, 62%)",  // electric blue
  "hsl(338, 90%, 56%)",   // magenta
  "hsl(32, 95%, 55%)",    // orange
  "hsl(50, 100%, 60%)",   // yellow
  "hsl(152, 75%, 48%)",   // green
  "hsl(280, 70%, 55%)",   // purple
];

export function SpectrogramBar() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    resize();

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    const cols = Math.floor(w / 4);
    const rows = Math.floor(h / 4);

    // Generate persistent data grid
    const data: number[][] = [];
    for (let x = 0; x < cols; x++) {
      data[x] = [];
      for (let y = 0; y < rows; y++) {
        data[x][y] = Math.random();
      }
    }

    let offset = 0;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      offset += 0.3;

      for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
          const noise = data[(x + Math.floor(offset)) % cols][y];
          const intensity = noise * 0.7 + Math.sin((x + offset) * 0.15) * 0.15 + Math.cos(y * 0.3) * 0.15;
          const clamped = Math.max(0, Math.min(1, intensity));

          if (clamped > 0.15) {
            const colorIdx = Math.floor(clamped * (COLORS.length - 1));
            ctx.globalAlpha = clamped * 0.85;
            ctx.fillStyle = COLORS[colorIdx];
            ctx.fillRect(x * 4, y * 4, 3, 3);
          }
        }
      }

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div className="w-full h-full relative">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
