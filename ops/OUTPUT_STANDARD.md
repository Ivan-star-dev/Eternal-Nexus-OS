# OUTPUT STANDARD — Padrão Canônico de Output Copiável

**Versão:** v1
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

## 2. HANDOFF_TABLE

Bloco copiável único de handoff. Sempre dentro de bloco de código para garantir 1 clique de cópia.

### Template

```
HANDOFF ═══════════════════════════════════════════════════════════════════
@executor │ MODELO:xxx │ TASK:id-nome │ STATUS:done|partial|blocked
───────────────────────────────────────────────────────────────────────────
FEITO       │ resumo curto do que foi entregue
NAO_FEITO   │ resumo curto do que ficou fora — ou: —
BLOQUEIOS   │ resumo curto dos bloqueios ativos — ou: —
ADAPTACOES  │ resumo curto dos desvios do plano — ou: —
ARQUIVOS    │ file1 | file2 | file3 — ou: nenhum
IMPACTO     │ baixo|medio|alto
PROX_PASSO  │ resumo curto do próximo passo recomendado
SUGESTOES   │ 1)... ; 2)... ; 3)...
DECISAO_REC │ quem entra depois / quem espera
═══════════════════════════════════════════════════════════════════════════
```

### Campos obrigatórios

| Campo | Obrigatório | Valor quando vazio |
|---|---|---|
| `@executor` | sim | — |
| `MODELO` | sim | — |
| `TASK` | sim | — |
| `STATUS` | sim | `done` / `partial` / `blocked` |
| `FEITO` | sim | mínimo 1 linha |
| `NAO_FEITO` | sim | `—` se nada ficou fora |
| `BLOQUEIOS` | sim | `—` se nenhum |
| `ADAPTACOES` | sim | `—` se nenhum desvio |
| `ARQUIVOS` | sim | `nenhum` se nada foi tocado |
| `IMPACTO` | sim | `baixo` / `medio` / `alto` |
| `PROX_PASSO` | sim | mínimo 1 linha |
| `SUGESTOES` | sim | `—` se não houver |
| `DECISAO_REC` | sim | mínimo 1 linha |

### Regras de preenchimento

- Valores curtos: 1 linha por campo preferencial
- Se o conteúdo for longo: truncar com `[ver ledger]` e detalhar no HANDOFF_LEDGER
- Nunca omitir um campo — usar `—` quando não aplicável
- `STATUS:partial` exige `NAO_FEITO` preenchido
- `STATUS:blocked` exige `BLOQUEIOS` preenchido

---

## 3. CANALIZACAO_TABLE

Bloco copiável único de estado de canalização. Sempre junto ao HANDOFF_TABLE.

### Template

```
CANALIZAÇÃO ═══════════════════════════════════════════════════════════════
CHAT        │ 🟢|🔴 mesmo|novo
BRANCH      │ 🟢|🔴 nome-do-branch
WORKTREE    │ 🟢|🔴 nome-do-worktree
NATUREZA    │ produto|governança|consolidação|operacional|mecânico
EXECUTOR    │ @executor
ESTADO      │ done|partial|blocked
ATIVA       │ resumo do estado ativo pós-handoff — o que ficou vivo/aberto
═══════════════════════════════════════════════════════════════════════════
```

### Campos obrigatórios

| Campo | Obrigatório | Semáforo |
|---|---|---|
| `CHAT` | sim | 🟢 mesmo / 🔴 novo |
| `BRANCH` | sim | 🟢 alinhado / 🔴 desalinhado |
| `WORKTREE` | sim | 🟢 ativo / 🔴 encerrado |
| `NATUREZA` | sim | categoria da task |
| `EXECUTOR` | sim | @pioneiro ativo |
| `ESTADO` | sim | `done` / `partial` / `blocked` |
| `ATIVA` | sim | o que ficou aberto/ativo pós-handoff |

### Regra do semáforo

- 🟢 = estado esperado, alinhado, sem fricção
- 🔴 = desvio, desalinhamento ou atenção necessária

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
1. HANDOFF_TABLE     — bloco de código copiável
2. CANALIZACAO_TABLE — bloco de código copiável
```

Opcionalmente, antes dos dois blocos, pode vir texto livre de contexto.
Nunca substituir os blocos por texto livre.

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

---

*OUTPUT_STANDARD.md v1 — selado em 2026-03-20 | claude-sonnet-4-6 | OPS-OUTPUT-001*
