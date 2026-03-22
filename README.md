# Eternal Nexus — Repositório Operacional

Este repositório contém a base React + TypeScript + Vite do projeto Eternal Nexus, incluindo páginas, componentes e pipelines de validação.

## Invariantes do projeto (não negociáveis)
- Não simplificar o projeto.
- Não renomear órgãos, agentes, fluxos ou estruturas centrais.
- Preservar o fluxo sagrado: **Tribunal → Atlas → Index → News**.
- Usar apenas evidência do próprio repositório para implementação e documentação.

## Estrutura relevante
- Aplicação: `src/`
- Páginas-chave do fluxo:
  - Tribunal: `src/components/tribunal/`
  - Atlas: `src/pages/AtlasPage.tsx` e `src/lib/atlas/`
  - Index: `src/pages/Index.tsx`
  - News: `src/pages/NewsPortal.tsx`
- Documentação de Fase 3: `docs/DOC_FASE3.md`
- Governança de agentes:
  - `AGENTS.md`
  - `.github/copilot-instructions.md`
- CI:
  - App quality: `.github/workflows/app-quality.yml`
  - Database tests: `.github/workflows/database-tests.yml`

## Pré-requisitos
- Node.js 20+
- npm

## Instalação
```bash
npm ci
```

## Execução local
```bash
npm run dev
```

## Validação local
```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Scripts reais disponíveis
Definidos em `package.json`:
- `dev`
- `build`
- `build:dev`
- `lint`
- `test`
- `test:watch`
- `typecheck`
- `preview`

## Arquitetura operacional do sistema
A casca grossa canônica do Eternal Nexus OS — identidade, missão, leis, pilares, fases, semáforo, linhas, tribunal, handoff, blueprints e critério de sistema maduro — vive em:
- `docs/NEXUS_OS.md` ← documento soberano

## Governança da Fase 3
A fonte de verdade da Fase 3 neste repositório é:
- `docs/DOC_FASE3.md`

Documentos de suporte:
- `docs/DOC_MICRO_TEAM.md` — protocolo da Micro Team Paralela de Refinamento
- `docs/DOC_TRIBUNAL_E4.md` — parecer de higiene e ordem de merge

Esses documentos definem:
- escopo e não-escopo
- requisitos verificáveis
- critérios de aceitação auditáveis
- rastreabilidade mínima requisito → evidência

## Estado atual baseado em evidência de repositório
Em vigor neste repositório:
- Documento versionado de Fase 3
- Instruções persistentes para agentes
- Workflow de CI para qualidade da aplicação
- Workflow de CI para testes de banco

Não afirmado por falta de evidência técnica fechada neste repositório:
- Novas capacidades de produto além do que já está codificado/documentado
- Critérios funcionais detalhados não versionados em arquivos do projeto

## Deployment

Before deploying, run the deploy readiness gate to verify all structural prerequisites are met:

```bash
node scripts/gates/deploy-readiness-gate.cjs
```

The gate checks (all must pass — exits 0 on success, exits 1 on any failure):

- **Structural check: `src/main.tsx` exists** — application entry point present
- **Structural check: `src/App.tsx` exists** — root component present
- **Structural check: `package.json` exists** — project manifest present
- **Structural check: `vite.config.ts` exists** — build configuration present
- **Environment documentation: `.env.example` exists** — required environment variable names are documented
- **Sacred Flow gate dependency: `ops/LIVE_STATE.md` exists** — live state file required by the Sacred Flow gate
- **Report presence dependency: `ops/HANDOFF_LEDGER.md` exists** — handoff ledger required for reporting

The gate also runs automatically on every pull request and push to `main` via `.github/workflows/deploy-readiness.yml`.
