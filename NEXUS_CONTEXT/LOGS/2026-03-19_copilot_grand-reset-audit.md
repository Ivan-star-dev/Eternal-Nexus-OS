# COPILOT REVIEW REPORT
**Date:** 2026-03-19  
**Pioneer:** @copilot  
**Mode:** GRAND RESET v1 — review compressor + narrow auditor  
**Scope:** Issues, PRs, task-queue vs PIPELINE.md drift, lease collisions

---

## REAL BLOCKERS

### B1 — PR #51 has merge conflicts (DIRTY)
**PR:** `fix/replay-cursor-types-and-C5-close` → `main`  
**Why it blocks:** Contains Phase 1 close (C4b, C5, U1, U2 → done), ReplayCursor type filter upgrade, and `nexus-flow.test.tsx` fix. 58 files changed, 1578 additions. `mergeable_state: dirty`. Cannot merge until @claude resolves conflicts. All Phase 1 task-queue/done movement is blocked behind this PR.

### B2 — task-queue/done is EMPTY but PIPELINE.md marks 7 tasks done
**Files:** `docs/task-queue/ready/` still contains `C4b_conflict-tension-heatmap.md`, `U1_dark-glassmorphism-map.md`, `U2_layer-toggle-panel.md`  
**Why it blocks:** Any pioneer scanning `task-queue/ready/` will incorrectly claim U1, U2, C4b as available. Routing breaks. This drift will persist until PR #51 merges (it moves these to `done/`).

