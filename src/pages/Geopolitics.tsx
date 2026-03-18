import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Globe, Shield, Zap, Cpu, RotateCcw, ChevronRight, Map } from "lucide-react";
import { lazy, Suspense, useState } from "react";
import Layout from "@/components/Layout";
import geopoliticsMap from "@/assets/geopolitics-map.jpg";
import geopoliticsOverview from "@/assets/geopolitics-overview.jpg";

// Lazy-load MapLibre shell (heavy: ~200KB)
const GeopoliticsMap = lazy(() => import("@/components/geopolitics/GeopoliticsMap"));

const ease = [0.16, 1, 0.3, 1] as const;

const actors = [
  {
    name: "Estados Unidos",
    role: "Potência Incumbente",
    detail: "DOE + DARPA financiam Quaise e Fervo (US$ 30M via ARPA-E, 2025). Google e Breakthrough Energy como capital privado. Risco estrutural: ciclos eleitorais de 4 anos.",
    color: "text-blue-400",
  },
  {
    name: "União Europeia",
    role: "Financiador Estrutural",
    detail: "Horizon Europe + EIB (EUR 150B, 2028–2034). ASML (Holanda) é parceira direta para Chip Fold. Horizonte de planeamento de 10 anos — o mais adequado para este programa.",
    color: "text-primary",
  },
  {
    name: "China",
    role: "Adversário Sistémico",
    detail: "SG-1 Xinjiang: 10.910m em 2025, meta 15km até 2030. Reservas soberanas: US$ 3 triliões. Parceiro impossível. Concorrente certo.",
    color: "text-destructive",
  },
  {
    name: "Golfo Pérsico",
    role: "Financiador Oportunista",
    detail: "Saudi PIF: US$ 700B sob gestão. Vision 2030 já inclui energia alternativa. Condição inegociável: licença tecnológica inclusa.",
    color: "text-teal",
  },
  {
    name: "Brasil",
    role: "Polo Neutro Natural",
    detail: "BNDES + Eletrobras. Gradiente térmico no Nordeste: 50–70 mW/m². Neutro geopolítico histórico. Janela de 36 meses antes que China e EUA tenham protótipos próprios.",
    color: "text-green-400",
  },
];

const strategicTable = [
  { resource: "Energia", xx: "Petróleo / Gás", xxi: "Geotermia profunda 24/7", program: "GeoCore Power" },
  { resource: "Computação", xx: "Silício (TSMC/Intel)", xxi: "Celulose nanoestruturada", program: "Chip Fold" },
  { resource: "Clima/Tempo", xx: "Incontrolável", xxi: "Engenharia planetária gradual", program: "Terra Lenta" },
  { resource: "Poder Integrativo", xx: "Armas nucleares", xxi: "Stack sistémico integrado", program: "Fusion Core" },
];

const drillCycle = [
  { depth: "3,4 km", period: "2026 (hoje)", temp: "290°C", power: "~400 MW", status: "OPERACIONAL — Fervo" },
  { depth: "8–12 km", period: "2027–2030", temp: "300–450°C", power: "2–5 GW", status: "Piloto Quaise/GeoCore" },
  { depth: "12–20 km", period: "2030–2035", temp: "450–700°C", power: "5–15 GW", status: "P&D avançado" },
  { depth: "20–50 km", period: "2035–2050", temp: "700–1.200°C", power: "80–150 GW", status: "Requer triliões + 20 anos" },
];

const brazilTimeline = [
  { year: "2026", action: "Lab Chip Fold (CE) + BrasilGeo S.A. + negociação ASML", result: "PoC computacional validado" },
  { year: "2027", action: "Piloto GeoCore 5km — Bacia Potiguar (RN)", result: "Primeiro poço real, prova de conceito" },
  { year: "2028–2032", action: "3 poços a 12km + Fab Chip Fold piloto + CIEP inaugurado", result: "15 GW, exportação começa" },
  { year: "2032–2040", action: "10 poços + Chip Fold industrial + liderança Fusion Core", result: "50 GW, PIB Brasil +6%" },
  { year: "2040–2050", action: "1 TW + dia 26,4h + chips orgânicos dominantes", result: "Brasil — Potência Tier 1" },
];

