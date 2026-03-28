# GOVERNANCE + OBSERVABILITY MANIFEST
> @claude · 2026-03-28 · Ruberra Corp · Eternal-Nexus-OS
> Canon reference: GOVERNANCE_OBSERVABILITY_MANIFEST-001
> Branch: claude/setup-ruberra-nexus-IL7Tg

---

## 0. PURPOSE

This manifest defines all governance rules, enforcement thresholds, observability
models, score definitions, ship gate rules, and failure playbooks for Ruberra's
sovereign cognitive environment.

Governance is not configuration. It is the law the system enforces on itself.
Every rule in this document is either already encoded in the system or is the
canonical spec for future enforcement. No rule exists here without a corresponding
reason rooted in continuity, calm, identity, or trust.

---

## 1. ANTI-CHAOS LAWS — C-01 → C-07

These are the seven laws that prevent the organism from becoming incoherent over time.
Each law has one direction. Violating any law fires `governance:violation` on FusionBus.

| Law | Rule | Direction |
|-----|------|-----------|
| **C-01** State flows down | Identity → Intelligence → Memory → Environment. Never upward. | Downward only |
| **C-02** No cross-layer writes | Layers may not write to each other's state directly. All mutations go through runtime API. | Runtime-mediated |
| **C-03** Governance is synchronous | All guard checks complete before any state transition is committed. | Blocking |
| **C-04** Memory is immortal | Session data, artifacts, and re_entry_point are never silently deleted. Archive, seal, or migrate — never destroy. | Append / archive only |
| **C-05** Environment is consequence | Visual state (atmosphere, fidelity, portal) is always derived from identity + memory. Never set independently. | Derived only |
| **C-06** Evolution is additive | Behavioral profile grows — it does not reset. maturity_level only increments. | Monotonic |
| **C-07** Performance gates rendering | If device cannot sustain ≥ 30fps, fidelity downgrades before any visual layer renders. | Gate before render |

**Enforcement:** `NexusRuntime._initGovernanceBridge()` registers a FusionBus listener
that fires `governance:violation` on any detected law breach. Violation count is
tracked in `OrganismState.system.violation_count`.

---

## 2. IDENTITY LOCKS

Identity locks protect the portal's atmospheric DNA from drift.

| Lock | Rule | Threshold |
|------|------|-----------|
| **IL-01** Portal identity immutable during session | `current_portal` may not change without explicit `enterPortal()` call | Hard lock |
| **IL-02** Atmosphere rebuilds on portal change | `atmosphere_dirty = true` is set immediately; cleared only after atmosphere layer confirms rebuild | Required |
| **IL-03** No cross-portal atmosphere bleed | Portal A's color, particle, or motion tokens may not appear in Portal B's active state | Hard lock |
| **IL-04** Dominant portal is read-only | `dominant_portal` in IntelligenceLayer is computed from history — never manually set | Computed only |
| **IL-05** Fidelity tier persists across navigation | Tier may only change via `fidelity:changed` event — not on every route transition | Event-gated |

---

## 3. MOTION CAPS

Motion caps prevent visual overload and protect the calm score.

| Cap | Rule | Hard Limit |
|-----|------|-----------|
| **MC-01** Transition duration max | No route transition may exceed 600ms total (enter + exit) | 600ms |
| **MC-02** Concurrent animations max | No more than 3 independent Framer Motion elements animating simultaneously in a portal view | 3 |
| **MC-03** Particle count by tier | ultra: 80 / high: 50 / balanced: 30 / light: 0 | Tiered |
| **MC-04** Background pulse max opacity | Atmospheric pulse overlays: max opacity 0.15 | 0.15 |
| **MC-05** Entrance animation once | Portal entrance animation fires once per portal entry — not on scroll, not on focus | Once per entry |
| **MC-06** Exit animation blocking | Exit animation may not be skipped by rapid navigation — AnimatePresence `mode="wait"` enforced | Enforced |
| **MC-07** Spring overshoot cap | All spring animations: damping ≥ 15, stiffness ≤ 200 (prevents elastic overshoot) | Spring bounds |

**Rationale:** Motion that exceeds these caps increases cognitive load without
contributing to spatial identity. Calm is the product — motion is the vehicle.
The vehicle must not become the destination.

---

## 4. DENSITY CAPS

Density caps protect clarity and prevent information overload within portals.

