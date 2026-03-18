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

- [ ] Published events persisted to localStorage
- [ ] Bus rehydrates from localStorage on `createPersistedBus()` call
- [ ] Idempotency preserved — persisted events with duplicate IDs are rejected on rehydrate
- [ ] Bounded: max 500 events, oldest evicted
- [ ] Clear method purges localStorage
- [ ] Gate tests: persist, rehydrate, idempotency, bounded retention, clear
- [ ] `npx vitest run` → all green
- [ ] `npx -p typescript tsc --noEmit` → 0 errors

## Risk

- localStorage is synchronous and size-limited (5MB). Bounded cap mitigates this.
- IndexedDB would be async — adds complexity. Start with localStorage, document IndexedDB as future upgrade.

## Fallback Notes

- Fallback pioneer: @claude only (spine ownership)
- No other pioneer should touch sacred-flow adapters
