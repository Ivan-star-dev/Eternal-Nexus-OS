/**
 * NexusSurface.tsx
 * Heaven Lab face — root surface wrapper.
 *
 * Composes:
 *   NexusSurfaceNav  — fixed top navigation (Nexus + 3 links + CTA)
 *   NexusSurfaceHero — first fold with globe slot + headline + CTAs
 *
 * Design contract:
 *   - #0a0a1a as page base (matches dark token --ink-dark)
 *   - No external Layout wrapper — nav is self-contained here
 *   - GrainOverlay + CustomCursor inherited from App.tsx shell
 *   - Mobile-first: 375px viewport safe
 *
 * Canon: NS-1-001 · K-04 SURFACE · K-05 TYPOGRAPHY · K-06 COMPONENT
 */

import NexusSurfaceNav from "./NexusSurfaceNav";
import NexusSurfaceHero from "./NexusSurfaceHero";

export default function NexusSurface() {
  return (
    <div
      style={{
        minHeight: "100svh",
        background: "#0a0a1a",
        overflowX: "hidden",
      }}
    >
      {/* Fixed navigation — Heaven Lab identity */}
      <NexusSurfaceNav />

      {/* Primary hero — first fold, globe slot + headline + CTAs */}
      <NexusSurfaceHero />

      {/* ── Future sections mount here ── */}
      {/*
        The following sections will be wired by @cursor / @claude as NS tasks proceed:
          - NS-2: Lab research trails grid
          - NS-3: Projects showcase
          - NS-4: About / manifesto strip
          - NS-5: Footer / contact
      */}
    </div>
  );
}
