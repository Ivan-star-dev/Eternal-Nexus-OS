/**
 * useOrganism.ts — React hook for consuming the NexusRuntime organism state.
 *
 * Wires the runtime to React:
 * - Syncs session on every SessionContext change
 * - Syncs evolution on every useEvolution change
 * - Records portal entry/exit on route change
 * - Returns the full OrganismState for any consumer
 *
 * Usage:
 *   const organism = useOrganism();
 *   organism.memory.continuity_score  // 0–1
 *   organism.intelligence.maturity_level
 *   organism.environment.fidelity_tier
 *
 * Canon: LIVING_SYSTEM_MANIFEST.md · @claude · 2026-03-28
 */

import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { nexusRuntime } from '@/lib/core/runtime';
import type { OrganismState } from '@/lib/core/organism-state';
import { useSession } from '@/contexts/SessionContext';
import { useEvolution } from '@/hooks/useEvolution';
import { getPortalFromPath } from '@/lib/portal/identity';

export function useOrganism(): OrganismState {
  const [state, setState] = useState<OrganismState>(() => nexusRuntime.getState());
  const { session } = useSession();
  const location = useLocation();
  const { maturity } = useEvolution();

  // Subscribe to runtime state changes
  useEffect(() => {
    return nexusRuntime.subscribe(setState);
  }, []);

  // Sync session to runtime memory layer
  useEffect(() => {
    nexusRuntime.syncSession({
      session_id: session.session_id,
      subject: session.subject ?? '',
      re_entry_point: session.re_entry_point,
      is_resume: session.is_resume,
      open_panels: session.open_panels ?? [],
      ts_last_active: session.ts_last_active,
      scroll_snapshot: session.scroll_snapshot ?? undefined,
    });
  }, [
    session.session_id,
    session.re_entry_point,
    session.is_resume,
    session.ts_last_active,
  ]);

  // Sync evolution to runtime intelligence layer
  useEffect(() => {
    nexusRuntime.syncEvolution(maturity);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maturity.level, maturity.totalSessions]);

  // Record portal entry on route change
  useEffect(() => {
    const portalId = getPortalFromPath(location.pathname);
    if (portalId) {
      nexusRuntime.enterPortal(portalId);
    }
  }, [location.pathname]);

  return state;
}
