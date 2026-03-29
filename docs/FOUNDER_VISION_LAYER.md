---
title: "Founder Vision Layer"
slug: founder-vision-layer
date: 2026-03-20
category: manifesto
excerpt: "Canonical blueprint of the founder's vision."
---

# FOUNDER VISION LAYER — Blueprint Canônico

**Versão:** v1
**Task:** FOUNDER-VISION-LAYER-001
**Data:** 2026-03-20
**Branch:** `claude/expose-workspace-config-yt4Km`
**Modelo:** claude-sonnet-4-6
**Classificação:** PÚBLICO — blueprint da presença do founder no site

> Este documento define a estrutura, tom, conteúdo e limites da camada pública
> do founder dentro do produto Eternal Nexus.
> Não é o cofre interno. Não é o protocolo soberano. É a vitrine arquitetada.
>
> Quando esta camada existir no site, o visitante deve sentir:
> precision, ambition, authorship — não bio, não currículo, não "about".

---

## 1. SEPARAÇÃO DE CAMADAS — ONDE CADA COISA VIVE

Antes de definir o que entra, é essencial fixar o que não se mistura:

| Camada | Documento | Audiência | Propósito |
|---|---|---|---|
| **Cofre interno** | `docs/GENESIS_BLUEPRINT.md` | Arquiteto + sistema | Memória de reconstrução, princípios, lições. Nunca exposto. |
| **Vitrine do repositório** | `docs/FOUNDER_LETTER.md` | Quem lê o repo | Carta pública de contexto. Já existe, já está posicionada. |
| **Camada pública do site** | Este blueprint → UI | Visitante do produto | Presença do founder como experiência de produto premium. |

**Regra de separação:**
> O cofre não entra no site. A carta pode alimentar o site mas não é despejada.
> A camada do site é uma destilação curada — não uma cópia nem um link.

---

## 2. NOME E IDENTIDADE DA CAMADA

**Nome canônico:** `Founder Vision Layer`
**Rota sugerida no site:** `/founder` ou como secção embebida na home
**Código semântico:** `FVL`

**O que esta camada é:**
Uma experiência de produto que apresenta o arquiteto, a visão e o ecossistema
de forma precisa, premium e autoral. É a resposta à pergunta que o visitante certo
vai fazer quando encontrar o Eternal Nexus: *quem construiu isto e porquê?*

**O que esta camada não é:**
- Uma bio de LinkedIn
- Uma página "About Us" genérica
- Um dump de documentação interna
- Uma pitch deck em texto
- Uma secção de currículo ou competências em lista

---

## 3. SECÇÕES DA CAMADA — ESTRUTURA CANÔNICA

A Founder Vision Layer organiza-se em **6 secções**, nesta ordem:

---

### SECÇÃO 1 — THE ARCHITECT
*A identidade do founder em poucas linhas de máxima precisão.*

**O que entra:**
- Nome: Ivan
- Identidade central: founder + arquiteto de sistemas
- Distinção-chave: constrói sistemas, não apenas produtos
- Uma frase de ancoragem que captura a postura

**Tom:** primeira pessoa, assertivo, sem hedging, sem modéstia falsa
**Comprimento:** 3-5 frases máximo. Densidade > extensão.
**Não entra:** localização, cargo, stack, anos de experiência

**Fonte:** `docs/FOUNDER_LETTER.md` — secção "Quem sou" (distilada, não copiada)

**Exemplo de postura:**
> "Sou um fundador. Construo sistemas — não apenas produtos.
> A distinção importa."

---

### SECÇÃO 2 — WHAT IS BEING BUILT
*O produto + o sistema por baixo do produto.*

**O que entra:**
- Eternal Nexus como produto: plataforma de informação com perspectiva
- NEXUS OS como sistema: o OS para construir com múltiplos agentes de IA
- A relação entre os dois: o produto é a prova; o sistema é o argumento

**Tom:** explicativo mas não técnico. Suficientemente denso para intrigar quem sabe. Suficientemente claro para não excluir quem não sabe.
**Comprimento:** 2 parágrafos ou blocos equivalentes
**Não entra:** nomes de agentes, modelos específicos, stack técnica, handoffs

