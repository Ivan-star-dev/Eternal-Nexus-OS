/**
 * ContextualHint — The ONLY guidance UI component
 * V9-GUIDANCE-GOVERNANCE-001 | K-10+K-11
 * Source: RUBERRA_V10_1_MASTER.md §GUIDANCE MODEL + §SPATIAL UX LAWS
 *
 * GOVERNANCE LOCKS:
 * - NEVER blocks interaction (pointer-events: none except dismiss button)
 * - NEVER covers focal surface
 * - NEVER appears in Deep Focus (portalId: 'focus') — enforced by guidanceModel
 * - Auto-dismisses after 8s
 * - Appears maximum once per portal visit (enforced by caller via trigger lifecycle)
 */

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { resolveGuidanceIntensity } from '@/lib/guidance/guidanceModel'
import type { GuidanceTrigger } from '@/lib/guidance/types'

// ──────────────────────────────────────────────
// PROPS
// ──────────────────────────────────────────────

interface ContextualHintProps {
  trigger: GuidanceTrigger | null
  maturityLevel: 0 | 1 | 2 | 3
  portalDensityCap: 'minimal' | 'low' | 'medium' | 'high'
}

// ──────────────────────────────────────────────
// AUTO-DISMISS DURATION (ms)
// ──────────────────────────────────────────────

const AUTO_DISMISS_MS = 8000

// ──────────────────────────────────────────────
// COMPONENT
// ──────────────────────────────────────────────

export function ContextualHint({
  trigger,
  maturityLevel,
  portalDensityCap,
}: ContextualHintProps) {
  const guidance = resolveGuidanceIntensity(maturityLevel, portalDensityCap, trigger)

  const [visible, setVisible] = useState(guidance.shouldShow)

  // Reset visibility when trigger changes
  useEffect(() => {
    setVisible(guidance.shouldShow)
  }, [guidance.shouldShow, trigger?.type, trigger?.portalId])

  // Auto-dismiss after 8 seconds
  useEffect(() => {
    if (!visible) return
    const timer = window.setTimeout(() => setVisible(false), AUTO_DISMISS_MS)
    return () => window.clearTimeout(timer)
  }, [visible, trigger?.type, trigger?.portalId])

  // Intensity 'none' or not showing → render nothing
  if (guidance.intensity === 'none' || !guidance.message) {
    return null
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          // pointer-events: none on container — NEVER blocks interaction
          style={{ pointerEvents: 'none' }}
          className="fixed bottom-6 left-6 z-50 w-[280px]"
        >
          <div
            className="
              relative rounded-xl border border-white/10
              bg-black/60 backdrop-blur-md
              px-4 py-3 shadow-lg
              text-sm text-white/80 leading-snug
            "
          >
            {/* Message text */}
            <p className="pr-6">{guidance.message}</p>

            {/* Dismiss button — restores pointer-events only here */}
            <button
              type="button"
              aria-label="Dismiss hint"
              onClick={() => setVisible(false)}
              style={{ pointerEvents: 'auto' }}
              className="
                absolute top-2 right-2
                flex items-center justify-center
                h-5 w-5 rounded-full
                text-white/40 hover:text-white/80
                transition-colors duration-150
                focus:outline-none focus-visible:ring-1 focus-visible:ring-white/30
              "
            >
              <X size={12} strokeWidth={2} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
