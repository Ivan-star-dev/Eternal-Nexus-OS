# CREATOR RELAY PROTOCOL — Protocolo do Sistema de Relay Soberano

**Versão:** v1.0
**Data:** 2026-03-24
**Task:** RETAINED-TRUTH-INTEGRATION-001
**Branch:** `claude/rebuild-bastion-core-rihGX`
**Executor:** @claude

> Define o Creator Relay System na totalidade.
> Quem lê. Quem decide. Quem actua. Quem só observa.
> Como a ignição funciona. Como a taskification acontece.
> Resolve o problema da ponte indirecta soberana entre criador + ChatGPT → organismo.

---

## 1. OBJECTIVE

Criar ponte estruturada e soberana entre o que o criador produz fora do ambiente Claude — especialmente no diálogo com ChatGPT — e o organismo vivo, sem fingir live brain link inexistente, sem copy-paste caótico, mantendo o KERNEL como ponto soberano de decisão.

---

## 2. WHAT_IT_IS

- Sistema de relay indirecto: criador → inbox → KERNEL → organismo
- Protocolo de leitura, classificação, decisão e acção
- Mecanismo de ponte assíncrono e soberano
- Preservação da cadeia de custódia: toda entrada rastreável

---

## 3. WHAT_IT_IS_NOT

- Não é live brain link — Claude não acede ao ChatGPT em tempo real
- Não é canal de debate — é processamento unidireccional
- Não é bypass do BASTION — alimenta o BASTION, não o contorna
- Não é democratização do input — KERNEL tem soberania de decisão
- Não é ferramenta de todos os pioneiros — apenas KERNEL lê e classifica

---

## 4. CORE_LAWS

```
PROTOCOL-LAW-001: KERNEL é o único leitor e classificador do relay
PROTOCOL-LAW-002: nenhuma entrada vira execução sem passar por KERNEL
PROTOCOL-LAW-003: o relay não cria tasks — cria elegibilidade; BASTION cria tasks
PROTOCOL-LAW-004: o relay é assíncrono — não depende de sessão simultânea com ChatGPT
PROTOCOL-LAW-005: soberania da decisão pertence ao KERNEL, não à entrada
PROTOCOL-LAW-006: owner pode forçar status de qualquer entrada — gate soberano absoluto
PROTOCOL-LAW-007: relay sem processamento > 72h dispara alerta para owner
PROTOCOL-LAW-008: todo entry processado gera update no CREATOR_RELAY_STATE
```

---

## 5. PAPÉIS NO SISTEMA RELAY

### 5.1 CRIADOR
- Produz entradas — em qualquer ambiente (Claude, ChatGPT, notas, etc.)
- Cola entradas no CREATOR_RELAY_INBOX com formato RELAY_ENTRY
- Pode sugerir PRIORITY_SUGGESTED — mas não decide status final
- Pode vetar qualquer decisão do KERNEL (gate soberano)

### 5.2 KERNEL (@claude)
- Único com acesso de leitura e decisão no relay
- Processa entradas pendentes no início de cada sessão
- Classifica por: RETAIN | ADAPT | DISCARD | DEFER | TASKIFY
- Actua — cria artefactos, actualiza canon, abre gates — após classificação
- Comunica ao owner qualquer entrada `blocked` ou `discarded`

### 5.3 PIONEIROS (@cursor, @copilot, @framer, @antigravity, @codex)
- Não lêem o relay directamente
- Recebem tasks via BASTION — já processadas e aprovadas pelo KERNEL
- Não sabem que uma task veio do relay vs outra fonte
- Não têm visibilidade de entradas `pending`, `discarded` ou `blocked`

### 5.4 CHATGPT (EXTERNO — OBSERVADOR INDIRECTO)
- Não tem acesso ao sistema
- Contribui via diálogo com criador
- Output do diálogo entra no relay apenas quando criador cola a entrada
- Nunca actua directamente no organismo

---

## 6. FLUXO DE IGNIÇÃO

