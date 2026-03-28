/**
 * ATMOSPHERE-CONTROLLER-001
 * React hook — returns current portal atmosphere state.
 * Updates when route changes.
 */

import { useEffect, useState } from 'react';
import { getAtmosphereForPath, invalidateAtmosphereCache } from '@/lib/atmosphere/controller';
import type { AtmosphereState } from '@/lib/atmosphere/controller';
import { resolveFidelityTier } from '@/lib/fidelity';

export function useAtmosphere(pathOverride?: string): AtmosphereState {
  const path = pathOverride ?? (typeof window !== 'undefined' ? window.location.pathname : '/');

  const [state, setState] = useState<AtmosphereState>(() =>
    getAtmosphereForPath(path)
  );

  useEffect(() => {
    // Invalidate cache and recompute if fidelity changes
    invalidateAtmosphereCache();
    setState(getAtmosphereForPath(path));
  }, [path]);

  // Listen for fidelity override changes
  useEffect(() => {
    const handler = () => {
      invalidateAtmosphereCache();
      setState(getAtmosphereForPath(path));
    };
    window.addEventListener('nxos:fidelity-changed', handler);
    return () => window.removeEventListener('nxos:fidelity-changed', handler);
  }, [path]);

  return state;
}
