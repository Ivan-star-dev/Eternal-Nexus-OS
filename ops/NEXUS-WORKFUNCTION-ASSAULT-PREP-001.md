# NEXUS-WORKFUNCTION-ASSAULT-PREP-001

**Data:** 2026-03-21  
**Executor:** @codex  
**Natureza:** preparação funcional / mapa de dependências / ordem de assalto  
**Fonte de verdade:** `docs/DOC_FASE3.md`, `docs/NEXUS_OS.md`, `ops/PRODUCT_LAYER_1.md`, `ops/BASTION_DISPATCH_001.md`, `ops/HANDOFF_LEDGER.md`, `ops/WORKTREE_ALIASES.md`

## WORKFUNCTION_PREP_REPORT

- **FRENTES_REAIS:**
  1. **NEWS real (PLv6.2-b)** — camada funcional pendente para desacoplar NEWS do derivado de INDEX usando fonte externa (NewsAPI), já registrada como próximo passo recorrente.
  2. **INVESTOR enriquecido (project_metrics)** — INVESTOR já está vivo com `globe_projects` + GDP, mas faltam KPIs por projeto.
  3. **Portfólio dedicado de projetos** — hoje há seção compacta na home; página dedicada com lista completa/filtros permanece fora do escopo entregue.
  4. **Integrações Layer 3 owner-gated** — dados proprietários por projeto, pipeline owner e qualquer feed sensível seguem fora por gate soberano.

- **DEPENDENCIAS_REAIS:**
  1. **Invariante de fluxo sagrado**: qualquer avanço funcional deve preservar `Tribunal → Atlas → Index → News`.
  2. **Base já pronta de Layer 1/2**: 7/7 órgãos ativos em Layer 1 e `globe_projects` ativo em Layer 2 reduzem trabalho de fundação.
  3. **Gate owner explícito** para NewsAPI key, migração/expansão Supabase e dados proprietários.
  4. **Gates fechados no dispatch** (`PLv6.2-b` e `FVL-IMPL-001`) — execução total funcional depende de abertura soberana.

- **QUICK_SALVAGES:**
  1. **Blueprint técnico de PLv6.2-b pronto antes do gate**: contrato do fetcher, schema de normalização, limites de erro e fallback sem alterar produção.
  2. **Matriz de consumo NEWS/INDEX**: mapear quem lê dados derivados de INDEX para reduzir risco de regressão ao plugar feed externo.
  3. **Checklist de validação funcional pré-gate**: lint/typecheck/test/build + smoke de hooks de órgãos para acelerar merge após abertura.
  4. **Backlog dividido por “gate-free vs gate-required”**: evita espera passiva e maximiza throughput em modo limitado.

- **ORDEM_DE_ASSALTO:**
  1. **Primeiro:** congelar mapa de impacto (NEWS, INVESTOR, NEXUS status, componentes home/atlas que consomem summary de projetos).
  2. **Depois:** preparar artefatos gate-free (spec de integração, testes de contrato, feature-flag strategy documental, plano de rollback).
  3. **Depois:** quando gate abrir, implementar PLv6.2-b (NewsAPI) com observabilidade mínima e fallback honesto.
  4. **Depois:** expandir para project_metrics e/ou página dedicada de portfólio conforme decisão owner.
  5. **Paralelo possível:** documentação operacional + testes de regressão + auditoria de dependências dos hooks podem rodar em paralelo ao preparo de integração.

- **O_QUE_DA_PARA_FAZER_JA:**
  1. Consolidar plano funcional executável (este relatório) sem alterar arquitetura.
  2. Preparar especificações de integração e critérios de aceite para PLv6.2-b.
  3. Preparar suíte de checks/scripts para execução imediata quando gate abrir.
  4. Refinar ordem de merge e plano de rollback por frente funcional.

- **O_QUE_FICA_PARA_MODO_TOTAL:**
  1. Implementação efetiva de NewsAPI no órgão NEWS (depende de gate owner/chave).
  2. Entrega de project_metrics com definição de KPIs reais pelo owner.
  3. Qualquer dado proprietário/pipeline Layer 3 (B-001).
  4. Decisão soberana de priorização entre PLv6.2-b, portfolio page e trilhas PLv7.

## Evidência objetiva

- `npm run lint`
- `npm run typecheck`

## Limitações registradas

- Não há especificação técnica fechada no repositório para schema final de `project_metrics`; permanece **não especificado** até decisão do owner.
- O gate soberano para `PLv6.2-b` está documentado como fechado; portanto, a execução total permanece intencionalmente limitada.
