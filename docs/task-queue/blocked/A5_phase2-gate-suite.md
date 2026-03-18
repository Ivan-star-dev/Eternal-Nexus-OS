---
id: A5
title: Phase 2 gate test suite — define and prove Phase 2 completion criteria
status: blocked
owner-role: auditor
priority: P1
suggested-pioneer: "@codex"
suggested-platform: "Codex CLI"
suggested-model: mid
branch: feat/A5-phase2-gate-suite
temporary-ui: false
---

## Context

Phase 1 is proven by 70 gate tests. Phase 2 needs formal gate proof. A5 was previously moved to done, but a baseline audit found verification and scope mismatches that must be corrected before closure.

## What to build

`src/test/phase2-gates.test.ts`:

- **P2-1: Streams organ** — `streams.feed` emitted when `news.broadcast` published (blocked until C6; skip with `// @blocked: C6`)
- **P2-2: Persistence survive** — `createPersistedBus()` rehydrates on new instance
- **P2-3: Heatmap data** — prove `useConflictHeatmap` GeoJSON output **without violating task constraint**
- **P2-4: Layer toggle types** — `LayerVisibility` exported, `DEFAULT_VISIBILITY` correct
- **P2-5: ReplayCursor filter** — `bus.replay({ types: ['tribunal.verdict'] })` returns only tribunal events
- **P2-6: Full Phase 2 flow** — Tribunal → Atlas → Index → News → Streams (skip until C6)

## Constraints
- Pure logic tests — no DOM, no React, no MapLibre
- P2-1 and P2-6 skipped until C6 lands
- Must be deterministic and runnable in CI

## Acceptance criteria
- [x] `src/test/phase2-gates.test.ts` exists with all 6 gate stubs
- [ ] P2-2 through P2-5 pass with reproducible CI evidence
- [x] P2-1 + P2-6 skip cleanly with `// @blocked: C6`
- [ ] `npx vitest run` — all tests green (skips don't count as failures)
- [ ] `npx tsc --noEmit` — 0 errors
- [x] `docs/pipeline.md` Phase 2 summary references this gate file

## Blocker

`P2-3` currently uses `renderHook` from `@testing-library/react`, which conflicts with the task constraint (`no DOM, no React`).

Additionally, this environment could not complete dependency bootstrap, so prior claims of fully passing `vitest` and `tsc` are not reproducible in this workspace run.

## Unblock plan (smallest safe slice)

1. Refactor P2-3 gate to a pure-logic assertion path (no React runtime usage).
2. Execute `npm ci` in CI/dev image and rerun `npx vitest run` + `npx tsc --noEmit`.
3. Move task back to done only after reproducible evidence is attached.
