# ETERNAL NEXUS OS — CASCA GROSSA CANÔNICA

**Versão:** v1 — implantação inicial
**Data:** 2026-03-20
**Fase:** Fase 3 — Governança e Auditabilidade
**Branch canônico:** `claude/expose-workspace-config-yt4Km`
**Modelo de implantação:** claude-sonnet-4-6

> Este documento é a **fonte soberana da arquitetura operacional** do Eternal Nexus OS.
> Ele não define funcionalidades de produto. Define como o sistema opera, quem faz o quê, o que é intocável e o que mantém o organismo vivo.
> Outros documentos são detalhamentos deste. Em caso de conflito, este prevalece.

---

## 0. IDENTIDADE

**Nome:** Eternal Nexus OS
**Natureza:** Organismo vivo de desenvolvimento e governança de produto
**Princípio de existência:** Avançar com consistência, escala e continuidade — sem perder o fio.

---

## 1. MISSÃO

Construir e operar o produto Eternal Nexus com:
- qualidade crescente a cada fase
- rastreabilidade completa de decisões
- linha principal soberana que nunca para
- linhas paralelas que enriquecem sem interferir
- owner como árbitro final de qualquer ambiguidade

---

## 2. PRINCÍPIO-MÃE

> **Protocolo primeiro. Delivery depois.**

Nenhum agente, nenhuma linha, nenhum modelo entrega nada antes de confirmar que está operando dentro do protocolo vigente. Delivery sem protocolo é ruído. Protocolo sem delivery é burocracia. O sistema existe para ser os dois ao mesmo tempo.

---

## 3. LEIS FUNDAMENTAIS

Estas leis são absolutas. Violá-las equivale a quebrar o organismo:

1. **Nunca simplificar o projeto.**
2. **Nunca renomear Tribunal, Atlas, Index, News ou qualquer órgão central.**
3. **Nunca alterar o sacred flow:** `Tribunal → Atlas → Index → News`
4. **Nunca quebrar** `vite.config.ts`.
5. **Nunca tocar** `src/types/index.ts` sem razão explícita aprovada.
6. **Nunca tocar** `data/projects.ts` sem instrução do owner.
7. **Nunca tocar** `tailwind.config.ts` cores/fontes.
8. **Nunca operar fora da fase ativa.** O que pertence à Fase 4 fica na Fase 4.
9. **Nunca entregar sem handoff.** Sem handoff, a sessão não existe para o sistema.
10. **Nunca entrar no core sem julgamento do Tribunal.**

Se uma instrução violar qualquer lei acima, o agente responde:
> **"Isso quebra o organismo vivo. Quer manter?"**

---

## 4. PILARES

| Pilar | Descrição |
|---|---|
| **Estrutura** | Arquitetura, organização, backbone, governança, handoffs, blueprints |
| **Produto** | Funcionalidades, UX, lógica de negócio, fluxos do app |
| **Qualidade** | Testes, CI, lint, typecheck, build, métricas |
| **Lapidação** | Polimento, refinamento, otimização, design, DX |

Cada tarefa pertence a um pilar. O pilar define quem pode tocar, qual fase é relevante e qual linha opera.

---

## 5. FASES

| Fase | Nome | Escopo |
|---|---|---|
| **Fase 1** | Fundação | Estrutura base, app funcionando, primeiros componentes |
| **Fase 2** | Expansão | Features principais do produto, fluxo sagrado operacional |
| **Fase 3** | Governança e Auditabilidade | CI, instruções de agentes, rastreabilidade, governança canônica |
| **Fase 4** | (bloqueada) | Próxima expansão — só entra após Fase 3 concluída e aprovada pelo owner |

**Regra de fase:** Nada de Fase 4 enquanto a Fase 3 não estiver fechada. O que pertence à Fase 4 é registrado, arquivado e aguarda.

**Documento canônico da Fase 3:** `docs/DOC_FASE3.md`

---

