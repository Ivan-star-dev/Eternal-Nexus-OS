# 2026-03-19 — claude — grand-reset-v1-branch-normalization

## Context
- **Mission:** GRAND RESET v1 — full branch taxonomy normalization
- **Role:** architect / ops
- **Platform:** Claude Code
- **Branch:** ops/grand-reset-v1-branch-normalization

---

## What changed (facts)

### Branches deleted (65 total)
**Merged into main — safe delete:**
- `c4-event-ledger-observability` (PR #26 MERGED)
- `feat/geopolitics-visual-U1-U2-C4b` (PR #50 MERGED)
- `claude/hungry-hertz` (0 commits ahead)
- `agent/claude-Acc-1` (0 commits ahead, orphan account branch)
- `codex/lead-codex-and-github-copilot-for-phase-3` (old phase name, noise)
- `codex/lead-codex-and-github-copilot-for-phase-3-dg1vte` (dupe)
- `feat/r3f-v9-upgrade-and-fixes` (superseded by feat/r3f-v9-clean)
- `codex/check-repo-and-branch-for-task` (no open PR, audit noise)
- `codex/identify-cadence-references-in-watcher-files` (trivial watcher config)
- `claude/cranky-ride` (duplicate of agent/antigravity T-004/T-006 commits)
- `claude/jolly-austin` (governance restructure already in main via PR #26)

**Copilot noise — 33 branches deleted (meta-task names, no product code):**
- do-all-your-tasks, execute-new-tasks, execute-tasks-from-repo
- check-and-execute-pipeline-tasks, read-repository-instructions
- merge-correct-pull-requests, fix-merge-conflicts
- sub-pr-7, sub-pr-7-again
- add-geopolitics-map-shell, add-performance-monitoring, add-validation-script
- create-react-map-container, update-task-description
- finish-and-commit-all-tasks (superseded by PR #50)
- u1-dark-glassmorphism-geopolitics-map, u1-dark-glassmorphism-map-skin (superseded)
- u2-layer-toggle-panel, u2-maplibre-layer-toggle-panel (superseded)
- c4-add-heatmap-layer, c3-wire-atlas-sensors-event-bus (superseded)
- a2-ci-performance-gate, implement-geopolitics-map-shell (superseded)
- analyze-workflow-configurations, install-npm-dependencies
- fix-twelve-issues-and-merge-eights-prs, review-compression-report
- fix-all-issues, audit-repo-state, audit-review-compression
- audit-review-noise, audit-open-prs-and-issues, cleanup-prs-wave-1

**Plan-only copilot task branches (1 "Initial plan" commit, zero implementation):**
- `copilot/a4-setup-self-hosted-pmtiles` → PRs #42, #48 closed
- `copilot/c5-add-indexeddb-adapter` → PR #43 closed
- `copilot/antigravity-self-hosted-pmtiles` → duplicate A4

### Branches renamed (2)
- `codex/perform-hard-self-audit` → `C6-codex-eslint-audit`
- `codex/open-exclusive-pr-for-baseline-fix` → `A2-ci-baseline-gate`

### PRs closed (noise/superseded)
- #42, #43, #48 (plan-only copilot A4/C5)
- #52, #54, #55, #56, #57 (meta-task noise — already closed)
- #60, #62, #63, #66, #67, #68, #69, #70 (audit/noise — already closed)

---

## Final branch state (12 branches)

```
main                                  ← production truth
agent/claude                          ← @claude parking
agent/codex                           ← @codex CI work (14 ahead)
agent/copilot                         ← @copilot parking
agent/antigravity                     ← @antigravity ops (1 ahead)
lab/antigravity/01-pmtiles            ← PMTiles lab validation
claude/magical-goodall                ← worktree (stale, pre-merge)
C6-streams-organ                      ← PR #59 open — Streams organ slice 1
C6-codex-eslint-audit                 ← PR #61 open — ESLint + C6 codex
A2-ci-baseline-gate                   ← PR #53 open — CI baseline gate
fix/replay-cursor-types-and-C5-close  ← PR #51 open — C5 close + ReplayCursor
feat/r3f-v9-clean                     ← PR #65 open — R3F v9 upgrade
```

## Open PRs (4 — all real product work)

| PR | Branch | Task | Status |
|----|--------|------|--------|
| #7 | agent/codex | CI + Sacred Flow Gate | Open (old) |
| #51 | fix/replay-cursor-types-and-C5-close | C5 close + types | Ready to merge |
| #53 | A2-ci-baseline-gate | CI baseline fix | Ready to review |
| #59 | C6-streams-organ | Streams organ slice 1 | Active |
| #61 | C6-codex-eslint-audit | ESLint 131 fixes + C6 | Ready to review |
| #65 | feat/r3f-v9-clean | R3F v8→v9 upgrade | Ready to review |

---

## Why (alignment)
- Branch chaos was primary onboarding blocker for new pioneers
- 29 copilot branches were named after meta-tasks (do-all, fix-all, audit-*)
  rather than literal task IDs — this violates GRAND RESET naming policy
- Random-name claude branches (cranky-ride, jolly-austin, hungry-hertz)
  violated the platform-aware naming rule
- Plan-only branches (single "Initial plan" commit) added noise without value

## Naming policy enforced (from GRAND RESET v1)
```
main
agent/<platform>            — platform parking
lab/<platform>/<topic>      — exploration/scratch
<TASKID>-<literal-name>     — task branches
feat/<literal-description>  — feature branches without task ID
fix/<literal-description>   — fix branches
ops/<literal-description>   — ops/infra branches
```

## Next actions
1. Merge PR #51 → closes C5, closes Phase 1
2. Review + merge PR #61 → 131 ESLint fixes (audit before merging)
3. Review + merge PR #53 → CI baseline gate
4. Continue PR #59 → Streams organ (Phase 2 gate requirement)
5. Delete `claude/magical-goodall` after confirming all commits merged
