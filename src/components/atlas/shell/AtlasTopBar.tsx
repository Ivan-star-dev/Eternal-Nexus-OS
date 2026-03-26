// sacred flow — Atlas identity bar (top-left)
// Minimal: ATLAS + LIVE dot + mode label + LOD badge
import { useEffect, useRef, useState } from "react";
import type { AtlasMode } from "@/lib/atlas/atlas-state";
import type { LODLevel } from "@/components/atlas/ZoomController";

interface AtlasTopBarProps {
  mode: AtlasMode;
  lod: LODLevel;
  isMoving: boolean;
}

const MODE_LABELS: Record<AtlasMode, string> = {
  clean: "CLEAN",
  cinematic: "CINEMATIC",
  intelligence: "INTELLIGENCE",
  live: "LIVE",
};

export default function AtlasTopBar({ mode, lod, isMoving }: AtlasTopBarProps) {
  const [fps, setFps] = useState(60);
  const frameRef = useRef(0);
  const lastRef = useRef(performance.now());

  useEffect(() => {
    let raf: number;
    const tick = () => {
      frameRef.current++;
      const now = performance.now();
      if (now - lastRef.current >= 1000) {
        setFps(frameRef.current);
        frameRef.current = 0;
        lastRef.current = now;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className="fixed top-4 left-4 z-50 flex items-center gap-3 px-4 py-2 backdrop-blur-xl font-mono text-xs select-none"
      style={{
        background: "rgba(6,12,20,0.88)",
        border: "0.5px solid rgba(200,164,78,0.15)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
      }}
    >
      {/* Identity */}
      <span
        className="font-mono font-bold tracking-[0.2em] text-sm"
        style={{ color: "hsl(42 78% 58%)" }}
      >ATLAS</span>

      {/* LIVE dot */}
      <span className="relative flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="text-[10px]" style={{ color: "rgba(52,211,153,0.8)" }}>LIVE</span>
      </span>

      {/* Separator */}
      <span className="w-px h-4" style={{ background: "rgba(200,164,78,0.15)" }} />

      {/* Mode label */}
      <span className="tracking-widest text-[10px]" style={{ color: "rgba(200,164,78,0.7)" }}>{MODE_LABELS[mode]}</span>

      {/* Separator */}
      <span className="w-px h-4" style={{ background: "rgba(200,164,78,0.15)" }} />

      {/* LOD badge */}
      <span className="uppercase text-[10px]" style={{ color: "rgba(200,218,232,0.35)" }}>{lod}</span>

      {/* Motion indicator */}
      {isMoving && (
        <span className="text-[10px]" style={{ color: "rgba(56,189,248,0.6)" }}>MOVING</span>
      )}

      {/* FPS */}
      <span className={`text-[10px] ${fps >= 50 ? "" : ""}`} style={{ color: fps >= 50 ? "rgba(52,211,153,0.4)" : "rgba(248,113,113,0.6)" }}>
        {fps} FPS
      </span>
    </div>
  );
}
