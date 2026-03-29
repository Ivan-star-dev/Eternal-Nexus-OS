import deltaSpineHero from "@/assets/deltaspine-hero.jpg";
import deltaSpineRender from "@/assets/deltaspine-render.png";
import deltaspineTech1 from "@/assets/deltaspine-technical-1.jpg";
import deltaspineTech2 from "@/assets/deltaspine-technical-2.jpg";
import deltaspineTech3 from "@/assets/deltaspine-technical-3.jpg";
import underwaterInfra from "@/assets/underwater-infra.jpg";
import deltaspineAerial from "@/assets/deltaspine-aerial-view.jpg";
import deltaspineCutaway from "@/assets/deltaspine-cutaway.jpg";
import deltaspineDiagram from "@/assets/deltaspine-diagram-1.jpg";
import deltaspineAmsterdamCanals from "@/assets/deltaspine-amsterdam-canals.jpg";
import deltaspineNetworkMap from "@/assets/deltaspine-network-map.jpg";
import geocoreHero from "@/assets/geocore-power-hero.jpg";
import geocoreRender from "@/assets/geocore-power-render.png";
import geocoreTech1 from "@/assets/geocore-technical-1.jpg";
import geocoreTech2 from "@/assets/geocore-technical-2.jpg";
import geocoreTech3 from "@/assets/geocore-technical-3.jpg";
import geocoreConcept1 from "@/assets/geocore-concept-1.jpg";
import geocoreMhdDetail from "@/assets/geocore-mhd-detail.jpg";
import geocoreVolcanic from "@/assets/geocore-volcanic-site.jpg";
import geocoreCrossSection from "@/assets/geocore-cross-section.jpg";
import geocoreDiagram from "@/assets/geocore-diagram-1.jpg";
import geocorePicoDoFogo from "@/assets/geocore-pico-do-fogo.jpg";
import geocoreStationRender from "@/assets/geocore-station-render.jpg";
import terraLentaHero from "@/assets/terra-lenta-hero.jpg";
import terraLentaRender from "@/assets/terra-lenta-render.png";
import terraLentaTech1 from "@/assets/terra-lenta-technical-1.jpg";
import terraLentaTech2 from "@/assets/terra-lenta-technical-2.jpg";
import terraLentaTech3 from "@/assets/terra-lenta-technical-3.jpg";
import terraLentaConcept1 from "@/assets/terra-lenta-concept-1.jpg";
import terraLentaUrban from "@/assets/terra-lenta-urban.jpg";
import terraLentaDiagram from "@/assets/terra-lenta-diagram-1.jpg";
import terraLentaSeismicMap from "@/assets/terra-lenta-seismic-map.jpg";
import terraLentaComplexRender from "@/assets/terra-lenta-complex-render.jpg";
import fusionCoreHero from "@/assets/fusion-core-hero.jpg";
import fusionCoreRender from "@/assets/fusion-core-render.png";
import fusionCoreTech1 from "@/assets/fusion-core-technical-1.jpg";
import fusionCoreTech2 from "@/assets/fusion-core-technical-2.jpg";
import fusionCoreTech3 from "@/assets/fusion-core-technical-3.jpg";
import fusionCoreConcept1 from "@/assets/fusion-core-concept-1.jpg";
import fusionCoreReactor from "@/assets/fusion-core-reactor.jpg";
import fusionCoreDiagram from "@/assets/fusion-core-diagram-1.jpg";
import fusionCoreFacility from "@/assets/fusion-core-facility.jpg";
import chipFoldHero from "@/assets/chip-fold-hero.jpg";
import chipFoldRender from "@/assets/chip-fold-render.png";
import chipFoldTech1 from "@/assets/chip-fold-technical-1.jpg";
import chipFoldTech2 from "@/assets/chip-fold-technical-2.jpg";
import chipFoldTech3 from "@/assets/chip-fold-technical-3.jpg";
import chipFoldConcept1 from "@/assets/chip-fold-concept-1.jpg";
import chipFoldMacro from "@/assets/chip-fold-macro.jpg";
import chipFoldDiagram from "@/assets/chip-fold-diagram-1.jpg";
import chipFoldSemFibers from "@/assets/chip-fold-sem-fibers.jpg";
import chipFoldProductRender from "@/assets/chip-fold-product-render.jpg";

export interface ProjectMetric {
  value: string;
  unit: string;
  label: string;
  delta?: string;
}

export interface ProjectPillar {
  num: string;
  title: string;
  desc: string;
  stat: string;
  statLabel: string;
}

export interface ProjectSection {
  num: string;
  title: string;
  body: string;
}

export interface ProjectTimelineItem {
  year: string;
  phase: string;
  desc: string;
  cost: string;
  status: "past" | "now" | "future";
}

export interface TechSpec {
  label: string;
  value: string;
  detail?: string;
}

export interface RiskItem {
  risk: string;
  probability: string;
  impact: string;
  mitigation: string;
}

export interface NLSubSection {
  icon: string;
  title: string;
  subtitle: string;
  stats: string;
  desc: string;
  metrics: { value: string; label: string }[];
}

export interface ConceptImage {
  src: string;
  caption: string;
}

export type ArtifactKind = "render" | "technical" | "concept" | "diagram";

export const ARTIFACT_KIND_LABELS: Record<ArtifactKind, string> = {
  render: "CGI RENDER",
  technical: "TECHNICAL DRAWING",
  concept: "CONCEPT",
  diagram: "ENGINEERING DIAGRAM",
};

export interface FinancialPhase {
  phase: string;
  cost: string;
  timeline: string;
  roi: string;
}

export interface AnnualBenefit {
  driver: string;
  value: string;
  certainty: "HIGH" | "MEDIUM" | "LOW" | "THEORETICAL" | "MODELLED";
}

export interface FinancialData {
  totalInvestment: string;
  paybackYears: string;
  phases: FinancialPhase[];
  annualBenefits: AnnualBenefit[];
}

export interface ProjectData {
  number: string;
  title: string;
  subtitle: string;
  country: string;
  classification: string;
  version: string;
  heroImage: string;
  renderImage: string;
  technicalImages: string[];
  conceptImages?: ConceptImage[];
  secondaryImage: string;
  summary: string;
  whitepaperName: string;
  pillars: ProjectPillar[];
  metrics: ProjectMetric[];
  sections: ProjectSection[];
  timeline: ProjectTimelineItem[];
  techSpecs?: TechSpec[];
  riskMatrix?: RiskItem[];
  nlSubSections?: NLSubSection[];
  financial?: FinancialData;
  status?: string;
}

