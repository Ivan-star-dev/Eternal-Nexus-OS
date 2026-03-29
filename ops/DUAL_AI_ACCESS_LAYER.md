# DUAL AI ACCESS LAYER
# Ambiente Partilhado Claude + ChatGPT · Task Pool Soberana

**Versão:** v1.0
**Data:** 2026-03-24
**Task:** PORTAL_IMERSIVO_ORGANISM-001 (sub-deliverable)
**Branch:** `claude/rebuild-bastion-core-rihGX`
**Executor:** @claude

---

## 1. PROBLEMA

Claude e ChatGPT operam em sessões isoladas.
Sem camada partilhada, cada AI começa de zero.
O Creator Relay já define o protocolo — falta a infra mínima para o tornar real.

---

## 2. SOLUÇÃO MÍNIMA (agora, zero infra externa)

### Opção A — File-based Pool (recomendada para V3/V4)

```
ops/relay/TASK_POOL.md       — tasks pendentes / em curso / fechadas
ops/relay/RESULT_POOL.md     — outputs de qualquer AI, com referência à task
ops/relay/AI_SESSION_LOG.md  — log de sessões: quem fez o quê, quando, em que branch
```

**Como funciona:**
1. Owner cria task em `TASK_POOL.md` com formato padrão
2. Qualquer AI lê o ficheiro no início da sessão
3. AI reclama task (muda STATUS: pending → in_progress + escreve AI_ID)
4. AI executa, escreve resultado em `RESULT_POOL.md`
5. AI fecha task (STATUS: done + ref ao resultado)

**Claude:** lê/escreve diretamente via filesystem (já está no repo)
**ChatGPT:** recebe o conteúdo de `TASK_POOL.md` colado no início da sessão pelo owner, ou via GitHub web se repo for público

---

## 3. FORMATO DA TASK POOL

```markdown
## TASK-001
STATUS: pending
TITLE: Criar session entity schema
PILLAR: WorkFunction
ASSIGNED_TO: —
PRIORITY: P0
CONTEXT: ops/PORTAL_IMERSIVO_ORGANISM.md#next-physical-muscle
DELIVERABLE: ops/sessions/SESSION_ENTITY_SCHEMA.json
BRANCH: claude/rebuild-bastion-core-rihGX
```

```markdown
## TASK-002
STATUS: in_progress
TITLE: Lapidação visual do globe 3D
PILLAR: WorkVisual
ASSIGNED_TO: @framer
PRIORITY: P1
CONTEXT: ops/HEAVEN_LAB_REFERENCE_SURFACE.md
DELIVERABLE: src/components/Globe3D.tsx
BRANCH: claude/rebuild-bastion-core-rihGX
```

---

## 4. FORMATO DO RESULT POOL

```markdown
## RESULT-001
TASK_REF: TASK-001
EXECUTOR: @claude | claude-sonnet-4-6
DATE: 2026-03-24
OUTPUT_REF: ops/sessions/SESSION_ENTITY_SCHEMA.json
NOTES: schema mínimo · 11 campos · compatível com file-based e edge DB
```

---

## 5. OPÇÃO B — Edge API (para V4/V5)

```
POST   /api/tasks          — criar task
GET    /api/tasks          — listar tasks (filtro: status, pillar, assigned_to)
PATCH  /api/tasks/:id      — atualizar status / assigned_to
POST   /api/results        — registar resultado
GET    /api/sessions/:id   — ler session entity
```

Stack: Cloudflare Workers + D1 (SQLite edge) — soberano, lightweight, sem vendor lock-in.
Acessível por Claude (via código ou tool call) e ChatGPT (via custom GPT action ou API call).

---

## 6. COMO O CHATGPT ACEDE AGORA (sem infra)

```
Método 1 — Paste manual:
  Owner copia TASK_POOL.md e cola no início da sessão ChatGPT
  ChatGPT opera sobre as tasks, devolve resultado em texto estruturado
  Owner cola resultado em RESULT_POOL.md

Método 2 — GitHub público:
  ChatGPT com web browsing lê ops/relay/TASK_POOL.md diretamente via GitHub raw URL
  Executa task, devolve resultado formatado
  Owner comita resultado

Método 3 — Custom GPT + GitHub API (V4):
  Custom GPT tem action para GET/PATCH via GitHub API
  Acesso autenticado ao repo privado
  ChatGPT lê, reclama e fecha tasks autonomamente
```

---

## 7. REGRAS ABSOLUTAS

```
DAL-001: Toda task tem ID único, status explícito e deliverable concreto
DAL-002: Nenhuma AI começa task sem marcar STATUS: in_progress
DAL-003: Nenhuma task fecha sem RESULT_REF documentado
DAL-004: O branch canónico de escrita é sempre o branch ativo em LIVE_STATE.md
DAL-005: A pool é append-only para resultados — nunca reescreve história
DAL-006: Em caso de conflito de claim (dois AIs querem a mesma task) → owner decide
```

---

## 8. PATH DE IMPLEMENTAÇÃO

```
AGORA (V3):
  → criar ops/relay/TASK_POOL.md com estrutura acima
  → criar ops/relay/RESULT_POOL.md vazio
  → usar método paste manual para ChatGPT
  → Claude lê diretamente do repo

V4:
  → Cloudflare Worker + D1 para API edge
  → Custom GPT com action para GitHub API
  → Session Entity alimenta TASK_POOL automaticamente

V5:
  → Task routing automático por SWMR (pillar + profile → assign correto)
  → AI declara disponibilidade — kernel aloca
```

---

_DUAL_AI_ACCESS_LAYER v1.0 — 2026-03-24 | @claude | PORTAL_IMERSIVO_ORGANISM-001_