## 6. SEMÁFORO

O semáforo é o mecanismo de coordenação de estado entre sessões.

### Dimensões do semáforo
| Dimensão | O que indica |
|---|---|
| **CHAT** | Continuidade da conversa — mesmo chat ou novo |
| **BRANCH** | Branch ativo — mesmo ou mudou |
| **WORKTREE** | Frente operacional — mesma ou mudou |

### Estados possíveis
| Cor | Significado global | Para micro team |
|---|---|---|
| 🟢 **VERDE** | Continue — contexto preservado, fluxo normal | Opera livremente dentro do escopo |
| 🟡 **AMARELO** | Atenção — houve mudança de contexto ou alerta | Pausa propostas, só observa |
| 🔴 **VERMELHO** | Parar — bloqueio, conflito ou mudança crítica | Para completamente |

### Formato de leitura
```
SEMAFORO DE CONTEXTO:
[cor] CHAT: [mesmo|novo]
[cor] BRANCH: [mesmo|mudou]
[cor] WORKTREE: [mesmo|mudou]
```

Tudo verde = continuação normal. Qualquer amarelo ou vermelho = ler contexto antes de agir.

---

## 7. FRENTE REAL

A frente real de uma sessão é determinada por:

> **pilar + classe + fase + branch + natureza da tarefa**

**Nomenclatura `wt-*`:** Rótulos operacionais de sessão — não são worktrees Git físicos. São coordenadas cognitivas que identificam a frente operacional. Nomes `wt-*` diferentes dentro do mesmo pilar/fase/branch **não mudam a frente real**.

Evidência técnica (E9, 2026-03-20): `git worktree list` retorna um único worktree real. Nenhum diretório `wt-*` existe no disco.

---

## 8. LINHAS DO SISTEMA

O Eternal Nexus OS opera com três linhas simultâneas com hierarquia explícita:

```
LINHA PRINCIPAL (soberana)
    └── alimentada por → LINHA PARALELA OFICIAL
                              └── alimentada por → MICRO TEAM DE REFINAMENTO
```

### Linha Principal (soberana)
- Avança o produto e a governança
- Nunca depende das linhas paralelas para avançar
- Tem prioridade total sobre qualquer outra linha
- Opera no branch canônico da fase ativa
- Se parar, é por bloqueio real ou decisão do owner — nunca por dependência de linha paralela

### Linha Paralela Oficial
- Absorve outputs aprovados da Micro Team
- Produz trabalho que alimenta o roadmap principal
- Não substitui nem atrasa a linha principal
- Passa pelo Tribunal antes de entrar no core

### Micro Team de Refinamento
- Observa, debate, propõe melhorias de lapidação
- Opera em branches `mt-*`
- Nunca escreve no core sem aprovação do Tribunal
- **Protocolo completo:** `docs/DOC_MICRO_TEAM.md`

### Segunda Mão
- Validação secundária e revisão assíncrona
- Entra depois de um delivery para verificar coerência e qualidade
- Não bloqueia a linha principal
- Reporta para o owner e alimenta o backlog de refinamentos

---

## 9. TRIBUNAL

O Tribunal é a única porta de entrada para o core. Nenhuma mudança estrutural, arquitetural ou de protocolo entra no repositório principal sem julgamento.

**Quando acionar o Tribunal:**
- Qualquer proposta da Micro Team ou Linha Paralela que afete código
- Qualquer mudança em arquivo protegido
- Qualquer mudança de fase, pilar ou protocolo central
- Qualquer dúvida sobre se algo "entra ou não"

**O Tribunal emite um de três vereditos:**
- `APROVADA PARA ENTRAR` — merge pode acontecer
- `ADIADA` — válida, mas fora de fase ou momento
- `REJEITADA` — reprovada com razão registrada

**Protocolo completo do Tribunal:** `docs/DOC_TRIBUNAL_E4.md`

---

## 10. HANDOFF

