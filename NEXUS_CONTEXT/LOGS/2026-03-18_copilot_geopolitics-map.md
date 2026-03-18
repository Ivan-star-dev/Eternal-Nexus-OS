# NEXUS LOG — 2026-03-18 | @copilot | geopolitics-map

## What Changed

**Files created:**
- `src/lib/geo/pmtiles.ts` — PMTiles serverless protocol registrar (idempotent, module-scoped)
- `src/lib/geo/nexus-style.ts` — Eternal Nexus Dark Glassmorphism Mapbox Style Specification JSON
- `src/components/atlas/GeopoliticsMap.tsx` — MapLibre GL React shell, wired to Tribunal verdicts + Atlas data

**Files modified:**
- `NEXUS_CONTEXT/PIPELINE.md` — Tasks C2 and U1 crossed off
- `package.json` / `package-lock.json` — Added `maplibre-gl@^5.20.2` and `pmtiles@^4.4.0`

---

## Why (Alignment)

**Task C2 (GeopoliticsMap.tsx):**  
Sacred Flow requires Atlas to receive and visualise geopolitical consequence from Tribunal decisions.  
The MapLibre shell is the visual receptor: it mounts with the Nexus dark style, registers PMTiles protocol once per session (idempotent), accepts Tribunal verdicts as props, and drives neon border paint changes in real time.

**Task U1 (nexus-style.ts):**  
Visual DNA cascading rule: every hub inherits from parent (Nexus → Atlas).  
Applied: void black canvas (#020408), neon cyan country borders with glow pass, morabeza gold labels (country names only, hidden below zoom 2), zero label clutter at world view, crimson flash on rejected verdicts, gold glow on approved verdicts.

---

## Evidence

```bash
# Packages installed cleanly
npm install maplibre-gl pmtiles --legacy-peer-deps
# added maplibre-gl@5.20.2, pmtiles@4.4.0

# TypeScript — no new errors introduced
npm run typecheck
# All errors are pre-existing @react-three/fiber JSX type issues
# (noted in CLAUDE_HANDOFF.md P0 fix — out of @copilot scope)

# New files compile cleanly — grep confirms zero TS errors in geo/ and GeopoliticsMap.tsx
cat /tmp/typecheck-output.txt | grep "error TS" | grep "geo/\|GeopoliticsMap"
# (empty — no errors in new files)
```

---

## Risks & Rollback

| Risk | Mitigation | Rollback |
|---|---|---|
| PMTiles CDN URL changes (protomaps.io) | URL is in `pmtiles.ts` constant — single edit to update | Swap `GEOPOLITICS_PMTILES_URL` |
| MapLibre API breaking change | Pinned to `^5.20.2` — minor/patch only | `npm install maplibre-gl@5.20.2 --save-exact` |
| `@react-three/fiber` JSX type gap breaks CI | Pre-existing issue — logged in CLAUDE_HANDOFF P0 | Not introduced by this PR |
| PMTiles protocol double-register on HMR | Module-level boolean guard `_protocolRegistered` prevents it | Guard already in place |

---

## Next 3 Tasks

1. **@claude — Task C1:** Wire `bus.ts` Nervous System v2 into `useNexusState.ts` — gate: deterministic, idempotent, replayable.
2. **@codex — Task A2:** Add PMTiles + MapLibre memory profiling to the CI performance gate.
3. **All pioneers:** If pipeline < 3 tasks after C1 + A2, break down Nervous System Phase Gate into sub-tasks (Index persistence, News narrative, replay cursor).

---

## Suggestions to Other Pioneers

- **@claude:** `GeopoliticsMap.tsx` exposes `verdicts` and `atlasData` props — wire `useNexusState()` return values directly. The component is ready to receive the event bus output once C1 is done.
- **@codex:** `maplibre-gl` bundle is ~800 KB gzip. Add a CI size-budget check alongside the memory profiling task (A2).
- **@antigravity:** Consider adding a `pmtiles.ts` smoke test to the protocol-gates workflow — verify that the PMTiles registrar mounts without throwing in a headless browser.
