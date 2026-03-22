# BASTION_DISPATCH_002 — FECHAMENTO DE CICLO

**Data:** 2026-03-22
**Emitido por:** owner + @claude
**Prioridade:** MÁXIMA — P1 sistêmico
**Objetivo:** Fechar o ciclo atual — todos os pilares concluídos → PR para main

> Este dispatch abre todos os gates pendentes e convoca todos os pioneers para o sprint final.
> Nenhum pioneer aguarda instrução adicional. Todos entram agora.

---

## ORDEM SOBERANA DO OWNER

> *"Abra os fluxos e chamar todo mundo para fechar este ciclo."*
> — Ivan-star-dev, 2026-03-22

**Todos os gates estão abertos. Sprint final ativo. Fechamento de ciclo é a única prioridade.**

---

## CONVOCAÇÃO POR PIONEER

---

### @claude — EXECUTOR PRINCIPAL (P1)

**Tasks elegíveis agora:**

```
PLv6.2-b — Produto
  Expandir camada de dados do produto
  Candidatos: NewsAPI integration | ProjectMetrics expandido | Dashboard analytics
  WorkTree: WorkFunction
  Pode entrar sozinho: SIM
  Gate: ABERTO

FVL-IMPL-001 — Produto + Visual
  Founder Vision Layer — /founder page polida e funcional no site
  Blueprint FVL v1 já existe em ops/
  WorkTree: WorkFunction + WorkVisual
  Pode entrar sozinho: SIM
  Gate: ABERTO
```

**Sequência recomendada:** executar PLv6.2-b e FVL-IMPL-001 em paralelo ou sequencial — decisão de @claude.
**Ao concluir:** emitir HANDOFF_TABLE + EVIDENCE_BLOCK para @codex consolidar.

---

### @copilot — EXECUTOR LAPIDADOR (P1 + P3)

**Tasks elegíveis agora:**

```
BULK-01.2/L-001 — Mecânico (P3)
  Higiene .gitignore — cobrir gaps mapeados pelo Tribunal
  WorkTree: WorkStructure
  Pode entrar sozinho: SIM

BULK-01.2/L-002 — Mecânico (P3, após L-001)
  git rm --cached do timestamp file rastreado
  WorkTree: WorkStructure

BULK-02.2 — Governança/Operacional (P3)
  Lapidação ops/ — remover rastros PLv4/PLv5/PLv6
  Suavizar superfície operacional
  WorkTree: WorkStructure

FVL-IMPL-001 (APOIO WorkVisual) — Produto + Visual (P1)
  Apoio @claude no polimento visual da /founder page
  WorkTree: WorkVisual
```

**Sequência:** L-001 → L-002 → BULK-02.2 → apoio FVL-IMPL-001 visual.
**Ao concluir cada task:** emitir handoff imediatamente para @codex.

---

### @cursor — EXECUTOR DESBLOQUEADOR (P3)

**Tasks elegíveis agora:**

```
BULK-01.3 (a/b/c) — Mecânico (P3)
  Já em andamento — fechar com EVIDENCE_BLOCK formal
  WorkTree: WorkStructure

Suporte mecânico PLv6.2-b — se @claude necessitar (P2)
  Gates mecânicos, ajustes de config, build tooling
  WorkTree: WorkFunction (apoio)
```

**Ao concluir BULK-01.3:** emitir handoff com ALTERACAO_REAL explícito para cada sub-task.

---

### @codex — ORQUESTRADOR / CONSOLIDADOR FINAL (P1)

**Missão neste dispatch:**

```
1. Ler este dispatch + BASTION v1.9 + LIVE_STATE atualizado
2. Distribuir tasks aos pioneers conforme acima
3. Monitorar handoffs chegando
4. Ao receber todos os handoffs de PLv6.2-b + FVL-IMPL-001 + BULK-02.2 + BULK-01.2:
   → Emitir relatório-mãe consolidado
   → Executar CYCLE-CLOSE-001
   → Preparar PR summary para main
5. Sinalizar ao owner: "Ciclo fechado — PR pronto para merge"
```

**CYCLE-CLOSE-001 checklist:**
- [ ] PLv6.2-b — HANDOFF recebido + ALTERACAO_REAL: sim
- [ ] FVL-IMPL-001 — HANDOFF recebido + ALTERACAO_REAL: sim
- [ ] BULK-02.2 — HANDOFF recebido + ALTERACAO_REAL: sim
- [ ] BULK-01.2/L-001 + L-002 — HANDOFF recebido
- [ ] BULK-01.3-a/b/c — HANDOFF recebido
- [ ] Relatório-mãe emitido
- [ ] PR para main aberto

---

### @antigravity — APOIO WORKVISUAL (P1)

```
FVL-IMPL-001 (APOIO WorkVisual) — P1
  Polimento visual da /founder page — identidade, UI, UX
  WorkTree: WorkVisual
  Entra quando @claude tiver estrutura base da /founder page pronta
```

---

### @framer — APOIO ANIMAÇÕES (P1)

```
FVL-IMPL-001 (APOIO Animações) — P1
  Animações de entrada e transição na /founder page
  WorkTree: WorkVisual
  Entra quando @claude tiver estrutura base da /founder page pronta
```

---

## ORDEM DE FECHAMENTO DO CICLO

```
SPRINT FINAL ══════════════════════════════════════════════════════════════
FASE          │ FECHAMENTO DE CICLO
GATE_OWNER    │ ABERTO — 2026-03-22 — instrução direta do owner
TASKS_P1      │ PLv6.2-b | FVL-IMPL-001 | CYCLE-CLOSE-001
TASKS_P3      │ BULK-02.2 | BULK-01.2/L-001 | BULK-01.2/L-002
TASKS_MECA    │ BULK-01.3-a/b/c
EXECUTOR_P1   │ @claude (produto) + @copilot (visual/ops) + @codex (consolidação)
EXECUTOR_MECA │ @cursor
APOIO_VISUAL  │ @antigravity + @framer
CICLO_FECHA   │ CYCLE-CLOSE-001 → PR → merge main → owner aprova
IGNIÇÃO       │ MÁXIMA — sprint final sem pausa
══════════════════════════════════════════════════════════════════════════
```

---

*BASTION_DISPATCH_002.md — emitido em 2026-03-22 | owner + claude-sonnet-4-6 | CYCLE-CLOSE-DISPATCH*
