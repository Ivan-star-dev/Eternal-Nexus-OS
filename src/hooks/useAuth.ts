/**
 * useAuth — Ruberra auth hook
 * V8-AUTH-001 | K-07 IMPL
 * Wraps Supabase auth.signIn / signUp / signOut, surfaces RuberraUser.
 */

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { buildRuberraUser, type RuberraUser } from '@/lib/auth/userModel'

interface UseAuthReturn {
  user: RuberraUser | null
  isLoading: boolean
  isPremium: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<RuberraUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false)
      return
    }

    // Bootstrap: load existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ? buildRuberraUser(session.user) : null)
      setIsLoading(false)
    })

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? buildRuberraUser(session.user) : null)
      setIsLoading(false)
    })

    return () => subscription?.unsubscribe()
  }, [])

  const signIn = useCallback(async (email: string, password: string): Promise<void> => {
    if (!supabase) return
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }, [])

  const signUp = useCallback(async (email: string, password: string, name: string): Promise<void> => {
    if (!supabase) return
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: name,
          access_tier: 'public',
          primary_portal: 'lab',
        },
        emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
      },
    })
    if (error) throw error
  }, [])

  const signOut = useCallback(async (): Promise<void> => {
    if (!supabase) return
    try {
      await supabase.auth.signOut()
    } catch {
      // Silent fail — UI already reflects signed-out state via onAuthStateChange
    }
    setUser(null)
  }, [])

  return {
    user,
    isLoading,
    isPremium: user?.accessTier === 'premium',
    signIn,
    signUp,
    signOut,
  }
}