**Regra:** Sem handoff, a sessão não existe para o sistema. Todo agente que termina uma tarefa emite um handoff estruturado.

### Blueprint de Handoff

```
@claude | MODELO:[modelo usado] | TASK:[id e nome da task] | STATUS:[done|partial|blocked] | FEITO:[resumo curto] | NAO_FEITO:[resumo curto] | BLOQUEIOS:[resumo curto] | ADAPTACOES:[resumo curto] | ARQUIVOS:[lista curta] | IMPACTO:[baixo|medio|alto] | PROXIMO_PASSO:[resumo curto] | SUGESTOES:[1)... ; 2)... ; 3)...] | DECISAO_RECOMENDADA:[quem entra depois / quem espera]
```

**Campos obrigatórios:** MODELO, TASK, STATUS, FEITO, PROXIMO_PASSO
**Campos situacionais:** NAO_FEITO (se STATUS=partial|blocked), BLOQUEIOS (se STATUS=blocked), ADAPTACOES (se houve desvio)

**Regra de expansão limitada:** Ao concluir, deixar:
- 1 próximo passo oficial
- até 3 sugestões paralelas de refinamento (não obrigatórias, não bloqueantes)

### Registro Visual de Canalização

Todo pioneiro, ao concluir qualquer task ou resposta operacional final, entrega **dois blocos obrigatórios de fechamento em sequência**:

1. O handoff linear (formato acima)
2. O registro visual de canalização (formato abaixo)

**Formato canônico:**
```
REGISTRO DE CANALIZAÇÃO:
[🟢|🔴] CHAT: [nome do chat ou "mesmo"]
[🟢|🔴] BRANCH: [nome do branch ou "mesmo"]
[🟢|🔴] WORKTREE: [nome wt-* ou "mesmo"]
NATUREZA: [natureza específica da tarefa]
EXECUTOR: [@pioneiro]
ESTADO FINAL: [done|partial|blocked]
CANALIZAÇÃO ATIVA: [descrição curta da frente ativa]
```

**Leitura dos sinais:**
- 🟢 = contexto preservado em relação ao prompt de entrada
- 🔴 = contexto mudou nessa dimensão
- Tudo verde → continuação normal — próximo pioneiro entra daqui
- Misto verde/vermelho → mudança parcial — atenção ao reposicionamento antes de agir
- Tudo vermelho → mudança total — parar, reler contexto completo, reposicionar

**Aplicação universal:** Claude, Codex, Copilot, Micro Team, Segunda Mão, Research, Hardening e qualquer equipe auxiliar futura.

**Regra:** O registro de canalização não substitui o handoff. Os dois são obrigatórios. Handoff sem canalização = fechamento incompleto.

---

## 11. BULK COM TRAVÃO

Bulk é quando um agente precisa executar múltiplas ações encadeadas numa única sessão.

**Regra do travão:** Antes de cada ação no bulk, o agente confirma:
1. A ação está dentro do escopo desta tarefa?
2. A ação não viola nenhuma lei fundamental?
3. A ação não depende de algo não resolvido?

Se qualquer resposta for não → **parar, registrar no handoff, aguardar**.

**O bulk não tem licença para atropelar o protocolo.** Velocidade dentro do travão, não apesar dele.

### Bulk em Escada entre Pioneiros

Quando o bulk envolve múltiplos pioneiros (Claude, Codex, Copilot), aplica-se a lógica de escada com gap inteligente:
- Claude avança 1 camada à frente de Codex
- Codex refina a camada que Claude entregou
- Copilot lapida a camada que Codex refinou
- Cada transição requer handoff completo do pioneiro anterior (o gate)
- Bulk sem gate é proibido

**Protocolo completo:** `docs/DOC_BULKING_ESCADA.md`

---

## 12. ESTADOS DE TAREFA

