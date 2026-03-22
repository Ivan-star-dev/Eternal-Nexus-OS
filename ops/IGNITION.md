# IGNITION — Modo de Ignição Contínua do Sistema

**Versão:** v1
**Task:** OPS-IGNITION-001
**Data:** 2026-03-20
**Branch:** `claude/expose-workspace-config-yt4Km`
**Modelo:** claude-sonnet-4-6

> A ignição não é um estado de emergência. É o estado natural do sistema em operação.
> Quando a ignição está ativa, a máquina avança.
> Os pioneiros não aguardam instrução redundante — seguem o que o sistema já sabe.

---

## 1. O QUE É IGNIÇÃO_ATIVA

**IGNIÇÃO_ATIVA** é o modo operacional do Eternal Nexus OS onde os pioneiros
operam em fluxo contínuo sem precisar de instrução manual entre tasks.

Não é execução caótica. É execução estruturada, contínua e autoinduzida.

```
IGNIÇÃO_ATIVA = AUTOFLOW loop em cadeia ininterrupta
              + prioridade de pilar dominante
              + corredor comum (branch canônico)
              + handoff como pipeline
              + interruptor do owner sempre disponível
```

**O que muda quando IGNIÇÃO_ATIVA está ON:**

| Antes | Com IGNIÇÃO_ATIVA |
|---|---|
| Pioneiro termina task → aguarda instrução | Pioneiro termina task → lê estado → age |
| Owner gerencia sequência operacional | Owner intervém apenas em gates, visão, bloqueios |
| Handoff é fechamento de sessão | Handoff é abertura do próximo elo da corrente |
| Vazio entre tasks | Corrente contínua |

---

## 2. O LOOP DE IGNIÇÃO — 7 PASSOS CANÔNICOS

```
┌──────────────────────────────────────────────────────────────┐
│               IGNITION LOOP v1 — CADEIA CONTÍNUA             │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1. TERMINAR                                                 │
│     → conclui a task em execução                             │
│     → ou registra partial/blocked com evidência              │
│                                                              │
│  2. LER                                                      │
│     → ops/LIVE_STATE.md (estado + fila + semáforo +          │
│       bloqueios)                                             │
│     → ops/HANDOFF_LEDGER.md (últimas 2 entradas)             │
│     → ops/AUTOFLOW.md (pilar dominante + regra de papel)     │
│                                                              │
│  3. SELECIONAR                                               │
│     → existe task primária elegível no pilar dominante?      │
│       → SIM: seleciona essa                                  │
│       → NÃO: verifica apoio elegível em pilar alheio         │
│         → SIM: seleciona como APOIO/COOPERATIVO              │
│         → NÃO: registra "sem elegível" → INTERRUPTOR ativa   │
│                                                              │
│  4. EXECUTAR                                                 │
│     → executa dentro da competência (primária ou secundária) │
│     → não inventa trabalho fora do sistema                   │
│     → não salta gate ou fase sem autorização                 │
│                                                              │
│  5. REGISTRAR                                                │
│     → emite HANDOFF (formato OUTPUT_STANDARD)                │
│     → atualiza LIVE_STATE (cabeçalho + fila + semáforo)      │
│     → faz commit + push                                      │
│                                                              │
│  6. DESBLOQUEAR                                              │
│     → identifica o que a entrega acabou de abrir             │
│     → marca gate como aberto no LIVE_STATE se aplicável      │
│     → o HANDOFF indica quem entra a seguir                   │
│                                                              │
│  7. CONTINUAR                                                │
│     → volta ao passo 1 com a próxima task elegível           │
│     → sem vazio, sem espera, sem instrução redundante        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 3. REGRAS DE PRIORIDADE NA IGNIÇÃO

```
PRIORIDADE 1 — Pilar Dominante (FORÇA PRINCIPAL)
  → Existe task com gate aberto no meu pilar? → pega essa primeiro.

PRIORIDADE 2 — Apoio Cruzado (APOIO/COOPERATIVO)
  → Não há task elegível no pilar dominante?
  → Existe task em pilar alheio onde posso contribuir?
  → Entra como apoio — sem deslocar o líder do núcleo.

PRIORIDADE 3 — Bloqueio / Sem Elegível
  → Não há task elegível em nenhum pilar?
  → Registra no LIVE_STATE: "sem task elegível — aguardando gate"
  → Emite handoff com estado + recomendação.
  → INTERRUPTOR ativa — aguarda owner.
