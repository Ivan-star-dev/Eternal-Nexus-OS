# PROTOCOL_CLONED_SEQUENCE_EVOLUTION.md

**Versão:** v1.0
**Data:** 2026-03-22
**Task:** PCSE-001
**Branch:** `claude/rebuild-bastion-core-rihGX`
**Modelo:** claude-sonnet-4-6
**Aprovado por:** owner (instrução direta)

---

## MISSÃO

Formalizar a lei de sequência clonada:
toda melhoria feita no produto deve ter um equivalente de melhoria no ecossistema que constrói o produto.

---

## FRASE CANÔNICA

> Os pioneers não trabalham só para o produto.
> Trabalham também para a máquina que cria o produto.

---

## LEI CENTRAL

```
CLONED SEQUENCE LAW
───────────────────────────────────────────────────────
Para cada tipo de melhoria no produto,
existe um equivalente canônico no ecossistema.

Produto sobe → máquina sobe.
Máquina sobe → produto seguinte começa melhor.
───────────────────────────────────────────────────────
```

---

# FAMÍLIA 1 — O QUE É SEQUÊNCIA CLONADA

## Definição

Sequência clonada não significa fazer o mesmo trabalho duas vezes.
Significa que:

- quando um tipo de esforço é aplicado ao produto
- a mesma **família de esforço** deve ser considerada para o ecossistema

O output é diferente.
A natureza do esforço é a mesma.

## O que NÃO é

- não é duplicar tasks
- não é fazer o mesmo artefacto em dois lugares
- não é adicionar overhead a cada tarefa

O que É:
- avaliar, a cada task concluída no produto, se existe um equivalente de upgrade no ecossistema

---

# FAMÍLIA 2 — MAPA DE SEQUÊNCIAS CLONADAS

| Esforço no Produto | Equivalente Canônico no Ecossistema |
|-------------------|-------------------------------------|
| Refinamento visual (UI · brand · motion) | Refinamento visual-identitário do ecossistema (brand mother · system identity · doc visual coherence) |
| Melhoria estrutural de interface | Melhoria estrutural de protocolo · runtime · organização de ops |
| Ganho de funcionalidade | Ganho funcional na máquina de produção (routing · pools · triagem · capability) |
| Melhoria de qualidade de entrega | Melhoria da qualidade do processo de autoconstrução do ecossistema |
| Optimização de performance | Optimização de performance do próprio toolchain e pipelines |
| Refinamento de UX / jornada | Refinamento do pioneer experience · onboarding · fluxos internos |
| Maturação de feature (V1→V10) | Maturação de capability equivalente na máquina |
| Resolução de dívida técnica | Resolução de dívida de protocolo · doc · tooling |
| Abertura de novo domínio no produto | Abertura de novo domínio canônico no domain graph |
| Integração externa no produto | Integração equivalente na plugin fabric |

---

# FAMÍLIA 3 — REGRA DE AVALIAÇÃO

Após cada task significativa no produto, o orquestrador (Cloud) avalia:

```
CLONED SEQUENCE CHECK
──────────────────────────────────────────────────────
Task concluída no produto: [nome]
Família de esforço: [visual | structural | functional |
                    quality | performance | UX | maturation |
                    debt | domain | integration]

Pergunta: existe equivalente de upgrade no ecossistema desta família?
  → sim: registar como task candidata no BASTION
  → não (genuinamente irrelevante): registar motivo e fechar
  → talvez: escalar ao owner para decisão
──────────────────────────────────────────────────────
```

---

# FAMÍLIA 4 — DUPLA FRENTE OBRIGATÓRIA

Todo sprint / task force / sequência de maturação deve deixar:

```
FRENTE A — PRODUCT ADVANCEMENT
Pergunta: como o produto sobe neste ciclo?
Output: produto melhor (feature · qualidade · identidade · performance)

FRENTE B — ECOSYSTEM SELF-ADVANCEMENT
Pergunta: como a máquina que constrói o produto sobe neste ciclo?
Output: ecossistema melhor (routing · caps · protocols · tooling · bindings)
```

## Frequência

| Nível | Avaliação |
|-------|-----------|
| Task individual | opcional (só se relevante) |
| Sprint / ciclo | obrigatório no handoff |
| Major release | obrigatório com doc actualizado |
| V10 upgrade | obrigatório em ambas as frentes |

---

# FAMÍLIA 5 — PIONEIROS E SEQUÊNCIA CLONADA

Cada pioneer opera por território soberano.
Na sequência clonada, eles contribuem para o ecossistema **no seu domínio** — não no dos outros.

| Pioneer | Território no Produto | Equivalente Canônico no Ecossistema |
|---------|----------------------|-------------------------------------|
| @framer | visual · UI · motion | brand mother system · visual identity layer do ecossistema |
| @cursor | features · lógica · APIs | routing engine · capability blocks · functional machine layer |
| @copilot | lapidação · qualidade · estrutura | qualidade de protocolo · estrutura canônica · doc coherence |
| @antigravity | motion · 3D · world | spatial layer do sistema · world workspace identity |
| @claude | protocolo · arquitectura · governança | soberania de protocolo (único que muta core) |

---

# FAMÍLIA 6 — TRAVA CONTRA DRIFT

A sequência clonada **não permite**:

| Proibido | Motivo |
|---------|--------|
| Pioneer reescrever protocolo soberano | viola Família 1 de CLOUD_SOVEREIGN_PROTOCOL_SCOPE |
| Ecossistema crescer sem relação com o produto | deriva — o ecossistema existe para fabricar produtos |
| Produto subir sem considerar equivalente no ecossistema | perda de sequência — a máquina fica para trás |
| Upgrade por modismo sem equivalente funcional real | viola TECHNOLOGY EVOLUTION RULE |

---

# FAMÍLIA 7 — INTEGRAÇÃO COM V10 LINE

A sequência clonada respeita a V10 line:

```
V10 LINE — PRODUTO         V10 LINE — ECOSSISTEMA
────────────────────       ────────────────────────
V1 forma bruta         ←→  V1 capacidade bruta
V3 funcional sólido    ←→  V3 máquina funcional sólida
V5 identidade clara    ←→  V5 protocolo com identidade clara
V7 referência          ←→  V7 máquina de referência
V10 canônico flagship  ←→  V10 ecossistema canônico máximo
```

---

# FAMÍLIA 8 — CHECKLIST DE SEQUÊNCIA CLONADA

1. Task de produto concluída → família de esforço identificada?
2. Equivalente canônico no ecossistema avaliado?
3. Se existe equivalente → task candidata no BASTION?
4. Sprint handoff inclui estado de ambas as frentes?
5. Pioneer contribuiu apenas no seu território?
6. Protocolo soberano intacto?
7. V10 line de produto e ecossistema sincronizadas?

---

```
protocol_cloned_sequence_evolution_initialized   ✓
lei_central_definida                             ✓
mapa_de_sequencias_clonadas                      ✓
dupla_frente_obrigatoria_formalizada             ✓
trava_anti_drift                                 ✓
integracao_v10_line                              ✓
```

---

_PROTOCOL_CLONED_SEQUENCE_EVOLUTION v1.0 — cravado em 2026-03-22 | @claude | PCSE-001_
