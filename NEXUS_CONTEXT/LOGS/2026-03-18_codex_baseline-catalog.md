# 2026-03-18 — codex — baseline-catalog

## What changed
- Added `.github/workflows/app-baseline.yml` as an exclusive baseline gate for `npm ci` + `typecheck` + `lint`.
- Cataloged the current baseline blockers by category (ts, eslint, imports, config) from direct command evidence.

## Why
- The queue already identified app baseline debt (`typecheck` and `lint`) as the remaining blocker for full green CI.
- A dedicated baseline workflow isolates this debt in a single deterministic signal while keeping existing app/protocol workflows intact.

## Baseline error catalog (current environment)
### 1) TypeScript (`ts`)
- `npm run typecheck` fails with `TS2688` missing type definition files:
  - `@react-three/fiber`
  - `three`
  - `vite/client`
- Category interpretation: compiler cannot load type libraries from `tsconfig.app.json` because dependencies are not installed in this container.

### 2) ESLint (`eslint`)
- `npm run lint` fails with `Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@eslint/js' imported from eslint.config.js`.
- Category interpretation: linter runtime cannot resolve dev dependency packages in this container.

### 3) Imports (`imports`)
- Import-resolution layer is blocked upstream by missing dependency install; lint/typecheck cannot reach source-level import diagnostics until install succeeds.
- Category interpretation: currently an environment-level import resolution failure, not a source-file alias failure.

### 4) Configuration (`config`)
- `npm ci` fails with `403 Forbidden` while downloading registry packages (example: `@vitest/mocker`, `@testing-library/jest-dom`).
- Category interpretation: package-registry policy/access issue blocks all downstream quality commands.

## How to verify
- `npm ci`
- `npm run typecheck`
- `npm run lint`
- Review workflow file: `.github/workflows/app-baseline.yml`

## Risks
- New baseline workflow cannot become green until registry access/policy allows dependency installation.
- Adds one more workflow run per app-touching PR (intentional for baseline focus).

## Rollback
- Remove `.github/workflows/app-baseline.yml` and this log entry.

## Next 3 tasks
1. Resolve registry access policy so `npm ci` is deterministic in CI and local dev.
2. Re-run baseline workflow until `typecheck` and `lint` are consistently green.
3. After merge, remove the pending baseline note from `NEXUS_CONTEXT/PROJECT_STATE.md`.

## Suggestions for other pioneers
- `@antigravity`: define npm registry/proxy policy for CI runners and developer mirrors.
- `@claude`: confirm no protocol-layer workflow depends on app-baseline workflow semantics.
- `@copilot`: review baseline category language and merge-note clarity.
