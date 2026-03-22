# DATA_LAYER_STRATEGY — Estratégia Canónica de Camadas de Dados

> Documento de arquitectura de dados do produto Eternal Nexus.
> Append-safe. Novas layers ou revisões adicionam secções — nunca apagam as anteriores.
> Em caso de conflito com `docs/NEXUS_OS.md`, o NEXUS_OS prevalece.

**Criado em:** 2026-03-20
**Criado por:** @claude | claude-sonnet-4-6 | PLv5.1
**Última revisão:** 2026-03-20

---

## PRINCÍPIO FUNDADOR

> A arquitectura de dados entra por **confiabilidade**, não por hype.

**Layer 1 é a fundação inabalável.**
**Layer 3 pode falhar sem quebrar Layer 1.**

A inovação forte deste produto não está nos dados em si — está na **composição**, na **triangulação** e na **orquestração** entre camadas abertas. Qualquer fonte aberta pode ser combinada de formas originais e fora da curva. Isso é o diferencial real.

---

## CRITÉRIO DE PRIORIZAÇÃO

Por que dados sólidos entram primeiro:

| Critério | Descrição |
|---|---|
| **Confiabilidade** | Fonte com histórico provado de uptime, documentação estável, sem breaking changes frequentes |
| **Ausência de autenticação obrigatória** | Elimina dependência de segredos, rotação de chaves, autorizações de terceiros |
| **CORS habilitado para browser** | Permite fetch directo do cliente sem proxy server |
| **Dados normalizados e documentados** | Reduz transformação, reduz bugs silenciosos |
| **Degradação graciosa** | Se falhar, o sistema mostra estado degradado honesto — não crash, não silêncio |

Por que dados frágeis entram por último:

| Critério | Razão para esperar |
|---|---|
| **Dependência de auth** | Credenciais podem ser revogadas, rotadas, expirar em prod |
| **Dados proprietários do owner** | Bloqueados até decisão explícita (B-001) |
| **APIs com rate limits restritivos** | Risco de degradação em produção sob carga |
| **Fontes instáveis ou experimentais** | Alta entropia — quebram a fundação se entram cedo |
| **Real-time firehoses** | Custo de infraestrutura, latência imprevisível, contrato de terceiro |

---

## LAYER 1 — Fundação Aberta

**Definição:** Fontes públicas, sem auth obrigatória, CORS habilitado, alta confiabilidade histórica, dados normalizados.

**Regra de ouro:** se Layer 1 falhar, o sistema degrada para um fallback visível e honesto — nunca crash, nunca dado falso apresentado como real.

### Fontes Layer 1 activas (PLv4 + PLv5.1)

| Fonte | Base URL | Dados fornecidos | Órgão consumidor | Estado |
|---|---|---|---|---|
| **Open-Meteo** | `https://api.open-meteo.com` | Temperatura, UV, precipitação, chuva | ATLAS | ✅ Activo desde PLv3 |
| **USGS Earthquake Feed** | `https://earthquake.usgs.gov` | Sismos M4.5+ / 24h — magnitude, localização | GEOPOLITICS | ✅ Activo desde PLv4 |
| **World Bank Open Data** | `https://api.worldbank.org/v2` | GDP, FDI, indicadores macro por país | INVESTOR | ✅ Activo desde PLv5.1 |
| **Runtime (browser)** | — (estado de sessão) | Duração da sessão, operações processadas | NEXUS | ✅ Activo desde PLv5.1 |
| **Pipeline derivado** | — (TanStack + aggregator) | Contagem de entradas indexadas, fluxo recente | INDEX, NEWS, TRIBUNAL | ✅ Activo desde PLv2/PLv4 |

### Fontes Layer 1 identificadas — não implementadas ainda

