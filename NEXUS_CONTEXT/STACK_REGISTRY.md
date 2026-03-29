# STACK_REGISTRY - Best-in-class candidates (proposal + scoring)
> Purpose: speed up delivery by adopting best-in-class open source without creating dependency soup.
>
> Rule: register -> validate in `lab/<agent>/..` -> re-implement cleanly in `agent/<agent>` -> PR -> merge.
>
> Current Phase Gate: Nervous System v1 (Tribunal -> Atlas deterministic + idempotent + replayable + logged + narratable).

---

## Scoring rubric (0-5 each)
- A Alignment: strengthens Sacred Flow + cascade UX
- B Performance: scale + stability (FPS, memory, responsiveness)
- C Integration effort: how hard to integrate (5 = easy)
- D License risk: 5 = low risk / permissive
- E Maintenance health: activity, community, issues, releases

Decision states: `pending | lab-validating | adopt | reject`

---

## Adoption order (recommended)
1. State spine and orchestration: XState
2. Earth runtime: CesiumJS (+ your Atlas core)
3. GPU overlays: deck.gl
4. Vector geopolitics hub: MapLibre GL + PMTiles (+ basemaps)
5. Index graph: Cytoscape.js
6. Polish motion layer: Motion
7. Lab collaboration substrate: Yjs
8. Analysis hub (optional): kepler.gl

---

## Current stack already in use
- React 18 + Vite + TypeScript
- TanStack Query
- Cesium + React Three Fiber
- Tailwind CSS + shadcn/ui
- Vitest
- Supabase

---

## Candidate list (top 10)
Keep this list objective: what it accelerates and how we prove it.

### 1) CesiumJS
- Repo: `CesiumGS/cesium`
- Subsystem: Atlas (Earth runtime)
- Organ(s): Atlas
- Why best-in-class: 3D globe + terrain + 3D Tiles streaming at scale
- Pilot (1-2 days): load terrain + one 3D tileset + deterministic camera path
- Integration plan: keep as dependency; extend via your Atlas core wrappers
- License: Apache-2.0 (verify)
- Risks: bundle size; GPU memory budgets; camera feel needs tuning
- Scores: A _/5  B _/5  C _/5  D _/5  E _/5
- Decision: pending
- Benchmark tags: `@claude` + `@ui`

### 2) deck.gl
- Repo: `visgl/deck.gl`
- Subsystem: High-density geospatial overlays (signals)
- Organ(s): Atlas + News
- Why best-in-class: GPU-accelerated layers for arcs, scatter, and heatmaps
- Pilot: 1M points layer + arcs on a map; verify 60fps tiered
- Integration plan: use for Intel and Live modes; keep strict overlay budgets
- License: MIT (verify)
- Risks: interop with Cesium; layering and z-order; perf tuning
- Scores: A _/5  B _/5  C _/5  D _/5  E _/5
- Decision: pending
- Benchmark tags: `@claude` + `@ui`

### 3) MapLibre GL JS
- Repo: `maplibre/maplibre-gl-js`
- Subsystem: Geopolitics hub (Waze-like)
- Organ(s): Tribunal + News + Atlas
- Why best-in-class: open vector map runtime + styles ecosystem
- Pilot: interactive world map + lines and dots + zoom-to-country info panel
- Integration plan: Geopolitics page uses MapLibre inside the shared cascade shell
- License: BSD-3-Clause (verify)
- Risks: style complexity; label clutter; performance at extreme zoom
- Scores: A _/5  B _/5  C _/5  D _/5  E _/5
- Decision: pending
- Benchmark tags: `@ui` + `@claude`

