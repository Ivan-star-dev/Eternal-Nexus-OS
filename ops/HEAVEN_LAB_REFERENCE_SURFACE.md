# HEAVEN_LAB_REFERENCE_SURFACE — Lei Canónica da Superfície Produto

> Lei primária do Product Face.
> Toda superfície de produto deriva deste documento.
> Não alterar sem gate do owner.

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

## 1. FILOSOFIA DA SUPERFÍCIE

A superfície do Heaven Lab não é um website.
É a prova física de que o sistema existe.

**Lei-mãe:**
> O produto não comunica. O produto demonstra.
> Cada elemento é evidência, não promessa.

Princípios operacionais:
- **Restraint over decoration** — cada elemento tem propósito. Nada é decorativo.
- **Depth over flatness** — camadas visuais criam presença, não ruído.
- **Evidence over claim** — números reais, não headlines de marketing.
- **Sacred over generic** — a superfície deve sentir-se única, não como um template.

---

## 2. ANATOMIA CANÓNICA DA HERO SURFACE

Read order obrigatório para `ProductHero`:

```
BLOCO 1 — GLOBE (presença planetária)
  → O globo é o ponto de entrada. É a afirmação: "isto governa o mundo."
  → Wrappado em OrbitalChamber (respiração sagrada)
  → Tamanho: clamp(480px, 68vw, 780px) — grande o suficiente para ser inconfundível
  → Posição: centrado, ocupa o viewport completo
  → Overlay radial: transparente no centro, escurece nas bordas (legibilidade)

BLOCO 2 — TRINITY ROW
  → Três filhos com igual dignidade visual
  → Heaven Lab · Bridge Nova · Nexus Cria
  → Row horizontal (não vertical stack)
  → Glass panel: rgba(255,255,255,0.025) · border 0.5px · backdrop-blur(16px)
  → Hover: expand identity line + micro-detail (JetBrains Mono, teal)

BLOCO 3 — DIVIDER (respiro)
  → Espaço generoso: pt-20 entre Trinity e Proof
  → Não colocar nada aqui. O espaço é o conteúdo.

BLOCO 4 — FIRST PROOF
  → Uma frase-mãe (evidence, not promise)
  → 4 contadores com count-up animation (JetBrains Mono, teal)
  → No superlatives. No adjectives. Number + real object.

BLOCO 5 — CANONICAL REFERENCE
  → "Eternal Nexus OS · v9 · Heaven Lab · 2026"
  → Font mono, very small, rgba(255,255,255,0.2)
  → Not a CTA. An anchor.
```

---

## 3. ORBITAL CHAMBER — LEI DO WRAPPER

O `OrbitalChamber` é o invólucro sagrado do globo.

```
Layers (bottom to top):
  InnerSanctum   → radial dark core, deepens 3D depth (z-index: 0)
  AuroraRim      → faint gold/teal edge light, enters once on mount (z-index: 0)
  Globe content  → z-index: 1
  OuterRing      → breathing glass border, pulses on ambient loop (z-index: 2)
```

**OuterRing breathing spec:**
- `opacity: [0.3, 0.55, 0.3]` — amplitude: ±0.125
- `scale: [1, 1.012, 1]` — subtlissimo: ±0.6%
- `duration: 4.2s` — slow, organic
- `repeat: Infinity` — sempre vivo

**AuroraRim:**
- Gold warmth top: `hsl(42 78% 45% / 0.04)` radial at 50% 0%
- Teal depth bottom: `hsl(172 55% 28% / 0.03)` radial at 50% 100%
- Enters once: opacity 0→1 over 2.4s, delay 0.8s

---

## 4. TYPOGRAPHY LAW (PRODUCT_FACE_TYPE)

| Elemento | Font | Size | Weight | Color |
|---|---|---|---|---|
| Trinity name | Syne | 13px | 400 | gold hsl(42 78% 45%) |
| Trinity role | Cormorant Garamond | 14px | 300 italic | paper #e4ebf0 |
| Trinity micro | JetBrains Mono | 10px | 400 | teal hsl(172 48% 52%) |
| First proof phrase | Cormorant Garamond | clamp(17px,2.2vw,22px) | 300 italic | rgba(228,235,240,0.72) |
| Proof counters | JetBrains Mono | 28px | 400 | teal hsl(172 48% 52%) |
| Proof labels | Syne | 10px | 400 uppercase | rgba(255,255,255,0.35) |
| Institutional stamp | JetBrains Mono | 9px | 400 uppercase | rgba paper-dim/40 |
| Section anchors | Syne | 9px | 500 uppercase | rgba(255,255,255,0.25) |

