# V6_MINIMUM_SPEC — Learning & Mastery

**Preparado por:** @claude
**Data:** 2026-03-26
**Gate:** fechado — abre quando V5-RESEARCH-CORE-IMPL-001 ✓
**Pioneer:** @cursor (impl) · @framer (UI)

---

## MISSÃO V6

```
A camada estudante explode.
O utilizador não apenas investiga o planeta — aprende a investigá-lo.
Progressão visível · missões reais · AI tutor integrado.
Aprendizagem por exploração, não por lição.
```

---

## 4 FEATURES MÍNIMAS

### FEATURE 1 — LAB MISSIONS
```
O QUÊ:  Missões curtas que ensinam investigação real
        Cada missão = problema real + ferramentas Earth Lab
DATA:   mission { id, title, objective, tools: Tool[],
                  steps: Step[], reward, region_id }
UI:     Cards de missão · progresso visual · completion seal
CRIT:   3+ missões funcionais · conclusão rastreada
```

### FEATURE 2 — MASTERY MAP
```
O QUÊ:  Mapa de domínio — o que o utilizador já sabe sobre o planeta
        Visualização de competências por domínio (energia · clima · geo)
DATA:   mastery { domain, level: 0-5, evidence: string[],
                  unlocked_at }
UI:     Globe com zonas coloridas por nível de domínio
CRIT:   Domínios visíveis · nível actualiza com actividade real
```

### FEATURE 3 — GUIDED MODE
```
O QUÊ:  Modo guiado — AI tutor conduz o utilizador pelo Earth Lab
        Sugestões contextuais · próximo passo sempre claro
DATA:   guide_session { user_id, current_topic,
                        suggested_next: Action[], context }
UI:     Painel lateral discreto · não intrusivo · toggle on/off
CRIT:   Sugestões relevantes · baseadas no comportamento real
```

### FEATURE 4 — SANDBOX MODE
```
O QUÊ:  Modo livre — sem missão · exploração pura · sem avaliação
        O utilizador experimenta sem consequência
UI:     Toggle entre Guided / Sandbox · estado persistente
CRIT:   Transição suave entre modos · estado guardado
```

---

## CRITÉRIO DE FECHO V6
```
✓ 3+ Lab Missions funcionais com conclusão rastreada
✓ Mastery Map actualiza com actividade real
✓ Guided Mode activo com sugestões contextuais
✓ Sandbox Mode toggle funcional
✓ Globe ainda dominante — V6 não destrói V3
```

---

*V6_MINIMUM_SPEC.md — 2026-03-26 | @claude | pré-carregado*
