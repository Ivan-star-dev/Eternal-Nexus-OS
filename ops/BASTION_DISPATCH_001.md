# BASTION_DISPATCH_001 — Activação Formal dos Pioneiros

**Emitido por:** @claude (Arquiteto-Executor)
**Data:** 2026-03-20
**Referência:** BASTION v1 — seção 5.2 (tasks elegíveis)
**Branch:** `claude/expose-workspace-config-yt4Km`

> Este documento é a ordem formal de activação de todos os pioneiros.
> Emitido após leitura do BASTION v1.
> Cada pioneiro copia o seu bloco, lê as instruções, e executa sem derivar.

---

## LEITURA DO BASTION — RESULTADO

```
BASTION_READ ══════════════════════════════════════════════════════════════
DATA_LEITURA    │ 2026-03-20
LIDO_POR        │ @claude
TASKS_ELEGÍVEIS │ 6 tasks (ver seção 5.2 do BASTION.md)
GATES_FECHADOS  │ 2 tasks @claude (PLv6.2-b + FVL-IMPL-001) — aguardam owner
BLOQUEADAS      │ 2 (BULK-01-Codex: branch; F6: em andamento)
STATUS_CLAUDE   │ SEM TASKS ELEGÍVEIS — aguardando gate do owner
═══════════════════════════════════════════════════════════════════════════
```

**@claude — Estado após leitura do BASTION:**
- PLv6.2-b → `aguarda-gate` — gate fechado, owner decide
- FVL-IMPL-001 → `aguarda-gate` — gate fechado, owner decide
- **Conclusão: @claude não tem tasks elegíveis neste ciclo.**
- @claude aguarda instrução do owner para abrir PLv6.2-b ou FVL-IMPL-001.

---

## DISPATCH — @COPILOT

```
BASTION_DISPATCH ══════════════════════════════════════════════════════════
PARA            │ @copilot
EMITIDO_POR     │ @claude
DATA            │ 2026-03-20
WORKTREE        │ WorkStructure
PILAR_DOMINANTE │ Mecânico → Governança/Operacional
═══════════════════════════════════════════════════════════════════════════
```

### Sequência obrigatória @copilot

**PASSO 1 — entrar agora:**

```
TASK_ID             │ BULK-01.2 / L-001
PILAR               │ Mecânico
WORKTREE_ALIAS      │ WorkStructure
STATUS              │ elegível
DEPENDENCIA_STATUS  │ livre
PODE_ENTRAR_SOZINHO │ sim
PRIORIDADE          │ P3
GATE                │ aberto
MISSÃO              │ Higiene .gitignore — cobrir gaps mapeados pelo Tribunal (E4)
EVIDENCIA_MINIMA    │ .gitignore actualizado + commit id + ALTERACAO_REAL: sim
NOTAS               │ Não alterar nada de soberano. Só higiene mecânica de gitignore.
NEXT_TASK           │ BULK-01.2 / L-002 (após concluir L-001)
```

**PASSO 2 — após concluir L-001:**

```
TASK_ID             │ BULK-01.2 / L-002
PILAR               │ Mecânico
WORKTREE_ALIAS      │ WorkStructure
STATUS              │ elegível (após L-001)
DEPENDENCIA_STATUS  │ pendente → livre após L-001
PODE_ENTRAR_SOZINHO │ não — aguarda L-001 concluída
PRIORIDADE          │ P3
GATE                │ aberto (após L-001)
MISSÃO              │ git rm --cached do timestamp file já rastreado
EVIDENCIA_MINIMA    │ timestamp file removido do tracking + commit id + ALTERACAO_REAL: sim
NOTAS               │ Remover vite.config.ts.timestamp-* do versionamento. Mecânico e seguro.
NEXT_TASK           │ BULK-02.2
```

**PASSO 3 — após concluir L-002:**