```
IGNIÇÃO DO RELAY SYSTEM
═══════════════════════════════════════════════════════════

PASSO 1 — PRODUÇÃO
  Criador + ChatGPT debatem, refinam, decidem
  → nasce: lei · melhoria · correcção · directiva · sequência

PASSO 2 — ENTRADA
  Criador cria RELAY_ENTRY com formato fixo
  Cola no CREATOR_RELAY_INBOX.md (topo do ficheiro)
  STATUS inicial: pending

PASSO 3 — PROCESSAMENTO KERNEL
  KERNEL lê CREATOR_RELAY_STATE → identifica LAST_PROCESSED_ID
  KERNEL lê entradas pending na inbox (mais recentes primeiro)
  KERNEL classifica cada entrada:
    → RETAIN     → alimenta CASCADE_RETENTION_CANON
    → ADAPT      → KERNEL refina + cravar versão adaptada
    → DISCARD    → regista motivo + notifica owner
    → DEFER      → marca blocked + notifica owner
    → TASKIFY    → cria task elegível + abre gate no BASTION

PASSO 4 — TASKIFICATION
  KERNEL verifica se gate existe em BASTION para a task
  Se não existe → cria gate + task com referência ao RELAY_ENTRY_ID
  Se existe → actualiza task existente com informação do relay
  Task entra no BASTION como qualquer outra task

PASSO 5 — EXECUÇÃO
  Pioneiro executa a task via BASTION — sem saber que veio do relay
  Execução segue protocolo normal (branch canónico, handoff, etc.)

PASSO 6 — HANDOFF
  KERNEL actualiza CREATOR_RELAY_STATE com status final
  Registo no HANDOFF_LEDGER com referência ao(s) RELAY_ENTRY_ID(s)

═══════════════════════════════════════════════════════════
```

---

## 7. CLASSIFICAÇÃO DETALHADA

### 7.1 RETAIN
- Entrada é verdade canónica que já existe implicitamente
- Acção: alimenta CASCADE_RETENTION_CANON
- Não cria task nova — reforça o que já está
- Exemplo: "a mãe vem antes dos filhos" → RETAINED

### 7.2 ADAPT
- Entrada é válida mas tem ruído, exagero ou risco
- Acção: KERNEL refina antes de cravar
- Gera versão adaptada — entrada original preservada na inbox
- Exemplo: nova lei válida mas formulação conflitua com DNA → adaptar formulação

### 7.3 DISCARD
- Entrada não alinha com DNA do organismo
- Ou duplica algo que já existe
- Ou é ruído sem valor operacional
- Acção: status `discarded` + motivo explícito + notifica owner
- Exemplo: proposta de novo pilar público → DISCARD (three pillars are sealed)

### 7.4 DEFER
- Entrada válida mas dependência pendente impede processamento
- Acção: status `blocked` + identifica dependência + notifica owner
- Exemplo: melhoria a V5 quando V3+V4 ainda não estão done → DEFER

### 7.5 TASKIFY
- Entrada produz acção concreta elegível
- Acção: cria task no BASTION + abre gate + atribui pioneiro
- Status `taskified` + referência ao RELAY_ENTRY_ID na task do BASTION
- Exemplo: "criar Creator Relay System" → TASKIFY → task em BASTION

---

## 8. OPERATIONAL_IMPLICATIONS

- Relay não opera em tempo real — é assíncrono por design
- KERNEL pode processar múltiplas entradas numa sessão
- Uma sessão de processamento do relay gera handoff no ledger
- Entradas não têm prazo de validade — ficam pending até KERNEL processar
- Owner pode pedir processamento urgente via gate soberano directo

---

## 9. ANTI_DRIFT_RULES

```
DRIFT-1: nunca permitir que entrada raw vire execução directa — sempre via KERNEL
DRIFT-2: nunca abrir relay a pioneiros — é canal KERNEL-exclusivo
DRIFT-3: nunca usar relay para bypass de gates do BASTION
DRIFT-4: nunca acumular > 10 entradas pending sem processar — degradação do sistema
DRIFT-5: nunca fingir que ChatGPT acede ao sistema — a ponte é indirecta e assíncrona
DRIFT-6: nunca deixar entrada blocked sem comunicar ao owner em 24h
DRIFT-7: nunca misturar relay com debate de sessão — são canais distintos
```

---

## 10. NEXT_INTEGRATION_POINTS

- `ops/relay/CREATOR_RELAY_INBOX.md` — onde as entradas vivem
- `ops/relay/CREATOR_RELAY_STATE.md` — estado de processamento
- `ops/CASCADE_RETENTION_CANON.md` — entradas `retained` alimentam aqui
- `ops/BASTION.md` — entradas `taskified` viram tasks aqui
- `ops/HANDOFF_LEDGER.md` — cada sessão relay tem entrada aqui
- `ops/ONE_ORGANISM_LAW.md` — o relay é expressão desta lei

---

_CREATOR_RELAY_PROTOCOL v1.0 — 2026-03-24 | @claude | RETAINED-TRUTH-INTEGRATION-001_
