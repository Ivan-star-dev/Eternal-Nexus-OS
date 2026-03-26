# RELATÓRIO DE AUDITORIA CANÓNICA TOTAL — SITE VS REPO

**Versão:** v1.0
**Data:** 2026-03-26
**Executor:** @antigravity | Antigravity (Google DeepMind)
**Classificação:** SOBERANO — Ordem de Purga
**Base Canônica Usada (Fonte da Verdade):**
- `docs/NEXUS_OS.md` (A Lei Máxima)
- `docs/DOC_FASE3.md` (Governança e limites da Fase 3)
- `ops/SYSTEM_FACE_CANON.md` (Trindade: System, Product, Ecosystem)
- `docs/FOUNDER_VISION_LAYER.md` (A camada pública do Founder)
- `ops/PORTAL_IMERSIVO_ORGANISM.md` (A experiência de produto)

---

## 1. RESUMO EXECUTIVO

**Grau de alinhamento atual:** CRÍTICO / FRAGMENTADO.
O repositório sofreu mutações e incorporou escombros de direções de produto abandonadas e experiências paralelas (como a temática "Geopolítica / Nacional"). O organismo apresenta órgãos vitais saudáveis ao lado de tumores narrativos completos que não têm qualquer suporte nos documentos fundacionais da Trindade (System, Product, Ecosystem).

**Principais desvios:**
1. **Presença de páginas Governamentais/Geopolíticas:** Uma vasta área do site (Salas de Crise, Educação Nacional, Comando Geopolítico) não existe no canon atual do Eternal Nexus OS.
2. **Duplicação de rotas:** Existência de múltiplas páginas para investidores e galerias cujo propósito colide com a Founder Vision Layer e o Portal Imersivo.
3. **Páginas zumbis no `App.tsx`:** Importação de rotas (`GlobePage`, `LabPage`, etc.) que ameaçam quebrar o runtime caso o ficheiro associado não exista ou não obedeça ao canon.

**Estado geral do organismo:**
A árvore precisa de poda severa. A sobrevivência técnica e auditória do projeto depende da aplicação implacável das leis de exclusão. Apenas o que reside nos blueprints de sistema (`NEXUS_OS`, `FACES`, `FOUNDER_LAYER`, `SACRED_FLOW`) tem o direito de respirar.

---

## 2. ELEMENTOS CONFIRMADOS (CLASSE A)
*Explicitamente suportados pela Repo → PERMANECEM*

- **O Fluxo Sagrado (Sacred Flow):** `AtlasPage.tsx`, `Index.tsx`, `NewsPortal.tsx`, `src/components/tribunal/` (Protegido por `docs/NEXUS_OS.md` e `docs/DOC_FASE3.md`).
- **As 3 Faces Canónicas:**
  - `SystemFacePage.tsx` (Motor governança, cockpit soberano).
  - `NexusPage.tsx` (Product Face / Immersive Portal / Heaven Lab flagship).
- **A Camada do Fundador:** `FounderPage.tsx` (Protegida por `docs/FOUNDER_VISION_LAYER.md`).
- **Obras da Linha de Produto:** `ProjectPage.tsx`, `Projects.tsx` (Galeria de projetos e instâncias de workspace ativas).
- **Estruturas de Controlo e Governança:** `OwnerDashboard.tsx`, `DashboardPage.tsx` (O acesso interno e a gestão operativa).
- **Esqueleto Padrão:** `NotFound.tsx`, `ErrorPage.tsx`, `PrivacyPolicy.tsx`, `Terms.tsx`.

---

## 3. ELEMENTOS PARCIALMENTE ALINHADOS (CLASSE B)
*Não explícitos, mas necessários para sustentar a visão → FICAM EM OBSERVAÇÃO/REDUÇÃO*

- `IndexPage.tsx`: Redundante em relação a `Index.tsx`. Apenas UM Index deve permanecer como parte do Fluxo Sagrado. O outro deve ser purgado após verificação lógica.
- `Gallery.tsx`: Confunde-se com `Projects.tsx` ou com a montra visual do NexusPage. Deve ser consolidado ou apagado.

