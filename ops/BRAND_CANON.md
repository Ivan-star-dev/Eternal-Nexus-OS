# BRAND_CANON.md — Eternal Nexus OS · Heaven Lab
> K-13 BRAND · BRAND-DOCS-001 · cravado 2026-03-27

---

## 1. COLOUR PALETTE

### Core backgrounds
| Token | Value | Role |
|---|---|---|
| `--background` | `hsl(216 50% 5%)` | Page base — deep institutional navy |
| `#0a0a1a` | deep space dark | Hero base, absolute bg, vignette edges |
| `--card` | `hsl(216 45% 8%)` | Card surface |
| `--ink-deep` | `hsl(216 55% 3%)` | Deepest ink |
| `--ink-dark` | `hsl(220 15% 4%)` | Dark ink |
| `--petroleum-blue` | `hsl(210 65% 8%)` | Ruberra depth base |
| `--abyssal` | `hsl(216 60% 4%)` | Maximum depth |

### Primary accents
| Token | Value | Role |
|---|---|---|
| `--gold` / `--primary` | `hsl(42 78% 45%)` | Authoritative gold — CTAs, rules, labels |
| `--gold-light` | `hsl(42 70% 58%)` | Gold hover / shimmer highlight |
| `--gold-dim` | `hsl(42 60% 28%)` | Subdued gold, scrollbar hover |
| `--burnt-gold` | `hsl(36 65% 38%)` | Ruberra depth warm |
| `--burnt-gold-light` | `hsl(36 60% 50%)` | Ruberra depth warm lifted |
| `--amber` | `hsl(38 80% 42%)` | Amber accent |

### Operational / live
| Token | Value | Role |
|---|---|---|
| `--accent` / `--teal` | `hsl(172 55% 28%)` | Operational / active status |
| `--teal-light` | `hsl(172 48% 52%)` | LIVE dot, status indicators |

### Semantic
| Token | Value | Role |
|---|---|---|
| `--foreground` / `--paper` | `hsl(210 25% 93%)` | Primary text |
| `--paper-dim` | `hsl(215 12% 55%)` | Secondary / muted text |
| `--muted-foreground` | `hsl(215 15% 48%)` | Quiet labels |
| `--platinum` | `hsl(210 18% 85%)` | Near-white highlight |
| `--red-classified` | `hsl(0 52% 32%)` | Classification / destructive |
| `--border` / `--rule` | `hsl(216 20%–22% 14%)` | Hairlines, dividers |

### Morabeza (Cabo-Verdiana warm palette)
| Token | Value |
|---|---|
| `--morabeza-warm` | `hsl(28 72% 52%)` |
| `--morabeza-sunset` | `hsl(16 78% 48%)` |
| `--morabeza-sand` | `hsl(35 45% 72%)` |
| `--morabeza-terracotta` | `hsl(12 55% 42%)` |
| `--morabeza-ocean` | `hsl(195 55% 38%)` |

### Gradients & glows
- Gold gradient: `linear-gradient(90deg, hsl(42 78% 45%), hsl(42 70% 58%))`
- Dark gradient: `linear-gradient(180deg, hsl(216 55% 3%) 0%, hsl(216 45% 8%) 100%)`
- Hero gradient: `linear-gradient(180deg, #0a0a1a 0%, #0d0e20 40%, #0a0a1a 100%)`
- Glow gold: `0 0 60px -10px hsl(42 78% 45% / 0.18)`
- Glow teal: `0 0 40px -8px hsl(172 55% 28% / 0.2)`
- Glass surface: `hsl(216 40% 8% / 0.6)`

---

## 2. TYPOGRAPHY

### Families
| Role | Family | Weight | Use |
|---|---|---|---|
| Display / Sans | `Syne` | 700 (headings), 400–600 (body) | Headings, logotype, CTAs, body |
| Serif | `Cormorant Garamond` | 300–700 | Editorial, pull quotes, metric values |
| Mono | `JetBrains Mono` | 300–500 | Labels, code, data, badges, top-bars |