### 4) PMTiles
- Repo: `protomaps/PMTiles`
- Subsystem: Serverless tiles packaging and delivery
- Organ(s): Atlas + Index
- Why best-in-class: tiles in one file reduces infra complexity
- Pilot: host PMTiles on static hosting + load in MapLibre
- Integration plan: ship PMTiles for geopolitics basemaps and overlays
- License: verify
- Risks: tile generation pipeline; caching strategy
- Scores: A 5/5  B 5/5  C 4/5  D 5/5  E 4/5
- Decision: adopt
- Benchmark tags: `@antigravity` + `@ui`
- Notes: `@antigravity` -> Serverless PMTiles means no heavy GeoServer/PostGIS containers are required. Saves infrastructure overhead. I will map out the hosting pipeline and pilot it.

### 5) Protomaps Basemaps
- Repo: `protomaps/basemaps`
- Subsystem: Basemap + styles pipeline
- Organ(s): Atlas
- Why best-in-class: fast path to quality vector basemaps
- Pilot: import style + verify readability + declutter rules
- Integration plan: base layer for geopolitics; keep your visual DNA
- License: verify
- Risks: design mismatch; style overrides needed
- Scores: A 4/5  B 5/5  C 4/5  D 5/5  E 4/5
- Decision: adopt
- Benchmark tags: `@ui` + `@antigravity`
- Notes: `@antigravity` -> Provides raw vector tiles that UI can perfectly style without Mapbox/Google API quotas. I will secure the basemap extracts.

### 6) kepler.gl (optional)
- Repo: `keplergl/kepler.gl`
- Subsystem: Analysis hub components
- Organ(s): Lab + Intelligence mode
- Why best-in-class: mature geospatial analysis UX
- Pilot: embed a minimal subset into a Lab hub, never the full dashboard shell
- Integration plan: extract patterns and components; do not inherit dashboard feel
- License: MIT (verify)
- Risks: heavy; dashboard vibe; needs strong constraints
- Scores: A _/5  B _/5  C _/5  D _/5  E _/5
- Decision: pending
- Benchmark tags: `@ui` + `@codex`

### 7) XState
- Repo: `statelyai/xstate`
- Subsystem: Sacred Flow orchestration and state machines
- Organ(s): Nexus + Tribunal + Atlas
- Why best-in-class: explicit machines and actors prevent spaghetti state
- Pilot: model Sacred Flow as a machine + simulate event propagation
- Integration plan: put it in `src/lib/flow/` as the canonical state backbone
- License: MIT (verify)
- Risks: learning curve; over-modeling
- Scores: A _/5  B _/5  C _/5  D _/5  E _/5
- Decision: pending
- Benchmark tags: `@claude`

### 8) Motion
- Repo: `motiondivision/motion`
- Subsystem: premium UI motion system
- Organ(s): Nexus shell + all hubs
- Why best-in-class: fast path to Apple-grade transitions
- Pilot: implement cascade push-in, pull-out, and lateral glide transitions
- Integration plan: one motion language across hubs; no random animation
- License: MIT (verify)
- Risks: over-animation; perf during heavy rendering
- Scores: A _/5  B _/5  C _/5  D _/5  E _/5
- Decision: pending
- Benchmark tags: `@ui` + `@codex`

### 9) Yjs
- Repo: `yjs/yjs`
- Subsystem: collaboration substrate (Lab)
- Organ(s): Lab + Index
- Why best-in-class: CRDT patterns for shared state and presence
- Pilot: shared doc + presence in a Lab room
- Integration plan: limited scope; do not explode complexity early
- License: MIT (verify)
- Risks: networking; persistence; security model
- Scores: A 5/5  B 4/5  C 3/5  D 5/5  E 5/5
- Decision: lab-validating
- Benchmark tags: `@claude` + `@antigravity`
- Notes: `@antigravity` -> Excellent for local-first CRDTs, but risky if state scales wildly. Must be strictly bounded to the Lab Hub, keeping the main Index independent. Will validate network topology.

### 10) Cytoscape.js
- Repo: `cytoscape/cytoscape.js`
- Subsystem: Index knowledge graph visualization
- Organ(s): Index
- Why best-in-class: real graph interaction + layouts
- Pilot: render 1k nodes + filtering + spotlight transitions
- Integration plan: Index hub is graph-first, not list-first
- License: MIT (verify)
- Risks: layout perf; design integration
- Scores: A _/5  B _/5  C _/5  D _/5  E _/5
- Decision: pending
- Benchmark tags: `@ui` + `@claude`

