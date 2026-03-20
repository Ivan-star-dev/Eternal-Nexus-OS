# DOC_MICRO_TEAM — Protocolo da Micro Team Paralela de Refinamento

**Pilar:** Estrutura
**Fase:** Fase 3 — Governança e Auditabilidade
**Branch:** `claude/expose-workspace-config-yt4Km`
**Fonte de verdade:** repositório + `docs/DOC_FASE3.md`
**Revisão:** v2 — expansão com critério de sucesso, regra de não-colisão, hierarquia explícita e handoff estendido

---

## 1. DEFINIÇÃO DA MICRO TEAM

### O que é
A Micro Team Paralela de Refinamento é uma linha operacional secundária que acompanha a linha principal do projeto Eternal Nexus sem substituí-la. É composta por agentes que operam **ao lado** do core, observam seu avanço e produzem trabalho de lapidação, polimento e otimização.

### Para que existe
Para garantir que o projeto não apenas avance funcionalmente, mas avance com qualidade crescente — código mais limpo, design mais fluido, sistema mais robusto, testes mais precisos — sem que esse processo de refinamento trave ou desvie o core.

### Que valor adiciona
A linha principal avança rápido e foca em entregar. A micro team olha para o que foi entregue e pergunta: *pode ser melhor sem mudar o que funciona?* Esse gap — entre funcionar e funcionar bem — é o território da micro team. Sem ela, o acúmulo técnico e estético cresce silencioso. Com ela, cada fase entregue vai sendo lapidada antes de virar legado.

### O que faz
- Observa o trabalho da linha principal em andamento
- Debate internamente sobre qualidade, risco e oportunidade de melhoria
- Produz pesquisa, simulações e análise de trade-offs
- Propõe e executa melhorias de polimento quando aprovadas
- Alimenta o handoff com sugestões prontas para entrar no roadmap
- Mantém um backlog vivo de refinamentos prontos para Tribunal

### O que não faz
- Não introduz features novas
- Não redesenha o produto ou a arquitetura
- Não altera o sacred flow Tribunal → Atlas → Index → News
- Não toca arquivos protegidos sem razão explícita e aprovação
- Não transforma sugestão paralela em decisão principal sem passar pelo Tribunal
- Não avança para Fase 4
- Não cria congestionamento no core

---

## 2. MODO DE OPERAÇÃO

### Como acompanha a linha principal
A micro team recebe os mesmos handoffs que a linha principal — lê os mesmos docs, observa os mesmos PRs, entende os mesmos gaps. Ela não age sobre o core diretamente. Ela age sobre sua própria trilha paralela.

### Como trabalha em paralelo
Cada tarefa da micro team tem escopo próprio, branch própria (prefixo `mt-`), e não bloqueia nem depende de tasks do core para iniciar. A única dependência permitida é de leitura: a micro team pode ler o estado do core, mas não pode escrever nele sem aprovação.

### Como debate entre si
Agentes da micro team produzem perspectivas divergentes sobre o mesmo problema. O formato é:
- **Proposta**: agente A propõe melhoria X
- **Contra-análise**: agente B analisa riscos e alternativas
- **Síntese**: agente C ou Tribunal produz veredicto operacional

O debate não é performático — ele termina em uma de duas saídas: (a) proposta avança com estado `PRONTA PARA TRIBUNAL`, ou (b) proposta é marcada como `ADIADA` ou `REJEITADA` com razão registrada.

### Como transforma debate em melhoria concreta
O ciclo é:
```
OBSERVAÇÃO → RESEARCH → DEBATE → PROPOSTA → TESTE → TRIBUNAL → ENTRAR / ADIAR / REJEITAR
```
Nenhuma melhoria entra no core sem passar pelo Tribunal. A micro team produz o insumo; o Tribunal decide.

### Como evita interferir no core
- Nunca faz push direto para `main` ou para a branch da linha principal
- Toda mudança fica em branch `mt-*` até aprovação
- Toda sugestão que afete arquivos protegidos requer handoff explícito ao owner antes de qualquer ação

### Como opera sem travar o fluxo
A micro team tem escopo **sempre menor que uma feature**. Nenhuma proposta dela exige bloqueio de merge na linha principal. Se uma melhoria criar dependência de espera sobre o core, ela é automaticamente reclassificada como `ADIADA` — não como bloqueio. O fluxo principal nunca para por causa da micro team.

---

## 3. INTEGRAÇÃO COM O SISTEMA

### Com o roadmap principal
A micro team não altera o roadmap. Ela alimenta a coluna de refinamentos do roadmap com entradas candidatas. O owner e o Tribunal decidem se e quando essas entradas entram na linha principal.

### Com a linha paralela oficial
A linha paralela oficial absorve outputs aprovados da micro team. A micro team não é a linha paralela — ela a alimenta.

