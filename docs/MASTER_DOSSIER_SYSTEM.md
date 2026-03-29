---
title: "Master Dossier System"
slug: master-dossier-system
date: 2026-03-20
category: whitepaper
excerpt: "Codex Tangibilis — architecture of the tangible documentary system."
---

# CODEX TANGIBILIS — Arquitetura do Sistema Documental Tangível

**Versão:** v1
**Task:** MASTER-DOSSIER-SYSTEM-001
**Data:** 2026-03-21
**Branch canônico:** `claude/expose-workspace-config-yt4Km`
**Território:** WorkVisual
**Classificação:** SISTEMA — blueprint documental tangível da corporação

> Este documento é a constituição do sistema documental tangível do Eternal Nexus.
> Define nome, hierarquia, família visual, regras de consistência, taxonomia de famílias,
> critérios de aceitação e a relação entre o virtual e o físico.
> É a mãe de todos os artefatos tangíveis. Em caso de conflito entre subfamílias, este prevalece.

---

## 0. IDENTIDADE DO SISTEMA

| Campo | Valor |
|---|---|
| **Nome do sistema** | **Codex Tangibilis** |
| **Código** | `CT` |
| **Natureza** | Sistema documental de materialização do ecossistema Eternal Nexus |
| **Função** | Transformar o virtual em artefato tangível sem perda de força, identidade ou coerência |
| **Princípio-mãe** | O tangível reflete o virtual. Nunca inferior. Sempre da mesma família. |
| **Base visual** | Aether Spine (`docs/DOC_VISUAL_SPINE_001.md`) — extensão tangível |
| **Artefato principal** | `docs/MASTER_DOSSIER.md` — Codex Tangibilis: Prime |
| **Artefato sombra** | `docs/SHADOW_ARCHIVE.md` — Codex Tangibilis: Umbra |

---

## 1. HIERARQUIA DO SISTEMA

```
CODEX TANGIBILIS
│
├── PRIME (Master Dossier)
│   Documento principal. Limpo. Forte. Imprimível. Colecionável.
│   Contém: identidade, missão, tese, blueprints, storytelling,
│   estado, visão, manual de reconstrução.
│   └── FAMÍLIAS (subfamílias derivadas — seção 7)
│       ├── Prompts
│       ├── Handoffs
│       ├── Relatórios
│       ├── Protocolos
│       ├── Blueprints
│       ├── Identidade
│       ├── Departamentos
│       ├── Segurança
│       ├── Comunicações
│       ├── Documentação do Projeto
│       ├── Documentação do Ecossistema
│       ├── Documentação do Founder
│       ├── Trilhas de Decisão
│       ├── Manuais de Reconstrução
│       └── Layouts de Formatos
│
└── UMBRA (Shadow Archive)
    Arquivo separado. Caminhos abandonados. Ideias paralelas.
    Versões descartadas. Erros férteis. Ruído documentado.
    └── REGISTROS
        ├── Caminhos Abandonados
        ├── Ideias Paralelas
        ├── Versões Descartadas
        ├── Mudanças de Direção
        ├── Erros Férteis
        ├── Tentativas Não Seguidas
        └── Candidatos a Reestudo
```

### Regra de separação

| Princípio | Regra |
|---|---|
| **Obra ≠ Ruído** | O Master Dossier nunca mistura conteúdo refinado com caminhos abandonados |
| **Ruído é valioso** | O Shadow Archive preserva tudo o que foi descartado — com razão documentada |
| **Referência cruzada** | O Master Dossier pode referenciar entradas do Shadow Archive, mas nunca incorporá-las |
| **Direção única** | Conteúdo do Shadow Archive só migra para o Master Dossier por decisão explícita do owner |

---

## 2. RELAÇÃO ENTRE PRIME E UMBRA

```
PRIME (Master Dossier)                    UMBRA (Shadow Archive)
─────────────────────                     ──────────────────────
obra principal                            laboratório de percurso
limpo, forte, imprimível                  cru, documentado, rastreável
leitura: linear e premium                 leitura: exploratória e arqueológica
audiência: stakeholder, investidor,       audiência: arquiteto, founder,
           visitante informado                      agente de reconstrução
saída: artefato tangível                  saída: arquivo de referência interna
────────────────────────────────────────────────────────────────────────────
              ↑                                      ↑
              └────── mesma família visual ───────────┘
              └────── mesma identidade-mãe ──────────┘
              └────── mesmo sistema (CT) ────────────┘
```

