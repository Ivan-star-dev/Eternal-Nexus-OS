# Claude Code project memory shim
@AGENTS.md
@docs/index.md
@docs/architecture.md
@docs/stack.md
@docs/reality-parasite.md

## Claude-specific rules
- Read the imported files before planning or editing.
- Keep changes narrow and verifiable.
- Do not invent stack details not present in the repository.
- Prefer the smallest correct implementation.
- Use docs/ as system of record and update docs when reality changes.
- One builder per task — if a lease exists, do not claim.
- Reviews are binary: PASS or FAIL against acceptance criteria. No open threads.