/**
 * PageTransitionLayer.tsx
 * Applies portal-aware Framer Motion transitions on every route change.
 *
 * Reads the from/to portal pair via usePrevious + useLocation,
 * calls resolveTransition() to get the correct animation grammar,
 * and wraps routes in AnimatePresence key=location.key.
 *
 * Transition grammar:
 *   same portal       → soft (0.3s)
 *   lab ↔ nexus       → dominant (0.5s, scale+blur)
 *   cross-family      → full (0.7s, deep overlay)
 *   light tier / rAM  → instant (0s)
 *
 * Canon: LIVING_SYSTEM_MANIFEST.md · @claude · 2026-03-28
 */

import { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { resolveTransition } from '@/lib/transitions/portal-transition';
import { getPortalFromPath } from '@/lib/portal/identity';
import { nexusRuntime } from '@/lib/core/runtime';

interface Props {
  children: React.ReactNode;
}

/**
 * usePrevious — returns the value from the previous render.
 * The ref is updated in useEffect (after render), so during the current
 * render, ref.current is still the previous value.
 */
function usePrevious<T>(value: T): T {
  const ref = useRef<T>(value);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default function PageTransitionLayer({ children }: Props) {
  const location = useLocation();
  const prevPathname = usePrevious(location.pathname);

  const from_portal = getPortalFromPath(prevPathname);
  const to_portal = getPortalFromPath(location.pathname);

  const { config, framer_variants } = resolveTransition({ from_portal, to_portal });

  return (
    <AnimatePresence
      mode="wait"
      onExitComplete={() => nexusRuntime.transitionEnded()}
    >
      <motion.div
        key={location.key}
        initial={framer_variants.initial}
        animate={framer_variants.animate}
        exit={framer_variants.exit}
        style={{ width: '100%' }}
        data-portal-transition={config.kind}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
