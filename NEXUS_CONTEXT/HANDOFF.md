# ETERNAL NEXUS — PIONEER HANDOFF (Universal Neural Link)
**Date:** 2026-03-21
**Issuing Pioneer:** `@claude` (branch: `claude/rebuild-bastion-core-rihGX`)

---

## 1. ACTIVATION ORDER

The founder has issued a direct activation command: **engage ALL pioneers on the mission.**

`@codex` `@antigravity` `@cursor` `@copilot` — all confirmed dormant or partial. This handoff ends dormancy across the board. Execute immediately.

---

## 2. CODEX — ACTIVATED

**Role:** CI, verification, test coverage, guardrails.

### Tasks (execute in order):

**T-001** — `in-review` | CI Suite merge
- Branch: `agent/codex`
- Task: Verify your CI PR is clean and push any final corrections. Tag for merge.
- Gate: Sacred Flow gate + report-presence gate must both pass.
- Verify:
  ```bash
  node scripts/gates/report-presence-gate.cjs
  node scripts/gates/sacred-flow-gate.cjs
  ```

**T-003** — `blocked → unblocking path`
- Blocker: T-002 (Nervous System v2 spine) in-review at PR #8.
- Action NOW: Scaffold the test suite on `agent/codex` without waiting for T-002.
  - Create `src/test/nervous-system/` with:
    - `deterministic-ids.test.ts` — same seed → same event ID
    - `idempotency.test.ts` — duplicate publish is a no-op
    - `replay-cursor.test.ts` — clients replay from cursor
  - Mark tests `TODO` at the bus interface boundary. Do not block — scaffold and annotate.
- Wire `npm run test` to include the new suite.

**T-007** — `queued` | Pilot guardrails
- After T-001 lands: add input validation to Tribunal event ingestion path.
- Prevent malformed events from reaching the Index.

---

## 3. ANTIGRAVITY — ACTIVATED

**Role:** Ops, deployment, workspace, packaging.

### Tasks:

**T-004** — `in-review`
- Branch: `agent/antigravity`
- Task: Confirm workspace setup PR is ready. Push any final corrections.

**T-006** — `queued` | Stack scoring — packaging + private vault lane
- Branch: `agent/antigravity`
- Task: Claim and score the packaging and private-vault candidates in `NEXUS_CONTEXT/STACK_REGISTRY.md`.
- Focus: PMTiles packaging, basemap bundling, private data handling.
- Output: fill in A/B/C/D/E scores and set Decision for each candidate in your lane.
- No blocker — start immediately.

**NEW: T-008 — Deployment Pipeline Hardening** (`queued`)
- Labels: `organ:nexus`, `type:ops`, `gate:nervous-system-v1`, `effort:M`, `blocked:no`
- Owner: `@antigravity` | Backup: `@codex`
- Task: Build deploy readiness for Nervous System v1 go-live:
  1. `scripts/gates/deploy-readiness-gate.cjs` — checks env vars, Sacred Flow gate, build exit 0
  2. `.github/workflows/deploy-readiness.yml` — runs gate on PRs to `main`
  3. `README.md` — add **Deployment** section
- Acceptance: `node scripts/gates/deploy-readiness-gate.cjs` exits 0 on a clean repo.

**STANDING BACKUP: T-002**
- If `@claude` is blocked on the Nervous System spine, `@antigravity` is backup.
- Watch for a HANDOFF from `@claude`.

---

## 4. CURSOR — ACTIVATED

**Role:** Visual spine, interface architecture, Aether Canon Terminal implementation.

### Context:
Your last commit (`visual: dual-track closeout and terminal polish`, 2026-03-21) and `docs/VISUAL_MOTHER.md` (AETHER-CANON-TERMINAL-001) are confirmed as the canonical visual blueprint. The interface mother is defined. Now implement it.

### Tasks:

**U1** — `queued` | Dark Glassmorphism applied to Geopolitics map
- Branch: `cursor/espinha-visual-do-ecossistema-6ecf`
- Task: Apply the Dark Glassmorphism "Eternal Nexus" visual DNA to the Geopolitics Mapbox/MapLibre JSON styles.
  - Hide unnecessary labels
  - Prioritize glowing neon borders on geopolitical boundaries
  - Maintain Aether Canon Terminal principles (calm surface, precise core)
- Constraint: Do NOT touch `vite.config.ts`, `src/types/index.ts`, `tailwind.config.ts` — protected files.
- Validate: `npm run build` exits 0, `npm run lint` passes.

**NEW: T-009 — Aether Canon Terminal — NexusPage Implementation** (`queued`)
- Labels: `organ:nexus`, `type:ui`, `gate:nervous-system-v1`, `effort:L`, `blocked:no`
- Owner: `@cursor` | Backup: `@copilot`
- Branch: `cursor/espinha-visual-do-ecossistema-6ecf`
- Task: Implement the 6-layer Aether Canon Terminal structure in `src/pages/NexusPage.tsx`:
  - `L1_Corporate_Header` — identity, phase, branch, executor state
  - `L2_Context_Rail` — semaphore, gate status, dependencies
  - `L3_Long_Read_Core` — reasoning, decisions, narrative section
  - `L4_Execution_Deck` — commands, diffs, evidence output
  - `L5_Pioneer_Signature_Band` — agent identity band
  - `L6_Handoff_Chain_Block` — handoff + next actor block
- Rule: Structure first. No Framer motion yet — that is the next layer after architecture is stable.
- Acceptance: Visual output matches `docs/VISUAL_MOTHER.md` section 2 grid.

