import { motion } from "framer-motion";

const tableData = [
  { domain: "Water quality (WFD)", status: "61 monitoring failures", source: "Rekenkamer Report 2026", deadline: "Full WFD compliance" },
  { domain: "Nitrogen (Natura 2000)", status: "70% zones above limit", source: "Judicial order 2025", deadline: "–50% by 2030" },
  { domain: "Urban logistics", status: "+25% volume (2020–2025)", source: "PostNL / CBS 2025", deadline: "Zero-emission zones" },
  { domain: "Climate resilience", status: "Delta Programme gap", source: "Rijkswaterstaat", deadline: "2050 adaptive targets" },
];

const InvestmentContext = () => (
  <section className="border-b border-border bg-background">
    <div className="max-w-[1200px] mx-auto px-8 md:px-20 py-20 md:py-24">
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
        <span className="section-label">SECTION 01 — INVESTMENT CONTEXT</span>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-3 leading-[1.15]">
          The Mandate Is<br />Already Issued
        </h2>
        <div className="gold-rule my-5" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-8">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}>
          <p className="font-sans text-sm font-light text-foreground/70 leading-[1.8] mb-7">
            The Netherlands is operating under three simultaneous structural pressures that create a legal, fiscal
            and reputational imperative for infrastructure action — independent of any political cycle.
          </p>

          <div className="border-l-[3px] border-primary pl-6 py-4 bg-primary/5">
            <span className="section-label block mb-2">Legal Precedent</span>
            <p className="font-sans text-sm font-light text-foreground/85 leading-[1.7]">
              Greenpeace v. Netherlands (Jan 22, 2025): 50% nitrogen reduction required in Natura 2000 zones by 2030.
              Non-compliance: €10M/day penalty. The Dutch government has no discretion — only a choice of instrument.
            </p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse font-mono">
              <thead>
                <tr>
                  {["Problem Domain", "Current Status", "2030 Deadline"].map((h) => (
                    <th key={h} className="text-[0.58rem] tracking-[0.2em] uppercase text-gold text-left px-4 py-3 border-b-2 border-primary">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row) => (
                  <tr key={row.domain} className="hover:bg-primary/5 transition-colors">
                    <td className="text-[0.82rem] text-foreground px-4 py-3.5 border-b border-border">{row.domain}</td>
                    <td className="text-[0.82rem] text-gold px-4 py-3.5 border-b border-border">
                      {row.status}
                      <span className="block text-[0.62rem] text-muted-foreground mt-1">{row.source}</span>
                    </td>
                    <td className="text-[0.82rem] text-foreground px-4 py-3.5 border-b border-border">{row.deadline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default InvestmentContext;
