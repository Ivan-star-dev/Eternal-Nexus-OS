# CODEX TANGIBILIS: UMBRA — Shadow Archive

```
══════════════════════════════════════════════════════════════════════════
  ETERNAL NEXUS — SHADOW ARCHIVE
  Codex Tangibilis: Umbra
  Versão: v2.0 (entradas canônicas)
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

```
SHADOW ENTRY ═══════════════════════════════════════════════════════════
ID          │ SA-0001
TIPO        │ caminho_abandonado
DATA        │ 2026-03-20
TITULO      │ Prompts melhores como solução de governança
CONTEXTO    │ Fase inicial — múltiplos agentes operavam em sessões independentes
CONTEUDO    │ Tentativa de resolver drift entre agentes via prompts mais
            │ detalhados e contextuais. Cada sessão recebia mais instrução.
            │ Resultado: sessões individuais melhoravam, mas a coerência
            │ entre sessões continuava a degradar-se.
RAZAO       │ Prompts melhores não resolvem ausência de estado partilhado.
            │ O problema era estrutural — precisava de protocolo, não de
            │ instruções mais longas.
LICAO       │ "Não resolves isso com prompts melhores. Resolves com protocolo."
            │ Esta frase virou a tese central do sistema.
REESTUDO    │ não
REF_PRIME   │ II.4 — Solução proposta
═══════════════════════════════════════════════════════════════════════════
```

```
SHADOW ENTRY ═══════════════════════════════════════════════════════════
ID          │ SA-0002
TIPO        │ caminho_abandonado
DATA        │ 2026-03-20
TITULO      │ Worktrees Git físicos por frente operacional
CONTEXTO    │ Organização inicial das frentes — tentativa de criar worktrees
            │ Git separados para cada frente (wt-estrutura, wt-funcao, etc.)
CONTEUDO    │ Ideia de que cada frente operacional precisava de um worktree
            │ Git físico separado no disco. Múltiplos diretórios, múltiplas
            │ cópias do repo.
RAZAO       │ `git worktree list` confirmou um único worktree real.
            │ Worktrees físicos adicionavam complexidade de gestão sem
            │ benefício proporcional. Worktrees semânticos (wt-*) como
            │ rótulos cognitivos resolvem o mesmo problema com zero overhead.
LICAO       │ Coordenação cognitiva ≠ separação física. Nomes claros resolvem
            │ o que diretórios separados complicam.
REESTUDO    │ não
REF_PRIME   │ VII.2 — Virada 2 (Worktrees Semânticos)
═══════════════════════════════════════════════════════════════════════════
```

```
SHADOW ENTRY ═══════════════════════════════════════════════════════════
ID          │ SA-0003
TIPO        │ caminho_abandonado
DATA        │ 2026-03-20
TITULO      │ Agente único forte em vez de equipa com papéis
CONTEXTO    │ Fase inicial — avaliação de como organizar o trabalho de IA
CONTEUDO    │ Hipótese de que um único agente forte (Claude com contexto
            │ máximo) poderia fazer todo o trabalho sem divisão de papéis.
            │ Sessões longas, contexto carregado, tentativa de continuidade.
RAZAO       │ Sessões discretas sem memória partilhada impossibilitam
            │ continuidade real. Cada sessão começa do zero sem protocolo.
            │ Uma equipa com papéis e gates formais é exponencialmente
            │ mais robusta do que um único agente com contexto máximo.
LICAO       │ Capacidade individual não substitui estrutura colectiva.
            │ Esta lição virou princípio arquitectural consolidado.
REESTUDO    │ não
REF_PRIME   │ II.2 — Tese central
═══════════════════════════════════════════════════════════════════════════
```

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

```
SHADOW ENTRY ═══════════════════════════════════════════════════════════
ID          │ SA-0004
TIPO        │ ideia_paralela
DATA        │ 2026-03-20
TITULO      │ NEXUS_PROVENANCE.md — linha do tempo de evolução do produto
CONTEXTO    │ Fase 3, criação da FOUNDER_VISION_LAYER — secção 4 "The
            │ Ecosystem Blueprint" mencionou um futuro NEXUS_PROVENANCE
CONTEUDO    │ Documento dedicado à proveniência do produto: linha do tempo
            │ detalhada de como cada componente nasceu, evoluiu e se
            │ consolidou. Alimentaria a secção visual do ecosystem blueprint.
