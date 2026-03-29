# TRI-CORE STATUS — Eternal Nexus OS
> Lab / Creation / School — parity scores and gap map.
> Family: Product · Subfamily: Tri-Core
> Cravado: 2026-03-29 · @claude

---

## TRI-CORE DEFINITION

```
TRI-CORE ORGANISM:
  LAB        = test reality    (evidence, experiment, hypothesis)
  CREATION   = build reality   (draft, plan, artifact)
  SCHOOL     = master reality  (lesson, progression, mastery)

LAW: Equal dignity required before fusion.
FUSION: Impossible while any dimension = 0%.
```

---

## PARITY SCORES (2026-03-29)

| Dimension | Route | Status | Parity % | Blocking? |
|-----------|-------|--------|----------|-----------|
| CREATION | `/lab` | REAL | 80% | No |
| SCHOOL | `/school` | REAL | 70% | No |
| LAB (test) | `/test` | FUTURE | 0% | YES — blocks fusion |

**Overall tri-core parity: ~50% (1/3 dimension missing entirely)**
**Fusion gate: LOCKED**

---

## CREATION LAB (/lab) — 80%

### What works
- LabHero: sovereign entry, resume badge, dual-signal detection ✓
- LabWorkBay: real artifact data from localStorage ✓
- LabQuickCreate: 4 create buttons (Research, Note, Plan, Draft) ✓
- Artifact persistence: save + retrieve + recent ✓
- Session seeded on cold entry ✓
- returnTracker wired ✓

### What is hollow
- LabToolSpine: zero handlers wired (visual only) — 5 tools, 0 actions
- ts_last_accessed: only updated on create, not on view
- Supabase sync: DEAD (localStorage only = data fragility)
- ArtifactKind: missing `experiment`, `evidence` (needed for Lab tri-core)

### What raises to 90%
1. Wire LabToolSpine handlers (Research → creates research artifact, etc.)
2. Update ts_last_accessed on artifact open

### What raises to 100%
3. Supabase sync activation
4. `updateReEntry` called on artifact open

---

## SCHOOL (/school) — 70%

### What works
- SchoolHero: gold/amber sovereign entry ✓
- Maturity badge: real level from useEvolution ✓
- Resume badge: "Visit N · Level X — [Label]" when return_count > 0 ✓
- LearningPath: 5 steps, status from real maturityLevel ✓
- Progress bar: real percentage ✓
- "How it works" explainer ✓
- returnTracker wired ✓

### What is hollow
- Step "Begin" button: no handler, no action, no artifact created
- No `updateReEntry` on step enter — continuity anchor missing
- Step completion: no mechanism to advance maturityLevel by completing a step
- ArtifactKind: missing `lesson`, `mastery`

### What raises to 85%
1. Wire "Begin" button: creates `lesson` artifact for that step
2. Call `updateReEntry('school:step-{n}')` when Begin clicked

### What raises to 100%
3. Step completion mechanic: finishStep() → triggers evolution engine
4. Lesson artifact linked to LearningPath step

---

## LAB / TEST (does not exist) — 0%

### What is needed
- `/test` route in App.tsx
- `TestPage.tsx` (mirrors LabPage structure)
- `TestHero.tsx` — experimental palette, hypothesis-framing language
- `TestBay.tsx` — experiment/evidence artifact view
- ArtifactKind additions: `experiment`, `evidence`, `hypothesis`
- returnTracker wired for `'test'` portal

### Estimated work
- 1 session with @framer (visual surface)
- 1 session with @cursor (TestBay wiring)
- 0 new systems needed — all infrastructure exists

### Owner gate required
- Gate decision: "Build Lab tri-core surface"
- Until gate opens: zero work on this dimension

---

## FUSION READINESS CHECKLIST

```
□ Creation Lab parity ≥ 90%       (currently 80%)
□ School parity ≥ 90%             (currently 70%)
□ Lab/Test parity ≥ 70%           (currently 0% — GATE REQUIRED)
□ Supabase sync activated         (currently DEAD)
□ returnTracker proved (wedge)    (currently PENDING test)
□ Governance call sites wired     (currently DEAD)

FUSION GATE: ALL boxes checked = organism can fuse.
```

---

_TRI_CORE_STATUS.md · product v1.0 · 2026-03-29_
