# SEQUENCE_LAW_V3_V4_V5 — Lei de Sequência de Fases

> Lei de progressão de fases do sistema.
> Define o que "fechar V3" significa, o que abre V4, e o que abre V5.
> Owner aprova transição de fase. Nenhum pioneiro fecha fase sozinho.

---

## 0. IDENTIDADE DO DOCUMENTO

| Campo | Valor |
|---|---|
| **Versão** | v1.0 |
| **Data** | 2026-03-24 |
| **Criado por** | @claude · claude-sonnet-4-6 |
| **Task** | MASTER-TOTAL-ARMY-WAVE-001 |
| **Branch** | `claude/rebuild-bastion-core-rihGX` |

---

## 1. LEI-MÃE

```
V3 fecha quando o sistema DEMONSTRA — não quando parece demo.
V4 abre quando V3 está canonicamente fechado e o owner aprova.
V5 abre quando V4 está canonicamente fechado e o owner aprova.

Nunca abrir V4 com V3 incompleto.
Nunca abrir V5 com V4 incompleto.
```

---

## 2. V3 — SURFACE CANONICAL

**Tema:** A superfície produto é real, canónica, e reconhecível como Heaven Lab.

### 2.1 Critérios de Fechamento V3

```
SURFACE-01  [ ] Globe 3D com presença planetária (AtmosphereSphere + CoronaSphere + 3-point lighting)
SURFACE-02  [ ] OrbitalChamber wrapping the globe (breathing ring + aurora rim)
SURFACE-03  [ ] TrinityRow canonical (hover · micro-detail · glass panel)
SURFACE-04  [ ] HeroFirstProof canonical (count-up · mother phrase · 4 real metrics)
SURFACE-05  [ ] ProductHero wired into Index.tsx (not inline generic hero)
SURFACE-06  [ ] EarthquakeLayer seismic rings on globe
SURFACE-07  [ ] GlobeLayerSelector layer control UI
SURFACE-08  [ ] motion/config.ts is single source of truth (EASE · DUR · STAGGER)
SURFACE-09  [ ] FounderPage has atmospheric hero + Pioneers section
SURFACE-10  [ ] NavBar: glass on scroll · active link states · hide on scroll down
SURFACE-11  [ ] TypeScript: 0 errors across entire codebase
SURFACE-12  [ ] HEAVEN_LAB_REFERENCE_SURFACE.md exists and is canonical
SURFACE-13  [ ] OrbitalChamber syncs with GlobeScene focus state (future: @antigravity)

MOTION-01   [ ] Globe enters with cinematic reveal (GlobeConstructionSequence)
MOTION-02   [ ] All reveals use EASE_OUT from motion/config.ts
MOTION-03   [ ] TrinityRow stagger uses STAGGER.base from motion/config.ts
MOTION-04   [ ] HeroFirstProof counter uses count-up hook (not static numbers)

SYSTEM-01   [ ] OrganStatusGrid shows 6 organs with live indicators
SYSTEM-02   [ ] ProjectsLiveSection fetches from Supabase globe_projects
SYSTEM-03   [ ] DossierCard renders project with image + status badge
SYSTEM-04   [ ] ContributionsSection renders public contributions
```

### 2.2 Estado Atual V3 (2026-03-24)

```
SURFACE-01  [✓] AtmosphereSphere + CoronaSphere + 3-point lighting — DONE
SURFACE-02  [✓] OrbitalChamber wrapping globe — DONE
SURFACE-03  [✓] TrinityRow canonical — DONE
SURFACE-04  [✓] HeroFirstProof canonical — DONE
SURFACE-05  [✓] ProductHero wired into Index.tsx — DONE
SURFACE-06  [✓] EarthquakeLayer — DONE
SURFACE-07  [✓] GlobeLayerSelector — DONE
SURFACE-08  [✓] motion/config.ts — DONE
SURFACE-09  [✓] FounderPage hero + Pioneers — DONE (FVL-IMPL-001)
SURFACE-10  [~] NavBar: solid structure · needs @framer polish (NS-2)
SURFACE-11  [✓] TypeScript 0 errors — CONFIRMED
SURFACE-12  [✓] HEAVEN_LAB_REFERENCE_SURFACE.md — CREATED NOW
SURFACE-13  [ ] OrbitalChamber focus sync — PENDING (@antigravity: GLOBE-3D-AURORA-001)

MOTION-01   [✓] GlobeConstructionSequence cinematic — EXISTS
MOTION-02   [✓] 32 files migrated by MOTION-SWEEP-001 — 0 hardcoded ease in src/ — DONE
MOTION-03   [✓] TrinityRow uses STAGGER.base — DONE
MOTION-04   [✓] Count-up hook in HeroFirstProof — DONE

SYSTEM-01   [✓] OrganStatusGrid 6 organs — EXISTS
SYSTEM-02   [✓] ProjectsLiveSection Supabase — EXISTS
SYSTEM-03   [✓] DossierCard — EXISTS
SYSTEM-04   [✓] ContributionsSection — EXISTS
```

