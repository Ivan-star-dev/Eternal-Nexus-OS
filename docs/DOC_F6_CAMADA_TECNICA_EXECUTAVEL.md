---
title: "F6 Technical Layer"
slug: doc-f6-camada-tecnica
date: 2026-03-20
category: architecture
excerpt: "Executable technical layer of the thick shell — Phase 3."
---

# DOC_F6 — Camada Técnica Executável da Casca Grossa (Fase 3)

**Pilar:** Funcionalidade  
**Classe:** funcionalidade, comportamento, lógica, integração, fluxo real, dados, motor operacional, feature real  
**Fase:** Fase 3 — Governança e Auditabilidade  
**Branch canônico:** `claude/expose-workspace-config-yt4Km`  
**Data:** 2026-03-20

> Documento técnico mínimo para operacionalizar a casca grossa soberana (`docs/NEXUS_OS.md`) sem reescrever o soberano e sem avançar para Fase 4.

---

## 1) Leitura técnica soberana (impacto em execução real)

Baseado em `docs/NEXUS_OS.md`, `docs/DOC_FASE3.md` e `docs/DOC_TRIBUNAL_E4.md`:

1. **Execução é protocolada, não ad-hoc**  
   Toda ação técnica deve respeitar: fase ativa (Fase 3), leis fundamentais e handoff obrigatório.

2. **Escopo técnico ativo de Fase 3 é governança + auditabilidade**  
   A camada executável nesta task não cria feature nova; ela estrutura trilhas para hardening técnico verificável.

3. **Fluxo sagrado é invariável operacional**  
   Nenhuma trilha técnica pode quebrar ou renomear `Tribunal → Atlas → Index → News`.

4. **Arquivos protegidos exigem travas explícitas**  
   `vite.config.ts`, `src/types/index.ts`, `data/projects.ts`, `tailwind.config.ts` ficam fora de intervenção automática, salvo instrução explícita e/ou owner.

5. **Tribunal é gate de entrada no core**  
   Ações com risco estrutural, impacto transversal ou arquivo protegido sobem para julgamento antes de merge.

---

## 2) Mapa técnico executável mínimo (v1)

## 2.1 Trilhas prioritárias (sem execução nesta task)

### Trilha T1 — Lint hardening seguro
**Objetivo:** reduzir ruído de lint com risco baixo e rastreável.  
**Escopo inicial permitido:**
- correções mecânicas seguras em arquivos de app não protegidos
- remoção de imports não usados
- ajustes de ordem/consistência sem alterar lógica

**Não entra automaticamente:**
- mudanças com efeito comportamental
- reestruturação arquitetural
- qualquer ajuste em arquivo protegido

### Trilha T2 — `any` por família (any-by-family)
**Objetivo:** mapear e reduzir `any` por blocos técnicos, sem guerra global.

**Famílias iniciais:**
1. UI/components
2. pages/fluxo
3. lib/core-utils
4. integrations/services
5. tests
6. workers/libs sensíveis
7. supabase/functions

**Estratégia:** executar em lotes pequenos por família, com diff auditável e sem ultrapassar fronteira da família no mesmo lote.

### Trilha T3 — Hook rules críticos
**Objetivo:** eliminar violações críticas de hooks (`rules-of-hooks`, dependências de efeitos com risco real).  
**Regra:** priorizar correções de segurança comportamental (ordem de hooks, dependências faltantes críticas) e adiar micro-otimizações.

### Trilha T4 — Workers/libs sensíveis
**Objetivo:** mapear pontos de concorrência, side effects e superfícies sensíveis antes de intervenção.  
**Saída mínima esperada:** inventário técnico com nível de risco (baixo/médio/alto) por arquivo.

### Trilha T5 — `supabase/functions`
**Objetivo:** separar correções de governança técnica (tipagem, lint local, consistência de contrato) de mudanças de domínio.  
**Regra:** nenhuma alteração de comportamento de negócio sem subida ao Tribunal.

### Trilha T6 — Warnings depois
**Objetivo:** após críticos/erros, tratar warnings em lote controlado.  
**Travão:** warnings não viram desculpa para refatoração ampla.

---

## 2.2 Quality gates por recorte

Cada trilha deve validar só o recorte tocado, usando scripts reais do `package.json`:

