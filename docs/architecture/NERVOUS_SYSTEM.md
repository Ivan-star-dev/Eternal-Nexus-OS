# Nervous System v1 — Tribunal→Atlas Spine

> The event backbone connecting all Eternal Nexus organs.

## Overview

The Nervous System is a deterministic, replayable event bus that propagates decisions through the Sacred Flow: **Tribunal → Atlas → Index → News → Streams**.

v1 is an in-memory implementation — the spine contract is stable, the transport is swappable.

## Architecture

```
┌──────────┐     publish()      ┌──────────────┐     subscribe()     ┌──────────┐
│ Tribunal │ ──────────────────▸ │  NexusEventBus │ ──────────────────▸ │  Atlas   │
│ (source) │                    │  (in-memory)   │                    │ (render) │
└──────────┘                    └──────────────┘                    └──────────┘
                                       │
                                       │ replay(cursor)
                                       ▼
                                ┌──────────────┐
                                │ Reconnecting │
                                │   Client     │
                                └──────────────┘
```

## Canonical Event Shape

Every event on the bus has this shape (`NexusEvent<P>`):

| Field       | Type       | Description                                    |
|-------------|------------|------------------------------------------------|
| `id`        | `string`   | Deterministic (content-addressable) — idempotency key |
| `type`      | `enum`     | `tribunal.verdict`, `atlas.marker`, etc.       |
| `createdAt` | `string`   | ISO-8601 timestamp                             |
| `source`    | `Organ`    | Which organ emitted this event                 |
| `geo`       | `GeoPayload?` | `{ lat, lon, radiusKm? }`                  |
| `severity`  | `number`   | 0–1 normalized priority                        |
| `payload`   | `P`        | Typed, versioned payload (discriminated by type)|
| `confidence`| `number`   | 0–1 confidence score                           |
| `seed`      | `number`   | Deterministic visual seed (FNV-1a hash of ID)  |
| `version`   | `number`   | Schema version (bump on breaking changes)      |

## Guarantees

### 1. Idempotency
Same `id` → same event. The bus rejects duplicates silently (`publish()` returns `false`).
IDs are deterministic: `fnv1a32(type|source|createdAt|payloadHash)`.

### 2. Determinism
Given the same input, the same ID and seed are always generated. Visual renderers can use `seed` for consistent particle/color generation.

### 3. Replay
Clients track a cursor (last seen event ID). On reconnect:
```ts
const session = client.replay();
const missed = session.fetchNext(100); // events since last cursor
```

### 4. Validation
Events are validated at bus ingress (lightweight, no Zod). Invalid events are rejected with warnings.

## File Map

```
src/types/sacred-flow.ts        — Public types (NexusEvent, payloads, filters)
src/lib/events/
  ├── index.ts                  — Barrel export
  ├── schema.ts                 — Typed factory functions per event type
  ├── id.ts                     — Deterministic ID + seed generation (FNV-1a)
  ├── validation.ts             — Lightweight ingress validation
  ├── bus.ts                    — Bus interface + in-memory impl
  ├── replay.ts                 — Cursor-based replay sessions
  └── client.ts                 — High-level organ client
```

## Usage Example

### Tribunal emits a verdict
```ts
import { createNexusClient, createTribunalVerdict } from '@/lib/events';

const tribunal = createNexusClient({ organ: 'tribunal' });

tribunal.emit('tribunal.verdict', {
  topic: 'Climate Policy Shift',
  judges: ['zeta-9', 'kronos', 'nanobanana'],
  verdict: 'approved',
  reasoning: 'Evidence supports immediate action',
  flowTarget: 'atlas',
}, {
  geo: { lat: 48.8566, lon: 2.3522 },
  severity: 0.8,
  confidence: 0.92,
});
```

### Atlas subscribes to verdicts
```ts
const atlas = createNexusClient({
  organ: 'atlas',
  types: ['tribunal.verdict', 'tribunal.escalation'],
});

atlas.subscribe((event) => {
  const payload = event.payload as TribunalVerdictPayload;
  // Render marker at event.geo on the globe
  renderMarker(event.geo, event.seed, payload);
});

// On reconnect — replay missed events
const session = atlas.replay();
const missed = session.fetchNext(200);
missed.forEach(renderFromEvent);
```

## What v1 Does NOT Include
- WebSocket / Supabase transport (use in-memory bus for now)
- Persistence across page reloads
- Cinematic effects or rendering logic
- Cross-tab synchronization

## Next Steps (v2+)
1. Supabase Realtime transport (swap bus implementation)
2. Persistent event log (IndexedDB or Supabase)
3. Atlas cinematics layer consuming events
4. Index aggregation subscriber
5. News broadcast subscriber
