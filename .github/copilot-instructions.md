# Copilot Instructions — Eternal Nexus OS · BASTION Protocol

> Lei primária do Copilot. Lida automaticamente em cada sessão.
> Versão: v2.0 — 2026-03-22 | AUTOFLOW-COPILOT-001

---

## 0. LEITURA OBRIGATÓRIA AO INICIAR

Antes de qualquer ação, ler nesta ordem:
1. `ops/LIVE_STATE.md` → branch canônico + fila ativa + bloqueadores
2. `ops/BASTION.md` → tasks elegíveis com STATUS: elegível + NEXT_ACTOR: @copilot
3. `ops/HANDOFF_LEDGER.md` → últimas 2 entradas (contexto da corrente)

---

## 1. BRANCH CANÔNICO

```
BRANCH ATIVO: claude/rebuild-bastion-core-rihGX
FONTE DA VERDADE: ops/LIVE_STATE.md (campo "Branch canônico")
```

**Regra absoluta:** todo commit e push vai para o branch canônico ativo.
Nunca escrever em `main` ou qualquer outro branch.

Se o branch atual ≠ branch canônico:
```bash
git fetch origin claude/rebuild-bastion-core-rihGX
git checkout claude/rebuild-bastion-core-rihGX
```

---

## 2. LOOP AUTÔNOMO DO COPILOT

```
AUTOFLOW — LOOP DO COPILOT
══════════════════════════════════════════════════════════
1. LÊ LIVE_STATE.md → identifica tasks da fila com NEXT_ACTOR: @copilot
2. LÊ BASTION.md   → confirma STATUS: elegível + GATE: aberto
3. VERIFICA dependências → DEPENDENCIA_STATUS: livre?
4. EXECUTA task no território WorkStructure (pilar dominante do Copilot)
5. FECHA com commit + push + handoff (formato OUTPUT_STANDARD)
6. ATUALIZA LIVE_STATE.md + HANDOFF_LEDGER.md
7. VOLTA ao passo 1 → próxima task elegível
══════════════════════════════════════════════════════════
```

**Se não houver task elegível para @copilot:**
- Registar "aguardando gate" no LIVE_STATE
- Não inventar trabalho fora do BASTION

---

## 3. PILAR DOMINANTE DO COPILOT

| Pilar | Território | Competência |
|-------|-----------|-------------|
| **WorkStructure** | ops/, docs, config, governança | FORÇA PRINCIPAL |
| **WorkVisual** | UI hygiene, polish, DX | apoio/cooperativo |
| **WorkFunction** | features, lógica de produto | apoio/cooperativo apenas com gate |

**Regra:** no WorkStructure, o Copilot lidera sem consulta adicional.
Fora dele, só entra em apoio e sem tomar decisões de núcleo.

---

## 4. INVARIANTES ABSOLUTAS

```
✅ Sempre no branch canônico ativo
✅ Sempre com task do BASTION com STATUS: elegível
✅ Sempre emitir handoff ao fechar task
✅ Sempre atualizar LIVE_STATE + HANDOFF_LEDGER
✅ Preservar fluxo sagrado: Tribunal → Atlas → Index → News
✅ Não alterar arquitetura nuclear sem gate do owner

❌ Nunca escrever em main ou outro branch
❌ Nunca inventar tasks fora do BASTION
❌ Nunca saltar dependência bloqueada
❌ Nunca abrir nova fase sem gate do owner
❌ Nunca simplificar ou substituir estruturas nucleares
```

---

## EXECUTION RULES (HARD BOUNDARIES)

- Work in your branch or the shared branch. PR to main only.
- Every commit includes a LOG: `NEXUS_CONTEXT/LOGS/YYYY-MM-DD_copilot_<topic>.md`
- Use ONLY scripts from `package.json`. Don't invent commands.
- Don't remove or break existing code/workflows.
- Don't touch `src/lib/events/*` or `src/types/sacred-flow.ts` — that's @claude's territory.
- Don't touch CI workflows — that's @codex's territory.
- Don't touch ops/automation scripts — that's @antigravity's territory.

---

## BRANCH + LEASE PROTOCOL (CI-ENFORCED — YOUR PR WILL FAIL WITHOUT THESE)

1. **Branch naming:** Your branch MUST include the task ID. Example: `copilot/u1-dark-glassmorphism` or `U1-dark-glassmorphism`. Branches like `copilot/fix-all-issues` or `copilot/do-all-tasks` **WILL BE REJECTED BY CI**.
2. **One task per branch.** Do not combine multiple tasks in one branch.
3. **Lease required before work.** Before opening a PR, create `docs/task-leases/{TASK_ID}_copilot_lease.md` using the template at `docs/templates/lease.md`. **CI checks for this file.**
4. **Move task to in-progress.** When you claim a task, move it from `docs/task-queue/ready/` to `docs/task-queue/in-progress/` and set `status: in-progress`.
5. **Blocked patterns.** These branch names are **automatically rejected**: `fix-all`, `do-all`, `finish-all`, `execute-tasks`, `install-npm`, `merge-correct`, `read-repository`.
6. **Review is binary.** Your PR will be reviewed as PASS, FAIL, or BLOCKED. No open-ended discussion threads.

## CURRENT STACK (use these, don't reinvent)

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite + TypeScript |
| State | TanStack Query + Event Bus |
| 3D/Globe | Cesium + React Three Fiber |
| Styling | Tailwind CSS + shadcn/ui |
| Maps | MapLibre GL v5 + PMTiles v4 (LIVE — shipped in C2) |
| Testing | Vitest |

Check `NEXUS_CONTEXT/STACK_REGISTRY.md` before adding ANY new dependency.
## 5. FORMATO DE HANDOFF (obrigatório ao fechar task)

```
HANDOFF — [TASK_ID]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXECUTOR       : @copilot
STATUS         : done | partial | blocked
ALTERACAO_REAL : sim | não
FEITO          : [o que foi entregue]
NAO_FEITO      : [o que ficou pendente]
BLOQUEIOS      : [o que parou — ou: nenhum]
ARQUIVOS       : [lista dos ficheiros modificados]
COMMIT         : [hash do commit]
PROX_PASSO     : [recomendação para o próximo pioneer]
DECISAO_REC    : [quem entra a seguir e porquê]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 6. REGRA DE CONFLITO

Se o pedido exigir quebrar invariantes, responder:
**"Isso quebra o organismo vivo. Quer manter?"**

---

## 7. ARTEFACTOS CANÔNICOS

| Ficheiro | Papel |
|----------|-------|
| `ops/BASTION.md` | Tasks elegíveis — lei de execução |
| `ops/LIVE_STATE.md` | Estado vivo — branch + fila |
| `ops/HANDOFF_LEDGER.md` | Histórico — motor de indução |
| `ops/AUTOFLOW.md` | Loop autônomo — regras de movimento |
| `ops/OUTPUT_STANDARD.md` | Formato canônico de output |
| `ops/DNA_PROTOCOL.md` | Espinha canônica — lei primária |

---

_copilot-instructions.md v2.0 — 2026-03-22 | AUTOFLOW-COPILOT-001 | @claude_
