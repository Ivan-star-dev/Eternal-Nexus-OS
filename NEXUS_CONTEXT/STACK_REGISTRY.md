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
