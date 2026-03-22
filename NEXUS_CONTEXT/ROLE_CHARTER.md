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
- `main`: fonte da verdade
- `agent/claude`: arquitetura/sistemas/contratos
- `agent/codex`: testes/CI/gates
- `agent/antigravity`: ops/setup/releases

## Lab branches (isolated experiments)
Each pioneer may use up to 3 lab branches:
- `lab/<agent>/01`, `lab/<agent>/02`, `lab/<agent>/03`
- Lab branches **never merge directly to main**
- Successful experiments are re-implemented cleanly in the agent branch

## Limites por agente (o que NÃO tocar)

### Claude (agent/claude)
- NÃO: mexer em ops/releases (isso é antigravity)
- NÃO: refatorar UI só por estética (isso é Cursor/UI)
- SIM: contratos, schemas, event bus, state machine do sacred flow

### Codex (agent/codex)
- NÃO: criar features em `/src` fora do necessário para testes
- SIM: `/tests`, `/.github/workflows`, gates, lint, e2e

### antigravity (agent/antigravity)
- NÃO: mudar arquitetura/schemas sem PR aprovado
- SIM: scaffolds, scripts, worktrees, releases, organização, automação

## Commit-as-Report obligation
Every pioneer, on every meaningful commit, must create or update:
`NEXUS_CONTEXT/LOGS/YYYY-MM-DD_<agent>_<topic>.md`

The report must contain:
1. **What changed** (file paths)
2. **Why** (aligned to Sacred Flow + phase gate)
3. **How to verify** (commands + expected output)
4. **Risks** + rollback plan
5. **Next 3 tasks**
6. **Suggestions for other pioneers** (based on benchmark)
7. **Optional:** best-in-class external references (with license + adoption plan)
