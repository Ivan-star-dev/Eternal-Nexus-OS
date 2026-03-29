/**
 * GlobePage — V5 Interactive Globe Experience
 *
 * Dedicated full-screen route for GoldenAtlasScene:
 *   - Cinematic camera fly to project hotspots
 *   - Touch/swipe orbit + pinch zoom (mobile)
 *   - Supabase realtime live project feed
 *   - Spatial audio engine
 *   - ProjectBottomSheet for mobile
 *   - Right-click custom project placement
 *
 * Route: /globe
 * Distinct from /atlas (Cesium terrain/satellite) — this is the Three.js
 * constellation globe optimised for exploration and immersion.
 */

import { lazy, Suspense, useEffect } from "react";
import OrganErrorBoundary from "@/components/shared/OrganErrorBoundary";

const GoldenAtlasScene = lazy(() => import("@/components/GoldenAtlasScene"));

export default function GlobePage() {
  useEffect(() => {
    document.title = "Globe — Eternal Nexus OS";
    return () => { document.title = "Eternal Nexus OS"; };
  }, []);

  return (
    <div className="fixed inset-0 bg-background overflow-hidden">
      <OrganErrorBoundary organName="GoldenAtlasScene" silent>
        <Suspense fallback={
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <GoldenAtlasScene scrollProgress={0} />
        </Suspense>
      </OrganErrorBoundary>

      {/* Route label — top-left */}
      <div className="absolute top-16 left-4 z-20 pointer-events-none">
        <span className="font-mono text-[0.42rem] tracking-[0.22em] uppercase text-white/20">
          Globe · V5 · Three.js
        </span>
      </div>
    </div>
  );
}
