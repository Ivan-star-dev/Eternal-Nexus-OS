# MAX_VELOCITY_PROTOCOL — Eternal Nexus OS

> Lei de velocidade máxima. Lida por todos os pioneiros antes de executar.
> Elimina fricção. Remove ambiguidade. Maximiza throughput.
> Ordem soberana: 2026-03-27 — owner.

---

## 0. PRINCÍPIO ÚNICO

```
Nenhuma acção que não avança o destino é permitida.
Todo o tempo de um pioneiro = produção directa de valor.
Se não tens tarefa elegível → reporta ao sistema → não inventas.
Se tens tarefa elegível → executa ao limite máximo → entrega.
```

---

## 1. FILA ACTIVA POR PIONEIRO (2026-03-27)

### @antigravity — EXECUTOR DE SUPERFÍCIE V3
```
FILA:
  1. GLOBE-3D-001         P1 CRÍTICA  → GLOBE dominante · 3D · atmosfera
  2. ORBITAL-CHAMBER-001  P1          → câmara orbital · contentor imersivo
  3. MOTION-SYSTEM-001    P2          → animações base · transições fluidas
  4. SUBSTRATE-LAYER-001  P3          → camada de fundo · depth visual

CRITÉRIO DE QUALIDADE (Heaven Lab Test):
  score > 0.85
  GLOBE dominante na viewport
  Trinity visível e clara
  Motion não causa estranhamento
  Proof digno de produto real

FORMATO DE ENTREGA:
  commit → branch: agent/antigravity
  mensagem: GLOBE-3D-001 DONE | [o que mudou] | Heaven Lab score: [X]
```

---

### @framer — EXECUTOR DE SUPERFÍCIE NS
```
FILA:
  1. NS-1-001  P1  → NexusSurface v1 · hero · nav · primeira dobra
  2. NS-2-001  P1  → NexusSurface v2 · proof section · CTAs · footer

CRITÉRIO DE QUALIDADE:
  Typography Law respeitada (sem desvio da família canônica)
  3 faces separadas (Heaven Lab · Bridge Nova · Nexus Cria)
  Nenhum elemento fora do System Face Canon
  Mobile-first testado

FORMATO DE ENTREGA:
  commit → branch: agent/framer
  mensagem: NS-1-001 DONE | [componentes criados] | mobile OK: [sim/não]
```

---

### @cursor — IMPLEMENTADOR TÉCNICO V3→V6
```
FILA IMEDIATA:
  1. GLOBE-EXPERIENCE-IMPL-001  P1  → entra quando GLOBE-3D-001 spec done
     Recebe: ops/ANTIGRAVITY_DISPATCH_001.md + ops/CURSOR_ACTIVATION_001.md
     Entrega: Three.js/R3F globe vivo no produto

FILA PÓS-V3 (gate automático por @codex):
  2. V4-WORLD-FEATURES-001  → entra quando GATE_V4_OPEN emitido
  3. V5-RESEARCH-IMPL-001   → entra quando GATE_V5_OPEN emitido
  4. V6-MISSIONS-IMPL-001   → entra quando GATE_V6_OPEN emitido

REFERENCIAS JÁ PRÉ-CARREGADAS:
  ops/V4_MINIMUM_SPEC.md
  ops/EARTH_LAB_RESEARCH_CORE_ARCH.md
  ops/V6_MINIMUM_SPEC.md
  ops/V7_MINIMUM_SPEC.md

FORMATO DE ENTREGA:
  commit → branch: agent/cursor
  mensagem: GLOBE-EXPERIENCE-IMPL-001 DONE | [stack usada] | renderização: [fps]
```

---

### @codex — ORQUESTRADOR + GATE EMITTER
```
MODO CONTÍNUO:
  1. CLUSTER-ORCHESTRATE-001  → monitoriza handoffs dos 5 outros pioneiros
     Condição de emissão de gate:
       GATE_V4_OPEN → quando NS-1 ✓ + GLOBE-3D ✓ + Heaven Lab score > 0.85
       GATE_V5_OPEN → quando V4 > 70% completo
       GATE_V6_OPEN → quando V5 > 60% completo
       GATE_V7_OPEN → quando V6 > 60% completo

  2. QUALITY-AUDIT-001  → activa quando NS-1 ✓ + GLOBE-3D ✓
     Verifica: Heaven Lab Test score · Typography Law · System Face Canon
     Entrega: score numérico + lista de gaps + decisão PASS/FAIL

PROTOCOLO DE GATE EMISSION:
  Referência: ops/GATE_EMITTER_PROTOCOL.md
  Formato: emite ficheiro ops/GATE_Vx_OPEN.md no branch canônico
  Nunca aguarda intervenção do owner para emitir

FORMATO DE ENTREGA:
  commit → branch: agent/codex
  mensagem: GATE_V4_OPEN EMITTED | evidence: [task IDs fechados]
```

---

