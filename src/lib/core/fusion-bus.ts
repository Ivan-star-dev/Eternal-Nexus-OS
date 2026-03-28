/**
 * fusion-bus.ts — Typed inter-layer event bus for the Nexus Living Organism.
 *
 * Direction law: Identity → Intelligence → Memory → Environment
 * No direct cross-layer writes. All mutations via events.
 *
 * Canon: LIVING_SYSTEM_MANIFEST.md · @claude · 2026-03-28
 */

// ─── Event Catalogue ─────────────────────────────────────────────────────────

export type FusionEventKind =
  // Identity layer
  | 'identity:resolved'        // user identity confirmed (auth)
  | 'identity:lost'            // session expired or signed out
  // Memory layer
  | 'session:booted'           // session loaded from storage on mount
  | 'session:updated'          // any session field mutated
  | 'session:expired'          // TTL exceeded — cleared to cold state
  | 'session:resumed'          // returning user, re_entry_point present
  // Artifact layer
  | 'artifact:created'         // new artifact written to store
  | 'artifact:updated'         // existing artifact mutated
  | 'artifact:archived'        // artifact moved to archived status
  // Environment layer
  | 'portal:entered'           // user navigated into a portal
  | 'portal:exited'            // user left a portal
  | 'transition:started'       // portal transition animation began
  | 'transition:ended'         // portal transition animation ended
  // Intelligence layer
  | 'fidelity:changed'         // fidelity tier switched (auto or override)
  | 'route:suggested'          // route intelligence has a next-step
  | 'evolution:leveled-up'     // maturity level increased
  | 'intent:classified'        // memory classifier produced output
  // Governance layer
  | 'governance:violation'     // a governance law was broken
  | 'governance:cleared'       // violations resolved, system healthy
  // System lifecycle
  | 'organism:booting'         // runtime init sequence started
  | 'organism:ready'           // all subsystems live
  | 'organism:degraded';       // one or more subsystems failed init

// ─── Event Shape ─────────────────────────────────────────────────────────────

export interface FusionEvent<T = unknown> {
  kind: FusionEventKind;
  payload: T;
  ts: string;      // ISO 8601
  source: string;  // subsystem identifier ('session' | 'artifact' | 'portal' | ...)
}

type Handler<T = unknown> = (event: FusionEvent<T>) => void;

// ─── Bus ─────────────────────────────────────────────────────────────────────

class FusionBus {
  private specific = new Map<FusionEventKind, Set<Handler>>();
  private wildcard = new Set<Handler>();

  /** Emit a typed event into the bus. Never throws — handler errors are isolated. */
  emit<T>(kind: FusionEventKind, payload: T, source: string): void {
    const event: FusionEvent<T> = { kind, payload, ts: new Date().toISOString(), source };

    this.specific.get(kind)?.forEach(h => {
      try { h(event as FusionEvent); } catch (e) {
        console.warn('[FUSION-BUS] handler error', kind, e);
      }
    });

    this.wildcard.forEach(h => {
      try { h(event as FusionEvent); } catch (e) {
        console.warn('[FUSION-BUS] wildcard handler error', kind, e);
      }
    });

    // Bridge to legacy DOM event listeners
    try {
      window.dispatchEvent(new CustomEvent(`nxos:${kind}`, { detail: payload }));
    } catch { /* non-browser env */ }
  }

  /** Subscribe to a specific event kind. Returns unsubscribe fn. */
  on<T>(kind: FusionEventKind, handler: Handler<T>): () => void {
    if (!this.specific.has(kind)) this.specific.set(kind, new Set());
    const set = this.specific.get(kind)!;
    set.add(handler as Handler);
    return () => set.delete(handler as Handler);
  }

  /** Subscribe to all events. Returns unsubscribe fn. */
  onAll(handler: Handler): () => void {
    this.wildcard.add(handler);
    return () => this.wildcard.delete(handler);
  }
}

// ─── Singleton ───────────────────────────────────────────────────────────────

export const bus = new FusionBus();
