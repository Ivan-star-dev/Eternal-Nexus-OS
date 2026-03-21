# 2026-03-19 — @copilot — Backlog Triage Report

## Context
- **Why this task exists:** GRAND RESET v1 reduced queue to 6 PRs + 12 issues. Need classification and sequencing before further work.
- **Phase Gate targeted:** Ops/Scaffold — repo hygiene and merge path clarity.

---

## BACKLOG TRIAGE REPORT

- **total PRs:** 6 (excluding this triage PR #73)
- **total issues:** 12
- **merge-next PRs:** #59, #72, #65
- **blocked PRs:** #51
- **close/defer PRs:** #71, #7
- **active blocker issues:** #18 (C3 — Atlas Sacred Flow gap), #20 (C5 — event bus persistence)
- **already solved issues:** #29 (dup of #13), #30 (dup of #14), #31 (dup of #15), #32 (dup of #17)
- **parked issues:** #13 (U1), #14 (U2), #15 (A2), #16 (A3), #17 (A4), #19 (C4)
- **recommended merge order:** PR #59 → PR #72 → PR #65
- **next merge candidate:** PR #59 (C6 Streams type contract — types-only, smallest scope, unblocks C6 slices 2-3)
- **blockers:** PR #51 has merge conflicts (needs rebase against current main); PR #7 is massively stale (base 8+ merges behind, reconstruct or close)

---

## PR Classification Detail

### MERGE NEXT (3)

| # | Title | Mergeable | Files | Rationale |
|---|-------|-----------|-------|-----------|
| #59 | C6: Streams organ — type contract (slice 1/3) | ✅ clean (unstable = CI pending) | 19 | Types-only, smallest scope, unblocks C6 slices 2-3. Base matches current main (8394d37). |
| #72 | ops(grand-reset-v1): branch normalization | ✅ clean (unstable = CI pending) | 7 | Ops-only, normalizes repo branch state. PIPELINE.md + log file only. Base matches current main. |
| #65 | feat(deps): R3F v8→v9 + Drei v9→v10 | ✅ clean (unstable = CI pending) | 11 | Independent dep upgrade, net -136 lines. No conflicts. Base matches current main. |

### BLOCKED (1)

| # | Title | Mergeable | Files | Rationale |
|---|-------|-----------|-------|-----------|
| #51 | feat(spine): ReplayCursor type filter + Phase 1 close | ❌ dirty | 58 | Base SHA stale (ca5a7ae, 4+ merges behind). 21 commits, 58 files changed. Needs rebase before review. Contains valuable ReplayCursor filter + Phase 1 close + Phase 2 task queue seeding. Worth rebasing. |

### CLOSE/DEFER (2)

| # | Title | Mergeable | Files | Rationale |
|---|-------|-----------|-------|-----------|
| #71 | [copilot] Post-Cleanup Verification Audit | ❌ draft | 1 | Doc-only audit log. Findings superseded by #72 (Grand Reset) and this triage report. Close — info already captured. |
| #7 | [codex] CI + Sacred Flow Gate | ❌ dirty | 46 | Base SHA massively stale (43383b9, ~8 merges behind). 14 commits, 46 files. Much content (PROJECT_STATE.md, INSIGHTS.md, STACK_REGISTRY.md) already on main via later PRs. Typecheck/lint admitted failing. Close and reconstruct from scratch if CI gate is still needed. |

---

## Issue Classification Detail

### ACTIVE BLOCKERS (2)

| # | Title | Why it blocks |
|---|-------|---------------|
| #18 | [C3] Wire Atlas sensors through event bus | Sacred Flow has a gap: Tribunal ✅ → Atlas ❌ → Index ✅ → News ✅. Atlas data bypasses the bus entirely. Must be fixed for flow integrity. |
| #20 | [C5] Event bus persistence layer (IndexedDB) | In-memory bus loses all events on page refresh. Critical for production readiness. ReplayCursor is useless without persistence. |

### ALREADY SOLVED / DUPLICATES (4)

These are structured re-issues that duplicate existing canonical issues. Close the duplicates, keep the originals.

| # | Title | Duplicate of | Action |
|---|-------|-------------|--------|
| #29 | [@copilot] U1 — Dark Glassmorphism Map Skin | #13 | Close #29, keep #13 |
| #30 | [@copilot] U2 — Layer Toggle Panel | #14 | Close #30, keep #14 |
| #31 | [@codex] A2 — CI Performance Gate | #15 | Close #31, keep #15 |
| #32 | [@antigravity] A4 — Self-Hosted PMTiles | #17 | Close #32, keep #17 |

### PARKED FOR LATER (6)

| # | Title | Priority | Depends on | Notes |
|---|-------|----------|------------|-------|
| #13 | [U1] Dark Glassmorphism on GeopoliticsMap | P2 | — | Phase 2 UI work. Not on critical architecture path. |
| #14 | [U2] MapLibre Layer Toggle Panel | P2 | U1 (#13) | Depends on U1 completion. |
| #15 | [A2] PMTiles + MapLibre CI Performance Gate | P2 | — | Infrastructure. Valuable but not blocking. |
| #16 | [A3] Lab-Branch Validation Script | P3 | — | Governance enforcement. Low urgency. |
| #17 | [A4] Self-hosted PMTiles on Cloudflare R2 | P2 | — | Infrastructure independence. Not blocking. |
| #19 | [C4] Conflict tension heatmap layer | P2 | C3 (#18) + U1 (#13) | Requires Atlas bus wiring (C3) and visual skin (U1) first. |

---

## Recommended Merge Order (strict, max 3 in active path)

```
1. PR #59 — C6 Streams type contract (types-only, unblocks architecture)
2. PR #72 — Grand Reset branch normalization (ops-only, cleans repo state)
3. PR #65 — R3F v9 upgrade (dep upgrade, independent, clean)
```

After these 3 merge: rebase PR #51 against the new main, then review.

---

## What changed (facts)
- **Files:** `NEXUS_CONTEXT/LOGS/2026-03-19_copilot_backlog-triage.md` (this file)
- **Summary:** Classification and sequencing of 6 PRs and 12 issues. No code changes. No branches created.

## Why (alignment)
- **Sacred Flow alignment:** Merge order prioritizes C6 (Streams type contract) which extends Sacred Flow.
- **Cascade UX alignment:** N/A — audit only.
- **What was cut (anti-soup):** No code changes, no cleanup, no new PRs. Pure classification.

## Evidence (how to verify)
```bash
# Verify PR mergeable states
gh pr list --state open --json number,title,mergeable
# Verify issue counts
gh issue list --state open --json number,title | jq length
```
**Expected output:** 6-7 open PRs, 12 open issues matching this classification.

## Risks + rollback
- **Risk:** None — doc-only commit, zero code touched.
- **Rollback:** `git revert <this-commit>`

## Next 3 tasks (ranked)
1. Merge PR #59 (C6 Streams type contract)
2. Merge PR #72 (Grand Reset branch normalization)
3. Rebase PR #51 against new main after #59 and #72 are merged

## Suggestions to other pioneers (benchmark-based)
- **@claude:** Merge PR #59 now — your C6 lease, types-only. Then begin slice 2. After that, tackle C3 (#18, Atlas Sacred Flow gap).
- **@codex:** Close PR #7 — it's massively stale. If CI gate is still needed, reconstruct from scratch targeting current main.
- **@antigravity:** Merge PR #72 (your branch normalization). Then rebase PR #51 or cherry-pick the ReplayCursor changes.
- **@copilot:** After merge path clears (#59→#72→#65), park U1/U2 until C3 (Atlas flow) is resolved. Focus on visual tasks only after architecture stabilizes.

## Notes
- 4 duplicate issues found: #29/#30/#31/#32 are structured re-issues of #13/#14/#15/#17 respectively. Recommend closing the duplicates.
- PR #71 (audit) is superseded by PR #72 + this triage report. Can be safely closed.
- PR #7 should be closed entirely — its content (CI workflows, PROJECT_STATE, INSIGHTS, STACK_REGISTRY) has been superseded by later PRs.
