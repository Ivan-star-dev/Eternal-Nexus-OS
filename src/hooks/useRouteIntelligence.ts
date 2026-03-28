/**
 * ROUTE-INTELLIGENCE-001
 * React hook — wires engine to live session + artifact state.
 * Re-computes when session changes or artifact store refreshes.
 */

import { useEffect, useState } from 'react';
import { useSession } from '@/contexts/SessionContext';
import { getRecentArtifacts } from '@/lib/artifacts/store';
import { resolveRouteIntelligence } from '@/lib/route-intelligence/engine';
import type { RouteAction } from '@/lib/route-intelligence/engine';

interface UseRouteIntelligenceResult {
  primary: RouteAction | null;
  alternatives: RouteAction[];
  reasoning: string;
  refresh: () => void;
}

export function useRouteIntelligence(): UseRouteIntelligenceResult {
  const { session } = useSession();
  const [result, setResult] = useState<ReturnType<typeof resolveRouteIntelligence>>({
    primary: null,
    alternatives: [],
    reasoning: '',
  });

  const compute = () => {
    const artifacts = getRecentArtifacts(20);
    const path = window.location.pathname;
    const next = resolveRouteIntelligence({ session, recentArtifacts: artifacts, currentPath: path });
    setResult(next);
  };

  useEffect(() => {
    compute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.session_id, session?.is_resume, session?.re_entry_point]);

  return { ...result, refresh: compute };
}
