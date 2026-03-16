import { motion } from "framer-motion";
import type { ProjectData } from "@/data/projects";

const ease = [0.16, 1, 0.3, 1] as const;

interface RiskTabProps {
  project: ProjectData;
}

const RiskTab = ({ project }: RiskTabProps) => {
  if (!project.riskMatrix) {
    return (
      <section className="py-16 px-4 sm:px-6 md:px-16 lg:px-20">
        <div className="max-w-[1200px] mx-auto text-center">
          <span className="font-mono text-[0.6rem] tracking-[0.2em] text-muted-foreground uppercase">Risk assessment data not yet available for this project.</span>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-16 lg:px-20">
      <div className="max-w-[1200px] mx-auto">
        <span className="section-label">RISK ASSESSMENT</span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mt-4 mb-2">
          Gestão de <span className="text-muted-foreground font-light italic">Riscos</span>
        </h2>
        <div className="gold-rule mb-8 sm:mb-10" />

        <div className="space-y-3">
          {project.riskMatrix.map((risk, i) => (
            <motion.div
              key={risk.risk}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="border border-border bg-card p-4 sm:p-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                <span className="font-serif text-sm font-bold text-foreground">{risk.risk}</span>
                <div className="flex gap-2">
                  <span className="font-mono text-[0.5rem] tracking-[0.1em] text-destructive bg-destructive/10 px-2 py-0.5 border border-destructive/20">{risk.probability}</span>
                  <span className="font-mono text-[0.5rem] tracking-[0.1em] text-primary bg-primary/10 px-2 py-0.5 border border-primary/20">Impacto: {risk.impact}</span>
                </div>
              </div>
              <p className="font-mono text-[0.6rem] text-muted-foreground">{risk.mitigation}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RiskTab;
