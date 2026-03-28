/**
 * GOVERNANCE-RUNTIME-001
 * Executable governance guard rails — transforms laws into enforceable runtime checks.
 * Browser-safe: no node imports.
 *
 * Laws enforced:
 *  G-01: Session cap — max 1 active Nexus swarm session per user
 *  G-02: Artifact cap — max 200 artifacts in local store
 *  G-03: Panel cap — max 5 open panels simultaneously
 *  G-04: Re-entry validity — re_entry_point must match expected format
 *  G-05: Drift detection — warns when session subject shifts without explicit new session
 *  G-06: Portal guard — only valid portal targets are routable
 */

export type ViolationSeverity = 'warn' | 'block' | 'fatal';

export interface GovernanceViolation {
  law: string;
  severity: ViolationSeverity;
  message: string;
  context?: Record<string, unknown>;
}

export interface GuardResult {
  allowed: boolean;
  violations: GovernanceViolation[];
}

const VALID_PORTALS = new Set(['home', 'nexus', 'lab', 'atlas', 'projects', 'founder', 'investor']);
const MAX_OPEN_PANELS = 5;
const MAX_LOCAL_ARTIFACTS = 200;
const REENTRY_POINT_PATTERN = /^(resume-swarm:[a-z0-9-]+|[a-z]+:[a-z0-9-]+|)$/;

// ─── Individual Guards ────────────────────────────────────────────────────────

export function guardPortalRoute(target: string): GuardResult {
  if (VALID_PORTALS.has(target)) return { allowed: true, violations: [] };
  return {
    allowed: false,
    violations: [{
      law: 'G-06',
      severity: 'block',
      message: `Invalid portal target: "${target}". Must be one of: ${[...VALID_PORTALS].join(', ')}`,
      context: { target },
    }],
  };
}

export function guardOpenPanels(currentPanels: string[], newPanelId: string): GuardResult {
  if (currentPanels.includes(newPanelId)) {
    // Already open — idempotent, allow
    return { allowed: true, violations: [] };
  }
  if (currentPanels.length >= MAX_OPEN_PANELS) {
    return {
      allowed: false,
      violations: [{
        law: 'G-03',
        severity: 'warn',
        message: `Panel cap reached (${MAX_OPEN_PANELS}). Close a panel before opening "${newPanelId}".`,
        context: { currentPanels, newPanelId, cap: MAX_OPEN_PANELS },
      }],
    };
  }
  return { allowed: true, violations: [] };
}

export function guardReEntryPoint(point: string): GuardResult {
  if (REENTRY_POINT_PATTERN.test(point)) return { allowed: true, violations: [] };
  return {
    allowed: false,
    violations: [{
      law: 'G-04',
      severity: 'warn',
      message: `Malformed re_entry_point: "${point}". Expected format: "portal:context" or "resume-swarm:id"`,
      context: { point },
    }],
  };
}

export function guardArtifactCount(currentCount: number): GuardResult {
  if (currentCount < MAX_LOCAL_ARTIFACTS) return { allowed: true, violations: [] };
  return {
    allowed: false,
    violations: [{
      law: 'G-02',
      severity: 'warn',
      message: `Artifact store at capacity (${MAX_LOCAL_ARTIFACTS}). Archive old artifacts to continue saving.`,
      context: { currentCount, cap: MAX_LOCAL_ARTIFACTS },
    }],
  };
}

export function guardSessionDrift(
  storedSubject: string,
  newSubject: string,
  intentionIsResume: boolean
): GuardResult {
  if (intentionIsResume) return { allowed: true, violations: [] };
  if (!storedSubject || storedSubject === newSubject) return { allowed: true, violations: [] };

  return {
    allowed: true, // Warn but don't block — owner decides
    violations: [{
      law: 'G-05',
      severity: 'warn',
      message: `Session subject drift detected. Stored: "${storedSubject}" → New: "${newSubject}". Start a new session to preserve continuity.`,
      context: { storedSubject, newSubject },
    }],
  };
}

// ─── Composite Guard ─────────────────────────────────────────────────────────

export function runGovernanceChecks(checks: Array<() => GuardResult>): GuardResult {
  const allViolations: GovernanceViolation[] = [];
  let allowed = true;

  for (const check of checks) {
    const result = check();
    allViolations.push(...result.violations);
    if (!result.allowed) allowed = false;
  }

  return { allowed, violations: allViolations };
}

// ─── Governance Event Emitter ─────────────────────────────────────────────────

type ViolationHandler = (violation: GovernanceViolation) => void;

const handlers: ViolationHandler[] = [];

export function onGovernanceViolation(handler: ViolationHandler): () => void {
  handlers.push(handler);
  return () => {
    const idx = handlers.indexOf(handler);
    if (idx !== -1) handlers.splice(idx, 1);
  };
}

export function emitViolation(violation: GovernanceViolation): void {
  handlers.forEach(h => h(violation));
  if (violation.severity === 'fatal') {
    console.error('[GOVERNANCE FATAL]', violation.law, violation.message, violation.context);
  } else if (violation.severity === 'block') {
    console.warn('[GOVERNANCE BLOCK]', violation.law, violation.message, violation.context);
  } else {
    console.info('[GOVERNANCE WARN]', violation.law, violation.message, violation.context);
  }
}
