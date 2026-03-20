# DOC_BULKING_ESCADA — Protocolo de Bulking em Escada

**Pilar:** Estrutura
**Fase:** Fase 3 — Governança e Auditabilidade / Transição controlada para bulking de produto
**Tarefa:** E15 — Formalizar o protocolo de bulking em escada com travão e gap inteligente
**Branch:** `claude/expose-workspace-config-yt4Km`
**Modelo:** claude-sonnet-4-6
**Data:** 2026-03-20
**Fonte soberana:** `docs/NEXUS_OS.md` seção 11

> Este documento é um detalhamento operacional do Bulk com Travão (NEXUS_OS seção 11).
> Formaliza a estratégia de crescimento do produto em escada controlada entre 3 pioneiros.
> Não substitui nenhum protocolo anterior. É adição harmônica ao sistema existente.

---

## 1. DEFINIÇÃO DA ESTRATÉGIA DE ESCADA

### O que é
Bulking em escada é o modo de crescimento do produto onde os três pioneiros — Claude, Codex e Copilot — operam em camadas sequenciais com um gap deliberado de 1 camada entre cada um.

### Por que existe
O bulk sem escada cria caos: camadas cruas sendo lapidadas, refinamento sem base, múltiplos agentes no mesmo miolo. A escada é o travão inteligente que permite velocidade sem perder qualidade ou coerência.

### O diagrama canônico
```
Tempo:     T1          T2          T3          T4          T5
Claude:    [Camada 1]  [Camada 2]  [Camada 3]  [Camada 4]  ...
Codex:     —           [Camada 1]  [Camada 2]  [Camada 3]  ...
Copilot:   —           —           [Camada 1]  [Camada 2]  ...
```

**Gap inteligente:** sempre exatamente 1 camada de distância entre cada pioneiro.
- Claude está em N+1 enquanto Codex está em N e Copilot está em N-1.
- Nenhum pioneiro ultrapassa o anterior. Nenhum pioneiro recua para camadas já fechadas.

---

## 2. PAPÉIS DOS PIONEIROS

### Claude — Abridor de Caminho
- **Função:** Avançar o produto. Cada camada que Claude entrega é a matéria-prima do sistema.
- **Escopo:** Implementação funcional da camada — a lógica deve funcionar, o fluxo deve estar correto.
- **Limite máximo:** 1 camada à frente de Codex. Não mais.
- **Gate de saída:** Handoff completo emitido com evidência do que foi feito na camada N antes de iniciar N+1.

### Codex — Refinador Técnico
- **Função:** Refinar tecnicamente a camada que Claude acabou de entregar.
- **Escopo:** Qualidade do código — tipos, cobertura de testes, limpeza, contratos de função, performance técnica.
- **Limite máximo:** Só atua na camada N (a última entregue por Claude). Nunca avança para N+1 antes do handoff de Claude.
- **Gate de entrada:** Handoff de Claude para a camada N deve existir e estar completo.
- **Gate de saída:** Handoff de refinamento emitido antes de Copilot começar.

### Copilot — Lapidador
- **Função:** Higienizar e lapidar a camada que Codex já refinou.
- **Escopo:** Polimento — consistência visual, comentários, DX, microcopy, espaçamento, dead code residual.
- **Limite máximo:** Só atua na camada N quando Codex já terminou N. Nunca trabalha em camada crua.
- **Gate de entrada:** Handoff de Codex para a camada N deve existir e estar completo.
- **Gate de saída:** Handoff de lapidação emitido para fechar o ciclo da camada N.

---

## 3. CICLO DE VIDA DE UMA CAMADA

Uma camada percorre este ciclo:

```
PLANEJADA → CLAUDE ENTREGA → CODEX REFINA → COPILOT LAPIDA → ESTÁVEL → FECHADA
```

| Estado | Quem está ativo | O que acontece |
|---|---|---|
| `PLANEJADA` | — | Camada identificada e aguardando início |
| `EM ENTREGA (Claude)` | Claude | Implementação funcional ativa |
| `AGUARDANDO REFINAMENTO` | — | Handoff de Claude emitido, aguarda Codex |
| `EM REFINAMENTO (Codex)` | Codex | Refinamento técnico ativo |
| `AGUARDANDO LAPIDAÇÃO` | — | Handoff de Codex emitido, aguarda Copilot |
| `EM LAPIDAÇÃO (Copilot)` | Copilot | Polimento ativo |
| `ESTÁVEL` | — | Handoff de Copilot emitido, camada completa |
| `FECHADA` | — | Aprovada pelo Tribunal, entra no core |