**Fonte:** `docs/FOUNDER_LETTER.md` — secções "O que estou a construir" + "A diferença real" (destiladas)

---

### SECÇÃO 3 — THE THESIS
*A ideia central. A aposta intelectual do sistema.*

**O que entra:**
- Problema: governança de agentes IA em sessões discretas sem memória partilhada
- Solução: protocolo, não apenas ferramentas ou prompts melhores
- Tese: qualidade sustentada não vem de capacidade individual — vem de estrutura colectiva
- Por que isso importa para o mundo além deste produto

**Tom:** manifesto filosófico-técnico. Direto. Provocativo onde necessário. Sem suavização.
**Comprimento:** 3-4 blocos curtos ou 1 parágrafo denso por ideia
**Não entra:** detalhes operacionais do protocolo (gates, LIVE_STATE, etc.)

**Fonte:** `docs/FOUNDER_LETTER.md` — secções "Por que isso importa" + "A diferença real" + "O que torna este projeto diferente"

**A frase-âncora desta secção:**
> "Não resolves isso com prompts melhores. Resolves com protocolo."

---

### SECÇÃO 4 — THE ECOSYSTEM BLUEPRINT
*O mapa visível do que está a ser construído — produto + sistema.*

**O que entra:**
- O fluxo do produto: `Tribunal → Atlas → Index → News` (nome canônico, visível)
- A camada de sistema por baixo: brevíssima referência ao NEXUS OS como "the OS underneath"
- O estado atual: quantas camadas existem, o que está funcional
- A visão do ecossistema: para onde expande

**Tom:** visual-conceptual. Esta secção pode ser um diagrama, um mapa, uma lista visual — não necessariamente só texto. Blueprint-feel.
**Comprimento:** depende da execução visual — texto de suporte deve ser mínimo
**Não entra:** stack, detalhes de implementação, nomes de pioneiros, modelos de IA

**Fonte:**
- Fluxo sagrado: `docs/NEXUS_OS.md` (Lei 3) — é público, pode aparecer
- Estado atual: `docs/FOUNDER_LETTER.md` — secção "Estado atual"

---

### SECÇÃO 5 — THE METHOD
*Como isto é construído — sem revelar o protocolo interno.*

**O que entra:**
- O conceito de equipa de agentes com papéis definidos (sem nomear agentes específicos)
- A ideia de gates formais entre sessões
- A rastreabilidade como característica de design, não overhead
- A frase-resumo da metodologia

**Tom:** descritivo, preciso, sem jargão operacional
**Comprimento:** 3-4 pontos curtos ou 1 parágrafo por ideia
**Não entra:** nomes dos pioneiros (Claude, Codex, etc.), LIVE_STATE, handoffs, ledgers — estes são internos

**Fonte:** `docs/FOUNDER_LETTER.md` — secção "O que torna este projeto diferente" (5 pontos destilados)

**Enquadramento sugerido:**
> "Multiple AI agents. Defined roles. Formal handoffs. Observable state.
> Quality by design, not by review."

---

### SECÇÃO 6 — THE VISION + CALL
*Para onde vai. E quem deveria acompanhar.*

**O que entra:**
- Visão do produto (Eternal Nexus como plataforma de curadoria activa)
- Visão do sistema (NEXUS OS como template replicável para founders)
- A ambição: sólido que depois cresce
- Um convite — não CTA genérico. Uma linha que seleciona a audiência certa.

**Tom:** ambicioso, concreto, sem hype. O visitante certo deve sentir reconhecimento — "isto é o que eu procurava".
**Comprimento:** 2-3 parágrafos + 1 linha de convite
**Não entra:** formulários genéricos, "assina a newsletter", "fala connosco"

**Fonte:** `docs/FOUNDER_LETTER.md` — secções "Visão futura" + "Uma nota final"

---

## 4. TOM GLOBAL DA CAMADA

**5 palavras que definem o tom:**
`precision` `authorship` `ambition` `sobriety` `weight`

**5 coisas que o tom evita:**
- Entusiasmo genérico ("estamos a construir algo incrível!")
- Auto-promoção sem substância
- Linguagem de startup pitch
- Modéstia performativa
- Prolixidade sem densidade

