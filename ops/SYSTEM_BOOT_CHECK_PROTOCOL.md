# SYSTEM_BOOT_CHECK_PROTOCOL.md

**Versão:** v1.0
**Data:** 2026-03-22
**Task:** SBCP-001
**Branch:** `claude/rebuild-bastion-core-rihGX`
**Modelo:** claude-sonnet-4-6
**Aprovado por:** owner (instrução direta)

---

## MISSÃO

Definir o ritual canônico de arranque de sessão e de validação de maturidade do ecossistema, usando as 6 siglas do núcleo comprimido como checagem obrigatória.

---

## LEI CENTRAL

```
SYSTEM BOOT LAW
────────────────────────────────────────────────────────────
Antes de executar qualquer task de sprint, o sistema verifica
se os 6 pilares do núcleo estão vivos.

Não é um ritual simbólico.
É uma checagem operacional com estados de resposta reais.

BOOT RESULT:
  → PASS: todos os 6 activos → executar task
  → PARTIAL: 1–2 gaps → documentar + mitigar + executar com nota
  → FAIL: 3+ gaps ou gap crítico → resolver antes de executar
────────────────────────────────────────────────────────────
```

---

## FRASE CANÔNICA

> O boot check não é burocracia — é o sistema a perguntar a si mesmo
> se está apto para agir com integridade completa.

---

# O RITUAL DE BOOT — FORMATO CURTO

```
SYSTEM BOOT CHECK
════════════════════════════════════════════════════

[✓/✗] PCSE — produto e ecossistema crescem juntos?
[✓/✗] ESER — auto-teste e auto-refinamento activos?
[✓/✗] CSPS — soberania de protocolo respeitada?
[✓/✗] POCR — memória omnipresente operacional?
[✓/✗] DMGS — ensino multiforme disponível?
[✓/✗] PPLBT — cérebro de roteamento activo?

════════════════════════════════════════════════════
BOOT RESULT: [ PASS / PARTIAL / FAIL ]
````

---

# PROTOCOLO DE CHECAGEM — 6 PILARES

## PILAR 1 — PCSE

**Pergunta de boot:**
> O sprint actual está a crescer produto e ecossistema em paralelo?

**Checagem operacional:**
```
PCSE BOOT CHECK
  □ existe pelo menos 1 task de produto activa?
  □ existe pelo menos 1 task de ecossistema/protocolo activa?
  □ a melhoria de ecossistema reflecte-se em capacidade de produto?
```

**Estados:**
```
pcse_pass      → ambas as trilhas activas e sincronizadas
pcse_partial   → apenas uma trilha activa
pcse_fail      → nenhuma trilha activa ou total desalinhamento
```

---

## PILAR 2 — ESER

**Pergunta de boot:**
> O ecossistema está a auto-testar-se em dimensões reais?

**Checagem operacional:**
```
ESER BOOT CHECK
  □ foi feita revisão nas 10 dimensões no sprint actual ou anterior?
  □ há pelo menos 1 dimensão com gap identificado e plano de correcção?
  □ o auto-teste não é apenas declarado — está a ser executado?
```

**As 10 dimensões (referência rápida):**
```
01 identidade · 02 produto · 03 dev excellence · 04 routing
05 protocolo  · 06 memória · 07 documentação    · 08 feature maturity
09 toolchain  · 10 V10 alignment
```

**Estados:**
```
eser_pass      → revisão recente com gaps identificados e plano
eser_partial   → revisão parcial (menos de 5 dimensões)
eser_fail      → sem revisão ou revisão apenas simbólica
```

---

## PILAR 3 — CSPS

**Pergunta de boot:**
> A soberania de protocolo está a ser respeitada nesta sessão?

**Checagem operacional:**
```
CSPS BOOT CHECK
  □ estou no branch canônico correcto?
  □ as tasks que vou executar estão dentro do meu escopo de pioneer?
  □ se há mutação de protocolo soberano, o gate do owner está aberto?
