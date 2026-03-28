/**
 * Session Persistence — Supabase (authed) | localStorage (anon)
 * V8-AUTH-001 | K-07 IMPL
 *
 * Table definition (run as Supabase migration — not executed here):
 *
 * CREATE TABLE IF NOT EXISTS user_sessions (
 *   id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 *   user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 *   snapshot_json jsonb NOT NULL,
 *   updated_at  timestamptz NOT NULL DEFAULT now(),
 *   UNIQUE (user_id)
 * );
 *
 * ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
 *
 * CREATE POLICY "Users manage own session"
 *   ON user_sessions FOR ALL
 *   USING (auth.uid() = user_id)
 *   WITH CHECK (auth.uid() = user_id);
 */

import { supabase } from '@/integrations/supabase/client'
import type { SessionSnapshot } from '@/lib/portal/types'

const LOCAL_KEY = 'ruberra:session:snapshot'

/**
 * Save portal snapshot.
 * – Authenticated: upsert into `user_sessions` (Supabase).
 * – Anonymous: write to localStorage.
 */
export async function saveSessionSnapshot(
  snapshot: SessionSnapshot,
  userId?: string
): Promise<void> {
  if (userId && supabase) {
    try {
      await supabase
        .from('user_sessions')
        .upsert(
          {
            user_id: userId,
            snapshot_json: snapshot as unknown as Record<string, unknown>,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        )
    } catch {
      // Silent fail — session persistence must never break the app
    }
    return
  }

  // Fallback: localStorage for anonymous users
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(snapshot))
  } catch {
    // Storage unavailable — silent fail
  }
}

/**
 * Load portal snapshot.
 * – Authenticated: try Supabase first, fall back to localStorage.
 * – Anonymous: localStorage only.
 */
export async function loadSessionSnapshot(
  userId?: string
): Promise<SessionSnapshot | null> {
  if (userId && supabase) {
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('snapshot_json')
        .eq('user_id', userId)
        .maybeSingle()

      if (!error && data?.snapshot_json) {
        return data.snapshot_json as unknown as SessionSnapshot
      }
    } catch {
      // Fall through to localStorage
    }
  }

  // localStorage fallback
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    if (!raw) return null
    return JSON.parse(raw) as SessionSnapshot
  } catch {
    return null
  }
}