**NEW: T-010 — Stack scoring — UI/Atlas visual candidates** (`queued`)
- Labels: `organ:atlas`, `type:stack-debate`, `effort:S`, `blocked:no`
- Owner: `@cursor` | Backup: `@ui`
- Task: Score the UI-side candidates in `NEXUS_CONTEXT/STACK_REGISTRY.md`:
  - CesiumJS camera/terrain feel
  - deck.gl overlay performance
  - Motion (animation layer)
  - Any UI-relevant candidates in the registry
- Fill A/B/C/D/E scores. Set Decision state. Write a 1-line rationale per candidate.

---

## 5. COPILOT — ACTIVATED

**Role:** C2 MapLibre shell, visual implementation co-owner, React component layer.

### Tasks:

**C2** — `queued` | GeopoliticsMap.tsx MapLibre shell
- Branch: `copilot` (use `copilot/` prefix)
- Task: Implement `src/components/atlas/GeopoliticsMap.tsx` using MapLibre GL JS with the `pmtiles://` registrar.
  - Load the PMTiles protocol adapter
  - Wire into the Tribunal data layer (read events from Atlas bus)
  - Match Cursor's dark glassmorphism visual layer (coordinate with T-009)
- Blocker: T-002 (spine) must land first for full bus integration. Pre-wire the component, mark bus integration as TODO.
- Validate: `npm run typecheck` and `npm run build` pass.

**U1 co-owner** — coordinate with `@cursor` on dark glassmorphism styles.
- Do not duplicate Cursor's style work. Cursor owns the Mapbox JSON styles. Copilot owns the React component shell.

**NEW: T-011 — React 18 typing cleanup** (`queued`)
- Labels: `organ:nexus`, `type:dx`, `effort:S`, `blocked:no`
- Owner: `@copilot`
- Task: Resolve remaining React 18 JSX typing errors flagged in `C6-codex-eslint-audit`.
  - Run `npm run typecheck` — fix all errors in `src/`
  - Run `npm run lint` — fix all warnings in modified files only
- Validate: both commands exit 0.

---

## 6. FULL PIPELINE STATUS (post-activation)

| Task | Owner | Status | Priority |
|------|-------|--------|----------|
| T-001 | `@codex` | in-review → close | URGENT |
| T-002 | `@claude` | in-review → merge | URGENT |
| T-003 | `@codex` | scaffold now | HIGH |
| T-004 | `@antigravity` | in-review → close | HIGH |
| T-005 | `@claude` | queued | MEDIUM |
| T-006 | `@antigravity` | queued — START NOW | MEDIUM |
| T-007 | `@codex` | queued after T-001 | MEDIUM |
| T-008 | `@antigravity` | NEW — START NOW | HIGH |
| T-009 | `@cursor` | NEW — START NOW | HIGH |
| T-010 | `@cursor` | NEW — START NOW | MEDIUM |
| T-011 | `@copilot` | NEW — START NOW | MEDIUM |
| C2 | `@copilot` | queued — scaffold now | HIGH |
| U1 | `@cursor` + `@copilot` | queued | HIGH |

---

## 7. COORDINATION RULES

- All agents are parallel — no cross-dependencies block immediate starts except T-003 (full impl gates on T-002) and C2 (bus integration gates on T-002).
- T-009 (Cursor: NexusPage) and C2 (Copilot: MapLibre) must coordinate on visual style. Cursor owns styles; Copilot owns the component shell.
- T-008 (Antigravity: deploy gate) and T-003 (Codex: test scaffold) are fully independent — start simultaneously.
- Sacred Flow invariant: **Tribunal → Atlas → Index → News**. Every change must strengthen this chain.
- Protected files: `vite.config.ts`, `src/types/index.ts`, `data/projects.ts`, `tailwind.config.ts` — require handoff before touching.
- Any blocker: write `NEXUS_CONTEXT/HANDOFF.md` on your agent branch and tag `@claude`.

---

## 8. FETCH COMMANDS

```bash
# Codex
git fetch origin agent/codex
git show origin/agent/codex:NEXUS_CONTEXT/HANDOFF.md

# Antigravity
git fetch origin agent/antigravity
git show origin/agent/antigravity:NEXUS_CONTEXT/HANDOFF.md

# Cursor
git fetch origin cursor/espinha-visual-do-ecossistema-6ecf
git show origin/cursor/espinha-visual-do-ecossistema-6ecf:docs/VISUAL_MOTHER.md

# Copilot
git fetch origin agent/copilot

# This dispatch (source of truth)
git fetch origin claude/rebuild-bastion-core-rihGX
git show origin/claude/rebuild-bastion-core-rihGX:NEXUS_CONTEXT/HANDOFF.md
```

---

## 9. REGISTRATION OF CANALIZAÇÃO

```
┌─────────────────────────────────────────────────────────────┐
│  ETERNAL NEXUS — ALL PIONEERS ACTIVATED                     │
│  2026-03-21 | @claude dispatch                              │
├──────────┬──────────┬──────────┬──────────┬────────────────-┤
│ @codex   │ @antigrav│ @cursor  │ @copilot │ @claude         │
│ T-001    │ T-004    │ T-009    │ C2       │ T-002 (URGENT)  │
│ T-003    │ T-006    │ T-010    │ T-011    │ T-005           │
│ T-007    │ T-008    │ U1       │ U1 co    │                 │
├──────────┴──────────┴──────────┴──────────┴─────────────────┤
│  Sacred Flow: Tribunal → Atlas → Index → News → Streams     │
│  Gate: Nervous System v1 — deterministic, idempotent,       │
│         replayable, logged, narratable                      │
└─────────────────────────────────────────────────────────────┘
```

*Organism status: FULLY ACTIVE. All pioneers online. Execute.*
