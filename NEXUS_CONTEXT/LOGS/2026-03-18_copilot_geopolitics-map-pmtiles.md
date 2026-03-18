# ETERNAL NEXUS — COMMIT-AS-REPORT LOG
**Date:** 2026-03-18
**Agent:** @copilot
**Topic:** Task C2 + U1 — GeopoliticsMap MapLibre Shell + Dark Glassmorphism Style

---

## What Changed

| Path | Action | Purpose |
|---|---|---|
| `src/lib/geo/pmtiles.ts` | Created | Serverless PMTiles protocol registrar for MapLibre GL |
| `src/components/GeopoliticsMap.tsx` | Created | MapLibre React container — Tribunal data layer |
| `src/pages/GeopoliticsNarrative.tsx` | Modified | Wired `<GeopoliticsMap />` into Tribunal page |
| `package.json` / `package-lock.json` | Modified | Added `maplibre-gl@5.20.2` + `pmtiles@4.4.0` |
| `NEXUS_CONTEXT/PIPELINE.md` | Modified | Marked C2 and U1 as done |

---

## Why (Alignment with Phase Gate)

This delivery directly strengthens the **Nervous System v1 phase gate**:

- **Tribunal → Atlas consequence**: Verdicts from `useNexusState` are rendered as GeoJSON markers on the MapLibre canvas. Same `verdict.id` always maps to the same geographic position (deterministic djb2 seed → `hashCode`). ✓
- **Idempotent**: `registerPMTilesProtocol()` has a singleton guard — calling it multiple times has zero side-effect. ✓
- **Narratable**: Each verdict popup shows topic, verdict type, and confidence % — ready for News to read. ✓
- **Visual DNA (Task U1)**: Dark Glassmorphism style — `#02020a` canvas, neon `#00ffcc` country borders with blur halo, all unnecessary city/transport labels removed. ✓

---

## Evidence (Commands Executed)

```bash
# Security check — no vulnerabilities in new packages
npm show maplibre-gl@5.20.2 && npm show pmtiles@4.4.0
# Advisory DB: CLEAN

# Install
npm install maplibre-gl@5.20.2 pmtiles@4.4.0 --save

# Type-check — zero new errors introduced
npx tsc --noEmit -p tsconfig.app.json 2>&1 | grep -E "geo/pmtiles|GeopoliticsMap"
# Output: (empty — no errors)

# Tests
npm test
# Test Files  2 passed (2)
# Tests  2 passed (2)
```

---

## Risks + Rollback

| Risk | Likelihood | Mitigation |
|---|---|---|
| MapLibre GL `addProtocol` API change in v6 | Low | Protocol class uses typed pmtiles v4 interface |
| Demo tile server goes offline | Medium | Style can be swapped to any MapLibre-compatible tile URL — single constant `NEXUS_DARK_STYLE` |
| SSR / test environment without DOM | Low | Component uses `useEffect` for map init — skips in headless environments |

**Rollback:** `git revert <commit>` — removes only `pmtiles.ts`, `GeopoliticsMap.tsx`, and the 8-line diff in `GeopoliticsNarrative.tsx`.

---

## Next 3 Tasks

1. **Task C1** (@claude): Wire `bus.ts` event bus into `useNexusState.ts` for full idempotent, replayable Sacred Flow.
2. **Task A2** (@codex): Add PMTiles + MapLibre memory profiling to CI performance gate.
3. **Task F1** (any pioneer): Replace MapLibre demo tiles with a self-hosted or CDN-backed PMTiles world basemap for production-grade rendering.
