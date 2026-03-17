# Eternal Nexus â€” WORKSPACE_KNOWLEDGE (como trabalhar sem confusÃ£o)

## Branches e worktrees
- main: ./ (repo root)
- agent/claude: ./_worktrees/claude
- agent/codex: ./_worktrees/codex
- agent/antigravity: ./_worktrees/antigravity

## PR padrÃ£o
TÃ­tulo: [agent] objetivo â€” gate
Corpo:
- O que mudou
- Gate que protege/atinge
- Como testar
- Riscos / rollback

## Session log
Sempre criar log em NEXUS_CONTEXT/LOGS/YYYY-MM-DD_agent.md e linkar PR/Issue.

## Releases (artefatos)
Artefatos (ZIP/PDF/posters) vÃ£o para GitHub Releases.
Baixar via CLI: gh release download <tag> --repo Ivan-star-dev/Eternal-Nexus-OS
"@

 = @"
# Eternal Nexus â€” VISUAL_DNA (heranÃ§a em cascata)

## Regra central
Cada hub herda: **DNA da mÃ£e (Nexus)** + **DNA da aba** + **intensificaÃ§Ã£o contextual**.
Nunca inventar um estilo novo no fundo do stack.

## ProibiÃ§Ãµes (sem exceÃ§Ãµes)
- Misturar famÃ­lias (propÃ³sitos diferentes) na mesma tela/poster
- Dashboards estÃ¡ticos e â€œcards aleatÃ³riosâ€
- Clutter e widgets â€œdev leftoversâ€
- Neon soup / over-bloom global

## TransiÃ§Ãµes permitidas (apenas 3)
1) Push-in (portal/zoom) â€” entrar num subhub
2) Pull-out â€” subir um nÃ­vel
3) Lateral glide â€” mudar de modo no mesmo nÃ­vel

## Breadcrumbs
Sempre mostrar caminho (folder feeling): NEXUS / <ABA> / ... / <HUB>
"@

 = @"
# LOGS (como registrar sessÃµes)

Cada sessÃ£o de qualquer pioneiro termina com um log em Markdown:

YYYY-MM-DD_<agent>.md

Estrutura sugerida:
- Contexto (o que foi pedido)
- O que foi feito
- O que NÃƒO foi feito (cut-list)
- Links (PR/Issue/commit)
- PrÃ³ximos 3 passos
- Riscos/Blockers
