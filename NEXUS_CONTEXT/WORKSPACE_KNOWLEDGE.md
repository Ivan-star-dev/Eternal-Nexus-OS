# Eternal Nexus — WORKSPACE_KNOWLEDGE (como trabalhar sem confusão)

## Branches e worktrees
- `main`: `./` (repo root)
- `agent/claude`: `./_worktrees/claude`
- `agent/codex`: `./_worktrees/codex`
- `agent/antigravity`: `./_worktrees/antigravity`

## Lab branches (per pioneer)
- `lab/<agent>/01..03` — experimental, never merge to main directly
- Validate → re-implement → PR from agent branch

## PR padrão
Título: `[agent] objetivo — gate`

Corpo:
- O que mudou
- Gate que protege/atinge
- Como testar
- Riscos / rollback

## Session log
Sempre criar log em `NEXUS_CONTEXT/LOGS/YYYY-MM-DD_<agent>_<topic>.md` e linkar PR/Issue.

### Mandatory log structure
1. What changed (file paths)
2. Why (aligned to Sacred Flow + phase gate)
3. How to verify (commands + expected output)
4. Risks + rollback
5. Next 3 tasks
6. Suggestions for other pioneers
7. Optional: external references (license + adoption plan)

## Post-merge checklist
After every PR merge to `main`:
1. Append state bump to `NEXUS_CONTEXT/PROJECT_STATE.md`
2. Update `PROJECT_KNOWLEDGE.md` if phase reality changed
3. Leave handoff note in `NEXUS_CONTEXT/INSIGHTS.md`

## Releases (artefatos)
Artefatos (ZIP/PDF/posters) vão para GitHub Releases.
```
gh release download <tag> --repo Ivan-star-dev/Eternal-Nexus-OS
```
