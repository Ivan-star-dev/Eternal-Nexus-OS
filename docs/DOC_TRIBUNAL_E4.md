# DOC_TRIBUNAL_E4 — Parecer de Higiene e Ordem de Merge

**Pilar:** Estrutura
**Tarefa:** E4 — Julgar higiene segura e ordem de merge
**Fase:** Fase 3 — Governança e Auditabilidade
**Modelo:** claude-sonnet-4-6
**Branch:** `claude/expose-workspace-config-yt4Km`
**Data:** 2026-03-20

---

## EVIDÊNCIAS AUDITADAS

O Tribunal inspecionou diretamente o repositório. Nenhum relatório de higiene prévio foi encontrado em `docs/`. Este documento constitui o **primeiro relatório oficial de higiene** da Fase 3 e serve simultaneamente como parecer de julgamento.

### Artefatos de lixo identificados

| ID | Arquivo | Tipo | Estado atual |
|---|---|---|---|
| H-001 | `vite.config.ts.timestamp-1773704322421-a68df736f2dd78.mjs` | Arquivo temporário do Vite dev server | Commitado no repo |
| H-002 | `bun.lockb` | Lockfile Bun binário (orphaned) | Commitado no repo |
| H-003 | `bun.lock` | Lockfile Bun textual (orphaned) | Commitado no repo |
| H-004 | `.env` | Arquivo de segredos reais | Commitado no repo — CRÍTICO |

### Gaps do .gitignore

| ID | Gap | Risco |
|---|---|---|
| G-001 | `*.timestamp-*.mjs` ausente | Arquivos Vite temp voltam ao repo a cada dev run |
| G-002 | `.env` ausente | Segredos reais entram no histórico git |
| G-003 | `bun.lock` / `bun.lockb` ausentes | Lockfiles de PM alternativo poluem o repo |

### Branches com divergência real de master

| Branch | Commits à frente | Conteúdo |
|---|---|---|
| `claude/expose-workspace-config-yt4Km` | +2 | Governança: `package-lock.json` update + protocolo micro team |
| `origin/agent/claude` | 0 | Espelho de master — sem commits adicionais |

### Package manager canônico
CI usa `npm ci` em `.github/workflows/app-quality.yml`. `package-lock.json` existe e está sincronizado. `bun.lock` e `bun.lockb` são órfãos — nenhum script do `package.json` usa bun.

---

## 1. LIMPEZA SEGURA IMEDIATA

### APROVADO — pode entrar sem owner, sem risco de quebra do core

#### ✅ L-001 — Adicionar entradas ao `.gitignore`
**Alvo:** `.gitignore`
**Adições:**
```
# Vite dev temp
*.timestamp-*.mjs

# Env files (nunca commitar segredos)
.env
.env.*
!.env.example

# Bun lockfiles (PM não-canônico)
bun.lock
bun.lockb
```
**Por que é seguro:**
- `.gitignore` é puro controle de rastreamento — não afeta build, CI, runtime ou o sacred flow
- Adicionar entradas nunca remove arquivos do disco — apenas os ignora
- Reversível com um commit de 1 linha
- Não toca nenhum arquivo protegido

#### ✅ L-002 — Remover `vite.config.ts.timestamp-*.mjs` do rastreamento
**Alvo:** `vite.config.ts.timestamp-1773704322421-a68df736f2dd78.mjs`
**Ação:** `git rm --cached` + entrada no `.gitignore`
**Por que é seguro:**
- É arquivo gerado automaticamente pelo Vite na inicialização do dev server
- Não pertence ao código-fonte — não tem significado semântico
- Não afeta build, CI, lint, typecheck ou testes
- O Vite regenera quando necessário

