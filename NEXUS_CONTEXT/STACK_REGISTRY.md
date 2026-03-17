# Eternal Nexus — STACK_REGISTRY (external tech candidates)

> Rule: No random copy-paste. All external tech goes through:
> **registry entry → lab branch validation → clean implementation PR**
>
> Each entry must have: subsystem, candidate, license, why it's best, integration plan, risks, decision.

---

## Format

```
### [Subsystem] — [Candidate name]
- **Repo/URL:** ...
- **License:** ...
- **Why best-in-class:** ...
- **Integration plan:** ...
- **Risks:** ...
- **Decision:** adopt | reject | evaluate-in-lab
- **Lab branch:** (if evaluating)
- **Date:** YYYY-MM-DD
- **Agent:** who proposed
```

---

## Already adopted (baseline stack)

### Globe rendering — CesiumJS
- **Repo/URL:** https://github.com/CesiumGS/cesium
- **License:** Apache 2.0
- **Why best-in-class:** Industry-standard 3D geospatial. Handles LOD, terrain, tiles natively.
- **Integration plan:** Already integrated via `resium` + direct Cesium API in `src/components/atlas/cesium/`.
- **Risks:** Bundle size (~4MB). COOP/COEP headers needed for SharedArrayBuffer.
- **Decision:** adopt (already in use)
- **Date:** 2026-03-17
- **Agent:** (pre-existing)

### UI primitives — Radix UI
- **Repo/URL:** https://github.com/radix-ui/primitives
- **License:** MIT
- **Why best-in-class:** Accessible, unstyled, composable. shadcn/ui layer on top.
- **Decision:** adopt (already in use)
- **Date:** 2026-03-17
- **Agent:** (pre-existing)

### 3D rendering — Three.js + React Three Fiber
- **Repo/URL:** https://github.com/pmndrs/react-three-fiber
- **License:** MIT
- **Why best-in-class:** Declarative Three.js for React. Used in Tribunal holographic judges.
- **Decision:** adopt (already in use)
- **Date:** 2026-03-17
- **Agent:** (pre-existing)

### Backend — Supabase
- **Repo/URL:** https://supabase.com
- **License:** Apache 2.0 (self-host) / proprietary (cloud)
- **Why best-in-class:** Postgres + Realtime + Auth in one. Already wired in hooks.
- **Decision:** adopt (already in use)
- **Date:** 2026-03-17
- **Agent:** (pre-existing)

---

## Candidates to evaluate

### Event transport — Supabase Realtime (Channels)
- **Repo/URL:** https://supabase.com/docs/guides/realtime
- **License:** Apache 2.0
- **Why best-in-class:** Already in stack. Channels support broadcast + presence. Could replace in-memory bus for persistence + cross-tab sync.
- **Integration plan:** Implement `NexusEventBus` interface backed by Supabase Realtime Channel. In-memory bus stays as fallback.
- **Risks:** Latency on free tier. Realtime row-level security adds complexity.
- **Decision:** evaluate-in-lab
- **Lab branch:** (TBD — Claude)
- **Date:** 2026-03-17
- **Agent:** Claude

### Camera inertia — @react-three/drei (Controls)
- **Repo/URL:** https://github.com/pmndrs/drei
- **License:** MIT
- **Why best-in-class:** OrbitControls with damping, already in R3F ecosystem.
- **Integration plan:** Already partially used. Evaluate for Atlas 3D camera if switching from Cesium camera.
- **Risks:** Conflicts with Cesium's own camera system. Don't mix.
- **Decision:** evaluate-in-lab
- **Lab branch:** (TBD — UI specialist)
- **Date:** 2026-03-17
- **Agent:** Claude (proposed), UI specialist (validates)

---

## Rejected

(none yet)
