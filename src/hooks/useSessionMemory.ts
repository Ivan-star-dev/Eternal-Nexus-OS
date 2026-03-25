/**
 * useSessionMemory — Eternal Memory OS · V4-SESSION-001
 *
 * Persists key V4 session state to localStorage across visits:
 *   - lastPage        : last pathname the user was on
 *   - lastGlobeFocus  : last country/region focused on the globe
 *   - lastProject     : last project id opened
 *   - visitCount      : total session starts
 *   - updatedAt       : ISO timestamp of last write
 *
 * Designed to be called once via <SessionBoot /> inside BrowserRouter.
 * Consumers can call setGlobeFocus / setLastProject anywhere in the tree.
 */

import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

const STORAGE_KEY = 'nexus:session';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SessionSnapshot {
  lastPage: string;
  lastGlobeFocus: string | null;
  lastProject: string | null;
  visitCount: number;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Storage helpers
// ---------------------------------------------------------------------------

function storageAvailable(): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    window.localStorage.setItem('__nexus_sess_probe__', '1');
    window.localStorage.removeItem('__nexus_sess_probe__');
    return true;
  } catch {
    return false;
  }
}

export function readSessionSnapshot(): SessionSnapshot | null {
  if (!storageAvailable()) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionSnapshot;
  } catch {
    return null;
  }
}

function writeSessionSnapshot(patch: Partial<Omit<SessionSnapshot, 'updatedAt'>>): void {
  if (!storageAvailable()) return;
  try {
    const current = readSessionSnapshot() ?? {
      lastPage: '/',
      lastGlobeFocus: null,
      lastProject: null,
      visitCount: 0,
    };
    const next: SessionSnapshot = {
      ...current,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Quota exceeded or private browsing — fail silently
  }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useSessionMemory() {
  const location = useLocation();

  // Increment visit count on first mount of this session
  useEffect(() => {
    const current = readSessionSnapshot();
    writeSessionSnapshot({ visitCount: (current?.visitCount ?? 0) + 1 });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Track page on every navigation
  useEffect(() => {
    writeSessionSnapshot({ lastPage: location.pathname });
  }, [location.pathname]);

  const setGlobeFocus = useCallback((countryId: string | null) => {
    writeSessionSnapshot({ lastGlobeFocus: countryId });
  }, []);

  const setLastProject = useCallback((projectId: string | null) => {
    writeSessionSnapshot({ lastProject: projectId });
  }, []);

  const getSnapshot = useCallback((): SessionSnapshot | null => {
    return readSessionSnapshot();
  }, []);

  return { setGlobeFocus, setLastProject, getSnapshot };
}
