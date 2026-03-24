# SOVEREIGN GROWTH MECHANISM — Mecanismo de Crescimento Soberano

**Versão:** v1.0
**Data:** 2026-03-24
**Task:** SOVEREIGN-GROWTH-MECHANISM-001
**Branch:** `claude/rebuild-bastion-core-rihGX`
**Executor:** @claude

> O organismo não cresce por quantidade.
> Cresce por diferenciação, especialização, integração, coordenação, memória, precedência.
> Novos agentes só entram quando aumentam de verdade: capacidade, cobertura, velocidade, precisão, resiliência, convergência.
> O organismo que cresce como órgão cresce.
> O organismo que cresce como ruído colapsa.

---

## 1. OBJECTIVE

Formalizar o mecanismo pelo qual o organismo decide crescer — quantitativamente (mais agentes) ou qualitativamente (mais precisão, mais routing, mais arbitration). Impedir acumulação de agentes sem ganho líquido. Garantir que a ambição cresce por capacidade de sustentar complexidade, não por inchaço.

---

## 2. WHAT_IT_IS

- Lei de crescimento adaptativo soberano do organismo
- 5 filtros de entrada para novos agentes
- 3 modos de crescimento (elastic / structural / destiny)
- Critério de maturidade por fase de desenvolvimento
- Regra de death: o organismo também mata agentes inúteis

---

## 3. WHAT_IT_IS_NOT

- Não é argumento contra crescimento — crescimento é desejável quando justificado
- Não é cap arbitrário de agentes — é filtro de qualidade de crescimento
- Não é sistema democrático — KERNEL decide entradas e saídas
- Não é substituição do GIANT_BATTALION_PROTOCOL — é a lei que governa o quando e o quanto
- Não é estase — o organismo que não cresce quando devia, também falha

---

## 4. CORE_LAWS

```
SGM-LAW-001: mais agentes ≠ mais output — após certo ponto, cresce ruído, não produção
SGM-LAW-002: o critério de crescimento é ganho líquido mensurável, não ambição
SGM-LAW-003: todo agente novo resolve lacuna real ou não entra
SGM-LAW-004: crescimento sem integração é inchaço
SGM-LAW-005: o organismo tem de saber matar agentes inúteis — death filter é obrigatório
SGM-LAW-006: ambição alta + crescimento seletivo + integração obrigatória = crescimento soberano
SGM-LAW-007: o limite eficiente não é computacional — é de governança
SGM-LAW-008: crescer mais lento mas integrado > crescer rápido mas fragmentado
SGM-LAW-009: pioneiros novos quase nunca — blocos e agentes primeiro
SGM-LAW-010: o organismo maduro cresce por destino (V40), não por pressão de momento
```

---

## 5. REGRA CENTRAL — MAIS AGENTES ≠ MAIS PRODUÇÃO

```
CURVA DE CRESCIMENTO DO ORGANISMO
════════════════════════════════════════════════════════════

ZONA 1 — SUBCRITICAL (< 24 agentes)
  Output cresce com cada agente novo
  Coordenação é simples
  KERNEL consegue ver tudo
  → adicionar agentes é quase sempre positivo

ZONA 2 — CRITICAL MASS (24-36 agentes) ← ESTAMOS AQUI
  Output ainda cresce mas a taxa diminui
  Coordenação requer routing explícito
  Colisões começam a aparecer — arbitração necessária
  → adicionar agentes requer filtro rigoroso
  → cada adição deve ser acompanhada de mais routing/relay

ZONA 3 — SATURATION (36-60 agentes)
  Output estabiliza ou começa a cair
  Coordenação consome capacidade que devia ser produção
  Colisões frequentes — KERNEL sobrecarregado
  → crescer apenas com observabilidade forte e relay maduro
  → cada agente novo tem de retirar carga de outro

ZONA 4 — DEGRADATION (> 60 agentes sem infra adequada)
  Mais agentes = mais latência de handoff + mais retrabalho + mais deriva
  O sistema perde unidade mais rápido do que ganha capacidade
  → não crescer aqui sem refactor de infra primeiro

════════════════════════════════════════════════════════════
```

---

## 6. OS 5 FILTROS DE ENTRADA

