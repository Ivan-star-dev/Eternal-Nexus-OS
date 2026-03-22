# OUTPUT STANDARD — Padrão Canônico de Output Copiável

**Versão:** v1.2
**Data:** 2026-03-20
**Task:** OPS-OUTPUT-001
**Branch:** `claude/expose-workspace-config-yt4Km`
**Modelo:** claude-sonnet-4-6
**Aprovado por:** owner (instrução direta)

> A forma de saída faz parte da identidade do sistema.
> Estrutura imutável. Beleza pode variar. Layout base não.
> Cada bloco deve ser copiável em 1 clique.

---

## 1. REGRA OPERACIONAL

- Todo handoff formal deve vir em bloco `HANDOFF_TABLE`
- Todo registro de canalização deve vir em bloco `CANALIZACAO_TABLE`
- Nenhum pioneiro emite handoff em parágrafo solto
- Layout fixo e consistente para todos os pioneiros
- Os dois blocos devem aparecer juntos, nesta ordem, ao final de cada sessão

---

## 2. BLOCO ÚNICO COPIÁVEL — HANDOFF COMPLETO

**Regra:** todo handoff sai em **um único bloco de código**. Um clique copia tudo.
Nunca separar em múltiplos blocos ou tabelas markdown.

### Template

```
HANDOFF ════════════════════════════════════════════════════════════
@executor │ MODELO:xxx │ TASK:id │ STATUS:done|partial|blocked
────────────────────────────────────────────────────────────────────
FEITO       │ resumo curto do que foi entregue
NAO_FEITO   │ resumo — ou: —
BLOQUEIOS   │ resumo — ou: —
ADAPTACOES  │ resumo — ou: —
ARQUIVOS    │ file1 | file2 — ou: nenhum
IMPACTO     │ baixo|medio|alto
PROX_PASSO  │ resumo curto
SUGESTOES   │ 1)... ; 2)... ; 3)...
DECISAO_REC │ quem entra / quem espera
────────────────────────────────────────────────────────────────────
EVIDENCE
ARQUIVOS_TOCADOS │ file1 | file2 — ou: nenhum
TIPO_DE_ACAO     │ create|edit|review|analyze|no-change
PROVA_MINIMA     │ commit abc1234 | seção X.Y | arquivo Z criado
ALTERACAO_REAL   │ sim|não
────────────────────────────────────────────────────────────────────
CHAIN
NEXT_ACTOR  │ @executor
NEXT_TASK   │ resumo curto
ACTIVATION  │ imediato|apos_conclusao|aguarda_gate
CONDITION   │ nenhuma|quando X fechar
────────────────────────────────────────────────────────────────────
CANALIZAÇÃO
CHAT      │ 🟢 mesmo | 🔴 novo
BRANCH    │ 🟢 nome-do-branch | 🔴 nome-do-branch
WORKTREE  │ 🟢 nome-do-worktree | 🔴 nome-do-worktree
NATUREZA  │ produto|governança|consolidação|operacional|mecânico
EXECUTOR  │ @executor
ESTADO    │ done|partial|blocked
ATIVA     │ resumo do que ficou vivo/aberto pós-handoff
════════════════════════════════════════════════════════════════════
```

### Campos obrigatórios

| Seção | Campo | Valor quando vazio |
|---|---|---|
| HANDOFF | `FEITO` | mínimo 1 linha |
| HANDOFF | `NAO_FEITO` | `—` |
| HANDOFF | `BLOQUEIOS` | `—` |
| HANDOFF | `ADAPTACOES` | `—` |
| HANDOFF | `ARQUIVOS` | `nenhum` |
| HANDOFF | `IMPACTO` | `baixo` / `medio` / `alto` |
| HANDOFF | `PROX_PASSO` | mínimo 1 linha |
| HANDOFF | `SUGESTOES` | `—` |
| HANDOFF | `DECISAO_REC` | mínimo 1 linha |
| EVIDENCE | `ARQUIVOS_TOCADOS` | `nenhum` |
| EVIDENCE | `TIPO_DE_ACAO` | obrigatório |
| EVIDENCE | `PROVA_MINIMA` | obrigatório |
| EVIDENCE | `ALTERACAO_REAL` | `sim` / `não` |
| CHAIN | `NEXT_ACTOR` | obrigatório |
| CHAIN | `NEXT_TASK` | mínimo 1 linha |
| CHAIN | `ACTIVATION` | obrigatório |
| CHAIN | `CONDITION` | `nenhuma` |
| CANALIZAÇÃO | todos | obrigatórios |

### Regras de preenchimento

- 1 linha por campo (preferencial) — se longo: truncar com `[ver ledger]`
- Nunca omitir campo — usar `—` quando não aplicável
- `STATUS:partial` → `NAO_FEITO` preenchido obrigatório
- `STATUS:blocked` → `BLOQUEIOS` preenchido obrigatório
- Semáforo CANALIZAÇÃO: 🟢 alinhado / 🔴 desvio ou atenção

---

## 3. CANALIZACAO_TABLE (compatibilidade)

> Bloco legado mantido para referência. Usar o bloco único da seção 2.

---

## 4. RELATORIO_MAE_TABLE (Codex)

Bloco de entrada do relatório consolidado que o Codex emite ao owner.
Usado como cabeçalho do relatório-mãe canônico (ver `ops/CODEX_CONSOLIDATOR.md`).

### Template de cabeçalho

