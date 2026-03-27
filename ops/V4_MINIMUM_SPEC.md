# V4_MINIMUM_SPEC — Living World Minimum

**Preparado por:** @claude (pré-carregado para entrada instantânea quando V3 fechar)
**Data:** 2026-03-26
**Gate:** fechado — abre quando V3 Heaven Lab Test > 0.85
**Pioneers:** @cursor (WorldFeatures) · @framer (NS-3) · @antigravity (apoio)

---

## O QUE É V4

```
O mundo começa a parecer vivo.
O utilizador sente que está dentro de um planeta real — não num site.
Dados geográficos reais · interface que respira · pulso do mundo visível.
```

---

## TASKS V4 — SPEC COMPLETA

### V4-WORLD-FEATURES-001  [@cursor · P1]

```
FEATURE 1 — WORLD PULSE
  O quê:  Pulso visual do planeta — dados em tempo real a pulsar no globe
  Como:   Pontos de actividade sobre o globe com intensidade proporcional
  Dados:  projects activos · CO² por região · SDG hotspots
  Critério: Pulso visível · dados reais · não decorativo

FEATURE 2 — TIMELINE BASE
  O quê:  Linha do tempo de eventos e projectos no Earth Lab
  Como:   Scroll horizontal ou overlay sobre o globe
  Dados:  milestones reais do sistema · dates canónicos
  Critério: timeline navegável · dados reais · encaixa no SYSTEM_FACE_CANON

FEATURE 3 — SCENARIO COMPARISON BASE
  O quê:  Comparação de cenários de impacto (base mínima)
  Como:   Toggle entre 2 estados do planeta (actual vs projectado)
  Dados:  project_metrics · impactScore · CO² delta
  Critério: 2 cenários comparáveis · visão clara do delta
```

### NS-3-FRAMER-UI-001  [@framer · P2]

```
WONDER LAYER UI — 5 componentes mínimos

  1. BREATHING INTERFACE
     O quê: layout que expande/contrai ao ritmo do World Pulse
     Ritmo: sync com pulso do globe (4000ms base de ORBITAL-CHAMBER)

  2. WORLD PULSE INDICATOR
     O quê: UI element que mostra actividade global em tempo real
     Posição: canto inferior direito ou overlay no globe

  3. DISCOVERY SIGNATURES
     O quê: micro-animações ao descobrir novo conteúdo
     Trigger: hover em projectos · click em regiões do globe

  4. DEEP FOCUS MODE
     O quê: modo que colapsa UI secundária → deixa só o globe e dados
     Toggle: tecla ou botão discreto

  5. DAWN / DUSK THEME
     O quê: tema dinâmico baseado na hora local do utilizador
     Paleta: BRAND_MOTHER_SYSTEM · variantes aurora · noite profunda
```

---

## CRITÉRIO DE FECHO V4

```
PASSA se:
  ✓ World Pulse visível com dados reais
  ✓ Breathing interface activa e sincronizada
  ✓ Timeline base navegável
  ✓ NS-3 — 5+ componentes Wonder Layer funcionais
  ✓ Globe continua dominante (não é destruído pelo V4)

NÃO PASSA se:
  ✗ Dados de World Pulse são hardcoded / decorativos
  ✗ Breathing não está sincronizada com o globe
  ✗ Layout de V3 degradado para adicionar V4 features
```

---

## ENTRADA INSTANTÂNEA

```
Quando @codex emitir GATE_V4_OPEN:
  @cursor  → lêr este ficheiro → começar V4-WORLD-FEATURES-001 imediatamente
  @framer  → lêr este ficheiro → começar NS-3-FRAMER-UI-001 imediatamente
  Sem espera. Sem instrução adicional do owner.
```

---

*V4_MINIMUM_SPEC.md — 2026-03-26 | @claude | pré-carregado para entrada instantânea*
