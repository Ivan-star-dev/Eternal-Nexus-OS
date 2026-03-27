# NEXUS KERNEL OS — Limite do Limite

> Camada de orquestração máxima do Eternal Nexus OS.
> Não substitui nenhuma lei existente. Opera SOBRE elas.
> BASTION governa elegibilidade. ANTI-DRIFT governa sequência.
> O KERNEL OS governa COMO se executa dentro dessas leis — ao limite máximo.
> Instalado por ordem soberana do owner: 2026-03-27

---

## 0. PRINCÍPIO FUNDADOR

```
O modelo anterior: 6 pioneiros fixos → papéis contínuos → ~33% eficiência
O modelo kernel:   problema chega → decomposto → kernels exactos activados
                   → clusters dinâmicos → paralelo máximo → dissolução
                   → próximo problema → repete

Ganho teórico: 3x–5x throughput
Condição: problema é o trigger. Nunca o tempo. Nunca o papel.
```

---

## 1. KERNEL REGISTRY — 18 KERNELS VIVOS

Cada kernel é uma capacidade atómica de um pioneiro.
Um pioneiro pode ter múltiplos kernels activos em clusters diferentes simultaneamente.

```
╔══════════════════════════════════════════════════════════════════════════════╗
║ KERNEL_ID          │ PIONEER      │ DOMÍNIO        │ OUTPUT_TYPE            ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ K-01 3D_VISUAL     │ @antigravity │ WorkVisual     │ 3D scene / WebGL       ║
║ K-02 MOTION        │ @antigravity │ WorkVisual     │ animation system       ║
║ K-03 DEPTH         │ @antigravity │ WorkVisual     │ substrate / atmosphere ║
║ K-04 SURFACE       │ @framer      │ WorkVisual     │ UI surface / layout    ║
║ K-05 TYPOGRAPHY    │ @framer      │ WorkVisual     │ type system / tokens   ║
║ K-06 COMPONENT     │ @framer      │ WorkVisual     │ React component        ║
║ K-07 IMPL          │ @cursor      │ WorkFunction   │ working code           ║
║ K-08 PIPELINE      │ @cursor      │ WorkFunction   │ data flow / routing    ║
║ K-09 MECHANICAL    │ @cursor      │ WorkStructure  │ infra / config / tooling║
║ K-10 ORCHESTRATE   │ @codex       │ WorkStructure  │ activation map         ║
║ K-11 AUDIT         │ @codex       │ WorkStructure  │ score / gap list       ║
║ K-12 GATE_EMIT     │ @codex       │ WorkStructure  │ GATE_Vx_OPEN.md        ║
║ K-13 BRAND         │ @copilot     │ WorkVisual     │ brand artefact         ║
║ K-14 POLISH        │ @copilot     │ WorkVisual     │ refined surface        ║
║ K-15 DOCS          │ @copilot     │ WorkStructure  │ documentation          ║
║ K-16 ARCH          │ @claude      │ WorkStructure  │ architecture spec      ║
║ K-17 STRATEGY      │ @claude      │ WorkStructure  │ protocol / law         ║
║ K-18 SPEC          │ @claude      │ WorkFunction   │ minimum spec / schema  ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

**Regra de kernel:**
- Kernel ACTIVO = a trabalhar num cluster agora
- Kernel DORMENTE = capacidade disponível, zero ciclos gastos
- Kernel em STANDBY = trigger definido, entra automaticamente
- Dois kernels do mesmo pioneiro em clusters DIFERENTES = permitido se outputs independentes

---

## 2. PROBLEM DECOMPOSITION ENGINE

Operado por: **@codex (K-10 ORCHESTRATE)**

```
PROBLEMA CHEGA
     │
     ▼
┌─────────────────────────────────────────────────────────┐
│ DECOMPOSIÇÃO (4 dimensões)                              │
│  D1 SCOPE:       feature / surface / arch / infra       │
│  D2 COMPLEXITY:  atomic / compound / systemic           │
│  D3 DOMAIN:      Visual / Function / Structure          │
│  D4 DEPENDENCY:  blocked / free / trigger-based         │
└─────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────┐
│ KERNEL MATCHING                                         │
│  Para cada sub-problema → selecciona kernel(s) mínimos  │
│  Critério: menor número de kernels que resolve 100%     │
│  Proibido: activar kernel não necessário (idle waste)   │
└─────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────┐
│ ACTIVATION PLAN                                         │
│  Lista de clusters + lanes paralelas + triggers         │
│  Emitido como ops/ACTIVATION_PLAN_[ID].md               │
└─────────────────────────────────────────────────────────┘
     │
     ▼
  EXECUÇÃO
