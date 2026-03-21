# CODEX TANGIBILIS: UMBRA — Shadow Archive

```
══════════════════════════════════════════════════════════════════════════
  ETERNAL NEXUS — SHADOW ARCHIVE
  Codex Tangibilis: Umbra
  Versão: v1.0 (estrutura)
  Data: 2026-03-21
  Classificação: INTERNO — arquivo de percurso e ruído documentado
  Sistema: Codex Tangibilis (CT)
  Governança: docs/MASTER_DOSSIER_SYSTEM.md
══════════════════════════════════════════════════════════════════════════
```

> Este documento é o arquivo sombra do sistema documental tangível do Eternal Nexus.
> Preserva tudo o que foi descartado, abandonado, testado e não seguido.
> Não é lixo. É arqueologia do percurso. Cada entrada tem razão documentada.
> Separado do Master Dossier por design. Nunca misturado com a obra principal.

---

## ÍNDICE GERAL

```
  I.    PROPÓSITO E REGRAS
  II.   CAMINHOS ABANDONADOS
  III.  IDEIAS PARALELAS
  IV.   VERSÕES DESCARTADAS
  V.    MUDANÇAS DE DIRECÇÃO
  VI.   ERROS FÉRTEIS
  VII.  TENTATIVAS NÃO SEGUIDAS
  VIII. CANDIDATOS A REESTUDO
  A.    ÍNDICE CRONOLÓGICO
  B.    METADADOS E SELO
```

---

───────────────────────────────────────────────────────────────────────────

## I. PROPÓSITO E REGRAS

───────────────────────────────────────────────────────────────────────────

### I.1 — Propósito

O Shadow Archive existe para:

1. **Preservar** caminhos que foram explorados e não seguidos
2. **Documentar** razões de abandono com transparência
3. **Proteger** o Master Dossier de ruído e material não refinado
4. **Permitir** reestudo futuro de ideias descartadas
5. **Registar** a evolução real do pensamento do arquitecto

### I.2 — O que entra aqui

| Tipo | Definição |
|---|---|
| **Caminho abandonado** | Direcção técnica, arquitectural ou de produto que foi explorada e descartada |
| **Ideia paralela** | Conceito que existiu em simultâneo com a linha principal mas não foi adoptado |
| **Versão descartada** | Iteração anterior de documento, protocolo ou design que foi substituída |
| **Mudança de direcção** | Momento em que o sistema mudou de curso — com antes/depois |
| **Erro fértil** | Erro que produziu insight valioso — documentado com lição |
| **Tentativa não seguida** | Experiência ou abordagem que foi testada e não prosseguiu |
| **Candidato a reestudo** | Ideia descartada que mantém potencial futuro |

### I.3 — O que não entra aqui

| Tipo | Razão |
|---|---|
| Conteúdo refinado do Master Dossier | Pertence ao Prime, não ao Umbra |
| Bugs e issues técnicos correntes | Pertencem ao issue tracker, não ao arquivo |
| Handoffs e ledger operacional | Pertencem a `ops/` |
| Decisões activas do Tribunal | Pertencem ao `DOC_TRIBUNAL_E4.md` |

### I.4 — Regras de entrada

Toda entrada no Shadow Archive segue este formato obrigatório:

```
SHADOW ENTRY ═══════════════════════════════════════════════════════════
ID          │ SA-XXXX
TIPO        │ caminho_abandonado | ideia_paralela | versao_descartada |
            │ mudanca_direcao | erro_fertil | tentativa | reestudo
DATA        │ YYYY-MM-DD
TITULO      │ nome curto e descritivo
CONTEXTO    │ o que estava a acontecer quando esta entrada surgiu
CONTEUDO    │ descrição do que foi explorado / tentado / proposto
RAZAO       │ por que foi abandonado / descartado / não seguido
LICAO       │ o que se aprendeu com isto — ou: —
REESTUDO    │ sim (potencial futuro) | não (encerrado) | talvez (condicional)
REF_PRIME   │ secção do Master Dossier relacionada — ou: nenhuma
═══════════════════════════════════════════════════════════════════════════
```

### I.5 — Regras de integridade

