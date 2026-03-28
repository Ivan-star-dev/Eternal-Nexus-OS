/**
 * WorkshopSurface.tsx
 * Root wrapper for Nexus Cria / Workshop portal surface.
 *
 * Identity: Dark charcoal (#0d0d14), teal accents (hsl 172 55% 38%).
 * Density: MEDIUM — project grid, no overload.
 * Motion: moderate — purposeful transitions.
 *
 * Canon: V7-SURFACES-001 · K-04 SURFACE · K-06 COMPONENT · K-07 IMPL
 * @framer+@cursor | 2026-03-28
 */

import WorkshopHeader from "./WorkshopHeader";
import ProjectGrid from "./ProjectGrid";

export default function WorkshopSurface() {
  return (
    <div
      aria-label="Nexus Cria"
      style={{
        background: "#0d0d14",
        minHeight: "100vh",
        padding: "clamp(40px, 7vh, 80px) clamp(16px, 4vw, 60px)",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <WorkshopHeader />
      <ProjectGrid />
    </div>
  );
}
