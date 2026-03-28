/**
 * Ruberra User Model
 * V8-AUTH-001 | K-07 IMPL
 * Dual-tier access model: public | premium
 */

import type { User } from '@supabase/supabase-js'

export type AccessTier = 'public' | 'premium'
export type PrimaryPortal = 'lab' | 'school' | 'workshop' | 'world'

export interface RuberraUser {
  id: string
  email: string
  displayName: string
  accessTier: AccessTier
  primaryPortal: PrimaryPortal
  createdAt: string
  lastSeenAt: string
}

/**
 * Derive RuberraUser from Supabase User + user_metadata.
 * Metadata keys written at sign-up: display_name, access_tier, primary_portal.
 */
export function buildRuberraUser(supabaseUser: User): RuberraUser {
  const meta = supabaseUser.user_metadata ?? {}

  const rawTier = meta['access_tier'] as string | undefined
  const accessTier: AccessTier =
    rawTier === 'premium' ? 'premium' : 'public'

  const rawPortal = meta['primary_portal'] as string | undefined
  const validPortals: PrimaryPortal[] = ['lab', 'school', 'workshop', 'world']
  const primaryPortal: PrimaryPortal =
    validPortals.includes(rawPortal as PrimaryPortal)
      ? (rawPortal as PrimaryPortal)
      : 'lab'

  const displayName: string =
    (meta['display_name'] as string | undefined) ??
    supabaseUser.email?.split('@')[0] ??
    'Nexus User'

  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? '',
    displayName,
    accessTier,
    primaryPortal,
    createdAt: supabaseUser.created_at,
    lastSeenAt: supabaseUser.last_sign_in_at ?? supabaseUser.created_at,
  }
}
