# Eternal Nexus — STACK_REGISTRY (external tech candidates)

> **Rule:** No random copy-paste. All external tech goes through:
> registry entry → lab branch validation → clean implementation PR
>
> Each entry must contain: subsystem, candidate, license, rationale,
> integration plan, risks, and adoption decision.

---

## Registry format

```
### <Subsystem>
- **Candidate:** <repo URL or npm package>
- **License:** <e.g., MIT, Apache-2.0, GPL-3.0>
- **Why best-in-class:** <brief rationale>
- **Integration plan:** <how it connects to Sacred Flow>
- **Risks:** <bundle size, maintenance, lock-in>
- **Lab branch:** <lab/<agent>/XX or "not yet tested">
- **Decision:** 🟡 PENDING | ✅ ADOPT | ❌ REJECT
- **Date:** YYYY-MM-DD
```

---

## Current stack (already in use — not candidates)

### UI Framework
- **In use:** React 18 + Vite + TypeScript
- **Status:** ✅ Established

### State Management
- **In use:** TanStack Query (nervous system backbone)
- **Status:** ✅ Established

### 3D/Globe
- **In use:** Cesium + React Three Fiber
- **Status:** ✅ Established

### Styling
- **In use:** Tailwind CSS + shadcn/ui
- **Status:** ✅ Established

### Testing
- **In use:** Vitest
- **Status:** ✅ Established

### Backend
- **In use:** Supabase (edge functions + DB)
- **Status:** ✅ Established

---

## Candidates (pending evaluation)

> Add entries here as pioneers discover best-in-class options.
> No entry = no adoption. Period.

### PMTiles
- **Candidate:** `protomaps/PMTiles`
- **License:** BSD-3-Clause
- **Why best-in-class:** Serverless tiles in one file reduces infra complexity drastically. No heavy GeoServer/PostGIS containers are required.
- **Integration plan:** Ship PMTiles for geopolitics basemaps and overlays natively inside the Vite/MapLibre pipeline.
- **Risks:** Tile generation pipeline complexity; static caching strategy footprint.
- **Lab branch:** `lab/antigravity/01-pmtiles`
- **Decision:** ✅ ADOPT
- **Date:** 2026-03-18
- **Scores:** A: 5/5 | B: 5/5 | C: 4/5 | D: 5/5 | E: 4/5
- **Benchmark tags:** `@antigravity` + `@ui`

### Protomaps Basemaps
- **Candidate:** `protomaps/basemaps`
- **License:** ODbL
- **Why best-in-class:** Fast path to quality vector basemaps containing pure geopolitical boundary data without Mapbox/Google API styling bloat.
- **Integration plan:** Provide raw vector tiles that UI can perfectly style via Dark Glassmorphism.
- **Risks:** Missing granular local street-level details (acceptable for a global OS layer).
- **Lab branch:** `lab/antigravity/01-pmtiles`
- **Decision:** ✅ ADOPT
- **Date:** 2026-03-18
- **Scores:** A: 4/5 | B: 5/5 | C: 4/5 | D: 5/5 | E: 4/5
- **Benchmark tags:** `@ui` + `@antigravity`

### Yjs
- **Candidate:** `yjs/yjs`
- **License:** MIT
- **Why best-in-class:** CRDT patterns for local-first peer-to-peer shared state and workspace presence without centralized chokepoints.
- **Integration plan:** Strictly bound to the Lab Hub for live document interaction. Must keep the central event Index independent for now.
- **Risks:** Networking topology stability; persistence layers synchronization.
- **Lab branch:** `lab/claude/02-yjs`
- **Decision:** 🟡 LAB-VALIDATING
- **Date:** 2026-03-18
- **Scores:** A: 5/5 | B: 4/5 | C: 3/5 | D: 5/5 | E: 5/5
- **Benchmark tags:** `@claude` + `@antigravity`

<!-- Example entry:
### Camera inertia (Atlas globe)
- **Candidate:** https://github.com/example/smooth-camera
- **License:** MIT
- **Why best-in-class:** Sub-frame interpolation, proven in production globes
- **Integration plan:** Replace current AtlasGlobe camera controller
- **Risks:** 12kb bundle, last commit 6mo ago
- **Lab branch:** lab/claude/01
- **Decision:** 🟡 PENDING
- **Date:** 2026-03-17
-->
