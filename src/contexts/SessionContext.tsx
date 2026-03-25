/**
 * SESSION-AWARE-PRODUCT-INTEGRATION-001
 * Browser-safe session context.
 * Persists to localStorage. Uses classify() + route() for cold starts.
 * No API calls. No cloud dependency.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { TrinityFace } from '@/lib/memory/types';
import { classify } from '@/lib/memory/classifier';
import { route } from '@/lib/memory/routing';

const STORAGE_KEY = 'nxos_session';

export interface SessionState {
  session_id: string;
  active_face: TrinityFace;
  re_entry_point: string;
  latest_fruit: string;
  next_expected_step: string;
  subject: string;
  ts_start: string;
  is_resume: boolean;
}

interface SessionContextValue {
  session: SessionState | null;
  startSession: (subject: string, intention: string) => SessionState;
  updateFruit: (fruit: string) => void;
  updateReEntry: (point: string) => void;
  clearSession: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function loadFromStorage(): SessionState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionState;
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

function buildFreshSession(subject: string, intention: string): SessionState {
  const classification = classify({ subject, intention });
  const routing = route(classification);
  return {
    session_id: `SES-${new Date().toISOString().slice(0, 10)}-${generateId()}`,
    active_face: routing.face,
    re_entry_point: '',
    latest_fruit: '',
    next_expected_step: classification.next_expected_step,
    subject,
    ts_start: new Date().toISOString(),
    is_resume: false,
  };
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SessionState | null>(() => {
    const stored = loadFromStorage();
    if (stored && stored.re_entry_point) {
      // Hydrate existing session as resume — skip re-classify
      return { ...stored, is_resume: true };
    }
    // Cold start — classify with empty subject (will be updated on first startSession call)
    return stored ?? null;
  });

  useEffect(() => {
    if (session) saveToStorage(session);
  }, [session]);

  const startSession = (subject: string, intention: string): SessionState => {
    const stored = loadFromStorage();
    if (stored && stored.re_entry_point && stored.subject === subject) {
      // Resume existing session for same subject
      const resumed: SessionState = { ...stored, is_resume: true };
      setSession(resumed);
      return resumed;
    }
    const fresh = buildFreshSession(subject, intention);
    setSession(fresh);
    return fresh;
  };

  const updateFruit = (fruit: string) => {
    setSession(prev => {
      if (!prev) return prev;
      const updated = { ...prev, latest_fruit: fruit };
      return updated;
    });
  };

  const updateReEntry = (point: string) => {
    setSession(prev => {
      if (!prev) return prev;
      const updated = { ...prev, re_entry_point: point, is_resume: false };
      return updated;
    });
  };

  const clearSession = () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    setSession(null);
  };

  return (
    <SessionContext.Provider value={{ session, startSession, updateFruit, updateReEntry, clearSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}