---

## Must-not-adopt red flags (anti-soup)
- Anything that forces a dashboard aesthetic as the default UX
- Anything that demands a full backend you do not need yet
- Anything with unclear license or ownership
# STACK_REGISTRY — Eternal Nexus OS

> Scoring canônico dos candidatos tecnológicos por lane.
> Decisões: ADOPT | TRIAL | HOLD | REJECT
> Scores: 1 (fraco) → 5 (excelente)

**Criado:** 2026-03-22
**Criado por:** @claude | Pilar 2 — Structure
**Versão:** v1.0

---

## Scoring Legend

| Coluna | Critério |
|---|---|
| **A** | Performance |
| **B** | Integration fit |
| **C** | Maturity / Stability |
| **D** | Dev experience |
| **E** | Vision alignment |
| **Total** | A+B+C+D+E (max 25) |

---

## Lane 1 — Map Engine

| Candidate | A | B | C | D | E | Total | Decision | Rationale |
|---|---|---|---|---|---|---|---|---|
| **MapLibre GL JS** | 5 | 5 | 4 | 5 | 5 | 24 | ADOPT | Open-source, WebGL-native, zero licensing cost — ideal fit for the project's sovereign map layer |
| **Mapbox GL JS** | 5 | 4 | 5 | 5 | 3 | 22 | HOLD | Feature-equivalent to MapLibre but vendor-locked with paid token; deprioritized until licensing is a non-issue |
| **CesiumJS** | 4 | 3 | 5 | 3 | 4 | 19 | TRIAL | Best-in-class for 3D globe/terrain; trial if Nexus OS expands into immersive 3D map territory |
| **deck.gl** | 4 | 4 | 4 | 4 | 4 | 20 | TRIAL | Excellent large-dataset overlay layer; trial as a composable layer on top of MapLibre, not a map engine replacement |

---

## Lane 2 — Data / Tiles

| Candidate | A | B | C | D | E | Total | Decision | Rationale |
|---|---|---|---|---|---|---|---|---|
| **PMTiles** | 5 | 5 | 4 | 4 | 5 | 23 | ADOPT | Single-file, serverless tile delivery — eliminates tile server ops overhead and aligns with edge-first architecture |
| **GeoJSON static** | 3 | 5 | 5 | 5 | 3 | 21 | ADOPT | Zero infra cost; adopted for lightweight overlays and dev/prototype layers; not for large datasets |
| **Supabase PostGIS** | 4 | 4 | 4 | 4 | 4 | 20 | TRIAL | Powerful spatial queries with Supabase already in stack; trial for dynamic data layers and user-generated geo content |

---

## Lane 3 — Animation / Motion

| Candidate | A | B | C | D | E | Total | Decision | Rationale |
|---|---|---|---|---|---|---|---|---|
| **Framer Motion** | 4 | 5 | 4 | 5 | 5 | 23 | ADOPT | React-native, declarative, deep integration with current UI system (shadcn + Radix); canonical motion layer |
| **React Spring** | 4 | 4 | 4 | 4 | 4 | 20 | TRIAL | Physics-based; trial for specific interactive map gestures or orbital animations that feel physics-driven |
| **GSAP** | 5 | 3 | 5 | 4 | 3 | 20 | HOLD | Industry-leading but complex licensing for commercial use and weak React integration; hold until clear need arises |
| **CSS transitions only** | 3 | 5 | 5 | 5 | 2 | 20 | HOLD | Zero-overhead default; hold as fallback strategy for performance-critical no-JS paths, not for primary UI motion |

---

## Lane 4 — Packaging / Ops