```

**Referência rápida da permission matrix:**
```
@cloud   → mutar protocolo constitucional
@owner   → gate + aprovação soberana
@cursor  → features + implementação
@framer  → design + tokens + visual
@copilot → lapidação + QA
```

**Estados:**
```
csps_pass      → branch correcto + escopo respeitado + gates verificados
csps_partial   → branch correcto mas 1 task fora de escopo sem gate
csps_fail      → branch errado OR mutação soberana sem gate OR escopo violado
```

---

## PILAR 4 — POCR

**Pergunta de boot:**
> Tudo o que for decidido hoje será gravado nos 5 lugares certos?

**Checagem operacional:**
```
POCR BOOT CHECK
  □ o HANDOFF_LEDGER está a ser actualizado por sessão?
  □ o LIVE_STATE reflecte o estado actual do ecossistema?
  □ há plano de captura (canon + didáctica + histórico) para as tasks de hoje?
```

**Os 5 lugares (referência rápida):**
```
01 forma canônica  → doc de protocolo/sistema/arquitectura
02 forma didáctica → material ensinável
03 forma histórica → HANDOFF_LEDGER + decision logs
04 inventário      → LIVE_STATE + referências de asset
05 refresh         → docs afectados marcados e actualizados
```

**Estados:**
```
pocr_pass      → plano de captura definido para todas as tasks de hoje
pocr_partial   → plano de captura para a maioria mas com gaps
pocr_fail      → sem plano de captura → risco de perda de conhecimento
```

---

## PILAR 5 — DMGS

**Pergunta de boot:**
> O que for produzido hoje pode ser convertido em ensino?

**Checagem operacional:**
```
DMGS BOOT CHECK
  □ os outputs de hoje têm pelo menos 1 forma didáctica planeada?
  □ o material existente está actualizado com a maturidade actual?
  □ há um caminho de reutilização identificado para o material?
```

**4 famílias de output (referência rápida):**
```
01 internal forms   → quick brief, concept guide, role guide
02 technical forms  → architecture lecture, protocol deep dive
03 public forms     → course outline, structured explainers
04 evidence forms   → proof of evolution, case studies
```

**Estados:**
```
dmgs_pass      → forma didáctica planeada + caminho de reutilização
dmgs_partial   → forma didáctica planeada mas sem caminho de reutilização
dmgs_fail      → nenhuma forma didáctica → risco de capital didáctico zero
```

---

## PILAR 6 — PPLBT

**Pergunta de boot:**
> O problema foi roteado pelo cérebro, não pelo owner manualmente?

**Checagem operacional:**
```
PPLBT BOOT CHECK
  □ a task foi classificada por domínio (D01–D12)?
  □ o pioneer lead foi determinado pelo sistema, não por impulso?
  □ o routing output (classified as · routed to · mode · branch · closure target) existe?
```

**Fluxo de boot rápido:**
```
problema → triagem 6D → formação → routing output → execução
```

**Estados:**
```
pplbt_pass      → triagem 6D executada + routing output produzido
pplbt_partial   → triagem parcial (< 4 dimensões)
pplbt_fail      → sem triagem → execução por impulso → risco de desvio
```

---

# TABELA DE RESULTADOS DO BOOT

```
BOOT RESULT TABLE
────────────────────────────────────────────────────────────
PASS     → todos os 6 pilares em estado pass
           → EXECUTAR task normalmente

PARTIAL  → 1–2 pilares em estado partial (nenhum em fail)
           → DOCUMENTAR os gaps
           → MITIGAR onde possível
           → EXECUTAR com nota de gap no HANDOFF

FAIL     → qualquer pilar em estado fail
    OU   → 3 ou mais pilares em estado partial
           → RESOLVER o gap crítico antes de executar
           → se não for possível resolver → comunicar ao owner
