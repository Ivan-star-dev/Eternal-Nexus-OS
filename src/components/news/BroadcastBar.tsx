// YouTube-style persistent LIVE broadcast bar with waveform visualization
import { useRef, useEffect, useState } from "react";
import { Radio, Tv, Signal } from "lucide-react";

const PLATFORMS = [
  { name: "NEXUS", color: "#22ffaa" },
  { name: "ATLAS", color: "#4a90e2" },
  { name: "NEWS", color: "#ff4444" },
  { name: "GOV", color: "#cc44ff" },
  { name: "PUBLIC", color: "#D4AF37" },
];

interface BroadcastBarProps {
  speaking: boolean;
}

export default function BroadcastBar({ speaking }: BroadcastBarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [viewerCount] = useState(() => 1200 + Math.floor(Math.random() * 3400));

  // Waveform visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 120;
    canvas.height = 24;
    let raf: number;

    const draw = () => {
      ctx.clearRect(0, 0, 120, 24);
      const bars = 20;
      const barW = 4;
      const gap = 2;

      for (let i = 0; i < bars; i++) {
        const height = speaking
          ? 4 + Math.random() * 18
          : 2 + Math.sin(performance.now() * 0.002 + i * 0.5) * 3;
        const x = i * (barW + gap);
        const y = (24 - height) / 2;

        ctx.fillStyle = speaking ? "#ff4444" : "hsl(42, 78%, 45%)";
        ctx.globalAlpha = speaking ? 0.8 : 0.3;
        ctx.fillRect(x, y, barW, height);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => cancelAnimationFrame(raf);
  }, [speaking]);

  return (
    <div className="bg-card/90 backdrop-blur-xl border-b border-border/30 px-4 py-1.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Live indicator */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${speaking ? "bg-destructive animate-pulse" : "bg-primary/50"}`} />
            <span className={`font-mono text-[0.5rem] tracking-[0.2em] font-bold ${speaking ? "text-destructive" : "text-muted-foreground"}`}>
              {speaking ? "LIVE" : "STANDBY"}
            </span>
          </div>
          <Tv className="w-3 h-3 text-muted-foreground" />
          <span className="font-mono text-[0.4rem] text-muted-foreground">
            ECHO-VOX BROADCAST
          </span>
        </div>

        {/* Waveform */}
        <canvas ref={canvasRef} className="h-6 w-[120px] opacity-80" />

        {/* Platform broadcast status */}
        <div className="hidden sm:flex items-center gap-1.5">
          <Signal className="w-3 h-3 text-muted-foreground" />
          <span className="font-mono text-[0.4rem] text-muted-foreground mr-1">
            Broadcasting to:
          </span>
          {PLATFORMS.map((p) => (
            <span
              key={p.name}
              className="font-mono text-[0.35rem] px-1.5 py-0.5 rounded border"
              style={{
                borderColor: `${p.color}40`,
                color: p.color,
                backgroundColor: `${p.color}10`,
              }}
            >
              {p.name}
            </span>
          ))}
        </div>

        {/* Viewer count */}
        <div className="flex items-center gap-1">
          <Radio className="w-3 h-3 text-primary/50" />
          <span className="font-mono text-[0.45rem] text-muted-foreground">
            {viewerCount.toLocaleString()} viewers
          </span>
        </div>
      </div>
    </div>
  );
}
