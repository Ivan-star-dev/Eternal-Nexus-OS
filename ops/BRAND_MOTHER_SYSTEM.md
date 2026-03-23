# BRAND MOTHER SYSTEM

**Versão:** v1.0
**Data:** 2026-03-22
**Task:** BMS-001
**Branch:** `claude/rebuild-bastion-core-rihGX`
**Modelo:** claude-sonnet-4-6
**Aprovado por:** owner (instrução directa — bulk sprint final)
**Precondição de:** NORTH STAR 1 (Visual Incarnated) — @framer + @antigravity

> Lei primária de identidade visual do Eternal Nexus OS.
> Tudo o que @framer, @antigravity, @cursor e @claude constroem
> em WorkVisual obedece a este documento.
> Alterações requerem gate explícito do owner.

---

## FRASE CANÓNICA

> Eternal Nexus não parece um produto.
> Parece um laboratório onde trabalho real acontece.
> Cada pixel carrega peso institutional.
> Cada animação tem propósito, não decoração.

---

## 1. CÓDIGO EMOCIONAL — O que o site tem de fazer sentir

```
CÓDIGO EMOCIONAL ══════════════════════════════════════════════════

CALMO          → sem ruído, sem agitação, sem urgência artificial
PREMIUM        → acabamento que não parece template, nem comprado
CIENTÍFICO     → presença de dados, rigor, estrutura deliberada
ESPACIAL       → profundidade, distância, vastidão controlada
CONTEMPLATIVO  → silêncio como princípio, não como vazio

ANTI-CODES (proibidos):
  ✗  urgente     → nunca badges de "limited time", nunca pulse vermelho sem motivo
  ✗  saturado    → nunca mais de 3 cores de destaque por página
  ✗  ansioso     → sem scroll-jacking agressivo, sem popups, sem ruído visual
  ✗  genérico    → nenhum padrão SaaS: sem hero com laptop mockup, sem gradients arco-íris
  ✗  vazio       → silêncio não é ausência de conteúdo; é conteúdo organizado com espaço

══════════════════════════════════════════════════════════════════
```

**Teste de identidade (Heaven Lab test):**
Alguém que nunca ouviu falar do projecto abre o site e diz espontaneamente
uma destas frases — ou o design falhou:

- _"Isto não é normal"_
- _"Parece um laboratório premium"_
- _"Tem atmosfera própria"_
- _"Parece feito com intenção muito específica"_

---

## 2. PALETA — Tokens canónicos

### 2.1 Core palette (index.css — fonte da verdade)

| Token | HSL | Hex aproximado | Uso canónico |
|-------|-----|----------------|--------------|
| `--background` | `216 50% 5%` | `#060c14` | Canvas principal — deep institutional navy |
| `--ink-deep` | `216 55% 3%` | `#040a10` | Fundo mais escuro — void de profundidade |
| `--ink-medium` | `216 45% 8%` | `#0d1520` | Cards e superfícies elevadas |
| `--navy` | `216 40% 11%` | `#111e2e` | Superfícies secundárias |
| `--navy-light` | `216 35% 16%` | `#192840` | Borders, separadores subtis |
| `--gold` | `42 78% 45%` | `#c9870f` | Primário — autoridade, destaque, acção |
| `--gold-light` | `42 70% 58%` | `#d9a53a` | Hover states do gold |
| `--gold-dim` | `42 60% 28%` | `#7a520a` | Gold em superfícies escuras, subtil |
| `--teal` | `172 55% 28%` | `#206358` | Operacional — status activo, dados vivos |
| `--teal-light` | `172 48% 52%` | `#46b09e` | Teal em destaque, hover |
| `--paper` | `210 25% 93%` | `#e4ebf0` | Texto principal |
| `--paper-dim` | `215 12% 55%` | `#7e8ea0` | Texto secundário, labels |
| `--red-classified` | `0 52% 32%` | `#7a1f1f` | Erros, classificação crítica |

### 2.2 Atlas glass tokens (atlas-glassmorphism.css)