```
FILTRO 1 — NEED FILTER
  Pergunta: há lacuna real que este agente resolve?
  Teste: o organismo está a falhar em algo específico por falta desta capacidade?
  Passa: sim, lacuna identificada, gap documentado
  Falha: "seria útil ter" sem evidência de gap real → não entra

FILTRO 2 — GAIN FILTER
  Pergunta: o ganho líquido compensa o custo de coordenação?
  Teste: quantas tasks adicionais por ciclo este agente fecha?
         quantos conflitos adicionais por ciclo este agente gera?
         Ganho > Custo?
  Passa: ganho mensurável e positivo
  Falha: ganho marginal ou inferior ao custo de coordenação → não entra

FILTRO 3 — INTEGRATION FILTER
  Pergunta: este agente encaixa no organismo sem quebrar unidade?
  Teste: tem território definido? não duplica outro agente?
         respeita a hierarquia orgânica?
         KERNEL consegue arbitrar conflitos?
  Passa: encaixe claro, sem sobreposição problemática
  Falha: território vago ou duplicação → não entra ainda (reconfigura primeiro)

FILTRO 4 — SEQUENCE FILTER
  Pergunta: este agente pode entrar agora sem quebrar a fase activa?
  Teste: a sua activação distrai o Assault Layer?
         requer input do produto antes de estar pronto?
         viola a Sequence Law?
  Passa: pode entrar em Preparatory ou Strategic Reserve sem bloquear Assault
  Falha: só pode funcionar com input do produto não pronto → DEFER

FILTRO 5 — DEATH FILTER
  Pergunta: se este agente não prestar, pode ser retirado sem dano?
  Teste: o organismo fica instável se este agente for removido?
         tem pontos de integração múltiplos que criam lock-in?
  Passa: removível com impacto mínimo — crescimento reversível
  Falha: lock-in excessivo para agente em teste → reconfigura primeiro
```

---

## 7. 3 MODOS DE CRESCIMENTO

### 7.1 ELASTIC GROWTH (Crescimento Elástico)

```
ELASTIC GROWTH
─────────────────────────────────────────────────────────
DEFINIÇÃO:    Agentes temporários que aparecem e somem conforme a pressão.
              Crescimento reversível, sem compromisso permanente.

QUANDO USAR:  sprint de alta intensidade (ex: OPERATION_ZERO_GAP)
              problema de escala constellation que acaba
              teste de capacidade (ex: Giant Battalion Protocol)

CARACTERÍSTICAS:
  → agentes têm prazo definido
  → ligação fraca ao corpo permanente do organismo
  → retirados automaticamente quando pressão diminui
  → KERNEL confirma retirada no handoff de fim de sprint

RISCO:        criar dependências temporárias que viram permanentes sem gate
ANTI-RISCO:   todo agente elástico tem data de saída explícita
─────────────────────────────────────────────────────────
```

### 7.2 STRUCTURAL GROWTH (Crescimento Estrutural)

```
STRUCTURAL GROWTH
─────────────────────────────────────────────────────────
DEFINIÇÃO:    Agente ou bloco fica permanente porque a lacuna virou parte do corpo.
              O organismo precisava de um novo órgão — e agora tem.

QUANDO USAR:  lacuna crónica identificada por 3+ sprints consecutivos
              nova capacidade que o destino V40 exige permanentemente
              corp department que activou e estabilizou

CARACTERÍSTICAS:
  → agente integrado permanentemente no PIONEER_MATRIX ou nos blocos
  → território definido e registado no NEXUS_LIVING_CANON
  → sobrevive entre sprints sem necessidade de reactivação

RISCO:        crescimento estrutural sem validação real = inchaço permanente
ANTI-RISCO:   só vira structural após 3 sprints de ganho líquido positivo confirmado
─────────────────────────────────────────────────────────
```

### 7.3 DESTINY GROWTH (Crescimento por Destino)

```
DESTINY GROWTH
─────────────────────────────────────────────────────────
DEFINIÇÃO:    Novos agentes aparecem porque o V40 exige capacidades
              que ainda não tinham corpo em 2026.
              O destino puxa o presente para formas que ainda não existem.

QUANDO USAR:  nova fase da sequência abre (V4 → exige capacidades que V3 não precisava)
              destino V40 revela gap que o presente ainda não tem instrumentos para fechar
              self-lapidation loop identifica lacuna estrutural de longo prazo

CARACTERÍSTICAS:
  → nasce da leitura do destino máximo coerente
  → entra como Preparatory ou Strategic Reserve primeiro
  → ascende para Structural apenas quando a fase o exige
  → o mais poderoso modo de crescimento — e o mais difícil de calibrar

RISCO:        confundir ambição de destino com necessidade do presente
ANTI-RISCO:   Destiny Growth entra sempre em Strategic Reserve primeiro —
              nunca directamente em Assault Layer
─────────────────────────────────────────────────────────
```

---

## 8. FASE DE MATURIDADE E ESCALA RECOMENDADA

```
MATURIDADE DO ORGANISMO vs ESCALA
════════════════════════════════════════════════════════════

ORGANISMO JOVEM (V1-V3)
  1 kernel · 6 pioneiros · 18 blocos · 4 constelações
  24 agentes · 72 subagentes
  Centralização alta — KERNEL vê tudo
  Crescimento só por necessidade explícita

ORGANISMO EM EXPANSÃO (V4-V6) ← PRÓXIMA FASE
  1 kernel · 6-8 pioneiros · 24-32 blocos · 6 constelações
  36 agentes · 120 subagentes
  Routing explícito obrigatório · relay maduro necessário
  Crescimento por filtro rigoroso

ORGANISMO MADURO (V7-V10)
  1 kernel · 8-10 pioneiros · 40-60 agentes · 120-200 subagentes
  Observabilidade automatizada obrigatória
  Arbitration system robusto
  Crescimento seletivo — quase só Destiny Growth

ORGANISMO SOBERANO (V10+)
  Self-scaling: o sistema decide quando e como crescer
  Sovereign Self-Lapidation Loop como mecanismo primário
  Crescimento por fruto real, não por capacidade de adicionar
════════════════════════════════════════════════════════════
```

