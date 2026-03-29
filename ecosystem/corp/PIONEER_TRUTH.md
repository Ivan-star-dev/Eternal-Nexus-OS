# PIONEER TRUTH — Eternal Nexus OS
> Who owns what. Forbidden zones. Exit proof checklists.
> Family: Corp · Subfamily: Pioneer Structure
> Cravado: 2026-03-29 · @claude · Source: PIONEER_MATRIX + this session audit

---

## PIONEER ROSTER

| Pioneer | Pillar | Territory | Status |
|---------|--------|-----------|--------|
| @claude | WorkStructure + WorkFunction (arch) | Canon, logic, specs, governance design, ecosystem | ACTIVE |
| @cursor | WorkFunction (impl) | Runtime, state, API, TypeScript implementation | ACTIVE |
| @framer | WorkVisual | UI surfaces, portal identity, motion, atmosphere | ACTIVE |
| @antigravity | WorkVisual (3D/motion) | Globe, 3D layers, immersive depth, spatial motion | ACTIVE |
| @copilot | WorkFunction (lapidation) | Code review, PR cleanup, consolidation, wiring | ACTIVE |
| @codex | WorkFunction (hardening) | Performance, profiling, bundle size, tests | ACTIVE |

---

## PIONEER 1 — @claude

### May touch
- All `ops/` docs (canonical layer)
- `ecosystem/` (this dir)
- Schema design (types.ts, interfaces)
- Architecture decisions
- Governance rules (runtime.ts law definitions)
- `src/hooks/useEvolution.ts` (logic design)
- `src/lib/` (library design)

### Must NOT touch without gate
- `src/components/` visual styling decisions (that's @framer territory)
- 3D/motion code (@antigravity territory)
- Performance optimizations (@codex territory)
- `master` / `main` branches (ABSOLUTE)

### Exit proof checklist
- [ ] HANDOFF_LEDGER.md updated (append at top)
- [ ] LIVE_STATE.md updated
- [ ] BASTION.md task status updated
- [ ] All changes committed to canonical branch
- [ ] No TypeScript errors in changed files

---

## PIONEER 2 — @framer

### May touch
- `src/components/` — all visual surfaces
- `src/pages/` — page layout only (not session/state logic)
- Color tokens, typography, spacing
- Motion/animation (framer-motion usage)
- Portal identity

### Must NOT touch
- `src/contexts/` — session, auth contexts
- `src/lib/` — library code
- `ops/` — canonical docs
- `src/hooks/` — business logic hooks

### Immediate tasks (no gate required)
1. `src/components/lab-surface/LabHero.tsx` — remove `background: "#060c14"` inline (5 min)
2. `src/pages/AtlasPage.tsx` — remove `fixed inset-0 bg-background` override (5 min)
3. Wire `LearningPath` step "Begin" button handler (coordinate with @cursor for action)

### Exit proof checklist
- [ ] Visual surfaces match BRAND_CANON color tokens
- [ ] No hardcoded backgrounds remaining on LabHero and AtlasPage
- [ ] Build passes (npm run build)

---

## PIONEER 3 — @cursor

### May touch
- `src/lib/` — all library code
- `src/hooks/` — all hooks
- `src/contexts/` — state contexts (with care)
- API integrations (Supabase)
- TypeScript types and interfaces

### Must NOT touch
- Visual/styling decisions in components
- `ops/` canonical docs
- `ecosystem/` docs

### Priority tasks
1. Supabase artifact sync activation (most critical — data durability)
2. `ts_last_accessed` update on artifact view (not just save)
3. Wire governance call sites: `saveArtifact` → `guardArtifactCount`
4. `enable_pilot_access` enforcement in ProtectedRoute

### Exit proof checklist
- [ ] Artifacts survive browser wipe (Supabase sync active)
- [ ] Governance C-01 enforced in saveArtifact
- [ ] `npm run typecheck` — zero errors in changed files
- [ ] `npm test` — all passing

---

## PIONEER 4 — @antigravity

### May touch
- 3D components, Globe, Sacred Orbital Chamber
- Motion primitives, depth layers
- Atmospheric visual systems

### Must NOT touch
- Session/state logic
- Business logic hooks
- `ops/` docs

---

## PIONEER 5 — @copilot

### May touch
- PR review and cleanup
- Type consolidation
- Wiring existing systems to call sites (e.g., governance guards)
- Dead code removal (coordinate with @claude for identification)

### Must NOT touch
- Architecture decisions without @claude gate
- New feature additions (lapidation only)

### Priority tasks
1. Wire governance call sites (identified by @claude)
2. Consolidate duplicate type definitions
3. Remove remaining dead code (carry_context, carry_artifacts consumers)

---

## PIONEER 6 — @codex

### May touch
- Performance optimization
- Bundle size analysis
- Test coverage
- Build configuration

### Must NOT touch
- Feature logic
- Architecture

---

## GLOBALLY FROZEN FILES (no pioneer may touch without owner gate)

```
CLAUDE.md                           ← primary law
ops/DNA_PROTOCOL.md                 ← mother protocol
ops/BRAND_CANON.md                  ← brand law
ops/BASTION.md                      ← execution gate
All committed canonical ops/ docs   ← append-only ledger
master / main branches              ← absolute prohibition
```

---

## HANDOFF PROTOCOL (mandatory for all pioneers)

```
Before session end:
1. git status — verify only intended files changed
2. git commit — message: [area]: [what] — [why]
3. git push -u origin <canonical-branch>
4. ops/HANDOFF_LEDGER.md — append entry (date, pioneer, task, evidence, what changed)
5. ops/LIVE_STATE.md — update last-updated line
6. ops/BASTION.md — mark task as done if applicable

Without handoff = task is not complete.
```

---

_PIONEER_TRUTH.md · corp v1.0 · 2026-03-29_
