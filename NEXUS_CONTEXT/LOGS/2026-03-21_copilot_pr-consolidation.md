# LOG — 2026-03-21 · copilot · PR Stack Consolidation

**Task:** Consolidate open PR stack — PRs #92, #91, #89, #86, #84, #83, #76, #75, #73, #71  
**Branch:** `copilot/consolidate-open-pulls`  
**Gate:** Ops/Scaffold — repo hygiene and coherence

---

## Triage Summary

| PR | Title | Decision | Reason |
|----|-------|----------|--------|
| #92 | ops: canonical evidence labels in CODEX_CONSOLIDATOR + FOL | DEFERRED | Depends on `claude/expose-workspace-config-yt4Km` (ops/ dir not on main) |
| #91 | BULK-02.2: FOL editorial cleanup + live state sync | DEFERRED | Depends on `claude/expose-workspace-config-yt4Km` (ops/ dir not on main) |
| #89 | docs: define and activate visual spine layers | PARTIALLY INCLUDED | New docs/ files + ops/VISUAL_TEMPLATE_PACK_002A.md included; ops/OUTPUT_STANDARD.md change skipped (depends on claude-base) |
| #86 | feat(U1): Dark Glassmorphism visual DNA | INCLUDED | Code changes cherry-picked; full U1 enhancement applied |
| #84 | chore: validate L-001 + L-002 operational hygiene | SKIPPED | Empty PR (0 files changed) |
| #83 | Validate Fase 3 operational hygiene baseline | SKIPPED | Empty PR (0 files changed) |
| #76 | fix: align React 18 typings to restore R3F JSX namespace | INCLUDED | Applied; deduplicated with #75 |
| #75 | fix: align React 18 typings to restore R3F JSX namespace | SKIPPED — DUPLICATE | Identical to #76 |
| #73 | [copilot] backlog triage — 6 PRs + 12 issues | LOG INCLUDED | Triage log added; remaining 40 file changes superseded |
| #71 | [copilot] GRAND RESET v1 — Post-Cleanup Verification Audit | ALREADY IN MAIN | Log already present in `NEXUS_CONTEXT/LOGS/` on main |

---

## What Was Applied

### 1. React 18 typings fix (from #76, deduplicated from #75)
- `package.json`: `@types/react` downgraded from `^19.2.14` → `^18.3.28`
- `package.json`: `@types/react-dom` downgraded from `^19.2.3` → `^18.3.7`
- `package-lock.json`: regenerated
- Fixes global R3F JSX namespace errors (`mesh`, `group`, etc. missing from `JSX.IntrinsicElements`)

### 2. Dark Glassmorphism U1 enhancements (from #86)
- `src/lib/map/dark-style.ts`:
  - Added `tealBorder`, `tealBorderGlow`, `tealBorderHalo`, `tealBorderHover` to COLORS palette
  - Country border halo + glow layers switched from gold → teal `#00F5D4`
  - `startNeonBorderAnimation` tick rate slowed (0.02 → 0.018) for smoother pulse
  - New export `enableHoverEffects(map)` — country border proximity hover + cleanup fn
- `src/components/geopolitics/GeopoliticsMap.tsx`:
  - `verdict-markers` source gets `generateId: true` for feature-state
  - New `verdict-ring` layer (stroke-only reticle ring, branded Nexus marker)
  - `verdict-core` radius/opacity respond to `feature-state.hover`
  - `mouseenter`/`mouseleave` on `verdict-core` wired to feature-state with ID tracking
  - `enableHoverEffects` called post-load with ref cleanup
  - `LAYER_MAP_IDS['verdict-markers']` updated to include `verdict-ring`
- `src/index.css`: `nexusNeonPulse` keyframe now emits gold + teal glow simultaneously at 50%

### 3. Visual Spine docs (from #89 — new files only)
- `docs/DOC_VISUAL_SPINE_001.md` — Aether Spine visual master blueprint
- `docs/DOC_VISUAL_SPINE_002A.md` — localized activation blueprint
- `ops/VISUAL_TEMPLATE_PACK_002A.md` — living templates (handoffs, reports, letters, outputs)
- `README.md` — references to visual spine docs added under "Governança da Fase 3"

### 4. Session logs folded in
- `NEXUS_CONTEXT/LOGS/2026-03-19_codex_r3f-jsx-baseline-unblock.md` (from #76)
- `NEXUS_CONTEXT/LOGS/2026-03-19_copilot_backlog-triage.md` (from #73)
- `NEXUS_CONTEXT/LOGS/2026-03-20_copilot_U1-dark-glassmorphism-enhancements.md` (from #86)

---

## What Was NOT Applied

- **#92 + #91**: These modify `ops/CODEX_CONSOLIDATOR.md`, `ops/FOL.md`, `ops/LIVE_STATE.md`, `ops/HANDOFF_LEDGER.md` — files that exist on `claude/expose-workspace-config-yt4Km` but NOT on `main`. Applying them requires that branch to be merged first. They should be re-applied after `claude/expose-workspace-config-yt4Km` lands on main.
- **#84 + #83**: Empty PRs (0 files changed). Nothing to apply.
- **#75**: Exact duplicate of #76. Discarded.

---

## Evidence

```bash
npm run test   # 70 tests must pass
npx tsc --noEmit  # must be clean (pre-existing errors unaffected)
```

---

## Next Steps

1. After this PR merges, close or mark as superseded: #86, #76, #75, #73, #84, #83
2. Defer: #92, #91 — re-apply after `claude/expose-workspace-config-yt4Km` merges
3. Defer: #89 — the `ops/OUTPUT_STANDARD.md` change from this PR can be re-applied after claude-base lands
