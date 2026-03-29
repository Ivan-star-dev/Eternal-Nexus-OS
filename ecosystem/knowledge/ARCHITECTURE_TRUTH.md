# ARCHITECTURE TRUTH — Eternal Nexus OS
> What connects to what. Data flows. Dependency graph.
> Family: Knowledge · Subfamily: Architecture
> Cravado: 2026-03-29 · @claude · Verified against source code.

---

## LAYER MAP

```
┌─────────────────────────────────────────────────────────────┐
│  LAYER 0 — ENTRY SHELL                                      │
│  App.tsx · BrowserRouter · SessionBoot · OrganismBridge     │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│  LAYER 1 — CONTEXT PROVIDERS                                │
│  SessionContext · EvolutionContext · (AuthContext)          │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│  LAYER 2 — ROUTE SHELL                                      │
│  RouteAtmosphereLayer · PortalShell · ProtectedRoute        │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│  LAYER 3 — PAGES (routes)                                   │
│  NexusPage · LabPage · SchoolPage · WorkshopPage · Atlas    │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│  LAYER 4 — SURFACE COMPONENTS                               │
│  LabHero · SchoolHero · NexusSurface · LabSurface           │
│  SchoolSurface · LearningPath · LabWorkBay · LabToolSpine   │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│  LAYER 5 — RUNTIME / STATE                                  │
│  NexusRuntime · returnTracker · sessionSnapshot             │
│  artifactStore · evolutionEngine                            │
└─────────────────────────────────────────────────────────────┘
```

---

## DATA FLOW — SESSION WRITE PATH

```
User action (startSession / updateReEntry)
  → SessionContext.setState()
  → saveToStorage()
    → localStorage.setItem('nxos_session', JSON.stringify(state))   ← REAL
    → saveSnapshot(snap)                                             ← REAL (this session)
      → localStorage.setItem('ruberra:session:snapshot', snap)
  → OrganismBridge receives context via useOrganism()
    → NexusRuntime.sync(session, evolution)                          ← PARTIAL (health computed, guards not called)
```

---

## DATA FLOW — ARTIFACT WRITE PATH

```
User creates artifact
  → saveArtifact(artifact)                                          ← src/lib/artifacts/store.ts
    → localStorage.setItem('nxos_artifacts', [...])                 ← REAL
    → (Supabase sync) — COMMENT ONLY, NEVER EXECUTES               ← DEAD
    → governance.guardArtifactCount() — NOT CALLED                  ← DEAD
```

**Gap:** saveArtifact bypasses all governance. Cap C-01 is never enforced.

---

## DATA FLOW — RETURN DETECTION PATH

```
Page load → SchoolPage useEffect → recordVisit('school')
                                   → sessionStorage dedup check
                                   → localStorage update (nxos_return_log_school)

Page load → LabPage useEffect → recordVisit('lab')
                                 → same flow

SchoolHero render → getReturnMetrics('school')
                    → read localStorage
                    → compute: hours_since, returned_within_48h, wedge_signal
                    → display resume badge if return_count > 0

ControlTower open → getReturnMetrics('lab')
                    → display Wedge Gate verdict
```

---

## DATA FLOW — MATURITY / EVOLUTION PATH

```
SchoolHero mount → recordPortalVisit('school')                      ← useEvolution hook
LabPage mount → useEvolution() (hook called, recordPortalVisit not wired to LabPage directly)

Evolution engine → maturity.level (0→3)
  → SchoolSurface receives maturityLevel prop
    → LearningPath receives maturityLevel
      → resolveStatus(stepIndex, maturityLevel) → StepStatus       ← REAL (this session)
  → SchoolHero reads maturity.level for badge display              ← REAL (this session)
```

---

## COMPONENT DEPENDENCY GRAPH

```
App.tsx
  ├── SessionBoot (reads nxos_session, hydrates context)
  ├── OrganismBridge (useOrganism → NexusRuntime sync)
  └── BrowserRouter
      └── RouteAtmosphereLayer
          └── Routes
              ├── / → NexusPage
              │       └── NexusSurface (standalone, no LabHero dependency)
              ├── /lab → LabPage
              │       ├── LabEntryHeader
              │       ├── LabHero           ← uses SessionContext + returnTracker + artifactStore
              │       ├── LabSurface
              │       │   ├── LabWorkBay    ← reads artifactStore
              │       │   └── LabToolSpine  ← visual, zero handlers wired
              │       └── ResearchFeed
              ├── /school → SchoolPage
              │       ├── SchoolNav
              │       ├── SchoolHero        ← uses useEvolution + returnTracker
              │       └── SchoolSurface
              │           └── LearningPath  ← maturityLevel prop from useEvolution
              ├── /workshop → WorkshopPage
              └── /atlas → AtlasPage (atmosphere override bug)
```

---

## STORAGE MAP — WHAT LIVES WHERE

| Key | Storage | Written by | Read by | TTL |
|-----|---------|-----------|---------|-----|
| `nxos_session` | localStorage | SessionContext | SessionBoot, useSession | Until cleared |
| `ruberra:session:snapshot` | localStorage | sessionSnapshot.ts | (nothing reads it yet) | Until cleared |
| `nxos_artifacts` | localStorage | artifactStore | LabWorkBay, LabHero, ControlTower | Until cleared |
| `nxos_return_log_lab` | localStorage | returnTracker | LabHero, ControlTower | Until cleared |
| `nxos_return_log_school` | localStorage | returnTracker | SchoolHero | Until cleared |
| `nxos_visit_recorded_lab` | sessionStorage | returnTracker | returnTracker (dedup) | Session only |
| `nxos_visit_recorded_school` | sessionStorage | returnTracker | returnTracker (dedup) | Session only |
| `nxos_evolution` | localStorage | evolutionEngine | useEvolution | Until cleared |

**Risk:** 100% localStorage. One `localStorage.clear()` = total state loss.
**Fix required:** Supabase sync activation (artifact + session persistence).

---

## DEPENDENCY CONTRACTS (implicit)

| Component | Requires | Fails if missing |
|-----------|---------|-----------------|
| LabHero | getReturnMetrics('lab') | Falls back gracefully (no resume badge) |
| LabHero | getRecentArtifacts(1) | Falls back gracefully (shows session.subject) |
| SchoolHero | useEvolution().maturity | Shows level 0 by default (safe) |
| SchoolHero | getReturnMetrics('school') | Falls back gracefully (no resume badge) |
| LearningPath | maturityLevel prop | Shows all locked if undefined |
| OrganismBridge | useSession() | Crashes if SessionContext missing |
| NexusRuntime | SessionContext | Hard dependency — won't init without session |

---

## WHAT IS NOT CONNECTED (isolation islands)

```
sessionSnapshot → saved by SessionContext, read by NOTHING in UI
OrganismBridge → updates NexusRuntime health, no component reads health except ControlTower
governance guards (C-01→C-07) → defined, zero call sites
carry_context / carry_artifacts → TransitionConfig fields, zero consumers
enable_pilot_access → written in ControlTower, never read by ProtectedRoute
```

These are the system's dead zones. They cost maintenance attention without producing user value.

---

## TRI-CORE CONNECTION MAP

```
Creation Lab (/lab)     — REAL    — LabHero + LabSurface + artifactStore
School (/school)        — REAL    — SchoolHero + LearningPath + evolutionEngine
Lab/Test (/test)        — FUTURE  — does not exist (0%)
```

**Parity law requires:** all three at equal dignity before fusion.
**Current gap:** Lab tri-core = 0%. Fusion impossible.

---

_ARCHITECTURE_TRUTH.md · knowledge v1.0 · 2026-03-29_