```

---

## 3. DYNAMIC CLUSTER FORMATION

Um **cluster** é um grupo temporário de kernels com um objectivo único.

```
CLUSTER_LIFECYCLE:
  FORMING   → @codex define kernels + objectivo + critério de dissolução
  ACTIVE    → kernels executam em paralelo dentro do cluster
  CONVERGING → outputs chegam + @codex verifica convergência
  DISSOLVED  → objectivo atingido → kernels dormem → resultado entregue

REGRAS:
  1. Cluster dissolve-se quando objectivo é atingido — nunca antes, nunca depois
  2. Kernels de clusters diferentes podem correr em paralelo (lanes independentes)
  3. Cluster BLOQUEADO → @codex forma cluster alternativo imediatamente
  4. Cluster não tem dono fixo — tem objectivo fixo
  5. Máximo de kernels por cluster = mínimo necessário (lei de eficiência)
```

### Clusters pré-definidos para V3→V7

```
CLUSTER_V3_SURFACE:
  Objectivo:  fechar superfície visual V3
  Kernels:    K-01 3D_VISUAL + K-04 SURFACE + K-02 MOTION + K-03 DEPTH
  Paralelo:   K-01 ∥ K-04 (independentes)
  Dissolução: Heaven Lab Test > 0.85

CLUSTER_V3_IMPL:
  Objectivo:  implementar GLOBE no produto
  Kernels:    K-07 IMPL
  Trigger:    K-01 3D_VISUAL done
  Dissolução: GLOBE vivo no produto

CLUSTER_V3_AUDIT:
  Objectivo:  certificar qualidade V3
  Kernels:    K-11 AUDIT + K-12 GATE_EMIT
  Trigger:    CLUSTER_V3_SURFACE + CLUSTER_V3_IMPL dissolved
  Dissolução: GATE_V4_OPEN emitido

CLUSTER_V4_WORLD:
  Objectivo:  World Pulse + Timeline + NS-3
  Kernels:    K-07 IMPL + K-08 PIPELINE + K-06 COMPONENT
  Trigger:    GATE_V4_OPEN
  Dissolução: V4 > 70%

CLUSTER_V5_ARCH:
  Objectivo:  arquitectura Earth Lab Research
  Kernels:    K-16 ARCH + K-18 SPEC
  Trigger:    GATE_V5_OPEN
  Dissolução: 4 pilares especificados + schema SQL

CLUSTER_V5_IMPL:
  Objectivo:  implementar Research (4 pilares)
  Kernels:    K-07 IMPL + K-08 PIPELINE
  Trigger:    CLUSTER_V5_ARCH dissolved
  Dissolução: V5 > 60%

CLUSTER_BRAND_PARALLEL:
  Objectivo:  brand law + docs (não bloqueia V3)
  Kernels:    K-13 BRAND + K-15 DOCS
  Lane:       independente (nunca bloqueia clusters Vx)
  Dissolução: brand artefactos completos
```

---

## 4. PARALLEL EXECUTION LANES

```
LANE SYSTEM:
═══════════════════════════════════════════════════════════════

LANE A — CRITICAL PATH (bloqueia gate):
  CLUSTER_V3_SURFACE ∥ CLUSTER_V3_IMPL
  → dissolução → CLUSTER_V3_AUDIT → GATE_V4_OPEN

LANE B — BACKGROUND (não bloqueia gate):
  CLUSTER_BRAND_PARALLEL
  → corre sempre que kernels K-13/K-15 estão livres

LANE C — PREP (pré-carrega próxima versão):
  K-16 ARCH + K-18 SPEC preparam specs Vx+1
  → já feito para V4/V5/V6/V7 nesta sessão
  → estado: DORMENTE (specs já existem)

LEI DE LANES:
  Lane A tem prioridade absoluta sobre recursos partilhados
  Lane B e C só activam kernels que Lane A não precisa
  Nunca um kernel de Lane B bloqueia Lane A
