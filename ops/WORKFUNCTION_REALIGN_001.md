# NEXUS-WORKFUNCTION-CODEX-REALIGN-001

**Data:** 2026-03-21  
**Executor:** @codex  
**Modelo:** GPT-5.2-Codex  
**Task:** Realinhamento de branch + tomada formal do WorkFunction

## 1) Branch realign (evidência)
- Branch anterior identificada no ambiente: `work`
- Tentativa inicial de checkout direto do canônico falhou (branch inexistente localmente)
- Branch canônico vivo materializado localmente a partir do estado atual: `claude/expose-workspace-config-yt4Km`
- Estado final desta sessão: executor operando no branch canônico

## 2) Mapa técnico funcional (estado real observado)

### Forte (funcionalmente comprovado)
- Build de produção executa com sucesso (`npm run build`)
- Suite de testes atual passa (`npm run test`)
- Fluxo sagrado está representado no código e documentação (`Tribunal → Atlas → Index → News`)
- Camada de dados híbrida já implantada em partes (fontes públicas + Supabase) com rastros em `src/lib/` e `src/hooks/`

### Parcial
- Pipeline de qualidade não está verde localmente para lint/typecheck, apesar de build/test passarem
- Integrações de órgãos existem em diferentes níveis de maturidade (alguns com dados reais, outros com fallback/placeholder)
- Parte da governança aponta Codex como consolidador, ainda sem tomada plena do pilar funcional até este realinhamento

### Quebrado ou incompleto
- `npm run lint` falha com volume alto de erros (tipagem `any`, regras de hooks, no-empty, no-unused-expressions)
- `npm run typecheck` falha em larga escala (principalmente JSX/Three/R3F typings e incompatibilidades em páginas 3D)
- Divergência entre “build ok” e “quality gates quebrados” cria risco de regressão silenciosa

### Dívida técnica herdada
- Alta concentração de `any` em componentes, hooks e funções Supabase
- Superfície 3D extensa com tipagem inconsistente em JSX intrínseco
- Acoplamento entre frentes de produto/visual sem cobertura de type safety homogênea

### Salvages rápidos (baixo tempo / alto retorno)
1. Criar trilha de hardening por lote: primeiro arquivos que quebram lint em hooks centrais
2. Corrigir regra de hooks em `NexusFlowInspector` (erro estrutural com alto impacto)
3. Reduzir `any` em bordas de dados (adapters/fetchers) antes de mexer em UI 3D profunda
4. Separar “erro de tipagem R3F” de “erro de lógica app” para atacar em paralelo
5. Registrar baseline de erros por categoria para medir burn-down por onda

## 3) Tribunal técnico (KEEP / SALVAGE / KILL / REBUILD / OWNER_ONLY)
| ITEM | STATUS_ATUAL | SENTENCA | MOTIVO | PRIORIDADE |
|---|---|---|---|---|
| Branch canônico de execução | Alinhado após criação local | KEEP | Reposiciona executor no trilho soberano da fase | P0 |
| Pipeline de build+test | Passando | KEEP | Entrega evidência de executabilidade mínima | P0 |
| Qualidade lint/typecheck | Quebrada | REBUILD | Gate de qualidade está incompatível com baseline real | P0 |
| Núcleo de fluxo sagrado | Presente | KEEP | Invariante do organismo preservada | P0 |
| Superfície 3D (typing) | Instável no typecheck | SALVAGE | Funciona em build, mas com dívida crítica de tipagem | P1 |
| Massa de `any` herdada | Elevada | SALVAGE | Débito acumulado com risco de drift técnico | P1 |
| Decisão de escopo PLv6.2-b+ | Em gate | OWNER_ONLY | Direção de produto depende do owner | P1 |
| Qual PM canônico final (npm vs bun) | Bloqueio histórico aberto | OWNER_ONLY | Afeta higiene e política de lockfile | P1 |
| Gate de dados sensíveis (.env/histórico) | Bloqueio histórico aberto | OWNER_ONLY | Segurança e compliance sob arbitragem do owner | P0 |

## 4) Ordem de assalto funcional recomendada
1. **Frente qualidade-base / motivo:** restaurar confiança em lint+typecheck / **impacto:** reduz regressão e acelera merge seguro.
2. **Frente tipagem de borda de dados / motivo:** eliminar `any` nos pontos de entrada de dados / **impacto:** estabiliza contratos do sistema.
3. **Frente 3D typing recovery / motivo:** tratar incompatibilidades JSX/R3F por lote / **impacto:** destrava typecheck sem reescrever produto.

## 5) Owner-only (gates externos)
- Confirmar prioridade de PLv6.2-b (NewsAPI vs project_metrics vs portfolio page)
- Confirmar PM canônico definitivo para higiene de lockfiles
- Deliberar sobre bloqueios históricos de segredos/histórico (`.env`)

## 6) Quick wins
- Corrigir hooks-order violations explícitos
- Trocar `any` por tipos mínimos em hooks de integração
- Criar checklist de categoria de erros para lint/typecheck por onda
- Aplicar correções mecânicas de `prefer-const` e `no-empty` nos arquivos críticos
