# HEAVEN LAB REFERENCE SURFACE — North Star Visual Canônico

**Versão:** v1.0
**Data:** 2026-03-23
**Task:** HEAVEN-LAB-REFERENCE-SURFACE-001
**Branch:** `claude/rebuild-bastion-core-rihGX`
**Modelo:** claude-sonnet-4-6
**Aprovado por:** owner (autorização direta — 2026-03-23)

> A superfície de referência é o espelho físico da identidade Heaven Lab.
> Não é uma página web — é a primeira prova pública de que o sistema é real.
> Quem a vê deve dizer espontaneamente: "isto não é normal".
> É o objeto que antecede qualquer produto, parceiro ou investidor.

---

## REFERENCE_SURFACE_OBJECTIVE

```
OBJETIVO:
  Definir canonicamente a primeira superfície de referência do Heaven Lab —
  a interface visual que prova ao mundo que o sistema existe, é coerente
  e opera em categoria própria.

CRITÉRIO DE SUCESSO (HEAVEN LAB TEST):
  O visitante diz espontaneamente, sem ser guiado:
  → "isto não é normal"
  → "parece um laboratório premium"
  → "tem atmosfera própria"

  Se o visitante ficar em silêncio por mais de 3 segundos ao entrar →
  o teste está a passar.

POSIÇÃO NA SEQUÊNCIA CANÔNICA:
  Phase 1 (Close Sprint) → Phase 2 (Brand Mother System) →
  Phase 3 (Framer + Antigravity) → Phase 4 (Presence + Exploration)
  Este artefacto pertence à transição Phase 2 → Phase 3.
  Fixa o que Framer e Antigravity devem construir.

PILAR:    WorkVisual
WORKTREE: WorkVisual
EXECUTOR: @framer (estrutura visual) + @antigravity (motion / 3D)
GATE:     owner abre após Brand Mother System selada
```

---

## HEAVEN_LAB_TEST

```
HEAVEN_LAB_TEST ══════════════════════════════════════════════════════════════
  Pergunta-mãe:   "Onde é que eu estou?"
  Resposta correta (não verbalizada pelo visitante, sentida):
    "Num laboratório que não se parece com nada que vi antes."

  PASSA SE:
  ✓ Visitante rola a página devagar (dwell time > 8s no hero)
  ✓ Visitante move o cursor sobre o globo sem instrução
  ✓ Visitante lê os 3 filhos sem ser solicitado
  ✓ Visitante volta à página sem ter sido redirecionado
  ✓ Visitante diz uma das 3 frases-trigger acima

  FALHA SE:
  ✗ Visitante sai em menos de 3 segundos
  ✗ Visitante confunde com site de agência, portfólio ou startup genérica
  ✗ Visitante não encontra identidade sem instrução adicional
  ✗ Globe é estático ou inerte (sem resposta ao cursor)
  ✗ Identidade visual colapsa em mobile
══════════════════════════════════════════════════════════════════════════════
```

---

## REFERENCE_SURFACE_STRUCTURE