| Fonte | Dados | Órgão potencial | Condição de entrada |
|---|---|---|---|
| **REST Countries API** | Dados estruturados por país (capital, população, bandeira, língua) | ATLAS sidebar, GEOPOLITICS | Gate owner: confirmar se necessário antes de implementar |
| **OWID (Our World in Data) CSVs** | Saúde, educação, energia, ambiente — dados históricos robustos | ATLAS, INDEX | Gate owner: confirmar necessidade de health/education layer |
| **OpenAQ** | Qualidade do ar por estação — sem auth, boa cobertura global | ATLAS, GEOPOLITICS | Gate owner: complementar Open-Meteo |
| **Nominatim (OpenStreetMap)** | Geocodificação reversa, detalhes de localização | ATLAS street view | Gate owner: confirmar necessidade de geocodificação |

---

## LAYER 2 — Dados Operacionais Confirmados

**Definição:** Fontes confiáveis que requerem auth controlada já existente no sistema (Supabase), ou chave de API gratuita de baixo risco, ou dados específicos do produto.

**Regra:** Layer 2 pode degradar para Layer 1 sem quebrar o sistema. Auth de Layer 2 nunca deve ser um ponto único de falha.

### Fontes Layer 2 activas

| Fonte | Dados | Órgão consumidor | Estado |
|---|---|---|---|
| **Supabase** — `project_metrics`, `activity_log`, `system_status`, `project_progress` | Métricas de produto, actividade, estado de serviços | DASHBOARD | ✅ Activo |
| **Supabase** — `public_contributions`, `contribution_votes` | Contribuições da comunidade | HOME | ✅ Activo |
| **Supabase** — `metric_history` | Histórico de métricas (30d) | DASHBOARD charts | ✅ Activo com fallback mock |

### Fontes Layer 2 identificadas — pendentes

| Fonte | Dados | Órgão potencial | Condição de entrada |
|---|---|---|---|
| **NewsAPI.org** (free tier) | Manchetes por país/tema/keyword | NEWS | Chave gratuita — gate owner: chave de API |
| **Supabase** — `projects` table | Dados estruturados dos projectos (DeltaSpine, GeoCorepower, etc.) | HOME gallery, INVESTOR | Gate owner: criar tabela + migração |
| **Alpha Vantage** (free tier) | Indicadores económicos, FX rates | INVESTOR complemento | Chave gratuita — gate owner |
| **OWID CSVs via fetch** | Health / climate time series | ATLAS health layer | Gate owner: confirmar necessidade |

---

## LAYER 3 — Dados Avançados / Proprietários / Experimentais

**Definição:** Fontes que requerem dados do owner, credenciais sensíveis, infra não confirmada, ou que têm alta variabilidade. Podem falhar sem comprometer Layer 1 ou Layer 2.

**Regra:** Nenhum componente crítico deve depender exclusivamente de Layer 3.

| Fonte | Dados | Órgão potencial | Condição de entrada |
|---|---|---|---|
| **Owner proprietary** | Pipeline real DeltaSpine ($2.8B), estrutura de investimento, KPIs internos | INVESTOR | B-001 owner gate — credenciais / dados sensíveis |
| **EI Agent runtime state** | Estado dinâmico de zeta-9, kronos, nanobanana em produção | NEXUS | Nova infra PLv6+ — EI orchestration layer |
| **Real-time financial feeds** | Taxas de câmbio ao vivo, índices de bolsa | INVESTOR | API key comercial + custo + rate limits |
| **Real-time news firehose** | Feeds proprietários de notícias em tempo real | NEWS | Custo + acordo com fornecedor |
| **Government tender APIs** | Licitações governamentais (Portugal, EU) | HOME, INVESTOR | Semi-proprietário, acesso país-específico, variável |
| **AI-generated content** | Briefings automáticos via LLM, sumários de análise | NEXUS, NEWS | Custo, latência, reliability da API |
| **Satellite / remote sensing** | Dados de ocupação do solo, temperatura oceânica, cobertura florestal | ATLAS | Custo elevado, dados grandes, processamento necessário |

---

## ARQUITECTURA DE COMPOSIÇÃO

