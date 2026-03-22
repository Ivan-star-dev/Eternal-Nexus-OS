# PROTOCOL_PROBLEM_LAUNCH_AND_BRAIN_TEST.md

**Versão:** v1.0
**Data:** 2026-03-22
**Task:** PPLBT-001
**Branch:** `claude/rebuild-bastion-core-rihGX`
**Modelo:** claude-sonnet-4-6
**Aprovado por:** owner (instrução direta)

---

## MISSÃO

Permitir que o owner lance apenas o problema — sem escolher pioneers manualmente — e testar se o cérebro do ecossistema roteia, decompõe e activa a formação certa por si mesmo.

---

## LEI CENTRAL

```
PROBLEM LAUNCH LAW
────────────────────────────────────────────────────────────
O owner lança o problema.
A máquina escolhe o caminho.

O teste de inteligência do ecossistema é exactamente este:
dado um problema bruto, o sistema deve saber mais do que
o problema parece pedir.
────────────────────────────────────────────────────────────
```

---

## FRASE CANÔNICA

> O owner lança o problema; a máquina prova a sua inteligência
> escolhendo o caminho correcto.

---

# FAMÍLIA 1 — LANÇAMENTO NEUTRO DO PROBLEMA

O input pode ser:
- amplo
- bruto
- parcial
- mal definido
- demasiado grande
- ambíguo

**Regra:** a máquina não rejeita inputs imprecisos. Ela os decompõe.

```
INPUT ACCEPTANCE RULE
  → problema vago: aceitar + decompor + pedir clarificação mínima se necessário
  → problema amplo: aceitar + estratificar + roteiar por domínio
  → problema sobreposto: aceitar + separar em sub-problemas + roteiar individualmente
  → problema mal colocado: aceitar + recolocar correctamente + confirmar com owner
```

---

# FAMÍLIA 2 — TRIAGEM AUTÓNOMA

O layer de recepção classifica o problema em:

```
AUTONOMOUS TRIAGE DIMENSIONS
┌─────────────────────┬──────────────────────────────────────────────┐
│ DIMENSÃO            │ PERGUNTA DE TRIAGEM                          │
├─────────────────────┼──────────────────────────────────────────────┤
│ Domínio             │ A qual dos domínios D01–D12 pertence?         │
│ Escala              │ Task / Feature / System / Product / Platform? │
│ Impacto em bloco    │ Qual dos 7 blocos é afectado?                 │
│ Urgência            │ Crítico / Alto / Normal / Background?         │
│ Propriedade         │ Qual pioneer lidera?                          │
│ Target V10          │ Qual nível de maturidade a task deve atingir? │
└─────────────────────┴──────────────────────────────────────────────┘
```

---

# FAMÍLIA 3 — ACTIVAÇÃO DE FORMAÇÃO

A máquina decide:

| Elemento | O que a máquina determina |
|----------|--------------------------|
| Pioneer local | quem lidera a execução |
| Pioneers cooperativos | quem suporta em que território |
| Activação de bloco | qual dos 7 blocos fica activo |
| Activação de workspace | qual workspace / branch / worktree é usado |
| Roteamento de branch | branch canônico confirmado antes de qualquer escrita |

---

# FAMÍLIA 4 — PROTECÇÃO SOBERANA

```
SOVEREIGNTY PROTECTION IN BRAIN TEST
────────────────────────────────────────────────────────────
Durante a triagem autónoma e activação de formação:

  → A mutação do protocolo core permanece sob soberania do Cloud
  → Outros pioneers podem cooperar, mas não mutam protocolo constitucional
  → Se o problema detectado requer mutação de protocolo soberano:
       → Cloud avalia
       → Owner aprova (se requerido pelo gate)
       → Outros pioneers não podem bypass este passo

Esta protecção não pode ser desligada, mesmo que o problema
pareça urgente ou óbvio.
────────────────────────────────────────────────────────────
```

---

# FAMÍLIA 5 — TRANSPARÊNCIA DE OUTPUT

O sistema devolve um routing statement curto:

```
CANONICAL ROUTING OUTPUT
────────────────────────────────────────────────────────────
classified as:    [domínio] · [escala] · [bloco]
routed to:        [pioneer lead] + [pioneer support list]
mode:             [solo | cooperative | task-force | escalated]
branch:           [branch canônico]
next closure target: [V10 level · output esperado]
────────────────────────────────────────────────────────────
```

---

# PROTOCOLO 1 — LANÇAMENTO