RAZAO       │ Não foi prioridade na Fase 3 (governança). Não bloqueia nada.
            │ Referenciado como potencial futuro no FVL blueprint.
LICAO       │ Boas ideias que não são prioridade devem ser registadas, não
            │ esquecidas.
REESTUDO    │ sim
REF_PRIME   │ V.1 — Blueprint do Ecossistema
═══════════════════════════════════════════════════════════════════════════
```

```
SHADOW ENTRY ═══════════════════════════════════════════════════════════
ID          │ SA-0005
TIPO        │ ideia_paralela
DATA        │ 2026-03-20
TITULO      │ Triangulação de dados entre órgãos (GDP + sismos + clima)
CONTEXTO    │ PLv5.1 concluída — 7/7 órgãos com Layer 1, sugestões de PLv6
CONTEUDO    │ Cruzar dados do World Bank (GDP NL), USGS (sismos M4.5+) e
            │ Open-Meteo (clima) para gerar indicador de instabilidade
            │ regional. Alimentaria ATLAS e GEOPOLITICS com dado derivado.
RAZAO       │ Não é prioridade para Fase 3. Requer Layer 2+ e decisão do
            │ owner sobre quais métricas derivadas são relevantes.
LICAO       │ Dados combinados > dados isolados, mas a combinação deve ter
            │ propósito claro, não ser exercício técnico.
REESTUDO    │ sim
REF_PRIME   │ IV.5 — Layer de dados
═══════════════════════════════════════════════════════════════════════════
```

```
SHADOW ENTRY ═══════════════════════════════════════════════════════════
ID          │ SA-0006
TIPO        │ ideia_paralela
DATA        │ 2026-03-20
TITULO      │ R3F v9 — migração do sistema 3D visual
CONTEXTO    │ COUNCIL-PR-TRIAGE-001 — triagem de 27 PRs/Issues
CONTEUDO    │ PR existente para migrar React Three Fiber para v9.
            │ Triagem classificou como MIGRATE_NOW — válido mas
            │ não prioritário para a linha principal de Fase 3.
RAZAO       │ Fora do escopo de governança. Classificada para entrada
            │ futura como task @cursor/@copilot no BASTION.
LICAO       │ Triagem de backlog evita que ideias válidas bloqueiem
            │ a linha principal.
REESTUDO    │ sim
REF_PRIME   │ nenhuma
═══════════════════════════════════════════════════════════════════════════
```

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

```
SHADOW ENTRY ═══════════════════════════════════════════════════════════
ID          │ SA-0007
TIPO        │ versao_descartada
DATA        │ 2026-03-20
TITULO      │ OUTPUT_STANDARD v1.0 → v1.1 (adição do EVIDENCE_BLOCK)
CONTEXTO    │ OPS-EVIDENCE-BLOCK-001 — detecção de que handoffs sem prova
            │ real de alteração eram ambíguos para o owner
CONTEUDO    │ v1.0 emitia apenas HANDOFF_TABLE + CANALIZACAO_TABLE.
            │ v1.1 adicionou EVIDENCE_BLOCK como terceiro bloco obrigatório
            │ e alterou a ordem de emissão para: HANDOFF → EVIDENCE → CANALIZACAO.
RAZAO       │ O owner não conseguia distinguir imediatamente se uma task
            │ tinha sido executada, analisada, sugerida ou entregue sem prova.
            │ O EVIDENCE_BLOCK fecha este gap com ALTERACAO_REAL: sim|não.
LICAO       │ Formato de output evolui para responder às perguntas reais do
            │ consumidor (owner). Estrutura imutável; campos adicionáveis.
REESTUDO    │ não
REF_PRIME   │ V.7 — NLF / VIII.2 — O que existe
═══════════════════════════════════════════════════════════════════════════
```

```
SHADOW ENTRY ═══════════════════════════════════════════════════════════
ID          │ SA-0008
TIPO        │ versao_descartada
DATA        │ 2026-03-20
TITULO      │ FOL v1.0→v1.7 (7 seções adicionadas incrementalmente)
CONTEXTO    │ Bulk controlado — cada nova camada de governança precisava
            │ de referência prática na Factory Operating Layer
CONTEUDO    │ FOL começou com 8 seções (v1.0: consumo, escrita, fila, timeouts,
            │ owner gates, mapa, checklist, próxima camada). Cresceu para 15
            │ seções (v1.7) com consolidação Codex, output standard, autoflow,
            │ ignition, worktree aliases, evidence block e BASTION.
