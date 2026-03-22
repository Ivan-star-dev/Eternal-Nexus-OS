# UNIVERSAL_PROBLEM_DECOMPOSITION_ENGINE.md

**Versão:** v1.0
**Data:** 2026-03-22
**Task:** UPDE-001
**Branch:** `claude/rebuild-bastion-core-rihGX`
**Modelo:** claude-sonnet-4-6
**Aprovado por:** owner (instrução direta)

---

## MISSÃO

Formalizar o motor de decomposição que converte qualquer problema bruto em fragmentos funcionais que a máquina consegue triar, confirmar, rotear e resolver.

---

## FRASE CANÔNICA

> O problema entra como massa bruta e sai como produto porque a máquina sabe triá-lo, fragmentá-lo, confirmar sua natureza e conduzi-lo ao bloco exato onde a sua resolução se torna inevitável.

---

## LEI CENTRAL

A decomposição não é sobre encontrar a solução.
É sobre encontrar o **átomo funcional correcto** — a unidade mínima que:
- pertence claramente a um domínio
- pode ser validada por um bloco especializado
- tem output mensurável
- pode ser recombinada com outros átomos

---

# FAMÍLIA 1 — PROBLEM INTAKE SCHEMA

Todo problema que entra na máquina é lido como objecto estruturado:

```
PROBLEM_INTAKE
───────────────────────────────────────────────
tipo:            [visual | structural | functional |
                  governance | infra | brand | learning |
                  research | financial | environment |
                  corporate | product | security | other]

domínio:         [bloco primário provável]

urgência:        [imediata | sprint | backlog | research]

escopo:          [local | multi-bloco | sistémico | estratégico]

output_desejado: [artefacto | produto | decisão | implementação |
                  protocolo | análise | refactor | doc]

blocos_prováveis: [lista de blocos activáveis]

maturidade:      [V1–V10 esperado]

impacto:         [baixo | médio | alto | crítico]
───────────────────────────────────────────────
```

Se o problema não puder preencher este schema minimamente → retornar ao owner para clarificação.

---

# FAMÍLIA 2 — FLUXO CANÔNICO DE DECOMPOSIÇÃO

```
PROBLEMA BRUTO
      ↓
INTAKE SCHEMA  ←── valida tipo, domínio, urgência, escopo
      ↓
FRAGMENTAÇÃO   ←── quebra em subproblemas com domínios distintos
      ↓
TRIAGEM ATÓMICA ←── cada fragmento é triado até encontrar átomo funcional
      ↓
CONFIRMAÇÃO DE NATUREZA ←── valida: este é realmente o lugar certo?
      ↓
GRAFO DE DOMÍNIO ←── mapeia onde cada átomo vive
      ↓
ACTIVAÇÃO DE NÚCLEOS
      ↓
RESOLUÇÃO LOCAL
      ↓
RECONCILIAÇÃO
      ↓
OUTPUT
```

---

# FAMÍLIA 3 — FRAGMENTAÇÃO

## Regra

Um problema raramente tem apenas um domínio.
A máquina divide o problema em partes que podem ter **donos diferentes**.

## Dimensões de fragmentação

| Dimensão | Pergunta |
|----------|---------|
| **Domínio** | Visual? Funcional? Estrutural? Outro? |
| **Bloco** | Qual bloco da máquina resolve isto? |
| **Camada** | Interface? Dados? Infra? Produto? |
| **Dependência** | Este fragmento depende de outro? |
| **Maturidade** | Qual nível V1–V10 é pedido? |
| **Cooperação** | Requer mais de um núcleo? |

## Output da fragmentação

Lista de fragmentos, cada um com:
- `id`
- `domínio`
- `bloco_provável`
- `dependências`
- `output_esperado`
- `maturidade`

---

# FAMÍLIA 4 — TRIAGEM ATÓMICA EM CASCATA

A triagem opera em múltiplas camadas até o fragmento encontrar o seu domínio final.

## Camadas de triagem