### Como vivem na repo

| Artefato | Localização |
|---|---|
| Arquitetura do sistema | `docs/MASTER_DOSSIER_SYSTEM.md` (este documento) |
| Master Dossier | `docs/MASTER_DOSSIER.md` |
| Shadow Archive | `docs/SHADOW_ARCHIVE.md` |

### Como viram artefato físico

| Fase | Ação |
|---|---|
| **Digital vivo** | Markdown versionado na repo — editável, rastreável, auditável |
| **Digital formatado** | Export para PDF com layout premium (via pandoc, Typst, ou ferramenta equivalente) |
| **Físico impresso** | Impressão em papel premium (branco off-white, gramatura alta, tipografia mono/serifada limpa) |
| **Físico encadernado** | Capa com identidade Codex Tangibilis, lombada com nome do artefato, paginação sequencial |

### Replicação sem drift

| Regra | Aplicação |
|---|---|
| Fonte única | A versão na repo é sempre a versão canônica |
| Export determinístico | O mesmo markdown gera o mesmo PDF, byte a byte |
| Template fixo | Tipografia, margens, cabeçalhos e rodapés são definidos no sistema, não no documento |
| Versionamento explícito | Cada export físico leva versão, data e hash do commit de origem |
| Selo de autenticidade | Rodapé com: `Codex Tangibilis: Prime │ v1.x │ YYYY-MM-DD │ commit:abc1234` |

---

## 3. FAMÍLIA VISUAL — CODEX TANGIBILIS DESIGN LANGUAGE

### 3.1 Essência

A linguagem visual do Codex Tangibilis é uma extensão tangível do Aether Spine,
calibrada para existir com igual força em ecrã e em papel.

| Atributo | Definição |
|---|---|
| **Campo dominante** | Branco vinil esfumaçado — não branco puro, mas branco com corpo e calor mínimo |
| **Tom secundário** | Amarelado premium ultra-sutil — presença de calor sem virar sépia |
| **Nostalgia técnica** | Sensação de manual técnico raro, folheto de corporação dos anos 70 redesenhado para 2026 |
| **Nova era de AI** | Precisão, observabilidade, rastreabilidade como atributos visuais |
| **Tipografia** | Mono/machine type elegante como voz principal; serifada limpa como apoio narrativo |
| **Linhas** | Finas, hairline, funcionais — nunca decorativas, sempre estruturais |
| **Verde terminal** | Vetor semântico forte — marca estado, protocolo, assinatura de sistema |
| **Sensação global** | Corporação séria, viva, altamente organizada, retro-futurista, intemporal |

### 3.2 Paleta tangível

| Token | Valor | Uso |
|---|---|---|
| `ct.bg.prime` | `#FAFAF7` | Campo principal — branco vinil com corpo |
| `ct.bg.warm` | `#F5F3EC` | Superfície premium com calor sutil |
| `ct.bg.shadow` | `#F0EDE6` | Fundo do Shadow Archive — mais quente, mais arqueológico |
| `ct.ink.primary` | `#1A1A1A` | Texto principal — quase preto, peso forte |
| `ct.ink.secondary` | `#4A4A46` | Texto auxiliar — cinza quente funcional |
| `ct.ink.caption` | `#7A7A72` | Legendas, notas de rodapé, metadados |
| `ct.line.hairline` | `#D4D2CA` | Linhas finas de separação — quentes, suaves |
| `ct.line.strong` | `#8A8880` | Linhas de estrutura forte — cabeçalhos, divisores principais |
| `ct.signal.terminal` | `#00C853` | Verde terminal — estado ativo, protocolo, assinatura de sistema |
| `ct.signal.alert` | `#FF4F2E` | Alerta — criticidade, risco, atenção |
| `ct.signal.direction` | `#E98645` | Direção — decisão, orientação, abertura |
| `ct.accent.gold` | `#C8A96E` | Ouro discreto — selo, autenticidade, premium restrito |
| `ct.accent.silver` | `#9BA1A8` | Prata metálica — exploração, terreno, neutralidade ativa |