| Candidate | A | B | C | D | E | Total | Decision | Rationale |
|---|---|---|---|---|---|---|---|---|
| **Vite (current)** | 5 | 5 | 5 | 5 | 5 | 25 | ADOPT | Current canonical bundler; fast HMR, ecosystem maturity, zero reason to migrate — stays |
| **Bun** | 5 | 3 | 3 | 4 | 4 | 19 | TRIAL | Fastest runtime/install but ecosystem parity still maturing (see B-002 blocker); trial as dev-only runtime, not prod PM |
| **Docker deployment** | 4 | 4 | 5 | 3 | 4 | 20 | TRIAL | Solid for self-hosted or staging environments; trial for ops reproducibility as project scales to multi-service |
| **Vercel / Netlify edge** | 5 | 5 | 5 | 5 | 5 | 25 | ADOPT | Zero-config edge deployment aligns with serverless-first vision; current preferred hosting lane |

---

## Lane 5 — UI System

| Candidate | A | B | C | D | E | Total | Decision | Rationale |
|---|---|---|---|---|---|---|---|---|
| **Tailwind CSS (current)** | 5 | 5 | 5 | 5 | 5 | 25 | ADOPT | Current canonical utility layer; zero friction, maximum composability — stays indefinitely |
| **shadcn/ui (current)** | 4 | 5 | 4 | 5 | 5 | 23 | ADOPT | Current canonical component layer; copy-owned components, Radix-based, aligned with sovereign design philosophy |
| **Radix UI** | 4 | 5 | 5 | 4 | 4 | 22 | ADOPT | shadcn/ui is built on Radix primitives; already in stack as foundation layer — adopt as dependency, not replacement |
| **Custom design tokens** | 4 | 5 | 3 | 4 | 5 | 21 | TRIAL | Trial as system matures; needed for brand consistency across map UI, dashboards, and public-facing surfaces |

---


---

## Scoring Legend

| Coluna | Critério |
|---|---|
| **A** | Performance |
| **B** | Integration fit |
| **C** | Maturity / Stability |
| **D** | Dev experience |
| **E** | Vision alignment |
| **Total** | A+B+C+D+E (max 25) |

---

## Lane 1 — Map Engine

| Candidate | A | B | C | D | E | Total | Decision | Rationale |
|---|---|---|---|---|---|---|---|---|
| **MapLibre GL JS** | 5 | 5 | 4 | 5 | 5 | 24 | ADOPT | Open-source, WebGL-native, zero licensing cost — ideal fit for the project's sovereign map layer |
| **Mapbox GL JS** | 5 | 4 | 5 | 5 | 3 | 22 | HOLD | Feature-equivalent to MapLibre but vendor-locked with paid token; deprioritized until licensing is a non-issue |
| **CesiumJS** | 4 | 3 | 5 | 3 | 4 | 19 | TRIAL | Best-in-class for 3D globe/terrain; trial if Nexus OS expands into immersive 3D map territory |
| **deck.gl** | 4 | 4 | 4 | 4 | 4 | 20 | TRIAL | Excellent large-dataset overlay layer; trial as a composable layer on top of MapLibre, not a map engine replacement |

---

## Lane 2 — Data / Tiles

| Candidate | A | B | C | D | E | Total | Decision | Rationale |
|---|---|---|---|---|---|---|---|---|
| **PMTiles** | 5 | 5 | 4 | 4 | 5 | 23 | ADOPT | Single-file, serverless tile delivery — eliminates tile server ops overhead and aligns with edge-first architecture |
| **GeoJSON static** | 3 | 5 | 5 | 5 | 3 | 21 | ADOPT | Zero infra cost; adopted for lightweight overlays and dev/prototype layers; not for large datasets |
| **Supabase PostGIS** | 4 | 4 | 4 | 4 | 4 | 20 | TRIAL | Powerful spatial queries with Supabase already in stack; trial for dynamic data layers and user-generated geo content |

---

## Lane 3 — Animation / Motion