### Scale (clamp values from codebase)
| Element | Value |
|---|---|
| H1 hero | `clamp(40px, 9vw, 88px)` — Syne 700, tracking-tight |
| Body / subline | `clamp(14px, 2.2vw, 17px)` — Syne 400 |
| Metric value | `2.4rem` — Cormorant 700 |
| Globe ring sizing | `clamp(260px, 48vw, 580px)` |
| Section label | `0.6rem` — Mono, `letter-spacing: 0.25em` |
| Badge / top-bar | `8–9px` — Mono, `letter-spacing: 0.20–0.28em` |
| Stamp classified | `0.58rem` — Mono, `letter-spacing: 0.3em` |
| Metric label | `0.56rem` — Mono, `letter-spacing: 0.18em` |

### Rendering
- `-webkit-font-smoothing: antialiased`
- `-moz-osx-font-smoothing: grayscale`
- H1–H3 default to `font-serif` (Cormorant); override with `.font-display` for Syne

---

## 3. MOTION PRINCIPLES

| Property | Value |
|---|---|
| Signature ease | `[0.22, 1, 0.36, 1]` — fast attack, long ease-out |
| Duration fast | `0.15s` |
| Duration normal | `0.4s` (transitions, hover states) |
| Duration slow | `0.75–0.9s` (entrance animations) |
| Stagger children | `0.14s` between siblings |
| Delay children | `0.3s` before stagger starts |
| Entrance — slide-up | `y: 24 → 0`, `opacity: 0 → 1`, `0.75s` |
| Entrance — fade-in | `opacity: 0 → 1`, `0.9s` |
| Hover lift | `cubic-bezier(0.16, 1, 0.3, 1)`, `translateY(-4px)` |
| Magnetic hover | `scale(1.02)`, `0.25s` |
| Float loop | `translateY 0 → -6px → 0`, `4s ease-in-out infinite` |
| Pulse dot | `opacity 1 → 0.2 → 1`, `2s ease-in-out infinite` |
| Shimmer | `background-position -200% → 200%`, `3s` |
| Scroll hint | `y: 0 → 5 → 0`, `2s infinite` |
| Reduced motion | all animations disabled via `prefers-reduced-motion` |

---

## 4. COMPONENT TOKENS

### Card
- Background: `hsl(216 45% 8%)` + `border: 1px solid rgba(255,255,255,0.08)`
- Glass variant: `backdrop-filter: blur(24px) saturate(1.8)` + `hsl(var(--card) / 0.7)`
- Shadow: `0 2px 20px -4px hsl(0 0% 0% / 0.5)`
- Doc-border top accent: 2px gradient-gold rule at top edge

### Button primary
- Fill: `hsl(42 78% 52%)` — gold
- Text: `hsl(216 50% 5%)` — deep navy
- Hover: `hsl(42 78% 62%)` — brighten
- Font: Syne 600, `0.12em` letter-spacing, uppercase, `12px`

### Button ghost
- Background: transparent
- Border: `0.5px solid rgba(255,255,255,0.1)`
- Text: `rgba(228,235,240,0.45)`
- Hover: text `rgba(228,235,240,0.78)`, border `rgba(255,255,255,0.22)`

### Badge LIVE
- Dot: `5×5px`, `border-radius: 50%`, `hsl(172 48% 52%)` — teal
- Dot animation: `opacity 0.4 → 1 → 0.4`, `2.4s ease-in-out infinite`
- Label: JetBrains Mono, `9px`, `letter-spacing: 0.28em`, uppercase

### Section label
- Font: JetBrains Mono, `0.6rem`, `letter-spacing: 0.25em`, uppercase
- Color: `hsl(var(--gold))`

### Scrollbar
- Width: `4px` — track background, thumb `hsl(var(--navy-light))`, hover `hsl(var(--gold-dim))`

---

## 5. BRAND VOICE

- **Tone:** precise, calm, sovereign — the platform speaks with quiet authority, never urgency.
- **Words we use:** living, research, intelligence, platform, investigate, model, build, planetary, unified.
- **Words we avoid:** simple, easy, amazing, revolutionary, powerful, cutting-edge, game-changer.

---

_BRAND_CANON.md v1.0 — K-13 BRAND · BRAND-DOCS-001 · @copilot · 2026-03-27_
