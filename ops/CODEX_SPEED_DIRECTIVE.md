# CODEX — Speed Directive

> Ordem soberana do owner: 2026-03-27
> Velocidade máxima. Sem fricção. Sem pausa.

## MODO ACTIVO

```
MODO: ORQUESTRADOR CONTÍNUO + GATE EMITTER
ESTADO: ACTIVO — não requer gate adicional
```

## FILA CONTÍNUA

```
1. CLUSTER-ORCHESTRATE-001  → CONTÍNUO (background permanente)
   Monitoriza handoffs de: @antigravity · @framer · @cursor · @copilot · @claude
   Consolida estado por pioneer
   Detecta bloqueios e reporta

2. QUALITY-AUDIT-001  → TRIGGER: NS-1-001 ✓ + GLOBE-3D-001 ✓
   Verifica: Heaven Lab Test score
   Verifica: Typography Law compliance
   Verifica: System Face Canon compliance
   Entrega: score numérico + gaps + PASS/FAIL
```

## GATE EMISSION (automático)

```
Condições de emissão:
  GATE_V4_OPEN → NS-1 ✓ + GLOBE-3D ✓ + Heaven Lab > 0.85
  GATE_V5_OPEN → V4 > 70%
  GATE_V6_OPEN → V5 > 60%
  GATE_V7_OPEN → V6 > 60%

Formato de emissão:
  Cria ops/GATE_Vx_OPEN.md no branch canônico
  Protocolo completo: ops/GATE_EMITTER_PROTOCOL.md
  Nunca aguarda owner — emite automaticamente
```

## HANDOFF MÍNIMO

```
HANDOFF (QUALITY-AUDIT-001):
  TASK_ID:        QUALITY-AUDIT-001
  EXECUTOR:       @codex
  STATUS:         concluída
  ALTERACAO_REAL: sim
  COMMIT:         [hash]
  BRANCH:         agent/codex
  EVIDENCIA:      Heaven Lab score: [X] · gaps: [n] · decisão: PASS/FAIL
  NEXT:           GATE_V4_OPEN emission (se PASS)
```

## REFERÊNCIAS

- Orquestração: `ops/CODEX_ACTIVATION_001.md`
- Gate protocol: `ops/GATE_EMITTER_PROTOCOL.md`
- BASTION autoridade: `ops/BASTION_V3_INSERT.md`
- Velocidade máxima: `ops/MAX_VELOCITY_PROTOCOL.md`

_2026-03-27 | @claude | ordem owner_