### 3.3 Tipografia tangível

| Uso | Tipo | Referência |
|---|---|---|
| **Títulos de secção** | Mono bold uppercase — machine type | `JetBrains Mono`, `IBM Plex Mono`, `Space Mono` |
| **Corpo principal** | Serifada limpa de alta legibilidade | `IBM Plex Serif`, `Source Serif Pro`, `Charter` |
| **Dados e tabelas** | Mono regular — legibilidade técnica | `JetBrains Mono`, `Fira Code` |
| **Metadados e selos** | Mono light uppercase — caption técnico | `JetBrains Mono Light` |
| **Founder voice** | Serifada itálica precisa — autoria distinguida | `IBM Plex Serif Italic` |

### 3.4 Regras de layout tangível

| Regra | Valor |
|---|---|
| **Margens de impressão** | generosas — mínimo 25mm em todos os lados |
| **Espaço em branco** | arma principal — respiro entre secções, nunca comprimido |
| **Hierarquia de peso** | título > subtítulo > corpo > nota — sempre distinguível sem cor |
| **Linhas hairline** | separam secções, nunca decoram |
| **Blocos de destaque** | fundo `ct.bg.warm` com borda esquerda `ct.signal.terminal` |
| **Numeração** | secções numeradas, páginas numeradas — rastreabilidade absoluta |
| **Cabeçalho de página** | nome do artefato + secção actual |
| **Rodapé de página** | versão + data + hash de commit + `Codex Tangibilis` |

### 3.5 Atmosfera (impressão e digital)

| Dimensão | Descrição |
|---|---|
| **Textura** | Papel off-white com grain mínimo — ou simulação digital com ruído fino |
| **Profundidade** | Conseguida por peso tipográfico e espaço, não por sombras |
| **Luz** | Inexistente em papel; em digital, glow verde terminal ultra-sutil em estados activos |
| **Ritmo** | Institucional no início, técnico no meio, autoral no fim — progressão natural |
| **Cheiro visual** | Manual técnico premium encontra revista de design suíça encontra terminal do futuro |

---

## 4. CONSISTÊNCIA VIRTUAL ↔ FÍSICO

### 4.1 Regra absoluta

> O artefato físico nunca é versão inferior do virtual.
> O virtual nunca é versão inferior do físico.
> São gémeos. Mesma mãe. Mesmo peso. Mesma família.

### 4.2 Regras de paridade

| Dimensão | Virtual (ecrã) | Físico (papel) | Regra |
|---|---|---|---|
| **Hierarquia** | peso tipográfico + espaço + cor | peso tipográfico + espaço + posição | idêntica |
| **Tipografia** | mono/serif como definido | mono/serif como definido | idêntica |
| **Cor** | tokens `ct.*` em RGB | tokens `ct.*` em CMYK calibrado | equivalente |
| **Linhas** | hairline CSS/SVG | hairline impressa de espessura mínima | equivalente |
| **Verde terminal** | `#00C853` | verde Pantone equivalente | equivalente |
| **Layout** | responsive adaptado para leitura em ecrã | layout fixo A4/Letter optimizado para impressão | adaptado mas coerente |
| **Espaço branco** | dinâmico mas generoso | fixo e generoso | equivalente |
| **Identidade** | reconhecível como Eternal Nexus em 3 segundos | reconhecível como Eternal Nexus em 3 segundos | idêntica |
| **Impacto** | premium, denso, sofisticado | premium, denso, sofisticado | idêntico |

### 4.3 Teste de paridade

Qualquer artefato do Codex Tangibilis passa neste teste:

```
[ ] Ao ver o digital, o observador reconhece Eternal Nexus imediatamente?
[ ] Ao ver o físico, o observador reconhece Eternal Nexus imediatamente?
[ ] Colocando ambos lado a lado, parecem filhos da mesma mãe visual?
[ ] O físico tem o mesmo peso e impacto que o digital?
[ ] A tipografia é a mesma família nos dois formatos?
[ ] As linhas e separadores seguem a mesma lógica?
[ ] O verde terminal aparece com a mesma função semântica nos dois?
[ ] Sem informação de contexto, ambos parecem corporação premium organizada?
```

