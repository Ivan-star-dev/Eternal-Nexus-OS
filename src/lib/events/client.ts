/**
 * client.ts — Nervous System client for organ subscribers
 *
 * Provides a high-level API for organs (Atlas, Index, News) to:
 *   1. Subscribe to relevant events with auto-filtering
 *   2. Replay missed events on reconnect
 *   3. Publish events back to the bus
 */

import type {
  NexusEvent,
  NexusEventType,
  Organ,
  EventFilter,
  Unsubscribe,
} from '@/types/sacred-flow';
import type { NexusEventBus } from './bus';
import { getDefaultBus } from './bus';
import { createReplaySession, type ReplaySession } from './replay';
import { makeEventId, seedFromId } from './id';

// ---------------------------------------------------------------------------
// Client options
// ---------------------------------------------------------------------------

export interface NexusClientOptions {
  /** Which organ this client represents */
  organ: Organ;
  /** Custom bus (defaults to app-wide singleton) */
  bus?: NexusEventBus;
  /** Event types to subscribe to (defaults to all) */
  types?: NexusEventType[];
  /** Minimum severity filter */
  minSeverity?: number;
}

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

export interface NexusClient {
  /** Subscribe to filtered events. Returns unsubscribe function. */
  subscribe(handler: (event: NexusEvent) => void): Unsubscribe;

  /** Publish an event from this organ. Auto-fills source, id, seed. */
  emit<P>(
    type: NexusEventType,
    payload: P,
    options?: {
      geo?: NexusEvent['geo'];
      severity?: number;
      confidence?: number;
    },
  ): NexusEvent<P> | null;

  /** Get a replay session for catching up after reconnect. */
  replay(): ReplaySession;

  /** The underlying bus (for advanced use). */
  bus: NexusEventBus;
}

/**
 * Create a Nervous System client for an organ.
 *
 * Usage:
 * ```ts
 * const atlas = createNexusClient({
 *   organ: 'atlas',
 *   types: ['tribunal.verdict', 'tribunal.escalation'],
 * });
 *
 * atlas.subscribe((event) => {
 *   // Render marker on globe
 * });
 * ```
 */
export function createNexusClient(options: NexusClientOptions): NexusClient {
  const bus = options.bus ?? getDefaultBus();

  const filter: EventFilter = {
    types: options.types,
    minSeverity: options.minSeverity,
  };

  return {
    subscribe(handler: (event: NexusEvent) => void): Unsubscribe {
      return bus.subscribe(filter, handler);
    },

    emit<P>(
      type: NexusEventType,
      payload: P,
      opts: {
        geo?: NexusEvent['geo'];
        severity?: number;
        confidence?: number;
      } = {},
    ): NexusEvent<P> | null {
      const createdAt = new Date().toISOString();
      const id = makeEventId(type, options.organ, createdAt, payload);

      const event: NexusEvent<P> = {
        id,
        type,
        createdAt,
        source: options.organ,
        geo: opts.geo,
        severity: opts.severity ?? 0.5,
        payload,
        confidence: opts.confidence ?? 0.8,
        seed: seedFromId(id),
        version: 1,
      };

      const accepted = bus.publish(event as NexusEvent);
      return accepted ? event : null;
    },

    replay(): ReplaySession {
      return createReplaySession(bus);
    },

    bus,
  };
}