| Token | Valor | Uso canónico |
|-------|-------|--------------|
| `--atlas-bg-void` | `#0a0a0f` | Fundo mais profundo — map layer |
| `--atlas-glass-fill` | `rgba(255,255,255, 0.04)` | Glass padrão |
| `--atlas-glass-fill-hover` | `rgba(255,255,255, 0.06)` | Glass hover |
| `--atlas-glass-fill-mid` | `rgba(255,255,255, 0.08)` | Glass destacado |
| `--atlas-glass-border` | `rgba(255,255,255, 0.07)` | Border glass padrão |
| `--atlas-glass-border-hi` | `rgba(255,255,255, 0.12)` | Border glass activo |
| `--atlas-neon-cyan` | `#00d4ff` | Accent map/geo (usar com contenção) |
| `--atlas-neon-amber` | `#ffb300` | Accent amber alternativo |
| `--atlas-blur-sm` | `8px` | Blur subtil |
| `--atlas-blur-md` | `16px` | Blur standard |
| `--atlas-blur-lg` | `28px` | Blur pronunciado |

### 2.3 Morabeza palette (identidade cabo-verdiana)

Usada com contenção — em contextos de calor humano, não em infra.

| Token | HSL | Uso |
|-------|-----|-----|
| `--morabeza-warm` | `28 72% 52%` | Founder page, human layer |
| `--morabeza-sunset` | `16 78% 48%` | Acento emocional |
| `--morabeza-sand` | `35 45% 72%` | Superfícies quentes |
| `--morabeza-ocean` | `195 55% 38%` | Transição para institutional |

### 2.4 Regra de uso de cor

```
REGRA COR ══════════════════════════════════════════════════════════

Por página: máximo 2 cores de destaque activas em simultâneo.
Gold é sempre primário quando presente.
Teal é sempre operacional (dados, status, live).
Neon cyan é sempre map/geo — nunca em UI genérico.
Morabeza só em contexto humano (founder, about, human interest).
Background permanece navy range — nunca branco puro em dark mode.

══════════════════════════════════════════════════════════════════
```

---

## 3. TIPOGRAFIA — Sistema canónico

### 3.1 Famílias

| Role | Família | Tailwind class | Uso |
|------|---------|----------------|-----|
| Display / Primary | **Syne** | `font-display` / `font-sans` | Headlines, navigation, UI labels |
| Serif / Editorial | **Cormorant Garamond** | `font-serif` | Pull quotes, founder copy, philosophical text |
| Mono / Technical | **JetBrains Mono** | `font-mono` | Data, code, metrics, technical labels |

### 3.2 Hierarquia

```
HIERARQUIA TIPOGRÁFICA ════════════════════════════════════════════

H1 — Display    Syne 700–800   48–72px   tracking-tight   paper
H2 — Section    Syne 600       32–40px   tracking-normal  paper
H3 — Block      Syne 500–600   20–26px   tracking-normal  paper
H4 — Label      Syne 500       14–16px   tracking-wide    paper-dim
                                         uppercase

Body — Long     Cormorant 400  18–20px   leading-relaxed  paper
Body — UI       Syne 400       14–15px   leading-normal   paper
Caption         Syne 400       11–13px   tracking-wide    paper-dim
                                         uppercase

Data / Metric   JetBrains 400  12–16px   tabular-nums     teal-light / gold
Code            JetBrains 400  13–14px   —                paper-dim

══════════════════════════════════════════════════════════════════
```

### 3.3 Regras

- Nunca usar mais de 2 famílias na mesma secção
- Serif (Cormorant) só em texto longo com intenção editorial
- Mono só em dados reais — nunca decorativamente
- Letras maiúsculas só em labels e captions (Syne 500, tracking-wide)
- Nunca bold + uppercase em conjunto exceto em badges de estado

---

## 4. GLASS MORPHISM — Anatomia de superfície

```
GLASS SURFACE ANATOMY ════════════════════════════════════════════

[surface container]
  background:  atlas-glass-fill (0.04)        ← quase invisível
  border:      atlas-glass-border (0.07) 1px  ← subtil
  backdrop-filter: blur(16px)                 ← blur-md padrão
  border-radius: 0.5rem–1rem                  ← nunca 0 em glass

[surface elevated — hover / active]
  background:  atlas-glass-fill-hover (0.06)
  border:      atlas-glass-border-hi (0.12)
  box-shadow:  shadow-card ou shadow-elevation

[surface deep — inner panel]
  background:  atlas-glass-fill-dark (0.02)
  border:      atlas-glass-border-dim (0.04)
  backdrop-filter: blur(8px)

PRINCÍPIO: glass nunca grita. É presença silenciosa.
Quanto mais fundo na hierarquia, mais transparente.

══════════════════════════════════════════════════════════════════
```

