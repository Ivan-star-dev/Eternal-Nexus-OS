# 2026-03-19 - codex - pr-template-gate

## What changed
- Updated `.github/pull_request_template.md` to replace placeholder content with a structured gate-driven PR report template.
- Added explicit sections for objective, acceptance criteria (binary PASS/FAIL), verification commands, and evidence.

## Why
- The existing template shipped with placeholder file names and did not enforce CI/quality reporting discipline.
- This improves consistency for Codex-focused CI/quality PRs and aligns PR metadata with gate verification expectations.

## Evidence (commands + output)
- `bash ./.ops/check.sh`
  - Lint step executed and returned warnings only.
  - Typecheck step failed with existing baseline TypeScript errors unrelated to this template-only change (e.g. JSX intrinsic element typings in multiple scene files).

## Risks & mitigations
- Risk: Minimal. Template wording changes may require contributors to provide more explicit evidence in PR descriptions.
- Mitigation: Placeholders and comments were kept concise and task-oriented.

## Next steps / handoff
- @codex: follow up with targeted lint/typecheck debt task to reduce baseline failures and convert gate checks to stricter pass/fail.
- @antigravity: consider automating PR template conformance checks in CI.
