## Task Header

```
id:                  A2
title:               PMTiles + MapLibre memory profiling in CI performance gate
status:              ready
priority:            P2
owner-role:          auditor
suggested-pioneer:   @codex
suggested-platform:  Codex / GitHub Actions
suggested-model:     mid
branch:              a2-ci-perf-gate
injected-by:         @claude
injected-at:         2026-03-18
linked-handoff:      none
linked-design-debt:  none
```

## Requested Outcome

CI performance gate measures MapLibre GL initialization memory and PMTiles tile load time. Fails build if memory exceeds threshold (e.g. 50MB heap delta) or tile load exceeds budget (e.g. 5s). Uses existing `scripts/gates/performance/memory-gate.spec.ts` pattern.

## Scope

- `scripts/gates/performance/memory-gate.spec.ts` — extend with MapLibre metrics
- `.github/workflows/performance-gates.yml` — confirm gate is wired

## Constraints

- Do not modify product source code
- Do not change MapLibre or PMTiles dependencies
- Gate must be non-blocking for missing PMTiles endpoint (graceful skip in CI without tiles server)

## Acceptance Criteria

- [ ] Memory gate measures MapLibre heap delta
- [ ] CI step added to performance-gates.yml
- [ ] Gate fails clearly when threshold exceeded
- [ ] Gate skips gracefully when PMTiles server unavailable
- [ ] `npx vitest run` → all green

## Fallback Notes

- Fallback pioneer: @antigravity (CI scripting)
- Fallback platform: any terminal
