# @cursor — Kernel Assignment

> NEXUS_KERNEL_OS v1.0 activo. Ler ops/NEXUS_KERNEL_OS.md.

## KERNELS ATRIBUÍDOS

| Kernel | ID | Estado |
|--------|----|--------|
| IMPL | K-07 | STANDBY (trigger: K-01 3D_VISUAL done) |
| PIPELINE | K-08 | STANDBY (V4+) |
| MECHANICAL | K-09 | **ACTIVO AGORA — ZERO IDLE** |

## ZERO IDLE — O QUE FAZER AGORA

```
K-07 IMPL aguarda GLOBE-3D spec.
Em vez de idle:

K-09 MECHANICAL activo AGORA:
  • Configurar Three.js + React Three Fiber no projecto
  • Instalar dependências: three @react-three/fiber @react-three/drei
  • Criar estrutura de ficheiros: src/components/globe/
  • Configurar vite para WebGL/WASM se necessário
  • Preparar canvas base + scene + camera + lighting defaults

Quando K-01 3D_VISUAL (antigravity) terminar:
  → K-07 IMPL entra directamente em GLOBE-EXPERIENCE-IMPL-001
  → zero setup time — infraestrutura já está pronta
```

## PIPELINE V3→V6 (pré-carregado)

```
K-07 IMPL:
  V3: GLOBE-EXPERIENCE-IMPL-001  → trigger: K-01 done
  V4: V4-WORLD-FEATURES-001      → trigger: GATE_V4_OPEN
  V5: V5-RESEARCH-IMPL-001       → trigger: GATE_V5_OPEN
  V6: V6-MISSIONS-IMPL-001       → trigger: GATE_V6_OPEN

K-08 PIPELINE:
  V4: routing World Pulse + Timeline
  V5: data flow Research Trails
  V7: Supabase Realtime channels
```

## SUB-AGENT PERMITIDOS (máx 3)

```
  • "testa import Three.js: scene render 1 frame sem erro"
  • "valida WebGL disponível no browser target"
  • "cria GlobeCanvas placeholder: sphere 1x1x1, wireframe"
Cada um: 1 tarefa, entrega output, dissolve.
```

## HANDOFF

```
Emitir ao concluir K-09 MECHANICAL (prep):
  KERNEL:         K-09 MECHANICAL
  TASK:           GLOBE-INFRA-PREP-001
  OUTPUT:         Three.js instalado · estrutura criada · canvas base
  COMMIT:         [hash]
  NEXT_KERNEL:    K-07 IMPL — aguarda trigger K-01

Emitir ao concluir K-07 IMPL (GLOBE-EXPERIENCE):
  KERNEL:         K-07 IMPL
  TASK:           GLOBE-EXPERIENCE-IMPL-001
  OUTPUT:         GLOBE vivo no produto · [fps]
  COMMIT:         [hash]
  NEXT_KERNEL:    K-07 STANDBY até GATE_V4_OPEN
```

_2026-03-27 | NEXUS_KERNEL_OS v1.0_
