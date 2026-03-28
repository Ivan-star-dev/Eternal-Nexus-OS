/**
 * AuthModal — Sign In / Sign Up modal
 * V8-AUTH-001 | K-08 PIPELINE
 * Dark theme · Framer Motion scale entrance · Electric blue CTAs
 */

import { useState, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

type Tab = 'signin' | 'signup'

const OVERLAY_BG = 'rgba(0,0,0,0.75)'
const MODAL_BG = '#0a0a1a'
const BORDER = '1px solid rgba(59,130,246,0.25)'
const ELECTRIC_BLUE = '#3b82f6'
const INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  padding: '0.625rem 0.875rem',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '0.5rem',
  color: '#e2e8f0',
  fontSize: '0.875rem',
  outline: 'none',
  boxSizing: 'border-box',
}
const LABEL_STYLE: React.CSSProperties = {
  display: 'block',
  marginBottom: '0.375rem',
  fontSize: '0.8125rem',
  color: '#94a3b8',
  letterSpacing: '0.01em',
}
const ERROR_STYLE: React.CSSProperties = {
  fontSize: '0.8125rem',
  color: '#f87171',
  marginTop: '0.5rem',
  textAlign: 'center',
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [tab, setTab] = useState<Tab>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  const { signIn, signUp } = useAuth()

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setName('')
    setError(null)
  }

  const switchTab = (next: Tab) => {
    setTab(next)
    resetForm()
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsPending(true)
    try {
      if (tab === 'signin') {
        await signIn(email, password)
      } else {
        await signUp(email, password, name)
      }
      resetForm()
      onClose()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Authentication failed.'
      setError(message)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9998,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: OVERLAY_BG,
          }}
          onClick={onClose}
        >
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1.0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '420px',
              background: MODAL_BG,
              border: BORDER,
              borderRadius: '1rem',
              padding: '2rem',
              zIndex: 9999,
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              aria-label="Close modal"
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                fontSize: '1.25rem',
                lineHeight: 1,
                padding: '0.25rem',
              }}
            >
              ✕
            </button>

            {/* Header */}
            <h2 style={{ color: '#f1f5f9', fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', marginTop: 0 }}>
              {tab === 'signin' ? 'Welcome back' : 'Join Ruberra'}
            </h2>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.5rem', padding: '0.25rem' }}>
              {(['signin', 'signup'] as Tab[]).map(t => (
                <button
                  key={t}
                  onClick={() => switchTab(t)}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    transition: 'all 0.15s',
                    background: tab === t ? ELECTRIC_BLUE : 'transparent',
                    color: tab === t ? '#fff' : '#64748b',
                  }}
                >
                  {t === 'signin' ? 'Sign In' : 'Sign Up'}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate>
              {tab === 'signup' && (
                <div style={{ marginBottom: '1rem' }}>
                  <label style={LABEL_STYLE} htmlFor="auth-name">Display Name</label>
                  <input
                    id="auth-name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your name"
                    required
                    autoComplete="name"
                    style={INPUT_STYLE}
                  />
                </div>
              )}

              <div style={{ marginBottom: '1rem' }}>
                <label style={LABEL_STYLE} htmlFor="auth-email">Email</label>
                <input
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  style={INPUT_STYLE}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={LABEL_STYLE} htmlFor="auth-password">Password</label>
                <input
                  id="auth-password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete={tab === 'signin' ? 'current-password' : 'new-password'}
                  style={INPUT_STYLE}
                />
              </div>

              {error && <p style={ERROR_STYLE}>{error}</p>}

              <button
                type="submit"
                disabled={isPending}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: ELECTRIC_BLUE,
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#fff',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  cursor: isPending ? 'not-allowed' : 'pointer',
                  opacity: isPending ? 0.7 : 1,
                  transition: 'opacity 0.15s',
                  marginTop: error ? '0.75rem' : 0,
                }}
              >
                {isPending
                  ? 'Please wait…'
                  : tab === 'signin'
                  ? 'Sign In'
                  : 'Create Account'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
