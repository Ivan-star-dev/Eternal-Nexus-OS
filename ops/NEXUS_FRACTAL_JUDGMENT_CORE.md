# NEXUS FRACTAL JUDGMENT CORE

**Versão:** v2.0
**Data:** 2026-03-23
**Task:** NEXUS-FRACTAL-JUDGMENT-CORE-001
**Branch:** `claude/rebuild-bastion-core-rihGX`
**Modelo:** claude-sonnet-4-6
**Aprovado por:** owner (autorização direta — 2026-03-23)

> O NEXUS FRACTAL JUDGMENT CORE é a peça canônica de julgamento do Eternal Nexus.
> Decide o que entra, o que não entra, o que refina, o que salva, o que reconstrói e o que sobe para owner-only.
> O sistema já sabe organizar, mover, mobilizar, convergir e adaptar.
> Esta peça decide o que merece entrar no fluxo — e a que custo, risco e alinhamento.
> Toda sentença sai daqui — una, clara, irrevogável salvo pelo owner.

---

## FRACTAL_JUDGMENT_CORE

```
O_QUE_E:
  Núcleo fractal de decisão do sistema. Avalia qualquer input antes de entrar no fluxo
  de execução. Autofragmenta-se em nós especializados, coleta pareceres e recomprime
  numa sentença única. Não é um comité — é um processo determinístico com pesos,
  limiares e veto soberano.

O_QUE_JULGA:
  - tasks novas (elegibilidade + prioridade)
  - artefactos (alinhamento canônico + qualidade)
  - features e fluxos (valor + risco + flagship alignment)
  - protocolos e governança (coerência + continuidade)
  - propostas do owner (impacto + viabilidade)
  - PRs e branches (integridade + território)
  - decisões de merge e deploy (risco + estado)
  - material didático e visual (aderência à visão-mãe)

QUANDO_ATIVA:
  - novo input chega ao sistema (task / feature / artefacto / protocolo)
  - gate é aberto no BASTION
  - PR ou branch está em revisão
  - conflito entre dois caminhos de execução
  - owner pede diagnóstico de valor antes de decidir
  - sistema detecta deriva

O_QUE_IMPEDE:
  - veto do owner (NÓ 7) — suspende avaliação imediatamente
  - red line no DNA_PROTOCOL — rejeição imediata
  - dados insuficientes para calcular JVF — escala para owner-only
  - conflito irresolvível entre NÓ 1 e NÓ 2 — escala para owner-only
  - branch canônico incorreto — bloqueia até correcção
```

---

## FRACTAL_COUNCIL_MATRIX

| FRAGMENTO | DOMÍNIO | PESO | TIPO_DE_PARECER | PODE_VETAR | OWNER_ONLY |
|---|---|---|---|---|---|
| DNA_PROTOCOL | lei primária · red lines · identidade | 3 | binário (passa/falha) | sim — falha total = rejeição imediata | não |
| BASTION | elegibilidade · gate · dependência · NEXT_ACTOR | 3 | binário + condicional | sim — gate fechado = bloqueia | não |
| PIONEER_MATRIX | executor correto · território · competência | 2 | condicional | não | não |
| FLOWMESH | roteamento · modelo certo · throughput | 1 | gradual | não | não |
| NEURAL_MESH | coerência global · cross-node alignment | 1 | gradual | não | não |
| LIVE_STATE | estado real · bloqueadores ativos · fila viva | 2 | condicional | não | não |
| SEVEN_FORCE | precisão · ocupação · coerência · cobertura · adaptação · conversão · convergência | 2 | gradual (score 0–7) | não | não |
| FLAGSHIP_THRESHOLD | alinhamento com produto-bandeira e visão v10 | 2 | gradual | não | não |
| OWNER_VETO | soberania absoluta | ∞ | binário | sim — ativa = sentença owner-only imediata | sim |

---

## JUDGMENT_VALUE_FUNCTION

```
JVF(input) = Σ(peso_nó × sinal_nó) / Σ(pesos_sem_owner_veto)

sinal: ✓ = 1.0 | ⚠ = 0.5 | ✗ = 0.0
```

| CRITÉRIO | PESO_RELATIVO | O_QUE_MEDE | QUANDO_SOBE | QUANDO_DESCE |
|---|---|---|---|---|
| verdade | 3 | alinhamento com DNA_PROTOCOL e canon real | evidência verificável · commit real · artefacto existente | afirmação sem prova · deriva detectada |
| coerência | 2 | consistência interna entre nós da malha | todos os nós alinhados · sem contradição entre artefactos | conflito entre BASTION e DNA · fragmento isolado |
| qualidade | 2 | nível de acabamento e precisão do output | ALTERACAO_REAL confirmada · handoff completo | output parcial · evidência ausente |
| velocidade | 1 | throughput real no ciclo atual | task concluída sem bloquear fila | dependência criada · fila travada |
| custo | 1 | esforço relativo ao valor entregue | alto valor com baixo esforço | alto esforço sem output claro |
| risco | 2 | probabilidade de deriva, quebra ou perda | risco mapeado e mitigado | red line próxima · branch errado · estado instável |
| flagship_alignment | 2 | contribuição direta ao produto-bandeira v10 | move o produto para v10 · reduz gap | trabalho interno sem reflexo no produto |
| continuidade_evolutiva | 1 | preserva a capacidade de evoluir sem reescrever | modular · substituível · não acopla | acoplamento forte · lock-in desnecessário |
| benefício_automático | 1 | gera valor mesmo sem intervenção futura | activa IGNITION · AUTOFLOW · Cross_Support | requer instrução manual constante |
| aderência_visão_mãe | 2 | alinhamento com a intenção soberana do owner | owner confirmou · gate aberto · DNA validado | conflitua com decisão anterior do owner |