A inovação deste produto não está em ter fontes exóticas — está em **como as fontes se relacionam**.

```
Layer 1 (fundação)
  Open-Meteo → temperatura, clima
  USGS       → actividade sísmica
  World Bank → macro económico
  Session    → runtime do sistema
         │
         ▼
   useIndexOrgan (agregador)
   aggregateOrganism(verdicts, realtimeData)
   → IndexEntry[] por categoria + severity + recency
         │
         ├──→ ATLAS    (clima real)
         ├──→ TRIBUNAL (verdicts)
         ├──→ INDEX    (entradas agregadas)
         ├──→ NEWS     (fluxo recente)
         ├──→ GEOPOLITICS (sismos)
         ├──→ INVESTOR (macro NL)
         └──→ NEXUS    (sessão activa)

Layer 2 (produto)
  Supabase → dashboard metrics
           → contributions
           → metric_history
         │
         ▼
   DashboardPage (isolado — não contamina Layer 1)

Layer 3 (futuro)
  Owner data    → INVESTOR (valores reais)
  EI state      → NEXUS (orchestration)
  [removível sem breaking Layer 1 ou Layer 2]
```

### Princípios de composição

1. **Triangulação**: cruzar dados de fontes independentes para enriquecer a leitura. Ex: clima (Open-Meteo) + sismos (USGS) + tensão económica (World Bank) → indicador de instabilidade regional
2. **Fallback em cascata**: se Layer N falha, mostra dado de Layer N-1 com label honesto
3. **Separação de domínios**: nenhum hook de Layer 1 depende de credenciais de Layer 2/3
4. **Single-source principle**: cada órgão tem UMA fonte primária definida + fallback — nunca duas fontes disputando o mesmo campo sem hierarquia clara
5. **Pipeline unidireccional**: Tribunal → Atlas → Index → News (sagrado, imutável nesta fase)

---

## ESTADO ACTUAL DAS LAYERS (2026-03-20)

| Órgão | Layer activa | Fonte primária | isLive | PLv |
|---|---|---|---|---|
| **TRIBUNAL** | Layer 1 | TanStack Query (verdicts da sessão) | ✅ true | PLv3 |
| **ATLAS** | Layer 1 | Open-Meteo — temperatura Mindelo | ✅ true | PLv3 |
| **INDEX** | Layer 1 | useIndexOrgan — entradas agregadas | ✅ true | PLv4 |
| **NEWS** | Layer 1 | Derivado do INDEX (última hora) | ✅ true | PLv4 |
| **GEOPOLITICS** | Layer 1 | USGS M4.5+ / 24h | ✅ true | PLv4 |
| **NEXUS** | Layer 1 | Session timer — runtime do sistema | ✅ true | PLv5.1 |
| **INVESTOR** | Layer 1 | World Bank — GDP Países Baixos | ✅ true | PLv5.1 |
| **DASHBOARD** | Layer 2 | Supabase — 4 tabelas | ✅ true | independente |

**Milestone:** 7/7 órgãos com Layer 1 activa após PLv5.1.

---

## FRONTEIRA EXPLÍCITA PLv5.1

```
DENTRO (implementado nesta onda):
✅ World Bank Open Data → INVESTOR (NL GDP, sem auth)
✅ Session timer → NEXUS (runtime do sistema, sem API)
✅ DATA_LAYER_STRATEGY.md como documento canónico

FORA (Layer 2 — próxima onda):
❌ NewsAPI.org para NEWS (chave gratuita — gate owner)
❌ Supabase projects table (nova migração — gate owner)
❌ Alpha Vantage / FX rates (chave — gate owner)

FORA (Layer 3 — futuro):
❌ Owner proprietary pipeline numbers
❌ EI agent real-time state
❌ Real-time financial feeds
❌ AI-generated content layer
```

---

*DATA_LAYER_STRATEGY v1.0 | 2026-03-20 | @claude | PLv5.1*