| Cap | Rule | Hard Limit |
|-----|------|-----------|
| **DC-01** Concurrent visible sections | Max 4 distinct content sections visible simultaneously without scroll | 4 |
| **DC-02** Artifact cards in viewport | Max 8 artifact cards visible without pagination | 8 |
| **DC-03** Navigation items | Primary nav: max 7 items. Secondary: max 5. No tertiary nav. | 7 / 5 |
| **DC-04** Simultaneous calls to action | Max 2 primary CTAs visible at once per view | 2 |
| **DC-05** Toast / notification stack | Max 2 toasts visible simultaneously; auto-dismiss ≤ 4s | 2 / 4s |
| **DC-06** Route suggestions shown | Max 1 route suggestion shown per session entry | 1 |
| **DC-07** Text density per block | Body copy blocks: max 4 lines before visual break | 4 lines |

---

## 5. HIGHLIGHT CAPS

Highlight caps preserve the premium signal — overuse destroys it.

| Cap | Rule |
|-----|------|
| **HC-01** Gold accent usage | Gold (`#d4af37`) used only for: owner UI, primary CTAs, S-grade badges, active portal indicator |
| **HC-02** Glow effects | Max 1 active glow effect per viewport. Glow reserved for active artifact or current focus target |
| **HC-03** Uppercase text | Uppercase reserved for: labels, metadata, section headers — never for body copy or CTAs |
| **HC-04** High-opacity white | White at opacity > 0.85 reserved for primary headings only |
| **HC-05** Animated borders | Max 1 animated border visible simultaneously |
| **HC-06** Badge count | Grade badges (S/A/B/C/D/F) only in ControlTower — never in user-facing portals |

---

## 6. PORTAL INTEGRITY RULES

| Rule | Definition |
|------|-----------|
| **PI-01** Every route has a portal | All routes resolve to a portal ID via `getPortalFromPath()`. Unmatched routes use `nexus` as fallback — never undefined. |
| **PI-02** RouteAtmosphereLayer wraps all routes | `PortalShell` renders at App level — individual pages do not manage their own atmosphere. |
| **PI-03** Excluded routes are explicit | `/system`, `/access`, `/privacy`, `/terms`, `/investor/*` explicitly bypass atmosphere. No other routes may be silently excluded. |
| **PI-04** Portal entry fires FusionBus event | Every `enterPortal()` call emits `portal:entered`. No silent portal transitions. |
| **PI-05** Transition grammar is portal-pair-derived | `resolveTransition({ from_portal, to_portal })` determines transition kind. No hardcoded transitions in page components. |
| **PI-06** Atmosphere dirty = no portal render until clean | Portal visual layer waits for `atmosphere_dirty = false` before rendering portal-specific overlays. |

---

## 7. RECOVERY SIMPLIFICATION RULES

| Rule | When | Action |
|------|------|--------|
| **RS-01** Boot failure → cold state | NexusRuntime.boot() fails for any subsystem | Degrade subsystem, continue with cold organism state. Never block render. |
| **RS-02** Memory read failure → empty memory | localStorage read throws or returns corrupted JSON | Treat as cold start. Do not propagate error to user. |
| **RS-03** Artifact store failure → empty list | `listArtifacts()` throws | Return `[]`. Log error to system. Do not break portals. |
| **RS-04** FusionBus listener throws → isolated | Any listener registered via `bus.on()` that throws is caught per-listener. One bad listener cannot crash the bus. | Per-listener try/catch |
| **RS-05** Scoring fails → no health section | `getSystemHealthSummary()` throwing in ControlTower is caught silently. Health section simply doesn't render. | Graceful skip |
| **RS-06** Fidelity detection fails → balanced | If device capability check throws, default to `balanced`. Never `light` on failure (too conservative) or `ultra` (too aggressive). | Balanced fallback |
| **RS-07** Route suggestion confidence below threshold | If `suggestion_confidence < 0.65`, do not show suggestion. Silence is better than wrong guidance. | Suppress |

---

## 8. OWNER OVERRIDE RULES

| Override | Mechanism | Scope |
|----------|-----------|-------|
| **OO-01** Fidelity tier override | `setFidelityTierOverride(tier)` in ControlTower | Persists until cleared |
| **OO-02** Gate open/close | `openGate(id)` / `closeGate(id)` in ControlTower | Persists in localStorage |
| **OO-03** Feature flag toggle | `setFlag(key, enabled)` in ControlTower | Persists in localStorage |
| **OO-04** Governance violation reset | `nexusRuntime` exposes no reset on violation_count — owner must clear via `destroy()` + new session | Intentional friction |
| **OO-05** Motion override | No runtime override — motion caps are code-level. Override requires code change + deploy. | Deliberate |

**Rationale for OO-04 and OO-05:** Governance violations and motion caps must not
be silently waivable at runtime. If they are violated, the environment is degraded —
the owner should know the cost before clearing it.

---

## 9. SHIP GATE RULES

### Gate: GATE_PILOT_OPEN

