// sacred-flow: Nervous System v2 — Event Bus
// Fluxo imutável: Tribunal → Atlas → Index → News
// Contract: Deterministic | Idempotent | Replayable

export type NexusEventType =
  | 'tribunal:verdict'
  | 'atlas:data'
  | 'index:logged'
  | 'news:broadcast'
  | 'nexus:reset';

export interface NexusEvent<T = unknown> {
  id: string;        // deduplification key (deterministic by content hash)
  type: NexusEventType;
  payload: T;
  timestamp: number;
  cursor: number;    // monotonic sequence — used for replay
}

type Listener<T = unknown> = (event: NexusEvent<T>) => void;

class NexusEventBus {
  private listeners: Map<NexusEventType, Set<Listener>> = new Map();
  private log: NexusEvent[] = [];
  private cursor = 0;
  private seen: Set<string> = new Set(); // idempotency guard

  /** Publish an event — deduplicated by id (idempotent). */
  emit<T>(type: NexusEventType, payload: T, id?: string): NexusEvent<T> {
    const eventId = id ?? `${type}:${this.cursor}:${JSON.stringify(payload)}`;

    // Idempotency: skip if we've already processed this event id
    if (this.seen.has(eventId)) {
      return this.log.find((e) => e.id === eventId) as NexusEvent<T>;
    }

    const event: NexusEvent<T> = {
      id: eventId,
      type,
      payload,
      timestamp: Date.now(),
      cursor: ++this.cursor,
    };

    this.seen.add(eventId);
    this.log.push(event);

    const handlers = this.listeners.get(type);
    if (handlers) {
      handlers.forEach((h) => h(event as NexusEvent));
    }

    return event;
  }

  /** Subscribe to an event type. Returns unsubscribe function. */
  on<T>(type: NexusEventType, listener: Listener<T>): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(listener as Listener);
    return () => this.listeners.get(type)?.delete(listener as Listener);
  }

  /**
   * Replay all events from a given cursor position.
   * Enables deterministic re-hydration after a reconnect or refresh.
   */
  replay(fromCursor = 0): NexusEvent[] {
    return this.log.filter((e) => e.cursor > fromCursor);
  }

  /** Return the full ordered event log (for Index persistence). */
  getLog(): Readonly<NexusEvent[]> {
    return [...this.log];
  }

  /** Current replay cursor — store client-side for session resumption. */
  getCursor(): number {
    return this.cursor;
  }

  /** Hard reset — only used in tests or nexus:reset flow. */
  reset(): void {
    this.listeners.clear();
    this.log = [];
    this.cursor = 0;
    this.seen.clear();
  }
}

// Singleton — one bus per organism
export const bus = new NexusEventBus();
