# 2026-03-18 — claude — Task C2: MapLibre + PMTiles GeopoliticsMap shell

## Context
- **Why this task exists**: PIPELINE.md Task C2 — "Implement the GeopoliticsMap.tsx MapLibre shell using the new serverless pmtiles:// registrar. Tie into the Tribunal data layer."
- **Phase Gate targeted:** Nervous System v1 — extending Sacred Flow visualization to 2D geopolitics map

## What changed (facts)
- **Files:**
  - `src/lib/map/pmtiles-protocol.ts` — PMTiles `pmtiles://` protocol registrar for MapLibre (NEW)
  - `src/lib/map/dark-style.ts` — Dark Glassmorphism base map style (NEW)
  - `src/lib/map/index.ts` — Barrel export (NEW)
  - `src/hooks/useGeopoliticsMap.ts` — Bridge: event bus → GeoJSON for map (NEW)
  - `src/components/geopolitics/GeopoliticsMap.tsx` — MapLibre GL map shell (NEW)
  - `src/components/geopolitics/index.ts` — Barrel export (NEW)
  - `src/pages/Geopolitics.tsx` — Added interactive map section (MODIFIED)
  - `NEXUS_CONTEXT/STACK_REGISTRY.md` — Registered MapLibre + PMTiles (MODIFIED)
  - `package.json` — Added `maplibre-gl@5.20.2` + `pmtiles@4.4.0` (MODIFIED)

- **Summary:**
  1. PMTiles protocol: registers `pmtiles://` with MapLibre, caches archive instances, supports HTTP range requests for serverless tile serving
  2. Dark style: Eternal Nexus color palette (void bg, golden borders, teal accents), country boundaries with neon glow, labels hidden by default (@copilot enables via U1)
  3. useGeopoliticsMap hook: subscribes to `tribunal.verdict` events → transforms to GeoJSON features with topic-based geo-location → publishes `atlas.marker` events on user click
  4. GeopoliticsMap component: MapLibre GL canvas with verdict marker layers (glow ring + core dot + label), click popup showing verdict details, lazy-loaded (~200KB)
  5. Geopolitics page: new expandable map section between hero and strategic table, Suspense boundary with loading state

## Why (alignment)
- **Sacred Flow alignment:** Tribunal verdicts now visualize on a 2D map (Atlas organ). Clicking map publishes atlas.marker events that flow to Index → News. Complete Sacred Flow participation.
- **Cascade UX alignment:** Dark Glassmorphism base style inherits Visual DNA. Map is a living loop (live event data), not a static dashboard.
- **What was cut (anti-soup):** No street-level detail, no POI labels, no complex layer system. Base shell only — @copilot adds visual polish via U1.

## Evidence (how to verify)
```bash
# Type-check (zero errors)
npx -p typescript tsc --noEmit

# Gate tests (25/25 pass, including all 23 nervous system tests)
npx vitest run

# Visual verification
npm run dev
# Navigate to /geopolitics → map should render with dark style + golden borders
# Add a verdict via GeopoliticsNarrative → marker should appear on map
```
**Expected output:** tsc clean, 25 tests pass, map renders at /geopolitics

## Risks + rollback
- **Risk:** WebGL context limit (Cesium + MapLibre on same page could exceed). Mitigated: they're on separate routes (/atlas vs /geopolitics)
- **Risk:** OpenFreeMap free tiles may have rate limits or downtime. Mitigated: PMTiles protocol allows switching to self-hosted tiles with zero code change
- **Rollback:** `git revert HEAD` removes all map infrastructure cleanly (no existing code was modified except Geopolitics.tsx imports)

## Next 3 tasks (ranked)
1. **Atlas event bus integration:** Wire Atlas sensor data (climate/earthquake/pollution) through event bus, not just TanStack (P1, @claude)
2. **GeopoliticsMap data layers:** Add conflict tension heatmap, migration routes, energy grid overlays using existing `RealtimeDataPoint` sources (P1, @claude + @copilot)
3. **PMTiles hosting:** Set up self-hosted .pmtiles on Supabase Storage or Cloudflare R2 for offline-capable tile serving (P2, @antigravity)

## Suggestions to other pioneers (benchmark-based)
- **@claude:** Next session, wire Atlas sensor data to bus + add geopolitics tension overlay layer to map
- **@codex:** Add MapLibre bundle size check to CI (should be < 250KB gzipped). Consider lazy-load verification test.
- **@antigravity:** Investigate Protomaps free planet tiles for self-hosting (.pmtiles, ~70GB for full planet). Cloudflare R2 = zero egress cost.
- **@copilot:** Task U1 is READY — the dark style base is in `src/lib/map/dark-style.ts`. Layer your glassmorphism treatment on top. Focus on: neon border animations, label typography, hover states, custom markers.

## Notes (optional)
- MapLibre v5 uses WebGL2 by default. WebGPU backend is in beta — evaluate for future performance gains.
- PMTiles cache is per-archive, so multiple layers sharing the same .pmtiles file pay zero extra HTTP overhead.
- Topic-to-coordinates mapping in useGeopoliticsMap.ts is hardcoded for known locations. Future: NLP geo-extraction or Atlas sensor data feed.