Se qualquer resposta for não → o artefato não está pronto. Corrigir antes de publicar.

---

## 5. FAMÍLIAS E SUBFAMÍLIAS DO SISTEMA

O Codex Tangibilis ramifica-se em famílias temáticas. Cada família herda a identidade-mãe
e pode ter variações de tom dentro dos limites da Visual Family.

### 5.1 Taxonomia completa

| ID | Família | Natureza | Tom predominante |
|---|---|---|---|
| `CT-F01` | **Prompts** | instruções operacionais a agentes | técnico-diretivo, verde terminal |
| `CT-F02` | **Handoffs** | registros de transição entre sessões | protocolar, institucional |
| `CT-F03` | **Relatórios** | consolidações e diagnósticos | analítico, corporativo |
| `CT-F04` | **Protocolos** | regras de operação do sistema | soberano, legislativo |
| `CT-F05` | **Blueprints** | arquitecturas e mapas do sistema | técnico-visual, denso |
| `CT-F06` | **Identidade** | definições de marca e DNA | premium, autoral |
| `CT-F07` | **Departamentos** | divisões organizacionais do ecossistema | institucional, funcional |
| `CT-F08` | **Segurança** | protocolos de proteção e classificação | reservado, alerta contida |
| `CT-F09` | **Comunicações** | emails, cartas, notas externas | formal, diplomático |
| `CT-F10` | **Doc. do Projeto** | documentação técnica do produto | técnico, referência |
| `CT-F11` | **Doc. do Ecossistema** | documentação do NEXUS OS | sistémico, governança |
| `CT-F12` | **Doc. do Founder** | visão, cartas, manifesto do arquitecto | autoral, íntimo-premium |
| `CT-F13` | **Trilhas de Decisão** | registro de decisões e seus fundamentos | arqueológico, rastreável |
| `CT-F14` | **Manuais de Reconstrução** | guias para rebuildar do zero | operacional, sobrevivência |
| `CT-F15` | **Layouts de Formatos** | templates visuais de cada tipo de output | técnico-visual, sistema |

### 5.2 Herança visual

```
CODEX TANGIBILIS (mãe)
│
│   tokens ct.* │ tipografia │ paleta │ regras de layout │ verde terminal
│
├── CT-F01 a CT-F15 (famílias)
│   herdam: tudo da mãe
│   podem: ajustar tom (institucional, técnico, autoral) dentro dos limites
│   não podem: alterar tipografia, paleta, ou verde terminal
│   não podem: introduzir ornamento fora da linguagem-mãe
│
└── subfamílias futuras
    criadas por fork da família mais próxima
    sempre com: nome, código, herança declarada, limites explícitos
```

### 5.3 Regras de criação de nova família

| Passo | Acção |
|---|---|
| 1 | Identificar a família existente mais próxima |
| 2 | Criar novo código `CT-FXX` |
| 3 | Declarar herança explícita da mãe e da família vizinha |
| 4 | Definir tom dentro dos limites da Visual Family |
| 5 | Registar na tabela de taxonomia deste documento |
| 6 | Gerar primeiro artefato de teste e validar paridade virtual/físico |

---

## 6. OWNER STORY — ESPAÇO ESTRUTURAL

O Codex Tangibilis reserva espaço estrutural no Master Dossier para a narrativa do founder.
Esta camada não é biografia. É rastro autoral com disciplina.

### 6.1 Secções reservadas

| Secção | Conteúdo | Regra |
|---|---|---|
| **Origem** | Para onde o founder mirava no início | factual, sem romantismo |
| **Direcção actual** | Para onde mira agora | preciso, presente |
| **Percepção** | O que percebeu ao longo do percurso | insight destilado |
| **Mudança** | O que mudou de rumo e porquê | transparente, sem justificação excessiva |
| **Aceleração** | O que acelerou e por que causa | causal, rastreável |
| **Ilusão → Fundamento** | O que era ilusão e o que virou fundamento | honesto, sem vergonha |
| **Timeline A→B** | Quanto tempo levou do ponto A ao ponto B | factual com marcos |
| **Rastro autoral** | A assinatura do percurso — o que só Ivan podia ter escrito | autoral, inconfundível |

