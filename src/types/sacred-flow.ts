/**
 * sacred-flow.ts — Public types for the Nervous System
 * Immutable flow: Tribunal → Atlas → Index → News → Streams
 *
 * These types are the canonical contract between organs.
 * Do NOT add UI/rendering concerns here — only data contracts.
 */

// ---------------------------------------------------------------------------
// Organ & Flow
// ---------------------------------------------------------------------------

/** Fixed organs — never invent new ones */
export type Organ = 'nexus' | 'tribunal' | 'atlas' | 'index' | 'news' | 'streams';

/** The sacred flow order (immutable) */
export const SACRED_FLOW_ORDER: readonly Organ[] = [
  'tribunal',
  'atlas',
  'index',
  'news',
  'streams',
] as const;

// ---------------------------------------------------------------------------
// Event Types (enum of all possible nervous-system events)
// ---------------------------------------------------------------------------

export type NexusEventType =
  | 'tribunal.verdict'
  | 'tribunal.escalation'
  | 'atlas.marker'
  | 'atlas.layer-update'
  | 'index.entry'
  | 'news.broadcast'
  | 'streams.feed';

// ---------------------------------------------------------------------------
// Geo payload (shared across organs)
// ---------------------------------------------------------------------------

export interface GeoPayload {
  lat: number;
  lon: number;
  radiusKm?: number;
}

// ---------------------------------------------------------------------------
// Severity (0-1 normalized)
// ---------------------------------------------------------------------------

export type Severity = number; // 0–1

// ---------------------------------------------------------------------------
// Canonical NexusEvent — the single event shape on the bus
// ---------------------------------------------------------------------------

export interface NexusEvent<P = unknown> {
  /** Deterministic ID — idempotency key (see id.ts) */
  id: string;

  /** Discriminated event type */
  type: NexusEventType;

  /** ISO-8601 creation timestamp */
  createdAt: string;

  /** Which organ emitted this event */
  source: Organ;

  /** Geospatial context (optional for non-geo events) */
  geo?: GeoPayload;

  /** Normalized severity / priority */
  severity: Severity;

  /** Structured, versioned payload */
  payload: P;

  /** Confidence score from the emitting organ (0-1) */
  confidence: number;

  /** Deterministic seed for visual rendering (hash-based) */
  seed: number;

  /** Schema version — bump when payload shape changes */
  version: number;
}

// ---------------------------------------------------------------------------
// Typed payloads per event type
// ---------------------------------------------------------------------------

export interface TribunalVerdictPayload {
  topic: string;
  judges: string[];
  verdict: 'approved' | 'rejected' | 'needs-review';
  reasoning: string;
  flowTarget: 'atlas' | 'index' | 'news';
}

export interface TribunalEscalationPayload {
  topic: string;
  reason: string;
  originalVerdictId: string;
}

export interface AtlasMarkerPayload {
  label: string;
  category: string;
  dataSource?: string;
  value?: number;
  unit?: string;
  lat?: number;
  lng?: number;
  intensity?: number;
}

export interface AtlasLayerUpdatePayload {
  layerType: string;
  pointCount: number;
  bounds?: { north: number; south: number; east: number; west: number };
}

export interface IndexEntryPayload {
  title: string;
  category: string;
  rank: number;
  linkedVerdictId?: string;
}

export interface NewsBroadcastPayload {
  title: string;
  content: string;
  mediaUrl?: string;
  live: boolean;
  linkedVerdictId?: string;
}

export interface StreamsFeedPayload {
  /** ID of the news.broadcast event that triggered this feed */
  sourceBroadcastId: string;
  /** Channel or feed identifier */
  channel: string;
  /** Summary text for the feed entry */
  summary: string;
  /** Timestamp when the feed was emitted */
  emittedAt: string;
}

// ---------------------------------------------------------------------------
// Replay cursor
// ---------------------------------------------------------------------------

export interface ReplayCursor {
  /** Resume from this event ID (exclusive) */
  afterId?: string;
  /** Resume from this ISO timestamp (inclusive) */
  since?: string;
  /** Max events to fetch */
  limit?: number;
}

// ---------------------------------------------------------------------------
// Subscription
// ---------------------------------------------------------------------------

export type EventFilter = {
  types?: NexusEventType[];
  sources?: Organ[];
  minSeverity?: Severity;
};

export type Unsubscribe = () => void;