### Radius system

```
--radius: 0.15rem   ← base (botões, inputs tight)
0.5rem              ← cards standard
1rem                ← panels, modals
9999px              ← pills, badges
```

---

## 5. MOTION — Linguagem de movimento

### 5.1 Princípio

> Cada animação tem propósito funcional ou atmosférico.
> Nunca decorativa. Nunca para "mostrar que sabe animar".
> Se a animação for removida e a página funcionar igual — remover.

### 5.2 Easing canónico

```typescript
// Entrada principal — soft landing
ease: [0.22, 1, 0.36, 1]   // cubic bezier — decelera suave

// Saída — limpa
ease: [0.55, 0, 1, 0.45]   // accelera suave

// Dados / mecânico — preciso
ease: "easeOut"

// Spring — nunca para UI crítico; apenas em elementos ornamentais
type: "spring", stiffness: 120, damping: 20
```

### 5.3 Durações

| Tipo | Duração | Uso |
|------|---------|-----|
| Micro | 150–200ms | Hover states, focus rings |
| Standard | 400–600ms | Fade in/out, slide entries |
| Atmospheric | 700–1000ms | Hero entrances, page transitions |
| Ambient | 3000–8000ms | Background orbs, floating elements |

### 5.4 Padrões canónicos

```typescript
// ENTRADA PADRÃO — elemento entra da base
initial: { opacity: 0, y: 24 }
animate: { opacity: 1, y: 0 }
transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }

// STAGGER — lista de elementos
transition: { duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }

// FADE SIMPLES — para elementos que não têm posição
initial: { opacity: 0 }
animate: { opacity: 1 }
transition: { duration: 0.5 }

// SCALE REVEAL — para elementos de destaque
initial: { opacity: 0, scale: 0.96 }
animate: { opacity: 1, scale: 1 }
transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }

// ORB ATMOSFÉRICO — flutuação ambiente
animate: { y: [-8, 8, -8] }
transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
```

### 5.5 Anti-patterns de motion

```
✗  scroll-jacking — nunca forçar scroll velocity
✗  parallax agressivo — máximo 20% de offset por layer
✗  loading spinners decorativos — só quando há latência real
✗  bounce excessivo — spring só em UI playful, nunca em institutional
✗  hover scale > 1.05 — perturbação institucional
✗  animação em texto longo — só em headlines, nunca em body text
```

---

## 6. ESPAÇAMENTO E GRID

### 6.1 Container

```
max-width: 1400px (2xl breakpoint)
padding:   2rem (horizontal padrão)
```

### 6.2 Espaçamento vertical (secções)

```
Entre secções maiores:   py-24 → py-32   (96px → 128px)
Entre subsecções:        py-12 → py-16   (48px → 64px)
Entre componentes:       gap-6 → gap-8   (24px → 32px)
Entre elementos inline:  gap-3 → gap-4   (12px → 16px)
```

### 6.3 Regra de silêncio

> Espaço vazio é conteúdo.
> Cada hero precisa de pelo menos 40% de espaço negativo.
> Nunca encher uma página "para parecer completo".

---

## 7. ICONOGRAFIA E ORNAMENTOS

### 7.1 Ícones

- Biblioteca canónica: **Lucide React** (já instalado)
- Tamanhos: 14px (inline), 16px (standard), 20px (destaque), 24px (hero)
- Cor: sempre `paper-dim` por defeito; `gold` ou `teal` em estado activo
- Nunca colored icons — apenas um tom dentro do palette

### 7.2 Separadores

```
Linha fina:   border-t border-white/5   ← quase invisível
Linha regra:  border-t border-white/10  ← subtil
Gold rule:    border-t border-gold/20   ← em secções premium
```

### 7.3 Ornamentos atmosféricos

- Orbs: `rounded-full blur-[Xpx] bg-color/opacity` — nunca > 40% opacity
- Engineering grid: `grid` com `border-white/[0.03]` — background texture subtil
- Gradient fade: `gradient-hero-overlay` — para fundir conteúdo com fundo

---

