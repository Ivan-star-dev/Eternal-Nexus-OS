# Eternal Nexus — WORKSPACE_KNOWLEDGE (como trabalhar sem confusão)

## Branches e worktrees
- main: ./ (repo root)
- agent/claude: ./_worktrees/claude
- agent/codex: ./_worktrees/codex
- agent/antigravity: ./_worktrees/antigravity
- lab/<agent>/01..03: experimentos isolados

## PR padrão
Título: `[agent] objetivo — gate`

Corpo:
- O que mudou
- Gate que protege/atinge
- Como testar
- Riscos / rollback

## Commit-as-report (obrigatório)
Todo commit significativo inclui um report em:
`NEXUS_CONTEXT/LOGS/YYYY-MM-DD_<agent>_<topic>.md`

Conteúdo obrigatório:
- O que mudou (paths)
- Por quê (Sacred Flow + phase gate)
- Como verificar (comandos + output)
- Riscos + rollback
- Próximos 3 passos
- Sugestões para outros pioneiros
- Referências externas opcionais (com licença)

## Pós-merge
1) Append em PROJECT_STATE.md: o que mudou + novo estado
2) Append em INSIGHTS.md: 1–3 learnings + requests cross-agent

## Session log
Sempre criar log em NEXUS_CONTEXT/LOGS/YYYY-MM-DD_<agent>_<topic>.md e linkar PR/Issue.

## Releases (artefatos)
Artefatos (ZIP/PDF/posters) vão para GitHub Releases.
Baixar via CLI: `gh release download <tag> --repo Ivan-star-dev/Eternal-Nexus-OS`
