# TYPOGRAPHY LAW — Lei Tipográfica da Mãe

**Versão:** v1.0
**Data:** 2026-03-23
**Task:** TYPOGRAPHY-LAW-001
**Branch:** `claude/rebuild-bastion-core-rihGX`
**Modelo:** claude-sonnet-4-6
**Aprovado por:** owner (instrução direta — 2026-03-23)

> A tipografia não é decoração. É a voz silenciosa do sistema.
> Quando bem feita, ninguém a nota — sente-se apenas que é certo.
> Quando mal feita, tudo parece errado mesmo sem saber porquê.
> Esta lei fixa o que não pode derivar.

---

## TYPOGRAPHY_LAW

```
TYPOGRAPHY_LAW ═══════════════════════════════════════════════════════════════

PRINCIPIO_GERAL:
  A tipografia do Eternal Nexus / Heaven Lab deve ser:
  frágil · elegante · fina · moderna · avançada · silenciosa · premium · polida
  com ar tecnológico maduro.

  A referência de sensação:
  → Delicadeza tipográfica próxima do Cursor (cursor.com) no seu próprio site —
    fine weights, generous tracking, whisper-quiet display text —
    mas absorvida na identidade mãe Heaven Lab / Eternal Nexus.

  O princípio central:
  → O peso padrão é 300–400. Não 700. Não bold como regra.
  → Bold é reserva de autoridade — não ornamento de hierarquia.
  → Elegância vem do espaçamento e da leveza, não da dimensão e do peso.
  → Texto grande não precisa ser heavy. Pode ser 72px Syne 200.
  → Silêncio tipográfico é tão importante quanto o conteúdo.

──────────────────────────────────────────────────────────────────────────────

SYSTEM_FACE_TYPE:
  Família dominante: JetBrains Mono (dados, comandos, status, IDs)
  Família de UI:     Syne 300–400 (labels, navegação, títulos de secção)
  Família editorial: ausente ou usada minimamente (só em citações de fundador)

  Sensação: cockpit de missão · terminal premium · inteligência fria e precisa
  Peso dominante: 400 (regular) com 300 (light) para contextos secundários
  Uppercase: permitido em labels de estado (GATE_ABERTO / STATUS: elegível)
  Bold (700+): apenas em valores críticos de dados ou alertas reais

──────────────────────────────────────────────────────────────────────────────

PRODUCT_FACE_TYPE:
  Família dominante: Syne 200–400 (display, subtítulos, UI)
  Família editorial:  Cormorant Garamond 300–400 italic (frases-mãe, copy filosófico)
  Família técnica:    JetBrains Mono 400 (contadores vivos, dados reais — com contenção)

  Sensação: laboratório premium · publicação científica de autor · presença espacial
  Peso dominante: 200–300 no display · 400 no corpo · 300 italic no editorial
  Uppercase: apenas em micro-labels (12px máx) com tracking muito generoso
  Bold (700+): proibido em textos longos; permitido apenas em números grandes isolados

──────────────────────────────────────────────────────────────────────────────

ECOSYSTEM_FACE_TYPE:
  Família dominante: Syne 300–500 (navegação, títulos, estrutura)
  Família técnica:   JetBrains Mono 400 (metadados: versão, data, ID, hash)
  Família editorial: Cormorant 400 italic (apenas em citações ou frases de ligação)

  Sensação: arquivo inteligente · mapa vivo · biblioteca canónica
  Peso dominante: 400 como base · 300 para contextos secundários · 500 para ênfase pontual
  Uppercase: em labels de categoria e status (com tracking-wider)
  Bold (700+): apenas em títulos de secção principal (max 1 por secção)

══════════════════════════════════════════════════════════════════════════════
```

---

## DISPLAY_RULES

```
DISPLAY_RULES ════════════════════════════════════════════════════════════════

DISPLAY — texto de impacto visual (hero titles, section anchors)

  PESO:         200–400 (nunca 700+ em display principal)
  TAMANHO:      48–96px (produto) · 32–64px (ecossistema) · 28–48px (sistema)
  FAMÍLIA:      Syne — sempre
  TRACKING:     tracking-tight a tracking-normal (nunca tracking-wide em display)
  COR:          paper #e4ebf0 (padrão) · gold #c9870f (em display de autoridade única)
  LINE-HEIGHT:  1.0–1.2 em títulos curtos · 1.3–1.4 em títulos multi-linha
  UPPERCASE:    nunca em display (só em labels pequenos)
  ITALIC:       nunca em display Syne · permitido só em Cormorant editorial

  REGRA CENTRAL:
    Display grande + peso leve (200–300) = elegância premium
    Display grande + peso pesado (700+) = agressividade que não serve este sistema

══════════════════════════════════════════════════════════════════════════════
```

---

## HEADING_RULES

