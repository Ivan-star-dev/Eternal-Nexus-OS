/**
 * SPAWN-ENTRY-001
 * Real entry pipeline — classifies user entry type, resolves re-entry point,
 * wires session continuity, and emits entry events.
 * Browser-safe: no node imports.
 */

import type { SessionState } from '@/contexts/SessionContext';

export type EntryKind =
  | 'cold-start'      // no prior session — first visit
  | 'resume'          // returning to same session + subject
  | 'reopen'          // returning after TTL gap (context is stale)
  | 'project-visit'   // navigating to a project, may not overwrite nexus session
  | 'portal-shift'    // moving between portals within same session
  | 'direct-link';    // user arrived via direct URL/external link

export interface EntryResolution {
  kind: EntryKind;
  session: SessionState | null;
  re_entry_point: string | null;
  should_restore_scroll: boolean;
  should_restore_panels: boolean;
  greeting: string;              // human-readable entry message for UI
  portal_target: string;         // which portal to land on ('nexus' | 'lab' | 'atlas' | 'home')
}

interface EntryParams {
  path: string;
  subject?: string;
  intention?: string;
  session: SessionState | null;
}

const PORTAL_ROUTES: Record<string, string> = {
  '/': 'home',
  '/nexus': 'nexus',
  '/lab': 'lab',
  '/atlas': 'atlas',
  '/projects': 'projects',
  '/founder': 'founder',
  '/investor': 'investor',
};

function greetForKind(kind: EntryKind, subject?: string): string {
  switch (kind) {
    case 'cold-start':
      return 'Welcome to Ruberra. Where do you want to go?';
    case 'resume':
      return subject
        ? `Welcome back. Continuing: ${subject}`
        : 'Welcome back. Your session is intact.';
    case 'reopen':
      return 'Session context partially restored. Pick up where you left off.';
    case 'project-visit':
      return subject ? `Reviewing: ${subject}` : 'Opening project view.';
    case 'portal-shift':
      return 'Portal shift. Context preserved.';
    case 'direct-link':
      return 'Direct entry. Context loading.';
    default:
      return '';
  }
}

function resolvePortalTarget(path: string): string {
  const normalized = path.split('?')[0].split('#')[0];
  return PORTAL_ROUTES[normalized] ?? 'home';
}

/**
 * resolveEntry — pure function, no side effects.
 * Determines entry kind and what to restore based on current path + session state.
 */
export function resolveEntry(params: EntryParams): EntryResolution {
  const { path, subject, intention, session } = params;
  const portalTarget = resolvePortalTarget(path);

  // No session — cold start
  if (!session) {
    return {
      kind: 'cold-start',
      session: null,
      re_entry_point: null,
      should_restore_scroll: false,
      should_restore_panels: false,
      greeting: greetForKind('cold-start', subject),
      portal_target: portalTarget,
    };
  }

  // Project-visit while Nexus session is live — preserve Nexus context
  if (intention === 'project-visit' && session.re_entry_point.startsWith('resume-swarm:')) {
    return {
      kind: 'project-visit',
      session,
      re_entry_point: session.re_entry_point,
      should_restore_scroll: false, // project pages don't scroll-restore
      should_restore_panels: false,
      greeting: greetForKind('project-visit', subject),
      portal_target: portalTarget,
    };
  }

  // Portal shift — same session, different route
  if (session.re_entry_point && session.active_face) {
    const isPortalShift = intention === 'portal-shift';
    if (isPortalShift) {
      return {
        kind: 'portal-shift',
        session,
        re_entry_point: session.re_entry_point,
        should_restore_scroll: false,
        should_restore_panels: true, // carry panels across portals
        greeting: greetForKind('portal-shift', subject),
        portal_target: portalTarget,
      };
    }
  }

  // Same subject + re-entry point — real resume
  if (session.re_entry_point && (!subject || session.subject === subject)) {
    const scrollMatch = session.scroll_snapshot?.path === path;
    return {
      kind: 'resume',
      session,
      re_entry_point: session.re_entry_point,
      should_restore_scroll: scrollMatch,
      should_restore_panels: session.open_panels.length > 0,
      greeting: greetForKind('resume', session.subject || subject),
      portal_target: portalTarget,
    };
  }

  // Direct link (no prior re-entry context)
  return {
    kind: 'direct-link',
    session,
    re_entry_point: null,
    should_restore_scroll: false,
    should_restore_panels: false,
    greeting: greetForKind('direct-link', subject),
    portal_target: portalTarget,
  };
}

/**
 * buildReEntryPoint — generates a canonical re-entry string from current state.
 * Format: {portal}:{context} e.g. "nexus:research-fusion-plasma" or "resume-swarm:{id}"
 */
export function buildReEntryPoint(portal: string, context: string): string {
  if (portal === 'nexus') return `resume-swarm:${context}`;
  return `${portal}:${context}`;
}
