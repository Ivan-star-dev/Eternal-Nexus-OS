# WORKTREE ALIASES — Aliases Operacionais dos Territórios do Sistema

**Versão:** v1
**Task:** OPS-WORKTREE-ALIAS-001
**Data:** 2026-03-20
**Branch:** `claude/expose-workspace-config-yt4Km`
**Modelo:** claude-sonnet-4-6

> Aliases operacionais para uso diário no protocolo, prompts e handoffs.
> Os nomes técnicos/legados continuam como referência interna quando necessário.
> O owner opera olhando para três territórios claros — não para strings técnicas.

---

## 1. OS TRÊS ALIASES OPERACIONAIS

| Alias Operacional | Território | Significado |
|---|---|---|
| **WorkStructure** | Estrutura, base, governança, sustentação | O que segura tudo: arquitetura, configuração, protocolo operacional, documentação canônica, infra de base |
| **WorkFunction** | Funcionalidade, integração, comportamento, produto vivo | O que faz o sistema funcionar: features, APIs, lógica de negócio, integrações, fluxos de produto |
| **WorkVisual** | Design, UI, UX, identidade, apresentação | O que o mundo vê: interfaces, componentes visuais, estilo, experiência do utilizador, identidade pública |

---

## 2. REGRAS DE USO

```
1. PROMPTS E HANDOFFS
   → usar WorkStructure / WorkFunction / WorkVisual como referência de território
   → não é obrigatório citar nome técnico em cada prompt diário

2. DOCUMENTAÇÃO OPERACIONAL (LIVE_STATE, HANDOFF_LEDGER, FOL)
   → aliases são válidos em qualquer campo de território, frente ou área
   → nome técnico pode aparecer como nota adicional quando for necessária rastreabilidade

3. NOMES TÉCNICOS LEGADOS
   → continuam existindo como referência interna
   → não foram removidos nem renomeados no Git nesta task
   → valem para rastreabilidade de histórico e branch real

4. O QUE NÃO MUDA
   → o branch canônico vivo (corredor comum do sistema)
   → a matrix de pilar dominante dos pioneiros (Estrutura+Produto / Qualidade / Lapidação / Mecânico)
   → as regras de competência primária e secundária dos pioneiros
   → nenhuma referência técnica já existente nos arquivos ops/
```

---

## 3. RELAÇÃO COM A MATRIX DE PILAR DOMINANTE

Os aliases de território são **ortogonais** à matrix de pilar dos pioneiros.
São dois sistemas de linguagem diferentes:

| Sistema | Foco | Exemplos |
|---|---|---|
| **Pilar dominante** (AUTOFLOW) | Competência do pioneiro | Estrutura+Produto (@claude), Qualidade (@codex), Lapidação (@copilot), Mecânico (@cursor) |
| **Alias de território** (este doc) | Área do trabalho | WorkStructure, WorkFunction, WorkVisual |

Uma task em WorkFunction pode ser liderada por @claude (pilar Estrutura+Produto)
e ter apoio de @codex (pilar Qualidade). O território não determina o pioneiro —
a matrix de pilar é que define quem lidera o núcleo.

---

## 4. EXEMPLOS DE USO NO PROTOCOLO

**No semáforo:**
```
WORKTREE: WorkStructure
```

**Em handoffs:**
```
FRENTE: WorkFunction / autenticação OAuth
TERRITORIO: WorkVisual / design system tokens
```

**Em CANALIZACAO_TABLE:**
```
WORKTREE: WorkStructure (wt-estrutura-nucleo-vivo)
```

**Em prompts do owner ao chamar um pioneiro:**
```
"@copilot — WorkVisual — lapida os tokens de cor no design system"
"@claude — WorkFunction — implementa a rota de webhook da Stripe"
"@codex — WorkStructure — analisa a cobertura de tipos nas interfaces canônicas"
```

---

## 5. GLOSSÁRIO DE REFERÊNCIA RÁPIDA

```
WorkStructure = o que sustenta    → base, protocolo, governança, docs, infra
WorkFunction  = o que funciona    → produto, features, integrações, comportamento
WorkVisual    = o que aparece     → UI, UX, design, identidade, apresentação
```

---

---

## 6. REGRA DOS 3 CHATS — ORIENTAÇÃO DO OWNER

**Registrado em:** NEXUS-PIONEER-ROLE-MOTHER-001 | 2026-03-21

O owner opera com **3 chats-base** — um por território.

```
CHAT 1: WorkStructure   → o que sustenta (protocolo, base, governança, docs canônicos)
CHAT 2: WorkFunction    → o que funciona (features, produto, APIs, comportamento)
CHAT 3: WorkVisual      → o que aparece  (UI, UX, design, identidade, motion)
```

### Triagem de qualquer task nova

```
Task produz doc / protocolo / config / infra?    → WorkStructure
Task produz feature / fluxo / dado / integração? → WorkFunction
Task produz design / UI / visual / identidade?   → WorkVisual
```

### Convenção de convocação

```
"@pioneiro — [território] — [task resumida]"

Exemplos:
"@claude — WorkStructure — cravar protocolo de consolidação"
"@cursor — WorkFunction — implementa rota de webhook"
"@copilot — WorkStructure — lapida DNA Protocol seção 7"
"@framer — WorkVisual — constrói card de ativo"
"@antigravity — WorkVisual — anima hero da landing"
"@codex — WorkStructure — consolida onda BASTION 2.0"
```

### O chat pertence ao território, não ao pioneiro

```
WorkStructure: @claude / @copilot / @codex conforme task
WorkFunction:  @cursor / @claude / @codex conforme task
WorkVisual:    @framer / @antigravity / @copilot conforme task
```

---

## 7. APLICAÇÃO DUPLA — ECOSSISTEMA E PRODUTO

```
O mesmo DNA governa a máquina interna e o produto.

ECOSSISTEMA               PRODUTO
WorkStructure:            WorkStructure:
  infra, CI/CD, config,     data model, schema,
  protocolos, docs canon    arquitetura, auth, base

WorkFunction:             WorkFunction:
  automações, integrações   features, fluxos,
  internas, APIs            dados de mercado, portfólio

WorkVisual:               WorkVisual:
  docs visuais, identidade  dashboard, UI/UX,
  interna, apresentações    componentes, identidade pública
```

**Referência completa:** `ops/PIONEER_MATRIX.md`

---

*WORKTREE_ALIASES v1 — selado em 2026-03-20 | claude-sonnet-4-6 | OPS-WORKTREE-ALIAS-001*
*WORKTREE_ALIASES v1.1 — seções 6 e 7 adicionadas em 2026-03-21 | claude-sonnet-4-6 | NEXUS-PIONEER-ROLE-MOTHER-001*
