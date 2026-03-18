/**
 * Nervous System v1 — public API barrel
 *
 * Usage:
 *   import { createNexusClient, createTribunalVerdict } from '@/lib/events';
 */

// Bus
export { createInMemoryBus, getDefaultBus, type NexusEventBus } from './bus';

// Client
export { createNexusClient, type NexusClient, type NexusClientOptions } from './client';

// Schema factories
export {
  SCHEMA_VERSION,
  createTribunalVerdict,
  createTribunalEscalation,
  createAtlasMarker,
  createAtlasLayerUpdate,
  createIndexEntry,
  createNewsBroadcast,
} from './schema';

// Replay
export { createReplaySession, replaySince, type ReplaySession } from './replay';

// ID utilities
export { makeEventId, seedFromId, fnv1a32 } from './id';

// Validation
export { validateEvent, isNexusEvent } from './validation';

// Observability ledger (dev-only)
export {
  createEventLedger,
  attachLedger,
  initDevLedger,
  getDevLedger,
  type EventLedger,
  type LedgerEntry,
  type LedgerFilter,
  type LedgerStats,
} from './ledger';