const financing = [
  { phase: "Fase 0 — PoC", period: "2026–2028", investment: "US$ 15–25B", sources: "BNDES + EIB + ARPA-E + Golfo", ret: "Validação tecnológica" },
  { phase: "Fase 1 — Piloto", period: "2028–2033", investment: "US$ 80–120B", sources: "Consórcio CIEP + World Bank + PIF", ret: "Breakeven no poço 5" },
  { phase: "Fase 2", period: "2033–2040", investment: "US$ 300–500B", sources: "Mercado de capitais + Green Bonds", ret: "ROI 100–200%" },
  { phase: "Fase 3 — Planetária", period: "2040–2050", investment: "US$ 1–2T", sources: "Receita própria (energia + chips)", ret: "Auto-financiado" },
];

const risks = [
  { risk: "China bloqueia acesso ASML", prob: "Alta (75%)", mitigation: "Licenciamento exclusivo + dual-track ocidente/sul global" },
  { risk: "Sismos induzidos > M3.0", prob: "Média (40%)", mitigation: "GeoCore.AI + injeção reversa + emergência em 8 segundos" },
  { risk: "Overrun de capex 40–80%", prob: "Alta (70%)", mitigation: "Contratos EPC com cap + faseamento por milestone" },
  { risk: "Oposição interna no Brasil", prob: "Média-Alta (60%)", mitigation: "500k empregos + energia gratuita no raio 50km" },
  { risk: "Nível do mar +15–20cm", prob: "Certa (gradual)", mitigation: "10 anos de antecedência → diques globais (US$ 20B)" },
  { risk: "Gyrotron não escala > 20km", prob: "Média (35%)", mitigation: "Fase 1 (5km) tem ROI positivo independente da Fase 3" },
];