#### ✅ L-003 — Remover `bun.lock` e `bun.lockb` do rastreamento
**Alvo:** `bun.lock`, `bun.lockb`
**Ação:** `git rm --cached` para ambos + entrada no `.gitignore`
**Por que é seguro:**
- O package manager canônico é npm (evidência: CI usa `npm ci`, `package-lock.json` presente e atualizado)
- Bun não está declarado como `packageManager` em `package.json`
- Manter lockfiles de PM não-canônico cria ambiguidade operacional para agentes e CI
- `package-lock.json` permanece intacto

---

## 2. LIMPEZA BLOQUEADA

### BLOQUEADO — requer decisão do owner antes de qualquer ação

#### 🔴 B-001 — `.env` no histórico git (CRÍTICO)
**Problema:** O arquivo `.env` está commitado e contém variáveis de ambiente reais (incluindo `VITE_GROK_HONEYPOT_ENABLED=true`, chaves API). Está no histórico do repositório.

**Ação mínima que o @copilot pode fazer agora:** Adicionar `.env` ao `.gitignore` para que novas versões não sejam commitadas. Isso é seguro e está coberto por L-001 acima.

**Ação bloqueada até owner decidir:**
- Purgar `.env` do histórico git completo (`git filter-repo` ou `BFG`)
- Exige confirmação do owner: **os valores em `.env` são segredos reais ou são placeholders?**
- Se forem reais → owner deve rotacionar TODAS as chaves antes de qualquer purge
- Se forem placeholders → purge pode ser agendado com baixo risco

**Estado:** `BLOQUEADA — aguarda owner`

#### 🟡 B-002 — `package-lock.json` vs lockfiles Bun (decisão de PM)
**Problema:** O repo tem 3 lockfiles (`package-lock.json`, `bun.lock`, `bun.lockb`). O CI usa npm. Mas a presença de lockfiles Bun indica que houve uso de bun em algum momento.

**Ação bloqueada até owner confirmar:**
- Confirmar que npm é o PM oficial e permanente para o projeto
- Após confirmação, L-003 pode ser executado

**Estado:** `BLOQUEADA — aguarda confirmação de PM canônico` (alta probabilidade de ser npm, mas precisa de confirmação explícita)

#### 🟡 B-003 — `antigravity/legacy-html/` (5 arquivos HTML de projetos externos)
**Problema:** Contém HTMLs de projetos legados (`NL_Solucoes_Fechadas_2026.html`, `NextPathInfra_*.html`, `projeto_elite_2026.html`) — não pertencem ao app Eternal Nexus.

**Ação bloqueada:** Remoção só com instrução explícita do owner — esses arquivos podem ter valor de referência ou histórico intencional.

**Estado:** `BLOQUEADA — sem instrução do owner`

---

## 3. ORDEM DE MERGE

### Estado atual de branches

| # | Branch | Status | Ação recomendada |
|---|---|---|---|
| 1 | `claude/expose-workspace-config-yt4Km` | 2 commits à frente de master | **MERGE PRIMEIRO** |
| 2 | `origin/agent/claude` | Espelho de master (0 commits adicionais) | **FECHAR** — sem conteúdo |

### Ordem de merge recomendada

#### PASSO 1 — Merge `claude/expose-workspace-config-yt4Km` → `master`
**Motivo:** Contém governança Fase 3 completa — `DOC_MICRO_TEAM.md`, `DOC_FASE3.md` seção 11, `AGENTS.md` seção micro team, `package-lock.json` atualizado. Zero risco de conflito com o app.
**Condição:** PR aberto, revisão do owner, merge normal (sem squash obrigatório — os 2 commits têm mensagens limpas).

#### PASSO 2 — Após merge acima, criar PR de higiene do .gitignore
**Conteúdo:** L-001 + L-002 + L-003 (gitignore + git rm --cached dos 3 artefatos)
**Quem pode executar:** @copilot ou agente de estrutura
**Requer owner:** Não — mas o owner deve confirmar o PM canônico para L-003 antes do merge

#### PASSO 3 — Branch `origin/agent/claude`
**Ação:** Fechar como obsoleto — é idêntico ao estado de master, sem commits extras.
**Requer owner:** Sim — só o owner fecha branches no repositório remoto

