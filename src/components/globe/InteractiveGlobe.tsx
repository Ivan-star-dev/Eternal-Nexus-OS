import { Suspense, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { useIsMobile } from "@/hooks/use-mobile";
import GlobeScene from "./GlobeScene";
import MobileGlobeMap from "./MobileGlobeMap";
import GlobeConstructionSequence from "./GlobeConstructionSequence";
import GlobeLayerSelector from "./GlobeLayerSelector";

interface InteractiveGlobeProps {
  onHotspotClick?: (projectId: string) => void;
  onFocusChange?: (id: string | null) => void;
}

const InteractiveGlobe = ({ onHotspotClick, onFocusChange }: InteractiveGlobeProps) => {
  const isMobile = useIsMobile();
  const [focusedProject, setFocusedProject] = useState<string | null>(null);
  const [layers, setLayers] = useState({ projects: true, seismic: true });

  const handleClick = useCallback((id: string) => {
    setFocusedProject(id);
    onHotspotClick?.(id);
    onFocusChange?.(id);
  }, [onHotspotClick, onFocusChange]);

  const handleLayerToggle = useCallback((layer: string) => {
    setLayers((prev) => ({ ...prev, [layer]: !prev[layer as keyof typeof prev] }));
  }, []);

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
            <GlobeScene
              focusedProject={focusedProject}
              onHotspotClick={handleClick}
              onFocusChange={onFocusChange}
              showProjects={layers.projects}
              showSeismic={layers.seismic}
            />
          </Canvas>
          <GlobeLayerSelector layers={layers} onToggle={handleLayerToggle} />
        </Suspense>
      </GlobeConstructionSequence>
    </div>
  );
};

export default InteractiveGlobe;
