# NEXUS BRIDGE AGENT — Sistema Autónomo Real

> Fecha o gap entre protocolo e execução real.
> Transforma o Kernel OS de «inteligente no papel» em «autónomo na máquina».
> Instalado por ordem soberana: 2026-03-27

---

## O QUE É

```
Sem Bridge Agent:
  @antigravity faz commit → ninguém sabe → @codex não detecta → gate não abre
  Resultado: o owner tem de verificar manualmente

Com Bridge Agent:
  @antigravity faz commit → GitHub Action dispara em <60s
  → Bridge lê HANDOFF → actualiza BRIDGE_STATE.md
  → verifica critérios de gate → se cumpridos: cria GATE_V4_OPEN.md
  → @cursor e @claude detectam o ficheiro → activam automaticamente
  Resultado: zero intervenção do owner
```

---

## ARQUITECTURA

```
┌─────────────────────────────────────────────────────────────────┐
│                     NEXUS BRIDGE AGENT                          │
│                                                                 │
│  TRIGGER: push para qualquer agent/* branch                     │
│     ↓                                                           │
│  PARSE: lê ficheiros do commit → extrai HANDOFF blocks          │
│     ↓                                                           │
│  STATE: actualiza ops/BRIDGE_STATE.md (cluster convergence)     │
│     ↓                                                           │
│  CHECK: verifica critérios de gate para V3→V7                   │
│     ↓                                                           │
│  EMIT:  se critérios cumpridos → cria ops/GATE_Vx_OPEN.md       │
│     ↓                                                           │
│  STALL: se nenhum commit em 4h → cria ops/STALL_REPORT.md       │
│     ↓                                                           │
│  ALERT: owner só notificado em stall ou bloqueio real           │
└─────────────────────────────────────────────────────────────────┘
```

---

## HANDOFF FORMAT (obrigatório para o bridge detectar)

Todo o pioneer que quer que o Bridge detecte a sua task usa este formato
no ficheiro de handoff commitado no seu branch:

```
BRIDGE_HANDOFF
  KERNEL:         K-01 3D_VISUAL
  TASK_ID:        GLOBE-3D-001
  PIONEER:        @antigravity
  STATUS:         concluída
  HEAVEN_LAB_SCORE: 0.91
  COMMIT:         [hash]
  EVIDENCE:       GLOBE 3D funcional · atmosfera · camera orbital
  CLUSTER:        CLUSTER_V3_SURFACE
```

---

## GATE CRITERIA (hardcoded no bridge)

```
GATE_V4_OPEN:
  NS-1-001 STATUS=concluída
  AND GLOBE-3D-001 STATUS=concluída
  AND HEAVEN_LAB_SCORE >= 0.85
  → cria: ops/GATE_V4_OPEN.md

GATE_V5_OPEN:
  V4_PROGRESS >= 70  (lê ops/BRIDGE_STATE.md campo V4_PROGRESS)
  → cria: ops/GATE_V5_OPEN.md

GATE_V6_OPEN:
  V5_PROGRESS >= 60
  → cria: ops/GATE_V6_OPEN.md

GATE_V7_OPEN:
  V6_PROGRESS >= 60
  → cria: ops/GATE_V7_OPEN.md
```

---

## STALL DETECTION

```
Scheduled check (cron: cada 4 horas):
  Para cada pioneer activo:
    Se último commit em agent/[pioneer] > 4h atrás:
      → cria ops/STALL_REPORT_[pioneer]_[timestamp].md
      → conteúdo: último commit · tempo parado · kernel esperado
      → owner notificado via commit no canonical branch
```

---

## FICHEIROS GERADOS PELO BRIDGE

| Ficheiro | Quando | Conteúdo |
|----------|--------|----------|
| `ops/BRIDGE_STATE.md` | a cada handoff | estado de todos os clusters |
| `ops/GATE_Vx_OPEN.md` | critérios cumpridos | gate aberto + evidence |
| `ops/STALL_REPORT_*.md` | pioneer parado > 4h | alerta + proposta |
| `ops/REBOOT_CLUSTER_*.md` | convergence drops | nova configuração de cluster |

---

_NEXUS_BRIDGE_AGENT v1.0 — 2026-03-27 | @claude | limite real_