---

## 5. COLOUR PALETTE (PRODUCT FACE)

| Token | Value | Usage |
|---|---|---|
| `gold` | `hsl(42 78% 45%)` | Primary accent · Trinity names · network nodes |
| `teal` | `hsl(172 48% 52%)` | Secondary accent · counters · micro-detail · seismic |
| `teal-depth` | `hsl(172 55% 28%)` | Atmospheric background depth |
| `paper` | `#e4ebf0` | Body text · identity lines |
| `ink-deep` | `#060c14` | Hero background |
| `glass` | `rgba(255,255,255,0.025)` | Glass panels |
| `glass-border` | `rgba(255,255,255,0.065)` | Glass borders |

---

## 6. GLOBE LIGHTING LAW

```
3-point lighting (GlobeScene):
  ambientLight       → intensity 0.2  (neutral base)
  pointLight [key]   → [12, 8, 10]   · intensity 0.45 · color #D4AF37 (gold warmth)
  pointLight [fill]  → [-10,-6,-8]   · intensity 0.18 · color #2dd4bf (teal coolness)
  hemisphereLight    → sky #1a2a4a · ground #0a0a14 · intensity 0.15

AtmosphereSphere:
  radius: GLOBE_RADIUS × 1.08
  color: #1a4a4a (teal-deep)
  opacity: 0.06 breathing (±0.012 via useFrame)
  side: BackSide

CoronaSphere:
  radius: GLOBE_RADIUS × 1.18
  color: #c8a44e (gold)
  opacity: 0.018 (static)
  side: BackSide
```

---

## 7. MOTION LAW

Toda animação deriva de `src/lib/motion/config.ts`.

Regras absolutas:
- **Nada é hardcoded** — ease values, durations, stagger — tudo do config
- **Reveals são suaves** — nunca snap, nunca pop
- **Loops são respirações** — amplitude pequena, frequência lenta
- **Globe enters last** — depois de tudo estar montado, o globo completa o campo

Timing referência:
```
Institutional stamp:  delay 0.3s  (primero elemento a aparecer)
Globe enter:          delay 0.0s  duration 1.4s (cinematic)
Globe anchor label:   delay 1.6s  (após construção)
Trinity row:          whileInView, margin -40px
HeroFirstProof:       whileInView, margin -60px
```

---

## 8. MACHINE SUBSTRATE

Grid CSS de fundo — opacidade ~2.5%, invisível mas presente:
```
repeating-linear-gradient(0deg,  transparent, transparent 47px, rgba(255,255,255,0.025) 47px, rgba(255,255,255,0.025) 48px),
repeating-linear-gradient(90deg, transparent, transparent 47px, rgba(255,255,255,0.025) 47px, rgba(255,255,255,0.025) 48px)
```

Regra: não deve ser perceptível. Deve ser sentido.

---

## 9. WHAT IS FORBIDDEN

```
FORBIDDEN-01: Gradients mais escuros que o fundo do hero (cria flatness)
FORBIDDEN-02: Text shadows em superfície de produto
FORBIDDEN-03: Border-radius grande (rounded-xl ou maior) em componentes hero
FORBIDDEN-04: Call-to-action buttons no hero — o hero é evidência, não venda
FORBIDDEN-05: Stock photography como background
FORBIDDEN-06: Overlay com opacity > 0.92 (mata a profundidade do globo)
FORBIDDEN-07: Duplicate typography weights no mesmo bloco (escolher UMA voz)
FORBIDDEN-08: Cores fora da paleta PRODUCT FACE (ver Secção 5)
```

---

## 10. AUDIT CHECKLIST (V3 CLOSE)

```
[ ] Globe is primary — ocupa ≥60% do viewport height
[ ] OrbitalChamber breathing — outer ring pulsa, aurora rim presente
[ ] GlobeScene has AtmosphereSphere + CoronaSphere + 3-point lighting
[ ] TrinityRow: hover identity + micro-detail + glass panel
[ ] HeroFirstProof: count-up active + mother phrase present
[ ] motion/config.ts is sole source of EASE_OUT, DUR, STAGGER
[ ] Index.tsx uses ProductHero — not inline hero
[ ] TypeScript: 0 errors
[ ] No hardcoded animation values outside motion/config.ts
[ ] EarthquakeLayer and GlobeLayerSelector wired
```

---

_HEAVEN_LAB_REFERENCE_SURFACE.md v1.0 — 2026-03-24 · @claude · MASTER-TOTAL-ARMY-WAVE-001_
