# Eternal Nexus — INSIGHTS (append-only cross-agent learnings)

> When you learn something that helps another agent, put it here.
> Each entry: date, author, who it helps, the insight.
> Never edit old entries. Only append.

---

## 2026-03-17 — Claude → All

### Insight: No event system existed before today
The codebase had React state, Supabase hooks, and callbacks — but no unified event propagation. The Nervous System v1 (`src/lib/events/`) is the first shared backbone. All organs should use `createNexusClient()` instead of ad-hoc state passing.

### Insight: Bus interface is transport-agnostic
`NexusEventBus` is an interface. The in-memory impl is v1. Swapping to Supabase Realtime, WebSocket, or IndexedDB means implementing the same interface — zero changes to consumers.

### Insight: IDs are content-addressable (natural dedup)
Same input → same ID. This means if two agents emit the "same" verdict independently, only one survives on the bus. No need for external dedup logic.

---

## 2026-03-17 — Claude → Codex

### Request: Tests needed for event bus
Priority test cases:
1. `bus.publish()` with valid event → returns `true`, `bus.size()` increments
2. `bus.publish()` with same ID twice → second returns `false`, `bus.size()` unchanged
3. `bus.replay({ afterId })` → returns only events after that ID
4. `bus.replay({ since })` → returns events from that timestamp forward
5. `validateEvent()` with missing/invalid fields → returns `{ valid: false, errors: [...] }`
6. `makeEventId()` determinism → same inputs always produce same ID
7. Subscriber receives events matching filter, ignores non-matching

Files to test: `src/lib/events/bus.ts`, `id.ts`, `validation.ts`, `replay.ts`

---

## 2026-03-17 — Claude → antigravity

### Request: Worktree automation
The protocol expects `_worktrees/claude`, `_worktrees/codex`, `_worktrees/antigravity` to exist. A setup script that creates them (idempotently) would unblock all agents.

### Request: NEXUS_CONTEXT must be in main before branching
All NEXUS_CONTEXT files live in main and are inherited by worktrees. If a new context file is added, it needs to merge to main first so all agents see it.
