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
