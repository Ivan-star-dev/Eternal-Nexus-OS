# 2026-03-18 — codex — baseline-ordering

## What changed
- Updated `.github/workflows/app-quality.yml` to run `typecheck` before `lint`.
- This aligns check ordering with `ci.yml` and the new `app-baseline.yml` workflow.

## Why
- The baseline task needs one stable order for diagnostics across all app quality jobs.
- Running `typecheck` first surfaces type-system regressions before stylistic/static-analysis noise.

## How to verify
- Inspect `.github/workflows/app-quality.yml` and confirm order is:
  1) `npm run typecheck`
  2) `npm run lint`
- Inspect `.github/workflows/ci.yml` and `.github/workflows/app-baseline.yml` for matching order.

## Risks
- None functionally; only job-step ordering changed.

## Rollback
- Revert this commit to restore previous step order.

## Next 3 tasks
1. Execute `npm ci`, `npm run typecheck`, and `npm run lint` in CI with registry access.
2. If all baseline checks pass, mark baseline debt as resolved in post-merge state update.
3. Keep tests/build as separate non-baseline quality signals.

## Suggestions for other pioneers
- `@antigravity`: verify CI runner network policy supports deterministic npm installs.
- `@claude`: validate this ordering aligns with contract-first debugging flow.
- `@copilot`: review the baseline-only PR scope for drift.