---

## 4. LIBERAÇÃO DO @COPILOT

### O que o @copilot pode executar AGORA, sem risco

| # | Ação | Arquivo alvo | Risco |
|---|---|---|---|
| C-001 | Adicionar `.env`, `*.timestamp-*.mjs`, `bun.lock`, `bun.lockb` ao `.gitignore` | `.gitignore` | Zero |
| C-002 | `git rm --cached vite.config.ts.timestamp-*.mjs` | — | Zero |
| C-003 | Atualizar referência ao `.gitignore` em `README.md` se necessário | `README.md` | Baixo |
| C-004 | Confirmar que `app-quality.yml` não está quebrado após mudanças de governa | `.github/workflows/app-quality.yml` | Leitura apenas |

### O que o @copilot NÃO pode tocar sem aprovação explícita

| # | Área | Motivo do bloqueio |
|---|---|---|
| X-001 | `git rm --cached bun.lock bun.lockb` | Aguarda confirmação de PM canônico pelo owner |
| X-002 | Purge de `.env` do histórico | Aguarda owner verificar se há segredos reais |
| X-003 | `antigravity/legacy-html/` | Sem instrução do owner |
| X-004 | `vite.config.ts` | Arquivo protegido — invariante absoluta |
| X-005 | `src/types/index.ts` | Arquivo protegido — invariante absoluta |
| X-006 | `data/projects.ts` | Arquivo protegido — sem instrução do owner |
| X-007 | `tailwind.config.ts` | Arquivo protegido — invariante absoluta |
| X-008 | Features de Fase 4 | Fora de fase |
| X-009 | Sacred flow Tribunal → Atlas → Index → News | Invariante absoluta |

### Semáforo atual para o @copilot

```
VERDE — para L-001 (gitignore additions)
VERDE — para C-002 (git rm --cached do timestamp file)
AMARELO — para L-003 (bun lockfiles) — aguarda confirmação de PM
VERMELHO — para B-001 (env purge) — aguarda owner
VERMELHO — para B-003 (legacy-html) — aguarda owner
```

---

## 5. HANDOFF FINAL

**MODELO USADO:**
claude-sonnet-4-6

**MODELO PLANEJADO:**
claude-sonnet-4-6

**FALLBACK USADO, SE HOUVE:**
nenhum

**IMPACTO DA TROCA:**
nenhum

**PRÓXIMO PASSO OFICIAL:**
Executar L-001 + L-002 (`.gitignore` hardening + remoção do arquivo timestamp do rastreamento git) — ação segura imediata, zero risco, melhora a higiene do repo sem tocar no app. Em paralelo, owner responde: (a) npm é o PM canônico definitivo? (b) os valores em `.env` são segredos reais ou placeholders?

**SUGESTÕES PARALELAS DE REFINAMENTO:**
1. `[system-refinement]` `[PRONTA PARA TRIBUNAL]` `[Fase 3]` `[sonnet-4-6]` Corrigir `.gitignore` e remover artefatos órfãos (`bun.lock`, `bun.lockb`, arquivo timestamp) do rastreamento — impacto zero no app, elimina ruído de estado do repo.
2. `[backup-paths]` `[EM RESEARCH]` `[Fase 3]` `[sonnet-4-6]` Verificar se `app-quality.yml` está configurado para branch `master` além de `main` — atualmente o push trigger aponta para `main`, que pode não ser o branch principal deste repo.
3. `[research]` `[EM OBSERVAÇÃO]` `[Fase 3]` `[sonnet-4-6]` Auditar se `.env.example` está completo e atualizado em relação ao `.env` real — garantir que futuros agentes e colaboradores tenham template fiel sem expor segredos.

**PARECER DO TRIBUNAL:**
- alinhada e útil
- pronta para entrar no roadmap (L-001 + L-002 imediatamente; resto aguarda owner)
