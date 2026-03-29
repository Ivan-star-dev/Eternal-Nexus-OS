---
title: "Fase 3 Source of Truth"
slug: doc-fase3
date: 2026-03-20
category: governance
excerpt: "Repository source of truth for Phase 3 governance."
---

# DOC_FASE3 — Fonte de Verdade (repositório)

## 1) Propósito
Este documento formaliza, **com base apenas no estado atual do repositório**, as condições mínimas para executar e auditar a Fase 3 sem desvio de escopo.

Não define novas funcionalidades de produto. Define governança, verificabilidade e rastreabilidade para o que já existe no projeto Eternal Nexus.

## 2) Escopo explícito
A Fase 3, neste repositório, cobre apenas:

1. Existência de uma fonte versionada para regras e aceitação da Fase 3.
2. Instruções persistentes para agentes (Codex/Copilot) com regras anti-drift.
3. Validação automática de código da aplicação (app) em CI.
4. README operacional alinhado com estrutura e scripts reais do repositório.

## 3) Não-escopo explícito
Fora de escopo deste documento:

- Inventar roadmap de produto não comprovado no código atual.
- Renomear órgãos, agentes, fluxos ou estruturas nucleares.
- Alterar o fluxo canônico **Tribunal → Atlas → Index → News**.
- Refatorações especulativas ou mudanças de arquitetura não exigidas pelos 4 gaps de QA.
- Alteração de lógica de negócio/domínio sem necessidade direta para os 4 gaps.

## 4) Regras fundamentais do organismo
- Preservar identidade e direção atual do projeto.
- Preservar nomenclaturas existentes no código.
- Preservar fluxo sagrado: **Tribunal → Atlas → Index → News**.
- Usar o repositório como única fonte de verdade para implementação.

## 5) Requisitos verificáveis (F3-REQ)

### F3-REQ-001 — Documento único e versionado
**Requisito:** Deve existir um documento formal e versionado da Fase 3 no repositório.

**Critérios de aceitação verificáveis:**
- Arquivo existe em `docs/DOC_FASE3.md`.
- Contém seções de: propósito, escopo, não-escopo, requisitos verificáveis e rastreabilidade.
- Declara explicitamente o fluxo Tribunal → Atlas → Index → News.

### F3-REQ-002 — Instruções persistentes para agentes
**Requisito:** O repositório deve conter regras persistentes para reduzir drift de agentes.

**Critérios de aceitação verificáveis:**
- `AGENTS.md` existe na raiz.
- `.github/copilot-instructions.md` existe.
- Ambos exigem uso do repositório como fonte de verdade e proíbem escopo especulativo.
- Ambos preservam fluxo Tribunal → Atlas → Index → News e nomenclatura existente.

### F3-REQ-003 — Gate de qualidade da aplicação em CI
**Requisito:** Alterações de app não podem ser mescladas sem validação automatizada mínima.

**Critérios de aceitação verificáveis:**
- Novo workflow de CI para app existe em `.github/workflows/`.
- Workflow é acionado em `pull_request` e em push relevante.
- Workflow executa comandos reais do repositório para: instalar, lint, typecheck, testes e build.
- Workflow de banco existente permanece intacto.

### F3-REQ-004 — README operacional e auditável
**Requisito:** README deve refletir operação real do repositório e governança da Fase 3.

**Critérios de aceitação verificáveis:**
- `README.md` não contém placeholders genéricos (ex.: `REPLACE_WITH_PROJECT_ID`, `<YOUR_GIT_URL>`).
- README documenta scripts reais de execução/validação.
- README referencia `docs/DOC_FASE3.md`, `AGENTS.md` e `.github/copilot-instructions.md`.
- README distingue claramente o que está comprovado no repositório e o que não está especificado.

## 6) Dependências em estrutura já existente
Este documento depende apenas de caminhos já presentes no repositório:

- App React/Vite/TS em `src/`
- Testes de app com Vitest (`src/test/`, `vitest.config.ts`)
- Pipeline de banco em `.github/workflows/database-tests.yml`
- Configurações de build/lint em `package.json`, `eslint.config.js`, `tsconfig*.json`, `vite.config.ts`

## 7) Relação explícita com o fluxo sagrado
O fluxo **Tribunal → Atlas → Index → News** é tratado como restrição operacional obrigatória de Fase 3.

Evidência de presença no repositório (não exaustiva):
- Tribunal: `src/components/tribunal/`
- Atlas: `src/pages/AtlasPage.tsx`, `src/lib/atlas/`
- Index: `src/pages/Index.tsx`
- News: `src/pages/NewsPortal.tsx`

## 8) Limites de especificação
Há áreas de produto e visão narrativa presentes no repositório, mas sem critérios técnicos completos e fechados neste momento.
Quando a evidência não estiver explícita no código/documentação versionada, deve-se registrar como “não especificado” em vez de inferir comportamento.

## 9) Rastreabilidade leve (requisito → evidência)

| Requisito | Evidência principal no repositório |
|---|---|
| F3-REQ-001 | `docs/DOC_FASE3.md` |
| F3-REQ-002 | `AGENTS.md`, `.github/copilot-instructions.md` |
| F3-REQ-003 | `.github/workflows/app-quality.yml`, `package.json` scripts |
| F3-REQ-004 | `README.md` |

## 10) Definição de concluído para esta Fase 3 (escopo atual)
A Fase 3 (escopo deste documento) é considerada concluída quando F3-REQ-001..004 estiverem implementados e verificáveis por inspeção de arquivos e execução de CI.

## 11) Micro Team Paralela de Refinamento
A Fase 3 reconhece a existência de uma linha operacional secundária — a **Micro Team Paralela de Refinamento** — que opera ao lado da linha principal sem substituí-la.

**Protocolo completo:** `docs/DOC_MICRO_TEAM.md`

**Princípios de coexistência com a Fase 3:**
- A micro team não altera requisitos F3-REQ-001..004 — ela os respeita como invariantes
- Nenhum output da micro team entra no core sem aprovação do Tribunal
- A linha temporal principal permanece soberana — a micro team é serviço, não dependência
- Todo trabalho da micro team que afete escopo de Fase 3 passa pelos mesmos critérios de aceitação verificáveis

| Requisito | Evidência |
|---|---|
| Protocolo da micro team | `docs/DOC_MICRO_TEAM.md` |
| Regra operacional para agentes | `AGENTS.md` seção "Micro Team" |


## 12) Camada técnica executável pós-soberana
Para operacionalizar a execução técnica da Fase 3 sem alterar o documento soberano, a referência canônica é:

- `docs/DOC_F6_CASCA_TECNICA_EXECUTAVEL.md`

Este artefato detalha trilhas técnicas iniciais, classes de decisão (A0..A4), hardening por recorte e o papel operacional do Codex após a camada soberana.