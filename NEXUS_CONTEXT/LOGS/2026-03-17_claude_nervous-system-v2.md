# Session Log — 2026-03-17 — Claude — Nervous System v2 (C1 Bridge)

## Context
Task C1 from `CLAUDE_HANDOFF.md`: Wire the event bus (`src/lib/events/bus.ts`) into the existing TanStack-based nervous system (`useNexusState.ts`) so both systems operate as one unified spine.

## What changed

### Modified
- `src/hooks/useNexusState.ts` — Bridge layer: `addVerdict()` now publishes to BOTH the event bus (authoritative log) AND TanStack cache (React view). Zero API changes for consumers. Added view-cache dedup to match bus idempotency.

### Created
- `src/hooks/useNexusEvents.ts` — New React hook for pure bus subscription. Supports live events, replay-on-mount, filtering by type/source/severity, and max event cap. No TanStack dependency.
- `src/test/nervous-system.test.ts` — **19 gate tests** proving all 5 gate criteria:
  - GATE 1: Deterministic (5 tests) — same input → same ID + seed, always
  - GATE 2: Idempotent (3 tests) — duplicate publish → rejected, subscriber not notified
  - GATE 3: Replayable (5 tests) — cursor, afterId, since, session tracking, late-connect replay
  - GATE 4: Validation (4 tests) — ingress rejection of invalid events
  - GATE 5: Sacred Flow (2 tests) — Tribunal → Atlas subscriber with matching geo/seed

## Why
- Aligns to Sacred Flow: Tribunal → Atlas → Index → News
- Hits the non-negotiable phase gate: deterministic + idempotent + replayable
- Bridge pattern ensures zero breaking changes for existing consumers (GeopoliticsNarrative, useIndexOrgan, NexusFlowInspector)

## How to verify
```bash
# Gate test (19 tests)
npx vitest run src/test/nervous-system.test.ts

# Backward compatibility (existing test)
npx vitest run src/test/nexus-flow.test.tsx

# All tests
npx vitest run
```

Expected: all pass (19 + 1 = 20 tests).

## Risks + rollback
- **Low risk:** Bridge is additive. If bus breaks, TanStack cache still works independently.
- **Rollback:** Revert `useNexusState.ts` to previous version (pure TanStack). Bus files are isolated.
- **Dual source:** TanStack is the VIEW cache, bus is the EVENT LOG. Bus is authoritative, TanStack is derived. This is documented in code comments.

## Next 3 tasks
1. Wire `useIndexOrgan.ts` to also consume bus events (Index subscriber leg of Sacred Flow)
2. Create News subscriber stub (completes full flow: Tribunal → Atlas → Index → News)
3. Fix `@react-three/fiber` types for typecheck CI gate (P0 quick fix from handoff)

## Suggestions for other pioneers
- **@codex:** Add `src/test/nervous-system.test.ts` to CI pipeline. This is the gate test — it must run on every PR. Also consider adding a coverage threshold for `src/lib/events/`.
- **@antigravity:** The bridge is ready. You can now build a `scripts/verify-gate.sh` that runs: `npx vitest run src/test/nervous-system.test.ts && npx vitest run src/test/nexus-flow.test.tsx`.
- **@ui-specialist:** `useNexusEvents` hook is ready. You can subscribe to `tribunal.verdict` events in Atlas components using: `const { events } = useNexusEvents({ types: ['tribunal.verdict'] })` — each event has `.geo` and `.seed` for deterministic rendering.

## External references
- None added. All implementation uses existing project dependencies (vitest, TanStack Query).
