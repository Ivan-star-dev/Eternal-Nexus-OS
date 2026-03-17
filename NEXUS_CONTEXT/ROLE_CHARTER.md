# Eternal Nexus — ROLE_CHARTER (pioneiro/backup + limites)

## Papéis (benchmark-only)
| Área | Pioneiro | Backup | Regra |
|---|---|---|---|
| Arquitetura / contratos / event-bus | Claude Code (Anthropic) | antigravity | define invariantes; não mexe em ops/estética |
| Tests / CI / Quality Gates | Codex | Copilot | protege sacred flow; impede drift |
| Ops / scaffold / releases / setup | antigravity | Codex | mantém espelho desktop↔GitHub e releases |
| Review / segurança / lint | Copilot | — | atua em PR; sem branch dedicada |
| UI premium / motion / shaders | Cursor (se usar) | Claude Code | Apple-feel; herança visual obrigatória |
| Atlas/Cesium/tiles (se usar) | Gemini (se usar) | Claude Code | LOD, performance, tiles strategy |

## Branch discipline (long-lived)
- main: fonte da verdade
- agent/claude: arquitetura/sistemas/contratos
- agent/codex: testes/CI/gates
- agent/antigravity: ops/setup/releases
- lab/<agent>/01..03: experimentos isolados (nunca merge direto para main)

## Limites por agente (o que NÃO tocar)

### Claude (agent/claude)
- NÃO: mexer em ops/releases (isso é antigravity)
- NÃO: refatorar UI só por estética (isso é Cursor/UI)
- NÃO: mexer em CI/workflows/tests (isso é Codex)
- SIM: contratos, schemas, event bus, state machine do sacred flow
- SIM: docs técnicas em docs/architecture
- SIM: atualizar NEXUS_CONTEXT (se necessário, sem mudar DNA)

### Codex (agent/codex)
- NÃO: criar features em /src fora do necessário para testes
- SIM: /tests, /.github/workflows, gates, lint, e2e

### antigravity (agent/antigravity)
- NÃO: mudar arquitetura/schemas sem PR aprovado
- SIM: scaffolds, scripts, worktrees, releases, organização, automação
