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
    <div className="fixed top-4 left-4 z-50 flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg font-mono text-xs select-none">
      {/* Identity */}
      <span className="text-white/90 font-bold tracking-[0.2em] text-sm">ATLAS</span>

      {/* LIVE dot */}
      <span className="relative flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="text-emerald-400/80 text-[10px]">LIVE</span>
      </span>

      {/* Separator */}
      <span className="w-px h-4 bg-white/10" />

      {/* Mode label */}
      <span className="text-[#f5c24a]/80 tracking-widest text-[10px]">{MODE_LABELS[mode]}</span>

      {/* Separator */}
      <span className="w-px h-4 bg-white/10" />

      {/* LOD badge */}
      <span className="text-white/40 uppercase text-[10px]">{lod}</span>

      {/* Motion indicator */}
      {isMoving && (
        <span className="text-sky-400/60 text-[10px]">MOVING</span>
      )}

      {/* FPS */}
      <span className={`text-[10px] ${fps >= 50 ? "text-emerald-400/40" : "text-red-400/60"}`}>
        {fps} FPS
      </span>
    </div>
  );
}