```
HEADING_RULES ════════════════════════════════════════════════════════════════

H1 — Syne 300–500 · 40–72px · tracking-tight · paper
     → produto: 300 · sistema: 400 · ecossistema: 400–500

H2 — Syne 400–500 · 28–40px · tracking-normal · paper
     → nunca bold no H2 (exceto quando H2 age como CTA isolado)

H3 — Syne 400–500 · 18–26px · tracking-normal · paper ou paper-dim
     → quando usado como label de secção técnica: 500 uppercase tracking-wide

H4 — Syne 500 · 13–16px · tracking-wide · uppercase · paper-dim
     → sempre minúsculo peso relativo ao conteúdo abaixo

REGRA PROIBIDA:
  → Nunca H1 bold + uppercase em conjunto (gera agressividade)
  → Nunca H2 com mais de uma família diferente na mesma linha
  → Nunca gradientes de cor em headings (exceto em momentos únicos explicitamente aprovados)

══════════════════════════════════════════════════════════════════════════════
```

---

## LABEL_RULES

```
LABEL_RULES ══════════════════════════════════════════════════════════════════

Labels são micro-textos de UI: status, categoria, tag, badge, nav item.

  FAMÍLIA:    Syne — sempre
  PESO:       500 (standard) · 400 (inativo/secundário)
  TAMANHO:    10–13px
  TRACKING:   tracking-wider (0.08–0.12em)
  CASE:       uppercase — sempre em labels
  COR:        paper-dim (neutro) · gold (autoridade/active) · teal (operacional/live)
  BORDER:     1px solid color/20 — glass border subtil quando em badge
  BACKGROUND: color/10 — fill 10% quando em badge

  REGRA DO LABEL:
    Um label nunca compete com o conteúdo que descreve.
    Um label informa sem gritar.
    Se o label é tão visível quanto o conteúdo — algo está errado.

══════════════════════════════════════════════════════════════════════════════
```

---

## TERMINAL_RULES

```
TERMINAL_RULES ═══════════════════════════════════════════════════════════════

Tipografia do terminal / camada técnica do sistema.

  FAMÍLIA:    JetBrains Mono — obrigatório
  PESO:       400 (regular) — nunca bold · nunca italic
  TAMANHO:    12–14px (inline) · 13–16px (display de dados)
  TRACKING:   normal (nunca wide — mono já tem espaçamento próprio)
  COR:        teal-light #46b09e (dados ativos) · paper-dim #7e8ea0 (comentários/inativo)
              gold #c9870f (valores de autoridade: gate, prioridade P1, owner)
  BACKGROUND: nunca fundo branco em contexto terminal · sempre navy ou glass
  CURSOR:     ▸ ou › como prompt visual — paper-dim, piscante a 1s
  CASE:       permitido ALL_CAPS_SNAKE para IDs de sistema (TASK_ID, STATUS, GATE)

  REGRA DO TERMINAL:
    JetBrains Mono nunca é decorativo.
    Só aparece onde há dado real, comando real, ID real, métrica real.
    Usar JetBrains Mono em texto narrativo = erro de face.

══════════════════════════════════════════════════════════════════════════════
```

---

## READING_LAYER_RULES

```
READING_LAYER_RULES ══════════════════════════════════════════════════════════

Textos longos de leitura — corpo, copy filosófico, manifesto, founder text.

  FAMÍLIA PREFERIDA: Cormorant Garamond 400 (reading layer de intenção editorial)
  FAMÍLIA ALTERNATIVA: Syne 300–400 (quando leitura é mais funcional que editorial)
  TAMANHO: 17–21px · nunca menor que 16px em leitura contínua
  LINE-HEIGHT: 1.7–1.9 · sempre relaxed — nunca comprimido
  TRACKING: normal a slightly loose — nunca tight em corpo de texto
  COR: paper #e4ebf0 · paper-dim #7e8ea0 para textos secundários
  COMPRIMENTO DE LINHA: máx 65–72 caracteres por linha (ch units)
  ITALIC: Cormorant italic para ênfase filosófica, citação, frase-mãe

  REGRA DO CORPO:
    Corpo nunca bold. Nunca uppercase. Nunca JetBrains Mono.
    Cormorant italic é ênfase máxima permitida em corpo de texto.
    Se o corpo precisa de bold para ter impacto — o problema é o conteúdo, não a tipografia.

══════════════════════════════════════════════════════════════════════════════
```

---

## PROIBIDO

```
PROIBIDO ════════════════════════════════════════════════════════════════════

✗  Bold (700+) como regra de hierarquia — bold é reserva de autoridade pontual
✗  Uppercase em display grande (> 24px) — grita, não impressiona
✗  3+ famílias tipográficas na mesma secção — confusão de identidade
✗  Gradiente de cor em texto corrido — ilegível e juvenil
✗  JetBrains Mono em copy narrativo ou em headlines não-técnicas
✗  Cormorant Garamond em labels, badges, status ou dados técnicos
✗  Syne italic — Syne não tem italic canónico; usar Cormorant para italic
✗  Tracking-wide em display (> 24px) — perde elegância, ganha vulgaridade
✗  Bold + uppercase em conjunto (exceto estado de alerta crítico real)
✗  Font-size abaixo de 11px em qualquer texto visível (acessibilidade)
✗  Line-height < 1.4 em qualquer texto de leitura
✗  Mix de pesos muito próximos na mesma linha (400 + 500 = invisível)
✗  Tipografia animada em texto de leitura — só em display isolado, nunca em corpo

══════════════════════════════════════════════════════════════════════════════
```

