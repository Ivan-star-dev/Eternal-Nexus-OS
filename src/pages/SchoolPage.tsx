/**
 * SchoolPage.tsx — /school route
 * Bridge Nova face — learning portal.
 *
 * Layout:
 *   1. SchoolNav — minimal sticky nav with progress + back link
 *   2. SchoolSurface — learning path content
 *
 * Identity: Deep navy (#0a0f1e), warm gold accents.
 * Density: LOW — one concept at a time, mobile-first.
 *
 * Canon: V7-SURFACES-001 · K-04+K-06+K-07
 * @framer+@cursor | 2026-03-28
 */

import SchoolNav from "@/components/school-surface/SchoolNav";
import SchoolSurface from "@/components/school-surface/SchoolSurface";

export default function SchoolPage() {
  return (
    <div
      style={{
        background: "#0a0f1e",
        minHeight: "100svh",
      }}
    >
      <SchoolNav />
      <SchoolSurface />
    </div>
  );
}
