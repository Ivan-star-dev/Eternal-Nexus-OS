# RUNTIME TRUTH — Eternal Nexus OS
> What every system actually does. No flattery. No aspiration.
> Family: Knowledge · Subfamily: Architecture Truth
> Cravado: 2026-03-29 · @claude · Verified against source code this session.

---

## HOW TO READ THIS DOC

Each system is rated:
- **REAL** — works, wired, produces observable output
- **PARTIAL** — core works, edges hollow
- **SCAFFOLD** — structure exists, logic is stub
- **DEAD** — code exists, zero call sites, zero effect
- **PROVED** — real user/session confirmed it works

---

## SYSTEM 1 — Session Backbone `[REAL]`

**File:** `src/contexts/SessionContext.tsx`
**What it does:**
- Persists session state to `localStorage` under key `nxos_session`
- Hydrates on mount: if stored + `re_entry_point` exists → `is_resume = true`
- `startSession(subject, context)` → creates new session with UUID, face, re_entry_point
- `updateReEntry(point)` → updates re_entry_point + persists
- `saveToStorage()` → also calls `saveSnapshot()` (added this session — PARTIAL sync)

**What is REAL:**
- Session persists across browser reload ✓
- `is_resume` fires correctly on return ✓
- `saveSnapshot` now called in sync ✓ (this session)

**What is PARTIAL:**
- `open_panels` and `scroll_snapshot` never written by any component (fields exist, never populated)
- `active_face` set once on startSession, never updated as user navigates portals

**What is DEAD:**
- `resolveEntry()` — DELETED this session (was dead code, zero call sites confirmed)

---

## SYSTEM 2 — Artifact Memory `[REAL]`

**Files:** `src/lib/artifacts/store.ts`, `src/lib/artifacts/types.ts`
**What it does:**
- `saveArtifact(artifact)` → persists to `localStorage` under `nxos_artifacts`
- `getArtifact(id)` → retrieves single artifact
- `getRecentArtifacts(n)` → returns n most recent by `ts_last_accessed`
- `updateArtifact(id, patch)` → merges patch into existing artifact

**What is REAL:**
- Artifacts save and retrieve across reload ✓
- `getRecentArtifacts(1)` used in LabHero for resume badge ✓

**What is PARTIAL:**
- `ts_last_accessed` only updated on `saveArtifact` (creation), not on view/open
- No artifact deletion
- No artifact archiving
- ArtifactKind covers: `research | note | plan | draft | simulation` — missing `experiment | evidence | lesson | mastery` (needed for Lab + School tri-core)

**What is DEAD:**
- Supabase sync — comment exists in store.ts promising sync, code never executes
- `getArchivedArtifacts()` — not implemented

---

## SYSTEM 3 — Evolution Engine `[PARTIAL]`

**Files:** `src/hooks/useEvolution.ts`, `src/lib/evolution/engine.ts`
**What it does:**
- Tracks portal visits, artifact creations, session actions
- Computes `maturity.level` (0→3): Starting / Familiar / Practiced / Expert
- `recordPortalVisit(portal)` — increments visit count
- `recordAction(action)` — records user action for scoring

**What is REAL:**
- `maturity.level` is live and used in SchoolHero badge ✓
- `maturity.level` drives `resolveStatus()` in LearningPath ✓
- `recordPortalVisit('school')` called in SchoolHero on mount ✓

**What is PARTIAL:**
- Score thresholds not tuned (easy to reach level 3 without real mastery)
- Portal visit data not cross-checked with returnTracker (two independent signals)

**What is DEAD:**
- Evolution-driven unlocks beyond maturity level display (next steps not surfaced)
- Degrade/regression (score can only go up, never reflect inactivity)

---

## SYSTEM 4 — Return Tracker `[REAL]`

**File:** `src/lib/spawn/returnTracker.ts`
**What it does:**
- Per-portal: `recordVisit(portal)` — deduped per browser session via sessionStorage
- `getReturnMetrics(portal)` → `{ visit_count, return_count, hours_since_first, hours_since_last, returned_within_48h, wedge_signal }`
- `wedge_signal`: `none | weak | strong` — `weak` = returned within 48h, `strong` = 3+ returns within 48h each

**What is REAL:**
- Persists to localStorage per portal ✓
- Dedup prevents double-counting in same browser session ✓
- Used in ControlTower Wedge Gate section ✓
- Used in LabHero resume badge ✓
- Used in SchoolHero resume badge ✓

**What is PROVED:**
- Logic is correct. Wedge test not yet run (owner must leave /lab, return within 48h).

---

## SYSTEM 5 — NexusRuntime / OrganismBridge `[PARTIAL]`

**Files:** `src/lib/runtime/runtime.ts`, `src/hooks/useOrganism.ts`, `src/App.tsx`
**What it does:**
- `OrganismBridge` component mounted in App.tsx — calls `useOrganism()`, renders null
- `useOrganism()` connects SessionContext + useEvolution → NexusRuntime
- NexusRuntime maintains `health_scores`, `governance_state`, `active_guards`

**What is REAL:**
- OrganismBridge mounts app-wide ✓ (this session)
- Health scores computed ✓
- ControlTower reads health scores ✓

**What is DEAD:**
- Governance guards (C-01→C-07) defined in runtime.ts — never called in direct UI flows
- `saveArtifact()` bypasses `runtime.addArtifact()` entirely — governance never enforced
- `carry_context` / `carry_artifacts` flags in TransitionConfig — inert, no consumer

---

## SYSTEM 6 — Route Atmosphere `[REAL]`

