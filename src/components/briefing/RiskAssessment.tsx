import { motion } from "framer-motion";

const risks = [
  { name: "Structural breach", likelihood: "VERY LOW", impact: "HIGH", mitigation: "Self-healing concrete + segmented watertight compartments + real-time structural monitoring" },
  { name: "Regulatory block", likelihood: "LOW", impact: "HIGH", mitigation: "Pre-aligned with Wet waterbeheer, Waterwet. Reversibility eliminates permanent permit requirement" },
  { name: "Ecological damage", likelihood: "LOW", impact: "MED", mitigation: "Bio-active surface increases biodiversity ×5–8. No heavy metals. EU Nature-Based Solutions certified" },
  { name: "Technology immaturity", likelihood: "VERY LOW", impact: "MED", mitigation: "All components commercially proven: TU Delft 2024, Reefy Rotterdam 2023–25, LIM motors in production" },
  { name: "Dredging interference", likelihood: "MED", impact: "MED", mitigation: "Reversible suction-pile anchoring. Coordinated schedule with Rijkswaterstaat dredging programme" },
  { name: "Cost overrun", likelihood: "MED", impact: "MED", mitigation: "Phased commitment. €200M pilot validates cost model before national commitment. Fixed-price EPC contract" },
];

const badgeClass = (level: string) => {
  if (level.includes("VERY LOW") || level === "LOW") return "bg-accent/15 text-accent-foreground border border-accent/30";
  if (level === "MED") return "bg-primary/15 text-gold border border-primary/30";
  return "bg-destructive/15 text-destructive-foreground border border-destructive/30";
};

const RiskAssessment = () => (
  <section className="border-b border-border bg-card">
    <div className="max-w-[1200px] mx-auto px-8 md:px-20 py-20 md:py-24">
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
        <span className="section-label">SECTION 05 — RISK ASSESSMENT</span>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-3 leading-[1.15]">
          All Material Risks<br />Are <span className="text-muted-foreground font-normal">Mitigated</span>
        </h2>
        <div className="gold-rule my-5" />
      </motion.div>

      {/* Risk Matrix */}
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }} className="mt-10">
        {/* Header */}
        <div className="hidden md:grid grid-cols-[140px_80px_80px_1fr] gap-4 items-center pb-2 border-b-2 border-primary">
          {["Risk Factor", "Likelihood", "Impact", "Mitigation"].map((h) => (
            <span key={h} className="font-mono text-[0.6rem] tracking-[0.15em] text-gold uppercase">{h}</span>
          ))}
        </div>

        {risks.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="grid grid-cols-1 md:grid-cols-[140px_80px_80px_1fr] gap-2 md:gap-4 items-center py-3 border-b border-border hover:bg-primary/[0.03] transition-colors"
          >
            <span className="font-sans text-[0.82rem] text-foreground">{r.name}</span>
            <span className={`inline-block px-2 py-0.5 rounded-sm font-mono text-[0.6rem] tracking-[0.1em] text-center w-fit ${badgeClass(r.likelihood)}`}>
              {r.likelihood}
            </span>
            <span className={`inline-block px-2 py-0.5 rounded-sm font-mono text-[0.6rem] tracking-[0.1em] text-center w-fit ${badgeClass(r.impact)}`}>
              {r.impact}
            </span>
            <span className="font-sans text-[0.78rem] font-light text-foreground/60">{r.mitigation}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom callouts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-14">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="border-l-[3px] border-primary pl-6 py-4 bg-primary/5">
          <span className="section-label block mb-2">Competitive Position</span>
          <p className="font-sans text-[0.85rem] font-light text-foreground/85 leading-[1.7]">
            DeltaSpine NL competes on the only dimension that matters to a sovereign investor: it solves the legally mandatory
            problem cheapest and fastest. Road infrastructure alternatives require expropriation, multi-year permits and 3–4× the
            cost per unit of N-reduction achieved.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
          <div className="border-l-[3px] border-primary pl-6 py-4 bg-primary/5 mb-6">
            <span className="section-label block mb-2">Key Differentiators</span>
            <ul className="font-sans text-[0.82rem] font-light text-foreground/80 leading-[1.7] space-y-1.5 list-none">
              <li>▸ <strong>Reversibility</strong> — full removal in &lt;6 months. Political risk of any single administration eliminated.</li>
              <li>▸ <strong>Multi-revenue</strong> — 5 simultaneous return streams from single capital deployment.</li>
              <li>▸ <strong>Proven technology</strong> — zero unvalidated components. Risk profile equivalent to a port extension, not a moonshot.</li>
            </ul>
          </div>

          <div className="border border-primary bg-primary/10 p-6">
            <span className="section-label block mb-2">BOTTOM LINE</span>
            <p className="font-sans text-sm font-medium text-foreground leading-[1.7]">
              There is no technical, environmental, economic or political reason to say no.
            </p>
            <p className="font-sans text-[0.82rem] font-light text-foreground/75 leading-[1.7] mt-2">
              The Netherlands already has the obligation. DeltaSpine NL is the most efficient instrument to discharge it — while generating a positive return.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default RiskAssessment;