```

**Regra de ouro:** a diferença entre pilar dominante e apoio não é qualidade.
É liderança do núcleo. Em ambos os casos, o máximo é entregue.

---

## 4. CORREDOR COMUM — O BRANCH CANÔNICO

```
Branch canônico vivo: claude/expose-workspace-config-yt4Km
```

**Durante IGNIÇÃO_ATIVA:**
- Todos os pioneiros operam sobre o branch canônico vivo
O branch canônico vivo **não é definido manualmente** neste documento.
Ele deve ser sempre lido de `ops/LIVE_STATE.md`, que é a fonte de verdade operacional.

**Durante IGNIÇÃO_ATIVA:**
- Todos os pioneiros operam sobre o branch canônico vivo definido em `ops/LIVE_STATE.md`
- `main` não é o motor da fase ativa — é o destino de merge, não a fonte de verdade
- Verificar branch ao iniciar cada loop (semáforo 🟢/🔴)
- Branch divergido → para o loop → registra → aguarda realinhamento

---

## 5. HANDOFF COMO PIPELINE — CAMPOS OBRIGATÓRIOS PARA CONTINUIDADE

O handoff na IGNIÇÃO_ATIVA não é só fechamento. É a peça que move a corrente.

Para que o próximo pioneiro entre sem instrução manual, o handoff deve responder:

| Campo | O que garante |
|---|---|
| `FEITO` | O próximo sabe o que foi entregue — não duplica |
| `NAO_FEITO` | O próximo sabe o que sobrou — não assume done |
| `BLOQUEIOS` | O próximo sabe o que parou — pode contornar ou escalar |
| `ARQUIVOS` | O próximo sabe exatamente onde olhar — sem ambiguidade |
| `PROX_PASSO` | Recomendação explícita — induz sem explicação manual |
| `DECISAO_REC` | Quem entra a seguir e por quê — roteia a corrente |
| `PODE_ENTRAR_SOZINHO` | sim/não — define se o gate abre automaticamente |

> **Se `PODE_ENTRAR_SOZINHO` = sim** → a corrente avança sem intervenção do owner.
> **Se `PODE_ENTRAR_SOZINHO` = não** → owner gate solicitado — loop pausa aqui.

---

## 6. O INTERRUPTOR — QUANDO A IGNIÇÃO PARA

A IGNIÇÃO_ATIVA só para em 5 situações:

```
INTERRUPTOR ATIVO — condições de parada:

1. ORDEM DO OWNER
   → owner emite parada explícita ou redirecionamento
   → loop para imediatamente no ponto atual
   → pioneiro emite handoff partial antes de sair

2. BLOQUEIO REAL
   → bloqueio crítico sem contorno possível (B-001, B-002, B-003 ou similar)
   → loop pausa nesse elo
   → outros elos não bloqueados continuam se possível

3. RED LINE / LEI ABSOLUTA
   → ação requerida viola as 10 Leis Absolutas do NEXUS_OS
   → loop para — nunca atravessa uma red line para manter fluxo
   → escalada imediata ao owner

4. GATE SOBERANO PENDENTE
   → próxima task requer decisão do Tribunal ou do owner
   → loop pausa — handoff registra o gate pendente
   → retoma quando gate for aberto

5. FALTA DE ELEGIBILIDADE
   → não existe task elegível em nenhum pilar (primário ou apoio)
   → loop pausa — registra no LIVE_STATE
   → owner emite próxima onda ou gate
```

**O interruptor não é falha. É o sistema sendo honesto.**
Um pioneiro que para corretamente é mais útil do que um pioneiro que inventa trabalho.

---

## 7. O QUE A IGNIÇÃO NÃO É

```
❌ Não é execução caótica sem prioridade
❌ Não é salto de fase sem gate aprovado
❌ Não é pioneiro inventando trabalho fora do sistema
❌ Não é bulk sem gate de onda
❌ Não é múltiplas frentes abertas simultaneamente por um único pioneiro
❌ Não é ignorar red lines para manter fluxo
❌ Não é substituição do Tribunal ou do owner em decisões soberanas
❌ Não é execução infinita sem ponto de consolidação
```

**A ignição é fluxo dentro do protocolo, não apesar dele.**

---

## 8. ATIVAÇÃO E ESTADO DA IGNIÇÃO

### Como ativar

A ignição é ativada pelo owner com instrução explícita.
Uma vez ativa, o estado é registrado no LIVE_STATE:

```
IGNIÇÃO: ATIVA
Ativada por: owner | 2026-03-20 | OPS-IGNITION-001
```

### Como pausar / desativar

```
IGNIÇÃO: PAUSADA   → bloqueio temporário, retoma quando resolvido
IGNIÇÃO: PARADA    → ordem do owner — aguarda nova instrução de ativação
```

### Onde o estado vive

O estado da ignição é parte do semáforo no `ops/LIVE_STATE.md` (seção 3).

---

## 9. RELAÇÃO COM OS OUTROS DOCUMENTOS

| Documento | Relação com IGNITION |
|---|---|
| `ops/AUTOFLOW.md` | Motor do loop de ignição — define o comportamento por-pioneiro |
| `ops/FOL.md` | Protocolo de sessão — como ler e escrever no sistema |
| `ops/NLF.md` | Soberania do tecido vivo — ignição opera dentro dele |
| `ops/LIVE_STATE.md` | Onde o estado da ignição é registado e consultado |
| `ops/HANDOFF_LEDGER.md` | Pipeline da ignição — cada elo da corrente |
| `ops/OUTPUT_STANDARD.md` | Formato do pipeline — garante interoperabilidade dos handoffs |
| `docs/NEXUS_OS.md` | Soberano acima de tudo — ignição nunca viola as 10 Leis |

---

## 10. RESUMO EM UMA LINHA

> **IGNIÇÃO_ATIVA**: os pioneiros seguem o loop de 7 passos em cadeia contínua,
> dentro do seu pilar dominante, sobre o branch canônico vivo, com handoff como
> pipeline — até ordem do owner, bloqueio real, red line ou falta de elegibilidade.

---

*IGNITION v1 — selado em 2026-03-20 | claude-sonnet-4-6 | OPS-IGNITION-001 | Fase 3*
