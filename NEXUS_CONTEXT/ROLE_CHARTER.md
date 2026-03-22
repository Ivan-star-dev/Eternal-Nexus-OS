# Eternal Nexus - ROLE_CHARTER

## Pioneer and backup map
| Area | Pioneer | Backup | Rule |
|---|---|---|---|
| Architecture, spine, contracts, event bus | Claude Code | antigravity | Owns invariants and does not drift into ops or polish |
| Tests, CI, quality gates | Codex | Copilot | Protects Sacred Flow and blocks drift |
| Ops, scaffold, releases, setup, templates | antigravity | Codex | Keeps desktop mirrors, automation, and releases aligned |
| Review, security, lint | Copilot | - | Works in PR review without a dedicated branch |
| Premium UI, motion, shader polish | Cursor (if used) | Claude Code | Executes polish last, after the spine is proven |
| Atlas, Cesium, tiles strategy (if used) | Gemini (if used) | Claude Code | Supports map runtime and tiles work without taking over the protocol layer |

## Branch discipline
- Work only in the assigned agent branch for real work.
- Merge to `main` only via PR.
- Use `lab/<agent>/01..03` only for experiments.
- Rebuild promising lab work cleanly in the agent branch before asking for merge.

## Task ownership principle
- No pioneer claims work because they like the task.
- Ownership must follow benchmark-based triage and proven skill.
- Every task gets labels, a benchmark-fit discussion, an owner tag, and a backup tag.
- The owner tag is the triage result, not a preference vote.

## Commit-as-Report obligation
Every meaningful commit must create or update:
`NEXUS_CONTEXT/LOGS/YYYY-MM-DD_<agent>_<topic>.md`

The report must contain:
1. What changed
2. Why
3. How to verify
4. Risks and rollback
5. Next 3 tasks
6. Suggestions for other pioneers
7. Optional external references with license and adoption notes

## Limits by pioneer
### Claude (`agent/claude`)
- Owns architecture, schemas, event flow, and state machines.
- Does not own ops or release machinery.

### Codex (`agent/codex`)
- Owns tests, CI, lint, gates, and verification surfaces.
- Does not create product features in `/src` unless directly required by a test or gate.

### antigravity (`agent/antigravity`)
- Owns setup, templates, scaffolds, worktrees, release flow, and automation.
- Does not change core architecture without an approved PR.
