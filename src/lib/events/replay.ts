/**
 * replay.ts — Replay cursor management
 *
 * Allows clients to reconnect and resume from where they left off.
 * Cursor is persisted per-subscriber so reconnection is seamless.
 */

import type { NexusEvent, ReplayCursor } from '@/types/sacred-flow';
import type { NexusEventBus } from './bus';

// ---------------------------------------------------------------------------
// Replay session
// ---------------------------------------------------------------------------

export interface ReplaySession {
  /** Fetch next batch of events from cursor position. */
  fetchNext(limit?: number): NexusEvent[];

  /** Current cursor position (last seen event ID). */
  getCursor(): string | undefined;

  /** Reset cursor to beginning. */
  reset(): void;
}

/**
 * Create a replay session that tracks position via cursor.
 *
 * Usage:
 * ```ts
 * const session = createReplaySession(bus);
 * const batch = session.fetchNext(50); // first 50 events
 * // ... later, reconnect:
 * const more = session.fetchNext(50);  // next 50 from last position
 * ```
 */
export function createReplaySession(bus: NexusEventBus): ReplaySession {
  let lastSeenId: string | undefined;

  return {
    fetchNext(limit = 100): NexusEvent[] {
      const cursor: ReplayCursor = {
        afterId: lastSeenId,
        limit,
      };

      const events = bus.replay(cursor);

      if (events.length > 0) {
        lastSeenId = events[events.length - 1].id;
      }

      return events;
    },

    getCursor(): string | undefined {
      return lastSeenId;
    },

    reset(): void {
      lastSeenId = undefined;
    },
  };
}

/**
 * Replay all events since a given timestamp.
 * Useful for cold-start scenarios where a client knows "I was last online at X".
 */
export function replaySince(
  bus: NexusEventBus,
  since: string,
  limit = 1000,
): NexusEvent[] {
  return bus.replay({ since, limit });
}