| Candidate | A | B | C | D | E | Total | Decision | Rationale |
|---|---|---|---|---|---|---|---|---|
| **Framer Motion** | 4 | 5 | 4 | 5 | 5 | 23 | ADOPT | React-native, declarative, deep integration with current UI system (shadcn + Radix); canonical motion layer |
| **React Spring** | 4 | 4 | 4 | 4 | 4 | 20 | TRIAL | Physics-based; trial for specific interactive map gestures or orbital animations that feel physics-driven |
| **GSAP** | 5 | 3 | 5 | 4 | 3 | 20 | HOLD | Industry-leading but complex licensing for commercial use and weak React integration; hold until clear need arises |
| **CSS transitions only** | 3 | 5 | 5 | 5 | 2 | 20 | HOLD | Zero-overhead default; hold as fallback strategy for performance-critical no-JS paths, not for primary UI motion |

---

## Lane 4 — Packaging / Ops

| Candidate | A | B | C | D | E | Total | Decision | Rationale |
|---|---|---|---|---|---|---|---|---|
| **Vite (current)** | 5 | 5 | 5 | 5 | 5 | 25 | ADOPT | Current canonical bundler; fast HMR, ecosystem maturity, zero reason to migrate — stays |
| **Bun** | 5 | 3 | 3 | 4 | 4 | 19 | TRIAL | Fastest runtime/install but ecosystem parity still maturing (see B-002 blocker); trial as dev-only runtime, not prod PM |
| **Docker deployment** | 4 | 4 | 5 | 3 | 4 | 20 | TRIAL | Solid for self-hosted or staging environments; trial for ops reproducibility as project scales to multi-service |
| **Vercel / Netlify edge** | 5 | 5 | 5 | 5 | 5 | 25 | ADOPT | Zero-config edge deployment aligns with serverless-first vision; current preferred hosting lane |

---

## Lane 5 — UI System

| Candidate | A | B | C | D | E | Total | Decision | Rationale |
|---|---|---|---|---|---|---|---|---|
| **Tailwind CSS (current)** | 5 | 5 | 5 | 5 | 5 | 25 | ADOPT | Current canonical utility layer; zero friction, maximum composability — stays indefinitely |
| **shadcn/ui (current)** | 4 | 5 | 4 | 5 | 5 | 23 | ADOPT | Current canonical component layer; copy-owned components, Radix-based, aligned with sovereign design philosophy |
| **Radix UI** | 4 | 5 | 5 | 4 | 4 | 22 | ADOPT | shadcn/ui is built on Radix primitives; already in stack as foundation layer — adopt as dependency, not replacement |
| **Custom design tokens** | 4 | 5 | 3 | 4 | 5 | 21 | TRIAL | Trial as system matures; needed for brand consistency across map UI, dashboards, and public-facing surfaces |

---

## Summary — Decisions by Lane

| Lane | ADOPT | TRIAL | HOLD | REJECT |
|---|---|---|---|---|
| **1 — Map Engine** | MapLibre GL JS | CesiumJS, deck.gl | Mapbox GL JS | — |
| **2 — Data/Tiles** | PMTiles, GeoJSON static | Supabase PostGIS | — | — |
| **3 — Animation/Motion** | Framer Motion | React Spring | GSAP, CSS transitions only | — |
| **4 — Packaging/Ops** | Vite, Vercel/Netlify edge | Bun, Docker deployment | — | — |
| **5 — UI System** | Tailwind CSS, shadcn/ui, Radix UI | Custom design tokens | — | — |

---

## Notes

- **B-002 blocker** (npm vs bun) is registered in `ops/LIVE_STATE.md` — Bun TRIAL score reflects this unresolved decision.
- No candidates were REJECTED in v1.0; all have legitimate futures within the project's trajectory.
- Re-evaluate HOLD candidates when: (a) licensing constraints change (Mapbox, GSAP), (b) performance ceiling is hit (CSS transitions), or (c) product moves to 3D-dominant surfaces (CesiumJS upgrade path).
- This registry is a living document. Versions bump when new lanes are opened or decisions change.
