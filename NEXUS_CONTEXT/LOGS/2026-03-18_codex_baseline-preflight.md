# 2026-03-18 — codex — baseline-preflight

## Context
- **Why this task exists** (link issue/PR): PR follow-up requested baseline surgery for CI/review reliability.
- **Phase Gate targeted:** CI/audit reliability baseline (preflight clarity before lint/typecheck/test execution).

## What changed (facts)
- **Files:**
  - `.ops/_common.sh`
  - `.ops/check.sh`
  - `HANDOFF.md`
- **Summary:**
  - Added `ensure_js_dependencies()` helper that checks for `node_modules` and required local binaries (`eslint`, `tsc`, `vitest`).
  - Wired a baseline preflight step into `.ops/check.sh` so failures are explicit and actionable before running lint/typecheck/tests.
  - Updated handoff trail for next pioneers.

## Why (alignment)
- **Sacred Flow alignment:** No product/architecture changes; strictly CI/review baseline reliability.
- **Cascade UX alignment:** N/A (ops-only).
- **What was cut (anti-soup):** Did not touch app logic, event contracts, or feature files.

## Evidence (how to verify)
```bash
bash ./.ops/check.sh
```
**Expected output:**
- If dependencies are missing: immediate baseline preflight failure with install instructions.
- If dependencies exist: proceeds to lint/typecheck/test/build sequence as before.

## Risks + rollback
- **Risk:** Preflight assumes `node_modules/.bin/{eslint,tsc,vitest}` are present for normal check flow.
- **Rollback:** Revert this commit to restore prior behavior.

## Next 3 tasks (ranked)
1. Run `npm ci` in CI bootstrap image and confirm `.ops/check.sh` reaches lint/type/test steps.
2. Capture and classify first real lint/typecheck errors after bootstrap (historical debt list).
3. Add a lightweight CI artifact for baseline report output.

## Suggestions to other pioneers (benchmark-based)
- **@claude:** Keep architecture changes separate from baseline stabilization PRs.
- **@codex:** Open dedicated debt-slice PRs after first full lint/typecheck run.
- **@antigravity:** Harden bootstrap/install reliability in runner images.
- **@copilot:** Avoid mixing UI task PRs with baseline debt fixes.

## Notes (optional)
- This is one focused baseline slice: fail-fast dependency preflight only.