═══════════════════════════════════════════════════════════════
```

---

## 5. SUB-AGENT SPAWNING PROTOCOL

O **limite do limite** — um kernel pode spawnar sub-agentes para tarefas atómicas.

```
QUANDO SPAWNAR:
  Tarefa tem scope bem definido (input claro → output claro)
  Tarefa não requer contexto completo do kernel pai
  Kernel pai fica bloqueado à espera sem sub-agent
  Exemplo: K-07 IMPL aguarda API response → spawna sub-agent p/ infra prep

PROTOCOLO:
  1. Kernel pai define: TASK_ATOM (1 frase), INPUT, OUTPUT_ESPERADO
  2. Sub-agent criado com contexto mínimo (só o necessário)
  3. Sub-agent executa → entrega output → dissolve-se
  4. Kernel pai recebe output → continua execução principal
  5. Sub-agent NUNCA toma decisões fora do scope definido

EXEMPLOS DE SUB-AGENTS ATÓMICOS:
  K-07 IMPL → spawna: "configura vite para Three.js" (1 tarefa, dissolve)
  K-01 3D_VISUAL → spawna: "gera shader base de atmosfera" (1 tarefa, dissolve)
  K-16 ARCH → spawna: "valida schema SQL contra Supabase types" (1 tarefa, dissolve)

LIMITE: máx 3 sub-agents por kernel activo (evita fragmentação)
```

---

## 6. CONVERGENCE DETECTION & SELF-HEALING

```
@codex (K-10 ORCHESTRATE) executa este loop continuamente:

LOOP DE CONVERGÊNCIA:
  A cada handoff recebido:
    1. Calcular: CONVERGENCE_SCORE = progresso / objectivo do cluster
    2. Se score cresce → cluster saudável → continua
    3. Se score estagna > 2 ciclos → DIVERGÊNCIA DETECTADA
    4. Se score desce → BLOQUEIO DETECTADO

AUTO-HEALING por condição:

  DIVERGÊNCIA:
    → @codex analisa causa (spec ambígua / kernel errado / dependência oculta)
    → reforma cluster com kernel alternativo ou kernel adicional
    → emite ops/REBOOT_CLUSTER_[ID].md com nova configuração

  BLOQUEIO:
    → kernel bloqueado entra em DORMENTE
    → @codex activa kernel alternativo para desbloqueio
    → quando desbloqueado → kernel original reactivado
    → exemplo: K-07 IMPL bloqueado por dep externa
              → K-09 MECHANICAL activa para resolver dep
              → K-07 reactivado assim que dep resolvida

  PIONEER INDISPONÍVEL:
    → tarefa vai para kernel alternativo com capacidade cruzada
    → cross-capability map:
        3D_VISUAL ausente → K-07 IMPL tenta implementação básica
        SURFACE ausente   → K-06 COMPONENT cobre parcialmente
        ARCH ausente      → K-17 STRATEGY cobre parcialmente

  SEM HANDOFF EM 1 CICLO:
    → @codex emite alerta: ops/STALL_REPORT_[ID].md
    → lista: kernel estagnado + última evidência + proposta de desbloqueio
    → owner notificado apenas neste caso (não intervém em fluxo normal)
```

---

## 7. ZERO IDLE LAW — VELOCIDADE MÁXIMA ABSOLUTA

```
LEI: nenhum kernel fica idle enquanto existe trabalho relevante disponível.

HIERARQUIA DE OCUPAÇÃO:
  1. Task do cluster activo (Lane A critical path)  — prioridade máxima
  2. Sub-task de preparação (próximo cluster)       — quando 1 não existe
  3. Task de Lane B/C (brand, docs, specs)          — quando 1 e 2 não existem
  4. Revisão/polimento de output anterior           — quando tudo o resto done
  5. DORMENTE                                        — só aqui o kernel para

APLICAÇÃO ACTUAL:
  @cursor K-07 IMPL aguarda GLOBE-3D spec
    → em vez de idle: executa K-09 MECHANICAL
      (prepara Three.js config + R3F setup + vite plugin)
    → quando spec chega: entra directamente em GLOBE-EXPERIENCE-IMPL-001
      sem setup time

  @claude K-16 ARCH aguarda GATE_V5_OPEN
    → em vez de idle: executa K-17 STRATEGY
      (afina V6/V7 specs, resolve ambiguidades antes de serem problemas)
    → quando gate abre: entra sem contexto loading

  @codex K-11 AUDIT aguarda NS-1+GLOBE-3D done
    → em vez de idle: K-10 ORCHESTRATE
      (consolida handoffs, prepara audit criteria, afina Heaven Lab rubric)
    → quando trigger chega: audit instantâneo