────────────────────────────────────────────────────────────
```

---

# BOOT CHECK — RITUAL COMPLETO (FORMATO LONGO)

```
══════════════════════════════════════════════════════════════
SYSTEM BOOT CHECK — ETERNAL NEXUS OS
Data: [YYYY-MM-DD]
Branch: [branch canônico]
Session: [pioneer + modelo]
══════════════════════════════════════════════════════════════

PILAR 1 — PCSE
  Estado: [ PASS / PARTIAL / FAIL ]
  Nota: [o que foi verificado / o que está em gap]

PILAR 2 — ESER
  Estado: [ PASS / PARTIAL / FAIL ]
  Nota: [dimensões verificadas / dimensões com gap]

PILAR 3 — CSPS
  Estado: [ PASS / PARTIAL / FAIL ]
  Nota: [branch confirmado / escopo verificado / gates]

PILAR 4 — POCR
  Estado: [ PASS / PARTIAL / FAIL ]
  Nota: [plano de captura definido / gaps de captura]

PILAR 5 — DMGS
  Estado: [ PASS / PARTIAL / FAIL ]
  Nota: [formas didácticas planeadas / caminho de reutilização]

PILAR 6 — PPLBT
  Estado: [ PASS / PARTIAL / FAIL ]
  Nota: [triagem executada / routing output produzido]

══════════════════════════════════════════════════════════════
BOOT RESULT: [ PASS / PARTIAL / FAIL ]
ACTION:      [ executar / executar com nota / resolver primeiro ]
══════════════════════════════════════════════════════════════
```

---

# QUANDO EXECUTAR O BOOT CHECK

```
BOOT CHECK TRIGGERS
  → início de nova sessão de trabalho
  → início de novo sprint
  → após mudança de branch canônico
  → após mudança de pioneer lead
  → antes de qualquer task de alta urgência
  → sempre que owner solicitar validação de estado
```

---

# RELAÇÃO COM OUTROS PROTOCOLOS

| Protocolo | Como o boot check o serve |
|-----------|--------------------------|
| `CLAUDE.md` | CSPS verifica branch + gate antes de qualquer escrita |
| `BASTION.md` | PPLBT verifica se task tem gate aberto |
| `LIVE_STATE.md` | POCR verifica se estado está actualizado |
| `HANDOFF_LEDGER.md` | POCR verifica se handoff está a ser feito |
| `ECOSYSTEM_SELF_EVOLUTION_ROUTINE.md` | ESER é a implementação directa |
| `PROTOCOL_CLONED_SEQUENCE_EVOLUTION.md` | PCSE é a implementação directa |

---

# ESTADOS DO SISTEMA

```
system_boot_check_protocol_initialized
boot_check_running
pilar_pcse_checked
pilar_eser_checked
pilar_csps_checked
pilar_pocr_checked
pilar_dmgs_checked
pilar_pplbt_checked
boot_result_pass
boot_result_partial
boot_result_fail
execution_authorized
execution_blocked_resolve_first
```

---

# CHECKLIST OPERACIONAL

1. Boot check executado no início da sessão?
2. Todos os 6 pilares verificados?
3. Estado de cada pilar registado?
4. Boot result determinado (PASS / PARTIAL / FAIL)?
5. Action tomada de acordo com o resultado?
6. Gaps documentados no HANDOFF se PARTIAL?
7. Gaps críticos resolvidos antes de executar se FAIL?

---

```
system_boot_check_protocol_initialized   ✓
ritual_de_boot_formato_curto             ✓
ritual_de_boot_formato_longo             ✓
6_pilares_com_checagem_operacional       ✓
estados_de_cada_pilar                    ✓
tabela_de_resultados_pass_partial_fail   ✓
triggers_de_boot_check                   ✓
relacao_com_outros_protocolos            ✓
```

---

_SYSTEM_BOOT_CHECK_PROTOCOL v1.0 — cravado em 2026-03-22 | @claude | SBCP-001_
