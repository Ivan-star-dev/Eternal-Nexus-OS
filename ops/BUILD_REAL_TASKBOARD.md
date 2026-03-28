# BUILD REAL TASKBOARD — Ruberra V10
> Cravado em 2026-03-28 | @claude | Branch: claude/setup-ruberra-nexus-IL7Tg
> Lei de execução. Estado real. Sem abstraction drift.

---

## BUILD STATE SNAPSHOT — 2026-03-28

```
TIER 0 — CORE FOUNDATION         ████████████████████ 100% ✅
TIER 1 — CREATION LAB WEDGE      ████████████████░░░░  82% 🔄
TIER 2 — PILOT READINESS         ████████░░░░░░░░░░░░  40% 🔄
TIER 3 — PROOF HARDENING         ██░░░░░░░░░░░░░░░░░░  10% ⬜
```

---

## REPO STRUCTURE — CANONICAL MAP

```
src/
├── lib/
│   ├── core/              ✅ NexusRuntime · FusionBus · OrganismState
│   ├── artifacts/         ✅ ArtifactStore (localStorage CRUD)
│   ├── spawn/             ✅ EntryPipeline · resolveEntry()
│   ├── governance/        ✅ RuntimeGuard · G-01→G-06
│   ├── fidelity/          ✅ FidelityLadder · 4 tiers · device detection
│   ├── transitions/       ✅ PortalTransition · soft/dominant/full/instant
│   ├── portal/            ✅ PortalIdentity · 9 portals · PortalRegistry
│   ├── atmosphere/        ✅ AtmosphereController · fidelity-aware CSS
│   ├── route-intelligence/✅ RouteEngine · next-step scoring
│   ├── evolution/         ✅ UsageTracker · UnlockGraph · MaturityLevel
│   ├── owner/             ✅ ControlTower · gate states · fidelity override
│   ├── memory/            ✅ Classifier · TrinityRouting · types
│   ├── motion/            ✅ config.ts · easing curves
│   └── [legacy]           ⚠  bridges · orchestrator · heartbeat · state
│
├── components/
│   ├── shell/             ✅ PortalShell · PageTransitionLayer · RouteAtmosphereLayer
│   ├── intelligence/      ✅ NextStepHint
│   ├── owner/             ✅ ControlTower UI
│   ├── lab-surface/       ✅ LabHero · LabSurface · LabQuickCreate · LabWorkBay · LabToolSpine
│   ├── SessionBoot.tsx    ✅ nexusRuntime.boot()
│   └── ProtectedRoute.tsx ✅ auth guard
│
├── hooks/
│   ├── useOrganism.ts     ✅ React integration for NexusRuntime
│   ├── useAtmosphere.ts   ✅
│   ├── useEvolution.ts    ✅
│   ├── useRouteIntelligence.ts ✅
│   └── useSessionSpawn.ts ✅ V7 session restore
│
├── contexts/
│   ├── SessionContext.tsx  ✅ TTL · scroll · panels · is_resume
│   └── AuthContext.tsx     ⚠  needs auth stability test
│
└── pages/
    ├── LabPage.tsx         ✅ WEDGE PORTAL — full V10 implementation
    ├── NexusPage.tsx       🔄 atmosphere via RouteAtmosphereLayer ✅, content unchanged
    ├── AtlasPage.tsx       🔄 atmosphere via RouteAtmosphereLayer ✅, content unchanged
    ├── FounderPage.tsx     🔄 atmosphere via RouteAtmosphereLayer ✅, content unchanged
    └── [other pages]       🔄 atmosphere via RouteAtmosphereLayer ✅

ops/
├── GAP_CLOSURE_MATRIX.md        ✅ 20 gaps · sealed
├── SHIP_GATE_CHECKLIST.md       ✅ G-01→G-15 validated
├── LIVING_SYSTEM_MANIFEST.md    ✅ 11 layers · 7 laws · schemas
├── BUILD_REAL_TASKBOARD.md      ✅ this file
├── BASTION.md                   ✅ gate semaphore
├── LIVE_STATE.md                ✅ living state
└── HANDOFF_LEDGER.md            ✅ append-only session log

supabase/
└── migrations/
    └── 20260328000000_artifact_memory.sql  ✅ artifacts + session_snapshots tables
```

---

## DEPENDENCY ORDER — EXECUTION GRAPH

