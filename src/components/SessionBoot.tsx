/**
 * SessionBoot.tsx
 * Runs once on app mount to check session health via governance guards.
 *
 * Canon: GAP-CLOSURE-V10-001 · Gap 1 · Session Continuity
 * @claude | 2026-03-28
 */

import { useEffect } from 'react';
import { guardArtifactCount, runGovernanceChecks } from '@/lib/governance/runtime-guard';
import { useSession } from '@/contexts/SessionContext';

export default function SessionBoot() {
  const { session } = useSession();

  useEffect(() => {
    // Run lightweight governance checks on boot — non-blocking, logs violations only
    try {
      runGovernanceChecks([
        () => guardArtifactCount(0),
      ]);
    } catch {
      // governance check failures are non-blocking
    }
  // Run once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