```
CAMADA 1: Domain Triage
→ visual / structural / functional / research / learning /
  ecosystem / corporação / infra / AI / docs / finance /
  environment / security

CAMADA 2: Block Triage
→ qual dos N blocos da máquina é dono deste fragmento?

CAMADA 3: Ownership Triage
→ que pioneer / modelo / agente executa?

CAMADA 4: Maturity Triage
→ V1 (forma bruta) a V10 (produto canónico)
  qual nível de resolução é pedido?

CAMADA 5: Workspace Triage
→ branch / worktree / ambiente de execução?

CAMADA 6: Execution Triage
→ executa só / coopera / escala?
```

---

# FAMÍLIA 5 — ÁTOMO FUNCIONAL

## Definição

O átomo funcional é a unidade mínima de problema que:
1. pertence inequivocamente a um domínio
2. pode ser dado a um único bloco especializado
3. tem um output verificável
4. não pode ser fragmentado mais sem perder significado

## Quando parar a fragmentação?

Parar quando:
- o fragmento tem domínio claro
- tem owner claro
- tem output verificável
- não depende de outro fragmento não-resolvido

Continuar quando:
- o fragmento ainda tem 2+ domínios em conflito
- não tem owner claro
- o output é ambíguo
- tem dependência não-resolvida acima de si

---

# FAMÍLIA 6 — CONFIRMAÇÃO DE NATUREZA

Antes de activar qualquer núcleo, o sistema valida:

```
CONFIRMAÇÃO DE NATUREZA
─────────────────────────────────
1. Este fragmento é realmente deste domínio?
2. O bloco confirmado tem maturidade para resolver?
3. A solução deve ser local, cooperativa ou sistémica?
4. Existe dependência pendente que bloqueia?
5. O output esperado está claro?
─────────────────────────────────
PASS → activar núcleo
FAIL → retornar ao fragmentador ou escalar ao owner
```

---

# FAMÍLIA 7 — RESOLUÇÃO LOCAL

Cada núcleo activado resolve a sua parte em isolamento soberano.

## Regra de isolamento

O núcleo não resolve o problema inteiro.
Ele resolve **apenas o átomo** que lhe pertence.

## Regra de output

Cada núcleo devolve:
- output primário (artefacto, código, doc, decisão)
- estado: `resolved | partial | blocked | escalated`
- dependências abertas (se existirem)

---

# FAMÍLIA 8 — RECONCILIAÇÃO

Depois de todos os núcleos resolverem os seus átomos, a reconciliação junta tudo.

## Problemas que a reconciliação resolve

| Problema | Mecanismo |
|---------|-----------|
| Conflitos entre outputs | Regra de precedência por domínio soberano |
| Lacunas entre fragmentos | Detecção de gap + retorno ao fragmentador |
| Saídas que dependem de sequência | Ordenação por grafo de dependências |
| Outputs inconsistentes com V10 | V10 upgrade rule aplicada |

## Output da reconciliação

Um artefacto único, coerente, que representa a solução completa do problema original.

---

# FAMÍLIA 9 — REGRAS DE FALHA E ESCALAÇÃO

| Condição | Acção |
|---------|-------|
| Problema não preenche intake schema | Devolver ao owner para clarificação |
| Fragmento não encontra domínio em 3 triagens | Escalar para orquestrador |
| Confirmação de natureza falha | Retornar ao fragmentador |
| Núcleo bloqueado por dependência | Registar e prosseguir outros átomos |
| Reconciliação com gap crítico | Reactivar fragmentador para gap |
| Output abaixo de maturidade pedida | Aplicar V10 upgrade rule |

---

# FAMÍLIA 10 — CHECKLIST DE DECOMPOSIÇÃO

1. Intake schema preenchido?
2. Problema fragmentado em átomos com domínios distintos?
3. Triagem em 6 camadas aplicada a cada fragmento?
4. Átomo funcional mínimo confirmado?
5. Natureza validada antes da activação?
6. Núcleos activados com isolamento soberano?
7. Reconciliação executada?
8. Output verificado contra maturidade pedida?

---

```
universal_problem_decomposition_engine_initialized   ✓
intake_schema_definido                               ✓
fluxo_canonico_6_camadas                             ✓
atomo_funcional_definido                             ✓
confirmacao_de_natureza_formalizada                  ✓
reconciliacao_engine_definida                        ✓
```

---

_UNIVERSAL_PROBLEM_DECOMPOSITION_ENGINE v1.0 — cravado em 2026-03-22 | @claude | UPDE-001_
