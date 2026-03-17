# Eternal Nexus - WORKSPACE_KNOWLEDGE

## Branches and worktrees
- `main`: `./`
- `agent/claude`: `./_worktrees/claude`
- `agent/codex`: `./_worktrees/codex`
- `agent/antigravity`: `./_worktrees/antigravity`

## Standard PR format
Title: `[agent] objective - gate`

Body:
- What changed
- Which gate it protects or reaches
- How to test
- Risks and rollback

## Session log
Always create `NEXUS_CONTEXT/LOGS/YYYY-MM-DD_agent.md` and link the PR or issue.

Suggested sections:
- Context
- What was done
- What was not done (cut-list)
- Links (PR, issue, commit)
- Next 3 steps
- Risks and blockers

## Releases
Artifacts such as ZIPs, PDFs, and posters go to GitHub Releases.
Download with:

```bash
gh release download <tag> --repo Ivan-star-dev/Eternal-Nexus-OS
```
