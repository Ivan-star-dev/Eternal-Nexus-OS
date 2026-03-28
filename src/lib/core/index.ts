export { bus } from './fusion-bus';
export type { FusionEvent, FusionEventKind } from './fusion-bus';

export { nexusRuntime } from './runtime';

export type {
  OrganismState,
  BootPhase,
  BehavioralType,
  ContinuityScore,
  IdentityLayer,
  MemoryLayer,
  EnvironmentLayer,
  IntelligenceLayer,
  SystemLayer,
} from './organism-state';

export {
  COLD_ORGANISM_STATE,
  computeContinuityScore,
  resolveBehavioralType,
} from './organism-state';
