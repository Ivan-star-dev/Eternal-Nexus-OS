# SCALE REAL MANIFEST — Ruberra Hardening + Growth Protocol
> Cravado em 2026-03-28 | @claude | Branch: claude/setup-ruberra-nexus-IL7Tg

---

## SCALE LAW (primária)

```
Do not scale abstraction before the wedge is loved.
Do not scale width before continuity, calm, and value survive real use.

SEQUENCE: Pilot → Solo License → Professional → Team → Enterprise
          NEVER skip a level. Proof gates each transition.
```

---

## 1. HARDENING ROADMAP

### PHASE H-1 — PRE-PILOT (NOW)

```
STATUS: ✅ COMPLETE

H1-01  NexusRuntime fusion layer                   ✅
H1-02  Governance runtime guards (G-01→G-06)       ✅
H1-03  Anti-chaos laws (C-01→C-07) in runtime      ✅
H1-04  Memory never destroyed on error (C-04)      ✅
H1-05  OrganErrorBoundary on 3D organs             ✅
H1-06  SessionContext TTL (7d expiry)              ✅
H1-07  Fidelity ladder — graceful degradation      ✅
H1-08  Pilot instrumentation (event-logger.ts)     ✅
H1-09  Bundle size gate (scripts/gates)            ✅
```

### PHASE H-2 — DURING PILOT

```
STATUS: ⬜ NEXT

H2-01  Auth flow stability test (real Supabase credentials)
H2-02  Artifact Supabase sync (auth'd users get cloud backup)
H2-03  Error monitoring: wire organism:degraded events to owner alert
H2-04  Pilot metrics dashboard: /owner route shows getPilotMetrics()
H2-05  Session recovery: if TTL-expired, preserve artifacts (already C-04 compliant)
H2-06  Mobile hardening: test AtlasPage + NexusPage at 375px
```

### PHASE H-3 — POST-PILOT (REVENUE GATE)

```
STATUS: ⬜ FUTURE

H3-01  Server-side instrumentation (PostHog or Mixpanel)
H3-02  Real error monitoring (Sentry)
H3-03  Rate limiting on Supabase artifact writes
H3-04  Auth hardening: email verification + session rotation
H3-05  GDPR compliance: artifact export + delete
H3-06  SLA definition for Solo tier
```

### PHASE H-4 — ENTERPRISE GATE

```
STATUS: ⬜ FUTURE (requires 100+ solo users first)

H4-01  SSO (SAML / OAuth2)
H4-02  Audit log (immutable event stream per workspace)
H4-03  Isolated Supabase schema per tenant
H4-04  SLA 99.9% uptime commitment
H4-05  Custom domain support
H4-06  Data residency options
```

---

## 2. QUALITY GATES

### Automated gates (run on every commit)

```bash
npm run gate:quality
# Runs: typecheck → lint → build → test → bundle:check
# Must pass 100% before merge to canonical branch
```

| Gate | Command | Threshold | Current |
|------|---------|-----------|---------|
| TypeScript | `npm run typecheck` | 0 new errors | ✅ 0 |
| Lint | `npm run lint` | 0 new errors | ✅ 0 |
| Build | `npm run build` | clean build | ✅ |
| Tests | `npm run test` | 84/84 pass | ✅ |
| Bundle: LabPage | `npm run gate:bundle` | ≤ 15KB gzip | ✅ 6.4KB |
| Bundle: App shell | `npm run gate:bundle` | ≤ 90KB gzip | ⚠ 77KB |
| Bundle: NexusPage | `npm run gate:bundle` | ≤ 40KB gzip | ✅ 33KB |

### Manual gates (owner runs before each phase)

| Gate | When | Criteria |
|------|------|----------|
| GATE_PILOT_OPEN | Before inviting pilot users | All H-1 complete + L-01→L-08 browser validated |
| GATE_SOLO_OPEN | Before solo license launch | Pilot return rate ≥ 60% + 1 case study |
| GATE_PRO_OPEN | Before Professional tier | 20+ paying solo users + clear power-user pattern |
| GATE_TEAM_OPEN | Before team collaboration | 5+ teams expressing intent + collaboration design complete |
| GATE_ENT_OPEN | Before enterprise path | 50+ paying users + compliance requirements defined |

---

## 3. INSTRUMENTATION

### Current: Pilot-grade (localStorage)

```typescript
// Auto-wired to FusionBus via NexusRuntime.boot()
// Writes to: localStorage['nxos_events'] (max 500 events, ring buffer)

getPilotMetrics() → {
  total_sessions:           number
  total_returns:            number     // ← key pilot signal
  return_rate:              0.0–1.0    // ← proof threshold: ≥ 0.60
  total_artifacts_created:  number
  artifact_rate_per_session: number
  session_2_artifact:       boolean    // ← proof signal
  unique_portals_visited:   string[]
  governance_violations:    number     // ← system health
  organism_degraded_count:  number     // ← reliability signal
}
```

