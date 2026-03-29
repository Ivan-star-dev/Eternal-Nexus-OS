/**
 * NextStepHint.tsx
 * Contextual route intelligence surface — non-intrusive, bottom-left.
 * Shows primary suggested next action based on artifact history + session.
 * Dismissible. Auto-hides after 8s if not interacted with.
 *
 * Canon: GAP-CLOSURE-V10-001 · Gap 10 (Route Intelligence) + Gap 11 (Guidance)
 * @claude | 2026-03-28
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouteIntelligence } from '@/hooks/useRouteIntelligence';
import type { RouteAction } from '@/lib/route-intelligence/engine';
import { useNavigate } from 'react-router-dom';
import { saveArtifact } from '@/lib/artifacts/store';
import { useSession } from '@/contexts/SessionContext';
import { useAuth } from '@/contexts/AuthContext';

const EASE = [0.22, 1, 0.36, 1] as const;
const AUTO_DISMISS_MS = 8000;

const ACTION_ICONS: Record<string, string> = {
  'continue-artifact': '→',
  'create-artifact': '+',
  'visit-portal': '⌖',
  'start-session': '◈',
  'archive-stale': '◎',
};

interface NextStepHintProps {
  /** Only show when confidence ≥ this threshold (default: 0.6) */
  minConfidence?: number;
  /** Position: 'bottom-left' | 'bottom-right' (default: bottom-left) */
  position?: 'bottom-left' | 'bottom-right';
}

export default function NextStepHint({
  minConfidence = 0.6,
  position = 'bottom-left',
}: NextStepHintProps) {
  const { primary, refresh } = useRouteIntelligence();
  const { session } = useSession();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState<string | null>(null);

  // Show hint 1.5s after load to avoid visual noise on first paint
  useEffect(() => {
    if (!primary) return;
    if (primary.confidence < minConfidence) return;
    if (dismissed === primary.label) return;

    const show = setTimeout(() => setVisible(true), 1500);
    const hide = setTimeout(() => setVisible(false), 1500 + AUTO_DISMISS_MS);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [primary?.label, minConfidence, dismissed]);

  const handleAction = (action: RouteAction) => {
    setVisible(false);
    setDismissed(action.label);

    switch (action.kind) {
      case 'continue-artifact':
      case 'archive-stale':
        navigate('/lab');
        break;
      case 'create-artifact':
        if (action.payload.artifactKind) {
          saveArtifact({
            session_id: session?.session_id ?? 'anon',
            kind: action.payload.artifactKind,
            title: `New ${action.payload.artifactKind}`,
            summary: 'Created from Next Step hint.',
            content: '',
            source: 'lab',
            userId: user?.id,
          });
          refresh();
          navigate('/lab');
        }
        break;
      case 'visit-portal':
        if (action.payload.portal) navigate(`/${action.payload.portal}`);
        break;
      case 'start-session':
        navigate('/lab');
        break;
    }
  };

  const positionStyle =
    position === 'bottom-left'
      ? { left: '24px', bottom: '24px' }
      : { right: '24px', bottom: '24px' };

  return (
    <AnimatePresence>
      {visible && primary && primary.confidence >= minConfidence && (
        <motion.div
          key={primary.label}
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.97 }}
          transition={{ duration: 0.35, ease: EASE }}
          style={{
            position: 'fixed',
            ...positionStyle,
            zIndex: 9000,
            maxWidth: '300px',
            background: 'rgba(6,12,20,0.92)',
            border: '1px solid rgba(0,170,255,0.18)',
            borderRadius: '12px',
            padding: '14px 16px',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: '0 8px 32px -8px rgba(0,0,0,0.6)',
            pointerEvents: 'auto',
          }}
        >
          {/* Header row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
            }}
          >
            <span
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '8px',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: 'rgba(0,170,255,0.4)',
              }}
            >
              Next Step
            </span>
            <button
              onClick={() => { setVisible(false); setDismissed(primary.label); }}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(150,175,200,0.4)',
                cursor: 'pointer',
                fontSize: '12px',
                lineHeight: 1,
                padding: '2px 4px',
              }}
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>

          {/* Action button */}
          <motion.button
            onClick={() => handleAction(primary)}
            whileHover={{ borderColor: 'rgba(0,170,255,0.35)', backgroundColor: 'rgba(0,170,255,0.06)' }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              background: 'rgba(0,170,255,0.03)',
              border: '1px solid rgba(0,170,255,0.12)',
              borderRadius: '8px',
              padding: '10px 12px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'border-color 0.2s, background 0.2s',
            }}
          >
            <span
              style={{
                fontSize: '14px',
                color: 'rgba(0,170,255,0.55)',
                lineHeight: 1,
                marginTop: '1px',
                flexShrink: 0,
              }}
            >
              {ACTION_ICONS[primary.kind] ?? '→'}
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <span
                style={{
                  fontFamily: 'Syne, system-ui, sans-serif',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'rgba(210,228,245,0.88)',
                  letterSpacing: '-0.01em',
                  lineHeight: 1.3,
                }}
              >
                {primary.label}
              </span>
              <span
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '11px',
                  color: 'rgba(130,165,200,0.5)',
                  lineHeight: 1.5,
                }}
              >
                {primary.description}
              </span>
            </div>
          </motion.button>

          {/* Confidence bar */}
          <div
            style={{
              marginTop: '10px',
              height: '2px',
              background: 'rgba(0,170,255,0.08)',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: AUTO_DISMISS_MS / 1000, ease: 'linear' }}
              style={{
                height: '100%',
                background: 'rgba(0,170,255,0.35)',
                borderRadius: '2px',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
