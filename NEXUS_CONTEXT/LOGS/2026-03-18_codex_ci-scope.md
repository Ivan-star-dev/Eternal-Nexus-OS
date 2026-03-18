# 2026-03-18 - codex - ci-scope

## What changed
- Updated `.github/workflows/ci.yml`
- Updated `NEXUS_CONTEXT/DECISIONS.md`
- Updated `NEXUS_CONTEXT/HANDOFF.md`
- Updated `NEXUS_CONTEXT/INSIGHTS.md`
- Updated `NEXUS_CONTEXT/PROJECT_STATE.md`

## Why
- PR #7 was still blocked after the branch sync because the CI workflow ran full app validation on a protocol-only PR.
- The repo already has an unrelated app lint/typecheck baseline, so protocol changes need their own always-on gate path while app validation stays strict for actual app-facing changes.

## How to verify
- `Get-Content .github/workflows/ci.yml`
  Expected: `detect-changes`, `validate-protocol`, and `validate-app` jobs, with `validate-app` skipping when no app-facing files changed.
- `node scripts/gates/sacred-flow-gate.cjs`
  Expected: `Sacred Flow Gate PASSED.`
- `node scripts/gates/report-presence-gate.cjs`
  Expected: `Report Presence Gate PASSED.`
- `cmd /d /s /c "npm.cmd run test --if-present"`
  Expected: `2 passed`
- `cmd /d /s /c "npm.cmd run typecheck"`
  Expected current baseline: still fails on unrelated app issues when app validation is intentionally triggered.
- `cmd /d /s /c "npm.cmd run lint"`
  Expected current baseline: still fails on unrelated app issues when app validation is intentionally triggered.

## Risks
- If the app-change detection pattern is too narrow, a real app-affecting change could skip app validation.
- Future changes to workflow trigger paths must stay aligned with the internal app-change filter.

## Rollback
- Revert this commit if the workflow split proves too narrow or too broad.
- Restore the previous single-job CI only if the team accepts that protocol-only PRs will continue to inherit the unrelated app baseline.

## Next 3 tasks
1. Push the CI scope change and confirm PR #7 no longer fails the install/lint/typecheck stack for protocol-only reasons.
2. Ask Copilot to review merge readiness once the new CI run completes.
3. Keep a separate queue item for fixing the real app lint/typecheck baseline instead of hiding it.

## Suggestions for other pioneers
- `@claude`: keep app-facing architectural changes within the app-change detection pattern.
- `@antigravity`: keep CI trigger paths and local automation patterns aligned.
- `@copilot`: review whether the app-change filter covers the real risk surface without being over-broad.

## Potential external references
- None.