```
A: Core Foundation (DONE ✅)
   SessionContext → ArtifactStore → EntryPipeline
   ↓
B: Governance + Performance (DONE ✅)
   RuntimeGuard → FidelityLadder → TransitionSystem
   ↓
C: Identity + Intelligence (DONE ✅)
   PortalIdentity → AtmosphereController → RouteIntelligence
   ↓
D: Organism Fusion (DONE ✅)
   FusionBus → OrganismState → NexusRuntime → useOrganism
   ↓
E: Environment Real (DONE ✅)
   PortalShell → PageTransitionLayer → RouteAtmosphereLayer → App.tsx wired
   ↓
F: Wedge Real (DONE ✅)
   LabHero → LabQuickCreate → LabWorkBay → LabToolSpine → LabSurface

─── ALL ABOVE: COMPLETE ──────────────────────────────────────────────

G: Auth Stability (TODO — TIER 1)
   AuthContext → ProtectedRoute → Supabase session flow
   ↓
H: Supabase Artifact Sync (TODO — TIER 1)
   localStorage artifacts → Supabase sync for auth'd users
   ↓
I: Performance Profiling (TODO — TIER 1)
   Bundle analysis → lazy load audit → Lighthouse baseline
   ↓
J: Pilot Gate (TODO — OWNER GATE)
   Owner opens GATE_PILOT_OPEN → invite 5–10 users
   ↓
K: Proof Narrative (TODO — TIER 2)
   1 user case study → return rate → artifact rate
   ↓
L: Revenue Gate (TODO — TIER 3)
   Solo license $29/month → waiting list → sovereign workspace
```

---

## TASKBOARD

### TIER 0 — COMPLETE ✅