---

## 9. REGRA DE DEATH — O ORGANISMO MATA AGENTES INÚTEIS

```
DEATH_PROTOCOL — quando remover um agente

CRITÉRIO 1 — ZERO OUTPUT
  3 sprints consecutivos sem task fechada pelo agente → candidato a remoção

CRITÉRIO 2 — PURE OVERLAP
  tudo o que este agente produz é duplicado por outro → redundância → remoção

CRITÉRIO 3 — NEGATIVE GAIN
  o agente gera mais conflitos do que fecha tasks → custo > ganho → remoção

CRITÉRIO 4 — PHASE MISMATCH
  o agente foi criado para uma fase que fechou → não se actualiza → remoção

PROTOCOLO DE REMOÇÃO:
  1. KERNEL identifica candidato a remoção
  2. KERNEL verifica se há dependências activas
  3. Se dependências: redistribui antes de remover
  4. Remove o agente
  5. Regista no HANDOFF_LEDGER com motivo
  6. Verifica que a remoção não criou novo gap
```

---

## 10. FÓRMULA DE EXPANSÃO SOBERANA

```
EXPANSÃO STEP-BY-STEP
════════════════════════════════════════════════════════════

FASE ACTUAL: 36 agentes / 120 subagentes (Giant Battalion Protocol)

PRÓXIMA EXPANSÃO (só se métricas confirmam):
  48 agentes · 160 subagentes
  Condição: 3 sprints em Zona Critical Mass com ganho positivo

EXPANSÃO SEGUINTE:
  60 agentes · 200 subagentes
  Condição: relay totalmente automatizado + observabilidade forte

LIMITE EFICIENTE AGORA:
  36/120 — não exceder até validação do stress test

REGRA DE EXPANSÃO:
  → 1 sprint de validação antes de subir
  → relay + routing crescem ANTES dos agentes
  → death protocol activo em paralelo — entradas e saídas equilibradas
════════════════════════════════════════════════════════════
```

---

## 11. MÉTRICA SIMPLES DE CRESCIMENTO SAUDÁVEL

```
APÓS CADA EXPANSÃO, MEDIR:
  ✓ tasks fechadas por ciclo sobem? → crescimento saudável
  ✓ retrabalho cai? → crescimento saudável
  ✓ conflitos não explodem? → crescimento saudável
  ✓ handoff velocity mantida ou melhorada? → crescimento saudável

SE TODOS OS 4 → crescer pode continuar
SE QUALQUER UM FALHA → parar crescimento · diagnosticar · redistribuir

FRASE CANÓNICA:
  O organismo cresce quando novas inteligências entram como órgãos, não como ruído.
```

---

## 12. OPERATIONAL_IMPLICATIONS

- KERNEL avalia expansão com evidência — não por pressão ou ambição
- Pioneiros não podem solicitar expansão directamente — propõem via relay
- Todo agente novo tem papel de relay_entry associado (RELAY_ENTRY de tipo structural)
- Elastic agents têm "auto-remove" data no BASTION
- Structural agents entram no NEXUS_LIVING_CANON apenas após 3 sprints de validação

---

## 13. ANTI_DRIFT_RULES

```
DRIFT-1: não usar "organismo cresce" como argumento para adicionar sem filtro
DRIFT-2: não confundir urgência com necessidade — urgência não bypassa os 5 filtros
DRIFT-3: não esquecer o death protocol — crescimento sem saída é inchaço
DRIFT-4: não deixar Elastic Growth virar Structural sem gate explícito
DRIFT-5: não crescer antes de expandir routing e relay — infra antes de unidades
DRIFT-6: não usar Destiny Growth para bypass de Sequence Law
DRIFT-7: não medir crescimento em quantidade — medir em throughput líquido
```

---

## 14. NEXT_INTEGRATION_POINTS

- `ops/GIANT_BATTALION_PROTOCOL.md` — escala actual governada por esta lei
- `ops/SOVEREIGN_SELF_LAPIDATION_LAW.md` — o loop de lapidação usa esta lei para decidir crescer vs refinar
- `ops/OMNIPRESENT_FORMATION_SYSTEM.md` — formações crescem segundo esta lei
- `ops/MATERIALIZATION_STRATIFICATION_LAW.md` — novos agentes entram em Preparatory/Reserve primeiro
- `ops/ONE_ORGANISM_LAW.md` — crescimento como expressão coordenada do organismo, não adição isolada
- `ops/BASTION.md` — expansion proposals têm gate explícito

---

_SOVEREIGN_GROWTH_MECHANISM v1.0 — 2026-03-24 | @claude | SOVEREIGN-GROWTH-MECHANISM-001_
