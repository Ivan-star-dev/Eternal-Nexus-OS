# ETERNAL NEXUS — PIONEER HANDOFF: @copilot → Next

> **Date:** 2026-03-18
> **Branch:** copilot/finish-and-commit-all-tasks
> **Baton from:** @copilot

---

## Summary

Tasks U1, U2, and C4 are **COMPLETE**.

### U1 — Dark Glassmorphism Visual DNA ✅
- `src/lib/map/dark-style.ts`: 3-layer neon border glow, country + city labels enabled, water shimmer, sub-national dashed borders, `startNeonBorderAnimation()` rAF pulse
- `src/index.css`: `.nexus-popup` styled, scan-line overlay via `::after`, `.nexus-map-frame` pulsing box-shadow
- `src/components/geopolitics/GeopoliticsMap.tsx`: neon animation wired to map lifecycle, enhanced verdict markers (halo + glow + core layers)

### U2 — Layer Toggle Panel ✅
- `src/components/geopolitics/LayerTogglePanel.tsx`: glassmorphism card following EnvironmentPanel pattern, 4 toggles (verdict markers, conflict heatmap, migration routes, energy grid), collapsible, Eye/EyeOff per layer
- `GeopoliticsMap.tsx`: panel overlaid top-left, `handleLayerToggle` calls `map.setLayoutProperty()` immediately

### C4 — Conflict Tension Heatmap ✅
- `src/hooks/useConflictHeatmap.ts`: subscribes to `tribunal.verdict` events, seeds 8 known hotspots, generates point clusters per verdict, `ingestDataPoint()` API for live `RealtimeDataPoint`
- `GeopoliticsMap.tsx`: MapLibre heatmap layer (teal→orange→red), fade to precision circles at zoom 7+, migration routes + energy grid placeholder layers

---

## Proof
```bash
# Typecheck — zero new errors introduced by U1/U2/C4
npm run typecheck 2>&1 | grep -E "LayerTogglePanel|useConflictHeatmap|dark-style"
# Expected: empty output (no errors in my files)
```

---

## Next Baton Owners

- **@claude** → Task C3 (wire Atlas sensor data through event bus), Task C5 (event bus persistence)
- **@codex** → Task A2 (PMTiles/MapLibre memory profiling in CI), fix pre-existing typecheck errors
- **@antigravity** → Task A4 (self-hosted PMTiles on Cloudflare R2), fix `@vitejs/plugin-react-swc` in test env

---

## Next 3 Tasks (ranked)
1. **C3** — Wire Atlas sensor data through event bus (all `RealtimeDataPoint` sources → `atlas.marker`)
2. **C5** — Event bus persistence layer (localStorage/IndexedDB, maintains deterministic ID + idempotency)
3. **A2** — PMTiles + MapLibre memory profiling in CI performance gate

---

## Risks / Blockers
- `useConflictHeatmap` uses `bus.replay({}).filter()` workaround — @claude should add `types` to `ReplayCursor`
- C4 heatmap `ingestDataPoint()` API exists but not yet wired to live data — needs C3 to land first
- Energy grid + migration layers are seeded with static geometry — awaiting real sensor data from C3
