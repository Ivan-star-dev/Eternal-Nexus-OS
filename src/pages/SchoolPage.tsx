/**
 * SchoolPage.tsx — /school route
 * Bridge Nova face — sovereign learning portal.
 *
 * Layout:
 *   1. SchoolNav — sticky nav with back link
 *   2. SchoolHero — gold sovereign entry (mirrors LabHero dignity)
 *   3. SchoolSurface — learning path content (maturity-wired)
 *   4. WaitlistBanner — unauthenticated visitors
 *
 * Background: transparent — PortalShell via RouteAtmosphereLayer handles identity.
 * Canon: TRI-CORE-PARITY-001 · School sovereign surface
 * @claude | 2026-03-28
 */

import { useEffect } from "react";
import SchoolNav from "@/components/school-surface/SchoolNav";
import SchoolHero from "@/components/school-surface/SchoolHero";
import SchoolSurface from "@/components/school-surface/SchoolSurface";
import WaitlistBanner from "@/components/access/WaitlistBanner";
import { recordVisit } from "@/lib/spawn/returnTracker";

export default function SchoolPage() {
  useEffect(() => {
    recordVisit('school');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ minHeight: "100svh" }}>
      <SchoolNav />
      <SchoolHero />
      {/* Anchor for SchoolHero CTA scroll */}
      <div id="school-learning-path" />
      <SchoolSurface />
      <WaitlistBanner />
    </div>
  );
}