**V3 status: ~95% — MOTION-SWEEP-001 done · awaiting @antigravity (GLOBE-3D-AURORA-001) + @framer (NS-1-HERO-COMPOSITION-001 · NS-2-NAV-POLISH-001)**

### 2.3 Gate para fechar V3

```
GATE-V3-CLOSE:
  1. GLOBE-3D-AURORA-001 concluída (@antigravity)
  2. NS-1-HERO-COMPOSITION-001 concluída (@framer)
  3. NS-2-NAV-POLISH-001 concluída (@framer)
  4. Owner faz auditoria visual da superfície
  5. Owner aprova V3 fechado
  6. @claude atualiza este documento: V3 STATUS → FECHADO
  7. V4 gate abre
```

---

## 3. V4 — SYSTEM BEHAVIOUR LIVE

**Tema:** O sistema comporta-se de forma inteligente. Session memory. NexusPage canonical. Live data.

### 3.1 Critérios de Abertura V4

```
Requer: V3 FECHADO + Gate V3 aprovado pelo owner
```

### 3.2 Escopo V4 (Planejado)

```
SESSION-01  [ ] Session memory persistence (Eternal Memory OS)
SESSION-02  [ ] NexusPage canonical — AI parliament with real proposals
SESSION-03  [ ] AtlasPage fully wired to Supabase globe_projects
SESSION-04  [ ] ProjectPage canonical — individual project detail surface
SESSION-05  [ ] PersonalLens — user's view of their own impact
SESSION-06  [ ] IntelligenceFeed — live geopolitical feed wired

DATA-01     [ ] WorldBank API integrated in Atlas
DATA-02     [ ] Earthquake live data from USGS or equivalent
DATA-03     [ ] Market data pulse (simplified)

INTERACTION-01 [ ] OrbitalChamber responds to focused project state
INTERACTION-02 [ ] Globe hotspot click → opens project panel
INTERACTION-03 [ ] CommandPalette wired to all routes
```

### 3.3 Gate para abrir V4

```
GATE-V4-OPEN:
  1. V3 officially FECHADO (gate approved by owner)
  2. BASTION updated with V4 task queue
  3. @codex emits V4 task distribution report
  4. Owner approves V4 start
```

---

## 4. V5 — PLATFORM SOVEREIGNTY

**Tema:** O sistema é uma plataforma soberana. Auth completo. Multi-user. APIs próprias.

### 4.1 Critérios de Abertura V5

```
Requer: V4 FECHADO + Gate V4 aprovado pelo owner
```

### 4.2 Escopo V5 (Esboço)

```
PLATFORM-01 [ ] Auth completo — Supabase Auth + profiles
PLATFORM-02 [ ] Multi-user dashboard — cada user vê os seus projectos
PLATFORM-03 [ ] Owner Dashboard canonical — full control surface
PLATFORM-04 [ ] API pública (read-only) — embeds externos
PLATFORM-05 [ ] Investor Portal canonical — DeltaSpine + others
PLATFORM-06 [ ] Notificações em tempo real (Supabase Realtime)
PLATFORM-07 [ ] Export de relatórios (PDF generation)
PLATFORM-08 [ ] Mobile experience polished — PWA ready
```

### 4.3 Gate para abrir V5

```
GATE-V5-OPEN:
  1. V4 officially FECHADO
  2. Produto demonstrado a pelo menos 1 investor / parceiro
  3. Owner aprova escala para V5
```

---

## 5. TRANSIÇÕES PROIBIDAS

```
FORBIDDEN: Abrir V4 antes de V3 estar oficialmente fechado pelo owner
FORBIDDEN: Abrir V5 antes de V4 estar oficialmente fechado pelo owner
FORBIDDEN: Qualquer pioneiro declarar uma fase fechada sem aprovação do owner
FORBIDDEN: Saltar critérios de fechamento sem gate explícito
FORBIDDEN: Retroceder fase (V4 → V3) sem decisão soberana do owner
```

---

## 6. LINHA V3 → V5 NO SISTEMA V10

```
V3  = Surface Canonical       (estamos aqui — ~90%)
V4  = System Behaviour Live   (próxima fase)
V5  = Platform Sovereignty    (escala)
V6  = Ecosystem Integration   (parceiros, APIs externas)
V7  = Autonomous Governance   (IA governa fluxos de dados)
V8  = Planetary Network       (nodes físicos + digitais)
V9  = Heaven Lab Sovereign    (sistema autónomo completo)
V10 = Eternal Nexus OS        (organismo vivo, global, permanente)
```

---

_SEQUENCE_LAW_V3_V4_V5.md v1.0 — 2026-03-24 · @claude · MASTER-TOTAL-ARMY-WAVE-001_
