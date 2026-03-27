/**
 * InteractiveGlobe.tsx
 * GLOBE-3D-001 | GLOBE-EXPERIENCE-IMPL-001
 *
 * Desktop: Real 3D Earth via GlobeCanvas
 *   - Procedural shader (continent fbm, ocean, polar ice)
 *   - Dual atmosphere shells — electric blue Fresnel limb glow (#00aaff)
 *   - Starfield backdrop
 *   - Deep space dark background (#0a0a1a)
 *   - Smooth auto-rotation + OrbitControls
 *   - Target: 60fps
 *
 * Mobile: MapLibre 2D fallback (MobileGlobeMap) — unchanged.
 *
 * @antigravity + @cursor | GLOBE-3D-001 | 2026-03-27
 */

import { Suspense, lazy, useState, useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileGlobeMap from "./MobileGlobeMap";
import GlobeConstructionSequence from "./GlobeConstructionSequence";
import GlobeLayerSelector from "./GlobeLayerSelector";

// Real 3D Earth — GLOBE-3D-001
const GlobeCanvas = lazy(() => import("./GlobeCanvas"));

interface InteractiveGlobeProps {
  onHotspotClick?: (projectId: string) => void;
  onFocusChange?: (id: string | null) => void;
}

const InteractiveGlobe = ({ onHotspotClick }: InteractiveGlobeProps) => {
  const isMobile = useIsMobile();
  const [layers, setLayers] = useState({ projects: true, seismic: true, airQuality: false });

  const handleLayerToggle = useCallback((layer: string) => {
    setLayers((prev) => ({ ...prev, [layer]: !prev[layer as keyof typeof prev] }));
  }, []);

  // Mobile: 2D MapLibre fallback — unchanged
  if (isMobile) {
    return <MobileGlobeMap onHotspotClick={onHotspotClick ?? (() => {})} />;
  }

  // Desktop: Real 3D Earth with procedural shader + atmosphere glow
  return (
    <div className="absolute inset-0" style={{ zIndex: 0 }}>
      <GlobeConstructionSequence>
        <Suspense
          fallback={
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: "#0a0a1a" }}
            >
              <span className="font-mono text-[0.55rem] tracking-[0.2em] text-[rgba(0,170,255,0.4)] animate-pulse uppercase">
                LOADING GLOBE…
              </span>
            </div>
          }
        >
          {/* GlobeCanvas: real Earth + atmosphere + starfield + OrbitControls */}
          <div className="absolute inset-0">
            <GlobeCanvas />
          </div>
          <GlobeLayerSelector layers={layers} onToggle={handleLayerToggle} />
        </Suspense>
      </GlobeConstructionSequence>
    </div>
  );
};

export default InteractiveGlobe;