RAZAO       │ Cada versão anterior era correcta mas incompleta. A adição
            │ incremental de seções manteve a estrutura base e expandiu a
            │ cobertura prática sem refactoring.
LICAO       │ Documentos operacionais crescem por adição, não por reescrita.
            │ Estrutura base estável + seções incrementais = evolução sem drift.
REESTUDO    │ não
REF_PRIME   │ V.2 — Mapa de camadas
═══════════════════════════════════════════════════════════════════════════
```

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

```
SHADOW ENTRY ═══════════════════════════════════════════════════════════
ID          │ SA-0009
TIPO        │ mudanca_direcao
DATA        │ 2026-03-20
TITULO      │ De features para governança — nascimento do NEXUS OS
ANTES       │ Foco em entregar features de produto (UI, dados, integrações)
            │ sem camada de governança explícita. Agentes operavam com
            │ prompts ad-hoc e sem handoff formal.
CATALISADOR │ Deriva acumulada entre sessões. O owner percebia que cada
            │ nova sessão "reinventava" contexto. Qualidade oscilava.
DEPOIS      │ Criação do NEXUS_OS.md como constituição soberana.
            │ 10 Leis Absolutas. Fluxo sagrado protegido. O foco passou
            │ de "entregar features" para "construir o sistema que entrega
            │ features com qualidade crescente".
RAZAO       │ Sem governança, velocidade produz fragilidade. O sistema
            │ precisava de um OS antes de precisar de mais features.
LICAO       │ Protocolo primeiro. Delivery depois. Sempre.
IMPACTO     │ transformacional
REF_PRIME   │ II.4, VII.1
═══════════════════════════════════════════════════════════════════════════
```

```
SHADOW ENTRY ═══════════════════════════════════════════════════════════
ID          │ SA-0010
TIPO        │ mudanca_direcao
DATA        │ 2026-03-20
TITULO      │ De agente único para equipa em escada
ANTES       │ Claude executava a maioria das tasks sozinho.
            │ Codex, Copilot e Cursor tinham papéis informais.
CATALISADOR │ Reconhecimento de que agentes diferentes têm competências
            │ diferentes e que uma escada (abrir → refinar → polir)
            │ é mais robusta do que um executor universal.
DEPOIS      │ DOC_BULKING_ESCADA.md formaliza a escada.
            │ Claude abre camada N, Codex refina N-1, Copilot poli N-2.
            │ Gap de 1 camada entre pioneiros. Handoff como pipeline.
RAZAO       │ A escada impõe qualidade crescente por camada sem depender
            │ de revisão manual. Funcional → correcto → belo.
LICAO       │ Uma equipa com papéis e gates formais é mais resiliente
            │ do que um executor forte.
IMPACTO     │ alto
REF_PRIME   │ V.3, VII.3
═══════════════════════════════════════════════════════════════════════════
```

```
SHADOW ENTRY ═══════════════════════════════════════════════════════════
ID          │ SA-0011
TIPO        │ mudanca_direcao
DATA        │ 2026-03-20
TITULO      │ De gestão manual para BASTION + IGNIÇÃO automática
ANTES       │ Owner emitia instruções entre cada task.
            │ Pioneiros aguardavam briefing manual para agir.
            │ Vazio entre tasks era significativo.
CATALISADOR │ Volume de tasks crescia e o owner não escalava como
            │ gerente de sessões. Os pioneiros precisavam de autonomia
            │ dentro de limites claros.
DEPOIS      │ BASTION como fonte única de elegibilidade.
            │ IGNIÇÃO como modo de fluxo contínuo.
            │ Owner entra apenas para gates, visão e bloqueios.
RAZAO       │ O owner deve aprovar direcções, não gerenciar sequência.
            │ O sistema deve avançar sem intervenção constante.
LICAO       │ Autonomia estruturada é o oposto de caos — é protocolo
            │ que elimina a necessidade de instrução redundante.
IMPACTO     │ alto
REF_PRIME   │ V.5, V.6, VII.2 — Virada 4
═══════════════════════════════════════════════════════════════════════════
```

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

```
SHADOW ENTRY ═══════════════════════════════════════════════════════════
ID          │ SA-0012
TIPO        │ erro_fertil
DATA        │ 2026-03-20
TITULO      │ useRealtimeData instanciado em duplicado
CONTEXTO    │ PLv3→PLv4 — hook useOrganLiveStatus consumia dados vivos
ERRO        │ useOrganLiveStatus chamava useRealtimeData separadamente
            │ quando useIndexOrgan já expunha realtimeData internamente.
            │ Resultado: fetch duplicado, estado inconsistente.
