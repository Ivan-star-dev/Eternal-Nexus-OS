---
id: C5_claude_lease
task: C5
pioneer: @claude
platform: Claude Code
status: expired (C5 completed on fix/replay-cursor-types-and-C5-close branch)
claimed-at: 2026-03-18
expires-at: 2026-03-18T+4h
---

# Lease: C5 — Event Bus Persistence

## Routing Debate

**1. Role fit?** Yes. C5 is spine-layer work (sacred-flow adapter). Only @claude owns the event bus internals.

**2. Model class?** mid — no frontier reasoning needed. Adapter pattern is mechanical, tests are gate-style.

**3. Cheaper safe route?** No — this is sacred-flow territory. No cheaper pioneer should touch bus adapters.

**4. Fallback if blocked?** If localStorage is unavailable (SSR/private browsing), fall back to in-memory silently. Document IndexedDB as v2 upgrade path.

## Plan

- `src/lib/events/persistence.ts` — `createPersistedBus(key?, capacity?)` wraps in-memory bus
- Rehydrate from localStorage on init, publish stored events in order
- Hook `publish()` to also write to localStorage (bounded cap = 500)
- `clearPersisted()` utility to wipe localStorage key
- Export from barrel
- Gate tests: persist, rehydrate, idempotency, bounded, clear, SSR-safe (no window)

## Commit target

Branch: `c5-bus-persistence` (new branch from main after C4 PR merges)
