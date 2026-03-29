/**
 * TestPage.tsx
 * Lab tri-core portal — test reality.
 * Route: /test
 *
 * Canon: TRI-CORE-PARITY-001 · @claude · 2026-03-29
 */

import { useEffect } from "react";
import TestHero from "@/components/test-surface/TestHero";
import TestBay from "@/components/test-surface/TestBay";
import { recordVisit } from "@/lib/spawn/returnTracker";
import { useSession } from "@/contexts/SessionContext";

export default function TestPage() {
  const { session, startSession } = useSession();

  useEffect(() => {
    if (!session) startSession("Lab Test Portal", "open-test");
    recordVisit("test");
  }, []);

  return (
    <div style={{ minHeight: "100svh" }}>
      <TestHero />
      <TestBay />
    </div>
  );
}
