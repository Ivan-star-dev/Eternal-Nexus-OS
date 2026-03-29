# SOVEREIGN PALETTE — Ruberra / Eternal Nexus OS
> Visual identity law. Mother palette. 5 premium chromatic modes.
> Family: Knowledge · Subfamily: Visual Identity
> Cravado: 2026-03-29 · @claude · TOTAL-WAR-CONSOLIDATION-001

---

## 0. PALETTE PHILOSOPHY

Ruberra is a sovereign cognitive environment.
Its visual identity must feel:
- mentally clarifying, not stimulating
- premium by restraint, not by decoration
- unmistakable at a glance, not by logo
- calm under pressure, not cheerful
- deep, not loud

It must never feel:
- generic dark-blue startup
- plain light/dark toggle
- loud neon or gradient cliché
- cheap futurism (glowing borders everywhere)
- dashboard residue (grids, tiles, metric cards)

---

## 1. MOTHER PALETTE

The mother palette is a **deep sovereign night** with **three energy veins**
that correspond to the three tri-core identities.

### Base Field (background, depth, canvas)

| Token              | Value                    | Role                          |
|--------------------|--------------------------|-------------------------------|
| `--rx-void`        | `hsl(222, 28%, 5%)`      | Deepest background — true void |
| `--rx-depth`       | `hsl(220, 24%, 8%)`      | Surface background            |
| `--rx-ground`      | `hsl(218, 20%, 11%)`     | Elevated surface              |
| `--rx-lift`        | `hsl(216, 18%, 14%)`     | Card / panel surface          |
| `--rx-rim`         | `hsl(215, 16%, 18%)`     | Dividers, borders             |

### Neutral Text

| Token              | Value                          | Role                         |
|--------------------|--------------------------------|------------------------------|
| `--rx-text-prime`  | `hsl(210, 20%, 92%)`           | Primary readable text        |
| `--rx-text-mid`    | `hsl(210, 14%, 65%)`           | Secondary, sublines          |
| `--rx-text-dim`    | `hsl(210, 10%, 42%)`           | Tertiary, labels, timestamps |
| `--rx-text-ghost`  | `hsl(210, 8%, 28%)`            | Inactive, placeholder        |

### Energy Veins (tri-core identity)

| Vein     | Token              | Value                    | Portal    | Character        |
|----------|--------------------|--------------------------|-----------|------------------|
| Electric | `--rx-electric`    | `hsl(205, 100%, 52%)`    | Creation  | Force, precision |
| Teal     | `--rx-teal`        | `hsl(172, 55%, 36%)`     | Lab/Test  | Truth, evidence  |
| Gold     | `--rx-gold`        | `hsl(42, 78%, 52%)`      | School    | Mastery, depth   |

### Sovereign Accents

| Token              | Value                    | Role                           |
|--------------------|--------------------------|--------------------------------|
| `--rx-signal`      | `hsl(155, 65%, 48%)`     | Confirmation, success state    |
| `--rx-alert`       | `hsl(12, 82%, 55%)`      | Cap hit, governance warning    |
| `--rx-sovereign`   | `hsl(270, 45%, 58%)`     | Owner layer, identity lock     |

---

## 2. FIVE PREMIUM MODES

Each mode is a **state of the same organism** — not a theme toggle.
They share the mother palette base; they differ in luminosity, contrast, and energy weight.

---

### MODE 1 — SOVEREIGN NIGHT (default)

```
Name:       Sovereign Night
Function:   Default operational state. Deep focus. Full cognitive depth.
Feeling:    Being inside a live intelligence system at 2am. Clear. Fast. Sovereign.
Background: --rx-void (5% hsl)
Text:       --rx-text-prime at full weight
Accents:    All three veins active — electric, teal, gold
Contrast:   High. No softening. Black canvas, surgical precision.
Mode role:  Primary work mode. Default for all portals.
```

