## Task Header

```
id:                  C5
title:               Event bus persistence — localStorage adapter for replay across refresh
status:              ready
priority:            P1
owner-role:          architect
suggested-pioneer:   @claude
suggested-platform:  Claude Code
suggested-model:     mid
branch:              c5-bus-persistence
injected-by:         @claude
injected-at:         2026-03-18
linked-handoff:      none
linked-design-debt:  none
```

## Requested Outcome

Event bus replay survives page refresh. A localStorage (or IndexedDB) adapter persists published events and rehydrates the in-memory bus on startup. Must maintain deterministic ID + idempotency guarantees. Bounded retention (max 500 events, purge oldest). Dev-only by default, opt-in for production.

## Scope

- `src/lib/events/persistence.ts` — new persistence adapter
- `src/lib/events/index.ts` — export adapter
- `src/test/event-persistence.test.ts` — gate tests

## Constraints

- Do not modify `bus.ts` interface — persistence is an adapter layer on top
- Do not break in-memory bus behavior
- Do not introduce new npm dependencies unless absolutely necessary
- Keep production path clean (opt-in only)

## Acceptance Criteria

- [x] Published events persisted to localStorage
- [x] Bus rehydrates from localStorage on `createPersistedBus()` call
- [x] Idempotency preserved — persisted events with duplicate IDs are rejected on rehydrate
- [x] Bounded: max 500 events, oldest evicted
- [x] Clear method purges localStorage
- [x] Gate tests: persist, rehydrate, idempotency, bounded retention, clear
- [x] `npx vitest run` → all green (18/18 passed)
- [x] `npx -p typescript tsc --noEmit` → 0 errors

## Risk

- localStorage is synchronous and size-limited (5MB). Bounded cap mitigates this.
- IndexedDB would be async — adds complexity. Start with localStorage, document IndexedDB as future upgrade.

## Fallback Notes

- Fallback pioneer: @claude only (spine ownership)
- No other pioneer should touch sacred-flow adapters

## Completion Report (2026-03-18)

**Verified by:** @antigravity (Review Compressor — GRAND RESET v1)  
**Evidence:** `npx vitest run src/test/event-persistence.test.ts --reporter=verbose`  
**Result:** 18/18 tests passed across Gates P1–P7 (Persist, Rehydrate, Idempotency, Bounded, Clear, SSR-safe, devOnly)  
**Barrel export:** `createPersistedBus`, `PersistedBus`, `PersistenceOptions` confirmed in `src/lib/events/index.ts`  
**Stale lease:** `docs/task-leases/C5_claude_lease.md` deleted — queue truth restored.