| Regra | Aplicação |
|---|---|
| **Append-only** | Entradas nunca são deletadas — são encerradas com estado |
| **Razão obrigatória** | Nenhuma entrada sem campo RAZAO preenchido |
| **ID sequencial** | SA-0001, SA-0002, ... — sem gaps |
| **Referência cruzada** | O Master Dossier pode apontar para `SA-XXXX` para contexto |
| **Migração controlada** | Conteúdo só sai do Shadow Archive para o Master Dossier por decisão do owner |

---

───────────────────────────────────────────────────────────────────────────

## II. CAMINHOS ABANDONADOS

───────────────────────────────────────────────────────────────────────────

*Direcções técnicas, arquitecturais ou de produto que foram exploradas e descartadas.*

### II.1 — Regras específicas

- Cada caminho abandonado documenta: o que era, até onde foi, e por que parou
- O campo CONTEUDO deve incluir evidência concreta (arquivo, branch, commit, decisão)
- O campo RAZAO deve ser factual, não defensivo

### II.2 — Entradas

<!-- Prompt 2: entradas reais de caminhos abandonados
     Formato por entrada:

     ─────────────────────────────────────────────
     SA-0001 │ CAMINHO ABANDONADO │ YYYY-MM-DD
     Título: [nome]
     Contexto: [situação]
     Conteúdo: [o que foi explorado]
     Razão: [por que foi abandonado]
     Lição: [insight]
     Reestudo: [sim|não|talvez]
     Ref. Prime: [secção|nenhuma]
     ─────────────────────────────────────────────
-->

---

───────────────────────────────────────────────────────────────────────────

## III. IDEIAS PARALELAS

───────────────────────────────────────────────────────────────────────────

*Conceitos que existiram em simultâneo com a linha principal mas não foram adoptados.*

### III.1 — Regras específicas

- Ideias paralelas podem ter surgido de qualquer pioneiro ou do owner
- O campo CONTEXTO deve indicar a fase e a frente activa quando a ideia surgiu
- Ideias com REESTUDO: sim ficam automaticamente indexadas na seção VIII

### III.2 — Entradas

<!-- Prompt 2: entradas reais de ideias paralelas
     Mesmo formato SA-XXXX -->

---

───────────────────────────────────────────────────────────────────────────

## IV. VERSÕES DESCARTADAS

───────────────────────────────────────────────────────────────────────────

*Iterações anteriores de documentos, protocolos ou designs que foram substituídas.*

### IV.1 — Regras específicas

- Cada versão descartada indica: documento original, versão substituída, versão que a substituiu
- O campo RAZAO pode incluir diff conceitual (o que mudou e por quê)
- Versões descartadas de documentos soberanos (NEXUS_OS, DOC_FASE3) têm prioridade de documentação

### IV.2 — Entradas

<!-- Prompt 2: entradas reais de versões descartadas
     Mesmo formato SA-XXXX com campo adicional:
     VERSAO_ANTIGA: [referência]
     VERSAO_NOVA: [referência] -->

---

───────────────────────────────────────────────────────────────────────────

## V. MUDANÇAS DE DIRECÇÃO

───────────────────────────────────────────────────────────────────────────

*Momentos em que o sistema mudou de curso — com antes/depois documentado.*

### V.1 — Regras específicas

- Cada mudança de direcção é um ponto de inflexão do sistema
- O campo CONTEUDO deve incluir: estado antes, evento catalisador, estado depois
- Mudanças de direcção são os registros mais valiosos do Shadow Archive — máxima qualidade

### V.2 — Entradas

<!-- Prompt 2: entradas reais de mudanças de direcção
     Formato expandido:

     ─────────────────────────────────────────────
     SA-XXXX │ MUDANÇA DE DIRECÇÃO │ YYYY-MM-DD
     Título: [nome da virada]
     Antes: [como o sistema estava antes]
     Catalisador: [o que provocou a mudança]
     Depois: [como o sistema ficou depois]
     Razão: [por que a mudança era necessária]
     Lição: [insight fundamental]
     Impacto: [baixo|médio|alto|transformacional]
     Ref. Prime: [secção do Master Dossier]
     ─────────────────────────────────────────────
-->

---

───────────────────────────────────────────────────────────────────────────

## VI. ERROS FÉRTEIS

