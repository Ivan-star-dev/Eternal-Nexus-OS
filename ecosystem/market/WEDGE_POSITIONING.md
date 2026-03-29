# WEDGE POSITIONING — Eternal Nexus OS
> The wedge formula. Proof state. What has been tested.
> Family: Market · Subfamily: Wedge
> Cravado: 2026-03-29 · @claude · Status: SCAFFOLD — wedge test not yet run

---

## THE WEDGE FORMULA (canonical)

```
Enter → create value → leave → feel unfinished continuity → return without being asked

GATE: returned_within_48h = true, wedge_signal ≥ weak
METRIC: 48h unprompted return — the only metric that validates the wedge
```

This formula is the single test of whether the product works.
Not DAU. Not session length. Not feature usage.
**Did they come back in 48 hours without being asked?**

---

## WEDGE COMPONENTS — STATUS

### Component 1: Enter `[REAL]`
User can reach /lab or /school without friction.
- Route exists ✓
- No auth required for exploration ✓
- Hero surfaces convey identity and ownership ✓

### Component 2: Create Value `[REAL]`
User can create an artifact (research, note, plan, draft, simulation).
- saveArtifact wired ✓
- LabWorkBay shows created artifacts ✓
- LearningPath shows progression ✓

### Component 3: Leave `[REAL — trivially]`
User closes the browser.
- No intervention, no guilt-push needed ✓

### Component 4: Feel Unfinished Continuity `[PARTIAL]`
The system creates a psychic thread that doesn't close.
- Resume badge fires on return ✓ (SchoolHero + LabHero)
- "Visit N · Level X" shows what was left ✓
- LearningPath shows incomplete step ✓
- **Missing:** SchoolPage step "Begin" handler (no artifact created, no continuity anchor)
- **Missing:** `updateReEntry` never called on step enter — re_entry_point stays generic

### Component 5: Return Without Being Asked `[PROVED — PENDING]`
The single proof.
- returnTracker infrastructure: REAL ✓
- `returned_within_48h` computation: REAL ✓
- ControlTower Wedge Gate verdict: REAL ✓
- **TEST STATUS: NOT RUN — awaits owner action**

---

## WEDGE TEST PROTOCOL

```
STEP 1: Owner opens /lab in a clean session (no prior return_count)
STEP 2: Creates at least one artifact (click any QuickCreate button)
STEP 3: Views /school, checks Learning Path step
STEP 4: Closes browser entirely
STEP 5: Waits at least 1 hour (ideally 24-48h)
STEP 6: Returns to /lab
STEP 7: Opens ControlTower (owner keyboard shortcut)
STEP 8: Check Wedge Gate section

PASS CRITERIA:
  returned_within_48h = true
  wedge_signal = weak (1 return) or strong (3+ returns)

FAIL CRITERIA:
  returned_within_48h = false (came back after 48h or not at all)
  wedge_signal = none
```

---

## WHY THE WEDGE IS NOT YET PROVED

```
WHAT IS BUILT:        infrastructure to detect return (REAL)
WHAT IS NOT BUILT:    the reason to return (PARTIAL)

The infrastructure detects IF the user returns.
The product must CREATE THE REASON to return.

Currently strong:
  ✓ Resume badge (visual pull)
  ✓ LearningPath incomplete step (cognitive incompleteness)
  ✓ Visit count (social/personal reinforcement)

Currently weak:
  × "Begin" on school step does nothing — creates no artifact, no progress save
  × No time-based hook (no "you were 2 days from level 2" messaging)
  × No re_entry_point continuity to specific artifact or step
```

---

## POSITIONING AGAINST ALTERNATIVES

```
AGAINST NOTION:
  Notion = static database. Knowledge lives, action dies.
  Nexus = system that evolves. Knowledge + action + progression unified.

AGAINST OBSIDIAN:
  Obsidian = notes for thinkers, unconstrained, unshaped.
  Nexus = sovereign environment — shape the thinker, not just the notes.

AGAINST ROAM:
  Roam = graph of associations. Power without direction.
  Nexus = direction embedded in architecture. Three portals, one organism.

AGAINST PRODUCTIVITY SUITES:
  They optimize output. We deepen capability.
  Not "get more done." — "become the person who can."
```

---

## MARKET READINESS — TRUTH LABEL

```
Category defined:        CANONICALIZED
Positioning clear:       REAL
Wedge formula:           REAL
Wedge proved:            FUTURE — test not run
External distribution:   FUTURE — no pilot users yet
Pricing model:           FUTURE — not defined
Pilot gate:              BLOCKED — awaits P0 completion (governance, spawn, Supabase sync)
```

**Law:** Market cannot expand until wedge_signal = proved.
**Next market action:** Run wedge test (owner only, 48h). Then ControlTower verdict.

---

_WEDGE_POSITIONING.md · market v1.0 · 2026-03-29_
