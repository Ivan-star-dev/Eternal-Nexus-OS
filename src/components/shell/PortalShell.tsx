/**
 * PortalShell.tsx
 * Atmospheric wrapper — applies portal identity (colors, ambient, grid, grain)
 * to any portal. Makes the 9 distinct portal identities tangible in UI.
 *
 * Usage:
 *   <PortalShell portalId="lab">
 *     <LabPage />
 *   </PortalShell>
 *
 * Or auto-detects from current path:
 *   <PortalShell>
 *     <LabPage />
 *   </PortalShell>
 *
 * Canon: GAP-CLOSURE-V10-001 · Gap 2 + Gap 7
 * @claude | 2026-03-28
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  buildPortalWrapperStyle,
  buildAmbientOverlayStyle,
  buildGridOverlayStyle,
  getAtmosphereForPath,
  getAtmosphereForPortal,
} from '@/lib/atmosphere/controller';
import type { PortalId } from '@/lib/portal/identity';

interface PortalShellProps {
  portalId?: PortalId;
  children: React.ReactNode;
  /** Override min-height (default: 100svh) */
  minHeight?: string;
  /** Whether to animate in on mount */
  animate?: boolean;
}

export default function PortalShell({
  portalId,
  children,
  minHeight = '100svh',
  animate = true,
}: PortalShellProps) {
  const resolvedId: PortalId =
    portalId ??
    (getAtmosphereForPath(
      typeof window !== 'undefined' ? window.location.pathname : '/'
    ).identity.id as PortalId);

  const wrapperStyle = buildPortalWrapperStyle(resolvedId);
  const ambientStyle = buildAmbientOverlayStyle(resolvedId);
  const gridStyle = buildGridOverlayStyle(resolvedId);
  const atmosphere = getAtmosphereForPortal(resolvedId);

  return (
    <div
      style={{
        ...wrapperStyle,
        minHeight,
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      {/* Ambient glow layer */}
      <div aria-hidden style={ambientStyle} />

      {/* Engineering grid — fidelity-aware */}
      {gridStyle && (
        <div aria-hidden style={gridStyle} />
      )}

      {/* Grain overlay — fidelity-aware */}
      {atmosphere.grain_opacity > 0 && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 9990,
            opacity: atmosphere.grain_opacity,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '256px 256px',
            mixBlendMode: 'overlay',
          }}
        />
      )}

      {/* Ambient pulse — breathing glow for living portals */}
      {atmosphere.has_pulse && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: `radial-gradient(ellipse 30% 30% at 50% 50%, ${atmosphere.accent}08 0%, transparent 70%)`,
            animation: 'portal-pulse 4s ease-in-out infinite',
            zIndex: 0,
          }}
        />
      )}

      {/* Content — above all overlay layers */}
      {animate ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          {children}
        </motion.div>
      ) : (
        <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
      )}

      <style>{`
        @keyframes portal-pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
