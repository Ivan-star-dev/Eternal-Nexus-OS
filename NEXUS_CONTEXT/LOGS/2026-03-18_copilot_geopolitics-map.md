# 2026-03-18 · copilot · geopolitics-map

## What changed (paths)

| File | Action |
|------|--------|
| `package.json` / `package-lock.json` | Added `maplibre-gl@5.20.2` and `pmtiles@4.4.0` |
| `src/lib/geo/pmtiles.ts` | **NEW** — Serverless PMTiles protocol registrar (global, idempotent) |
| `src/lib/geo/nexus-map-style.ts` | **NEW** — Dark Glassmorphism MapLibre Style Specification (Task U1) |
| `src/components/atlas/GeopoliticsMap.tsx` | **NEW** — MapLibre GL React shell component (Task C2) |
| `src/pages/Geopolitics.tsx` | **EDIT** — Added `GeopoliticsMap` section between Hero and Strategic Table |
| `NEXUS_CONTEXT/PIPELINE.md` | **EDIT** — Crossed off Task C2 and Task U1 |

---

## Why (alignment)

Tasks C2 and U1 are phase-gate requirements of the Eternal Nexus Nervous System v1:

- **C2** — MapLibre + PMTiles replaces the static hero image on Geopolitics with a live, serverless-sourced vector map. The component follows the existing organ pattern (CesiumViewer) and wires a global `pmtiles://` protocol handler before any source is added.
- **U1** — `nexus-map-style.ts` expresses the VISUAL_DNA directly in a Mapbox Style Spec JSON: deep navy background (hsl 216 55% 3%), glowing teal neon borders (hsl 172 80% 45%), gold mono labels at zoom ≥ 4 only, water surfaces fully dark. No neon soup — bloom is applied only to border layers via double-render.

---

## Evidence (commands + output)

```
npm install maplibre-gl pmtiles
# → added 2 packages, no vulnerabilities

npx tsc -p tsconfig.app.json --noEmit
# → 0 errors in src/lib/geo/* and src/components/atlas/GeopoliticsMap.tsx
# (pre-existing Three.js JSX errors in unrelated files unchanged)

npx vite build
# → ✓ built in 20.16s — Geopolitics chunk: 1,089 kB / 297 kB gzip
```

---

## Risks + rollback

| Risk | Mitigation |
|------|-----------|
| PMTiles archive URL is a public demo (ne_110m.pmtiles) | Swappable via the `PMTILES_URL` constant in GeopoliticsMap.tsx |
| maplibre-gl adds ~1 MB to Geopolitics chunk | lazy() import already applied in App.tsx; can be further split with manualChunks |
| Protocol double-registration in HMR | `unregisterPMTilesProtocol()` exported for test/dev teardown |

Rollback: remove the `<GeopoliticsMap>` section in Geopolitics.tsx and uninstall the two packages.

---

## Next 3 tasks

1. **@claude** — Task C1: Wire `bus.ts` into `useNexusState.ts` (Deterministic, Idempotent, Replayable)
2. **@codex** — Task A2: Add PMTiles + MapLibre memory profiling to CI performance gate
3. **@claude + @copilot** — Bind live Tribunal decisions to map highlight (pulse border on active geopolitical domain)

---

## Suggestions to other pioneers

- `@claude`: The map source key is `"nexus-geo"` — when wiring Tribunal events, `map.setPaintProperty("country-border", "line-color", ...)` can be used to flash contested borders.
- `@codex`: `unregisterPMTilesProtocol()` is available from `src/lib/geo/pmtiles.ts` to clean up state in CI/test runners.
- `@antigravity`: Consider adding `maplibre-gl` to the lab-branch memory budget in the CI gate script.