| Estado | Descrição |
|---|---|
| `PLANEJADA` | Identificada, não iniciada |
| `EM ANDAMENTO` | Agente trabalhando ativamente |
| `BLOQUEADA` | Depende de resolução externa (owner, Tribunal, outro agente) |
| `PARCIAL` | Entregue parcialmente — handoff emitido com o que falta |
| `CONCLUÍDA` | Handoff emitido, evidência verificável, pronta para fechar |
| `ADIADA` | Válida mas fora de fase/momento — arquivada no backlog |
| `CANCELADA` | Descartada com razão registrada |

**Estados da Micro Team:** `EM OBSERVAÇÃO → EM RESEARCH → EM REFINAMENTO → EM TESTE → PRONTA PARA TRIBUNAL → APROVADA PARA ENTRAR | ADIADA | REJEITADA`

---

## 13. POLÍTICA DE MODELOS

| Contexto | Modelo padrão | Fallback |
|---|---|---|
| Compressão estrutural, implantação canônica | `claude-sonnet-4-6` | `claude-opus-4-6` |
| Tarefas complexas de arquitetura ou julgamento | `claude-opus-4-6` | — |
| Tarefas rápidas e operacionais | `claude-sonnet-4-6` | `claude-haiku-4-5` |

**Regra:** O modelo usado deve ser registrado em todo handoff. Se o fallback foi acionado, registrar o motivo.

**Fallback blueprint:**
1. Modelo preferido falha ou está indisponível → acionar fallback imediatamente
2. Registrar: `FALLBACK USADO: [modelo] | MOTIVO: [razão]`
3. Se o fallback também falhar → registrar bloqueio no handoff, não improvisa

---

## 14. BLOQUEIOS AUTOMÁTICOS

O sistema trava automaticamente (sem esperar instrução) quando:

| Situação | Travamento |
|---|---|
| Instrução viola lei fundamental | Agente para e pergunta ao owner |
| Tarefa depende de output não entregue | Agente marca como BLOQUEADA e emite handoff |
| Arquivo protegido está no escopo sem razão explícita | Agente para antes de tocar |
| Proposta pertence à Fase 4 | Agente arquiva e não implementa |
| Semáforo vermelho em dimensão crítica | Agente lê contexto antes de qualquer ação |
| Mais de 3 PRs simultâneos da Micro Team | Micro Team pausa até fila reduzir |
| Colisão de escopo entre agentes | Agente que chegou segundo espera o handoff de conclusão |

---

## 15. ITENS PROTEGIDOS

Estes arquivos não podem ser modificados sem razão explícita e aprovação:

| Arquivo | Proteção |
|---|---|
| `vite.config.ts` | Invariante absoluta — nunca tocar |
| `src/types/index.ts` | Invariante absoluta — só com razão explícita |
| `data/projects.ts` | Só com instrução direta do owner |
| `tailwind.config.ts` | Invariante absoluta — cores/fontes intocáveis |
| Sacred flow `Tribunal → Atlas → Index → News` | Invariante absoluta do produto |

---

## 16. PAPEL DO OWNER

O owner é o árbitro final de qualquer ambiguidade, conflito ou decisão de alto impacto.

**O owner decide:**
- Merge de branches no repositório remoto
- Purge de segredos do histórico git
- Qual PM é canônico (npm vs bun vs outro)
- O que acontece com arquivos legados (ex: `antigravity/legacy-html/`)
- Aprovação de Fase 4
- Rotação de chaves e segredos
- Qualquer mudança que afete dados reais ou segurança

**O owner não precisa ser consultado para:**
- Mudanças em `.gitignore` que não removem arquivos
- Adição de documentação que não altera app
- Execução de tarefas aprovadas no protocolo vigente

**Owner gate:** Qualquer ação marcada `BLOQUEADA — aguarda owner` permanece congelada até confirmação explícita. Nenhum agente improvisa em área do owner.

---

## 17. HIGIENE

**Regras de higiene obrigatórias:**

