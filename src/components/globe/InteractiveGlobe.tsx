import { Suspense, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { useIsMobile } from "@/hooks/use-mobile";
import GlobeScene from "./GlobeScene";
import MobileGlobeMap from "./MobileGlobeMap";
import GlobeConstructionSequence from "./GlobeConstructionSequence";

interface InteractiveGlobeProps {
  onHotspotClick?: (projectId: string) => void;
}

const InteractiveGlobe = ({ onHotspotClick }: InteractiveGlobeProps) => {
  const isMobile = useIsMobile();
  const [focusedProject, setFocusedProject] = useState<string | null>(null);

  const handleClick = useCallback((id: string) => {
    setFocusedProject(id);
    onHotspotClick?.(id);
  }, [onHotspotClick]);

  if (isMobile) {
    return <MobileGlobeMap onHotspotClick={handleClick} />;
  }

  return (
    <div className="absolute inset-0" style={{ zIndex: 0 }}>
      <GlobeConstructionSequence>
        <Suspense fallback={
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-[0.55rem] tracking-[0.2em] text-muted-foreground animate-pulse uppercase">
              LOADING GLOBE…
            </span>
          </div>
        }>
          <Canvas
            camera={{ position: [0, 0, 14], fov: 42 }}
            dpr={[2, 3]}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            style={{ background: "transparent" }}
          >
            <GlobeScene focusedProject={focusedProject} onHotspotClick={handleClick} />
          </Canvas>
        </Suspense>
      </GlobeConstructionSequence>
    </div>
  );
};

export default InteractiveGlobe;
