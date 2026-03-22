# NORTH_STAR_BEFORE_HARD_EXECUTION.md

**Versão:** v1.0
**Data:** 2026-03-22
**Task:** NSBHE-001
**Branch:** `claude/rebuild-bastion-core-rihGX`
**Modelo:** claude-sonnet-4-6
**Aprovado por:** owner (instrução direta — battalion readiness verdict)

---

## MISSÃO

Definir exactamente o que precisa de estar vivo no site — não em docs — antes de activar o batalhão total.

Três coisas. Nada mais, nada menos.

---

## LEI CENTRAL

```
NORTH STAR LAW
────────────────────────────────────────────────────────────
O batalhão não precisa de um produto perfeito antes de activar.
Precisa de um produto que já mostra o que está a ser construído.

North Star = o mínimo que faz o site parecer o produto real,
             não um protótipo com promessas.
────────────────────────────────────────────────────────────
```

---

## FRASE CANÔNICA

> Governança sem encarnação visual e funcional suficiente
> não justifica batalhão total.
> O North Star é o ponto de viagem mínima:
> quando o site o atingir, o batalhão pode entrar a cheio.

---

# AS 3 COISAS QUE PRECISAM DE ESTAR VIVAS

## NORTH STAR 1 — Visual Incarnated

**O que é:**
O site precisa de parecer Heaven Lab. Não parecer qualquer SaaS. Não parecer portal académico genérico.

**Como saber que está alcançado:**
```
NORTH STAR 1 — CRITÉRIOS DE VALIDAÇÃO
────────────────────────────────────────────────────────────
□ Alguém que nunca ouviu falar do projecto abre o site e sente:
    "isto não é normal"
    "isto parece um laboratório premium"
    "isto tem atmosfera própria"
    "isto parece feito com intenção muito específica"

□ O código emocional é legível visualmente:
    calmo         → sem ruído, sem agitação
    premium       → acabamento que não parece template
    científico    → presença de dados, rigor, estrutura visual
    espacial      → profundidade, glass, distância, vastidão
    contemplativo → silence como princípio, não como vazio

□ Heaven Lab feeling reconhecível sem ter lido os docs:
    → o site parece um santuário para pensar
    → não parece uma página de marketing
    → não parece uma dashboard morta

□ Soft cinematic motion presente:
    → transições com peso e intenção
    → elementos que revelam, não que animam por animar
    → movimento que serve o silêncio, não que o viola
────────────────────────────────────────────────────────────
```

**Quem valida:** owner (não é validação técnica — é validação emocional e sensorial)

**Responsável por alcançar:** @framer (design) + @antigravity (motion) + @claude (review canônico)

**Precondição:** Brand Mother System docs aprovados

---

## NORTH STAR 2 — Presence + Exploration Scaffolding

**O que é:**
O primeiro esqueleto material do produto raro. O suficiente para o site deixar de parecer "arquitectura definida sem corpo".

**Como saber que está alcançado:**
```
NORTH STAR 2 — CRITÉRIOS DE VALIDAÇÃO
────────────────────────────────────────────────────────────
□ Globe flagship experience tem presença de observatório:
    → não apenas render 3D
    → navegação com gravidade real (zoom com contexto)
    → data layers visíveis e legíveis
    → atmosfera que comunica "aqui o mundo é estudado"

□ World workspace truth é tangível:
    → existe ao menos 1 momento no site onde o utilizador
      sente que está num workspace científico real
    → não numa landing page de produto
    → não num dashboard de métricas
    → num lugar para pensar sobre o mundo

□ Signature moment existe:
    → pelo menos 1 interacção no site que define categoria
    → algo que outros produtos não têm
    → algo que o utilizador não espera e que fica na memória

□ Comparative feel funcional:
    → side-by-side de cenários, dados ou perspectivas
    → o produto deixa de ser "ver dados"
    → e começa a ser "comparar e pensar sobre dados"
────────────────────────────────────────────────────────────
```

**Quem valida:** owner (presença e atmosfera) + pioneiros técnicos (funcionalidade)

**Responsável por alcançar:** @cursor (build) + @framer (polish) + @antigravity (motion das features)

**Precondição:** North Star 1 alcançado (atmosfera base cravada antes das features)

---

## NORTH STAR 3 — First Wonder Layer Matter

**O que é:**
Não toda a Wonder Layer. Não a maioria. O suficiente para o produto ter
alma visível — para mostrar que o que foi canonizado não é apenas texto.