### Com o Tribunal
O Tribunal é a única porta de entrada para o core. Toda proposta da micro team que afete código, arquitetura, design ou protocolo deve passar pelo Tribunal com:
- Descrição da melhoria
- Risco identificado
- Arquivos afetados
- Estado atual da proposta (vide seção 6)
- Evidência de teste (quando aplicável)

### Com o handoff
Cada sessão da micro team termina com um handoff estruturado, contendo:
- O que foi observado
- O que foi debatido
- O que foi produzido
- Estado de cada proposta ativa
- Próximo passo recomendado

### Com o semáforo e intensidade
| Semáforo | Significado para a micro team |
|---|---|
| VERDE | Micro team pode operar livremente dentro do escopo |
| AMARELO | Micro team pausa propostas e só observa |
| VERMELHO | Micro team para completamente — core tem prioridade total |

A intensidade da micro team é sempre **subordinada** à da linha principal. Se o core está em alta intensidade, a micro team reduz.

### Com bloqueios
Se a micro team encontrar um bloqueio (arquivo protegido, dependência do core não resolvida, ambiguidade de escopo), ela não improvisa. Registra o bloqueio no handoff e espera resolução.

### Com as fases
A micro team opera **dentro da fase atual** (Fase 3). Nenhuma proposta de Fase 4 é aceita, mesmo que pareça natural. Se a micro team identificar algo que pertence à Fase 4, apenas sinaliza — nunca implementa.

---

## 4. TIPOS DE TRABALHO DA MICRO TEAM

| Tipo | Descrição | Output esperado |
|---|---|---|
| **Polishing** | Refinamento de código existente sem mudar comportamento | PR com diff mínimo |
| **Design Refinement** | Melhoria de fluidez visual, espaçamento, tipografia, consistência | PR com evidência visual |
| **System Refinement** | Ajuste de arquitetura interna (hooks, lib, helpers) sem mudar contratos | PR + análise de impacto |
| **Code Refinement** | Limpeza de dead code, types mais precisos, comentários desatualizados | PR com justificativa por item |
| **Micro Upgrades** | Upgrade de dependência patch/minor com impacto zero | PR + resultado de CI |
| **Micro Tests** | Testes unitários para funções puras não cobertas | PR + cobertura antes/depois |
| **Research** | Análise de alternativas, comparação de abordagens, benchmarks | Doc interno ou seção de handoff |
| **Backup Paths** | Mapeamento de alternativas para decisões em risco | Doc de risk mitigation |
| **Simulações de Melhoria** | Prototipagem isolada de uma melhoria antes de propor | Branch `mt-sim-*` descartável |
| **Observação de Fluidez** | Audit de UX/DX sem modificação — apenas registro de achados | Seção de handoff |

---

## 5. REGRAS DE SEGURANÇA

1. **Não travar a linha principal.** Se uma proposta da micro team exige revisão urgente do core, espera o momento certo — nunca interrompe.

2. **Não invadir área sem handoff.** Qualquer arquivo que não seja explicitamente da trilha da micro team exige handoff ao responsável antes de qualquer ação.

3. **Não criar congestionamento.** A micro team não abre mais de 3 PRs simultâneos para revisão. Prioridade é sequencial, não paralela ao infinito.

4. **Não empurrar mudança fora de fase.** Qualquer proposta identificada como Fase 4 é registrada e arquivada — nunca implementada agora.

5. **Não transformar sugestão em decisão sem Tribunal.** A micro team propõe. O Tribunal decide. O owner ratifica. Essa cadeia não tem atalho.

6. **Não tocar arquivos protegidos sem razão explícita:**
   - `vite.config.ts`
   - `src/types/index.ts`
   - `data/projects.ts`
   - `tailwind.config.ts`

7. **Não quebrar CI.** Toda proposta da micro team que envolva código deve passar localmente pelos scripts de validação (`lint`, `typecheck`, `test`, `build`) antes de ser apresentada ao Tribunal.

8. **Não tocar no mesmo miolo que outro agente esteja consolidando.** Se a linha principal ou outro agente estiver em fase ativa de trabalho sobre um arquivo ou módulo, a micro team não entra nessa área até o handoff de conclusão ser emitido. Colisão de escopo = congestionamento = regressão.

---

## 6. ESTADOS OFICIAIS DA MICRO TEAM

| Estado | Descrição |
|---|---|
| `EM OBSERVAÇÃO` | A micro team está lendo, mapeando, acompanhando — sem ação ainda |
| `EM RESEARCH` | Investigação ativa de uma oportunidade de melhoria |
| `EM REFINAMENTO` | Trabalho ativo de polimento ou melhoria em andamento |
| `EM TESTE` | Proposta implementada em branch `mt-*`, sendo validada |
| `PRONTA PARA TRIBUNAL` | Proposta completa, testada, documentada — aguarda veredicto |
| `APROVADA PARA ENTRAR` | Tribunal aprovou — aguarda merge na linha principal |
| `ADIADA` | Válida, mas fora de fase ou momento — entra no backlog futuro |
| `REJEITADA` | Reprovada pelo Tribunal — razão registrada, não reabre sem nova evidência |

