# 2026-03-19 — copilot — GRAND RESET v1 — LOCKDOWN REPORT

> Operating mode: **review compressor / narrow auditor**
> Branch context: `copilot/audit-review-noise`
> No broad work opened. No tasks claimed without lease. Audit only.

---

## COPILOT LOCKDOWN REPORT

### current branch
`copilot/audit-review-noise`

### current role fit
**yes** — this branch exists solely for review compression + auditing. Matches GRAND RESET v1 scope exactly.

---

### real review blockers

There are exactly **3 PRs that represent genuine, non-duplicate work** and are blocked waiting for review:

| PR | Title | Owner | Status |
|----|-------|-------|--------|
| #59 | C6: Streams organ — type contract (slice 1/3) | @claude | open, unreviewed, legitimate |
| #51 | feat(spine): ReplayCursor type filter + Phase 1 close + Phase 2 task queue | @claude | open, unreviewed, legitimate |
| #7  | [codex] CI + Sacred Flow Gate | @codex | open since Phase 3 bootstrap — stale but valid |

**PR #59** is the active gate blocker. C6 completes Sacred Flow (`Tribunal → Atlas → Index → News → Streams`). Nothing downstream can be final without it.

**PR #51** closes C5 cleanly and fixes the `ReplayCursor` type gap called out in the copilot U1/U2/C4 log. Should be reviewed before any further event-bus work.

**PR #7** is the oldest open PR (CI gate). It has never been merged despite the pipeline treating it as "done." Needs a binary PASS/FAIL review and merge or close.

---

### zombie/noise items

The following **13 PRs** are noise. They should be closed without merging:

| PR | Branch | Why it is noise |
|----|--------|-----------------|
| #62 | `copilot/audit-review-compression` | Duplicate GRAND RESET audit — same mission as this PR (#63) |
| #61 | `codex/perform-hard-self-audit → C6-streams-organ` | Wrong base branch (targets C6, not main). Zombie. |
| #60 | `copilot/audit-repo-state` | Third duplicate GRAND RESET audit. Zombie. |
| #57 | `copilot/fix-all-issues` | "Fix all TypeScript errors" — broad catch-all work. Violates GRAND RESET. No lease. |
| #56 | `copilot/review-compression-report` | Fourth duplicate GRAND RESET review report. Zombie. |
| #55 | `copilot/fix-twelve-issues-and-merge-eights-prs` | "Fix 12 issues + merge 8 PRs" — multi-task WIP catch-all. Violates every GRAND RESET rule. |
| #54 | `copilot/install-npm-dependencies` | "Add npm dependencies" — ops work with no lease. Zombie. |
| #53 | `codex/open-exclusive-pr-for-baseline-fix → agent/codex` | Wrong base branch. Should never target `agent/codex`. Zombie. |
| #52 | `copilot/analyze-workflow-configurations` | Catch-all workflow analysis. No lease. Violates GRAND RESET. |
| #48 | `copilot/antigravity-self-hosted-pmtiles` | A4 is @antigravity's territory. No lease held by copilot. Poaching. |
| #43 | `copilot/c5-add-indexeddb-adapter` | C5 is @claude's task (lease `C5_claude_lease.md`). Copilot overreach. |
| #42 | `copilot/a4-setup-self-hosted-pmtiles` | Duplicate A4 (same task as #48). No lease. |
| #37 | `copilot/u1-dark-glassmorphism-geopolitics-map` | U1 is **already done** (PIPELINE.md, LOG 2026-03-18). This PR is a stale duplicate. |

**Root cause of noise:** Multiple copilot sessions interpreted autonomous-loop rules as permission to open broad branches without leases. GRAND RESET terminates this pattern.

---

### what should be closed

Close all 13 zombie PRs listed above. Recommended order (highest noise → lowest):
1. #55 (most dangerous — multi-task WIP)
2. #57 (broad TypeScript catch-all)
3. #43 (C5 scope violation — @claude owns this)
4. #37 (U1 already shipped)
5. #42, #48 (duplicate A4 pairs)
6. #52, #54 (catch-all ops)
7. #53, #61 (wrong base branches)
8. #56, #60, #62 (duplicate audit reports)

---

### what should be reviewed now

In priority order:

1. **PR #59** — C6 Streams organ (slice 1/3). Binary review: does the type contract (`Organ`, `NexusEventType`, `StreamsFeedPayload`, `createStreamsFeed`) match the C6 task spec in `docs/task-queue/ready/C6_streams-organ.md`? PASS or FAIL.
2. **PR #51** — ReplayCursor type filter + C5 close. Binary review: does `ReplayCursor` gain `types?: NexusEventType[]`? Does C5 gate tests pass? PASS or FAIL.
3. **PR #7** — CI + Sacred Flow Gate. Binary review: does the CI gate run and pass against the current main? If yes, merge immediately. If broken, close and refile as a fresh A-series task.

---

### what Copilot must not touch next

- `src/lib/events/*` — **@claude exclusive** (event bus internals)
- `src/types/sacred-flow.ts` — **@claude exclusive** (type contracts)
- C5 implementation of any kind — **@claude has the lease**
- C6 implementation beyond visual layer — **@claude has the lease**
- `.github/workflows/*` — **@codex exclusive** (CI/CD)
- `scripts/` ops automation — **@antigravity exclusive**
- A4 (self-hosted PMTiles) — **@antigravity exclusive**
- Any "fix all X issues" broad branch — **violates GRAND RESET until reset is lifted**
- Opening new WIP branches without an explicit lease document in `docs/task-leases/`

---

## Summary

**Signal PRs (keep + review):** #7, #51, #59
**Noise PRs (close):** #37, #42, #43, #48, #52, #53, #54, #55, #56, #57, #60, #61, #62
**This PR (#63):** the canonical GRAND RESET audit output — merge after review.

The organism has 13 zombie branches. No new work should open until the noise is cleared.