```
ESTRUTURA DA SUPERFÍCIE ══════════════════════════════════════════════════════

BLOCO 1 — GLOBE (Centro Vivo)
─────────────────────────────
  O_QUE_E:
    Living globe 3D — esfera que respira, roda lentamente, responde ao cursor.
    Não é decoração. É o símbolo vivo do sistema Heaven Lab.
    Faz referência à escala do trabalho: global, vivo, em construção permanente.

  ESPECIFICACAO_VISUAL:
    Material:   glass + emissão suave (teal #206358 + navy #060c14)
    Movimento:  rotação lenta autônoma (8000ms/rev) + parallax ao cursor
    Brilho:     aurora polar subtil — pulsa em sync com o scroll
    Atmosfera:  fundo navy #060c14 + partículas esparsas (opacidade 0.06)
    Interação:  hover → aceleração leve; click → pulse + reveal de texto

  LEI_DE_PRESENÇA:
    O globo deve ser o primeiro objeto vivo que o visitante vê.
    Deve ocupar 60–70% da viewport acima do fold.
    Nenhum elemento interfere com a percepção do globo no hero.

BLOCO 2 — TRINITY (Identidade dos 3 Filhos)
─────────────────────────────────────────────
  TRINDADE:
    FILHO 1: Heaven Lab          → O Sistema    → máquina que governa tudo
    FILHO 2: Earth Lab           → O Produto    → proof-of-system no mundo
    FILHO 3: Arquitetura Aberta  → O Legado     → template replicável

  APRESENTACAO_VISUAL:
    3 nós orbitando o globo — posicionados em 120° entre si.
    Cada nó: nome + uma linha de identidade (12 palavras máx.)
    Aparecimento: escalonado (150ms entre nós) após globe load completo.
    Hover em nó: expande linha de identidade + reveal de micro-detalhe.

  HIERARQUIA_TIPOGRÁFICA:
    Título nó:    Syne 14px · tracking 0.12em · uppercase · gold #c9870f
    Linha:        Cormorant Garamond 13px · italic · paper #e4ebf0 · opacidade 0.72
    Micro-detalhe: JetBrains Mono 11px · teal #206358 · aparece só em hover

BLOCO 3 — SACRED ORBITAL CHAMBER (Espaço de Presença)
──────────────────────────────────────────────────────
  O_QUE_E:
    O espaço ao redor do globo — a câmara orbital — não é vazio.
    É atmosfera controlada: glass, luz, respiração.
    A câmara define que o visitante está dentro de um laboratório,
    não a navegar num site.

  ESPECIFICACAO_VISUAL:
    Camada glass:   atlas-glass-fill 0.04 · blur 16px · border 0.5px paper #e4ebf0 · opacidade 0.08
    Luz ambiente:   gradiente radial navy → teal (opacidade 0.12) centrado no globo
    Respiração:     pulso lento 4000ms · escala 0.98 → 1.02 · ease [0.22,1,0.36,1]
    Profundidade:   z-layers definidos (background 0 / globe 1 / nós trinity 2 / UI 3)

  LEI_DA_CÂMARA:
    O espaço entre elementos deve respirar — nunca comprimido.
    Negative space mínimo no hero: 40% da viewport.
    Nenhum elemento de UI entra na câmara sem glass como protetor.

BLOCO 4 — MACHINE SUBSTRATE (Camada de Fundo)
──────────────────────────────────────────────
  O_QUE_E:
    O substrato da máquina — a evidência de que o sistema é técnico, real,
    em execução. Não é visível à primeira vista. É descoberto ao rolar ou
    ao mover o cursor nas bordas da viewport.

  ESPECIFICACAO_VISUAL:
    Grid técnico:   linhas navy #060c14 + 8% opacidade · 40px cell · z-index 0
    Dados vivos:    3–5 métricas reais do sistema (uptime / tasks / commits)
                    renderizadas em JetBrains Mono 10px · teal #206358 · opacidade 0.4
    Movimento:      parallax suave ao scroll (factor 0.15) — grid move mais devagar que o conteúdo
    Reveal:         substrate aparece gradualmente ao rolar além do fold (fade-in 600ms)

  LEI_DO_SUBSTRATO:
    O substrato nunca compete com o globo ou a trindade.
    É sempre subordinado — fundo técnico, não protagonista.
    Remove-se completamente em mobile (não visible em viewport < 768px).

BLOCO 5 — FIRST PROOF (Primeira Prova Pública)
───────────────────────────────────────────────
  O_QUE_E:
    O momento em que o visitante percebe que o sistema é real — não uma promessa.
    É o ponto da página onde a narrativa passa de "o que é" para "o que já existe".

  ELEMENTOS:
    1. UMA frase-mãe (ver MOTHER_PHRASES em GREAT_STORY_OF_HEAVEN_LAB.md)
       renderizada em Cormorant Garamond 24px · centered · opacidade 0 → 1 ao scroll
    2. Earth Lab como filho vivo:
       preview card — screenshot real ou mockup de alta fidelidade
       hover: glass reveal + "Ver produto" CTA em Syne 12px · gold
    3. Contador vivo:
       N sessões · N tasks · N commits — dados reais, atualizados
       JetBrains Mono 13px · teal · sem arredondamento de valores
    4. Link canônico para o repo ou manifesto (não oculto, não destacado demais)

  LEI_DA_PROVA:
    A primeira prova não pede crença — apresenta evidência.
    Sem superlativo. Sem adjetivo. Só número + objeto real.
    Se não há evidência real disponível, este bloco não aparece.
```

