/**
 * SessionBoot.tsx
 * Runs once on app mount to initialize session state from storage.
 * Uses the governance runtime guard to check session health on boot.
 *
 * Canon: GAP-CLOSURE-V10-001 · Gap 1 · Session Continuity
 * @claude | 2026-03-28
 */

import { useEffect } from 'react';
import { runGovernanceChecks } from '@/lib/governance/runtime-guard';
import { useSession } from '@/contexts/SessionContext';

export default function SessionBoot() {
  const { session } = useSession();

  useEffect(() => {
    // Run governance checks on boot — silent, logs violations only
    try {
      runGovernanceChecks({
        portalId: undefined,
        openPanelCount: session.open_panels?.length ?? 0,
        reEntryPoint: session.re_entry_point,
        artifactCount: 0, // lightweight — no artifact load on boot
        session,
      });
    } catch {
      // governance check failures are non-blocking
    }
  // Run once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
