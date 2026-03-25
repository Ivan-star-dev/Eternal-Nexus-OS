import { motion } from "framer-motion";
import type { ProjectData } from "@/data/projects";
import { EASE_OUT } from "@/lib/motion/config";

const ease = EASE_OUT;

interface TimelineTabProps {
  project: ProjectData;
}

const TimelineTab = ({ project }: TimelineTabProps) => {
  return (
    <section className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 md:px-16 lg:px-20">
      <div className="max-w-[900px] mx-auto">
        <span className="section-label">DEPLOYMENT ROADMAP</span>
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mt-4 mb-2">
          Roadmap <span className="text-muted-foreground font-light italic">de Implantação</span>
        </h2>
        <div className="gold-rule mb-10 sm:mb-12" />

        <div className="relative pl-8 sm:pl-10">
          <div className="absolute left-2 sm:left-3 top-0 bottom-0 w-px bg-border" />
          {project.timeline.map((item, i) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6, ease }}
              className="relative mb-10 sm:mb-12 last:mb-0"
            >
              <div className={`absolute -left-[25px] sm:-left-[29px] top-[6px] w-[10px] h-[10px] rounded-full border-2 ${
                item.status === "now"
                  ? "bg-teal-light border-teal-light shadow-[0_0_0_4px_hsl(var(--teal)/0.2)]"
                  : item.status === "past"
                  ? "bg-gold-dim border-primary"
                  : "bg-muted border-muted-foreground/30"
              }`} />
              <span className="font-mono text-[0.55rem] sm:text-[0.58rem] tracking-[0.16em] text-primary">{item.year}</span>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground mt-1 mb-2">{item.phase}</h3>
              <p className="font-sans text-xs sm:text-sm text-muted-foreground leading-[1.75]">{item.desc}</p>
              <span className="font-mono text-[0.58rem] sm:text-[0.62rem] text-teal-light mt-2 block">Investment: {item.cost}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TimelineTab;
