/**
 * SchoolSurface.tsx
 * Root wrapper for Bridge Nova / School portal surface.
 *
 * Identity: Deep navy (#0a0f1e), warm gold accents (hsl 42 78% 52%).
 * Density: LOW — one concept at a time.
 * Motion: subtle — confidence-building, not flashy.
 *
 * Canon: V7-SURFACES-001 · K-04 SURFACE · K-06 COMPONENT · K-07 IMPL
 * @framer+@cursor | 2026-03-28
 */

import LearningPath from "./LearningPath";
import { usePortalIdentity } from "@/hooks/usePortalIdentity";

export default function SchoolSurface() {
  const { isMotionAllowed } = usePortalIdentity();

  return (
    <main
      aria-label="Bridge Nova"
      data-portal-motion={isMotionAllowed('subtle') ? "subtle" : "none"}
      style={{
        background: "#0a0f1e",
        minHeight: "100vh",
        padding:
          "clamp(48px, 8vh, 96px) clamp(16px, 4vw, 48px) clamp(64px, 10vh, 120px)",
        position: "relative",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Atmospheric background — warm radial very subtle */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 60% at 50% 30%, rgba(160,100,20,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
        <LearningPath />
      </div>
    </main>
  );
}