**Como saber que está alcançado:**
```
NORTH STAR 3 — CRITÉRIOS DE VALIDAÇÃO
────────────────────────────────────────────────────────────
□ Wonder Layer deixou de ser 95% ausente:
    → pelo menos 5–7 features canônicas visíveis e operacionais
    → não apenas botões ou placeholders
    → funcionalidade real, ainda que mínima

□ As 3 features que mais definem categoria estão presentes:
    → World Pulse (o mundo vivo em tempo real)
    → Scenario Forge ou Scenario Comparison (pensar sobre futuros)
    → Research Trails ou Hypothesis Boards (pensar em conjunto)

□ O produto tem matéria de wonder:
    → existe algo no site que faz o utilizador querer explorar
    → não apenas consumir informação
    → não apenas navegar por páginas
    → mas querer descobrir, comparar, aprofundar

□ A lacuna entre "visão descrita em docs" e "produto visível" fechou:
    → antes: "o produto é impressionante nos docs"
    → depois: "o produto é impressionante no site"
────────────────────────────────────────────────────────────
```

**Quem valida:** owner (sensação de produto raro) + equipa técnica (funcionalidade)

**Responsável por alcançar:** @cursor (build features) + @claude (arquitectura features) + @framer + @antigravity (experience polish)

**Precondição:** North Star 2 alcançado (presence + exploration base operacionais)

---

# RESUMO ULTRA-CURTO

```
NORTH STAR SUMMARY
══════════════════════════════════════════════════════════════════

NS-1  VISUAL INCARNATED
      → o site parece Heaven Lab, não um template premium qualquer

NS-2  PRESENCE + EXPLORATION SCAFFOLDING
      → existe world workspace truth, signature moment, comparative feel

NS-3  FIRST WONDER LAYER MATTER
      → 5–7 features da Wonder Layer vivas, produto tem alma visível

══════════════════════════════════════════════════════════════════
Quando os 3 estiverem alcançados:
  → batalhão total pode activar
  → hard execution mode declarado
  → o produto já mostra pelo que a guerra está sendo travada
══════════════════════════════════════════════════════════════════
```

---

# RELAÇÃO COM OUTROS DOCUMENTOS

| Documento | Como este North Star o serve |
|-----------|------------------------------|
| `BATTALION_READINESS_VERDICT.md` | BRV diagnosticou os gaps; este doc define o mínimo para fechá-los |
| `PRECONDITIONS_BEFORE_HARD_EXECUTION.md` | PBHE lista as pré-condições técnicas; este doc é o teste de realidade sensorial |
| `CANONICAL_PRE-BATTALION_SEQUENCE.md` | CPBS define a sequência; este doc define os marcos de chegada de cada fase |
| `CANONICAL_HARD_EXECUTION_ORDER.md` | CHEO define a ordem técnica; este doc é o teste de campo para cada fase |
| `PROJECT_CANONICAL_CHECKUP_MASTER.md` | Checkup identificou os gaps; este doc define o mínimo para sair de "promessa" |

---

# O QUE ESTE DOCUMENTO NÃO É

```
ESTE DOC NÃO É:
  → um requisito de produto completo antes de activar
  → um checklist de todas as features da Wonder Layer
  → um standard de produto finalizado
  → um motivo para atrasar o batalhão indefinidamente

ESTE DOC É:
  → o mínimo para o batalhão ter direcção real quando activar
  → o ponto de viagem onde o produto mostra o que é
  → o teste de realidade sensorial antes de escalar velocidade total
```

---

# VALIDAÇÃO CANÔNICA DO NORTH STAR

Quando o owner acredita que os 3 North Stars estão alcançados, a declaração canônica é:

```
NORTH STAR VALIDATION DECLARATION
══════════════════════════════════════════════════════════════════
Data: [YYYY-MM-DD]
Validado por: owner

NS-1 Visual Incarnated:        [ ALCANÇADO / PENDENTE ]
NS-2 Presence + Exploration:   [ ALCANÇADO / PENDENTE ]
NS-3 First Wonder Layer:       [ ALCANÇADO / PENDENTE ]

DECLARAÇÃO: [ NORTH STAR ATINGIDO — batalhão total pode activar ]
            [ NORTH STAR PENDENTE — continuar sequência pré-batalhão ]
══════════════════════════════════════════════════════════════════
```

---

```
north_star_before_hard_execution_defined   ✓
3_north_stars_com_criterios_de_validacao   ✓
validacao_sensorial_vs_tecnica             ✓
resumo_ultra_curto                         ✓
relacao_com_outros_docs                    ✓
declaracao_canonica_de_validacao           ✓
```

---

_NORTH_STAR_BEFORE_HARD_EXECUTION v1.0 — cravado em 2026-03-22 | @claude | NSBHE-001_