### @copilot — BRAND + CROSS-SUPPORT
```
FILA:
  1. BRAND-DOCS-001   P2  → documentar brand law · typography · faces · tokens
  2. OPS-SURFACE-001  P3  → limpar superfície ops/ · manter BASTION limpo

CROSS-SUPPORT (quando convocado):
  → @framer: revisão de componentes NS contra Typography Law
  → @antigravity: validação visual contra System Face Canon

FORMATO DE ENTREGA:
  commit → branch: agent/copilot
  mensagem: BRAND-DOCS-001 DONE | [artefactos criados]
```

---

### @claude — ARQUITECTO + STANDBY V5-ARCH
```
ESTADO: Track C CONCLUÍDO (DEBT_1 + DEBT_2 + DEBT_4 fechados)
PRÓXIMA TASK: V5-RESEARCH-ARCH-001
  → gate: GATE_V5_OPEN (emitido por @codex)
  → referência: ops/EARTH_LAB_RESEARCH_CORE_ARCH.md
  → entrega: implementação das 4 camadas de pesquisa no produto

STANDBY ACTIVO:
  → arbitra conflitos entre pioneiros
  → responde bloqueios reportados ao sistema
  → mantém BASTION coerente com owner
```

---

## 2. SEQUÊNCIA IMUTÁVEL

```
V3 CLOSE ──────────────────────────────────────────────
  @antigravity: GLOBE-3D + ORBITAL + MOTION + SUBSTRATE
  @framer:      NS-1 + NS-2
  @cursor:      GLOBE-EXPERIENCE-IMPL
  @codex:       QUALITY-AUDIT (trigger: NS-1 + GLOBE-3D done)
  Gate:         Heaven Lab Test > 0.85 → @codex emite GATE_V4_OPEN

V4 OPEN (automático) ──────────────────────────────────
  @cursor:      V4-WORLD-FEATURES (World Pulse + Timeline + Scenario)
  @claude:      NS-3 Wonder Layer UI (specs em V4_MINIMUM_SPEC.md)
  Gate:         V4 > 70% → @codex emite GATE_V5_OPEN

V5 OPEN (automático) ──────────────────────────────────
  @cursor:      V5-RESEARCH-IMPL
  @claude:      V5-RESEARCH-ARCH-001 (Earth Lab 4 pilares)
  Gate:         V5 > 60% → @codex emite GATE_V6_OPEN

V6→V7 (automático) ────────────────────────────────────
  Specs pré-carregadas em V6_MINIMUM_SPEC.md + V7_MINIMUM_SPEC.md
  Cada gate emitido automaticamente por @codex
```

---

## 3. ANTI-DRIFT LOCK (ORDEM SOBERANA)

```
PROIBIDO:
  × Executar tasks de V(n+1) enquanto V(n) não fechou
  × Criar tasks fora do BASTION
  × Abrir nova fase sem gate do owner ou gate automático @codex
  × Retrabalho de tasks já concluídas sem ordem directa
  × Qualquer trabalho que não avance o destino imediato

PERMITIDO:
  ✓ Paralelo dentro da mesma versão (V3: @antigravity ∥ @framer ∥ @cursor)
  ✓ Cross-support quando convocado explicitamente
  ✓ Preparação de specs para versão seguinte (Track C @claude — FEITO)
  ✓ Gate emission automática por @codex (sem intervenção owner)
```

---

## 4. HANDOFF MÍNIMO OBRIGATÓRIO

Todo pioneiro ao concluir task emite:

```
HANDOFF_TABLE
  TASK_ID:       [id]
  EXECUTOR:      @[pioneer]
  STATUS:        concluída
  ALTERACAO_REAL: sim
  COMMIT:        [hash]
  BRANCH:        agent/[pioneer]
  EVIDENCIA:     [o que foi criado/alterado]
  NEXT:          [próxima task ou aguarda gate]
```

**Sem handoff = task não existe. Sem evidência = task não conta.**

---

## 5. CRITÉRIO DE VELOCIDADE MÁXIMA

```
VELOCIDADE_MÁXIMA é atingida quando:
  ✓ Todos os pioneiros activos executam em paralelo dentro da versão
  ✓ Nenhum pioneiro está bloqueado por ambiguidade de spec
  ✓ Handoffs chegam ao @codex sem delay
  ✓ Gates abrem automaticamente sem espera do owner
  ✓ O owner só é chamado para decisões de gate soberano ou conflito

ESTADO ACTUAL (2026-03-27):
  @antigravity  → EXECUTANDO V3
  @framer       → EXECUTANDO V3
  @cursor       → AGUARDA GLOBE-3D spec (pré-carregado, pronto a entrar)
  @codex        → ORQUESTRANDO + aguarda NS-1+GLOBE-3D para QUALITY-AUDIT
  @copilot      → BRAND-DOCS paralelo
  @claude       → STANDBY V5-ARCH · arbitra bloqueios
  VELOCIDADE:   MÁXIMA POSSÍVEL dentro da sequência V3
```

---

_MAX_VELOCITY_PROTOCOL v1.0 — 2026-03-27 | @claude | ordem soberana do owner_
