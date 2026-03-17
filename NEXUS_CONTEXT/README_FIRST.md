# Eternal Nexus - README_FIRST

You are inside the only official project. Nothing happens "outside".
Source of truth: the GitHub repo plus the canonical `NEXUS_CONTEXT/` folder.

Repo: `Ivan-star-dev/Eternal-Nexus-OS`

## 0) Immutable DNA
- Fixed organs: Nexus (core), Tribunal (decision), Atlas (perception), Index (memory), News (voice)
- Sacred Flow: `Tribunal -> Atlas -> Index -> News -> Streams`
- No dashboards: every hub must show a live loop, evidence, and a next action
- Cascading inheritance: every click goes deeper and inherits the parent visual DNA
- Elite rule: one pioneer plus one backup per task; if it does not fit, it becomes an issue

## 1) Operating rule: 1 main + 3 branches
- `main` = source of truth
- `agent/claude` = architecture, contracts, event bus
- `agent/codex` = tests, CI, quality gates
- `agent/antigravity` = ops, scaffold, releases, setup

Merge to `main` only through pull requests.

## 2) Desktop workspaces
Expected worktree layout:
- `./` = `main`
- `./_worktrees/claude`
- `./_worktrees/codex`
- `./_worktrees/antigravity`

If the worktrees do not exist, create them before continuing.

## 3) Neural Link
Every platform or pioneer starts by reading:
- `NEXUS_CONTEXT/README_FIRST.md`
- `NEXUS_CONTEXT/ROLE_CHARTER.md`
- `NEXUS_CONTEXT/DECISIONS.md`
- `NEXUS_CONTEXT/PROJECT_KNOWLEDGE.md`
- `NEXUS_CONTEXT/WORKSPACE_KNOWLEDGE.md`
- `NEXUS_CONTEXT/VISUAL_DNA.md`

The repo carries the memory. No ad hoc uploads.

## 4) Session protocol
Start of session:
1. Read `README_FIRST.md`.
2. Confirm the role in `ROLE_CHARTER.md` and the current branch.
3. Open an issue or checklist with a clear gate.

End of session:
1. Write a log in `NEXUS_CONTEXT/LOGS/YYYY-MM-DD_agent.md`.
2. Update `DECISIONS.md` if a rule or architecture changed. Keep it append-only.
3. Open a PR to `main` with the standard format: `[agent] objective - gate`.

## 5) Releases
Artifacts such as ZIPs, PDFs, and posters live in GitHub Releases.
Default download:

```bash
gh release download <tag> --repo Ivan-star-dev/Eternal-Nexus-OS
```