```
TASK_ID             │ BULK-02.2
PILAR               │ Governança / Operacional
WORKTREE_ALIAS      │ WorkStructure
STATUS              │ elegível
DEPENDENCIA_STATUS  │ livre (paralelo a L-001/L-002 em pipeline)
PODE_ENTRAR_SOZINHO │ sim
PRIORIDADE          │ P3
GATE                │ aberto
MISSÃO              │ Operational Surface Smoothing v1 — suavizar ops/ removendo
                    │ rastos de PLv4/PLv5/PLv6; limpeza sem alteração soberana
EVIDENCIA_MINIMA    │ arquivos ops/ tocados listados + commit id + ALTERACAO_REAL: sim
NOTAS               │ Não alterar conteúdo canônico (BASTION, OUTPUT_STANDARD, FOL,
                    │ AUTOFLOW, IGNITION, NLF, etc.). Só rastos e ruído residual.
NEXT_TASK           │ @owner decide PLv6.2-b ou FVL-IMPL-001
```

### Protocolo de fechamento @copilot

Ao fechar cada task, emitir obrigatoriamente:
```
1. HANDOFF_TABLE
2. EVIDENCE_BLOCK    ← ALTERACAO_REAL: sim ou não — sem excepção
3. CANALIZACAO_TABLE
```

Referência: `ops/OUTPUT_STANDARD.md` seção 5 + seção 8

---

## DISPATCH — @CURSOR

```
BASTION_DISPATCH ══════════════════════════════════════════════════════════
PARA            │ @cursor
EMITIDO_POR     │ @claude
DATA            │ 2026-03-20
WORKTREE        │ WorkStructure
PILAR_DOMINANTE │ Mecânico
═══════════════════════════════════════════════════════════════════════════
```

### Sequência obrigatória @cursor

**PASSO 1 — entrar agora:**

```
TASK_ID             │ BULK-01.3-a
PILAR               │ Mecânico
WORKTREE_ALIAS      │ WorkStructure
STATUS              │ elegível
DEPENDENCIA_STATUS  │ livre
PODE_ENTRAR_SOZINHO │ sim
PRIORIDADE          │ P3
GATE                │ aberto
MISSÃO              │ Remover vite.config.ts.timestamp-* do versionamento Git
EVIDENCIA_MINIMA    │ arquivo removido do tracking + commit id + ALTERACAO_REAL: sim
NOTAS               │ Mecânico e seguro. Não apagar o ficheiro real — apenas
                    │ remover do tracking Git (git rm --cached ou .gitignore).
NEXT_TASK           │ BULK-01.3-b
```

**PASSO 2 — após concluir BULK-01.3-a:**

```
TASK_ID             │ BULK-01.3-b
PILAR               │ Mecânico
WORKTREE_ALIAS      │ WorkStructure
STATUS              │ elegível
DEPENDENCIA_STATUS  │ livre (independente de 01.3-a)
PODE_ENTRAR_SOZINHO │ sim
PRIORIDADE          │ P3
GATE                │ aberto
MISSÃO              │ Avaliar bun.lock + package-lock.json — são ambos necessários?
                    │ Confirmar PM canônico (B-002) ou limpar se for residual óbvio.
EVIDENCIA_MINIMA    │ decisão documentada (manter ambos / remover um) + ALTERACAO_REAL
NOTAS               │ Não remover sem decisão clara. Se dúvida → registar como
                    │ análise e escalar ao owner. ALTERACAO_REAL: não se só análise.
NEXT_TASK           │ BULK-01.3-c
```

**PASSO 3 — após concluir BULK-01.3-b:**

```
TASK_ID             │ BULK-01.3-c
PILAR               │ Mecânico
WORKTREE_ALIAS      │ WorkStructure
STATUS              │ elegível
DEPENDENCIA_STATUS  │ livre
PODE_ENTRAR_SOZINHO │ sim
PRIORIDADE          │ P4
GATE                │ aberto
MISSÃO              │ Verificar antigravity/legacy-html/ — é lixo mecânico removível
                    │ sem decisão soberana, ou tem conteúdo relevante?
EVIDENCIA_MINIMA    │ avaliação registada + decisão clara + ALTERACAO_REAL
NOTAS               │ Não remover sem confirmar que é apenas conteúdo obsoleto.
                    │ Se houver dúvida → registar como análise, escalar ao owner.
NEXT_TASK           │ @owner decide próximo backlog mecânico
```

