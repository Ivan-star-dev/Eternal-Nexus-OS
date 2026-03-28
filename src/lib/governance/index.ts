/**
 * GOVERNANCE-RUNTIME-001 — Public API barrel
 */
export type { ViolationSeverity, GovernanceViolation, GuardResult } from './runtime-guard';
export {
  guardPortalRoute,
  guardOpenPanels,
  guardReEntryPoint,
  guardArtifactCount,
  guardSessionDrift,
  runGovernanceChecks,
  onGovernanceViolation,
  emitViolation,
} from './runtime-guard';