CONSEQUENCIA│ Detecção durante PLv4 (SUPER-BULK-A). Corrigido:
            │ useIndexOrgan.ts passou a expor realtimeData no return;
            │ useOrganLiveStatus consolidou via useIndexOrgan().
LICAO       │ Quando um hook já consome dados, expor o dado no return
            │ é mais limpo do que criar novo caminho de fetch. Consolidação
            │ por composição, não por duplicação.
REESTUDO    │ não
REF_PRIME   │ IV.5 — Layer de dados
═══════════════════════════════════════════════════════════════════════════
```

```
SHADOW ENTRY ═══════════════════════════════════════════════════════════
ID          │ SA-0013
TIPO        │ erro_fertil
DATA        │ 2026-03-20
TITULO      │ Codex sem branch alinhado — bloqueio da escada
CONTEXTO    │ BULK-01 — escada formal iniciada; Codex deveria refinar
ERRO        │ Branch do Codex divergiu do canônico. Resultado: Codex
            │ não consegue executar tasks da escada principal.
            │ BULK-01-Codex marcada como BLOQUEADA.
CONSEQUENCIA│ Codex foi redireccionado para consolidador (OPS-HANDOFF-001)
            │ — papel que não requer branch alinhado. Frente F6 continua
            │ independente.
LICAO       │ Branch desalinhado não é erro fatal se o sistema tem
            │ papéis alternativos. Consolidação é papel legítimo mesmo
            │ sem execução directa. A escada não trava por auxiliar bloqueado.
REESTUDO    │ não
REF_PRIME   │ V.3, VIII.3
═══════════════════════════════════════════════════════════════════════════
```

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

```
SHADOW ENTRY ═══════════════════════════════════════════════════════════
ID          │ SA-0014
TIPO        │ tentativa
DATA        │ 2026-03-20
TITULO      │ INVESTOR com dado hardcoded ($2.8B)
CONTEXTO    │ PLv3 — órgão INVESTOR precisava de métrica
CONTEUDO    │ Antes de Data Layer Strategy, INVESTOR mostrava "$2.8B" como
            │ métrica hardcoded. Sem fonte real, sem fallback, sem estado vivo.
RESULTADO   │ substituída
RAZAO       │ Substituído por World Bank GDP NL (Layer 1) e depois por
            │ fetchProjectsSummary (Layer 2 — globe_projects Supabase).
            │ INVESTOR agora mostra projectos activos reais como métrica primária.
LICAO       │ Dado hardcoded é placeholder aceitável para validar layout,
            │ mas deve ser substituído por dado real o mais cedo possível.
            │ A Data Layer Strategy formalizou isto em 3 layers.
REESTUDO    │ não
REF_PRIME   │ IV.5 — Layer de dados
═══════════════════════════════════════════════════════════════════════════
```

```
SHADOW ENTRY ═══════════════════════════════════════════════════════════
ID          │ SA-0015
TIPO        │ tentativa
DATA        │ 2026-03-19
TITULO      │ Bun como package manager
CONTEXTO    │ Setup inicial do projecto — escolha de PM
CONTEUDO    │ Bun foi testado como package manager. bun.lock e
            │ package-lock.json coexistem no repositório.
RESULTADO   │ funcionou mas não era prioridade
RAZAO       │ Bloqueio B-002 activo — owner decide PM canônico.
            │ Coexistência de lockfiles gera confusão; decisão pendente.
LICAO       │ PM deve ser decidido cedo e declarado canônico.
            │ Lockfiles duplicados são sinal de decisão adiada.
