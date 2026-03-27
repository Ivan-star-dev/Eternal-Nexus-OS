# GO NOW — @cursor

> Ordem directa do owner: 2026-03-27
> Executar imediatamente. Sem pausa. Sem espera.

---

## TAREFA AGORA (Zero Idle — K-09 MECHANICAL)

```
TASK:    GLOBE-INFRA-PREP-001
KERNEL:  K-09 MECHANICAL
RAZÃO:   K-07 IMPL aguarda GLOBE-3D spec do @antigravity
         Em vez de idle → preparas toda a infra agora
         Quando spec chegar → entras sem setup time
```

## O QUE FAZER AGORA (K-09)

```
1. Instalar dependências Three.js / React Three Fiber:
   npm install three @react-three/fiber @react-three/drei

2. Criar estrutura de ficheiros:
   src/components/globe/
     GlobeCanvas.tsx     ← canvas principal
     GlobeScene.tsx      ← scene + camera + lighting
     GlobeControls.tsx   ← orbit controls
     GlobeAtmosphere.tsx ← shader de atmosfera
     index.ts            ← exports

3. Configurar vite se necessário para WebGL/WASM

4. Criar GlobeCanvas placeholder:
   · canvas React Three Fiber
   · esfera wireframe 1x1x1
   · camera perspective a 5 unidades
   · ambient + directional light
   · OrbitControls básico
   · render a 60fps confirmado

5. Sub-agents permitidos (até N — usa quantos precisas):
   · "testa import Three.js: render 1 frame sem erro"
   · "valida WebGL disponível no browser target"
   · "configura vite.config.ts para three.js"
```

## PRÓXIMA TASK (K-07 IMPL — aguarda trigger)

```
TASK:          GLOBE-EXPERIENCE-IMPL-001
TRIGGER:       GLOBE-3D-001 spec do @antigravity done
O QUE FAZER:   implementar o GLOBE vivo no produto
               usando a spec do @antigravity como blueprint
PIPELINE:      V3 → V4 → V5 → V6 (tudo pré-especificado)
```

## PIPELINE COMPLETO (pré-carregado)

```
GLOBE-EXPERIENCE-IMPL-001  → trigger: GLOBE-3D spec
V4-WORLD-FEATURES-001       → trigger: ops/GATE_V4_OPEN.md existe
V5-RESEARCH-IMPL-001        → trigger: ops/GATE_V5_OPEN.md existe
V6-MISSIONS-IMPL-001        → trigger: ops/GATE_V6_OPEN.md existe

Specs já prontas:
  ops/V4_MINIMUM_SPEC.md
  ops/EARTH_LAB_RESEARCH_CORE_ARCH.md
  ops/V6_MINIMUM_SPEC.md
  ops/V7_MINIMUM_SPEC.md
```

## HANDOFF (emitir ao concluir K-09 prep)

```
BRIDGE_HANDOFF
  KERNEL:             K-09 MECHANICAL
  TASK_ID:            GLOBE-INFRA-PREP-001
  PIONEER:            @cursor
  STATUS:             concluída
  COMMIT:             [hash]
  EVIDENCE:           Three.js instalado · estrutura criada · canvas base OK · [fps]
  CLUSTER:            CLUSTER_V3_IMPL
```

## REFERÊNCIAS

```
ops/CURSOR_ACTIVATION_001.md    → pipeline completo
ops/CURSOR_PIPELINE_UPDATE.md   → update do pipeline
ops/NEXUS_KERNEL_OS.md          → protocolo
ops/BRIDGE_STATE.md             → estado actual
```

---

**Começa por K-09 AGORA. Quando @antigravity commitar GLOBE-3D → K-07 activa → GLOBE vivo no produto.**

_GO_NOW | 2026-03-27 | owner order_