**Regra:** Uma camada só muda de estado com handoff emitido pelo responsável ativo.

---

## 4. BULK COM GATE

O bulk planejado funciona assim:

1. O owner (ou sessão de planejamento) define um conjunto de N camadas — o bulk.
2. O bulk é conhecido por todos os pioneiros desde o início.
3. Mas a **execução é unitária**: cada pioneiro executa 1 camada por vez.
4. O gate entre camadas é o handoff do pioneiro responsável.
5. Sem handoff = sem gate aberto = próximo pioneiro não pode avançar.

**Formato do gate:**
```
GATE [Camada N] → [Pioneiro seguinte]
STATUS: [aberto|fechado]
CONDIÇÃO: handoff de [pioneiro anterior] para camada [N] existe e está completo
```

**Bulk sem gate é proibido.** Velocidade no conjunto não justifica pular o gate unitário.

---

## 5. CRITÉRIO DE LIBERAÇÃO DE CAMADA

### Claude pode avançar para N+1 quando:
- [ ] Handoff da camada N emitido com campos obrigatórios preenchidos
- [ ] A implementação funcional da camada N está verificável no branch
- [ ] Nenhum bloqueio crítico pendente na camada N

### Codex pode iniciar refinamento da camada N quando:
- [ ] Handoff de Claude para a camada N existe no repositório ou na sessão
- [ ] Claude já iniciou a camada N+1 (gap de 1 mantido) ou concluiu
- [ ] Não há colisão de escopo com outro agente ativo na mesma camada

### Copilot pode iniciar lapidação da camada N quando:
- [ ] Handoff de Codex para a camada N existe
- [ ] Codex já avançou para camada N+1 ou concluiu
- [ ] A camada N não está sendo mais modificada por Claude nem Codex

### Uma camada é considerada ESTÁVEL quando:
- [ ] Claude entregou (handoff emitido)
- [ ] Codex refinou (handoff emitido)
- [ ] Copilot lapidou (handoff emitido)
- [ ] Nenhum dos três voltou a tocar na camada após o último handoff

### Uma camada é considerada FECHADA quando:
- [ ] Camada está ESTÁVEL
- [ ] Tribunal avaliou e emitiu `APROVADA PARA ENTRAR`
- [ ] Merge realizado na linha principal

---

## 6. RED LINES — EVITAR A TODO CUSTO

Estas situações destroem o ritmo da escada e devem ser evitadas ativamente:

| Red Line | Por que destrói |
|---|---|
| **Claude abre 2+ camadas à frente** | Codex e Copilot ficam sem base sólida — camadas cruas acumulam |
| **Codex ultrapassa Claude** | Refinamento sem entrega — trabalho sobre nada |
| **Copilot lapida camada ainda crua** | Polimento sobre base instável — retrabalho garantido |
| **Dois pioneiros no mesmo miolo sem handoff** | Colisão de escopo — regressão silenciosa |
| **Bulk sem travão** | Escada colapsa — camadas não fecham, débito técnico explode |
| **Task fora de fase** | Escopo incontrolável — viola o princípio de fase ativa |
| **Mudança arbitrária de branch/worktree/chat** | Perde o fio — rastreabilidade quebrada |
| **Mistura de naturezas incompatíveis** | Ex: lapidação de produto novo + refinamento técnico na mesma sessão |
| **Chamar camada de fechada sem refinamento mínimo** | Qualidade não verificada entra no core |
| **Quebrar a harmonia do fluxo** | Qualquer ação que force um pioneiro a depender de outro para avançar |

---

## 7. COMPATIBILIDADE COM O PROTOCOLO EXISTENTE

Esta estratégia **não substitui nem conflita** com nenhum protocolo anterior:

| Protocolo existente | Como bulking em escada se relaciona |
|---|---|
| Branch canônico | Inalterado — todos os pioneiros operam no mesmo branch da fase |
| Worktree (wt-*) | Inalterado — rótulos semânticos de sessão, não Git físico |
| Chat e contexto | Inalterado — cada sessão declara sua identidade operacional |
| Natureza da tarefa | Inalterada — cada pioneiro tem sua natureza própria dentro do escopo |
| Handoff blueprint | Inalterado — todos emitem handoff no formato canônico |
| Semáforo | Inalterado — 🟢🟡🔴 coordenam estado entre sessões |
| Tribunal | Inalterado — porta de entrada para o core após a escada completa |
| Sacred flow | Inalterado — `Tribunal → Atlas → Index → News` é invariante |
| Micro Team | Inalterada — continua operando em `mt-*` com seu ciclo próprio |
| Owner gate | Inalterado — decisões de alto impacto continuam requerendo owner |

