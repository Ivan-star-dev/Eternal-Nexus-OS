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
  // Prefer Web Crypto for session IDs to reduce collision risk.
  if (typeof crypto !== 'undefined') {
    if (typeof (crypto as Crypto).randomUUID === 'function') {
      return (crypto as Crypto).randomUUID();
    }
    if (typeof (crypto as Crypto).getRandomValues === 'function') {
      const bytes = new Uint8Array(16);
      (crypto as Crypto).getRandomValues(bytes);
      return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
    }
  }

  // Last-resort fallback: combine timestamp with Math.random for extra entropy.
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  const cryptoObj = (typeof globalThis !== 'undefined' && (globalThis as any).crypto) || undefined;

  if (cryptoObj?.randomUUID) {
    // Use native UUID and trim to 8 chars to preserve existing length characteristics
    return cryptoObj.randomUUID().replace(/-/g, '').slice(0, 8);
  }

  if (cryptoObj?.getRandomValues) {
    const bytes = new Uint8Array(8);
    cryptoObj.getRandomValues(bytes);
    // Map bytes to a base36-like alphabet to keep the previous style (a-z0-9)
    const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
    let id = '';
    for (let i = 0; i < bytes.length; i++) {
      id += alphabet[bytes[i] % alphabet.length];
    }
    return id;
  }

  // Fallback for very old environments: non-cryptographic, but avoids breaking behavior
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
    if (stored) {
      // Same-subject resume — restore continuity
      if (stored.re_entry_point && stored.subject === subject) {
        const resumed: SessionState = { ...stored, is_resume: true };
        setSession(resumed);
        return resumed;
      }

      // A live Nexus swarm session is active — a project-review call must not
      // overwrite it. Preserve the Nexus session and only note the new subject.
      const isNexusSessionLive = stored.re_entry_point.startsWith('resume-swarm:');
      if (isNexusSessionLive && intention === 'project-review') {
        // Carry Nexus session forward; update subject so DossierCard can match
        const preserved: SessionState = { ...stored, subject, is_resume: stored.is_resume };
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
      const updated = { ...prev, latest_fruit: fruit };
      return updated;
    });
  };

  const updateReEntry = (point: string) => {
    setSession(prev => {
      if (!prev) return prev;
      // Do NOT touch is_resume here. Re-entry tracking records position,
      // it does not change session type. is_resume is only set by startSession.
      const updated = { ...prev, re_entry_point: point };
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
