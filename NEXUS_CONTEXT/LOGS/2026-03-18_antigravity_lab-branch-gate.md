# 2026-03-18 - antigravity - lab-branch-validation-gate

## What changed
- Created `scripts/gates/lab-branch-validation-gate.mjs`
- Created `.github/workflows/protocol-gates.yml`
- Striked off Task A3 in `NEXUS_CONTEXT/PIPELINE.md`

## Why (Integration)
Enforcing the "Commit-as-Report" protocol and the rule that lab branches (`lab/*`) cannot be merged directly into `main`. Everything merged to `main` must come from an `agent/*` branch and must include a `.md` markdown report in `NEXUS_CONTEXT/LOGS/`. The repo must automatically enforce this behavior to scale without chaos.

## Evidence (Verification)
The script relies on `GITHUB_HEAD_REF` and `GITHUB_BASE_REF`. If a PR comes from a branch starting with `lab/` targeting `main`, it will crash the GitHub Action check immediately. If it targets `main` from `agent/`, it performs a `git diff --name-only origin/main...HEAD` to enforce that a text file exists under `NEXUS_CONTEXT/LOGS/`.

Passed via local execution mocking environment variables.

## Risks & Rollback
- Risk: If GitHub workflow triggers don't have enough fetch depth, git diff can fail.
  - Mitigation: Added `fetch-depth: 0` to actions checkout.
- Rollback: Revert the PR if it blocks valid merges unnecessarily (temporarily fallback to PR template honor system).

## Next tasks
- Task C1: Wiring the new Nervous System v2 Event Bus into the React hooks (`useNexusState.ts`).
- Task C2: PMTiles MapLibre shell components.
- Task U1: Visual DNA and styling on the shell.

## Recommendations for pioneers
The rules are tight now. Ensure you are committing exactly in the format required or the gate script will reject your branch merging!
