/**
 * AtlasStatusBar — Mission-control status bar (Eternal Nexus prototype).
 * Real-time FPS, node count, LOD indicator, memory estimate.
 */
import { useEffect, useRef, useState } from "react";

interface Props {
  projectCount: number;
  lod?: string;
}

export default function AtlasStatusBar({ projectCount, lod = "orbital" }: Props) {
  const [fps, setFps] = useState(60);
  const [memory, setMemory] = useState("—");
  const frameRef = useRef({ frames: 0, lastTime: performance.now() });

  useEffect(() => {
    let raf: number;
    const tick = () => {
      frameRef.current.frames++;
      const now = performance.now();
      const delta = now - frameRef.current.lastTime;
      if (delta >= 1000) {
        setFps(Math.round((frameRef.current.frames * 1000) / delta));
        frameRef.current.frames = 0;
        frameRef.current.lastTime = now;
        // Memory estimate (if available)
        const perf = (performance as any);
        if (perf.memory) {
          setMemory(`${Math.round(perf.memory.usedJSHeapSize / 1048576)}MB`);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[200] flex items-center justify-between px-8 h-[38px] pointer-events-none"
      style={{
        background: 'linear-gradient(0deg, hsl(var(--background) / 0.92) 0%, transparent 100%)',
        borderTop: '1px solid hsl(var(--primary) / 0.06)',
      }}
    >
      <div className="flex items-center gap-4 font-mono text-[6.5px] tracking-[2.5px] text-muted-foreground/40 uppercase">
        <span>Organism Alive</span>
        <span className="text-primary/15">·</span>
        <span>{projectCount} Nodes</span>
        <span className="text-primary/15">·</span>
        <span className="text-primary/30">{lod.toUpperCase()}</span>
      </div>
      <div className="flex items-center gap-4">
        {memory !== "—" && (
          <span className="font-mono text-[6.5px] tracking-[2px] text-muted-foreground/30 uppercase">
            {memory}
          </span>
        )}
        <span
          className="font-mono text-[7.5px] tracking-[2px] uppercase"
          style={{ color: fps >= 50 ? 'hsl(var(--primary) / 0.5)' : 'hsl(0 70% 50% / 0.7)' }}
        >
          {fps} FPS
        </span>
      </div>
    </div>
  );
}
