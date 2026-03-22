# NEXUS LIVE FABRIC — Definição Canônica

**Versão:** v1 — primeira camada
**Data:** 2026-03-20
**Fase:** Fase 3 — Governança e Auditabilidade
**Branch:** `claude/expose-workspace-config-yt4Km`
**Modelo:** claude-sonnet-4-6
**Task:** E17

> O Nexus Live Fabric (NLF) é o tecido operacional vivo do Eternal Nexus OS.
> Ele não é a soberania — ele serve a soberania.
> Registra, organiza, propõe e encaminha. Nunca decide sozinho.

---

## 1. O QUE É

O NLF é a camada operacional viva que transforma o protocolo estático em estado observável em tempo real.

**Função:** dar ao sistema a capacidade de responder, a qualquer momento:
- Qual é o estado atual do sistema?
- Quem está ativo e em qual frente?
- Qual é a fila de cada executor?
- Qual foi o último handoff emitido?
- O que entra a seguir e por quê?

**Não é:**
- Uma reescrita do NEXUS_OS
- Uma camada de automação sem trava
- Um substituto do Tribunal ou do owner
- Uma fonte de decisão autônoma

---

## 2. SOBERANIA

O NLF opera **abaixo** da soberania do protocolo.

| Operação | Quem decide |
|---|---|
| Mudar uma lei fundamental | Owner + Tribunal |
| Mudar o protocolo canônico | Owner + Tribunal |
| Atualizar o estado vivo | Pioneiro ao emitir handoff |
| Atualizar a fila | Pioneiro ou owner |
| Registrar um handoff | Pioneiro que conclui a task |
| Propor uma transição | NLF registra a proposta; Tribunal ou owner aprova |

**Regra inviolável:** O NLF nunca edita `docs/NEXUS_OS.md`, `docs/DOC_FASE3.md` nem nenhum documento soberano por conta própria. Qualquer proposta de mudança canônica passa pelo Tribunal.

---

## 3. ESTRUTURA DO NLF

O NLF consiste de 3 arquivos vivos em `ops/`:

| Arquivo | Conteúdo | Atualizado por |
|---|---|---|
| `ops/LIVE_STATE.md` | Estado atual do sistema, fila viva por executor, estado de canalização | Pioneiro ao emitir handoff |
| `ops/HANDOFF_LEDGER.md` | Ledger cronológico de todos os handoffs emitidos | Pioneiro ao emitir handoff |
| `ops/NLF.md` | Este documento — definição, soberania, transições, regras | Só com aprovação do Tribunal |

---

## 4. REGRAS DE TRANSIÇÃO

Quando atualizar cada arquivo:

### LIVE_STATE.md
- **Quando:** ao final de qualquer sessão que emita um handoff
- **Quem:** o pioneiro que encerra a sessão
- **O que muda:** estado atual, fila do executor, estado de canalização
- **O que não muda:** definições, regras, protocolos

### HANDOFF_LEDGER.md
- **Quando:** ao emitir qualquer handoff formal
- **Quem:** o pioneiro que emite o handoff
- **Formato:** entrada nova no topo (nunca editar entradas existentes)
- **Regra:** o ledger é append-only — sem edição retroativa

### NLF.md (este documento)
- **Quando:** nunca por conta de uma sessão operacional
- **Quem:** só via Tribunal ou instrução explícita do owner
- **Motivo:** é a definição canônica — mudá-la requer julgamento

---

## 5. COMO OS PIONEIROS ALIMENTAM E CONSOMEM O NLF

### Claude — Abridor de Caminho
- **Alimenta:** ao final de cada task, atualiza `LIVE_STATE.md` com estado atual e próximo passo
- **Alimenta:** registra entrada no `HANDOFF_LEDGER.md`
- **Consome:** lê `LIVE_STATE.md` ao iniciar nova sessão para confirmar frente ativa e fila

### Codex — Refinador Técnico
- **Alimenta:** atualiza sua linha na fila viva ao receber ou concluir uma camada
- **Alimenta:** registra handoff de refinamento no ledger
- **Consome:** lê fila de Codex em `LIVE_STATE.md` para saber qual camada refinar

### Copilot — Lapidador
- **Alimenta:** atualiza sua linha na fila ao receber ou concluir lapidação
- **Alimenta:** registra handoff de lapidação no ledger
- **Consome:** lê fila de Copilot em `LIVE_STATE.md` para saber qual camada lapidar

**Regra comum:** Todo pioneiro que lê o NLF ao iniciar uma sessão e não encontra o estado esperado deve **parar e emitir alerta** — não agir sobre estado desconhecido.

---

## 6. RELAÇÃO COM O PROTOCOLO EXISTENTE

