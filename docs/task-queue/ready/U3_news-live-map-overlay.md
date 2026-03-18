---
id: U3
title: News live event pins on GeopoliticsMap
status: ready
owner-role: design
priority: P2
suggested-pioneer: "@copilot"
suggested-platform: "GitHub Copilot"
suggested-model: mid
branch: feat/U3-news-map-overlay
temporary-ui: false
---

## Context

`news.broadcast` events flow through the bus with geo payloads. GeopoliticsMap shows verdict markers (tribunal) and a conflict heatmap (atlas). But **News events are invisible on the map** — the 4th organ has no visual representation.

## What to build

1. `src/hooks/useNewsBroadcastLayer.ts` — subscribes to `news.broadcast`, maintains GeoJSON FeatureCollection of recent news pins (cap 50, FIFO), auto-expire pins after 60s
2. `GeopoliticsMap.tsx` — add `news-pins` MapLibre symbol layer (pulsing teal dot, on-click popup: title + 80-char snippet)
3. `LayerTogglePanel.tsx` — add 5th toggle "News Events"
4. CSS — `@keyframes news-pulse` animation

## Constraints
- Do NOT touch `src/lib/events/`, `src/types/sacred-flow.ts`, or persistence
- Do NOT add new npm dependencies
- Follow `useConflictHeatmap` pattern exactly

## Acceptance criteria
- [ ] News pins appear within 1s of `news.broadcast` event
- [ ] Pins pulse with neon animation (teal)
- [ ] Click shows popup with title + snippet
- [ ] LayerTogglePanel 5th toggle works
- [ ] Pins auto-removed after 60s
- [ ] `pnpm dev` — no visual regressions
- [ ] `npx tsc --noEmit` — 0 errors