```
RELATÓRIO-MÃE ════════════════════════════════════════════════════════════
@codex │ MODELO:xxx │ FASE/ONDA:id │ DATA:YYYY-MM-DD
───────────────────────────────────────────────────────────────────────────
PIONEIROS LIDOS  │ @claude | @copilot | @cursor | ...
HANDOFFS LIDOS   │ N handoffs (TASK-A | TASK-B | TASK-C | ...)
TAREFAS DONE     │ N
TAREFAS PARTIAL  │ N
TAREFAS BLOCKED  │ N
BLOQUEIOS ATIVOS │ B-001 | B-002 | ... — ou: nenhum
CONFLITOS        │ resumo — ou: nenhum detectado
PROX_PASSOS      │ 1)... ; 2)... ; 3)...
DECISAO_REC      │ recomendação do Codex
RISCO            │ baixo|medio|alto + justificativa curta
INFERENCIAS      │ nenhuma — ou: ⚠️ lista de inferências marcadas
═══════════════════════════════════════════════════════════════════════════
```

> O relatório-mãe completo (com tabelas detalhadas por seção) segue abaixo do cabeçalho.
> Ver `ops/CODEX_CONSOLIDATOR.md` para o blueprint completo.

---

## 5. ORDEM DE OUTPUT POR SESSÃO

Todo executor, ao encerrar uma sessão com handoff, emite **nesta ordem**:

```
[contexto livre opcional — antes do bloco]

1. BLOCO ÚNICO — seção 2 (HANDOFF + EVIDENCE + CHAIN + CANALIZAÇÃO em um código só)
```

Um bloco. Um clique. Tudo copiado.
Nunca substituir o bloco por tabelas markdown ou texto solto.

---

## 8. EVIDENCE — Referência de Valores (integrado no bloco único)

> O EVIDENCE está embutido na seção 2 (bloco único). Esta seção é referência de valores válidos.

| Campo | Valores válidos |
|---|---|
| `TIPO_DE_ACAO` | `create` / `edit` / `review` / `analyze` / `no-change` |
| `PROVA_MINIMA` | commit id / seção alterada / arquivo criado / `analysis-only` |
| `ALTERACAO_REAL` | `sim` / `não` |

| TIPO | PROVA exigida | ALTERACAO_REAL |
|---|---|---|
| `create` | arquivo criado + commit id | `sim` |
| `edit` | seção/linha/campo + commit id | `sim` |
| `review` | o que foi revisto + conclusão | `não` |
| `analyze` | `analysis-only` | `não` |
| `no-change` | motivo (bloqueio / desnecessário) | `não` |

---

## 6. IDENTIDADE OPERACIONAL

A forma de saída é parte da identidade do sistema Eternal Nexus OS.

| Princípio | Regra |
|---|---|
| Estrutura imutável | Os campos HANDOFF_TABLE e CANALIZACAO_TABLE não mudam |
| Beleza pode variar | Pioneiros podem adicionar separadores, emojis, decoração extra |
| Layout base não varia | Mesma ordem de campos, mesmos nomes, mesmo tipo de bloco |
| Copiabilidade garantida | Sempre em bloco de código — nunca em parágrafo solto |
| Consistência entre pioneiros | @claude, @codex, @copilot, @cursor usam o mesmo padrão |

---

## 7. LOCALIZAÇÃO CANÔNICA

| Artefato | Localização |
|---|---|
| Este padrão | `ops/OUTPUT_STANDARD.md` |
| Referência no FOL | `ops/FOL.md` seção 10 |
| Blueprint do relatório-mãe | `ops/CODEX_CONSOLIDATOR.md` |
| Template pack visual vivo | `ops/VISUAL_TEMPLATE_PACK_002A.md` |

---

## 9. CAMADA VIVA (VISUAL-SPINE-002A)

Esta seção ativa presença visual sem alterar o schema fixo.

### O que permanece imutável
- Nomes de blocos (`HANDOFF_TABLE`, `CANALIZACAO_TABLE`)
- Ordem dos campos obrigatórios
- Regra de bloco copiável único

### O que pode variar
- Linha curta de atmosfera antes do handoff
- Assinatura textual do pioneiro (ex.: `AURA_CURSOR:`)
- Separadores premium/clean sem quebrar legibilidade

### Princípio de aplicação

> Conteúdo manda. Visual acelera leitura.
> Se houver conflito entre estética e rastreabilidade, vence rastreabilidade.

### Referências desta camada
- `docs/DOC_VISUAL_SPINE_001.md`
- `docs/DOC_VISUAL_SPINE_002A.md`
- `ops/VISUAL_TEMPLATE_PACK_002A.md`

---

*OUTPUT_STANDARD.md v1 — selado em 2026-03-20 | claude-sonnet-4-6 | OPS-OUTPUT-001*
*OUTPUT_STANDARD.md v1.1 — seção 8 + ordem de output actualizada em 2026-03-20 | claude-sonnet-4-6 | OPS-EVIDENCE-BLOCK-001*
*OUTPUT_STANDARD.md v2.0 — bloco único copiável (HANDOFF+EVIDENCE+CHAIN+CANALIZAÇÃO) em 2026-03-21 | claude-sonnet-4-6 | OPS-OUTPUT-HANDOFF-V2*
*OUTPUT_STANDARD.md v1.2 — camada viva integrada em 2026-03-20 | gpt-5.3-codex-high | VISUAL-SPINE-002A*