---

## TYPOGRAPHY_WEIGHT_MATRIX

| CAMADA | PESO | FUNCAO | EFEITO_EMOCIONAL | RISCO_SE_MAL_USADO |
|---|---|---|---|---|
| Display hero | 200–300 | Grande impacto visual com elegância máxima | Leveza premium · ar científico maduro | Parece fraco ou inacabado se o contexto não suportar |
| Display section | 300–400 | Âncora de secção com presença sem agresividade | Clareza calma · autoridade silenciosa | Torna-se invisível se tamanho for pequeno demais |
| Heading H2 | 400–500 | Estrutura navegável da página | Organização clara · ritmo visual | Demasiado "normal" se usado onde 300 seria mais elegante |
| UI label | 500 | Identificar categorias, status, acções | Precision · firmeza funcional | Gera ruído se usado em excesso ou com tracking fraco |
| Body copy | 400 | Leitura contínua · comunicação filosófica | Conforto · respiração · confiança | Monótono se sem variação de família (Cormorant vs Syne) |
| Data / terminal | 400 mono | Exibir valor real · dado vivo · ID canónico | Precisão técnica · frieza controlada | Decorativo se usado sem dado real por trás |
| Emphasis pontual | 600 | Destacar valor crítico dentro de contexto neutro | Contraste de autoridade | Perde força se usado com frequência (bold inflation) |
| Autoridade máxima | 700 | Declaração soberana única · número de impacto | Peso institucional | Agressivo · destrói elegância se overused |

---

## FAMILY_USE_MAP

| FAMÍLIA | FACE_SISTEMA | FACE_PRODUTO | FACE_ECOSSISTEMA | REGRA_DE_CONTENÇÃO |
|---|---|---|---|---|
| **Syne** | UI principal · labels · títulos de secção | Display · subtítulos · UI | Principal em tudo | Nunca italic · pesos 200–600 (nunca 800 como regra) |
| **Cormorant Garamond** | Ausente ou citação founder | Frases-mãe · copy filosófico · editorial | Citações de ligação apenas | Nunca em dados · nunca em labels · nunca em UI funcional |
| **JetBrains Mono** | Dominante em dados/comandos/IDs | Contadores vivos (contenção máxima) | Metadados: versão/data/hash | Nunca em copy narrativo · nunca decorativamente |

---

## ESCALA TIPOGRÁFICA CANÓNICA (valores base)

```
SCALE ════════════════════════════════════════════════════════════════════════

[PRODUTO — peso leve]
  Display XL:  Syne 200 · 72–96px · tracking-[-0.02em] · lh-[1.0]
  Display L:   Syne 300 · 48–72px · tracking-[-0.01em] · lh-[1.1]
  Title:       Syne 300 · 32–48px · tracking-normal   · lh-[1.2]
  Subtitle:    Syne 400 · 20–28px · tracking-normal   · lh-[1.4]
  Phrase:      Cormorant 300 italic · 18–24px          · lh-[1.6]
  Body:        Cormorant 400 · 17–20px                 · lh-[1.8]
  Label:       Syne 500 · 11–13px · tracking-[0.1em] · uppercase

[SISTEMA — peso técnico]
  Section:     Syne 400 · 18–28px · tracking-normal · paper
  Sublabel:    Syne 400 · 13–16px · tracking-[0.06em] · paper-dim
  Terminal:    JetBrains 400 · 13–14px               · teal-light
  Data:        JetBrains 400 · 14–16px · tabular-nums · gold ou teal
  Comment:     JetBrains 400 · 12px                  · paper-dim · opacity 0.5

[ECOSSISTEMA — peso neutro]
  Section:     Syne 400 · 20–32px · tracking-normal · paper
  Link node:   Syne 400 · 14–16px · tracking-normal · teal
  Meta:        JetBrains 400 · 11–12px              · paper-dim
  Quote:       Cormorant 400 italic · 16–18px        · paper · lh-[1.7]

══════════════════════════════════════════════════════════════════════════════
```

---

## POSIÇÃO NA MALHA

| Artefacto | Relação com este ficheiro |
|---|---|
| `ops/BRAND_MOTHER_SYSTEM.md` | mãe tipográfica — este ficheiro especializa e extende |
| `ops/SYSTEM_FACE_CANON.md` | face do sistema — aplica SYSTEM_FACE_TYPE desta lei |
| `ops/HEAVEN_LAB_REFERENCE_SURFACE.md` | surface do produto — aplica PRODUCT_FACE_TYPE |
| `ops/NORTH_STAR_BEFORE_HARD_EXECUTION.md` | NS-1 que depende desta lei para ser construído |

---

*TYPOGRAPHY_LAW.md v1.0 — criado em 2026-03-23 | claude-sonnet-4-6 | TYPOGRAPHY-LAW-001*