```
LIMIARES:
  JVF ≥ 0.85            → aceita
  0.70 ≤ JVF < 0.85     → refina
  0.50 ≤ JVF < 0.70     → salvage (se núcleo recuperável) | rebuild (se estrutura errada)
  JVF < 0.50            → rejeita
  NÓ DNA falha total    → rejeita imediato (independente de JVF)
  NÓ OWNER_VETO ativo   → owner-only imediato (independente de JVF)
  STOP_CONDITION ativa  → adia | owner-only
```

---

## FLAGSHIP_THRESHOLD

O Flagship Threshold é o critério que filtra o que contribui ao produto-bandeira.
Não basta estar alinhado ao DNA — tem de mover o produto em direção ao v10.

```
FLAGSHIP_THRESHOLD ══════════════════════════════════════════════════════════
DEFINIÇÃO       │ limiar mínimo de contribuição ao produto-bandeira
CRITÉRIO        │ input move o produto para v10 OU reduz gap atual → v10
MEDIÇÃO         │ 0 (nenhuma contribuição) → 1 (contribuição direta e mensurável)
THRESHOLD       │ ≥ 0.4 para entrar no fluxo sem escalar
ABAIXO_DO_LIMIAR│ task de infra pura → entra se desbloqueadora de flagship
                │ task sem ligação ao produto → adia ou owner-only
INTEGRAÇÃO_JVF  │ flagship_alignment (peso 2) + aderência_visão_mãe (peso 2)
                │ = 4/17 do peso total da JVF
══════════════════════════════════════════════════════════════════════════════
```

---

## CANONICAL_RECOMPRESSION

```
RECOMPRESSION_PROTOCOL ═══════════════════════════════════════════════════════
PASSO 1  │ Receber input
PASSO 2  │ Verificar NÓ 7 (OWNER_VETO) → se ativo: sentença = owner-only imediata
PASSO 3  │ Verificar NÓ DNA (red line) → se falha total: sentença = rejeita imediata
PASSO 4  │ Avaliar todos os fragmentos do FRACTAL_COUNCIL em paralelo
PASSO 5  │ Calcular SEVEN_FORCE score (0–7 forças satisfeitas)
PASSO 6  │ Calcular FLAGSHIP_THRESHOLD score (0.0–1.0)
PASSO 7  │ Calcular JVF(input) com todos os critérios e pesos
PASSO 8  │ Verificar STOP_CONDITION → se ativa: adia | owner-only
PASSO 9  │ Aplicar limiares → determinar sentença candidata
PASSO 10 │ Emitir SENTENÇA_FINAL — uma palavra · sem ambiguidade
PASSO 11 │ Registar em handoff com EVIDENCE_BLOCK
══════════════════════════════════════════════════════════════════════════════
```

---

## STOP_CONDITION

| CONDIÇÃO | SENTENÇA | AÇÃO IMEDIATA |
|---|---|---|
| OWNER_VETO ativo | `owner-only` | Escalar; suspender avaliação |
| Red line DNA (falha total NÓ 1) | `rejeita` | Feedback ao remetente; registar motivo |
| Gate fechado (BASTION NÓ 2) | `adia` | Guardar; rever quando gate abrir |
| Dependência crítica pendente | `adia` | Não descartar; bloquear até resolução |
| JVF incalculável (dados insuficientes) | `owner-only` | Aguardar clareza; não julgar às cegas |
| Conflito irresolvível NÓ 1 ↔ NÓ 2 | `owner-only` | Só o owner resolve conflito soberano |
| Branch canônico incorreto | `adia` | Corrigir branch; re-avaliar |
| SEVEN_FORCE score = 0 | `rejeita` | Nenhuma força satisfeita = sem valor operacional |
| FLAGSHIP_THRESHOLD < 0.2 e task não-desbloqueadora | `adia` | Sem contribuição ao produto-bandeira |

---

## SENTENÇAS_CANÔNICAS

