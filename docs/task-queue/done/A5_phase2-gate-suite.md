---
id: A5
title: Phase 2 gate test suite — define and prove Phase 2 completion criteria
status: done
owner-role: auditor
priority: P1
suggested-pioneer: "@codex"
suggested-platform: "Codex CLI"
suggested-model: mid
branch: feat/A5-phase2-gate-suite
temporary-ui: false
---

## Context

Phase 1 is proven by 70 gate tests. Phase 2 has no formal gate definition. It cannot be declared done without evidence. This task defines and implements the Phase 2 gate suite.

## What to build

`src/test/phase2-gates.test.ts`:

- **P2-1: Streams organ** — `streams.feed` emitted when `news.broadcast` published (blocked until C6; skip with `// @blocked: C6`)
- **P2-2: Persistence survive** — `createPersistedBus()` rehydrates on new instance
- **P2-3: Heatmap data** — `useConflictHeatmap` returns GeoJSON when `tribunal.verdict` events published
- **P2-4: Layer toggle types** — `LayerVisibility` exported, `DEFAULT_VISIBILITY` correct
- **P2-5: ReplayCursor filter** — `bus.replay({ types: ['tribunal.verdict'] })` returns only tribunal events
- **P2-6: Full Phase 2 flow** — Tribunal → Atlas → Index → News → Streams (skip until C6)

## Constraints
- Pure logic tests — no DOM, no React, no MapLibre
- P2-1 and P2-6 skipped until C6 lands
- Must be deterministic and runnable in CI

## Acceptance criteria
- [x] `src/test/phase2-gates.test.ts` exists with all 6 gate stubs
- [x] P2-2 through P2-5 pass
- [x] P2-1 + P2-6 skip cleanly with `// @blocked: C6`
- [x] `npx vitest run` — all tests green (skips don't count as failures)
- [x] `npx tsc --noEmit` — 0 errors
- [x] `docs/pipeline.md` Phase 2 summary references this gate file


## Completion report

- Implemented: `src/test/phase2-gates.test.ts` with gates P2-1..P2-6 (P2-1 and P2-6 skipped with `// @blocked: C6`).
- Verified: `npx vitest run` and `npx tsc --noEmit` both pass.
- Queue transition: moved from `ready/` to `done/`.
