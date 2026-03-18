---
id: C6
title: Streams — 5th Sacred Organ (broadcast layer)
status: ready
owner-role: architect
priority: P1
suggested-pioneer: "@claude"
suggested-platform: "Claude Code"
suggested-model: frontier
branch: feat/C6-streams-organ
temporary-ui: false
---

## Context

`sacred-flow.ts` header reads:
> Immutable flow: Tribunal → Atlas → Index → News → **Streams**

But `SACRED_FLOW_ORDER` only contains `['tribunal', 'atlas', 'index', 'news']`.
`Organ` type does not include `'streams'`. Streams is the final broadcast layer — the exit point of the organism. Without it the Sacred Flow is incomplete.

## What to build

1. Add `'streams'` to `Organ` type in `src/types/sacred-flow.ts`
2. Add `'streams.feed'` to `NexusEventType`
3. Add `StreamsFeedPayload` interface
4. Add `createStreamsFeed` factory in `src/lib/events/schema.ts`
5. `src/lib/events/streams.ts` — StreamsOrgan: subscribes to `news.broadcast`, emits `streams.feed`
6. Gate 8 tests in `src/test/nervous-system.test.ts`: Streams receives news.broadcast → emits streams.feed. Full end-to-end: Tribunal → Atlas → Index → News → Streams.
7. Update `SACRED_FLOW_ORDER` to include `'streams'`

## Scope
- `src/types/sacred-flow.ts` — type additions only
- `src/lib/events/schema.ts` — one new factory
- `src/lib/events/streams.ts` — new file, pure logic
- `src/lib/events/index.ts` — export StreamsOrgan
- `src/test/nervous-system.test.ts` — Gate 8 tests

## Constraints
- Do NOT add UI components
- Do NOT touch bus.ts, persistence.ts, ledger.ts
- StreamsOrgan is a pure transformer: `news.broadcast` in → `streams.feed` out, in-memory only

## Acceptance criteria
- [ ] `Organ` includes `'streams'`
- [ ] `NexusEventType` includes `'streams.feed'`
- [ ] `SACRED_FLOW_ORDER` ends with `'streams'`
- [ ] Gate 8: full end-to-end Tribunal → Streams passes
- [ ] `npx vitest run` — all tests green
- [ ] `npx tsc --noEmit` — 0 errors
