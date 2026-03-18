# GitHub Copilot repository instructions

Read `AGENTS.md` first, then use `docs/` as the system of record.

## Mandatory behavior
- Keep scope narrow.
- Preserve architecture unless the task explicitly requires structural change.
- Never mix cleanup with merge/conflict resolution.
- Prefer the smallest correct implementation.
- Do not assume frameworks or tooling that are not present in the repository.
- If code and docs disagree, fix the docs in the same change.

## Required internal checklist before proposing or changing code
- What is the smallest coherent unit?
- Is there unsupported assumption?
- Is this overengineered for the task tier?
- Is there a cheaper safe route?
- What verification is required?
- What design catch-up debt did this create, if any?