const projectData: Record<string, ProjectData> = {
  "deltaspine-nl": {
    number: "NPI-001",
    title: "DeltaSpine NL",
    subtitle: "Infraestrutura Subaquática Modular Multifuncional",
    country: "Netherlands",
    classification: "CONFIDENTIAL",
    version: "v2.0 Final",
    heroImage: deltaSpineHero,
    renderImage: deltaSpineRender,
    technicalImages: [deltaspineTech1, deltaspineTech2, deltaspineTech3],
    conceptImages: [
      { src: deltaspineAerial, caption: "Vista aérea — sistema de tubos modulares nos canais de Amsterdão com cápsulas de transporte" },
      { src: deltaspineCutaway, caption: "Corte transversal — módulo subaquático com fibra óptica, filtração e sistema de transporte" },
      { src: deltaspineDiagram, caption: "Diagrama técnico — corte transversal do tubo modular com subsistemas integrados (transporte, filtração, H₂, sensores)" },
      { src: deltaspineAmsterdamCanals, caption: "Canais de Amsterdão — rede concêntrica de canais históricos, localização do piloto DeltaSpine de 4 km" },
      { src: deltaspineNetworkMap, caption: "Mapa da rede hidrográfica holandesa — 6.500 km de canais navegáveis com cobertura nacional" },
    ],
    secondaryImage: underwaterInfra,
    whitepaperName: "WhitePaper_Infraestrutura_Subaquatica_NL_v2.pdf",
    summary:
      "Este documento propõe a criação de uma infraestrutura subaquática modular, instalada de forma reversível no fundo dos canais holandeses, que funciona como espinha dorsal nacional multifuncional — servindo mobilidade, logística, regeneração ambiental, energia distribuída e backbone de dados.",
    techSpecs: [
      { label: "Diâmetro Tubo", value: "1.8–2.2 m", detail: "Segmentos modulares de 8–12m" },
      { label: "Velocidade Cápsula", value: "140 km/h", detail: "Mobilidade privada on-demand" },
      { label: "Rede Total", value: "6,500 km", detail: "Canais navegáveis existentes" },
      { label: "Profundidade", value: "2.5–4 m", detail: "Fundo dos canais, reversível" },
      { label: "Recuperação N₂", value: "-25%", detail: "Azoto removido continuamente" },
      { label: "Produção H₂", value: "Distribuída", detail: "Energia cinética + térmica" },
      { label: "Sensor Grid", value: "6,500 km", detail: "Monitorização ambiental 24/7" },
      { label: "Instalação", value: "Reversível", detail: "Sem alteração do fluxo da água" },
    ],
    riskMatrix: [
      { risk: "Interferência com navegação fluvial", probability: "Média (40%)", impact: "Médio", mitigation: "Instalação no fundo; zonas de exclusão em rotas prioritárias; sinalização activa" },
      { risk: "Corrosão e biofouling", probability: "Alta (60%)", impact: "Médio", mitigation: "Liga naval 316L; revestimento anti-fouling; manutenção modular 18 meses" },
      { risk: "Oposição regulamentar", probability: "Média (35%)", impact: "Alto", mitigation: "Parceria Rijkswaterstaat + TU Delft desde Fase 0; piloto reversível" },
      { risk: "Custo de piloto excede €240M", probability: "Média (30%)", impact: "Médio", mitigation: "Faseamento por km; contratos EPC com cap; co-financiamento EU" },
      { risk: "Falha de cápsula a 140km/h", probability: "Baixa (10%)", impact: "Muito Alto", mitigation: "Redundância tripla; travagem magnética; compartimentos pressurizados" },
    ],
    pillars: [
      { num: "01", title: "Mobilidade Privada", desc: "Cápsulas humanas de alta velocidade (até 140 km/h) em tubos subaquáticos nos canais holandeses. Alternativa premium, privada e on-demand ao transporte ferroviário convencional.", stat: "140", statLabel: "km/h max" },
      { num: "02", title: "Logística Automatizada", desc: "Sistema de entregas 24/7 por cápsulas autónomas no fundo dos canais, eliminando carrinhas urbanas, reduzindo congestionamento e emissões nas cidades.", stat: "24/7", statLabel: "autonomous" },
      { num: "03", title: "Regeneração Ambiental", desc: "Tratamento contínuo e distribuído da água dos canais: remoção de azoto, fósforo e microplásticos. Monitorização em tempo real da qualidade da água.", stat: "-25%", statLabel: "N reduction" },
      { num: "04", title: "Energia Distribuída", desc: "Recuperação de energia cinética e térmica ao longo da rede. Produção de hidrogénio verde distribuído. Integração com rede energética nacional.", stat: "H₂", statLabel: "green energy" },
      { num: "05", title: "Backbone de Dados", desc: "Rede de sensores distribuída ao longo de 6,500 km de canais. Dados ambientais, estruturais e operacionais em tempo real.", stat: "6,500", statLabel: "km sensor grid" },
    ],
    metrics: [
      { value: "6,500", unit: "km", label: "CANAL NETWORK", delta: "Densest network globally" },
      { value: "€200M", unit: "", label: "PILOT INVESTMENT", delta: "4 km Amsterdam corridor" },
      { value: "€600M", unit: "", label: "ANNUAL SAVINGS", delta: "Water + logistics + fines" },
      { value: "5", unit: "", label: "SYSTEM PILLARS", delta: "Integrated architecture" },
    ],
    sections: [
      { num: "01", title: "Contexto Holandês", body: "Os Países Baixos possuem a rede de canais mais densa e bem mantida do mundo — mais de 6,500 km de corredores navegáveis que atravessam o país inteiro. Esta infraestrutura existente representa um ativo estratégico inexplorado. A forte cultura de planeamento hídrico, modularidade e pragmatismo institucional holandês cria o ambiente perfeito para esta inovação." },
      { num: "02", title: "Problema Actual", body: "Comboios eficientes mas não privados nem on-demand — saturação em horários críticos. Crescimento exponencial de entregas com dependência de carrinhas e motoristas. Tratamento da água dos canais maioritariamente reativo. Os Países Baixos enfrentam obrigações legais urgentes sob a Water Framework Directive e a sentença KRW 2027." },
      { num: "03", title: "Solução Proposta", body: "Um frame estrutural tubular, modular e reversível, ancorado no fundo dos canais com diâmetro de ≈ 1,8–2,2 m em segmentos de 8–12 m. Instalação faseada sem alteração do fluxo da água. O frame não é apenas um túnel — é uma plataforma de serviços integrada que aproveita a infraestrutura existente como corredor, combinando cinco funções críticas numa única estrutura soberana." },
    ],
    timeline: [
      { year: "2026", phase: "Phase 0 — Concept & Validation", desc: "White paper publication, institutional presentations, Rijkswaterstaat engagement, TU Delft collaboration", cost: "€2–5M", status: "now" },
      { year: "2027", phase: "Phase 1 — Amsterdam Pilot", desc: "4 km pilot segment in Amsterdam canal corridor. Modular frame deployment, capsule prototype testing", cost: "€180–240M", status: "future" },
      { year: "2029", phase: "Phase 2 — Regional Expansion", desc: "Expansion to major inter-city routes: Amsterdam–Rotterdam, Amsterdam–Utrecht corridors", cost: "€1.2–2B", status: "future" },
      { year: "2032+", phase: "Phase 3 — National Network", desc: "Full-scale national backbone deployment across 6,500 km canal network", cost: "€8–12B", status: "future" },
    ],
    nlSubSections: [
      {
        icon: "building",
        title: "Moradia Acessível",
        subtitle: "Rede Distribuída Modular — Solução Fechada",
        stats: "412.000 casas faltando | 36 meses | 120k unidades | €95k/unidade",
        desc: "412.000 casas em falta na Holanda (CBS 2026). Aluguel médio Amsterdam: €1.800/mês para 50m². O sistema atual opera numa lógica linear rígida: terra → licença → obra → venda. A solução: ativar 1,2 milhões de m² de escritórios vazios pós-pandemia com módulos pré-fabricados de 30–50m² (jovens), 60–80m² (integrados), 100m² (famílias). Conversão em 90 dias vs 3 anos de licença convencional.",
        metrics: [
          { value: "412k", label: "casas em falta" },
          { value: "€95k", label: "por unidade" },
          { value: "1.2M m²", label: "escritórios vazios" },
          { value: "90 dias", label: "conversão" },
        ],
      },
      {
        icon: "grid",
        title: "Grid Congestion",
        subtitle: "Traffic Shaping Energético — Solução Fechada",
        stats: "3,8 GW liberados | 12 meses | EUR 1,2B | 5% de risco",
        desc: "92% da capacidade de conexão nova esgotada em Randstad (TenneT 2026). 40% das empresas de renováveis cancelam projetos por falta de grid. Pico de demanda: 25 GW entre 18h–21h, rede aguenta 18 GW. Solução: Traffic Shaping Energético — preço dinâmico obrigatório (€0,08/kWh off-peak vs €0,38–0,45/kWh pico), HEMS com deslocamento automático de carga EV, baterias comunitárias de 2ª vida. Impacto: -2,1 GW no pico só com preço dinâmico.",
        metrics: [
          { value: "3.8 GW", label: "liberados" },
          { value: "-35%", label: "carga pico" },
          { value: "€4.5B", label: "custo congestionamento/ano" },
          { value: "12 meses", label: "implementação" },
        ],
      },
      {
        icon: "users",
        title: "Migração & Asilo",
        subtitle: "Scoring Reverso de Recrutamento Humano",
        stats: "45 dias vs 18 meses | 35k talentos/ano | EUR 1,1B/ano",
        desc: "120.000 pedidos de asilo/ano na Holanda. 60% rejeitados mas remoção real só em 12%. Tempo médio: 18 meses a €28.000/caso/ano. 35.000 engenheiros, devs e enfermeiros qualificados perdidos no labirinto burocrático. Solução: Scoring Reverso em 72h na entrada (skill técnica 35%, idioma 20%, histórico 25%, saúde 10%, adaptação 10%). Fast-track de 45 dias para Tier 1. Hub de retorno voluntário com pacote de €5.000 + passagem para rejeitados.",
        metrics: [
          { value: "45 dias", label: "vs 18 meses" },
          { value: "35k", label: "talentos/ano" },
          { value: "€1.1B", label: "poupança/ano" },
          { value: "72h", label: "scoring" },
        ],
      },
    ],
    financial: {
      totalInvestment: "€180–240M (Phase 1)",
      paybackYears: "6–9 years",
      phases: [
        { phase: "Phase 0 — EIA", cost: "€8–12M", timeline: "2026", roi: "Regulatory validation" },
        { phase: "Phase 1A — Frame 4km", cost: "€90–120M", timeline: "2027–2028", roi: "Data from Day 1" },
        { phase: "Phase 1B — Operations", cost: "€90–120M", timeline: "2028–2030", roi: "First revenue 2028" },
        { phase: "Phase 2 — 80km", cost: "€2.4–3.8B", timeline: "2030–2035", roi: "ROI by 2033" },
        { phase: "Phase 3 — 800km", cost: "€24–40B", timeline: "2035–2045", roi: "€4–6B/yr at scale" },
      ],
      annualBenefits: [
        { driver: "Water treatment savings", value: "€180–240M", certainty: "HIGH" },
        { driver: "EU penalty avoidance", value: "€120–180M", certainty: "HIGH" },
        { driver: "Cargo logistics", value: "€60–100M", certainty: "MEDIUM" },
        { driver: "Passenger mobility", value: "€80–140M", certainty: "MEDIUM" },
        { driver: "Circular fertiliser", value: "€20–40M", certainty: "MEDIUM" },
      ],
    },
  },
  "geocore-power": {
    number: "NPI-002",
    title: "GeoCore Power",
    subtitle: "Sistema Fechado de Grafeno Dopado para EGS Vulcânico — Raiz Fogo",
    country: "Cabo Verde",
    classification: "CONFIDENTIAL — STRATEGIC",
    version: "v1.0",
    heroImage: geocoreHero,
    renderImage: geocoreRender,
    technicalImages: [geocoreTech1, geocoreTech2, geocoreTech3],
    conceptImages: [
      { src: geocoreConcept1, caption: "Perfuração EGS Vulcânica — Pico do Fogo, Chã das Caldeiras, Cabo Verde" },
      { src: geocoreMhdDetail, caption: "Gerador MHD — Conversão direta plasma → eletricidade via força de Lorentz" },
      { src: geocoreVolcanic, caption: "Estação geotérmica Raiz Fogo — caldeira vulcânica com torre de perfuração e geradores MHD" },
      { src: geocoreCrossSection, caption: "Corte geológico — perfil térmico de 30°C a 900°C com tubo híbrido SiC + grafeno até câmara magmática" },
      { src: geocoreDiagram, caption: "Diagrama EGS — corte geológico completo com gradiente térmico, tubo SiC+grafeno e câmara magmática a 5km" },
      { src: geocorePicoDoFogo, caption: "Pico do Fogo, Cabo Verde — caldeira vulcânica com Chã das Caldeiras e fumarolas activas, local do projecto Raiz Fogo" },
      { src: geocoreStationRender, caption: "Render fotorrealista — estação geotérmica Raiz Fogo com torre de perfuração e geradores MHD em terreno basáltico" },
    ],
    secondaryImage: geocoreTech1,
    whitepaperName: "RaizFogo_Blueprint_2026.pdf",
    techSpecs: [
      { label: "Gradiente Térmico", value: "80–100°C/km", detail: "Top 1% mundial (vs 30–50°C/km EGS padrão)" },
      { label: "Profundidade", value: "4–5 km", detail: "Basalto + câmara magmática" },
      { label: "Temp. a 5 km", value: "850–950°C", detail: "vs 200–400°C convencional" },
      { label: "Tubo Seção A", value: "SiC cerâmica", detail: "0–3 km, suporta 1.200°C" },
      { label: "Tubo Seção B", value: "Grafeno YBCO", detail: "3–5 km, 10.000 W/m·K" },
      { label: "MHD Eficiência", value: "40–60%", detail: "vs 15–25% turbinas (sem partes móveis)" },
      { label: "Campo Magnético", value: "0,5 Tesla", detail: "Bobina supercondutora" },
      { label: "Fluido Volume", value: "500–1.000 L/poço", detail: "$100–300k" },
    ],
    riskMatrix: [
      { risk: "Derretimento/falha do tubo", probability: "Baixa (15%)", impact: "Alto", mitigation: "SiC aguenta 1.200°C; sensor temp. real-time; resfriamento N₂ emergencial" },
      { risk: "Sobrepressão geológica", probability: "Média (25%)", impact: "Médio", mitigation: "Válvula alívio automática; monitoramento sísmico 24h; fechamento em 30s" },
      { risk: "Falha do fluido MHD", probability: "Baixa (10%)", impact: "Médio", mitigation: "Sistema termoelétrico backup; segundo loop de extração" },
      { risk: "Erupção vulcânica", probability: "Muito Baixa (3%)", impact: "Muito Alto", mitigation: "Sensores sísmicos OVSICORI; poço selado em 24h" },
      { risk: "Custo acima previsto", probability: "Média (30%)", impact: "Médio", mitigation: "Teste piloto 500m ($5M) antes do investimento total" },
    ],
    summary: "O Projeto Raiz Fogo utiliza o gradiente térmico vulcânico do Pico do Fogo (80–100°C/km — top 1% mundial) com grafeno multi-layer dopado com YBCO supercondutor + nanopartículas de prata (condutividade térmica de 10.000 W/m·K) e conversão MHD com 40–60% de eficiência. Ciclo fechado hermético — zero emissões, zero fracking, zero consumo de água. 80–120 MW por poço a $150–200M de investimento.",
    pillars: [
      { num: "01", title: "Tubo Híbrido SiC + Grafeno", desc: "Seção A (0–3 km): cerâmica SiC reforçada até 1.200°C. Seção B (3–5 km): grafeno multi-layer dopado com YBCO supercondutor. Condutividade térmica efetiva de 10.000 W/m·K — 16.000x superior à água.", stat: "10.000", statLabel: "W/m·K" },
      { num: "02", title: "Gerador MHD Direto", desc: "Fluido de grafeno dopado a 800–900°C entra em plasma ionizado. Sob campo magnético de 0,5 Tesla, a força de Lorentz gera corrente diretamente — sem turbinas, sem partes mecânicas, sem desgaste.", stat: "40–60%", statLabel: "eficiência" },
      { num: "03", title: "Ciclo Fechado Hermético", desc: "500–1.000 litros de fluido dopado por poço. Desce frio (~80°C), aquece a ~900°C, sobe e entrega calor ao MHD. Zero emissões, zero fracking, zero consumo de água.", stat: "0", statLabel: "emissões" },
      { num: "04", title: "Pico do Fogo — Top 1%", desc: "Gradiente térmico de 80–100°C/km vs 30–50°C/km em EGS convencional. Temperatura a 5 km: ~900°C vs ~200–400°C. Última erupção: 2014–2015 — calor residual extremamente alto.", stat: "900°C", statLabel: "a 5 km" },
      { num: "05", title: "ROI Excepcional", desc: "Venda local a $0,08–0,12/kWh (Cabo Verde paga $0,18/kWh em diesel). Exportação via cabo submarino HVDC. Créditos de carbono: ~$25M/ano. Payback: 3,5 anos após 5 poços.", stat: "28–35%", statLabel: "TIR" },
    ],
    metrics: [
      { value: "80–120", unit: "MW", label: "POR POÇO", delta: "Plena capacidade Fase 1" },
      { value: "$0.08", unit: "/kWh", label: "CUSTO LOCAL", delta: "vs $0.18 diesel actual" },
      { value: "10.000", unit: "W/m·K", label: "CONDUTIVIDADE", delta: "Grafeno dopado YBCO" },
      { value: "40–60%", unit: "", label: "MHD EFICIÊNCIA", delta: "Sem partes mecânicas" },
    ],
    sections: [
      { num: "01", title: "Contexto Geológico — Pico do Fogo", body: "O Pico do Fogo é um estratovulcão ativo na Ilha do Fogo, Cabo Verde, com altitude de 2.829 m e última erupção em 2014–2015. Gradiente térmico de 80–100°C/km (2–3x superior a EGS padrão), temperatura a 5 km de ~850–950°C (vs 200–400°C convencional). Local de perfuração: Chã das Caldeiras — planície vulcânica a ~1.700 m de altitude dentro da caldeira, com calor residual extremamente alto." },
      { num: "02", title: "Stack Tecnológico: Grafeno + MHD", body: "Tubo híbrido: Seção A (0–3 km) em cerâmica SiC reforçada até 1.200°C + Seção B (3–5 km) em grafeno multi-layer dopado com YBCO supercondutor e nanopartículas de prata — condutividade de 10.000 W/m·K. Fluido de trabalho em ciclo fechado hermético: desce a ~80°C, aquece a ~900°C, sobe como plasma ionizado. Gerador MHD converte diretamente via força de Lorentz sob campo de 0,5 Tesla — eficiência de 40–60% vs 15–25% de turbinas convencionais." },
      { num: "03", title: "Viabilidade & Impacto", body: "Investimento Fase 1: $150–200M para 80–120 MW. 5 poços (Ano 3): 400–600 MW, receita $180–260M/ano, EBITDA $135–215M/ano, payback 3,5 anos. 30 poços (Ano 8): 2,4–3,6 GW — 1–2% do consumo europeu. Cabo Verde alcança independência energética total, eliminando $150–200M/ano em importação de diesel. Replicável: Islândia, Quénia, Indonésia, Japão, Canárias." },
    ],
    timeline: [
      { year: "2026", phase: "Fase 0 — Validação & Protótipo 500m", desc: "Estudo geológico (magnetotelúrica + gravimetria), prototipagem do fluido grafeno dopado (Graphenea), teste tubo SiC a 1.200°C, concessão Cabo Verde, patentes PCT", cost: "$5–10M", status: "now" },
      { year: "2026–2027", phase: "Fase 1 — Perfuração Principal", desc: "Poço de 5 km vertical (26\" → 8.5\"), bits PDC a 70–80 ft/h, casing 316L, monitoramento sismológico 24h. Equipa: 25–30 (Schlumberger/SLB + vulcanólogos)", cost: "$80–120M", status: "future" },
      { year: "2027", phase: "Fase 2 — Sistema Térmico", desc: "Inserção tubo híbrido SiC+grafeno, injeção fluido dopado, instalação bobina supercondutora 0,5T, conexão gerador MHD (20t), subestação + linha São Filipe", cost: "$20–30M", status: "future" },
      { year: "2028", phase: "Fase 3 — Comissionamento", desc: "Startup gradual: 10 MW → 40 MW → 80 MW → 120 MW. Calibração campo magnético MHD. Conexão rede ELECTRA. Certificação ISO 50001", cost: "$10–15M", status: "future" },
      { year: "2029–2031", phase: "Fase 4 — Escala & Exportação", desc: "4 poços adicionais (400–600 MW). Cabo submarino HVDC para Senegal (400 km) ou Portugal (2.000 km). Exportação do modelo: Islândia, Quénia, Japão, Indonésia", cost: "$400–600M", status: "future" },
    ],
    financial: {
      totalInvestment: "$8B per well",
      paybackYears: "8 years per well",
      phases: [
        { phase: "PoC", cost: "$15–25B", timeline: "2026–2028", roi: "Technology validation" },
        { phase: "Pilot", cost: "$80–120B", timeline: "2028–2033", roi: "Breakeven well 5" },
        { phase: "Regional", cost: "$300–500B", timeline: "2033–2040", roi: "100–200%" },
        { phase: "Planetary", cost: "$1–2T", timeline: "2040–2050", roi: "Self-financed" },
      ],
      annualBenefits: [
        { driver: "Clean energy revenue", value: "$260B/yr", certainty: "HIGH" },
        { driver: "Fossil fuel displacement", value: "40% baseload by 2040", certainty: "MEDIUM" },
      ],
    },
  },
  "terra-lenta": {
    number: "NPI-003",
    title: "Terra Lenta",
    subtitle: "Redução Controlada da Rotação Terrestre em 10%",
    country: "Global",
    classification: "CONFIDENTIAL — STRATEGIC",
    version: "v1.0",
    heroImage: terraLentaHero,
    renderImage: terraLentaRender,
    technicalImages: [terraLentaTech1, terraLentaTech2, terraLentaTech3],
    conceptImages: [
      { src: terraLentaConcept1, caption: "Transferência hídrica equatorial-polar — sistema de reservatórios e redução de velocidade angular" },
      { src: terraLentaUrban, caption: "Distrito sustentável Terra Lenta — design biofílico, cobertura verde, energia solar, ruas pedestres" },
      { src: terraLentaDiagram, caption: "Diagrama técnico — sistema de fundação slow-motion com isoladores sísmicos, amortecedores viscosos e sensores" },
      { src: terraLentaSeismicMap, caption: "Mapa sísmico — zonas de risco no Mediterrâneo e Atlântico com destaque para Macaronésia (Cabo Verde, Canárias, Açores)" },
      { src: terraLentaComplexRender, caption: "Render fotorrealista — complexo residencial anti-sísmico com isoladores visíveis, jardins verticais e painéis solares" },
    ],
    secondaryImage: terraLentaTech1,
    whitepaperName: "WP2_Terra_Lenta.pdf",
    summary: "O Programa Terra Lenta propõe a redução gradual de 10% na velocidade angular de rotação da Terra — de 24 horas para um dia de 26,4 horas — ao longo de 30 a 50 anos, através do deslocamento controlado de massa polar utilizando energia fornecida pelo GeoCore Power. +876 horas anuais por pessoa, redução de 15-20% na frequência de furacões e aumento de 8-12% na produtividade agrícola global.",
    techSpecs: [
      { label: "Redução ω", value: "10%", detail: "De 24h para 26,4h por dia" },
      { label: "Energia Necessária", value: "10¹⁷ J", detail: "Fornecida pelo GeoCore Power" },
      { label: "Volume Hídrico", value: "~10¹⁴ m³", detail: "Transferência equatorial-polar" },
      { label: "Timeline", value: "30–50 anos", detail: "Gradual e controlado" },
      { label: "Horas Ganhas", value: "+876 h/ano", detail: "36,5 dias extras por pessoa" },
      { label: "Furacões Cat4+", value: "-15–20%", detail: "Redução da força de Coriolis" },
      { label: "Agricultura", value: "+8–12%", detail: "Mais horas de luz solar" },
      { label: "Nível do Mar", value: "+15–20 cm", detail: "Efeito lateral controlado" },
    ],
    riskMatrix: [
      { risk: "Efeitos climáticos imprevistos", probability: "Média (40%)", impact: "Muito Alto", mitigation: "Faseamento 0,5%/ano; reversibilidade total nos primeiros 5 anos; simulação climática contínua" },
      { risk: "Subida do nível do mar", probability: "Certa (gradual)", impact: "Alto", mitigation: "10 anos de antecedência; programa de diques globais (US$ 20B); adaptação faseada" },
      { risk: "Alteração de correntes oceânicas", probability: "Média (35%)", impact: "Alto", mitigation: "Monitorização via satélite 24/7; injeção compensatória reversível" },
      { risk: "Resistência geopolítica", probability: "Alta (65%)", impact: "Alto", mitigation: "Governança via CIEP multinacional; benefícios distribuídos globalmente" },
      { risk: "Energia insuficiente", probability: "Baixa (15%)", impact: "Muito Alto", mitigation: "Dependência total do GeoCore — validação prévia obrigatória" },
    ],
    pillars: [
      { num: "01", title: "Deslocamento de Massa Polar", desc: "Transferência de volumes hídricos massivos de latitudes equatoriais para reservatórios polares artificiais, combinado com redistribuição de sedimentos subglaciares.", stat: "10%", statLabel: "redução ω" },
      { num: "02", title: "+876 Horas/Ano", desc: "Cada pessoa ganha o equivalente a 36,5 dias extras de vida produtiva por ano. Impacto económico direto no PIB global.", stat: "876", statLabel: "horas/ano" },
      { num: "03", title: "Redução de Furacões", desc: "A redução da força de Coriolis diminui a intensidade e frequência de ciclones tropicais de alta categoria em 15-20%.", stat: "-20%", statLabel: "furacões Cat4+" },
      { num: "04", title: "Produtividade Agrícola", desc: "Mais horas de luz solar e ciclos térmicos mais longos aumentam a produtividade agrícola global em 8-12%.", stat: "+12%", statLabel: "agricultura" },
      { num: "05", title: "Energia GeoCore", desc: "A energia de 10¹⁷ joules necessária é fornecida exclusivamente pelo programa GeoCore Power — integração estrutural.", stat: "10¹⁷", statLabel: "joules" },
    ],
    metrics: [
      { value: "26.4", unit: "h", label: "NEW DAY LENGTH", delta: "+2.4 hours per day" },
      { value: "+876", unit: "h/yr", label: "TIME GAINED", delta: "36.5 extra days" },
      { value: "-20%", unit: "", label: "HURRICANE REDUCTION", delta: "Cat 4+ frequency" },
      { value: "+8%", unit: "", label: "GLOBAL GDP IMPACT", delta: "Accumulated 30 years" },
    ],
    sections: [
      { num: "01", title: "Mecânica de Rotação Terrestre", body: "A Terra não é um corpo rígido em rotação constante. O seu momento angular é continuamente perturbado por redistribuição de massa interna. O Terra Lenta propõe explorar esse mesmo mecanismo em escala intencional e controlada: mover massa de regiões equatoriais para polares aumenta o momento de inércia e reduz a velocidade angular." },
      { num: "02", title: "Deslocamento de Massa Polar", body: "O método principal é a transferência de volumes hídricos massivos de latitudes equatoriais para reservatórios polares artificiais, combinado com redistribuição de sedimentos subglaciares via aquecimento geotérmico controlado pelo GeoCore." },
      { num: "03", title: "Impacto Civilizacional", body: "O ganho de 876 horas por ano representa o maior aumento de tempo produtivo na história da humanidade. A redução de furacões e o aumento da produtividade agrícola impactam diretamente a segurança alimentar e a resiliência climática global." },
    ],
    timeline: [
      { year: "2026-2028", phase: "Fase 0 — Modelagem e Validação", desc: "Simulações computacionais, revisão por pares, parcerias com agências espaciais", cost: "$20–50M", status: "now" },
      { year: "2029-2035", phase: "Fase 1 — Reservatórios Piloto", desc: "Construção de reservatórios polares de teste. Monitorização de efeitos em escala regional", cost: "$5–15B", status: "future" },
      { year: "2036-2050", phase: "Fase 2 — Implementação Gradual", desc: "Transferência hídrica em escala. Redução gradual de ~0,5% por ano na velocidade angular", cost: "$50–200B", status: "future" },
      { year: "2050-2075", phase: "Fase 3 — Dia de 26,4 Horas", desc: "Estabilização do novo período de rotação. Adaptação global de sistemas civis", cost: "Integrado", status: "future" },
    ],
    financial: {
      totalInvestment: "Integrated via Fusion Core ($355B)",
      paybackYears: "20–25 years (system-level)",
      phases: [
        { phase: "Study", cost: "Incl. in Fusion Core", timeline: "2026–2030", roi: "GCM validation" },
        { phase: "Pilot", cost: "Incl. in Fusion Core", timeline: "2030–2035", roi: "2 reservoirs" },
        { phase: "Gradual", cost: "Incl. in Fusion Core", timeline: "2035–2045", roi: "−2.5% rotation" },
        { phase: "Target", cost: "Incl. in Fusion Core", timeline: "2055–2075", roi: "26.4h stable" },
      ],
      annualBenefits: [
        { driver: "Human productivity", value: "$35T/yr", certainty: "THEORETICAL" },
        { driver: "Agriculture", value: "$1.2T/yr", certainty: "MODELLED" },
        { driver: "Disasters avoided", value: "$64B/yr", certainty: "MODELLED" },
      ],
    },
  },
  "fusion-core": {
    number: "NPI-004",
    title: "Fusion Core",
    subtitle: "Integração Sistémica: Energia do Manto + Redução de Rotação Terrestre",
    country: "Global",
    classification: "CONFIDENTIAL — STRATEGIC",
    version: "v1.0",
    heroImage: fusionCoreHero,
    renderImage: fusionCoreRender,
    technicalImages: [fusionCoreTech1, fusionCoreTech2, fusionCoreTech3],
    conceptImages: [
      { src: fusionCoreConcept1, caption: "Sistema auto-catalítico: GeoCore Wells ↔ Terra Lenta Pumps — ciclo de aceleração exponencial" },
      { src: fusionCoreReactor, caption: "Núcleo do reactor de fusão compacto — plasma confinado por campo magnético superconductor, conversão direta" },
      { src: fusionCoreDiagram, caption: "Diagrama técnico — corte do reactor de fusão compacto com câmara de plasma, magnetos supercondutores e trocadores de calor" },
      { src: fusionCoreFacility, caption: "Interior da instalação Fusion Core — câmara tokamak com plasma azul visível, bobinas supercondutoras e equipa de controlo" },
    ],
    secondaryImage: fusionCoreTech1,
    whitepaperName: "WP3_Fusion_Core.pdf",
    summary: "O Fusion Core não é um terceiro projeto — é a inteligência que conecta GeoCore Power e Terra Lenta num sistema único e sinérgico. GeoCore fornece a energia necessária para acionar os mecanismos de deslocamento de massa do Terra Lenta. Terra Lenta, ao redistribuir massa planetária, cria novas localizações ótimas para poços GeoCore adicionais. O sistema é auto-catalítico.",
    techSpecs: [
      { label: "Output Integrado", value: "1 TW", detail: "GeoCore + Terra Lenta combinados" },
      { label: "Ciclo", value: "Auto-catalítico", detail: "Cada programa amplifica o outro" },
      { label: "Energia para TL", value: "10¹⁷ J", detail: "Fornecida por GeoCore" },
      { label: "Novos Sites GC", value: "+40%", detail: "Criados por redistribuição de massa" },
      { label: "IA Control", value: "Chip Fold", detail: "100x menos energia que silício" },
      { label: "PIB Global", value: "+8–10%", detail: "Impacto acumulado 30 anos" },
      { label: "Timeline", value: "20–25 anos", detail: "Desde primeiro poço piloto" },
      { label: "Fome Global", value: "-40%", detail: "Agricultura + energia + tempo" },
    ],
    riskMatrix: [
      { risk: "Falha de integração entre programas", probability: "Média (30%)", impact: "Alto", mitigation: "Cada programa tem ROI independente; integração é bónus, não requisito" },
      { risk: "Escala de coordenação global", probability: "Alta (55%)", impact: "Alto", mitigation: "CIEP como entidade autónoma multinacional; tratados vinculativos" },
      { risk: "Dependência sequencial", probability: "Média (35%)", impact: "Médio", mitigation: "GeoCore valida primeiro; Terra Lenta só avança com prova de energia" },
      { risk: "Custo total > US$ 2T", probability: "Alta (60%)", impact: "Médio", mitigation: "Auto-financiado a partir da Fase 2; Green Bonds + receita de energia" },
    ],
    pillars: [
      { num: "01", title: "Integração Energética", desc: "GeoCore fornece 10¹⁷ joules para acionar os sistemas de bombeamento e redistribuição de massa do Terra Lenta. Integração não é opcional — é estrutural.", stat: "10¹⁷", statLabel: "joules integrados" },
      { num: "02", title: "Fluxo Reverso", desc: "Terra Lenta beneficia GeoCore: redistribuição de massa cria novos sites ótimos para poços geotérmicos em localizações anteriormente inacessíveis.", stat: "∞", statLabel: "ciclo auto-catalítico" },
      { num: "03", title: "Chip Fold Control", desc: "O Chip Fold processa a IA de controlo de ambos os programas com 100x menos energia, viabilizando monitorização em tempo real de escala planetária.", stat: "100x", statLabel: "eficiência IA" },
      { num: "04", title: "Impacto Combinado", desc: "1 TW limpo + PIB +8-10% + 876h/ano + furacões -20% + fome -40%. Resultado que nenhum programa isolado consegue atingir.", stat: "1 TW", statLabel: "energia limpa" },
      { num: "05", title: "Timeline Acelerada", desc: "A integração reduz o timeline de impacto total para 20-25 anos a partir do primeiro poço piloto em 2026.", stat: "20-25", statLabel: "anos" },
    ],
    metrics: [
      { value: "1", unit: "TW", label: "CLEAN ENERGY", delta: "Integrated output" },
      { value: "+10%", unit: "", label: "GLOBAL GDP", delta: "Combined impact" },
      { value: "-40%", unit: "", label: "GLOBAL HUNGER", delta: "Food security" },
      { value: "20-25", unit: "yrs", label: "FULL IMPACT", delta: "From first pilot" },
    ],
    sections: [
      { num: "01", title: "A Lógica da Integração", body: "Programas separados falham; programas integrados vencem. GeoCore e Terra Lenta enfrentam o mesmo desafio: são projetos de escala planetária que partilham infraestrutura, financiamento, cadeia de fornecimento, governança e — criticamente — energia. O Fusion Core especifica como esses fluxos se integram." },
      { num: "02", title: "O Fluxo de Energia: GeoCore → Terra Lenta", body: "O Terra Lenta requer 10¹⁷ joules — equivalente a 30 anos de produção energética de todos os países combinados. Apenas o GeoCore pode fornecer isso de maneira contínua, limpa e co-localizada com os sites de operação." },
      { num: "03", title: "Sistema Auto-Catalítico", body: "Cada avanço de um programa amplifica o outro. GeoCore alimenta Terra Lenta. Terra Lenta cria novos sites para GeoCore. Chip Fold otimiza ambos. O resultado é um ciclo de aceleração exponencial sem precedentes na engenharia humana." },
    ],
    timeline: [
      { year: "2026", phase: "Fase 0 — Arquitetura de Integração", desc: "Especificação dos protocolos de integração, modelagem de fluxos energéticos e de massa", cost: "$10–20M", status: "now" },
      { year: "2027-2029", phase: "Fase 1 — Co-desenvolvimento", desc: "Desenvolvimento paralelo de GeoCore Fase 1 e modelagem Terra Lenta com pontos de integração", cost: "$100–300M", status: "future" },
      { year: "2030-2035", phase: "Fase 2 — Integração Operacional", desc: "Primeiro poço GeoCore alimenta reservatório Terra Lenta piloto. Validação do ciclo auto-catalítico", cost: "$5–20B", status: "future" },
      { year: "2036+", phase: "Fase 3 — Escala Planetária", desc: "Sistema integrado em plena operação. 1 TW limpo + redução de rotação em curso", cost: "$50–200B", status: "future" },
    ],
    financial: {
      totalInvestment: "$355B over 30 years",
      paybackYears: "16–20 years",
      phases: [
        { phase: "Years 1–5", cost: "$25B", timeline: "2026–2030", roi: "−$25B" },
        { phase: "Years 6–10", cost: "$55B", timeline: "2030–2035", roi: "−$48B cumulative" },
        { phase: "Years 11–15", cost: "$80B", timeline: "2035–2040", roi: "−$15B cumulative" },
        { phase: "Years 16–20", cost: "$40B", timeline: "2040–2045", roi: "+$89B cumulative" },
        { phase: "Years 21–30", cost: "$20B", timeline: "2045–2055", roi: "+$830B cumulative" },
      ],
      annualBenefits: [
        { driver: "Clean energy (GeoCore)", value: "$260B/yr", certainty: "HIGH" },
        { driver: "Agriculture", value: "$1.2T/yr", certainty: "MODELLED" },
        { driver: "Health + climate", value: "$180B/yr", certainty: "MODELLED" },
        { driver: "Computing (Chip Fold)", value: "$400B/yr", certainty: "MEDIUM" },
      ],
    },
  },
  "chip-fold": {
    number: "NPI-005",
    title: "Chip Fold",
    subtitle: "Computação de Alto Desempenho por Dobramento de Matéria Orgânica",
    country: "Global",
    classification: "CONFIDENTIAL — STRATEGIC",
    version: "v1.0",
    heroImage: chipFoldHero,
    renderImage: chipFoldRender,
    technicalImages: [chipFoldTech1, chipFoldTech2, chipFoldTech3],
    conceptImages: [
      { src: chipFoldConcept1, caption: "Dobramento molecular de celulose nanofibrilada — portas lógicas por interferência quântica-clássica" },
      { src: chipFoldMacro, caption: "Macro do chip dobrável — arquitetura de silício com traces dourados e substrato holográfico de última geração" },
      { src: chipFoldDiagram, caption: "Diagrama técnico — arquitetura em camadas do chip CNF com substrato de celulose, dobras lógicas e interconexões quânticas" },
      { src: chipFoldSemFibers, caption: "Microscopia SEM — nanofibras de celulose a escala nanométrica mostrando rede tridimensional orgânica (false-color)" },
      { src: chipFoldProductRender, caption: "Render de produto — chip CNF transparente em âmbar com circuitos visíveis, segurado por pinça em ambiente laboratorial" },
    ],
    secondaryImage: chipFoldTech1,
    whitepaperName: "WP4_Chip_Fold.pdf",
    summary: "O Chip Fold propõe uma ruptura fundamental na história da computação: substituir o silício por celulose nanofibrilada (CNF) derivada de papel reciclado e do cabaço. Nanofibras dobradas em configurações tridimensionais criam portas lógicas por interferência quântica-clássica — com densidade de integração 100x superior ao silício de 2nm, produzido a 1/10 do custo.",
    techSpecs: [
      { label: "Diâmetro Fibra", value: "5–20 nm", detail: "Celulose nanofibrilada (CNF)" },
      { label: "Comprimento Fibra", value: "1–10 μm", detail: "Extraída de cabaço/papel reciclado" },
      { label: "Ângulo de Dobra", value: "72.4° ± 0.1°", detail: "Precisão de angstroms" },
      { label: "Latência Porta", value: "0.8 fs", detail: "Femtossegundos — interferência quântica" },
      { label: "Densidade", value: "2.4×10¹² /cm²", detail: "100x vs silício 2nm (2.4×10¹⁰)" },
      { label: "Consumo", value: "0.3 mW/chip", detail: "vs 5–15W silício equivalente" },
      { label: "Fab Cost", value: "$50M", detail: "vs $25–40B para fab silício 2nm" },
      { label: "Yield", value: "94.2%", detail: "Projeção Fase 1 piloto" },
    ],
    riskMatrix: [
      { risk: "Estabilidade do dobramento em escala", probability: "Média (35%)", impact: "Alto", mitigation: "Validação em lab controlado; redundância de dobras; self-healing molecular" },
      { risk: "Interferência quântica inconsistente", probability: "Média (30%)", impact: "Alto", mitigation: "Operação a temp. ambiente vs criogénica; calibração por IA in-situ" },
      { risk: "Durabilidade do chip orgânico", probability: "Alta (50%)", impact: "Médio", mitigation: "Encapsulamento biocompatível; substituição modular a custo mínimo" },
      { risk: "Resistência da indústria de silício", probability: "Muito Alta (80%)", impact: "Médio", mitigation: "Foco inicial em nichos (IoT, edge AI) onde silício é over-engineered" },
      { risk: "Patentes e bloqueio ASML", probability: "Média (40%)", impact: "Alto", mitigation: "Processo de fab completamente distinto; sem dependência de litografia EUV" },
    ],
    pillars: [
      { num: "01", title: "Celulose Nanofibrilada", desc: "Matéria-prima derivada de cabaço e papel reciclado. Cresce em qualquer campo tropical. Elimina dependência geopolítica de silício, gálio e germânio.", stat: "CNF", statLabel: "matéria-prima" },
      { num: "02", title: "Dobramento Molecular", desc: "Nanofibras dobradas em configurações 3D criam portas lógicas por interferência quântica-clássica. Precisão de angstroms, velocidade de femtossegundos.", stat: "100x", statLabel: "vs silício 2nm" },
      { num: "03", title: "Custo Radicalmente Menor", desc: "Fabricação 10x mais barata que silício equivalente. Sem necessidade de clean rooms de $40B. Fabs descentralizadas e acessíveis.", stat: "10x", statLabel: "mais barato" },
      { num: "04", title: "Sustentabilidade Total", desc: "100% biodegradável e reciclável. Consumo energético 60-70% menor que chips de silício equivalentes. Zero resíduos tóxicos.", stat: "100%", statLabel: "reciclável" },
      { num: "05", title: "Controlo de IA", desc: "O Chip Fold é o processador que viabiliza a IA de controlo dos programas GeoCore e Terra Lenta em escala planetária, com 100x menos energia.", stat: "-70%", statLabel: "energia" },
    ],
    metrics: [
      { value: "100x", unit: "", label: "VS SILICON 2NM", delta: "Integration density" },
      { value: "10x", unit: "", label: "CHEAPER", delta: "Manufacturing cost" },
      { value: "-70%", unit: "", label: "ENERGY USE", delta: "vs equivalent silicon" },
      { value: "100%", unit: "", label: "RECYCLABLE", delta: "Biodegradable" },
    ],
    sections: [
      { num: "01", title: "A Crise do Silício", body: "Em 2026, o mercado global de semicondutores vale USD 650 biliões e é dominado por três empresas (TSMC, Samsung, Intel) em três geografias. A concentração geopolítica e o custo de uma nova fab de 2nm ($25-40B) tornam a indústria um oligopólio estrutural. O Chip Fold não tenta superar o limite de Moore no silício — abandona o paradigma completamente." },
      { num: "02", title: "Tecnologia de Dobramento", body: "Nanofibras de celulose dobradas em configurações tridimensionais específicas criam portas lógicas por interferência quântica-clássica — similar ao origami molecular, mas com precisão de angstroms e velocidade de femtossegundos. O resultado é um chip com densidade 100x superior ao silício de 2nm." },
      { num: "03", title: "Impacto Geopolítico", body: "Ao eliminar a dependência de silício, gálio e germânio (85%+ controlados pela China), o Chip Fold democratiza o acesso à computação de alto desempenho. Qualquer país tropical pode cultivar a matéria-prima e fabricar chips localmente." },
    ],
    timeline: [
      { year: "2026-2027", phase: "Fase 0 — Protótipo Laboratorial", desc: "Demonstração de portas lógicas CNF em laboratório. Parceria com universidades de materiais", cost: "$5–15M", status: "now" },
      { year: "2028-2030", phase: "Fase 1 — Fab Piloto", desc: "Primeira linha de fabricação piloto. Validação de processos em escala semi-industrial", cost: "$50–200M", status: "future" },
      { year: "2031-2033", phase: "Fase 2 — Escala Industrial", desc: "Fabs descentralizadas em múltiplas geografias. Primeiros chips comerciais para IA e IoT", cost: "$1–5B", status: "future" },
      { year: "2034+", phase: "Fase 3 — Substituição Global", desc: "Chip Fold como padrão para computação sustentável. Integração com Fusion Core para controlo planetário", cost: "$10–30B", status: "future" },
    ],
    financial: {
      totalInvestment: "$50k–$20M (staged from lab to product)",
      paybackYears: "5–6 years to revenue",
      phases: [
        { phase: "Phase 0 — Simulation", cost: "$50–100k", timeline: "Months 1–3", roi: "Technical report" },
        { phase: "Phase 1 — Substrate", cost: "$100–200k", timeline: "Months 4–9", roi: "Functional transistor" },
        { phase: "Phase 2 — Circuit", cost: "$200–400k", timeline: "Months 10–15", roi: "Flex circuit" },
        { phase: "Phase 3 — Hybrid PoC", cost: "$500k–1M", timeline: "Months 16–24", roi: "Hybrid chip PoC" },
        { phase: "Phase 4 — MVP", cost: "$2–5M", timeline: "Years 3–4", roi: "MVP product" },
        { phase: "Phase 5 — Scale", cost: "$10–20M", timeline: "Years 5–6", roi: "IPO / acquisition" },
      ],
      annualBenefits: [
        { driver: "Wearable medical sensors", value: "$95B market (2030)", certainty: "MEDIUM" },
        { driver: "IoT / Edge AI", value: "$110B market (2030)", certainty: "MEDIUM" },
        { driver: "Neural interfaces", value: "$6B market (2030)", certainty: "LOW" },
      ],
    },
  },
};

export default projectData;