## 8. COMPONENTES — Padrões visuais canónicos

### 8.1 Badge / Tag

```
Texto:       Syne 500, 11px, uppercase, tracking-wider
Padding:     px-2 py-0.5
Border:      1px solid border-color/20
Background:  color/10
Radius:      9999px (pill)
```

### 8.2 Botão primário

```
Background:  gold (primary)
Texto:       Syne 500, ink-deep
Padding:     px-6 py-2.5
Radius:      0.15rem (--radius base)
Hover:       gold-light + shadow-card
```

### 8.3 Card de dados

```
Background:  glass-fill (0.04) + blur(16px)
Border:      glass-border (0.07)
Padding:     p-6
Radius:      0.5rem
Label:       Syne 500 12px uppercase tracking-wide paper-dim
Value:       JetBrains 400 ou Syne 700, escala grande, gold ou paper
```

### 8.4 Secção de hero

```
Altura mínima: 100vh ou 80vh
Background:    gradient-dark + atmospheric orbs
Conteúdo:      centrado ou left-aligned (nunca right-aligned)
Título:        Syne 700–800, 48–72px, paper
Subtítulo:     Cormorant 400 italic, 20–24px, paper-dim
CTA:           botão primário + link secundário; espaço entre eles
Fade bottom:   gradient overlay para transição com secção seguinte
```

---

## 9. IDENTIDADE — Who we are visually

```
IDENTIDADE ══════════════════════════════════════════════════════

Nome:           Eternal Nexus OS
Subtítulo:      Next Path Infrastructure Authority
Natureza:       Federal infrastructure operating system
                (não startup, não SaaS, não consultora)

Cor dominante:  Deep navy → gold (autoridade + valor)
Textura:        Glass + engineering grid (precisão + profundidade)
Movimento:      Slow, intentional, atmospheric (não energético)
Voz visual:     Institutional lab (MIT + ESA + Bloomberg terminal)

Referências visuais permitidas:
  + Observatório científico premium
  + Sala de controlo operacional
  + Publicação editorial de referência (The Economist, Nature)
  + Terminal de dados institucional

Referências visuais proibidas:
  - Landing page de startup
  - Dashboard corporativo genérico
  - Portfólio de agência criativa
  - App de consumer tech

══════════════════════════════════════════════════════════════════
```

---

## 10. CHECKLIST DE VALIDAÇÃO VISUAL

Antes de fazer merge de qualquer PR com mudanças visuais:

```
□ Código emocional: a página transmite calmo + premium + científico?
□ Paleta: só tokens canónicos usados? Máximo 2 cores de destaque?
□ Tipografia: família correcta para o contexto? Hierarquia respeitada?
□ Glass: superfícies com fill + border + blur correctos?
□ Motion: cada animação tem propósito? Anti-patterns ausentes?
□ Espaçamento: secções têm silêncio suficiente? Grid respeitado?
□ Heaven Lab test: alguém novo diria "isto não é normal"?
```

---

## ARTEFACTOS RELACIONADOS

| Ficheiro | Relação |
|----------|---------|
| `src/index.css` | Tokens CSS canónicos — fonte da verdade de cor |
| `tailwind.config.ts` | Mapeamento tokens → Tailwind classes |
| `src/styles/atlas-glassmorphism.css` | Glass system — map/atlas layer |
| `ops/NORTH_STAR_BEFORE_HARD_EXECUTION.md` | North Stars que dependem deste doc |
| `ops/PIONEER_MATRIX.md` | @framer e @antigravity — territórios de execução |
| `ops/SYSTEM_FACE_CANON.md` | especialização das 3 faces da mãe — criado em 2026-03-23 |
| `ops/TYPOGRAPHY_LAW.md` | lei tipográfica completa com weight matrix — criada em 2026-03-23 |

---

*BRAND_MOTHER_SYSTEM.md v1.0 — cravado em 2026-03-22 | claude-sonnet-4-6 | BMS-001*
*BRAND_MOTHER_SYSTEM.md v1.1 — ARTEFACTOS RELACIONADOS expandido com SYSTEM_FACE_CANON + TYPOGRAPHY_LAW — 2026-03-23 | claude-sonnet-4-6 | SYSTEM-FACE-CANON-001 + TYPOGRAPHY-LAW-001*