1. Arquivos temporários gerados por ferramentas (ex: `vite.config.ts.timestamp-*.mjs`) **nunca são commitados**.
2. O `.env` **nunca é commitado** — apenas `.env.example`.
3. Lockfiles de PM não-canônico (ex: `bun.lock`, `bun.lockb` se npm é o PM oficial) são removidos do rastreamento.
4. Branches sem commits adicionais à master são fechados.
5. O `.gitignore` é mantido atualizado com padrões ativos no projeto.

**Estado de higiene atual:** `docs/DOC_TRIBUNAL_E4.md` — relatório de higiene oficial da Fase 3.

---

## 18. OBSERVABILIDADE

O sistema é observável quando qualquer agente novo consegue responder, lendo apenas os documentos canônicos:

- O que foi feito na sessão anterior
- Qual o estado atual de cada linha
- Quais bloqueios existem
- O que entra a seguir e por quê
- Quem tomou cada decisão e quando

**Mecanismos de observabilidade:**
- Handoffs estruturados ao final de cada sessão
- Estados de tarefa atualizados e rastreáveis
- Semáforo declarado no início de cada prompt
- Referência de pilar/fase/modelo em cada tarefa
- Documentos canônicos versionados no repositório
- **Nexus Live Fabric (NLF):** camada operacional viva em `ops/` — estado, fila, ledger e canalização em tempo real

---

## 19. ROADMAP

O roadmap do sistema tem duas colunas:

| Coluna | O que contém |
|---|---|
| **Linha principal** | Tasks ativas da fase corrente, em ordem de execução |
| **Refinamentos** | Candidatos aprovados pela Micro Team, aguardando entrada no momento certo |

O owner e o Tribunal decidem quando um refinamento migra para a linha principal.

**O roadmap não é substituído por nenhuma sessão.** Ele é alimentado. Quem alimenta, não substitui.

---

## 20. IDENTIDADE OPERACIONAL

Cada prompt de tarefa deve declarar:

```
PILAR: [pilar]
CLASSE: [classe semântica]
FASE: [fase ativa]
MODELO: [modelo a usar]
FALLBACK APROVADO: [modelo de fallback]
CHAT: [identificador de sessão]
BRANCH: [branch ativo]
WORKTREE: [rótulo wt-*]
TASK: [id e nome]
```

Sem essa identidade, o agente está operando sem coordenada. Sem coordenada, não há rastreabilidade. Sem rastreabilidade, não há sistema.

---

## 21. BLUEPRINTS OBRIGATÓRIOS

O sistema tem 9 blueprints canônicos. Todos os agentes devem conhecê-los:

| Blueprint | Propósito | Localização |
|---|---|---|
| **Prompt Blueprint** | Estrutura mínima de um prompt de tarefa | Este documento, seção 20 |
| **Handoff Blueprint** | Formato de entrega ao fim de cada sessão | Este documento, seção 10 |
| **Canalização Blueprint** | Registro visual de estado do sistema ao fim de cada resposta | Este documento, seção 10 |
| **Semáforo Blueprint** | Formato e leitura do semáforo de contexto | Este documento, seção 6 |
| **Fallback Blueprint** | Protocolo de troca de modelo | Este documento, seção 13 |
| **Tribunal Blueprint** | Processo de julgamento para entrada no core | `docs/DOC_TRIBUNAL_E4.md` |
| **Bulk Blueprint** | Execução de múltiplas ações com travão | Este documento, seção 11 |
| **Report Blueprint** | Estrutura de relatório de auditoria/higiene | `docs/DOC_TRIBUNAL_E4.md` como referência |
| **Control Blueprint** | Regras de bloqueio automático e owner gate | Este documento, seções 14, 16 |
| **Execution Map Blueprint** | Bloco obrigatório de topo de prompt de bulk — posição, executor, allowed/blocked | `docs/DOC_BULK_PROTOCOL.md` seção 2 |
| **Preflight Gate Blueprint** | Verificação pré-escrita — repo, branch, natureza, escopo | `docs/DOC_BULK_PROTOCOL.md` seção 3 |

