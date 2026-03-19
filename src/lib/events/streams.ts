/**
 * streams.ts — Streams Organ (5th Sacred Flow organ)
 *
 * The broadcast exit point of the organism.
 * Subscribes to news.broadcast → emits streams.feed.
 * Pure transformer, in-memory only.
 *
 * Sacred Flow: Tribunal → Atlas → Index → News → **Streams**
 */

import type {
  NexusEvent,
  NewsBroadcastPayload,
  StreamsFeedPayload,
  Unsubscribe,
} from '@/types/sacred-flow';
import type { NexusEventBus } from './bus';
import { createStreamsFeed } from './schema';

// ---------------------------------------------------------------------------
// StreamsOrgan
// ---------------------------------------------------------------------------

export interface StreamsOrgan {
  /** Start listening to news.broadcast events on the bus */
  start(): void;
  /** Stop listening (unsubscribe from bus) */
  stop(): void;
  /** Whether the organ is currently active */
  readonly active: boolean;
  /** Count of feed events emitted */
  readonly emittedCount: number;
}

export function createStreamsOrgan(bus: NexusEventBus): StreamsOrgan {
  let unsub: Unsubscribe | null = null;
  let emitted = 0;

  function handleBroadcast(event: NexusEvent): void {
    const broadcastPayload = event.payload as NewsBroadcastPayload;

    const feedPayload: StreamsFeedPayload = {
      sourceBroadcastId: event.id,
      channel: 'main',
      summary: broadcastPayload.title,
      emittedAt: new Date().toISOString(),
    };

    const feedEvent = createStreamsFeed(feedPayload, {
      geo: event.geo,
      severity: event.severity,
      confidence: event.confidence,
    });

    bus.publish(feedEvent);
    emitted++;
  }

  return {
    start() {
      if (unsub) return; // already active
      unsub = bus.subscribe(
        { types: ['news.broadcast'] },
        handleBroadcast,
      );
    },

    stop() {
      if (unsub) {
        unsub();
        unsub = null;
      }
    },

    get active() {
      return unsub !== null;
    },

    get emittedCount() {
      return emitted;
    },
  };
}