1. `npm run lint` (foco no recorte alterado)
2. `npm run typecheck` (foco em regressão de tipagem do recorte)
3. `npm run test` (quando o recorte tocar fluxo coberto)
4. `npm run build` (gate final antes de subir para Tribunal quando houver impacto transversal)

**Regra operacional:** sem sweep global obrigatório nesta fase de desenho; executar gates conforme recorte alterado por trilha.

---

## 2.3 Matriz de decisão operacional

| Tipo de ação | Pode fazer já | Bulk com travão | Depende de Tribunal | Depende de owner | Bloqueado nesta task |
|---|---|---|---|---|---|
| Correção mecânica de lint em arquivo não protegido | Sim | Sim | Não | Não | Não |
| Correção com possível alteração de comportamento | Não | Não | Sim | Não | Não |
| Mudança em `vite.config.ts` | Não | Não | Sim | Sim | Sim |
| Mudança em `src/types/index.ts` | Não | Não | Sim | Sim | Sim |
| Mudança em `data/projects.ts` | Não | Não | Sim | Sim | Sim |
| Mudança em `tailwind.config.ts` (cores/fontes) | Não | Não | Sim | Sim | Sim |
| Ajuste estrutural cross-cutting (múltiplas famílias) | Não | Sim | Sim | Não | Não |
| Feature nova / Fase 4 | Não | Não | Não | Não | Sim |

---

## 3) Papel do Codex na camada pós-soberana

## 3.1 O que Codex faz aqui
- Traduz diretriz soberana em trilhas técnicas executáveis e auditáveis.
- Define recortes de execução com gates objetivos.
- Opera bulk com travão (escopo, invariantes, dependências).
- Entrega handoff linear + registro de canalização ao final de cada task.

## 3.2 O que Codex não faz aqui
- Não reescreve `docs/NEXUS_OS.md`.
- Não abre frente de feature nova ou Fase 4.
- Não faz sweep global de lint/typecheck fora de recorte aprovado.
- Não altera arquivo protegido sem necessidade explícita e fluxo de aprovação.

## 3.3 Interação com bulk, Tribunal e handoff
1. **Bulk:** permitido somente em escada curta e com travão por ação.
2. **Tribunal:** qualquer item de risco estrutural sobe antes de entrar no core.
3. **Handoff:** obrigatório como gate de continuidade para próximo executor.

---

## 4) Estado de acionamento imediato

### Acionável agora
1. Preparar backlog técnico por trilha T1..T6 com recortes pequenos.
2. Rodar gates por recorte ao executar cada lote.
3. Registrar handoff por lote com evidência objetiva.

### Entra em bulk com travão
1. Sequências de correções mecânicas por família (ex.: T1 + T2 em UI/components).
2. Encadeamento de validações (`lint` → `typecheck` → `test`/`build`) por lote.

### Sobe ao Tribunal
1. Qualquer mudança comportamental sensível.
2. Qualquer ajuste em arquivo protegido.
3. Qualquer proposta cross-cutting que atravesse múltiplas famílias com risco de regressão.

### Depende de owner
1. Autorização explícita para ações em arquivos protegidos listados em lei/invariantes.
2. Qualquer decisão de prioridade que mova esforço para fora do escopo de Fase 3.

### Bloqueado nesta task
1. Execução de correções em massa.
2. Refatoração ampla do app.
3. Qualquer entrega de Fase 4.

---

## 5) Limitações registradas

- Este documento **não** infere critérios técnicos inexistentes no repositório; apenas estrutura execução sobre fontes já versionadas.
- A priorização fina por diretório/arquivo depende de inventário objetivo no momento da execução de cada trilha.
- Sem solicitação explícita do owner, arquivos protegidos permanecem fora do plano executável imediato.

---

## 6) Próximo passo oficial (único)

Executar a **abertura da Trilha T1 (Lint hardening seguro)** em um lote piloto pequeno, limitado a arquivos não protegidos, com gates por recorte e handoff completo.

## 7) Sugestões paralelas (até 3)

1. Abrir inventário de `any` por família (T2) sem correção, só classificação de risco.
2. Mapear violações de hooks críticos (T3) em relatório de prioridade técnica.
3. Levantar superfícies de `workers/libs` e `supabase/functions` para separar governança técnica de domínio antes do primeiro bulk.