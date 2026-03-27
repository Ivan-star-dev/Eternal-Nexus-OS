# V7_MINIMUM_SPEC — Collaboration Intelligence

**Preparado por:** @claude
**Data:** 2026-03-26
**Gate:** fechado — abre quando V6 ✓
**Pioneers:** @cursor (impl) · @framer (UI) · @codex (arquitectura)

---

## MISSÃO V7

```
Colaboração séria entre investigadores.
Não é partilha de ficheiros — é co-investigação em tempo real.
Reputação por prova · permissões por papel · labs partilhados.
```

---

## 4 FEATURES MÍNIMAS

### FEATURE 1 — SHARED LIVE LABS
```
O QUÊ:  Laboratórios partilhados em tempo real
        2+ utilizadores investigam o mesmo problema em simultâneo
TECH:   Supabase Realtime · presence · cursors
DATA:   shared_lab { id, participants: User[], state: LabState,
                     created_at, region_id }
CRIT:   2+ utilizadores num lab · mudanças visíveis em tempo real
```

### FEATURE 2 — PROFESSOR / LEAD INVESTIGATOR MODE
```
O QUÊ:  Papel especial — lidera a investigação do grupo
        Pode guiar · bloquear · aprovar descobertas
DATA:   role { user_id, lab_id, type: 'lead'|'investigator'|'observer' }
UI:     Badge de papel · controlos de liderança discretos
CRIT:   Lead pode guiar grupo · permissões por papel funcionais
```

### FEATURE 3 — SILENT COLLABORATION
```
O QUÊ:  Trabalho em paralelo sem distracção
        Ver o que o outro faz sem interromper
UI:     Cursors ghost · actividade peripheral · sem notificações intrusivas
CRIT:   2 utilizadores em silent mode · actividade visível subtilmente
```

### FEATURE 4 — REPUTAÇÃO POR PROVA
```
O QUÊ:  Reputação baseada em descobertas confirmadas — não em actividade
        Hipótese confirmada = reputação ganha · descoberta partilhada = amplificada
DATA:   reputation { user_id, score, evidence: ProvenFact[], level }
UI:     Score no perfil · badge por domínio · leaderboard por região
CRIT:   Reputação actualiza com prova real · não com clicks
```

---

## CRITÉRIO DE FECHO V7
```
✓ Shared Lab com 2+ utilizadores em tempo real
✓ Papéis funcionais (lead · investigator · observer)
✓ Silent collaboration visível e não intrusiva
✓ Reputação actualiza por prova confirmada
✓ Globe ainda dominante — V7 não destrói experiência core
```

---

*V7_MINIMUM_SPEC.md — 2026-03-26 | @claude | pré-carregado*
