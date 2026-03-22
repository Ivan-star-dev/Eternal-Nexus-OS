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