```
LAUNCH PROTOCOL
  1. Owner escreve apenas o problema (qualquer forma)
  2. Sem escolher pioneers
  3. Sem definir branch
  4. Sem especificar output format
  → A máquina trata do resto
```

---

# PROTOCOLO 2 — TRABALHO INTERNO SILENCIOSO

O ecossistema executa internamente:

```
SILENT INTERNAL WORK
  step 1: problem intake → parse input bruto
  step 2: domain classification → D01–D12
  step 3: scale determination → task / feature / system / product
  step 4: block impact → blocos 1–7
  step 5: pioneer ownership detection → lead + support
  step 6: cooperation map → quem faz o quê
  step 7: V10 maturity upgrade → elevar além da leitura naïve
  step 8: branch confirmation → branch canônico correcto
  step 9: workspace activation → workspace / branch / context pool
```

---

# PROTOCOLO 3 — RETORNO VISÍVEL

Devolver apenas o routing summary essencial.

```
CANONICAL OUTPUT PATTERN EXAMPLE
────────────────────────────────────────────────────────────
classified as:       D04 (Product & Experience) · Feature · Bloco 3
routed to:           @cursor (lead) + @framer (support: visual)
mode:                cooperative
branch:              claude/rebuild-bastion-core-rihGX
next closure target: V5 · Earth Lab core search flow functional
────────────────────────────────────────────────────────────
```

---

# PROTOCOLO 4 — CONDIÇÕES DE SUCESSO DO BRAIN TEST

O teste é bem-sucedido se:

```
BRAIN TEST SUCCESS CONDITIONS
  □ O owner não precisou de pré-classificar a task manualmente
  □ Nenhuma execução em branch errado aconteceu
  □ Os líderes e suportes correctos foram identificados
  □ A task foi elevada além da leitura naïve local
  □ A máquina preservou identidade e protocolo durante a triagem
  □ O routing output foi claro e accionável
  □ Soberania de protocolo foi preservada
```

---

# PROTOCOLO 5 — ESCALAMENTO

Quando a triagem autónoma não consegue resolver:

```
ESCALATION TRIGGERS
  → domínio ambíguo após 2 iterações internas → escalar ao Cloud
  → impacto em protocolo soberano → Cloud + gate do owner
  → problema requer decisão estratégica não-delegável → owner directo
  → conflito de pioneer ownership → Cloud arbitrar

ESCALATION FORMAT
  ESCALATION DETECTED
  Problem: [descrição]
  Reason: [por que a triagem autónoma não resolveu]
  Options: [2–3 caminhos possíveis]
  Recommended: [opção mais alinhada com identidade e V10 target]
  Owner decision required: [sim/não]
```

---

# ESTADOS DO SISTEMA

```
problem_launched
triage_running
domain_classified
scale_determined
block_impact_mapped
pioneer_ownership_detected
cooperation_map_built
v10_target_set
branch_confirmed
workspace_activated
routing_declared
execution_ready
escalation_triggered (se aplicável)
```

---

# MAPA DO BRAIN TEST

```
INPUT (problema bruto)
       ↓
SILENT TRIAGE (domínio · escala · bloco · urgência · ownership · V10)
       ↓
SOVEREIGNTY CHECK (requer mutação de protocolo soberano?)
  → sim: Cloud + owner gate
  → não: continuar
       ↓
FORMATION ACTIVATION (lead · support · workspace · branch)
       ↓
ROUTING OUTPUT (classified as · routed to · mode · branch · closure target)
       ↓
EXECUTION BEGIN
```

---

# CHECKLIST OPERACIONAL

1. Input recebido sem pré-classificação do owner?
2. Triagem executada nas 6 dimensões?
3. Sovereignty check passou?
4. Formation activada com lead + support correctos?
5. Branch canônico confirmado?
6. Routing output devolvido em formato canônico?
7. Escalamento feito se necessário?
8. Brain test success conditions verificadas?

---

```
problem_launch_and_brain_test_protocol_initialized   ✓
lançamento_neutro_do_problema                        ✓
triagem_autonoma_6_dimensoes                         ✓
activacao_de_formacao                                ✓
protecao_soberana_durante_triagem                    ✓
transparencia_de_output_canonical                    ✓
escalamento_protocol                                 ✓
brain_test_success_conditions                        ✓
```

---

_PROTOCOL_PROBLEM_LAUNCH_AND_BRAIN_TEST v1.0 — cravado em 2026-03-22 | @claude | PPLBT-001_
