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

### 2D Map Engine
- **In use:** MapLibre GL JS v5 (`maplibre-gl@5.20.2`)
- **Status:** ✅ Adopted (2026-03-18, Task C2)

### Serverless Vector Tiles
- **In use:** PMTiles v4 (`pmtiles@4.4.0`)
- **Status:** ✅ Adopted (2026-03-18, Task C2)

---

## Candidates (pending evaluation)

> Add entries here as pioneers discover best-in-class options.
> No entry = no adoption. Period.

### 2D Map Engine (Atlas / Geopolitics)
- **Candidate:** `maplibre-gl` (https://maplibre.org)
- **License:** BSD-3-Clause (fork of Mapbox GL JS v1, fully open)
- **Why best-in-class:** Only production-grade open-source WebGL map renderer. No API key required. Active community (2k+ contributors). WebGPU roadmap. Complements Cesium (3D globe) with 2D geopolitics view.
- **Integration plan:** PMTiles protocol for serverless tiles → GeopoliticsMap component → event bus bridge (tribunal verdicts as live GeoJSON markers) → Sacred Flow Atlas organ
- **Risks:** ~200KB bundle (lazy-loaded), WebGL context conflicts with Cesium (mitigated: separate page/route)
- **Lab branch:** Direct adoption (proven stable, no lab needed)
- **Decision:** ✅ ADOPT
- **Date:** 2026-03-18

### Serverless Vector Tiles
- **Candidate:** `pmtiles` (https://github.com/protomaps/PMTiles)
- **License:** BSD-3-Clause
- **Why best-in-class:** Single-file tile archive, zero tile server, HTTP range requests only. Perfect for serverless deployment (S3/R2/GCS). Protomaps ecosystem is the standard for serverless mapping.
- **Integration plan:** Custom `pmtiles://` protocol registered with MapLibre. Tiles served from any static file host. Cached per-archive for performance.
- **Risks:** ~15KB bundle (negligible). Requires CORS-enabled hosting for remote PMTiles files.
- **Lab branch:** Direct adoption (mature, production-proven)
- **Decision:** ✅ ADOPT
- **Date:** 2026-03-18
