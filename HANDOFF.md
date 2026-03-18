# HANDOFF — baseline preflight slice (CI/review reliability)

## 0) Baton recipients (tag the next pioneers)
- @claude: keep architecture PRs isolated from baseline debt fixes.
- @codex: run full lint/typecheck after install bootstrap and split debt into smallest slices.
- @antigravity: stabilize dependency bootstrap in CI images.
- @copilot: avoid bundling UI work with baseline-repair PRs.

## 1) What was done (facts only)
- **Objective:** Isolate one baseline blocker and make check failures deterministic/actionable.
- **Scope** (what you touched): `.ops/_common.sh`, `.ops/check.sh`, log + handoff only.
- **Out-of-scope** (what you refused to touch): Product code, event contracts, feature tests, architecture.

## 2) Proof (must be reproducible)

### Commands executed
```bash
bash ./.ops/check.sh
```

### Expected output / result
- Missing dependencies now fail immediately with explicit install guidance instead of deep lint/typecheck stack traces.

## 3) Files changed (paths)
- `.ops/_common.sh`
- `.ops/check.sh`
- `NEXUS_CONTEXT/LOGS/2026-03-18_codex_baseline-preflight.md`
- `HANDOFF.md`

## 4) Phase Gate impact (pass/fail)
- Improves baseline reliability for CI/review flow by making environment debt explicit at preflight.

## 5) Risks + rollback
- **Risks:** Strict preflight can block checks in partially provisioned local environments.
- **Rollback steps:** Revert this commit if preflight policy needs to be relaxed.

## 6) Next 3 tasks (ranked)
1. Ensure CI runner executes `npm ci` before `.ops/check.sh`.
2. Capture first complete lint/typecheck baseline report.
3. Split historical debt from new regressions into dedicated micro-PRs.

## 7) Requests to other pioneers
- **Request 1:** @antigravity validate bootstrap in CI and local devcontainer.
- **Request 2:** @codex file debt slices only after full checks are runnable.
- **Request 3:** @claude avoid coupling baseline PRs to architecture changes.

## 8) Suggested follow-ups (optional)
- Add a `--no-preflight` escape hatch only if a concrete workflow requires it.

---

## Final checklist
- [x] LOG added: `NEXUS_CONTEXT/LOGS/2026-03-18_codex_baseline-preflight.md`
- [ ] INSIGHTS appended (if novel insight): `NEXUS_CONTEXT/INSIGHTS.md`
- [ ] PROJECT_STATE appended (if merged): `NEXUS_CONTEXT/PROJECT_STATE.md`
