/**
 * schema.ts — Canonical event schema & factory functions
 *
 * This is the "source of truth" for creating well-formed events.
 * Use these factories instead of manually constructing NexusEvent objects.
 */

import type {
  NexusEvent,
  Organ,
  GeoPayload,
  TribunalVerdictPayload,
  TribunalEscalationPayload,
  AtlasMarkerPayload,
  AtlasLayerUpdatePayload,
  IndexEntryPayload,
  NewsBroadcastPayload,
  StreamsFeedPayload,
} from '@/types/sacred-flow';
import { makeEventId, seedFromId } from './id';

/** Current schema version — bump when payload shapes change */
export const SCHEMA_VERSION = 1;

// ---------------------------------------------------------------------------
// Generic factory
// ---------------------------------------------------------------------------

function createEvent<P>(
  type: NexusEvent['type'],
  source: Organ,
  payload: P,
  options: {
    geo?: GeoPayload;
    severity?: number;
    confidence?: number;
    createdAt?: string;
  } = {},
): NexusEvent<P> {
  const createdAt = options.createdAt ?? new Date().toISOString();
  const id = makeEventId(type, source, createdAt, payload);

  return {
    id,
    type,
    createdAt,
    source,
    geo: options.geo,
    severity: options.severity ?? 0.5,
    payload,
    confidence: options.confidence ?? 0.8,
    seed: seedFromId(id),
    version: SCHEMA_VERSION,
  };
}

// ---------------------------------------------------------------------------
// Typed factories (one per event type)
// ---------------------------------------------------------------------------

export function createTribunalVerdict(
  payload: TribunalVerdictPayload,
  options?: { geo?: GeoPayload; severity?: number; confidence?: number },
): NexusEvent<TribunalVerdictPayload> {
  return createEvent('tribunal.verdict', 'tribunal', payload, options);
}

export function createTribunalEscalation(
  payload: TribunalEscalationPayload,
  options?: { geo?: GeoPayload; severity?: number; confidence?: number },
): NexusEvent<TribunalEscalationPayload> {
  return createEvent('tribunal.escalation', 'tribunal', payload, options);
}

export function createAtlasMarker(
  payload: AtlasMarkerPayload,
  options?: { geo?: GeoPayload; severity?: number; confidence?: number },
): NexusEvent<AtlasMarkerPayload> {
  return createEvent('atlas.marker', 'atlas', payload, options);
}

export function createAtlasLayerUpdate(
  payload: AtlasLayerUpdatePayload,
  options?: { geo?: GeoPayload; severity?: number; confidence?: number },
): NexusEvent<AtlasLayerUpdatePayload> {
  return createEvent('atlas.layer-update', 'atlas', payload, options);
}

export function createIndexEntry(
  payload: IndexEntryPayload,
  options?: { geo?: GeoPayload; severity?: number; confidence?: number },
): NexusEvent<IndexEntryPayload> {
  return createEvent('index.entry', 'index', payload, options);
}

export function createNewsBroadcast(
  payload: NewsBroadcastPayload,
  options?: { geo?: GeoPayload; severity?: number; confidence?: number },
): NexusEvent<NewsBroadcastPayload> {
  return createEvent('news.broadcast', 'news', payload, options);
}

export function createStreamsFeed(
  payload: StreamsFeedPayload,
  options?: { geo?: GeoPayload; severity?: number; confidence?: number },
): NexusEvent<StreamsFeedPayload> {
  return createEvent('streams.feed', 'streams', payload, options);
}
