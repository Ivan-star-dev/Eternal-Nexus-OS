/**
 * SESSION-CONTINUITY-001
 * Browser-safe session context — V10 REAL upgrade.
 * Adds: TTL validation (7d), scroll position, open panels, ts_last_active.
 * Persists to localStorage. Uses classify() + route() for cold starts.
 * No API calls. No cloud dependency.
 */

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { TrinityFace } from '@/lib/memory/types';
import { classify } from '@/lib/memory/classifier';
import { route } from '@/lib/memory/routing';

const STORAGE_KEY = 'nxos_session';
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface ScrollSnapshot {
  path: string;
  y: number;
}

export interface SessionState {
  session_id: string;
  active_face: TrinityFace;
  re_entry_point: string;
  latest_fruit: string;
  next_expected_step: string;
  subject: string;
  ts_start: string;
  ts_last_active: string;
  is_resume: boolean;
  // V10 REAL additions
  scroll_snapshot: ScrollSnapshot | null;
  open_panels: string[];
}

interface SessionContextValue {
  session: SessionState | null;
  startSession: (subject: string, intention: string) => SessionState;
  updateFruit: (fruit: string) => void;
  updateReEntry: (point: string) => void;
  updateScrollSnapshot: (snapshot: ScrollSnapshot) => void;
  openPanel: (panelId: string) => void;
  closePanel: (panelId: string) => void;
  clearSession: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function isSessionExpired(s: SessionState): boolean {
  const lastActive = s.ts_last_active ?? s.ts_start;
  const age = Date.now() - new Date(lastActive).getTime();
  return age > SESSION_TTL_MS;
}

function loadFromStorage(): SessionState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SessionState;
    if (isSessionExpired(parsed)) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function saveToStorage(s: SessionState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    // storage unavailable — fail silently
  }
}

function touch(s: SessionState): SessionState {
  return { ...s, ts_last_active: new Date().toISOString() };
}

function buildFreshSession(subject: string, intention: string): SessionState {
  const classification = classify({ subject, intention });
  const routing = route(classification);
  const now = new Date().toISOString();
  return {
    session_id: `SES-${new Date().toISOString().slice(0, 10)}-${generateId()}`,
    active_face: routing.face,
    re_entry_point: '',
    latest_fruit: '',
    next_expected_step: classification.next_expected_step,
    subject,
    ts_start: now,
    ts_last_active: now,
    is_resume: false,
    scroll_snapshot: null,
    open_panels: [],
  };
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SessionState | null>(() => {
    const stored = loadFromStorage();
    if (stored && stored.re_entry_point) {
      return touch({ ...stored, is_resume: true });
    }
    return stored ? touch(stored) : null;
  });

  // Throttled scroll save — capture position on scroll, debounced 400ms
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const handleScroll = () => {
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
      scrollTimer.current = setTimeout(() => {
        setSession(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            scroll_snapshot: { path: window.location.pathname, y: window.scrollY },
            ts_last_active: new Date().toISOString(),
          };
        });
      }, 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
    };
  }, []);

  // Restore scroll position on navigation to matching path
  useEffect(() => {
    if (!session?.scroll_snapshot) return;
    if (session.scroll_snapshot.path === window.location.pathname) {
      window.scrollTo({ top: session.scroll_snapshot.y, behavior: 'instant' });
    }
  }, [session?.session_id]); // only on session change, not every scroll update

  useEffect(() => {
    if (session) saveToStorage(session);
  }, [session]);

  const startSession = (subject: string, intention: string): SessionState => {
    const stored = loadFromStorage();
    if (stored) {
      if (stored.re_entry_point && stored.subject === subject) {
        const resumed = touch({ ...stored, is_resume: true });
        setSession(resumed);
        return resumed;
      }

      const isNexusSessionLive = stored.re_entry_point.startsWith('resume-swarm:');
      if (isNexusSessionLive && intention === 'project-review') {
        const preserved = touch({ ...stored, subject, is_resume: stored.is_resume });
        setSession(preserved);
        return preserved;
      }
    }
    const fresh = buildFreshSession(subject, intention);
    setSession(fresh);
    return fresh;
  };

  const updateFruit = (fruit: string) => {
    setSession(prev => {
      if (!prev) return prev;
      return touch({ ...prev, latest_fruit: fruit });
    });
  };

  const updateReEntry = (point: string) => {
    setSession(prev => {
      if (!prev) return prev;
      return touch({ ...prev, re_entry_point: point });
    });
  };

  const updateScrollSnapshot = (snapshot: ScrollSnapshot) => {
    setSession(prev => {
      if (!prev) return prev;
      return touch({ ...prev, scroll_snapshot: snapshot });
    });
  };

  const openPanel = (panelId: string) => {
    setSession(prev => {
      if (!prev) return prev;
      if (prev.open_panels.includes(panelId)) return prev;
      return touch({ ...prev, open_panels: [...prev.open_panels, panelId] });
    });
  };

  const closePanel = (panelId: string) => {
    setSession(prev => {
      if (!prev) return prev;
      return touch({ ...prev, open_panels: prev.open_panels.filter(p => p !== panelId) });
    });
  };

  const clearSession = () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    setSession(null);
  };

  return (
    <SessionContext.Provider value={{
      session,
      startSession,
      updateFruit,
      updateReEntry,
      updateScrollSnapshot,
      openPanel,
      closePanel,
      clearSession,
    }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}