### B3 — PR #7 is ancient, dirty, and ambiguous
**PR:** `agent/codex` → `main` (created 2026-03-17, `mergeable_state: dirty`)  
**Why it blocks:** 46 files changed. Partially superseded by later CI work (PR #53 targets `agent/codex`). Neither closed nor progressed. Occupies the canonical `agent/codex` branch. @codex cannot move cleanly while this sits open.

### B4 — 1 failing gate test in current suite
**Evidence from PR #61 codex audit:** `nervous-system.test.ts` → "Atlas markers are deterministic and idempotent" failing. Gate requirement is 70/70 passing. This is a real regression, not noise.

---

## ZOMBIE / NOISE ITEMS

### Zombie Issues (tasks already completed per PIPELINE.md)

| Issue | Title | Why Zombie |
|-------|-------|-----------|
| #13 | [U1] Dark Glassmorphism on GeopoliticsMap | U1 DONE in PIPELINE.md |
| #14 | [U2] MapLibre Layer Toggle Panel | U2 DONE in PIPELINE.md |
| #16 | [A3] Lab-Branch Validation Script | A3 DONE in PIPELINE.md |
| #18 | [C3] Wire Atlas sensors through event bus | C3 DONE in PIPELINE.md |
| #19 | [C4] Conflict tension heatmap layer | C4b DONE in PIPELINE.md |
| #29 | [@copilot] U1 — Dark Glassmorphism Map Skin | Duplicate of #13, U1 DONE |
| #30 | [@copilot] U2 — Layer Toggle Panel | Duplicate of #14, U2 DONE |

### Duplicate Issues (live task, duplicate tracking)

| Issue | Duplicate Of | Live Canonical Issue |
|-------|-------------|---------------------|
| #15 | A2 CI Perf Gate (same as #31) | Keep #31, close #15 |
| #17 | A4 Self-hosted PMTiles (same as #32) | Keep #32, close #17 |

### Noise PRs (catch-all / no lease / violate GRAND RESET rules)

| PR | Title | Why Noise |
|----|-------|-----------|
| #55 | Fix twelve issues and merge eight pull requests | Textbook catch-all. Forbidden by GRAND RESET v1 rules. 1 commit, no actual changes. |
| #60 | GRAND RESET v1: hard audit + protocol cleanup — Ops/Scaffold | Catch-all audit PR. Copilot violated GRAND RESET own rules by opening broad cleanup PR. |
| #57 | fix all open TypeScript errors — type safety hardening | Catch-all, no lease, broad scope. |
| #56 | GRAND RESET v1 — review compression report + binary decisions | Duplicate of PR #62 (this task). Superseded. |
| #52 | Analyze and fix workflow configurations for conflict merge | Broad workflow catch-all, no lease. |

### Zombie PRs (work already shipped / task already done)

| PR | Title | Why Zombie |
|----|-------|-----------|
| #37 | [U1] Apply dark glassmorphism style to GeopoliticsMap | U1 is DONE. This PR is stale work. |
| #43 | [C5] Fix event bus persistence layer with IndexedDB | C5 leased to @claude. Work partially in PR #51. No lease on this Copilot attempt. |
| #48 | [A4] Replace external tile CDN with self-hosted PMTiles | A4 duplicate of #42. Neither has a lease. Double-open on same task. |
| #42 | [A4] Set up self-hosted PMTiles on Cloudflare R2 | A4 duplicate of #48. Neither has a lease. |

---

## WHAT SHOULD BE CLOSED

### Issues to close (with reason)
- **#13** — U1 done. Close with comment "Completed: see PIPELINE.md + PR #34."
- **#14** — U2 done. Close with comment "Completed: see PIPELINE.md + PR #34."
- **#15** — Duplicate A2. Close in favor of #31.
- **#16** — A3 done. Close with comment "Completed: antigravity shipped on main."
- **#17** — Duplicate A4. Close in favor of #32.
- **#18** — C3 done. Close with comment "Completed: see PIPELINE.md + PR #8."
- **#19** — C4b done. Close with comment "Completed: see PIPELINE.md + PR #34."
- **#29** — Duplicate U1 issue. Close.
- **#30** — Duplicate U2 issue. Close.

### PRs to close (with reason)
- **#55** — Catch-all. Forbidden pattern. Close immediately.
- **#60** — Catch-all audit. Violates GRAND RESET rules. Close.
- **#57** — Catch-all TypeScript fix, no lease. Close.
- **#56** — Duplicate audit PR. Superseded by #62. Close.
- **#52** — Workflow catch-all, no lease. Close.
- **#37** — Zombie U1 PR. U1 is done. Close.
- **#43** — No lease, C5 owned by @claude. Close.
- **#48** — No lease, A4 duplicate. Close.
- **#42** — No lease, A4 duplicate. Close.

---

## WHAT SHOULD BE REVIEWED NOW

Priority order, descending:

### 1. PR #59 — C6: Streams organ type contract (slice 1/3) 🔴 HIGH
**Branch:** `C6-streams-organ` → `main`  
**Why now:** Focused types-only change. 338 additions, 17 deletions, 14 files. Adds `'streams'` to `Organ`, `'streams.feed'` to `NexusEventType`, `StreamsFeedPayload`. Non-breaking, backward-compatible. Claimed by @claude (C6 lease active). `mergeable_state: unstable` (CI running). Verify gate tests pass, then merge.

### 2. PR #51 — feat(spine): ReplayCursor + Phase 1 close 🟡 AFTER CONFLICT RESOLUTION
**Branch:** `fix/replay-cursor-types-and-C5-close` → `main`  
**Why blocked:** `mergeable_state: dirty`. @claude must resolve conflicts first.  
**Why important:** Closes Phase 1 officially, moves C4b/C5/U1/U2 to done, adds type-filtered replay. Once unblocked, review immediately.

### 3. PR #61 — codex hard operational self-audit 🟡 WRONG BASE BRANCH
**Branch:** `codex/perform-hard-self-audit` → `C6-streams-organ` (WRONG — should target `main`)  
**Why it matters:** Contains evidence of 1 failing gate test. Log-only change, 1 file.  
**Action needed:** Retarget base branch to `main` before review.

### 4. PR #53 — baseline-fix: CI workflow normalization 🟢 LOW RISK
**Branch:** `codex/open-exclusive-pr-for-baseline-fix` → `agent/codex`  
**Note:** Targets `agent/codex` not `main`. This is intentional (@codex branch). Workflow-only change, 5 files. Review in context of PR #7 resolution.

---

## WHAT COPILOT MUST NOT TOUCH

| Area | Reason |
|------|--------|
| `src/lib/events/` | @claude owns the event bus spine. Exclusive scope. |
| `src/types/sacred-flow.ts` | @claude contract territory. Active C6 lease. |
| `src/hooks/useNexusState.ts` | Bridge layer. @claude owns. |
| `src/hooks/useNexusEvents.ts` | @claude owns. |
| `.github/workflows/` | @codex territory. Do not modify CI. |
| `.ops/` scripts | @antigravity territory. |
| `scripts/gates/` | @codex territory. |
| C5 event bus persistence | @claude has the lease (expired but work in PR #51). |
| C6 Streams organ | @claude active claim. PR #59 in review. |
| PR #51 conflicts | @claude must resolve own branch's conflicts. |
| PR #7 resolution | @codex must own their CI branch. |
| A4 self-hosted PMTiles | @antigravity owns. No lease = do not touch. |

---

## EVIDENCE COMMANDS

```bash
# Verify task-queue state
ls docs/task-queue/ready/ docs/task-queue/in-progress/ docs/task-queue/done/

# Check lease state
cat docs/task-leases/C5_claude_lease.md
cat docs/task-leases/C6_claude_lease.md

# Verify gate tests
npx vitest run src/test/nervous-system.test.ts

# Verify PIPELINE.md vs task-queue drift
grep -E "✅ DONE|DONE" NEXUS_CONTEXT/PIPELINE.md
```

---

## SUMMARY

- **16 open PRs** — 9 should be closed (noise/zombie/catch-all), 4 need action, 3 are current work
- **12 open issues** — 9 are zombie/duplicate (should close), 3 are live: #20 (C5), #31 (A2), #32 (A4)
- **Task-queue/done is empty** — catastrophic drift. Will self-resolve when PR #51 merges.
- **1 failing gate test** — "Atlas markers are deterministic and idempotent" — needs @claude fix before Phase 2 can proceed
- **Copilot's only open action:** deliver this report, close nothing unilaterally (no lease = no action)
