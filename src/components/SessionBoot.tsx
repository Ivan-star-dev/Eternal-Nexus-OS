/**
 * SessionBoot — V4-SESSION-001
 *
 * Activates session memory tracking.
 * For returning visitors (visitCount ≥ 2), renders a brief restore pulse
 * overlay that auto-dismisses after 2.4s.
 *
 * Must be rendered inside BrowserRouter (useLocation dependency).
 * Place once in App.tsx, inside <BrowserRouter>.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSessionMemory, readSessionSnapshot } from '@/hooks/useSessionMemory';

const SessionBoot = () => {
  useSessionMemory();

  const [show, setShow] = useState(false);
  const [visitCount, setVisitCount] = useState(0);

  useEffect(() => {
    // Read snapshot after useSessionMemory has already incremented visitCount
    const snap = readSessionSnapshot();
    if (snap && snap.visitCount >= 2) {
      setVisitCount(snap.visitCount);
      setShow(true);
      const t = setTimeout(() => setShow(false), 2400);
      return () => clearTimeout(t);
    }
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'fixed',
            top: '1.25rem',
            right: '1.25rem',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(10,15,26,0.85)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '4px',
            padding: '0.4rem 0.75rem',
            backdropFilter: 'blur(8px)',
            pointerEvents: 'none',
          }}
        >
          {/* Pulse dot */}
          <motion.span
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.2, repeat: 1, ease: 'easeInOut' }}
            style={{
              display: 'inline-block',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'hsl(45, 80%, 55%)',
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '0.5rem',
              letterSpacing: '0.18em',
              color: 'rgba(148,163,184,0.9)',
              textTransform: 'uppercase',
            }}
          >
            Session restored · visit {visitCount}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SessionBoot;
