import { motion } from "framer-motion";
import type { ProjectData } from "@/data/projects";

const ease = [0.16, 1, 0.3, 1] as const;

interface FinancialTabProps {
  project: ProjectData;
}

const certaintyColors: Record<string, string> = {
  HIGH: "text-accent-foreground bg-accent/15 border-accent/30",
  MEDIUM: "text-primary bg-primary/10 border-primary/30",
  LOW: "text-destructive bg-destructive/10 border-destructive/30",
  THEORETICAL: "text-muted-foreground bg-muted border-border",
  MODELLED: "text-foreground bg-secondary border-border",
};

const FinancialTab = ({ project }: FinancialTabProps) => {
  if (!project.financial) {
    return (
      <section className="py-16 px-4 sm:px-6 md:px-16 lg:px-20">
        <div className="max-w-[1200px] mx-auto text-center">
          <span className="font-mono text-[0.6rem] tracking-[0.2em] text-muted-foreground uppercase">
            Financial data not yet available for this project.
          </span>
        </div>
      </section>
    );
  }

  const { financial } = project;

  return (
    <>
      {/* Summary Cards */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-16 lg:px-20">
        <div className="max-w-[1200px] mx-auto">
          <span className="section-label">SECTION · FINANCIAL STRUCTURE</span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mt-3 mb-2">
            Investment <span className="text-muted-foreground font-light italic">Architecture</span>
          </h2>
          <div className="gold-rule mb-8 sm:mb-10" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border border border-border mb-10">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease }}
              className="bg-card p-6 sm:p-8"
            >
              <span className="font-mono text-[0.55rem] tracking-[0.18em] text-muted-foreground uppercase block mb-2">
                Total Investment
              </span>
              <span className="font-serif text-2xl sm:text-3xl font-bold text-primary">
                {financial.totalInvestment}
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease }}
              className="bg-card p-6 sm:p-8"
            >
              <span className="font-mono text-[0.55rem] tracking-[0.18em] text-muted-foreground uppercase block mb-2">
                Payback Period
              </span>
              <span className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                {financial.paybackYears}
              </span>
            </motion.div>
          </div>

          {/* Phase Investment Table */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
            className="border border-border bg-card overflow-hidden mb-10"
          >
            <div className="border-b border-border px-5 sm:px-6 py-4 bg-secondary/30">
              <span className="font-mono text-[0.58rem] tracking-[0.18em] text-primary uppercase font-medium">
                Investment Phases
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border bg-secondary/20">
                    {["Phase", "Cost", "Timeline", "ROI / Milestone"].map((h) => (
                      <th key={h} className="font-mono text-[0.52rem] sm:text-[0.58rem] tracking-[0.15em] text-muted-foreground uppercase px-4 sm:px-5 py-3 font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {financial.phases.map((phase, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-secondary/10 transition-colors">
                      <td className="font-sans text-xs sm:text-sm text-foreground px-4 sm:px-5 py-3 font-medium">
                        {phase.phase}
                      </td>
                      <td className="px-4 sm:px-5 py-3">
                        <span className="font-mono text-xs sm:text-sm text-primary font-medium">
                          {phase.cost}
                        </span>
                      </td>
                      <td className="font-mono text-[0.6rem] sm:text-xs text-muted-foreground px-4 sm:px-5 py-3">
                        {phase.timeline}
                      </td>
                      <td className="font-sans text-xs sm:text-sm text-muted-foreground px-4 sm:px-5 py-3">
                        {phase.roi}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Annual Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease }}
            className="border border-border bg-card overflow-hidden"
          >
            <div className="border-b border-border px-5 sm:px-6 py-4 bg-secondary/30">
              <span className="font-mono text-[0.58rem] tracking-[0.18em] text-primary uppercase font-medium">
                Annual Benefits
              </span>
            </div>
            <div className="divide-y divide-border/50">
              {financial.annualBenefits.map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06, ease }}
                  className="flex items-center justify-between px-5 sm:px-6 py-4 hover:bg-secondary/10 transition-colors"
                >
                  <span className="font-sans text-xs sm:text-sm text-foreground">
                    {benefit.driver}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs sm:text-sm text-primary font-medium">
                      {benefit.value}
                    </span>
                    <span className={`font-mono text-[0.48rem] sm:text-[0.52rem] tracking-[0.12em] uppercase px-2 py-0.5 border ${certaintyColors[benefit.certainty] || certaintyColors.MEDIUM}`}>
                      {benefit.certainty}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default FinancialTab;