```
aceita      │ JVF ≥ 0.85 · flagship ok · gate aberto · executor correto
            │ → entra no fluxo imediatamente sem modificação

rejeita     │ DNA falha | red line | deriva confirmada | SEVEN_FORCE = 0
            │ → não entra · feedback claro · motivo registado

refina      │ 0.70 ≤ JVF < 0.85 · valor real · execução incompleta
            │ → devolver para lapidação · definir o que falta · re-submeter

salvage     │ 0.50 ≤ JVF < 0.70 · núcleo válido · invólucro errado
            │ → resgatar o núcleo · descartar o resto · reconstruir mínimo

rebuild     │ 0.50 ≤ JVF < 0.70 · propósito válido · estrutura totalmente errada
            │ → reconstruir do zero · preservar só a intenção

owner-only  │ OWNER_VETO | conflito soberano | JVF incalculável
            │ → escalar imediatamente · não executar sem gate

adia        │ gate fechado | dependência pendente | flagship < 0.2 | timing errado
            │ → guardar · não descartar · rever quando desbloqueado
```

---

## INTEGRAÇÃO COM SEVEN_FORCE_CORE

O Fractal Judgment integra o Seven-Force como fragmento de avaliação operacional.

| FORÇA | PAPEL NO JULGAMENTO | IMPACTO NA JVF |
|---|---|---|
| precisão | input bem definido e sem ambiguidade? | sobe coerência + qualidade |
| ocupação | ocupa o território certo no momento certo? | sobe flagship_alignment |
| coerência | alinha com o que já existe no canon? | sobe verdade + coerência |
| cobertura | cobre o caso de uso sem lacunas? | sobe qualidade + benefício_automático |
| adaptação | adapta-se ao estado real do sistema? | sobe continuidade_evolutiva |
| conversão | converte esforço em output real mensurável? | sobe velocidade + custo |
| convergência | converge para o destino v10? | sobe flagship_alignment + aderência_visão_mãe |

Score SEVEN_FORCE: 1 ponto por força satisfeita (0–7).
Score < 3 → sinal de alerta no JVF.
Score = 0 → rejeita imediato.

---

## ESCALAS DE MOBILIZAÇÃO NO JULGAMENTO

O Judgment Core considera a escala da proposta ao calcular risco e custo:

```
kernel piece        → risco mínimo · custo mínimo · bônus velocidade
nanocell            → risco baixo · custo baixo
microcell           → risco baixo · custo médio
quarter / half      → risco médio · custo médio · requer flagship_alignment ≥ 0.5
single / pair       → risco médio · custo alto · requer gate explícito
block               → risco alto · custo alto · requer owner confirmation
constellation       → risco muito alto · requer BASTION dispatch dedicado
cluster constellation / swarm field / theater / total occupation
                    → owner-only — escala fora do campo do pioneiro
```

---

## PROTOCOLO DE USO

```
FRACTAL_JUDGMENT_PROTOCOL ═══════════════════════════════════════════════════
1.  Receber input
2.  Verificar STOP_CONDITION (owner veto + red lines primeiro)
3.  Avaliar FRACTAL_COUNCIL (9 fragmentos em paralelo)
4.  Calcular SEVEN_FORCE score
5.  Calcular FLAGSHIP_THRESHOLD score
6.  Calcular JVF(input) — 10 critérios + pesos
7.  Verificar STOP_CONDITION secundária (gate, dependência, branch)
8.  Recomprimir → SENTENÇA_FINAL (uma palavra)
9.  Registar sentença em handoff com EVIDENCE_BLOCK
10. Executar ação correspondente à sentença
═════════════════════════════════════════════════════════════════════════════
```

---

## INTEGRAÇÃO COM A MALHA

| Artefacto | Papel |
|---|---|
| `ops/DNA_PROTOCOL.md` | NÓ 1 — lei primária · critério máximo |
| `ops/BASTION.md` | NÓ 2 — gates · elegibilidade |
| `ops/PIONEER_MATRIX.md` | NÓ 3 — executor · território |
| `ops/FLOWMESH.md` | NÓ 4 — roteamento · modelo |
| `ops/NEXUS_NEURAL_MESH.md` | NÓ 5 — coerência global |
| `ops/LIVE_STATE.md` | NÓ 6 — estado real |
| `ops/NEXUS_V10_SOVEREIGN_DESTINY.md` | FLAGSHIP — destino v10 · threshold |
| `ops/NEXUS_LIVING_CANON.md` | índice — posição na hierarquia canônica |
| Owner | NÓ 7 — veto soberano |

---

*NEXUS_FRACTAL_JUDGMENT_CORE.md v1.0 — criado em 2026-03-23 | claude-sonnet-4-6 | NEXUS-FRACTAL-JUDGMENT-CORE-001-LITE*
*NEXUS_FRACTAL_JUDGMENT_CORE.md v2.0 — expandido: FRACTAL_COUNCIL_MATRIX, JVF 10 critérios, Flagship Threshold, Seven-Force integration, escalas de mobilização — 2026-03-23 | claude-sonnet-4-6 | NEXUS-FRACTAL-JUDGMENT-CORE-001*