Anti-cheapness rules for this mode:
- No border glow on every element. Glow only on active / live indicators.
- No white text on pure black. Use `--rx-void` (not #000) + `--rx-text-prime` (not #fff).
- No gradient backgrounds. Solid depth field. Gradient only on headlines and CTAs.
- No card borders except `--rx-rim` at 0.15 opacity max.

---

### MODE 2 — DEEP AMBER (School / mastery state)

```
Name:       Deep Amber
Function:   Learning state. Warm cognition. Study depth.
Feeling:    High-ceilinged library at dusk. Amber light on dark wood. Unhurried.
Background: hsl(28, 18%, 6%) — deep warm void
Text:       hsl(38, 25%, 88%) — warm white
Accents:    Gold vein dominant. Electric and teal recede to 30% opacity.
Contrast:   Medium-high. Warm but not dim.
Mode role:  Auto-activate on /school portal entry (optional, owner gate).
```

---

### MODE 3 — CLEAN VOID (focus mode)

```
Name:       Clean Void
Function:   Maximum focus. Eliminate all visual noise. Writing/thinking mode.
Feeling:    Empty stage. Infinite depth. Nothing between you and the work.
Background: hsl(222, 32%, 4%) — near black, very slightly blue
Text:       --rx-text-prime at 94% opacity only
Accents:    All veins dormant except the active portal's single vein at 25% opacity
Contrast:   Maximum. One color. One surface. One depth.
Mode role:  Manual override only. Owner-invocable from ControlTower.
```

---

### MODE 4 — LUMINOUS WHITE (presentation mode)

```
Name:       Luminous White
Function:   External presentation, demo, investor view.
Feeling:    Gallery space. Confident. Airy. Premium without pretension.
Background: hsl(210, 20%, 97%) — warm white, not pure white
Text:       hsl(220, 28%, 12%) — deep sovereign ink
Accents:    All three veins at 60% luminosity (darker versions of electric/teal/gold)
Contrast:   High. Readable at distance. No dark UI residue.
Mode role:  Presentation only. Auto-disable after session ends.
```

Anti-cheapness rules:
- No white with blue default browser look.
- Backgrounds are warm white hsl(210, 20%, 97%) not #fff.
- Text is deep ink hsl(220, 28%, 12%) not #000.
- Cards use hsl(210, 18%, 93%) — visible lift without harsh border.

---

### MODE 5 — SIGNAL RED (alert / governance state)

```
Name:       Signal Red
Function:   Governance enforcement. Cap hit. Sovereignty breach alert.
Feeling:    System has authority. This matters. Not panic — command.
Background: --rx-void (unchanged)
Text:       --rx-text-prime (unchanged)
Accents:    --rx-alert dominant. Electric and teal suppressed.
Contrast:   High on alert elements. Normal on background.
Mode role:  Transient only. Auto-clears after governance message is acknowledged.
            Never persists as a "mode". Used for inline cap messages and alerts.
```

---

## 3. PORTAL CHROMATIC IDENTITY

Each portal uses ONE vein as its dominant visual signature:

| Portal   | Dominant Vein | Secondary | Forbidden                        |
|----------|---------------|-----------|----------------------------------|
| Creation | Electric blue | —         | Gold, Teal (dilute identity)     |
| Lab/Test | Teal          | —         | Electric, Gold                   |
| School   | Gold          | —         | Electric, Teal                   |
| Home     | Neutral       | Electric  | Any vein at > 40% saturation     |
| Atlas    | Neutral       | Teal      | Bright electric (globe owns space)|

**Cross-portal rule:** When a tri-core portal is entered, its vein warms.
When exited, the vein returns to ambient (8% opacity).
The transition is always ≤ 400ms ease-out.

---

## 4. ANTI-CHEAPNESS FILTER

These patterns corrupt the identity and are permanently forbidden:

```
FORBIDDEN-01  Pure #000000 or #ffffff — use mother palette values only
FORBIDDEN-02  Gradient background fills — gradients only on text and CTAs
FORBIDDEN-03  Generic blue-purple startup gradient (#7B2FF7 → #F107A3 etc.)
FORBIDDEN-04  Border glow on every card — glow only on live/active states
FORBIDDEN-05  Neon saturation > 85% on any ambient surface element
FORBIDDEN-06  White text on gray background without checking --rx-text-prime
FORBIDDEN-07  Dashboard grid layout pretending to be an organism surface
FORBIDDEN-08  Multiple active accent colors on a single surface simultaneously
FORBIDDEN-09  Rounded corners > 12px on structural elements (buttons/cards)
FORBIDDEN-10  Drop shadows as decoration — shadows only for elevation hierarchy
```

---

## 5. IMPLEMENTATION ORDER

```
TIER 0 — NOW (no gate):
  Define CSS custom properties in index.css or a :root block
  Wire --rx-void, --rx-depth, --rx-ground as base backgrounds
  Wire --rx-electric, --rx-teal, --rx-gold as the three portal veins

TIER 1 — AFTER WEDGE TEST:
  Apply portal chromatic identity per portal entry surface
  Wire portal vein transition on route change

TIER 2 — OWNER GATE:
  Mode selector in ControlTower (Night / Amber / Void / White)
  Auto-activate Deep Amber on /school (optional — owner decides)
  Presentation Mode invocable from owner panel

TIER 3 — POST-PILOT:
  Full design token system consumed by all components
  Framer / Antigravity: animate vein transition on route change
```

---

## 6. TRUTH STATE

| Element               | State                  | Notes                                        |
|-----------------------|------------------------|----------------------------------------------|
| Mother palette        | CANONICAL — defined    | Not yet in CSS tokens                        |
| Mode 1 — Night        | PARTIAL — approximately active | Components use inline values close to spec |
| Mode 2 — Amber        | SCAFFOLD — defined only | Not applied                                 |
| Mode 3 — Void         | SCAFFOLD — defined only | Not applied                                 |
| Mode 4 — White        | SCAFFOLD — defined only | Not applied                                 |
| Mode 5 — Signal Red   | PARTIAL — alert color used | Not formalized as mode                    |
| Portal vein identity  | PARTIAL — per-portal colors exist | Not tokenized; hardcoded per component |
| Forbidden list        | CANONICAL              | Not enforced by linter                       |

Next correction: extract all inline color values in LabHero, SchoolHero, TestHero
into CSS custom properties matching this spec. @cursor or @copilot eligible.

---

_SOVEREIGN_PALETTE.md · knowledge v1.0 · 2026-03-29 · @claude · TOTAL-WAR-001_