───────────────────────────────────────────────────────────────────────────

*Erros que produziram insight valioso — documentados com transparência e lição.*

### VI.1 — Regras específicas

- Erros férteis são registados sem vergonha — o valor está na lição, não no erro
- O campo LICAO é obrigatório e não pode ser genérico
- Um erro fértil pode referenciar múltiplas secções do Master Dossier

### VI.2 — Entradas

<!-- Prompt 2: entradas reais de erros férteis
     Formato:

     ─────────────────────────────────────────────
     SA-XXXX │ ERRO FÉRTIL │ YYYY-MM-DD
     Título: [nome do erro]
     Contexto: [o que estava a acontecer]
     Erro: [o que correu mal]
     Consequência: [o que aconteceu por causa do erro]
     Lição: [o que o erro ensinou]
     Aplicação: [como a lição foi aplicada]
     Ref. Prime: [secção|nenhuma]
     ─────────────────────────────────────────────
-->

---

───────────────────────────────────────────────────────────────────────────

## VII. TENTATIVAS NÃO SEGUIDAS

───────────────────────────────────────────────────────────────────────────

*Experiências ou abordagens que foram testadas e não prosseguiram.*

### VII.1 — Regras específicas

- Tentativas podem ser técnicas, organizacionais ou de processo
- O campo RAZAO distingue entre: "não funcionou", "funcionou mas não era prioridade", "foi substituída por algo melhor"
- Tentativas com potencial mantêm REESTUDO: sim

### VII.2 — Entradas

<!-- Prompt 2: entradas reais de tentativas não seguidas
     Mesmo formato SA-XXXX com campo adicional:
     RESULTADO: [não funcionou | funcionou mas não era prioridade | substituída] -->

---

───────────────────────────────────────────────────────────────────────────

## VIII. CANDIDATOS A REESTUDO

───────────────────────────────────────────────────────────────────────────

*Ideias e caminhos descartados que mantêm potencial futuro e merecem revisitação.*

### VIII.1 — Regras específicas

- Este índice é gerado automaticamente: toda entrada de seções II-VII com REESTUDO: sim aparece aqui
- A decisão de reactivar um candidato pertence ao owner ou ao Tribunal
- Cada candidato lista: ID original, título, razão do potencial, condição de reactivação

### VIII.2 — Índice de candidatos

<!-- Prompt 2: índice gerado a partir das entradas com REESTUDO: sim

     | ID | Título | Tipo | Potencial | Condição de reactivação |
     |---|---|---|---|---|
     | SA-XXXX | ... | ... | ... | ... |
-->

---

───────────────────────────────────────────────────────────────────────────

## A. ÍNDICE CRONOLÓGICO

───────────────────────────────────────────────────────────────────────────

*Todas as entradas em ordem temporal — visão panorâmica da evolução do percurso.*

<!-- Prompt 2: índice cronológico completo

     | # | ID | Data | Tipo | Título | Reestudo |
     |---|---|---|---|---|---|
     | 1 | SA-0001 | ... | ... | ... | ... |
-->

---

───────────────────────────────────────────────────────────────────────────

## B. METADADOS E SELO

───────────────────────────────────────────────────────────────────────────

```
══════════════════════════════════════════════════════════════════════════
  Codex Tangibilis: Umbra │ v1.0 (estrutura) │ 2026-03-21
  Eternal Nexus — Shadow Archive
  Branch: claude/expose-workspace-config-yt4Km
  Estado: ESTRUTURA PRONTA — aguardando Prompt 2 para entradas
  Família visual: ct.* (Codex Tangibilis Design Language)
  Base: Aether Spine + extensão tangível
  Governança: docs/MASTER_DOSSIER_SYSTEM.md
  Relação: arquivo sombra do MASTER_DOSSIER.md — separado por design
  Total de entradas: 0 (estrutura vazia — aguardando conteúdo)
══════════════════════════════════════════════════════════════════════════
```

---

*SHADOW_ARCHIVE.md v1.0 (estrutura) — 2026-03-21 | Cursor | MASTER-DOSSIER-SYSTEM-001*
*Codex Tangibilis: Umbra — arquivo sombra do Eternal Nexus*
*Pronto para Prompt 2 — preenchimento de entradas reais*
