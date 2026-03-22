# 2026-03-17 - codex - team-protocol

## What changed
- Updated `NEXUS_CONTEXT/README_FIRST.md`
- Updated `NEXUS_CONTEXT/ROLE_CHARTER.md`
- Updated `NEXUS_CONTEXT/DECISIONS.md`
- Updated `NEXUS_CONTEXT/PROJECT_KNOWLEDGE.md`
- Updated `NEXUS_CONTEXT/WORKSPACE_KNOWLEDGE.md`
- Created `NEXUS_CONTEXT/PROJECT_STATE.md`
- Created `NEXUS_CONTEXT/STACK_REGISTRY.md`
- Created `NEXUS_CONTEXT/INSIGHTS.md`

## Why
- Align the repo with the Commit-as-Report collaboration OS.
- Make each meaningful change self-reporting and easier for every pioneer to audit.
- Add explicit lab-branch rules so experimentation does not contaminate `main`.
- Create a post-merge state upgrade path so the repo itself updates everyone’s current model.

## How to verify
- `Get-Content NEXUS_CONTEXT/README_FIRST.md`
  Expected: branch topology, commit-as-report rule, and topic-based log path are documented.
- `Get-ChildItem NEXUS_CONTEXT | Select-Object Name`
  Expected: `PROJECT_STATE.md`, `STACK_REGISTRY.md`, and `INSIGHTS.md` exist.
- `node scripts/gates/sacred-flow-gate.cjs`
  Expected: `Sacred Flow Gate PASSED.`

## Risks
- The protocol is stricter, so pioneers will need to follow the topic-based log rule consistently.
- `PROJECT_STATE.md` and `INSIGHTS.md` only become shared truth for everyone after merge to `main`.

## Rollback
- Revert this commit from `agent/codex` if the protocol wording needs to be redesigned.
- Because the change is documentation and state scaffolding only, rollback risk is low.

## Next 3 tasks
1. Merge the protocol files into `main`.
2. Ask each pioneer for the top 3 aligned ideas using the new operating rules.
3. Open a separate follow-up to address the existing `typecheck` and `lint` baseline.

## Suggestions for other pioneers
- `agent/claude`: propose one spine idea and one lab-safe architecture experiment.
- `agent/antigravity`: add templates or helper scripts that scaffold the new log and state-bump workflow.
- `agent/ui`: hold polish proposals until the spine and gate work is stable, but keep a shortlist ready.

## Potential external references
- None adopted yet.
- Any future external candidate must be logged in `NEXUS_CONTEXT/STACK_REGISTRY.md` first, then validated in a lab branch.