**File:** `src/components/layout/RouteAtmosphereLayer.tsx`
**What it does:**
- Wraps all routes in PortalShell with DNA-correct atmosphere
- Applies portal-specific background, color tokens, depth layers per route

**What is REAL:**
- 5 portal backgrounds removed from pages this session ✓
- SchoolPage, SchoolSurface, WorkshopPage, NexusSurface, NexusPage — all cleaned ✓
- PortalShell now breathes for all portals ✓

**What is PARTIAL:**
- LabHero still has `background: "#060c14"` inline — RouteAtmosphereLayer override blocked
- AtlasPage still has `fixed inset-0 bg-background` override

**Fix time:** ~5 min each. Owner or Pioneer 2 (@framer).

---

## SYSTEM 7 — Session Snapshot `[PARTIAL]`

**File:** `src/lib/state/sessionSnapshot.ts`
**What it does:**
- `saveSnapshot(snap)` → persists to localStorage `ruberra:session:snapshot`
- `loadSnapshot()` → retrieves last snapshot
- Fields: `portalId`, `lastRoute`, `scrollPosition`, `openPanels`, `lastTaskContext`, `timestamp`

**What is REAL:**
- `saveSnapshot` called from `SessionContext.saveToStorage` (wired this session) ✓
- Snapshot persists across reload ✓

**What is PARTIAL:**
- `scrollPosition` always = `scroll_snapshot?.y ?? 0` — scroll_snapshot never written → always 0
- `openPanels` = `s.open_panels` — open_panels never written → always empty
- `lastTaskContext` = `s.re_entry_point || null` — re_entry_point only updated when `updateReEntry` called (rare)

---

## SYSTEM 8 — Governance `[DEAD in UI flows]`

**Files:** `src/lib/runtime/runtime.ts` (guards defined), `src/hooks/useGovernance.ts`
**Laws defined (C-01→C-07):**
- C-01: Artifact count cap
- C-02: Session length cap
- C-03: Chaos detection
- C-04: Maturity gate enforcement
- C-05: Pilot access gating
- C-06: Evolution rate cap
- C-07: Portal health minimum

**What is REAL:**
- Guards defined in runtime.ts ✓
- Health scores computed ✓
- ControlTower displays health ✓

**What is DEAD:**
- Zero guard calls in `saveArtifact()`, `startSession()`, `recordPortalVisit()` or any UI path
- `enable_pilot_access` flag in control-tower.ts — never read by ProtectedRoute
- C-04 maturity gate — never enforced on route access

---

## SYSTEM 9 — ControlTower `[PARTIAL]`

**File:** `src/components/owner/ControlTower.tsx`
**What it does:**
- Owner-only panel (keyboard shortcut, not visible to users)
- Displays: health scores, session state, evolution state, wedge metrics, artifact count

**What is REAL:**
- Wedge Gate section with `wedge_signal` verdict ✓ (this session)
- Health scores displayed ✓
- Artifact count from localStorage ✓

**What is PARTIAL:**
- `enable_pilot_access` toggle visible in UI — flag write has no downstream effect
- Override controls (force-level, force-resume) — display only, no effect

---

## SYSTEM 10 — School Tri-Core Surface `[REAL]`

**Files:** `src/pages/SchoolPage.tsx`, `src/components/school-surface/SchoolHero.tsx`, `src/components/school-surface/SchoolSurface.tsx`, `src/components/school-surface/LearningPath.tsx`
**What it does:**
- SchoolHero: gold/amber sovereign entry, maturity badge, resume badge, animated CTAs
- LearningPath: 5 steps, status wired to real maturity level from useEvolution
- Resume badge: shows "Visit N · Level X — [Label]" when return_count > 0
- Progress bar: real percentage from maturityLevel / 5 steps

**What is REAL:**
- SchoolHero created this session ✓
- maturityLevel wired end-to-end: useEvolution → SchoolSurface → LearningPath → resolveStatus ✓
- Per-portal returnTracker wired ✓

**What is PARTIAL:**
- No `updateReEntry` called when user enters a step (continuity anchor missing)
- Step "Begin" button does nothing (no handler, no artifact creation)

---

## SYSTEM 11 — Lab Tri-Core Surface `[FUTURE — 0%]`

**Status:** Does not exist.
**What is needed:** `/test` route, TestBay component, experiment/evidence artifact kinds, hypothesis tracking.
**Blocking:** Tri-core parity law — Lab = Creation = School required before fusion.
**Owner decision required:** Gate Lab tri-core surface build.

---

## SYSTEM 12 — Supabase Integration `[PARTIAL — auth only]`

**What is REAL:** Auth (login/logout) via Supabase ✓
**What is DEAD:** Artifact sync — promise in comments, never executes.
**What is DEAD:** Session persistence to Supabase — local only.
**Risk:** All artifact data lives in localStorage. One browser wipe = total loss.

---

## SUMMARY SCORE

| System | Status | Blocks Wedge? |
|--------|--------|---------------|
| Session Backbone | REAL | No |
| Artifact Memory | REAL | No |
| Evolution Engine | PARTIAL | No |
| Return Tracker | REAL | No (wedge test pending owner) |
| OrganismBridge | PARTIAL | No |
| Route Atmosphere | REAL (2 overrides remain) | No |
| Session Snapshot | PARTIAL | No |
| Governance | DEAD in UI | No (post-wedge) |
| ControlTower | PARTIAL | No |
| School Surface | REAL | No |
| Lab Tri-Core | FUTURE | Yes (tri-core parity) |
| Supabase Sync | DEAD | Yes (data durability) |

---

_RUNTIME_TRUTH.md · knowledge v1.0 · 2026-03-29 · verified this session_