**Referências de tom** (não de conteúdo):
- Uma nota de abertura de um livro técnico de referência
- Um manifesto de design (Rams, Ive)
- Uma tese académica bem escrita na parte de introdução

**A regra de teste:** se uma frase pudesse aparecer em qualquer outro "about page", reescreve-a. Esta camada deve ser inconfundível como Ivan's.

---

## 5. O QUE NÃO ENTRA — LISTA DEFINITIVA

```
❌ Nomes dos agentes de IA (Claude, Codex, Copilot, Cursor)
❌ Nomes de modelos (claude-sonnet-4-6, etc.)
❌ Detalhes de protocolo (LIVE_STATE, handoffs, HANDOFF_LEDGER, gates)
❌ Bloqueios internos (B-001, B-002, B-003)
❌ Nomes de branches, worktrees, tasks internas
❌ Stack técnica em detalhe (Supabase, Vite, etc.) — a menos que seja context mínimo
❌ CV/skills em lista
❌ Localização, links de LinkedIn/redes genéricas
❌ Conteúdo do GENESIS_BLUEPRINT.md (privado — nunca)
❌ Jargão operacional (bulking, camadas, escada, ondas)
```

---

## 6. COMO ESTA CAMADA CONVERSA COM OS DOCUMENTOS EXISTENTES

| Documento | Relação com a FVL |
|---|---|
| `docs/FOUNDER_LETTER.md` | Fonte primária de conteúdo destilável — é a matéria-prima narrativa. A FVL não copia: transforma para experiência de produto. |
| `docs/GENESIS_BLUEPRINT.md` | Cofre privado — alimenta a postura e a profundidade da visão mas **nunca aparece na FVL directamente**. É a âncora de onde o founder escreve, não o que o visitante lê. |
| `docs/NEXUS_OS.md` | O fluxo sagrado (Tribunal → Atlas → Index → News) pode aparecer como facto — é o DNA do produto, não informação sensível. |
| `NEXUS_PROVENANCE.md` | Não existe ainda. Se criado no futuro, pode alimentar a secção "The Ecosystem Blueprint" com a linha do tempo de evolução. |

---

## 7. EXECUÇÃO — PRÓXIMOS PASSOS DE IMPLEMENTAÇÃO

Esta task define o blueprint. A implementação da página é uma task separada (FVL-IMPL-001 ou equivalente).

### Quando implementar

A Founder Vision Layer deve ser implementada **após**:
- PLv6.2-b estar decidida e em progresso (produto funcional como prova da tese)
- CI verde e qualidade bloqueada (o produto precisa de estar apresentável antes de apresentar o founder)

### Como implementar

Implementação pode ser:
1. **Rota dedicada `/founder`** — experiência completa, máxima atenção
2. **Secção embebida na home** — entre o produto e o footer, como âncora de credibilidade
3. **Híbrido:** resumo na home + link para `/founder`

A decisão de formato é do owner. O blueprint é agnóstico a isso — funciona nos 3.

### Quem implementa

- **@claude** — implementação da estrutura e conteúdo (pilar Produto + Estrutura)
- **@copilot** — lapidação visual e DX (pilar Lapidação)
- **@codex** — revisão técnica de tipos e integração (pilar Qualidade, se necessário)

---

## 8. CRITÉRIOS DE SUCESSO

A Founder Vision Layer está bem executada quando:

```
✅ Um investidor técnico lê e entende quem é Ivan sem ter lido o repo
✅ Um founder independente reconhece o problema descrito como o seu
✅ Um developer sénior vê a metodologia e quer entender mais
✅ Nenhum elemento do cofre interno é reconhecível na camada pública
✅ O tom é inconfundível — não poderia ser de outro founder
✅ A camada acrescenta credibilidade ao produto, não decora
```

---

*FOUNDER_VISION_LAYER.md v1 — 2026-03-20 | claude-sonnet-4-6 | FOUNDER-VISION-LAYER-001*
*Blueprint canônico — implementação é task separada (FVL-IMPL-001)*