**To check pilot metrics:**
Open browser DevTools console, paste:
```javascript
import('/src/lib/instrumentation/event-logger.ts').then(m => console.table(m.getPilotMetrics()))
// Or after build:
// Access via ControlTower (owner panel → Metrics tab, to be added in H2-04)
```

### Post-pilot: Server-side (Phase H-3)

Swap `event-logger.ts` → PostHog SDK. No API changes needed:
- `startInstrumentation()` → PostHog.init() + event capture
- `getPilotMetrics()` → PostHog dashboard query
- No component changes required (fusion bus is the stable interface)

---

## 4. ERROR RECOVERY

### Current recovery layers

```
Layer 1: OrganErrorBoundary (React class component)
  - Wraps 3D organs (Globe, HolographicRoom)
  - silent=true → render null instead of error card
  - handleRestart() → reset error state

Layer 2: NexusRuntime degraded mode (C-04)
  - boot() failure → boot_phase: 'degraded' (never 'dead')
  - Memory never cleared on error
  - subsystem_health tracks per-subsystem status

Layer 3: Governance guards (non-blocking)
  - All violations logged, never throw
  - Fatal violations → console.error only

Layer 4: SessionContext safe parsing
  - JSON.parse in try/catch
  - TTL expiry → fresh session (artifacts preserved)

Layer 5: Artifact store ring buffer
  - Max 200 artifacts (governance G-04)
  - localStorage.setItem in try/catch
```

### Missing for pilot (H2-03)

```
⬜ Owner alert on organism:degraded event
   → When boot_phase = 'degraded', show notice in ControlTower
   → Implementation: listen to bus.on('organism:degraded') in ControlTower.tsx
```

---

## 5. PACKAGING TIERS

```
TIER 1: SOVEREIGN SOLO — $29/month
──────────────────────────────────────────────────────────────────
  1 sovereign workspace
  Unlimited artifacts (local + Supabase cloud backup for auth users)
  Full fidelity (ultra/high/balanced, auto-detect)
  Session continuity (TTL 7d, scroll restore, panel state)
  Creation Lab (all tools: research, note, plan, draft, code)
  Route intelligence (personalized next-step suggestions)
  Evolution engine (maturity tracking, behavioral profile)
  Atmosphere + transitions (9 portal identities)
  No collaboration (solo-first — explicitly stated)

GATE: Pilot return rate ≥ 60% + 1 case study

TIER 2: PROFESSIONAL — $79/month
──────────────────────────────────────────────────────────────────
  Everything in Solo +
  3 workspaces (parallel projects)
  Artifact export (JSON, Markdown)
  Extended TTL (30d session memory)
  Priority fidelity (always ultra tier, no degradation)
  Artifact search + filter (full-text)
  Synthesis tool (cross-artifact intelligence)

GATE: 20+ paying Solo users + clear power-user demand signal

TIER 3: TEAM ENVIRONMENT — $149/month (5 seats)
──────────────────────────────────────────────────────────────────
  Everything in Professional +
  Shared workspace (artifacts visible to team)
  Collaboration layer (real-time presence, co-creation)
  Team evolution profile (collective behavioral intelligence)
  Owner controls per workspace
  Team governance (admin role, artifact moderation)

GATE: GATE_TEAM_OPEN (5+ teams expressing intent + collab design complete)

TIER 4: ENTERPRISE — Custom
──────────────────────────────────────────────────────────────────
  Everything in Team +
  SSO (SAML, OAuth2)
  Audit log
  Custom domain
  Data residency
  SLA 99.9%
  Isolated Supabase schema
  Dedicated support

GATE: GATE_ENT_OPEN (50+ paying users + compliance requirements)
```

---

## 6. ZERO-DRIFT REPO STRUCTURE

### Laws that prevent code rot

```
LAW-R1: Every new subsystem lives in src/lib/<name>/
         - types.ts (schema first)
         - [impl].ts
         - index.ts (barrel export)
         No files at src/lib root level (except utils.ts).

LAW-R2: Every new component follows shell pattern
         - src/components/<domain>/<Component>.tsx
         - No logic in component files beyond React + layout
         - Business logic in src/lib/<name>/

LAW-R3: No direct cross-layer imports
         Components → hooks → lib. Never lib → components.
         FusionBus is the only cross-layer communication.

LAW-R4: Every new page wraps in nothing
         RouteAtmosphereLayer + PageTransitionLayer handle atmosphere/transitions.
         Pages are pure content — no PortalShell in page files.

LAW-R5: Every session field mirrors organism state
         New session fields → must be reflected in OrganismState
         and synced via NexusRuntime.syncSession()

LAW-R6: Every new gate has a script
         scripts/gates/<name>-gate.mjs
         npm run gate:<name>
         Runs in gate:quality chain.

LAW-R7: Every pioneer handoff goes to HANDOFF_LEDGER.md
         No handoff = task not complete.
         Append-only. Never edit previous entries.
```

