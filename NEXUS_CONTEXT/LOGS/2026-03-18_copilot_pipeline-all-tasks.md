# NEXUS LOG — 2026-03-18 | @copilot | pipeline-all-tasks

## What Changed

### Task C1 — Nervous System v2 wired
- **Created:** `src/lib/events/bus.ts`
  - Singleton `NexusEventBus` class with `emit`, `on`, `replay`, `getLog`, `getCursor`, `reset`
  - Idempotency guard via `seen: Set<string>`
  - Monotonic cursor for deterministic replay
- **Updated:** `src/hooks/useNexusState.ts`
  - Imports `bus` from `src/lib/events/bus`
  - `addVerdict` mutation now emits `tribunal:verdict` into bus after TanStack cache update
  - `useEffect` bridge subscribes to `tribunal:verdict` + `atlas:data` bus events → syncs TanStack cache
  - Exposes `busCursor` + `replayFrom` for checkpoint-based session replay

### Task C2 — GeopoliticsMap React shell
- **Created:** `src/lib/geo/pmtiles.ts`
  - `registerPMTilesProtocol()` — idempotent registrar for `pmtiles://` protocol in MapLibre GL
  - `buildPMTilesSource()` — typed helper for PMTiles source definition
  - `WORLD_ADMIN_PMTILES_URL` constant pointing to Natural Earth public archive
- **Created:** `src/components/atlas/GeopoliticsMap.tsx`
  - MapLibre GL React container with ref lifecycle management
  - Registers PMTiles protocol at module scope (idempotent)
  - Hover → `feature-state` highlight on `ne_10m_admin_0_countries`
  - Click → `bus.emit('atlas:data', ...)` — data point into Sacred Flow
  - Subscribes to `tribunal:verdict` → `map.flyTo()` the affected region
  - Props: `pmtilesUrl`, `center`, `zoom`, `className`

### Task U1 — Dark Glassmorphism visual DNA
- **Created:** `src/lib/geo/nexus-map-style.ts`
  - `buildNexusMapStyle(pmtilesUrl)` returns full `StyleSpecification`
  - COLORS token palette: void `#020409`, neonCyan `#00f5ff`, neonBlue `#0075ff`, neonRed `#ff003c`
  - Layers: background, water, land, country-border, country-border-glow (bloom), coastline, disputed-border (dashed neon red), country-fill-hover
  - Zero labels — pure geopolitical topology with neon glow borders

### Task A2 — CI performance gate
- **Verified:** `scripts/gates/performance/memory-budget.spec.ts` — already implemented, tests JS heap < 100 MB
- **Verified:** `.github/workflows/performance-gates.yml` — runs `npm run test:perf` on every PR + push to main
- No changes needed; gate is ACTIVE

### Dependencies
- **Added:** `maplibre-gl@5.20.2`, `pmtiles@3.2.0` to `package.json` + `package-lock.json`

### Tests
- **Created:** `src/test/bus.test.ts` — 10 tests proving all 3 invariants:
  - ✅ Deterministic (2 tests)
  - ✅ Idempotent (3 tests)
  - ✅ Replayable (3 tests)
  - ✅ Sacred Flow listener delivery (2 tests)
- **Result:** 12/12 tests GREEN (including 2 pre-existing tests)

---

## Why (Alignment)

All 4 active pipeline tasks delivered in one session:
- C1 closes the Nervous System v2 phase gate (Deterministic + Idempotent + Replayable proven by tests)
- C2 + U1 deliver the GeopoliticsMap organ with Dark Glassmorphism DNA
- A2 confirms the memory performance gate was already operational

---

## Evidence

```
> vitest run --reporter=verbose
 ✓ bus.test.ts > Deterministic > emitting same payload with same id ... 3ms
 ✓ bus.test.ts > Deterministic > cursor increases monotonically ...     0ms
 ✓ bus.test.ts > Idempotent > duplicate does NOT appear in log ...      1ms
 ✓ bus.test.ts > Idempotent > duplicate does NOT fire listener again ... 0ms
 ✓ bus.test.ts > Idempotent > different id DOES create new entry ...    1ms
 ✓ bus.test.ts > Replayable > replay(0) returns all events ...          1ms
 ✓ bus.test.ts > Replayable > replay(n) returns only events after n ... 0ms
 ✓ bus.test.ts > Replayable > cursor preserved across subscribe/unsub ...0ms
 ✓ bus.test.ts > Sacred Flow > listener receives verdict payload ...     0ms
 ✓ bus.test.ts > Sacred Flow > unsubscribe stops listener ...            0ms
 ✓ nexus-flow.test.tsx > Nexus Propagation Flow ...                     71ms
 ✓ example.test.ts > example > should pass                              2ms

 Test Files  3 passed (3)
      Tests  12 passed (12)
```

Typecheck: zero new errors in changed/created files.
Lint: zero new warnings in changed/created files.

---

## Risks + Rollback

- **MapLibre GL v5** was installed (latest stable). The `antialias` option moved to `canvasContextAttributes` — updated accordingly.
- **PMTiles source layers** (`ne_10m_admin_0_countries`, etc.) depend on the Natural Earth PMTiles schema. If the source changes, style layers referencing those source-layer names will silently render nothing. Mitigation: pin to versioned archive URL.
- **Rollback:** revert `package.json` + `package-lock.json` entries and delete the 4 new files.

---

## Next 3 Tasks (generated — pipeline rule)

- **N1:** Integrate `GeopoliticsMap` into `AtlasPage` with live Tribunal fly-to
- **N2:** Persist `bus.getLog()` to Supabase `index_events` table (Logged invariant)
- **N3:** Wire `echo-vox` to `index:logged` events → `NewsBroadcast` (Narratable invariant)