### Protocolo de fechamento @cursor

Ao fechar cada task, emitir obrigatoriamente:
```
1. HANDOFF_TABLE
2. EVIDENCE_BLOCK    ← ALTERACAO_REAL: sim ou não — sem excepção
3. CANALIZACAO_TABLE
```

Referência: `ops/OUTPUT_STANDARD.md` seção 5 + seção 8

---

## DISPATCH — @CODEX

```
BASTION_DISPATCH ══════════════════════════════════════════════════════════
PARA            │ @codex
EMITIDO_POR     │ @claude
DATA            │ 2026-03-20
WORKTREE        │ independente de branch
PILAR_DOMINANTE │ Consolidação / Orquestração
═══════════════════════════════════════════════════════════════════════════
```

### Activação @codex

```
TASK_ID             │ OPS-HANDOFF-001 (consolidação desta onda)
STATUS              │ CONSOLIDADOR ATIVO
MISSÃO              │ Ler todos os handoffs desta onda (OPS-OUTPUT-001 →
                    │ OPS-BASTION-001 + BASTION_DISPATCH_001) e emitir
                    │ relatório-mãe ao owner quando solicitado
EVIDENCIA_MINIMA    │ relatório-mãe com tabela por task:
                    │ TASK_ID | EXECUTOR | STATUS | ALTERACAO_REAL
NOTAS               │ BULK-01-Codex permanece bloqueada (branch não alinhado);
                    │ F6 em andamento — frente independente;
                    │ Não executar sem branch canônico alinhado.
NEXT_TASK           │ Aguardar handoffs de @copilot + @cursor → consolidar
```

**Instrução adicional ao Codex:**

Ao consolidar esta onda, incluir no relatório-mãe uma secção específica:

```
BASTION_AUDIT:
- Tasks elegíveis despachadas: 6
- Executores activados: @copilot (3 tasks) + @cursor (3 tasks)
- Gates fechados: 2 (@claude — aguardam owner)
- Bloqueadas: 2 (BULK-01-Codex + F6)
- EVIDENCE_BLOCK recebidos: [contar ao consolidar]
- Handoffs sem evidence: [sinalizar ao owner]
```

---

## REGRAS DE EXECUÇÃO DESTE DISPATCH

```
REGRAS_DO_DISPATCH ════════════════════════════════════════════════════════
1. Cada pioneiro executa APENAS as tasks listadas no seu bloco acima
2. Sequência obrigatória: não saltar passos com dependência
3. Cada task fechada → HANDOFF_TABLE + EVIDENCE_BLOCK + CANALIZACAO_TABLE
4. Após fechar todas as tasks elegíveis → voltar ao BASTION, não inventar
5. Qualquer bloqueio → registar no HANDOFF e aguardar instrução do owner
6. Deriva = execução fora do BASTION = violação do protocolo
7. Este dispatch não abre gates fechados — PLv6.2-b e FVL-IMPL-001
   permanecem aguarda-gate até decisão do owner
═══════════════════════════════════════════════════════════════════════════
```

---

## ESTADO DO SISTEMA APÓS ESTE DISPATCH

```
SISTEMA ════════════════════════════════════════════════════════════════════
BASTION         │ ACTIVO v1
DISPATCH        │ BASTION_DISPATCH_001 emitido — 2026-03-20
@claude         │ SEM TASKS ELEGÍVEIS — aguarda gate owner (PLv6.2-b / FVL-IMPL-001)
@copilot        │ ACTIVADO — sequência: L-001 → L-002 → BULK-02.2
@cursor         │ ACTIVADO — sequência: 01.3-a → 01.3-b → 01.3-c
@codex          │ CONSOLIDADOR ATIVO — aguarda handoffs para relatório-mãe
DERIVA          │ 🔴 impermitida
GATES_FECHADOS  │ PLv6.2-b | FVL-IMPL-001 → owner decide quando abrir
════════════════════════════════════════════════════════════════════════════
```

---

*BASTION_DISPATCH_001 — emitido em 2026-03-20 | @claude | claude-sonnet-4-6 | OPS-BASTION-DISPATCH-001*