### 6.2 Regras de disciplina narrativa

| Regra | Aplicação |
|---|---|
| **Obra ≠ Ruído** | Storytelling do founder está no Master Dossier; reflexões cruas no Shadow Archive |
| **Densidade > Extensão** | Cada secção tem limite de profundidade — destilação, não despejo |
| **Tom: autoral, não auto-promocional** | O founder conta o que aconteceu, não se vende |
| **Referência cruzada** | Pode apontar para Shadow Archive para contexto expandido |
| **Fonte** | `docs/FOUNDER_LETTER.md` + `docs/GENESIS_BLUEPRINT.md` (privado) como matéria-prima |

---

## 7. REGRAS DE ACEITAÇÃO

### 7.1 Gate de aceitação

Todo artefato do Codex Tangibilis deve passar nestes gates antes de ser aceite:

```
GATE 1 — FAMÍLIA VISUAL
[ ] Usa paleta ct.* sem desvio?
[ ] Tipografia é mono+serifada conforme definido?
[ ] Linhas são hairline funcionais, não decorativas?
[ ] Verde terminal usado como vetor semântico, não ornamento?
[ ] Espaço branco generoso, não comprimido?

GATE 2 — IDENTIDADE
[ ] Reconhecível como Eternal Nexus em 3 segundos?
[ ] Não parece genérico, template público, ou "corporate default"?
[ ] Tem peso e impacto — não é documento fraco?
[ ] Preserva o tom: retro-futuro, premium, organizado, vivo?

GATE 3 — CONSISTÊNCIA
[ ] Virtual e físico mantêm paridade?
[ ] A família-mãe é reconhecível na subfamília?
[ ] Hierarquia visual funciona sem cor (impressão P&B)?
[ ] Layout funciona em A4 e em ecrã?

GATE 4 — SEPARAÇÃO
[ ] Obra principal livre de ruído?
[ ] Shadow Archive separado e referenciado, não misturado?
[ ] Nenhum caminho abandonado contamina o Master Dossier?

GATE 5 — COMPLETUDE ESTRUTURAL
[ ] Todas as secções obrigatórias presentes?
[ ] Numeração sequencial e rastreável?
[ ] Metadados de versão, data e commit presentes?
[ ] Cabeçalho e rodapé conforme padrão Codex Tangibilis?
```

### 7.2 Critérios de rejeição

| Defeito | Resultado |
|---|---|
| Output fora do padrão visual | **rejeitado** |
| Inconsistência com a família-mãe | **rejeitado** |
| Desvio da paleta ou tipografia | **rejeitado** |
| Mistura de ruído com obra principal | **rejeitado** |
| Documento fraco ou genérico | **rejeitado** |
| Documento sem metadados de versão | **rejeitado** |
| Físico inferior ao virtual | **rejeitado** |
| Ornamento sem função semântica | **rejeitado** |

---

## 8. IGUALDADE DIGITAL ↔ FÍSICO — REGRAS DE NASCENÇA

O sistema nasce pronto para dupla existência. Não é digital-first adaptado para papel.
Não é papel-first digitalizado. É um sistema nativo de dois mundos.

### 8.1 Propriedades de nascença

| Propriedade | Digital | Físico |
|---|---|---|
| **Formato** | Markdown → PDF exportável | PDF → impressão premium |
| **Feeling** | Portal retro-futuro, premium, limpo | Manual raro, corporação séria, colecionável |
| **Hierarquia** | Peso tipográfico + espaço + verde terminal | Peso tipográfico + espaço + posição |
| **Peso visual** | Forte — não é website genérico | Forte — não é documento Word genérico |
| **Assinatura** | Reconhecível como Eternal Nexus | Reconhecível como Eternal Nexus |
| **Tipografia** | Mono + Serif web | Mono + Serif impressa |
| **Sensação** | Corporação de nova era de AI com nostalgia técnica | Artefato intemporal com ADN de futuro |