---

## 4. ELEMENTOS NÃO SUPORTADOS (CLASSE C)
*Não suportados pela Repo → REMOVER*

- `About.tsx`: A `Founder Vision Layer` substitui a necessidade de páginas "Sobre" banais. Excesso.
- `GovAuth.tsx`: O dashboard é governado pelo `OwnerDashboard`, autenticação governamental isolada não faz parte do OS.
- `InvestorBriefing.tsx` & `InvestorNexusPortal.tsx`: Redundância especulativa. O produto deve ser a prova, não precisamos de múltiplos portais de pitch separados da narrativa canónica do `FounderPage` e `NexusPage`.
- `PersonalLens.tsx`: Desvio de escopo, especulação de funcionalidade não canónica.
- `NexusOrganismBuilder.tsx`: Não presente no arquitetural `SYSTEM_FACE_CANON.md` nem validado pelo `NEXUS_OS.md`.

---

## 5. ELEMENTOS QUE CONTRADIZEM A REPO (CLASSE D)
*Sabotam a visão ativamente → REMOVER IMEDIATAMENTE*

Toda a linha "Geopolítica Nacional" e governamental é um parasita do organismo real atual (O cockpit do Eternal Nexus OS e o laboratório espacial Heaven Lab). Sabotam a coesão atmosférica e a promessa do produto.
**Alvos confirmados para destruição:**
- `CentroComandoGeopolitico.tsx`
- `EducacaoNacional.tsx`
- `PlataformaNacional.tsx`
- `SalaDeCrise.tsx`
- `CanalTransparencia.tsx`
- `Geopolitics.tsx`
- `GeopoliticsNarrative.tsx`
- `IntelligenceFeed.tsx`

---

## 6. PLANO DE LIMPEZA E EXECUÇÃO

**Passo 1: Destruição do Tumor (Classe D & C)**
- Eliminar fisicamente todos os arquivos identificados nas Classes C e D (`src/pages/*`).
- Remover qualquer referência a estes arquivos em componentes, links ou menus.

**Passo 2: Reparação do Sistema de Rotas (`App.tsx`)**
- Limpar `src/App.tsx` de rotas mortas (`/geopolitics`, `/access`, `/investor/*`, `/about`, etc).
- Resolver as importações "fantasmas" no topo do `App.tsx` (`GlobePage`, `LabPage`, `SchoolPage`, `WorkshopPage`) que não foram localizadas na listagem física, consertando as referências visuais que ferem a constituição (substituindo-as pelo Sacred Flow e Faces canónicas).

**Passo 3: Consolidação do Core (Classe B)**
- Escolher definitivamente entre `Index.tsx` e `IndexPage.tsx`, garantindo que apenas um existe como a fundação do sacred flow; destruir o redundante.

**Risco da remoção:** Minimal. O core operacional (BASTION, Tribunal, Atlas) não depende da "Sala de Crise" ou da "Educação Nacional". O runtime ficará muito mais eficiente.

---

## 7. ESTADO FINAL ALVO

Ao fechar esta operação de purga, `src/pages/` conterá:
1. `AtlasPage.tsx`
2. `Index.tsx`
3. `NewsPortal.tsx`
4. `SystemFacePage.tsx`
5. `NexusPage.tsx`
6. `FounderPage.tsx`
7. `DashboardPage.tsx`
8. `OwnerDashboard.tsx`
9. `ProjectPage.tsx`
10. `Projects.tsx`
11. Padrões (`Terms.tsx`, `PrivacyPolicy.tsx`, `NotFound.tsx`, `ErrorPage.tsx`)

O `App.tsx` irá espelhar puramente este ecossistema real e a aplicação deixará de carregar peso morto arquitetónico e ruído de design. O site corresponderá estritamente, em cada byte, ao canon da repo.