REESTUDO    │ talvez
REF_PRIME   │ VIII.3 — Bloqueio B-002
═══════════════════════════════════════════════════════════════════════════
```

---

───────────────────────────────────────────────────────────────────────────

## VIII. CANDIDATOS A REESTUDO

───────────────────────────────────────────────────────────────────────────

*Ideias e caminhos descartados que mantêm potencial futuro e merecem revisitação.*

### VIII.1 — Regras específicas

- Este índice é gerado a partir de entradas com REESTUDO: sim nas seções II-VII
- A decisão de reactivar um candidato pertence ao owner ou ao Tribunal
- Cada candidato lista: ID original, título, razão do potencial, condição de reactivação

### VIII.2 — Índice de candidatos

| ID | Título | Tipo | Potencial | Condição de reactivação |
|---|---|---|---|---|
| SA-0004 | NEXUS_PROVENANCE.md | ideia paralela | Linha do tempo de evolução do produto para ecosystem blueprint visual | Fase 4 ou decisão do owner de documentar evolução formal |
| SA-0005 | Triangulação de dados (GDP + sismos + clima) | ideia paralela | Indicador derivado de instabilidade regional para ATLAS/GEOPOLITICS | Layer 2+ activa + decisão owner sobre métricas derivadas |
| SA-0006 | R3F v9 — migração 3D visual | ideia paralela | Actualização técnica do sistema 3D que pode melhorar performance | Task @cursor/@copilot no BASTION quando backlog visual abrir |
| SA-0015 | Bun como package manager | tentativa | PM mais rápido se owner decidir migrar de npm | Resolução do bloqueio B-002 pelo owner |

---

───────────────────────────────────────────────────────────────────────────

## A. ÍNDICE CRONOLÓGICO

───────────────────────────────────────────────────────────────────────────

*Todas as entradas em ordem temporal — visão panorâmica da evolução do percurso.*

| # | ID | Data | Tipo | Título | Reestudo |
|---|---|---|---|---|---|
| 1 | SA-0001 | 2026-03-20 | caminho_abandonado | Prompts melhores como solução de governança | não |
| 2 | SA-0002 | 2026-03-20 | caminho_abandonado | Worktrees Git físicos por frente operacional | não |
| 3 | SA-0003 | 2026-03-20 | caminho_abandonado | Agente único forte em vez de equipa com papéis | não |
| 4 | SA-0004 | 2026-03-20 | ideia_paralela | NEXUS_PROVENANCE.md | sim |
| 5 | SA-0005 | 2026-03-20 | ideia_paralela | Triangulação de dados entre órgãos | sim |
| 6 | SA-0006 | 2026-03-20 | ideia_paralela | R3F v9 — migração 3D visual | sim |
| 7 | SA-0007 | 2026-03-20 | versao_descartada | OUTPUT_STANDARD v1.0 → v1.1 | não |
| 8 | SA-0008 | 2026-03-20 | versao_descartada | FOL v1.0→v1.7 incremental | não |
| 9 | SA-0009 | 2026-03-20 | mudanca_direcao | De features para governança | não |
| 10 | SA-0010 | 2026-03-20 | mudanca_direcao | De agente único para equipa em escada | não |
| 11 | SA-0011 | 2026-03-20 | mudanca_direcao | De gestão manual para BASTION + IGNIÇÃO | não |
| 12 | SA-0012 | 2026-03-20 | erro_fertil | useRealtimeData instanciado em duplicado | não |
| 13 | SA-0013 | 2026-03-20 | erro_fertil | Codex sem branch alinhado | não |
| 14 | SA-0014 | 2026-03-20 | tentativa | INVESTOR com dado hardcoded | não |
| 15 | SA-0015 | 2026-03-19 | tentativa | Bun como package manager | talvez |

---

───────────────────────────────────────────────────────────────────────────

## B. METADADOS E SELO

───────────────────────────────────────────────────────────────────────────

```
══════════════════════════════════════════════════════════════════════════
  Codex Tangibilis: Umbra │ v2.0 (entradas canônicas) │ 2026-03-21
  Eternal Nexus — Shadow Archive
  Branch: claude/expose-workspace-config-yt4Km
  Estado: ENTRADAS CANÔNICAS PREENCHIDAS — 15 entradas, 4 candidatos a reestudo
  Família visual: ct.* (Codex Tangibilis Design Language)
  Base: Aether Spine + extensão tangível
  Governança: docs/MASTER_DOSSIER_SYSTEM.md
  Relação: arquivo sombra do MASTER_DOSSIER.md — separado por design
  Total de entradas: 15
══════════════════════════════════════════════════════════════════════════
```

---

*SHADOW_ARCHIVE.md v1.0 (estrutura) — 2026-03-21 | Cursor | MASTER-DOSSIER-SYSTEM-001*
*SHADOW_ARCHIVE.md v2.0 (entradas canônicas) — 2026-03-21 | Cursor | MASTER-DOSSIER-FILL-001*
*Codex Tangibilis: Umbra — arquivo sombra do Eternal Nexus*