**Condition:** ALL of the following must be true:
- Owner has walked Creation Lab end-to-end (L-01→L-08) without breaking
- System Health overall grade ≥ B (value ≥ 0.60)
- Friction score < 0.40 (grade A or S)
- Continuity score ≥ 0.40 (grade C or above)
- Zero governance violations in owner session
- Organism never degraded in owner session

**Emitted by:** Owner, via ControlTower `openGate('GATE_PILOT_OPEN')`

**Blocks:** All real user onboarding. No pilot user invited before this gate opens.

---

### Gate: GATE_CASE_STUDY

**Condition:**
- Pilot user return_rate ≥ 0.60 (instrumentation confirms)
- session_2_artifact = true
- Owner has 2 structured feedback sessions documented
- No blocking issues in SystemHealthSummary

**Emitted by:** Owner, manually, after reviewing pilot metrics in ControlTower

---

### Gate: GATE_V5_OPEN (revenue)

**Condition:**
- GATE_CASE_STUDY open
- First paid conversion from non-relationship user confirmed
- return_rate ≥ 0.60 sustained across ≥ 3 users

---

### Gate: GATE_V10_OPEN (scale)

**Condition:**
- Repeatability tests passed (3 independent users, cold onboarding ≤ 5 min)
- All 8 system health scores ≥ C grade for 7 consecutive days
- No governance violations across 3 users over 14 days
- Enterprise inquiry received

---

## 10. SYSTEM OBSERVABILITY — 8 SCORES

All scores: 0.0–1.0. Higher = healthier. Exception: friction (lower = better).
Grade scale: S ≥ 0.90 · A ≥ 0.75 · B ≥ 0.60 · C ≥ 0.40 · D ≥ 0.20 · F < 0.20

| # | Score | Question | Key signals | Blocking threshold |
|---|-------|----------|-------------|-------------------|
| 1 | **continuity** | Does the world remember the user correctly? | re_entry_point, is_resume, artifact_count, recency, panels | < 0.40 = blocking |
| 2 | **calm** | Is the experience non-intrusive? | violation_count, organism_degraded, transition noise, suggestion threshold | — |
| 3 | **identity** | Is the portal's atmospheric DNA intact? | current_portal set, atmosphere_dirty, fidelity_tier | < 0.50 = blocking |
| 4 | **adaptation** | Are suggestions actually useful? | suggestion_confidence ≥ 0.65, return_rate contribution, maturity_level | — |
| 5 | **return_quality** | Does the resume flow feel alive? | is_resume, re_entry_point type, returns recorded, session_2_artifact | < 0.30 (after 2+ sessions) = blocking |
| 6 | **artifact** | Are artifacts used, not just accumulated? | recently_touched ratio, sealed ratio, stale penalty, re_entry artifact | — |
| 7 | **clarity** | Is the portal's purpose clear? | atmosphere clean, portals visited, fidelity tier, routing violations | — |
| 8 | **friction** | How much obstruction exists? (inverse) | violations, degraded count, error_count, subsystem health | > 0.60 = blocking |

**Implementation:** `src/lib/governance/scoring.ts`
**Wired to:** `src/components/owner/ControlTower.tsx` (System Health section)
**Access:** Owner opens ControlTower (⊕ bottom-right), health scores refresh on panel open.

---

## 11. PILOT READINESS DEFINITION

`pilot_ready = true` when ALL of the following hold:
- No blocking issues in `SystemHealthSummary.blocking_issues`
- `friction.value < 0.40`
- `continuity.value ≥ 0.40`
- `identity.value ≥ 0.50`
- If `total_sessions > 2`: `return_quality.value ≥ 0.30`

When `pilot_ready = true`, ControlTower shows `✓ PILOT READY`.
This is advisory — owner still emits `GATE_PILOT_OPEN` explicitly.

---

## 12. FAILURE PLAYBOOKS

### PLAYBOOK-01: Zero returns after pilot session

**Symptom:** Pilot user created artifact, exited, did not return in 48h.
**Diagnosis sequence:**
1. Was the artifact creation real work or a demo task? → If demo: restart with real task.
2. Did the user feel the environment was "done"? → Check for premature closure signals in resume UI.
3. Was the re_entry_point set correctly? → Read `organism.memory.re_entry_point` in session storage.
4. Did the system show resume state on re-entry? → Check `is_resume` flag — if false, continuity pipeline broken.

**Fix priority:** re_entry_point → resume UI signal → artifact vitality → exit tension.

---

### PLAYBOOK-02: Governance violations detected

**Symptom:** `violation_count > 0` in ControlTower.
**Diagnosis:** Open browser console — FusionBus emits `governance:violation` with detail.
**Fix sequence:**
1. Identify which C-0X law was violated from the violation event payload.
2. Trace the state mutation that caused it.
3. Route the mutation through the correct runtime API method.
4. Re-run owner session — confirm violation_count resets to 0 on next boot.