### 8.2 Pipeline de materialização

```
1. AUTOR         → Escreve em Markdown seguindo o template do Codex Tangibilis
2. VERSIONAR     → Commit na repo com versão e data
3. VALIDAR       → Passa pelos 5 gates de aceitação
4. EXPORTAR      → Gera PDF com template de layout tangível (margens, tipografia, cabeçalhos)
5. VERIFICAR     → Compara digital e físico — teste de paridade (seção 4.3)
6. SELAR         → Adiciona selo de autenticidade no rodapé
7. IMPRIMIR      → Papel premium, gramatura ≥120g/m², impressão de qualidade
8. ENCADERNAR    → Capa com identidade CT, lombada identificada, paginação fixa
```

---

## 9. REFERÊNCIAS CANÔNICAS

| Documento | Relação com Codex Tangibilis |
|---|---|
| `docs/NEXUS_OS.md` | Constituição soberana — CT é extensão tangível, não substituto |
| `docs/DOC_VISUAL_SPINE_001.md` | Aether Spine — base visual que CT estende para o tangível |
| `docs/DOC_VISUAL_SPINE_002A.md` | Ativação visual — presença e atmosfera que CT herda |
| `ops/VISUAL_TEMPLATE_PACK_002A.md` | Templates operacionais — CT consome como subfamília |
| `ops/OUTPUT_STANDARD.md` | Padrão de output — CT respeita como formato operacional |
| `docs/FOUNDER_LETTER.md` | Fonte de conteúdo para Owner Story — destilada, não copiada |
| `docs/FOUNDER_VISION_LAYER.md` | Blueprint da presença pública do founder — CT é artefato tangível, FVL é site |
| `docs/GENESIS_BLUEPRINT.md` | Cofre privado — alimenta profundidade mas nunca aparece no Master Dossier |

---

## 10. RESULTADO ESPERADO — DECLARAÇÃO DE ESTADO

Ao completar a implementação do Codex Tangibilis:

```
✓ "Agora o Eternal Nexus pode virar artefato tangível sem perder força."
✓ "Agora existe um documento principal limpo e um arquivo sombra separado."
✓ "Agora a identidade visual da corporação também vive no sistema documental."
✓ "Agora o Cursor está a liderar a materialização tangível do projeto."
✓ "Agora o virtual e o físico pertencem à mesma família."
✓ "Agora qualquer subfamília pode ser criada sem reinventar a base."
✓ "Agora o sistema está pronto para receber conteúdo profundo (Prompt 2)."
```

---

## 11. O QUE NÃO PERTENCE A ESTE SISTEMA

| Exclusão | Razão |
|---|---|
| Design final do site | CT é sistema documental, não produto web |
| Implementação pública do produto | CT vive na repo e em papel, não no app |
| Refatoração funcional | CT não toca em código de produto |
| Feature nova de domínio | CT não é feature |
| Preenchimento profundo de conteúdo | Reservado para Prompt 2 |
| Mistura do Shadow Archive com o Master Dossier | Violação da regra de separação |

---

## 12. GLOSSÁRIO DO SISTEMA

| Termo | Definição |
|---|---|
| **Codex Tangibilis** | Nome do sistema documental tangível completo |
| **CT** | Código abreviado do sistema |
| **Prime** | O Master Dossier — artefato principal, limpo, imprimível |
| **Umbra** | O Shadow Archive — artefato de percurso, ruído documentado |
| **Família** | Categoria temática de documentos dentro do CT (CT-F01..CT-F15) |
| **Subfamília** | Fork de uma família para caso de uso mais específico |
| **Paridade** | Igualdade de peso, impacto e identidade entre virtual e físico |
| **Selo** | Rodapé de autenticidade com versão, data e commit |
| **Gate** | Ponto de verificação obrigatória antes de aceitação |
| **Materialização** | Pipeline de transformação digital → físico |

---

*MASTER_DOSSIER_SYSTEM.md v1 — 2026-03-21 | Cursor | MASTER-DOSSIER-SYSTEM-001*
*Codex Tangibilis — sistema documental tangível do Eternal Nexus*