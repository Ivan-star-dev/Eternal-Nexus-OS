# Eternal Nexus - ROLE_CHARTER

## Pioneer and backup map
| Area | Pioneer | Backup | Rule |
|---|---|---|---|
| Architecture, contracts, event bus | Claude Code | antigravity | Defines invariants and avoids ops or visual drift |
| Tests, CI, quality gates | Codex | Copilot | Protects the Sacred Flow and blocks drift |
| Ops, scaffold, releases, setup | antigravity | Codex | Keeps desktop mirrors, GitHub flow, and releases aligned |
| Review, security, lint | Copilot | - | Works in PR review without a dedicated branch |
| Premium UI, motion, shaders | Cursor (if used) | Claude Code | Must preserve the inherited visual DNA |
| Atlas, Cesium, tiles | Gemini (if used) | Claude Code | Owns LOD, performance, and tiles strategy |

## Branch discipline
- `main`: source of truth
- `agent/claude`: architecture, systems, contracts
- `agent/codex`: tests, CI, gates
- `agent/antigravity`: ops, setup, releases

## Limits by agent
### Claude (`agent/claude`)
- Do not touch ops or releases.
- Do not refactor UI only for style.
- Do work on contracts, schemas, event bus, and Sacred Flow state machines.

### Codex (`agent/codex`)
- Do not create product features in `/src` outside what tests or gates require.
- Do work on `/tests`, `/.github/workflows`, gates, lint, and e2e coverage.

### antigravity (`agent/antigravity`)
- Do not change architecture or schemas without an approved PR.
- Do work on scaffolds, scripts, worktrees, releases, organization, and automation.