---

### PLAYBOOK-03: Organism degraded

**Symptom:** `organism_degraded_count > 0` or `organism:degraded` event on FusionBus.
**Diagnosis:** Check `OrganismState.system.subsystem_health` — identify which subsystem is `'degraded'`.
**Fix sequence:**
1. `fidelity` degraded → device detection failed → check `src/lib/fidelity/index.ts`.
2. `governance` degraded → governance bridge threw → check `_initGovernanceBridge()` in runtime.
3. `artifacts` degraded → artifact store read/write failure → check localStorage availability.
4. `intelligence` degraded → evolution data corrupt → check `src/hooks/useEvolution.ts`.

---

### PLAYBOOK-04: Identity score below 0.50 (blocking)

**Symptom:** Identity score grade D or F in ControlTower.
**Most common causes:**
- `current_portal` not set → `RouteAtmosphereLayer` not rendering or path not matched
- `atmosphere_dirty = true` persistent → portal change not triggering atmosphere rebuild
- `PortalShell` removed from a page that was previously rendering it manually

**Fix:** Verify `RouteAtmosphereLayer` is wrapping all routes in `App.tsx`. Confirm `NO_ATMOSPHERE_ROUTES` set is correct.

---

### PLAYBOOK-05: Continuity score critical (< 0.40, blocking)

**Symptom:** Continuity score grade D or F.
**Causes:**
- `re_entry_point` never set → `useOrganism.ts` not syncing session to runtime
- `is_resume` always false → session_id collision or fresh load always treated as cold
- `artifact_count` = 0 → artifacts not persisting across sessions

**Fix sequence:**
1. Check `useOrganism` is mounted in root and `syncSession()` is being called.
2. Check artifact store: `listArtifacts()` returning empty after page reload → localStorage key mismatch.
3. Check `computeContinuityScore()` in `organism-state.ts` — verify signal inputs are populated.

---

### PLAYBOOK-06: Friction score critical (> 0.60, blocking)

**Symptom:** Multiple errors, degraded subsystems, or repeated violations.
**Rule:** Do not add features while friction > 0.40. Fix the system first.
**Sequence:**
1. Address governance violations (Playbook-02).
2. Address organism degraded (Playbook-03).
3. Reduce error_count — check `OrganismState.system.error_count` source.
4. Re-run: friction score should drop after subsystems recover.

---

## 13. WEDGE GOVERNANCE RULES

These rules govern the wedge (Creation Lab) specifically during Phase 0.

| Rule | Enforcement |
|------|------------|
| **WG-01** No portal added before Lab return rate ≥ 0.60 | Gate: `GATE_PILOT_OPEN` must be open; `GATE_V5_OPEN` gates portal expansion |
| **WG-02** No feature added during pilot that changes artifact creation flow | Owner decision gate — no code change to Lab during active pilot |
| **WG-03** Route suggestion suppressed if confidence < 0.65 | Code-enforced in `scoring.ts` + `useOrganism.ts` |
| **WG-04** Resume state shown before any new content on return | `re_entry_point` rendered before Lab hero content on `is_resume = true` |
| **WG-05** Artifact store at 200 limit → warn owner, never silently fail | `scoreArtifact()` warns at 190; store should reject at 200 with clear message |

---

## 14. CANONICAL REFERENCES

| File | Role |
|------|------|
| `src/lib/core/organism-state.ts` | C-01→C-07 state schema + continuity score formula |
| `src/lib/core/runtime.ts` | NexusRuntime — enforces anti-chaos laws at boot |
| `src/lib/core/fusion-bus.ts` | Event bus — `governance:violation` event source |
| `src/lib/governance/scoring.ts` | 8-score observability engine |
| `src/components/owner/ControlTower.tsx` | Owner-facing score display + gate controls |
| `src/lib/instrumentation/event-logger.ts` | Pilot metric collection (return_rate, artifact_rate) |
| `src/lib/owner/control-tower.ts` | Gate state + flag state persistence |
| `ops/LIVING_SYSTEM_MANIFEST.md` | 11-layer architecture + C-01→C-07 laws |
| `ops/SCALE_REAL_MANIFEST.md` | H-1→H-4 hardening + rollout sequence |
| `ops/BUILD_REAL_TASKBOARD.md` | TIER-0→TIER-3 tasks + AT-01→AT-10 acceptance tests |

---

_GOVERNANCE_OBSERVABILITY_MANIFEST.md v1.0 — cravado 2026-03-28 | @claude | GOVERNANCE-001_