---

## 7. ROLLOUT PLAN

```
STEP 0: Owner validates browser (L-01→L-08) ← YOU ARE HERE
        Time: 30 minutes
        Output: SHIP_GATE_CHECKLIST all P0 ✅

STEP 1: GATE_PILOT_OPEN emitted via ControlTower
        Time: when STEP 0 is done
        Output: pilot is open

STEP 2: Invite 1 pilot user (most trusted, closest to target profile)
        Time: same day as STEP 1
        Observe: cold-start → create → leave → return
        Signal: return within 48h without prompt

STEP 3: If STEP 2 signals pass → invite 4 more users
        Time: 3-5 days after STEP 2
        Observe: all 5 users for 14 days
        Metrics: return_rate, artifact_rate_per_session

STEP 4: At 14 days → getPilotMetrics() → evaluate
        If return_rate ≥ 0.60 → pilot success → open STEP 5
        If return_rate < 0.40 → friction audit → fix → repeat STEP 2

STEP 5: Build case study (one user, one continuity moment, one artifact)
        Time: 2-3 days
        Output: PROOF_CASE_STUDY.md in ops/

STEP 6: Open Solo License ($29/month)
        Time: when case study is complete
        Gate: GATE_SOLO_OPEN
        Method: waitlist page → Stripe → sovereign workspace invite

STEP 7: Monitor 30 days
        Metrics: MRR, churn, artifact depth, return rate
        If churn > 30% → investigate continuity gaps

STEP 8: When 20+ paying users → evaluate Professional tier
        Gate: GATE_PRO_OPEN
        Design: workspace export, extended TTL, synthesis tool
```

---

## 8. MULTI-TENANT READINESS PATH

```
CURRENT STATE (solo): localStorage + Supabase (user_id scoped)
  - artifacts table: user_id FK
  - session_snapshots: user_id FK
  - RLS policies enforce user isolation
  → Already multi-user at data layer. Solo experience is just 1 user per workspace.

TEAM PATH (Tier 3 gate):
  1. Add workspace_id to artifacts + session_snapshots
  2. RLS: user must be member of workspace
  3. Shared artifact visibility: workspace_id = team workspace
  4. Collaboration layer: real-time presence via Supabase Realtime
     (already used in NexusPage swarm — infrastructure exists)

ENTERPRISE PATH (Tier 4 gate):
  1. Isolated Supabase project per enterprise tenant
  2. Custom auth (SAML via Supabase Auth hook)
  3. Audit log table (append-only, immutable)
  4. Data export API

ARCHITECTURE NOTE:
  Multi-tenant is NOT a rewrite. It is a data model extension.
  The fusion layer, governance, and atmosphere are already tenant-agnostic.
  Only the memory layer (artifacts, sessions) needs workspace scoping.
```

---

## 9. POST-PILOT ITERATION LOOP

```
OBSERVE
  getPilotMetrics() → return_rate, artifact_rate, governance_violations
  User interviews (3 questions max):
    1. "What did you come back to do?"
    2. "Did the system remember you correctly?"
    3. "What was missing?"

DIAGNOSE
  return_rate < 0.60:
    → check LabHero resume badge (V-01 test)
    → check artifact persistence (V-03 test)
    → check cold start clarity (V-01 test)

  artifact_rate_per_session < 0.5:
    → check QuickCreate discoverability
    → check LabWorkBay empty state clarity

  governance_violations > 0:
    → check which law (G-01 to G-06)
    → if G-04 (artifact count): user is power user — good signal

  organism_degraded_count > 0:
    → check NexusRuntime boot logs
    → fix root cause before inviting next cohort

FIX
  Fix one thing per iteration. Never fix 3 things at once.
  Rule: if you can't describe the fix in one sentence, it's too broad.

REPEAT
  After each fix: invite 3 new pilot users.
  After 3 iterations: if metrics don't move → wrong fix → re-diagnose.
```

---

## 10. CANONICAL SCRIPTS

```bash
npm run gate:quality   # full quality gate (typecheck + lint + build + test + bundle)
npm run gate:bundle    # bundle size check only
npm run test           # run 84 unit tests
npm run typecheck      # TypeScript check (0 new errors)
npm run lint           # ESLint (0 new errors)
npm run build          # production build
npm run dev            # local dev server (port 8080)
npm run ops:doctor     # system health check
npm run ops:snapshot   # quick state snapshot
```

---

_SCALE_REAL_MANIFEST.md v1.0 — cravado em 2026-03-28 | @claude | SCALE-GATE-001_
