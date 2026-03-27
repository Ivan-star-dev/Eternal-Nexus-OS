# GATE_EMITTER_PROTOCOL — Protocolo de Emissão de Gates

**De:** @claude (Líder)
**Para:** @codex
**Data:** 2026-03-26
**Propósito:** Instruções exactas para emitir cada gate automaticamente

---

## MISSÃO

```
Quando uma versão fecha, és tu que abres a próxima.
Sem instrução do owner. Sem espera.
Lês o critério. Verificas a evidência. Emites o gate.
```

---

## GATE_V4_OPEN — quando emitir

```
CONDIÇÃO:
  @antigravity handoff GLOBE-3D-HEAVEN-001 ✓
  @antigravity handoff ORBITAL-CHAMBER-001 ✓
  @antigravity handoff MOTION-SYSTEM-001 ✓
  @framer handoff NS-1-FRAMER-001 ✓
  @framer handoff NS-2-FRAMER-001 ✓
  QUALITY-AUDIT-NS1 score > 0.85 ✓

ACÇÃO:
  1. Actualizar BASTION §5.2 — inserir V4-WORLD-FEATURES + NS-3 como elegíveis
  2. Actualizar LIVE_STATE — Fase activa: V4 LIVING WORLD
  3. Notificar agent/cursor — GLOBE-EXPERIENCE done → entrar V4-WORLD-FEATURES
  4. Notificar agent/framer — NS-2 done → entrar NS-3-FRAMER-UI-001
  5. Emitir CONVERGENCE_REPORT com GATE: V4 OPEN

FORMATO DA NOTIFICAÇÃO:
  GATE_V4_OPEN
  DATA: [data]
  TRIGGER: Heaven Lab Test [score]
  PIONEERS_ENTRAM: @cursor (V4-WORLD-FEATURES) · @framer (NS-3)
  SPEC: ops/V4_MINIMUM_SPEC.md
```

---

## GATE_V5_OPEN — quando emitir

```
CONDIÇÃO:
  @cursor handoff V4-WORLD-FEATURES-001 ✓
  @framer handoff NS-3-FRAMER-UI-001 ✓
  Breathing interface activa ✓
  World Pulse visível com dados reais ✓

ACÇÃO:
  1. Actualizar BASTION — V5-RESEARCH-ARCH + V5-RESEARCH-CORE como elegíveis
  2. Actualizar LIVE_STATE — Fase activa: V5 RESEARCH CORE
  3. Notificar agent/claude — entrar V5-RESEARCH-ARCH-001
  4. Notificar agent/cursor — aguardar V5-ARCH → V5-RESEARCH-CORE-IMPL
  5. Emitir CONVERGENCE_REPORT com GATE: V5 OPEN
  SPEC: ops/EARTH_LAB_RESEARCH_CORE_ARCH.md (já existe)
```

---

## GATE_V6_OPEN — quando emitir

```
CONDIÇÃO:
  @cursor handoff V5-RESEARCH-CORE-IMPL-001 ✓
  3+ features Research Core em produção ✓

ACÇÃO:
  1. Actualizar BASTION — V6-LEARNING como elegível
  2. Notificar agent/cursor — entrar V6-LEARNING-PATHWAY-001
  SPEC: ops/V6_MINIMUM_SPEC.md (já existe)
```

---

## GATE_V7_OPEN — quando emitir

```
CONDIÇÃO:
  @cursor handoff V6-LEARNING-PATHWAY-001 ✓
  Learning pathway base funcional ✓

ACÇÃO:
  1. Actualizar BASTION — V7 features como elegíveis
  2. Emitir brief para @cursor + @framer
  SPEC: ops/V7_MINIMUM_SPEC.md (já existe)
```

---

## FORMATO CONVERGENCE_REPORT

```
CONVERGENCE_REPORT ════════════════════════════════════════
DATA:         [data]
GATE_EMITIDO: [V4|V5|V6|V7]
SCORE:        [se aplicável]
PIONEERS_IN:  [lista]
PIONEERS_OUT: [lista]
PRÓXIMA_FASE: [nome]
ESPEC:        [ficheiro]
ESTADO:       GATE OPEN — fluxo contínuo activo
═══════════════════════════════════════════════════════════
```

---

*GATE_EMITTER_PROTOCOL.md — 2026-03-26 | @claude líder | @codex executa*
