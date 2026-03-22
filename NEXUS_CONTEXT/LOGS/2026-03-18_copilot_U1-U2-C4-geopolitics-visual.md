# 2026-03-18 — copilot — U1-U2-C4-geopolitics-visual

## Context
- **Tasks:** U1 (Dark Glassmorphism DNA), U2 (Layer Toggle Panel), C4 (Conflict Heatmap)
- **Issues:** #13 (U1), #14 (U2), #19 (C4)
- **Phase Gate:** Nervous System v1 — Atlas visualization layer

## What changed (facts)
- **Files modified:**
  - `src/lib/map/dark-style.ts` — U1: enhanced neon glow layers, enabled country + city labels, exported `startNeonBorderAnimation()` and `CONFLICT_COLOR_RAMP`
  - `src/components/geopolitics/GeopoliticsMap.tsx` — U1+U2+C4: neon animation, layer toggle panel integration, heatmap layer, migration/energy grid placeholder layers
  - `src/index.css` — U1: `.nexus-popup`, `.nexus-map-container` scan-line overlay, `.nexus-map-frame` neon pulse keyframe
- **Files created:**
  - `src/components/geopolitics/LayerTogglePanel.tsx` — U2: glassmorphism panel following EnvironmentPanel pattern, toggles 4 layers
  - `src/hooks/useConflictHeatmap.ts` — C4: subscribes to tribunal.verdict events, seeds known hotspots, returns GeoJSON for heatmap

## Why (alignment)
- **Sacred Flow:** Tribunal verdicts → Atlas visualization (verdict markers + heatmap) → downstream
- **Cascade UX alignment:** Dark Glassmorphism DNA applied: void background, golden neon borders, muted monospace labels, scan-line texture
- **What was cut (anti-soup):** No new npm dependencies, no dashboard panels, no random cards — everything is a living loop tied to the event bus

## Evidence (how to verify)
```bash
# Typecheck — only pre-existing errors should appear
npm run typecheck 2>&1 | grep -v "Cannot find type definition"

# Expected: 3 pre-existing errors (antialias, ReplayCursor.types, AtlasMarkerPayload.lat)
# All from original files, none from U1/U2/C4 files

# Visual check — start dev server and open Geopolitics page
npm run dev
# Navigate to /geopolitics — should see:
# - Dark map with gold neon animated borders
# - Country labels (muted gold, uppercase)
# - Layer toggle panel (top-left)
# - Conflict heatmap (teal→orange→red, seeded hotspots visible)
```

## U1 — Dark Glassmorphism DNA
- **Neon border animation:** `startNeonBorderAnimation()` runs rAF loop, pulses `country-borders-halo` + `country-borders-glow` opacity in sine wave
- **Layered glow:** 3 boundary layers (halo 8px/6blur, glow 4px/2blur, sharp 1px) for authentic glassmorphism depth
- **Labels enabled:** `country-labels` + `city-labels` now `visibility: 'visible'` (was `'none'`)
- **CSS:** `.nexus-map-frame` pulsing box-shadow, `.nexus-map-container::after` scan-line overlay

## U2 — Layer Toggle Panel
- **Pattern:** Follows `EnvironmentPanel.tsx` (glassmorphism card, `bg-card/95 backdrop-blur-xl`)
- **Layers:** Verdict Markers · Conflict Heatmap · Migration Routes · Energy Grid
- **Behavior:** Collapsible, shows active count, Eye/EyeOff icons per row
- **Integration:** `handleLayerToggle` in `GeopoliticsMap.tsx` calls `map.setLayoutProperty()` immediately

## C4 — Conflict Tension Heatmap
- **Seed data:** 8 known geopolitical hotspots pre-loaded (Gaza 0.95, Ukraine 0.88, etc.)
- **Live data:** Subscribes to `tribunal.verdict` events → derives weight from severity × confidence × verdict type
- **Cluster spread:** Each verdict generates 5 scattered points for natural heatmap density
- **Color gradient:** transparent → teal (0.1) → orange (0.5) → red (1.0) via `heatmap-color`
- **Zoom behavior:** heatmap fades out at zoom 7, replaced by precision conflict circles
- **Migration & Energy placeholders:** Layers added and wired to toggles, fed with seed geometry

## Risks + rollback
- **Risk:** `startNeonBorderAnimation()` runs rAF; cleanup is tied to map destroy lifecycle. If map is destroyed before cleanup runs → no leak (rAF is cancelled in cleanup).
- **Rollback:** `git revert` the PR. All changes are isolated to geopolitics/ and hooks/useConflictHeatmap.ts

## Next 3 tasks (ranked)
1. **C3** — Wire Atlas sensor data (climate, earthquake, pollution) through event bus
2. **C5** — Event bus persistence layer (localStorage/IndexedDB) for replay across page refresh
3. **A2** — Add PMTiles and MapLibre memory profiling to CI performance gate

## Suggestions to other pioneers (benchmark-based)
- **@claude:** `useConflictHeatmap` uses `bus.replay({}).filter()` as a workaround because `ReplayCursor` lacks a `types` field. Consider adding `types?: NexusEventType[]` to `ReplayCursor` for cleaner API surface.
- **@codex:** Pre-existing typecheck errors (`antialias`, `ReplayCursor.types`, `AtlasMarkerPayload.lat`) need fixing before CI gate can pass on type checks. These are in `useGeopoliticsMap.ts` and `GeopoliticsMap.tsx`.
- **@antigravity:** `@vitejs/plugin-react-swc` missing from node_modules in CI environment — `npm run test` fails with ERR_MODULE_NOT_FOUND. Pre-existing issue.
- **@copilot:** C4 heatmap seed data uses static coordinates. Once C3 lands (real-time Atlas sensor data), `ingestDataPoint()` in `useConflictHeatmap` should be wired to live `geopolitics` data points.
