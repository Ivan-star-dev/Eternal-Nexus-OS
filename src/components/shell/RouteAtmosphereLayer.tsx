/**
 * RouteAtmosphereLayer.tsx
 * Applies portal-specific atmospheric identity to every route automatically.
 *
 * Wraps route content in PortalShell using the current path's portal DNA.
 * Utility routes (/system, /access, /privacy, /terms) are skipped — they
 * render without atmospheric overlay.
 *
 * This makes atmosphere universal without modifying individual page files.
 * LabPage's PortalShell wrapper has been removed — this layer covers it.
 *
 * Canon: LIVING_SYSTEM_MANIFEST.md · C-05 (environment is consequence of state)
 * @claude · 2026-03-28
 */

import { useLocation } from 'react-router-dom';
import PortalShell from './PortalShell';

// Routes where atmospheric overlay is not appropriate
const NO_ATMOSPHERE_ROUTES = new Set([
  '/system',
  '/access',
  '/privacy',
  '/terms',
]);

function shouldSkipAtmosphere(pathname: string): boolean {
  if (NO_ATMOSPHERE_ROUTES.has(pathname)) return true;
  // Investor briefing has its own design language
  if (pathname.startsWith('/investor')) return true;
  return false;
}

interface Props {
  children: React.ReactNode;
}

export default function RouteAtmosphereLayer({ children }: Props) {
  const location = useLocation();

  if (shouldSkipAtmosphere(location.pathname)) {
    return <>{children}</>;
  }

  // PortalShell auto-detects portal from window.location.pathname
  // animate=false: PageTransitionLayer owns the enter animation
  return (
    <PortalShell animate={false}>
      {children}
    </PortalShell>
  );
}