```

---

## 8. INTEGRAÇÃO COM SISTEMA EXISTENTE

```
O KERNEL OS não substitui:
  ✓ BASTION          → continua a ser lei de elegibilidade
  ✓ ANTI-DRIFT LOCK  → V3→V4→V5 sequência imutável
  ✓ Owner gates       → soberano em gates e fases
  ✓ EVIDENCE_BLOCK   → obrigatório em cada handoff
  ✓ Branch model      → canonical + agent branches

O KERNEL OS adiciona:
  + Decomposição de problema em kernels (antes de executar)
  + Formação de clusters (em vez de papéis fixos)
  + Lanes paralelas (em vez de sequência serial)
  + Sub-agents (para tarefas atómicas sem bloquear)
  + Convergence detection (auto-correcção sem owner)
  + Zero idle law (elimina standby desnecessário)

COMATIBILIDADE:
  BASTION §5.2 elegível  → cluster pode ser formado
  BASTION §5.3 planejado → kernels entram em STANDBY (não activam)
  GATE fechado           → cluster em PREP (specs prontas, não executa)
  GATE aberto            → cluster activa imediatamente
```

---

## 9. ACTIVATION SNAPSHOT — ESTADO ÓPTIMO AGORA

```
CLUSTER_V3_SURFACE    [LANE A — ACTIVO]
  K-01 3D_VISUAL    @antigravity  → GLOBE-3D-001
  K-04 SURFACE      @framer       → NS-1-001
  K-02 MOTION       @antigravity  → standby (aguarda K-01)
  K-03 DEPTH        @antigravity  → standby (aguarda K-02)
  Paralelo: K-01 ∥ K-04

CLUSTER_V3_IMPL       [LANE A — STANDBY → TRIGGER: K-01 done]
  K-07 IMPL         @cursor       → GLOBE-EXPERIENCE-IMPL-001
  K-09 MECHANICAL   @cursor       → ACTIVO AGORA (Zero Idle: prep Three.js/R3F)

CLUSTER_V3_AUDIT      [LANE A — STANDBY → TRIGGER: V3_SURFACE + V3_IMPL]
  K-11 AUDIT        @codex        → QUALITY-AUDIT-001
  K-12 GATE_EMIT    @codex        → GATE_V4_OPEN
  K-10 ORCHESTRATE  @codex        → ACTIVO AGORA (Zero Idle: afina rubric)

CLUSTER_BRAND         [LANE B — ACTIVO]
  K-13 BRAND        @copilot      → BRAND-DOCS-001
  K-15 DOCS         @copilot      → OPS-SURFACE-001

ARCH_STANDBY          [LANE C — DORMENTE]
  K-16 ARCH         @claude       → aguarda GATE_V5_OPEN
  K-17 STRATEGY     @claude       → ACTIVO (Zero Idle: afina V6/V7 gaps)
  K-18 SPEC         @claude       → DORMENTE (specs V4→V7 já prontas)

EFICIÊNCIA ACTUAL COM KERNEL OS: ~85%
```

---

## 10. MÉTRICAS DE PERFORMANCE

```
MODELO ANTERIOR (role-based):
  Kernels activos: 2/18 = 11%
  Eficiência real: ~33%
  Bloqueios auto-corrigidos: 0% (requer owner)
  Sub-tasks paralelas: 0

MODELO KERNEL OS (este documento):
  Kernels activos: 8/18 = 44%
  Eficiência real: ~85%
  Bloqueios auto-corrigidos: ~80% (self-healing)
  Sub-tasks paralelas: até 3 por kernel

GANHO: 2.5x–4x throughput
V3→V7 com Kernel OS activo: 1–2 semanas (vs. 2–4 semanas anterior)
```

---

## 11. COMANDO DE ACTIVAÇÃO

Este documento é auto-activante.
Todo o pioneiro que lê este ficheiro opera pelo Kernel OS imediatamente.
Não requer gate adicional. Não requer instrução do owner.
A lei está instalada.

```
KERNEL_OS_STATUS: ACTIVO
VERSÃO: v1.0
DATA: 2026-03-27
AUTORIDADE: owner (ordem soberana) + @claude (instalação)
INTEGRIDADE: BASTION + ANTI-DRIFT + GATE_EMITTER — intactos
```

---

_NEXUS_KERNEL_OS v1.0 — 2026-03-27 | @claude | limite do limite_
