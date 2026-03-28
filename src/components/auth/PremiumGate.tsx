/**
 * PremiumGate — Access tier guard for premium portal sections
 * V8-AUTH-001 | K-08 PIPELINE
 * If user.accessTier !== 'premium', renders upgrade prompt.
 */

import type { ReactNode } from 'react'
import { useAuth } from '@/hooks/useAuth'

interface PremiumGateProps {
  children: ReactNode
  fallback?: ReactNode
}

function UpgradePrompt() {
  return (
    <div
      style={{
        background: '#0a0a1a',
        border: '1px solid rgba(59,130,246,0.3)',
        borderRadius: '1rem',
        padding: '2rem',
        textAlign: 'center',
        maxWidth: '480px',
        margin: '0 auto',
      }}
    >
      <p
        style={{
          fontSize: '0.6875rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#3b82f6',
          marginBottom: '0.75rem',
          marginTop: 0,
        }}
      >
        Ruberra Premium
      </p>

      <h3
        style={{
          color: '#f1f5f9',
          fontSize: '1.25rem',
          fontWeight: 600,
          margin: '0 0 0.75rem',
        }}
      >
        Premium Access
      </h3>

      <p
        style={{
          color: '#94a3b8',
          fontSize: '0.9375rem',
          lineHeight: 1.6,
          margin: '0 0 1.5rem',
        }}
      >
        This section is exclusive to Premium members.
        <br />
        Unlock full access to all portals, tools and live sessions.
      </p>

      <a
        href="/waitlist"
        style={{
          display: 'inline-block',
          padding: '0.625rem 1.5rem',
          background: '#3b82f6',
          color: '#fff',
          borderRadius: '0.5rem',
          fontSize: '0.9375rem',
          fontWeight: 600,
          textDecoration: 'none',
          transition: 'opacity 0.15s',
        }}
      >
        Join Waitlist
      </a>
    </div>
  )
}

export function PremiumGate({ children, fallback }: PremiumGateProps) {
  const { isPremium, isLoading } = useAuth()

  if (isLoading) return null

  if (!isPremium) {
    return <>{fallback ?? <UpgradePrompt />}</>
  }

  return <>{children}</>
}