| Protocolo | Relação com o NLF |
|---|---|
| `docs/NEXUS_OS.md` | Soberano acima do NLF — NLF serve o NEXUS_OS |
| `docs/DOC_FASE3.md` | Define o escopo — NLF opera dentro dele |
| Handoff blueprint | NLF formaliza o registro dos handoffs em ledger cronológico |
| Semáforo | NLF reflete o estado do semáforo em LIVE_STATE |
| Tribunal | Tribunal decide o que muda no canon; NLF registra decisões |
| Bulking em escada | LIVE_STATE rastreia em qual camada cada pioneiro está |
| Micro Team | Futura entrada na fila viva — slot reservado na seção 2 de LIVE_STATE |
| IGNIÇÃO_ATIVA | Modo operacional contínuo — registado no semáforo do LIVE_STATE; o NLF é o tecido sobre o qual a ignição corre |

---

## 7. MODO DE IGNIÇÃO — RELAÇÃO COM O NLF

**Registrado por instrução explícita do owner | OPS-IGNITION-001 | 2026-03-20**

O modo IGNIÇÃO_ATIVA não altera a soberania do NLF.
Opera **dentro** do tecido vivo — não sobre ele.

```
NLF define:     o que o sistema é e como os artefatos vivos se relacionam
IGNITION define: como os pioneiros se movem continuamente dentro do NLF
AUTOFLOW define: como cada pioneiro age ao terminar uma task
```

O estado da ignição (`IGNIÇÃO: ATIVA / PAUSADA / PARADA`) vive no semáforo
do `ops/LIVE_STATE.md` — que é um dos 3 artefatos vivos do NLF.

**Regra de soberania preservada:**
> A ignição nunca altera definições canônicas do NLF.
> A ignição nunca substitui o Tribunal ou o owner em decisões soberanas.
> A ignição para se qualquer passo exigir atravessar uma Red Line ou Lei Absoluta.

Ver `ops/IGNITION.md` — definição completa do modo de ignição contínua.

---

*NLF v1 — implantado em 2026-03-20 | claude-sonnet-4-6 | E17 | Fase 3*
*NLF v1.1 — seção 7 adicionada em 2026-03-20 | claude-sonnet-4-6 | OPS-IGNITION-001 | instrução explícita do owner*
---

## 8. PIONEER MATRIX — PAPÉIS NO TECIDO VIVO

**Registrado por instrução explícita do owner | NEXUS-PIONEER-ROLE-MOTHER-001 | 2026-03-21**

O NLF é alimentado e consumido por 6 pioneiros. Cada um tem papel distinto no tecido vivo.

### Como cada pioneiro alimenta o NLF

| Pioneiro | Alimenta | Consome |
|---|---|---|
| **@claude** | LIVE_STATE (estado atual, fila, semáforo) + HANDOFF_LEDGER | LIVE_STATE (sua fila) + BASTION + HANDOFF_LEDGER (últimas 2) |
| **@copilot** | LIVE_STATE (sua fila) + HANDOFF_LEDGER | LIVE_STATE (sua fila) + HANDOFF_LEDGER (último handoff de @claude) |
| **@codex** | LIVE_STATE (sua fila + consolidação de onda) + HANDOFF_LEDGER | LIVE_STATE (seção 1 + todas as filas) + BASTION (visão geral) |
| **@cursor** | LIVE_STATE (sua fila + bloqueios resolvidos) + HANDOFF_LEDGER | LIVE_STATE (seção 4 — bloqueios) + sua fila |
| **@framer** | LIVE_STATE (sua fila) + HANDOFF_LEDGER | LIVE_STATE (sua fila WorkVisual) |
| **@antigravity** | LIVE_STATE (sua fila) + HANDOFF_LEDGER | LIVE_STATE (sua fila WorkVisual) |

### Os dois espaços que governam o NLF

```
CREATOR SPACE  → owner orienta, abre gates, define visão
               → pioneiro fala com o criador; não está a executar BASTION task
               → NLF regista gates abertos pelo owner

BASTION SPACE  → pioneiro executa task elegível no BASTION
               → NLF regista o estado de execução
               → LIVE_STATE é atualizado ao encerrar

Só existem estes dois espaços.
Quando um pioneiro não está no Bastion Space, está no Creator Space.
```

### Regra de soberania expandida

> O NLF nunca decide qual espaço um pioneiro ocupa.
> O owner abre o gate — o BASTION regista — o pioneiro entra.
> Sem gate, o pioneiro está no Creator Space — não no Bastion Space.

**Referência completa:** `ops/PIONEER_MATRIX.md`

---

*NLF v1 — implantado em 2026-03-20 | claude-sonnet-4-6 | E17 | Fase 3*
*NLF v1.1 — seção 7 adicionada em 2026-03-20 | claude-sonnet-4-6 | OPS-IGNITION-001 | instrução explícita do owner*
*NLF v1.2 — seção 8 adicionada em 2026-03-21 | claude-sonnet-4-6 | NEXUS-PIONEER-ROLE-MOTHER-001 | instrução explícita do owner*
