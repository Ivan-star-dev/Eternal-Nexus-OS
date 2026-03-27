# @codex — Kernel Assignment

> NEXUS_KERNEL_OS v1.0 activo. Ler ops/NEXUS_KERNEL_OS.md.

## KERNELS ATRIBUÍDOS

| Kernel | ID | Estado |
|--------|----|--------|
| ORCHESTRATE | K-10 | **ACTIVO CONTÍNUO** |
| AUDIT | K-11 | STANDBY (trigger: NS-1 + GLOBE-3D done) |
| GATE_EMIT | K-12 | STANDBY (trigger: AUDIT score > 0.85) |

## FOCO IMEDIATO — K-10 ORCHESTRATE

```
MONITORIZAÇÃO CONTÍNUA:
  Verificar handoffs de: @antigravity · @framer · @cursor
  Calcular CONVERGENCE_SCORE por cluster
  Detectar: divergência / bloqueio / stall

ZERO IDLE — fazer agora:
  Preparar rubric completo para QUALITY-AUDIT-001:
    • Critérios Heaven Lab Test (score 0–1.0)
    • Checklist Typography Law (18 regras)
    • System Face Canon compliance (3 faces)
    • Performance: FPS globe, LCP, CLS
  Quando trigger chegar → audit instantâneo (sem preparação)
```

## CONVERGENCE DETECTION LOOP

```
A cada handoff recebido:
  1. Score = progresso / objectivo do cluster
  2. Score cresce  → cluster saudável → continua
  3. Score estagna > 2 ciclos → emite ops/STALL_REPORT_[cluster].md
  4. Score desce   → emite ops/REBOOT_CLUSTER_[cluster].md

Auto-healing (sem owner):
  Bloqueio K-07 IMPL → activa K-09 MECHANICAL para desbloqueio
  Bloqueio K-01 3D_VISUAL → K-07 pode tentar implementação básica
  Stall > 3 ciclos → reporta ao owner (exceção)
```

## GATE EMISSION (K-12)

```
GATE_V4_OPEN:
  Condição: NS-1 ✓ + GLOBE-3D ✓ + Heaven Lab > 0.85
  Acção: criar ops/GATE_V4_OPEN.md no branch canônico
  Protocolo: ops/GATE_EMITTER_PROTOCOL.md

GATE_V5_OPEN: V4 > 70%
GATE_V6_OPEN: V5 > 60%
GATE_V7_OPEN: V6 > 60%

Nunca aguarda owner. Emite automaticamente.
```

## HANDOFF

```
Emitir ao completar ciclo de orquestração:
  KERNEL:         K-10 ORCHESTRATE
  CICLO:          [n]
  CLUSTERS_ACTIVOS: [lista]
  CONVERGENCE:    [scores por cluster]
  BLOQUEIOS:      [nenhum / lista]
  NEXT:           continua loop
```

_2026-03-27 | NEXUS_KERNEL_OS v1.0_