| ID | Task | Files | Status |
|----|------|-------|--------|
| T-01 | Session TTL + scroll + panels | SessionContext.tsx | ✅ |
| T-02 | Artifact store (localStorage) | artifacts/store.ts + types.ts | ✅ |
| T-03 | Entry pipeline | spawn/entry-pipeline.ts | ✅ |
| T-04 | Governance runtime guards | governance/runtime-guard.ts | ✅ |
| T-05 | Fidelity ladder (4 tiers) | fidelity/ladder.ts | ✅ |
| T-06 | Transition grammar | transitions/portal-transition.ts | ✅ |
| T-07 | Portal identity (9 portals) | portal/identity.ts | ✅ |
| T-08 | Atmosphere controller | atmosphere/controller.ts | ✅ |
| T-09 | Route intelligence engine | route-intelligence/engine.ts | ✅ |
| T-10 | PortalShell component | components/shell/PortalShell.tsx | ✅ |
| T-11 | NextStepHint (guidance) | components/intelligence/NextStepHint.tsx | ✅ |
| T-12 | ControlTower (owner UI) | components/owner/ControlTower.tsx | ✅ |
| T-13 | NexusRuntime (fusion layer) | lib/core/runtime.ts | ✅ |
| T-14 | useOrganism hook | hooks/useOrganism.ts | ✅ |
| T-15 | PageTransitionLayer | components/shell/PageTransitionLayer.tsx | ✅ |
| T-16 | RouteAtmosphereLayer | components/shell/RouteAtmosphereLayer.tsx | ✅ |
| T-17 | App.tsx wired (all layers) | App.tsx | ✅ |
| T-18 | Creation Lab full surface | lab-surface/* | ✅ |
| T-19 | Supabase migration (artifacts) | migrations/20260328*.sql | ✅ |
| T-20 | Build passes + 84 tests green | — | ✅ |

---

### TIER 1 — PILOT PREREQUISITES 🔄

| ID | Task | Files | Priority | Status |
|----|------|-------|----------|--------|
| T-21 | Auth stability: Supabase sign-in → session → protected routes end-to-end | AuthContext + ProtectedRoute | P0 | ⬜ |
| T-22 | Artifact Supabase sync: auth'd users write artifacts to `artifacts` table | artifacts/supabase-sync.ts (new) | P1 | ⬜ |
| T-23 | useOrganism wired to LabHero for richer resume signals | LabHero.tsx | P1 | ⬜ |
| T-24 | Entry pipeline called from app boot (resolveEntry wired to App) | App.tsx + entry-pipeline | P1 | ⬜ |
| T-25 | Performance baseline: Lighthouse + bundle analyzer run | — | P1 | ⬜ |
| T-26 | Mobile viewport test: /lab at 375px and 768px | — | P0 | ⬜ |
| T-27 | Owner runs L-01→L-08 in browser | ops/SHIP_GATE_CHECKLIST.md | P0 | ⬜ OWNER |
| T-28 | Owner emits GATE_PILOT_OPEN via ControlTower | ops/SHIP_GATE_CHECKLIST.md | P0 | ⬜ OWNER |

---

### TIER 2 — POST-PILOT HARDENING ⬜

| ID | Task | Notes | Status |
|----|------|-------|--------|
| T-29 | Atlas portal: PortalShell content-level integration (Cesium z-index) | AtlasPage is complex — requires care | ⬜ |
| T-30 | Nexus portal: PortalShell content-level integration | NexusPage 1101 lines — route-level covers for now | ⬜ |
| T-31 | Evolution unlock: progressive feature reveal (maturity ≥ 1 → ?) | evolution/unlockGraph.ts | ⬜ |
| T-32 | Route intelligence integrated into Lab surface (not just hint overlay) | LabWorkBay suggestion row | ⬜ |
| T-33 | Artifact search + filter UI | LabWorkBay toolbar | ⬜ |
| T-34 | Resume flow: entry pipeline greeting shown in LabHero subtitle | LabHero + resolveEntry() | ⬜ |

---

### TIER 3 — REVENUE GATE ⬜

| ID | Task | Notes | Status |
|----|------|-------|--------|
| T-35 | Solo license: Stripe integration + $29/mo sovereign workspace | New feature | ⬜ |
| T-36 | Waitlist → invite system | Replace WaitlistBanner with invite flow | ⬜ |
| T-37 | Team environment: multi-user artifact space | Requires collaboration design | ⬜ |

---

## ACCEPTANCE TESTS — PILOT READY

### AT-01: Cold Start
```
GIVEN: no localStorage nxos_session or nxos_artifacts
WHEN:  user visits /lab
THEN:  LabHero renders with "Open Work Bay" CTA
       no resume badge visible
       atmosphere is dark blue (#060c14), electric blue accents
       no console errors in DevTools
```

### AT-02: Artifact Creation
```
GIVEN: user is on /lab
WHEN:  user clicks any QuickCreate button (Research / Note / Plan / Draft)
THEN:  confirmation feedback appears ("Research created ✓")
       artifact appears in LabWorkBay within 200ms
       localStorage nxos_artifacts contains the new artifact
```

### AT-03: Artifact Persistence
```
GIVEN: user created at least 1 artifact
WHEN:  user reloads the page
THEN:  artifact is still visible in LabWorkBay
       no duplicate artifacts
```

### AT-04: Session Resume
```
GIVEN: user has a valid session with re_entry_point set
WHEN:  user reloads /lab
THEN:  LabHero shows "Resume:" badge with subject
       CTA says "Continue Work"
       SessionContext is_resume === true
```

### AT-05: Session TTL
```
GIVEN: localStorage session with ts_last_active > 7 days ago
WHEN:  app boots
THEN:  session is cleared to fresh cold state
       is_resume === false
       no stale artifacts shown (they persist — memory is sacred)
```

### AT-06: Portal Transition
```
GIVEN: user is on /lab
WHEN:  user navigates to /nexus
THEN:  exit animation plays (scale 0.97, blur, opacity 0)
       enter animation plays (opacity 1, scale 1, blur 0)
       no white flash
       no freeze > 100ms
       transition kind is "dominant" (cross-family)
```

### AT-07: Atmosphere
```
GIVEN: user visits /lab then /nexus then /atlas
THEN:  each portal has visually distinct background
       ambient glow colors differ per portal
       grain overlay present (balanced/high/ultra tier)
```

### AT-08: Governance Guard
```
GIVEN: governance runtime runs on boot
WHEN:  artifact count exceeds 200
THEN:  console.warn '[GOVERNANCE BLOCK]' G-04
       UI gracefully handles overflow (no crash)
```

### AT-09: Fidelity
```
GIVEN: user forces light tier via ControlTower
THEN:  grain overlay disappears
       grid overlay disappears
       ambient pulse stops
       transitions become instant
```

### AT-10: Owner Control
```
GIVEN: authenticated owner user
THEN:  ControlTower ⊕ button visible bottom-right
       can toggle GATE_PILOT_OPEN
       can override fidelity tier
       non-owner users: ControlTower not rendered
```

---

## ROLLOUT-SAFE STRUCTURE

### What is rollback-safe now:
- PageTransitionLayer: if removed, pages render without transition (no crash)
- RouteAtmosphereLayer: if removed, pages render without atmosphere (no crash)
- NexusRuntime: if boot() throws → degraded mode, not dead (C-04)
- Artifact store: if localStorage unavailable → empty state, no crash
- Governance guards: all non-blocking by design

### What requires caution:
- AuthContext: Supabase auth state — test with real credentials before pilot
- AtlasPage: Cesium z-index interaction with PortalShell overlays (grain z-9990)
- NexusPage: existing complex animations may interact with PageTransitionLayer

### Rollout sequence:
```
1. Owner validates browser (T-27) ← YOU HERE
2. Owner emits GATE_PILOT_OPEN (T-28)
3. Invite 1 pilot user (friendly, real use case)
4. Observe cold-start → create → leave → return loop
5. If AT-01 through AT-06 pass in real usage: invite 5 more
6. After 14 days, if return rate ≥ 60%: declare pilot success
7. Open T-35 (revenue gate)
```

---

_BUILD_REAL_TASKBOARD.md v1.0 — cravado em 2026-03-28 | @claude | branch: claude/setup-ruberra-nexus-IL7Tg_