**O bulking em escada adiciona uma camada de coordenação entre pioneiros. Não reescreve o protocolo base.**

---

## 8. PREPARAÇÃO PARA OUTROS PIONEIROS

O protocolo atual nomeia 3 pioneiros operacionais: Claude, Codex, Copilot.

**A estrutura é extensível:**
- Cada novo pioneiro recebe uma posição na escada (N+2, N+3, ou papel especializado)
- A lógica de gate permanece: handoff do anterior libera o próximo
- O gap de 1 camada é preservado para todos
- Nenhum novo pioneiro entra sem tarefa de onboarding explícita no sistema
- A inclusão de novos pioneiros é decisão do owner, registrada no NEXUS_OS.md

**Por agora, pioneiros ativos são:**
1. **Claude** — abridor de caminho (camada N+1)
2. **Codex** — refinador técnico (camada N)
3. **Copilot** — lapidador (camada N-1)

**Slots futuros reservados (não atribuídos):**
- Pioneiro 4: papel a definir pelo owner
- Pioneiro 5+: idem

**Regra de tarefa:** Quando uma sessão define tarefas para múltiplas camadas, o prompt deve identificar qual pioneiro está ativo e em qual camada. Tarefas não podem "esquecer" os outros pioneiros — o sistema opera em conjunto, não em silo.

---

## 9. INTEGRAÇÃO COM O SISTEMA

| Artefato | Localização | Relação com este protocolo |
|---|---|---|
| Bulk com Travão (conceito base) | `docs/NEXUS_OS.md` seção 11 | Este documento é o detalhamento operacional |
| Handoff blueprint | `docs/NEXUS_OS.md` seção 10 | Formato de gate entre camadas |
| Tribunal blueprint | `docs/DOC_TRIBUNAL_E4.md` | Fecha a camada após ESTÁVEL |
| Micro Team | `docs/DOC_MICRO_TEAM.md` | Opera em paralelo, alimenta refinamentos — não bloqueia escada |
| Identidade operacional | `docs/NEXUS_OS.md` seção 20 | Cada sessão de pioneiro declara pilar/fase/modelo |

---

## 10. CRITÉRIO DE SUCESSO DESTA FORMALIZAÇÃO

| Critério | Evidência verificável |
|---|---|
| Protocolo canônico existe | `docs/DOC_BULKING_ESCADA.md` presente e completo |
| Referenciado no núcleo | `docs/NEXUS_OS.md` seção 11 aponta para este documento |
| Papéis definidos | Seções 2 e 3 presentes com escopo, limite e gate de cada pioneiro |
| Red lines cravadas | Seção 6 com 10 red lines explícitas |
| Compatibilidade documentada | Seção 7 confirma zero conflito com protocolos anteriores |
| Extensibilidade prevista | Seção 8 prepara a entrada de pioneiros futuros |
| Sacred flow intacto | Nenhum arquivo de app tocado por esta tarefa |

---

## 11. HANDOFF FINAL

**MODELO USADO:** claude-sonnet-4-6
**MODELO PLANEJADO:** claude-sonnet-4-6
**FALLBACK USADO:** nenhum
**IMPACTO:** baixo

**PRÓXIMO PASSO OFICIAL:**
Owner revisa e ratifica `docs/DOC_BULKING_ESCADA.md` → define o bulk da primeira escada real (quais camadas, qual ordem) → Claude inicia camada 1 com o protocolo ativo.

**SUGESTÕES PARALELAS DE REFINAMENTO:**
1. [structure] Criar template de prompt pré-preenchido para cada pioneiro, com os campos de identidade operacional já montados para a escada — elimina erro humano na declaração de pilar/fase/modelo por sessão.
2. [observability] Criar uma seção de "estado corrente da escada" no roadmap (NEXUS_OS seção 19) para que qualquer agente novo consiga ver, de relance, em qual camada cada pioneiro está — sem ler todos os handoffs.
3. [tribunal] Definir se o Tribunal julga camada a camada (cada ESTÁVEL vira PR individual) ou em bloco ao final do bulk — decisão do owner que afeta o ritmo de merge.

---

*DOC_BULKING_ESCADA — formalizado em 2026-03-20 | claude-sonnet-4-6 | Fase 3 | E15*