const Geopolitics = () => {
  const [mapExpanded, setMapExpanded] = useState(false);

  return (
    <Layout>
      {/* Breadcrumb */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-border bg-secondary/50 backdrop-blur-sm px-4 sm:px-6 md:px-12 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 font-mono text-[0.55rem] sm:text-[0.6rem] tracking-[0.12em] text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">NPI REGISTRY</Link>
          <ChevronRight className="w-3 h-3 opacity-40" />
          <span className="text-foreground">NARRATIVA GEOPOLÍTICA</span>
        </div>
        <span className="stamp-classified text-[0.45rem] sm:text-[0.5rem]">TOP SECRET</span>
      </motion.div>

      {/* Hero */}
      <section className="relative min-h-[60vh] sm:min-h-[70vh] flex flex-col justify-end overflow-hidden">
        <motion.img src={geopoliticsMap} alt="Global Strategic Map" className="absolute inset-0 w-full h-full object-cover" initial={{ scale: 1.05 }} animate={{ scale: 1 }} transition={{ duration: 12, ease: "easeOut" }} />
        <div className="absolute inset-0 bg-background/60" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, hsl(var(--background) / 0.3) 0%, transparent 30%, transparent 50%, hsl(var(--background)) 100%)" }} />
        <div className="absolute inset-0 scanlines pointer-events-none opacity-20" />

        <div className="relative z-10 px-4 sm:px-6 md:px-16 lg:px-20 pb-12 sm:pb-16 max-w-[1300px]">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8, ease }}>
            <Link to="/" className="flex items-center gap-2 font-mono text-[0.6rem] tracking-[0.12em] text-muted-foreground hover:text-primary transition-colors mb-6">
              <ArrowLeft className="w-3.5 h-3.5" /> RETURN TO REGISTRY
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }}>
            <span className="section-label">PROGRAMA ESTRATÉGICO GLOBAL · v2.0 · MARÇO 2026</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 1, ease }} className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold text-foreground leading-[0.88] mt-4 mb-4">
            Narrativa <span className="text-primary">Geopolítica</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.8 }} className="font-serif text-base sm:text-lg font-light italic text-muted-foreground max-w-2xl leading-relaxed">
            Quem Financia. Quem Lidera. O Papel do Brasil.
          </motion.p>
        </div>
      </section>

      {/* Interactive Geopolitics Map — Sacred Flow: Tribunal → Atlas visualization */}
      <section className="border-t border-border bg-[#0a0a0f]">
        <div className="px-4 sm:px-6 md:px-16 lg:px-20 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="font-mono text-[0.48rem] tracking-[0.2em] text-primary uppercase block mb-1">LIVE INTELLIGENCE MAP</span>
              <h3 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
                <Map className="w-4 h-4 text-primary" />
                Geopolitical <span className="text-muted-foreground font-light italic">Overlay</span>
              </h3>
            </div>
            <button
              onClick={() => setMapExpanded(!mapExpanded)}
              className="font-mono text-[0.55rem] tracking-[0.1em] text-primary border border-primary/30 px-3 py-1.5 hover:bg-primary/10 transition-colors"
            >
              {mapExpanded ? "COLLAPSE" : "EXPAND"}
            </button>
          </div>
        </div>
        <div style={{ height: mapExpanded ? '70vh' : '400px', transition: 'height 0.4s ease' }}>
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center bg-[#0a0a0f]">
              <span className="font-mono text-[0.6rem] text-primary/60 tracking-[0.2em] animate-pulse">LOADING MAP ENGINE...</span>
            </div>
          }>
            <GeopoliticsMap showVerdicts={true} />
          </Suspense>
        </div>
      </section>

      {/* Strategic Table */}
      <section className="border-t border-border py-16 sm:py-20 px-4 sm:px-6 md:px-16 lg:px-20">
        <div className="max-w-[1200px] mx-auto">
          <span className="section-label">SECTION 01 · O TABULEIRO 2026</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mt-4 mb-2">
            Nova Ordem <span className="text-muted-foreground font-light italic">Estratégica</span>
          </h2>
          <div className="gold-rule mb-8" />

          <div className="callout-gold mb-8 p-4">
            <p className="font-sans text-sm text-foreground/85 leading-relaxed">
              Os quatro programas convergem em <strong>soberania energética + controlo temporal</strong>. Quaise Energy testou ondas milimétricas em granito (100m validados, julho 2025). Fervo Energy atingiu 555°F a 3,4 km em Nevada (fevereiro 2026). A IEA projeta 800 GW de geotermia profunda global até 2035.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
            {strategicTable.map((row, i) => (
              <motion.div key={row.resource} className="bg-card p-5" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <span className="font-mono text-[0.5rem] tracking-[0.2em] text-primary uppercase block mb-3">{row.resource}</span>
                <div className="space-y-2 mb-3">
                  <div>
                    <span className="font-mono text-[0.48rem] text-muted-foreground block">SÉC. XX</span>
                    <span className="font-sans text-xs text-foreground/60 line-through">{row.xx}</span>
                  </div>
                  <div>
                    <span className="font-mono text-[0.48rem] text-teal block">SÉC. XXI</span>
                    <span className="font-sans text-xs text-foreground font-medium">{row.xxi}</span>
                  </div>
                </div>
                <span className="font-mono text-[0.55rem] text-primary font-medium">{row.program}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Actors */}
      <section className="border-t border-border py-16 sm:py-20 px-4 sm:px-6 md:px-16 lg:px-20 bg-card">
        <div className="max-w-[1200px] mx-auto">
          <span className="section-label">SECTION 02 · ATORES REAIS 2026</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mt-4 mb-2">
            Quem <span className="text-primary">Financia</span>
          </h2>
          <div className="gold-rule mb-10" />

          <div className="space-y-4">
            {actors.map((actor, i) => (
              <motion.div
                key={actor.name}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="border border-border bg-background p-5 sm:p-6"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <span className={`font-serif text-lg font-bold ${actor.color}`}>{actor.name}</span>
                  <span className="font-mono text-[0.5rem] tracking-[0.1em] text-muted-foreground bg-secondary px-2 py-0.5">{actor.role}</span>
                </div>
                <p className="font-sans text-xs sm:text-sm text-muted-foreground leading-relaxed pl-7">{actor.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Drill Cycle */}
      <section className="border-t border-border py-16 sm:py-20 px-4 sm:px-6 md:px-16 lg:px-20">
        <div className="max-w-[1200px] mx-auto">
          <span className="section-label">SECTION 03 · TECNOLOGIA REALISTA</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mt-4 mb-2">
            Core Drill <span className="text-muted-foreground font-light italic">Cycle</span>
          </h2>
          <div className="gold-rule mb-6" />

          <div className="callout-gold mb-8 p-4">
            <p className="font-mono text-[0.6rem] text-primary tracking-wide">NÃO É GYROTRON MÁGICO. É engenharia incremental com marcos verificáveis. Cada fase é viável com tecnologia existente ou em teste hoje (2026).</p>
          </div>

          <div className="overflow-x-auto">
            <div className="grid grid-cols-5 gap-px bg-border border border-border min-w-[640px]">
              {["PROFUNDIDADE", "PERÍODO", "TEMPERATURA", "POTÊNCIA/POÇO", "STATUS"].map((h) => (
                <div key={h} className="bg-secondary/80 p-3">
                  <span className="font-mono text-[0.48rem] tracking-[0.15em] text-primary uppercase">{h}</span>
                </div>
              ))}
              {drillCycle.map((row, i) => (
                [row.depth, row.period, row.temp, row.power, row.status].map((cell, j) => (
                  <div key={`${i}-${j}`} className="bg-background p-3">
                    <span className={`font-mono text-[0.6rem] ${j === 4 ? (i === 0 ? "text-teal" : "text-muted-foreground") : "text-foreground"}`}>{cell}</span>
                  </div>
                ))
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Brazil — CIEP */}
      <section className="border-t border-border py-16 sm:py-20 px-4 sm:px-6 md:px-16 lg:px-20 bg-card">
        <div className="max-w-[1200px] mx-auto">
          <span className="section-label">SECTION 04 · O PAPEL DO BRASIL</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mt-4 mb-2">
            CIEP — <span className="text-primary">Centro Internacional</span> <span className="text-muted-foreground font-light italic">de Engenharia Planetária</span>
          </h2>
          <div className="gold-rule mb-6" />

          <p className="font-sans text-sm text-muted-foreground leading-relaxed max-w-3xl mb-8">
            Equivalente ao CERN, mas para engenharia da Terra. Sediado em Brasília. Financiado por consórcio de 30 nações. Orçamento inicial: US$ 2B. O Brasil reúne neutralidade geopolítica, recursos naturais críticos (celulose, água, área), diplomacia universal e a janela de 36 meses.
          </p>

          <div className="relative pl-8 sm:pl-10">
            <div className="absolute left-2 sm:left-3 top-0 bottom-0 w-px bg-border" />
            {brazilTimeline.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="relative mb-8 last:mb-0"
              >
                <div className={`absolute -left-[25px] sm:-left-[29px] top-[6px] w-[10px] h-[10px] rounded-full border-2 ${i === 0 ? "bg-teal-light border-teal-light shadow-[0_0_0_4px_hsl(var(--teal)/0.2)]" : "bg-muted border-muted-foreground/30"}`} />
                <span className="font-mono text-[0.58rem] tracking-[0.16em] text-primary">{item.year}</span>
                <p className="font-sans text-sm text-foreground mt-1 mb-1">{item.action}</p>
                <span className="font-mono text-[0.58rem] text-teal-light">{item.result}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Financing */}
      <section className="border-t border-border py-16 sm:py-20 px-4 sm:px-6 md:px-16 lg:px-20">
        <div className="max-w-[1200px] mx-auto">
          <span className="section-label">SECTION 05 · FINANCIAMENTO REALISTA</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mt-4 mb-2">
            Estrutura de <span className="text-muted-foreground font-light italic">Capital</span>
          </h2>
          <div className="gold-rule mb-8" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border mb-8">
            {financing.map((f, i) => (
              <motion.div key={f.phase} className="bg-card p-5" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <span className="font-mono text-[0.5rem] tracking-[0.15em] text-primary block mb-2">{f.phase}</span>
                <span className="font-mono text-[0.5rem] text-muted-foreground block mb-3">{f.period}</span>
                <span className="font-serif text-xl font-bold text-foreground block mb-1">{f.investment}</span>
                <span className="font-sans text-[0.6rem] text-muted-foreground block mb-2">{f.sources}</span>
                <span className="font-mono text-[0.55rem] text-teal">{f.ret}</span>
              </motion.div>
            ))}
          </div>

          <div className="callout-gold p-4">
            <p className="font-sans text-sm text-foreground/85 leading-relaxed">
              <strong>ROI Realista:</strong> 100–200% em 10 anos (energia USD 0,03–0,06/kWh vs gás USD 0,06–0,10). Cada poço é independente — o risco não é all-or-nothing. Fase 0 (5km) tem payback sem necessidade de sucesso nas fases seguintes.
            </p>
          </div>
        </div>
      </section>

      {/* Risks */}
      <section className="border-t border-border py-16 sm:py-20 px-4 sm:px-6 md:px-16 lg:px-20 bg-card">
        <div className="max-w-[1200px] mx-auto">
          <span className="section-label">SECTION 06 · TENSÕES & RISCOS</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mt-4 mb-2">
            Gestão de <span className="text-muted-foreground font-light italic">Riscos Geopolíticos</span>
          </h2>
          <div className="gold-rule mb-8" />

          <div className="space-y-3">
            {risks.map((r, i) => (
              <motion.div key={r.risk} className="border border-border bg-background p-4 sm:p-5" initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <span className="font-serif text-sm font-bold text-foreground">{r.risk}</span>
                  <span className="font-mono text-[0.5rem] text-destructive bg-destructive/10 px-2 py-0.5 border border-destructive/20">{r.prob}</span>
                </div>
                <p className="font-mono text-[0.6rem] text-muted-foreground">{r.mitigation}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Conclusion */}
      <section className="border-t border-border py-16 sm:py-20 px-4 sm:px-6 md:px-16 lg:px-20">
        <div className="max-w-[900px] mx-auto text-center">
          <div className="callout-gold p-6 sm:p-8 mb-8">
            <span className="font-mono text-[0.55rem] tracking-[0.2em] text-primary block mb-4">CONCLUSÃO</span>
            <p className="font-serif text-lg sm:text-xl text-foreground/90 italic leading-relaxed">
              "A estratégia é simples: começar com 5km, provar conceito, escalar. Cada fase tem payback independente. O risco real é não começar — é chegar tarde quando a corrida já tiver vencedor."
            </p>
          </div>

          <p className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Em 2045: <span className="text-primary">energia infinita</span> + <span className="text-teal">dia maior</span>.
          </p>
          <p className="font-mono text-sm text-muted-foreground mb-8">A janela está aberta.</p>

          <div className="text-left bg-card border border-border p-4 sm:p-5 mb-10">
            <span className="font-mono text-[0.5rem] tracking-[0.15em] text-destructive block mb-2">DISCLAIMER</span>
            <p className="font-mono text-[0.55rem] text-muted-foreground leading-relaxed">
              Documento prospetivo e estratégico. Tecnologia em teste inicial: Quaise validou 100m em granito (jul/2025), Fervo atingiu 555°F a 3,4km (fev/2026). Projeções de profundidade &gt; 12km são especulativas. Estimativas financeiras são de ordem de magnitude. Riscos são substanciais. Nenhuma garantia de resultado.
            </p>
          </div>

          <Link to="/" className="inline-flex items-center gap-2 font-mono text-[0.62rem] sm:text-[0.68rem] tracking-[0.12em] text-primary border border-primary px-5 sm:px-6 py-3 hover:bg-primary hover:text-primary-foreground transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> RETURN TO REGISTRY
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Geopolitics;
