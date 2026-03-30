/**
 * WorkshopSurface.tsx
 * Root wrapper for Nexus Cria / Workshop portal surface.
 *
 * Identity: Sovereign matte depth with teal authorship accents.
 * Density: MEDIUM — project grid, no overload.
 * Motion: moderate — purposeful transitions.
 *
 * Canon: V7-SURFACES-001 · K-04 SURFACE · K-06 COMPONENT · K-07 IMPL
 * @framer+@cursor | 2026-03-28
 */

import WorkshopHeader from "./WorkshopHeader";
import WorkshopArtifactPanel from "./WorkshopArtifactPanel";
import ProjectGrid from "./ProjectGrid";
import { usePortalIdentity } from "@/hooks/usePortalIdentity";

export default function WorkshopSurface() {
  const { isMotionAllowed, isDenseAllowed } = usePortalIdentity();

  return (
    <div
      aria-label="Nexus Cria"
      data-portal-dense={isDenseAllowed ? "true" : "false"}
      data-portal-motion={isMotionAllowed('moderate') ? "moderate" : isMotionAllowed('subtle') ? "subtle" : "none"}
      style={{
        background: "hsl(var(--background))",
        minHeight: "100vh",
        padding: "clamp(40px, 7vh, 80px) clamp(16px, 4vw, 60px)",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 56% 46% at 78% 18%, hsl(var(--rx-electric) / 0.08) 0%, transparent 66%), radial-gradient(ellipse 54% 46% at 16% 82%, hsl(var(--rx-teal) / 0.06) 0%, transparent 70%)",
        }}
      />
      <WorkshopHeader />
      <WorkshopArtifactPanel />
      <ProjectGrid />
    </div>
  );
}
