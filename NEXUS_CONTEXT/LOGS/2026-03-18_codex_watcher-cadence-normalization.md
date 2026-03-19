# 2026-03-18 — codex — watcher-cadence-normalization

## What changed (paths)
- Normalized local watcher runtime cadence back to 5 minutes in `scripts/ops/pipeline-watcher.mjs`.
- Normalized workspace protocol doc cadence to 5 minutes in `NEXUS_CONTEXT/WORKSPACE_KNOWLEDGE.md`.
- Appended canonical team decision for watcher cadence normalization in `NEXUS_CONTEXT/DECISIONS.md`.
- Appended state bump entry documenting cadence normalization in `NEXUS_CONTEXT/PROJECT_STATE.md`.
- Updated stable handoff entrypoint in `NEXUS_CONTEXT/HANDOFF.md`.

## Why (alignment)
- User request required identifying watcher-cadence references, choosing one official cadence, and reconciling divergent docs/scripts in one PR.
- Existing decision + state artifacts already established 5-minute cadence; runtime script and workspace doc had drifted to 2-minute text.
- This change restores contract-first consistency between decision memory, operational docs, and executable script.

## Evidence (commands + output)
- `rg -n "watcher|2-minute|5-minute|2 minutes|5 minutes|2 min|5 min|2min|5min" NEXUS_CONTEXT scripts package.json README.md docs .github -S`
  - Found watcher-cadence references across operational files and historical logs; divergence was in runtime/doc pair (`pipeline-watcher.mjs` + `WORKSPACE_KNOWLEDGE.md`) against decision/state docs.
- `rg -n "local (2|5)-minute task watcher|every [25] minutes|WATCH_INTERVAL" scripts/ops/pipeline-watcher.mjs NEXUS_CONTEXT/WORKSPACE_KNOWLEDGE.md NEXUS_CONTEXT/DECISIONS.md NEXUS_CONTEXT/PROJECT_STATE.md -S`
  - Confirmed runtime + active docs now show 5-minute cadence.
- `timeout 4s npm run watch:pipeline >/tmp/watch.log 2>&1; ...`
  - Heartbeat output confirms: `Will poll the Neural Link every 5 minutes.`

## Risks + rollback
- Risk: historical logs still include 2-minute experiment wording and could be misread as current policy.
- Mitigation: retained logs as immutable history and made canonical decision/state entries explicit.
- Rollback: revert this commit to restore prior 2-minute runtime/doc wording.

## Next 3 tasks
1. Add a lightweight CI assertion that watcher script heartbeat text matches the configured interval constant.
2. Add a short “canonical vs historical” note in ops docs to avoid confusion with experiment logs.
3. Audit remaining operational automations for similar cadence/config drift.

## Suggestions to other pioneers
- `@antigravity`: mirror this cadence canonicalization in workstation schedulers so local OS tasks stay aligned.
- `@claude`: keep operational cadence decisions centralized in `DECISIONS.md` whenever local automation contracts change.
- `@copilot`: add PR review checklist item for runtime-message vs doc consistency in automation scripts.
