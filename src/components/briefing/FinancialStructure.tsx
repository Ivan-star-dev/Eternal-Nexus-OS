import { motion } from "framer-motion";

const roiData = [
  { driver: "Water treatment cost savings", annual: "+180–240", certainty: "HIGH", source: "Rijkswaterstaat baseline" },
  { driver: "EU penalty avoidance (N)", annual: "+120–180", certainty: "HIGH", source: "Judicial order 2025" },
  { driver: "Logistics revenue (Phase 1)", annual: "+60–100", certainty: "MED", source: "PostNL/Amazon LOI" },
  { driver: "Fertiliser (N/P circular)", annual: "+20–40", certainty: "MED", source: "Waterschappen data" },
  { driver: "Mobility revenue (Phase 2)", annual: "+80–140", certainty: "MED", source: "Conservative demand model" },
];

const timeline = [
  { year: "2026 — Q1–Q4", phase: "Phase 0: EIA & Regulatory", desc: "Full Environmental Impact Assessment. Rijkswaterstaat approval. Wet waterbeheer compliance verified. Public consultation.", cost: "Investment: €8–12M", status: "done" },
  { year: "2027–2030", phase: "Phase 1: Pilot — 4 km", desc: "Utrecht–Amsterdam corridor. Logistics operational by 2028. N-recovery active from installation day one. Data backbone live.", cost: "Investment: €180–240M · First returns: 2028", status: "active" },
  { year: "2030–2035", phase: "Phase 2: Regional Expansion", desc: "Key inter-city corridors. Passenger capsule launch (2029). Energy recovery mature. H₂ compartments piloted.", cost: "Investment: €2.4–3.8B · Positive cash flow", status: "" },
  { year: "2035–2045", phase: "Phase 3: National Network", desc: "800 km priority network. Full Delta Programme integration. National data sovereignty. H₂ transport operational.", cost: "Total network: €40–50B over 20 years", status: "" },
];

const FinancialStructure = () => (
  <section className="border-b border-border bg-background">
    <div className="max-w-[1200px] mx-auto px-8 md:px-20 py-20 md:py-24">
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
        <span className="section-label">SECTION 03 — FINANCIAL STRUCTURE</span>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-3 leading-[1.15]">
          Return on<br />Sovereign <span className="text-muted-foreground font-normal">Infrastructure</span>
        </h2>
        <div className="gold-rule my-5" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-10">
        {/* ROI Table */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}>
          {/* Header */}
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-0 border-b-2 border-primary pb-2.5 mb-1">
            {["Cost / Return Driver", "Annual €M", "Certainty", "Source"].map((h) => (
              <span key={h} className="font-mono text-[0.6rem] tracking-[0.2em] text-gold uppercase pr-3">{h}</span>
            ))}
          </div>

          {/* Rows */}
          {roiData.map((row) => (
            <div key={row.driver} className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-0 border-b border-border py-4">
              <span className="font-mono text-[0.78rem] text-foreground pr-3">{row.driver}</span>
              <span className="font-mono text-[0.78rem] text-teal pr-3">{row.annual}</span>
              <span className="font-mono text-[0.78rem] text-foreground pr-3">{row.certainty}</span>
              <span className="font-mono text-[0.78rem] text-muted-foreground">{row.source}</span>
            </div>
          ))}

          {/* Total */}
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-0 border-b border-border py-4 bg-primary/5">
            <span className="font-mono text-[0.78rem] text-foreground font-medium pr-3">TOTAL ANNUAL BENEFIT</span>
            <span className="font-mono text-[0.78rem] text-teal font-medium pr-3">+460–700</span>
            <span className="font-mono text-[0.78rem] text-foreground pr-3">HIGH</span>
            <span className="font-mono text-[0.78rem] text-muted-foreground">Payback 8–12 yr</span>
          </div>

          {/* Funding */}
          <div className="border-l-[3px] border-primary pl-6 py-4 bg-primary/5 mt-6">
            <span className="section-label block mb-2">Funding Structure</span>
            <p className="font-sans text-[0.82rem] font-light text-foreground/85 leading-[1.7]">
              Rijkswaterstaat 40% · National Growth Fund 30% · EU Innovation Fund + Private 30% · Stikstof funds (~€25B available) · PPP with PostNL, Amazon, Gasunie, Boskalis
            </p>
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}>
          <div className="relative pl-7 border-l border-border">
            {timeline.map((t) => (
              <div key={t.year} className="relative mb-9 pb-1">
                {/* Dot */}
                <div
                  className={`absolute -left-[calc(1.75rem+4px)] top-[5px] w-2 h-2 rounded-full border-2 ${
                    t.status === "done"
                      ? "bg-primary border-primary"
                      : t.status === "active"
                      ? "bg-accent-foreground border-accent-foreground shadow-[0_0_0_4px_hsl(var(--accent)/0.2)]"
                      : "bg-border border-border"
                  }`}
                />
                <span className="font-mono text-[0.62rem] tracking-[0.15em] text-gold mb-1 block">{t.year}</span>
                <h4 className="font-serif text-base font-bold text-foreground mb-1.5">{t.phase}</h4>
                <p className="font-sans text-[0.82rem] font-light text-foreground/60 leading-[1.6]">{t.desc}</p>
                <span className="font-mono text-[0.7rem] text-teal mt-1.5 block">{t.cost}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default FinancialStructure;