---

## WORKTREE_ASSIGNMENT

```
ASSIGNMENT_TABLE ════════════════════════════════════════════════════════════
  BLOCO              EXECUTOR              COMPETÊNCIA
  ─────────────────────────────────────────────────────────────────────────
  GLOBE              @antigravity          3D · motion · ThreeJS / R3F
  TRINITY            @framer               layout orbital · micro-interações
  CHAMBER            @framer + @antigravity glass system + z-layers
  SUBSTRATE          @antigravity          grid técnico + parallax + dados vivos
  FIRST_PROOF        @framer               layout de scroll + card + CTA

  BRAND_MOTHER_SYSTEM: todos os executores implementam a partir de:
    ops/BRAND_MOTHER_SYSTEM.md — lei visual definitiva
    → cores: navy #060c14 · gold #c9870f · teal #206358 · paper #e4ebf0
    → tipografia: Syne · Cormorant Garamond · JetBrains Mono
    → glass: atlas-glass-fill 0.04 · blur 16px
    → motion: ease [0.22,1,0.36,1] · 150ms micro → 8000ms ambient

  GATE_FRAMER:      @owner abre após este artefacto aprovado
  GATE_ANTIGRAVITY: @owner abre em paralelo com @framer
══════════════════════════════════════════════════════════════════════════════
```

---

## NEXT_ACTION_CHAIN

```
CHAIN ════════════════════════════════════════════════════════════════════════
  [1] HEAVEN-LAB-REFERENCE-SURFACE-001   → este artefacto · CONCLUÍDA
  [2] BRAND_MOTHER_SYSTEM_SEAL           → ops/BRAND_MOTHER_SYSTEM.md já existe
                                           owner confirma como lei definitiva
  [3] GATE_FRAMER                        → owner abre gate para @framer
                                           entra em WorkVisual · globe layout
  [4] GATE_ANTIGRAVITY                   → owner abre gate para @antigravity
                                           entra em WorkVisual · 3D · motion
  [5] NS-1_VISUAL_INCARNATED             → @framer + @antigravity entregam
                                           Heaven Lab Test passa
  [6] NS-2_PRESENCE_EXPLORATION          → scaffolding de exploração do produto
  [7] NS-3_FIRST_WONDER_LAYER_MATTER     → primeiro conteúdo real de product wonder
══════════════════════════════════════════════════════════════════════════════
```

---

## POSIÇÃO NA MALHA

| Artefacto | Relação com este ficheiro |
|---|---|
| `ops/BRAND_MOTHER_SYSTEM.md` | lei visual que este ficheiro aplica |
| `ops/NORTH_STAR_BEFORE_HARD_EXECUTION.md` | NS-1 que este ficheiro viabiliza |
| `ops/CANONICAL_PRE-BATTALION_SEQUENCE.md` | Phase 3 que este ficheiro abre |
| `docs/GREAT_STORY_OF_HEAVEN_LAB.md` | narrativa que este ficheiro materializa |
| `ops/NEXUS_LIVING_CANON.md` | índice canônico (entrada futura após gate) |

---

*HEAVEN_LAB_REFERENCE_SURFACE.md v1.0 — criado em 2026-03-23 | claude-sonnet-4-6 | HEAVEN-LAB-REFERENCE-SURFACE-001*
