---
title: "Protocol Task Force"
slug: protocol-task-force
date: 2026-03-20
category: protocol
excerpt: "Task force protocol — rapid execution unit."
---

# PROTOCOLO — FORÇA-TAREFA

> Documento canônico. Protocolo operacional para ativação e gestão de forças-tarefa no ecossistema.

---

## 1. ESSÊNCIA

Uma força-tarefa é uma formação temporária de agentes e recursos convocada para resolver um problema específico de forma focada, ordenada e com closure formal.

**Força-tarefa não é:**
- Reunião de brainstorming.
- Trabalho paralelo sem coordenação.
- Operação permanente sem closure definido.

**Força-tarefa é:**
- Mobilização cirúrgica com objetivo, escopo e prazo.
- Protocolo com início, ordem de ataque e estado de fechamento canônico.

---

## 2. QUANDO ATIVAR

| Gatilho | Ação |
|---------|------|
| Problema simples e isolado | Não ativar — resolver diretamente |
| Problema médio com 2-3 componentes afetados | Força-tarefa leve (1-2 agentes) |
| Problema complexo com múltiplos sistemas afetados | Força-tarefa seletiva (3-5 agentes, roles definidos) |
| Problema sistêmico que afeta arquitetura ou identidade | Força-tarefa máxima (todos os agentes necessários + arquiteto soberano) |

**Regra geral:** se o problema pode ser resolvido por um agente em uma sessão sem afetar outros sistemas, não ative força-tarefa.

---

## 3. ESTRUTURA OBRIGATÓRIA

Toda força-tarefa deve declarar os seguintes campos antes de iniciar operação:

### 3.1 Objetivo
Declaração de uma frase do que a força-tarefa deve entregar ao encerrar. Deve ser mensurável.

### 3.2 Escopo
Lista explícita do que está dentro do escopo de atuação. O que pode ser tocado, modificado ou decidido.

### 3.3 Fora do Escopo
Lista explícita do que não pode ser tocado. Limita deriva e conflito entre agentes.

### 3.4 Papéis
| Papel | Responsabilidade |
|-------|-----------------|
| Arquiteto de Missão | Define objetivo, escopo, ordena ataque e valida closure |
| Agente Executor | Executa tarefas dentro do escopo definido |
| Auditor | Valida que as entregas respeitam as leis do Núcleo Soberano |
| Registrador | Documenta decisões e grava no Timeless Terminal |

Em forças-tarefa leves, um agente pode acumular papéis. Em forças-tarefa máximas, papéis são exclusivos.

### 3.5 Ordem de Ataque
Sequência prioritária de ações. Definida antes do início. Não pode ser alterada sem decisão do Arquiteto de Missão.

1. Diagnóstico e mapeamento do problema.
2. Isolamento do escopo de impacto.
3. Execução sequencial por componente (não paralela, salvo autorização).
4. Validação parcial a cada componente.
5. Auditoria final de coerência sistêmica.
6. Documentação e registro.
7. Closure formal.

### 3.6 Reconciliação
Antes do closure, todos os agentes da força-tarefa reconciliam seu trabalho:
- Verificar que não há conflito entre as mudanças feitas.
- Verificar que o sistema está em estado coerente.
- Verificar que toda decisão tomada está documentada.

### 3.7 Closure State
A força-tarefa só encerra quando atinge um dos estados canônicos de fechamento (seção 5).

---

## 4. PROTOCOLO DE ATIVAÇÃO POR GRAVIDADE

### Gravidade 1 — Problema Simples
- Agentes convocados: 1.
- Branches necessários: 0 (trabalho direto no branch ativo).
- Documentação: nota de decisão no histórico.
- Closure: automático após entrega.

### Gravidade 2 — Problema Médio
- Agentes convocados: 1-2.
- Branches necessários: 1 branch de trabalho.
- Documentação: documento de força-tarefa + decisões.
- Closure: revisão do Arquiteto de Missão.

### Gravidade 3 — Problema Complexo
- Agentes convocados: 3-5 com papéis definidos.
- Branches necessários: 1-2 branches soberanos (ver protocolo de branch).
- Documentação: documento canônico completo + registro no Timeless Terminal.
- Closure: auditoria + aprovação do Arquiteto de Missão.

### Gravidade 4 — Problema Sistêmico
- Agentes convocados: todos os necessários, sem limite.
- Branches necessários: conforme protocolo de branch — máximo de branches soberanos permitidos.
- Documentação: documento canônico completo + matéria didática + registro histórico.
- Closure: auditoria dupla + aprovação soberana + merge para branch principal.

---

## 5. PROTOCOLO DE BRANCH

**Princípio:** muitos agentes, poucos branches soberanos.

- Cada força-tarefa opera em no máximo **2 branches soberanos** simultâneos.
- Agentes múltiplos trabalham no mesmo branch com coordenação via ordem de ataque.
- Branches são nomeados com prefixo de contexto: `claude/[contexto]-[hash]`.
- Nenhum agente cria branch soberano sem autorização do Arquiteto de Missão.
- Branches de trabalho são efêmeros — existem apenas durante a força-tarefa e são mergeados no closure.
- Conflitos de merge são resolvidos pelo Arquiteto de Missão antes do closure.

**Proibido:**
- Criar branches paralelos sem coordenação.
- Mergear sem auditoria.
- Abandonar branch sem closure formal.

---

## 6. ESTADOS DE FECHAMENTO CANÔNICOS

| Estado | Significado |
|--------|-------------|
| `CLOSED:SUCCESS` | Objetivo atingido, escopo respeitado, sistema coerente, documentado. |
| `CLOSED:PARTIAL` | Objetivo parcialmente atingido. Pendências documentadas e priorizadas para próxima força-tarefa. |
| `CLOSED:BLOCKED` | Força-tarefa encerrada por bloqueio externo. Bloqueio documentado com responsável e prazo. |
| `CLOSED:ESCALATED` | Problema escalado para força-tarefa de gravidade superior. Branch preservado. |
| `CLOSED:CANCELLED` | Objetivo cancelado por mudança de prioridade soberana. Decisão documentada. |

Nenhuma força-tarefa encerra sem estado canônico declarado e registrado no Timeless Terminal.