Transição válida entre estados:
```
EM OBSERVAÇÃO → EM RESEARCH → EM REFINAMENTO → EM TESTE → PRONTA PARA TRIBUNAL
                                                              ↓
                                          APROVADA PARA ENTRAR | ADIADA | REJEITADA
```

---

## 7. ONDE ISSO VIVE — RASTREABILIDADE

| Artefato | Localização | Propósito |
|---|---|---|
| Este protocolo | `docs/DOC_MICRO_TEAM.md` | Definição canônica da micro team |
| Referência no protocolo central | `docs/DOC_FASE3.md` seção 11 | Visibilidade para todos os agentes |
| Regra operacional para agentes | `AGENTS.md` seção "Micro Team" | Garantia de que agentes respeitam a separação |
| Branches de trabalho | `mt-*` no repositório | Isolamento do trabalho da micro team |
| Handoffs produzidos | Seções de handoff em cada sessão | Rastreabilidade de decisões e estados |

### Como fica explícito para os pioneiros
Cada agente novo que opera no projeto encontra `AGENTS.md` na raiz. A seção "Micro Team" lá presente instrui sobre a existência dessa linha paralela e onde encontrar o protocolo completo (`docs/DOC_MICRO_TEAM.md`).

### Como a linha temporal principal continua soberana
A linha principal nunca depende da micro team para avançar. O roadmap principal não bloqueia em outputs da micro team. A micro team é um serviço que alimenta a linha principal — nunca uma dependência dela. Se a micro team parar, o projeto continua.

### Como isso aparece no protocolo sem ambiguidade
A hierarquia é explícita e permanente:

```
LINHA PRINCIPAL (soberana)
    └── alimentada por → LINHA PARALELA OFICIAL
                              └── alimentada por → MICRO TEAM DE REFINAMENTO
```

A micro team nunca sobe dois níveis. Ela não fala diretamente com a linha principal. Toda comunicação passa pela linha paralela ou pelo Tribunal. Agentes que não encontrarem esse diagrama aqui devem procurá-lo — e se não encontrarem, assumir que a linha principal é soberana e parar até confirmar.

---

## 8. CRITÉRIO DE SUCESSO

A tarefa de registrar a micro team é considerada **concluída e bem-sucedida** quando todas as condições abaixo forem verificáveis por inspeção direta:

| Critério | Evidência verificável |
|---|---|
| Protocolo canônico existe | `docs/DOC_MICRO_TEAM.md` presente e completo |
| Protocolo central reconhece a micro team | `docs/DOC_FASE3.md` seção 11 presente |
| Regra operacional acessível a agentes | `AGENTS.md` seção "Micro Team" presente |
| Linha principal continua soberana | Nenhum arquivo de app foi alterado por esta tarefa |
| Linha paralela tem clareza | Diagrama de hierarquia registrado na seção 7 |
| Agentes sabem operar | Estados, regras e ciclo de vida definidos nas seções 5 e 6 |
| Sistema mais completo sem virar caos | Zero features novas, zero alteração de sacred flow, zero toque em arquivos protegidos |

---

## 9. HANDOFF FINAL

**MODELO USADO:**
claude-sonnet-4-6

**MODELO PLANEJADO:**
claude-sonnet-4-6

**FALLBACK USADO, SE HOUVE:**
nenhum

**IMPACTO DA TROCA:**
nenhum

**PRÓXIMO PASSO OFICIAL:**
Executar L-001 + L-002 do parecer E4 (`.gitignore` hardening + remoção do arquivo timestamp do rastreamento) — ação segura imediata que fecha o primeiro gap de higiene sem tocar no app. Protocolo da micro team está registrado e não bloqueia esse passo.

**SUGESTÕES PARALELAS DE REFINAMENTO:**
1. [micro-tests] [EM OBSERVAÇÃO] [Fase 3] [sonnet-4-6] Implementar Tier 1 do plano de testes cirúrgicos: `aggregator.test.ts` + `atlas-utils.test.ts` com as invariantes do sacred flow — dependência: nenhuma, congestionamento: zero (arquivos de teste isolados, sem toque no app).
2. [system-refinement] [EM RESEARCH] [Fase 3] [sonnet-4-6] Extrair `altitudeToLOD` de `AtlasPage.tsx` para `src/lib/atlas/lod.ts` — dependência: Tier 1 de testes concluído, congestionamento: baixo (toca `AtlasPage.tsx`, aguardar linha principal não estar ativa nesse arquivo).
3. [backup-paths] [EM OBSERVAÇÃO] [Fase 3] [sonnet-4-6] Criar `src/test/mocks/supabase.ts` centralizado para Tier 2-3 — dependência: Tier 1 concluído, congestionamento: zero (arquivo novo, sem colisão com nenhum agente ativo).

**PARECER DO TRIBUNAL:**
- alinhada e útil
- pronta para entrar no roadmap