---

## 22. CRITÉRIO DE SISTEMA MADURO

O sistema é considerado maduro quando todas as condições abaixo são verdadeiras:

| Critério | Evidência verificável |
|---|---|
| Casca grossa canônica existe | `docs/NEXUS_OS.md` presente e completo |
| Documento de Fase 3 existe | `docs/DOC_FASE3.md` com requisitos verificáveis |
| Protocolo de Micro Team existe | `docs/DOC_MICRO_TEAM.md` com ciclo de vida completo |
| Tribunal documentado | `docs/DOC_TRIBUNAL_E4.md` com parecer e semáforo |
| Regras de agentes acessíveis | `AGENTS.md` na raiz com invariantes e referencias |
| CI de qualidade ativo | `.github/workflows/app-quality.yml` executando |
| README operacional | `README.md` referenciando documentos canônicos |
| Sacred flow preservado | `Tribunal → Atlas → Index → News` intacto no código |
| Handoffs emitidos | Toda sessão termina com handoff estruturado |
| Owner gate ativo | Bloqueios críticos registrados, aguardando owner |

---

## 23. O QUE NÃO PODE ACONTECER

| Proibição | Consequência se violar |
|---|---|
| Merge sem handoff | Sessão não rastreável — regressão invisível |
| Feature de Fase 4 na Fase 3 | Quebra de fase — escopo incontrolável |
| Simplificação do projeto | Perda de identidade — organismo não reconhece a si mesmo |
| Toque em arquivo protegido sem razão | Risco de quebra do core sem rastro |
| Proposta entrando no core sem Tribunal | Qualidade não verificada — regressão potencial |
| Linha paralela bloqueando a linha principal | Travamento de progresso — contra o princípio do sistema |
| Owner gate ignorado | Decisão de alto impacto sem autorização — risco real |
| Segredo commitado no repositório | Vazamento — irreversível sem rotação |
| Renomear sacred flow ou seus órgãos | Quebra de identidade de produto e código |
| Agente operando sem identidade operacional | Sem coordenada → sem rastreabilidade → sem sistema |

---

## 24. VEREDITO FINAL

O Eternal Nexus OS existe para garantir que o projeto **avance sem perder o fio**.

O fio é:
- a identidade do produto
- o fluxo sagrado
- a rastreabilidade das decisões
- a soberania da linha principal
- a autoridade do owner

Quando o fio está preservado, o sistema pode crescer indefinidamente.
Quando o fio se perde, nenhuma velocidade resolve.

> **Protocolo primeiro. Delivery depois. Sempre.**

---

## REFERÊNCIAS CANÔNICAS

| Documento | Propósito |
|---|---|
| `docs/DOC_FASE3.md` | Escopo, requisitos e critérios da Fase 3 |
| `docs/DOC_MICRO_TEAM.md` | Protocolo completo da Micro Team de Refinamento |
| `docs/DOC_TRIBUNAL_E4.md` | Parecer de higiene e ordem de merge |
| `docs/DOC_BULKING_ESCADA.md` | Protocolo de bulking em escada entre pioneiros (Claude, Codex, Copilot) |
| `AGENTS.md` | Regras operacionais para agentes — invariantes e anti-drift |
| `README.md` | Entrada operacional do repositório |
| `ops/NLF.md` | Nexus Live Fabric — definição canônica, soberania, regras de transição |
| `ops/LIVE_STATE.md` | Estado vivo atual, fila por executor, canalização ativa |
| `ops/HANDOFF_LEDGER.md` | Ledger cronológico append-only de todos os handoffs emitidos |
| `docs/DOC_BULK_PROTOCOL.md` | Protocolo operacional de bulk: execution map, preflight gate, canalization guard, linha temporal |

---

*Eternal Nexus OS — casca grossa canônica implantada em 2026-03-20 | claude-sonnet-4-6 | Fase 3*
