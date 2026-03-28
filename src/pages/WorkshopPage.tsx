/**
 * WorkshopPage.tsx — /workshop route
 * Nexus Cria face — creation workshop portal.
 *
 * Layout:
 *   1. WorkshopSurface — header + project grid on dark charcoal
 *
 * Identity: Dark charcoal (#0d0d14), teal accents hsl(172 55% 38%).
 * Density: MEDIUM — project grid, no overload.
 * Motion: moderate — purposeful transitions.
 *
 * Canon: V7-SURFACES-001 · K-04+K-06+K-07
 * @framer+@cursor | 2026-03-28
 */

import WorkshopSurface from "@/components/workshop-surface/WorkshopSurface";
import WaitlistBanner from "@/components/access/WaitlistBanner";

export default function WorkshopPage() {
  return (
    <div
      style={{
        background: "#0d0d14",
        minHeight: "100svh",
        /* Subtle grid substrate via CSS */
        backgroundImage: `
          linear-gradient(rgba(172,210,200,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(172,210,200,0.025) 1px, transparent 1px)
        `,
        backgroundSize: "48px 48px",
      }}
    >
      <WorkshopSurface />
      <WaitlistBanner />
    </div>
  );
}
