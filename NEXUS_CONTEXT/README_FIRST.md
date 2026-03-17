# Eternal Nexus - README_FIRST

You are inside the only official project. Nothing happens outside the repo.
Source of truth: `main` plus `NEXUS_CONTEXT/`.

Repo: `Ivan-star-dev/Eternal-Nexus-OS`

## 0) Immutable DNA
- Fixed organs: Nexus, Tribunal, Atlas, Index, News
- Sacred Flow: `Tribunal -> Atlas -> Index -> News -> Streams`
- No dashboards: every hub must be a living loop with evidence and a next action
- Cascading inheritance: every deeper level inherits the parent visual DNA
- Elite rule: one pioneer plus one backup per task

## 1) Branch topology
- `main` = source of truth
- `agent/claude` = architecture, spine, contracts
- `agent/codex` = tests, CI, gates
- `agent/antigravity` = ops, scaffold, releases, templates
- optional `agent/ui` = polish only, after the spine is bulletproof

Each pioneer may also use up to three lab branches:
- `lab/<agent>/01`
- `lab/<agent>/02`
- `lab/<agent>/03`

Lab branches are for experiments only. They never merge directly to `main`.
If a lab idea becomes real, it must be re-implemented cleanly in the agent branch with evidence and a report.

## 2) Commit-as-Report OS
Every meaningful change must ship as:
1. Code change
2. Test or evidence where possible
3. A strong report committed with it

The stable pre-merge broadcast file is:
`NEXUS_CONTEXT/HANDOFF.md`

The detailed report path is:
`NEXUS_CONTEXT/LOGS/YYYY-MM-DD_<agent>_<topic>.md`

## 3) Neural Link
Every pioneer starts by reading:
- `NEXUS_CONTEXT/README_FIRST.md`
- `NEXUS_CONTEXT/ROLE_CHARTER.md`
- `NEXUS_CONTEXT/PROJECT_KNOWLEDGE.md`
- `NEXUS_CONTEXT/PROJECT_STATE.md`
- `NEXUS_CONTEXT/AUTONOMY_MODEL.md`
- `NEXUS_CONTEXT/LEARNING_LOOP.md`
- `NEXUS_CONTEXT/MODEL_STRATEGY.md`
- `NEXUS_CONTEXT/TASK_TRIAGE.md`
- `NEXUS_CONTEXT/TASK_SEQUENCE.md`
- `NEXUS_CONTEXT/HANDOFF.md`
- `NEXUS_CONTEXT/WORKSPACE_KNOWLEDGE.md`
- `NEXUS_CONTEXT/STACK_REGISTRY.md`
- `NEXUS_CONTEXT/DEBATE_PROMPT_OPEN_SOURCE.md`
- `NEXUS_CONTEXT/SECURITY_MODEL.md`
- `NEXUS_CONTEXT/FOUNDER_PROFILE.template.md`
- `NEXUS_CONTEXT/VISUAL_DNA.md`

## 4) Session protocol
At the start of the session:
1. Read the Neural Link files.
2. Confirm the role and current branch.
3. Read `AUTONOMY_MODEL.md` and `LEARNING_LOOP.md` so each session stays inside the closed loop.
4. Read `TASK_TRIAGE.md` and `TASK_SEQUENCE.md`.
5. If it exists locally, use `NEXUS_CONTEXT/_private/FOUNDER_PROFILE.md` to adapt tone and tradeoffs without leaking it into public-safe files.
6. Take only the first unblocked task that was assigned to your tag through triage.
7. When the queue does not already define the next step, propose aligned ideas with effort size and proof plan, then triage them before assigning ownership.
8. For stack debates, use benchmark tags such as `@claude`, `@codex`, `@antigravity`, `@copilot`, and `@ui` to score fit, not to self-claim by preference.
9. Implement only one idea unless a broader scope is explicitly requested.

At the end of the session:
1. Commit code plus evidence plus report.
2. Update `NEXUS_CONTEXT/HANDOFF.md` so other pioneers can fetch one stable entrypoint before merge.
3. If founder preferences became clearer, update the private founder profile without committing sensitive data.
4. Open or update a PR to `main`.
5. If the work is merged later, append the state bump and handoff notes.

## 5) Design order
Design polish is always considered, but it is executed last.
The order is:
1. spine and contracts
2. gates and evidence
3. ops and automation
4. polish and motion
