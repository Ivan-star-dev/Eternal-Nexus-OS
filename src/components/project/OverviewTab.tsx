import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, ChevronRight, Zap, Truck, Droplets, Activity, Database } from "lucide-react";
import type { ProjectData } from "@/data/projects";
import ProjectGallery from "@/components/ProjectGallery";
import { EASE_OUT } from "@/lib/motion/config";

const ease = EASE_OUT;
const pillarIcons = [Zap, Truck, Droplets, Activity, Database];

interface OverviewTabProps {
  project: ProjectData;
  projectId: string;
}

const OverviewTab = ({ project, projectId }: OverviewTabProps) => {
  return (
    <>
      {/* Executive Summary */}
      <section className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 md:px-16 lg:px-20">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
          <div className="lg:col-span-3">
            <span className="section-label">SECTION 00 · EXECUTIVE BRIEFING</span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mt-4 mb-2">
              Resumo <span className="text-muted-foreground font-light italic">Executivo</span>
            </h2>
            <div className="gold-rule mb-8" />

            <div className="callout-gold mb-8">
              <span className="font-mono text-[0.55rem] sm:text-[0.58rem] tracking-[0.2em] text-primary uppercase mb-3 block font-medium">STRATEGIC POSITIONING</span>
              <p className="font-serif text-sm sm:text-base text-foreground/85 leading-[1.85] italic">{project.summary}</p>
            </div>

            {projectId === "deltaspine-nl" && (
              <Link
                to="/investor/deltaspine-nl"
                className="inline-flex items-center gap-2 font-mono text-[0.6rem] sm:text-[0.68rem] tracking-[0.12em] text-primary border border-primary px-4 sm:px-6 py-3 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Shield className="w-3.5 h-3.5" />
                VIEW INVESTOR BRIEFING
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="doc-border bg-card overflow-hidden">
              <div className="bg-secondary/50 px-4 sm:px-5 py-3 border-b border-border flex items-center justify-between">
                <span className="font-mono text-[0.5rem] sm:text-[0.55rem] tracking-[0.18em] text-primary uppercase font-medium">TECHNICAL DRAWING · 02/15</span>
                <span className="font-mono text-[0.45rem] sm:text-[0.5rem] text-muted-foreground">DESENHO TÉCNICO</span>
              </div>
              <img src={project.technicalImages[0]} alt={`${project.title} — Technical Drawing`} className="w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Five Pillars */}
      <section className="border-t border-border py-16 sm:py-20 md:py-28 px-4 sm:px-6 md:px-16 lg:px-20">
        <div className="max-w-[1200px] mx-auto">
          <span className="section-label">SECTION 02 · SYSTEM ARCHITECTURE</span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mt-4 mb-2">
            Cinco <span className="text-primary">Pilares</span> <span className="text-muted-foreground font-light italic">do Sistema</span>
          </h2>
          <div className="gold-rule mb-10 sm:mb-12" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {project.pillars.map((pillar, i) => {
              const Icon = pillarIcons[i];
              return (
                <motion.div
                  key={pillar.num}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="bg-background p-6 sm:p-8 hover:bg-card transition-colors duration-300 group"
                >
                  <div className="flex items-center justify-between mb-4 sm:mb-5">
                    <span className="font-mono text-[0.55rem] sm:text-[0.58rem] tracking-[0.2em] text-primary font-medium">PILLAR {pillar.num}</span>
                    <Icon className="w-4 sm:w-5 h-4 sm:h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground mb-3">{pillar.title}</h3>
                  <p className="font-sans text-xs sm:text-sm text-muted-foreground leading-[1.75] mb-4 sm:mb-5">{pillar.desc}</p>
                  <div className="pt-3 sm:pt-4 border-t border-border flex items-baseline gap-2">
                    <span className="font-serif text-xl sm:text-2xl font-bold text-foreground">{pillar.stat}</span>
                    <span className="font-mono text-[0.5rem] sm:text-[0.55rem] tracking-[0.1em] text-teal-light uppercase">{pillar.statLabel}</span>
                  </div>
                </motion.div>
              );
            })}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-card p-6 sm:p-8 flex flex-col justify-center"
            >
              <span className="font-mono text-[0.55rem] sm:text-[0.58rem] tracking-[0.2em] text-primary mb-4">INTEGRATED VALUE</span>
              <p className="font-serif text-base sm:text-lg text-foreground/80 italic leading-relaxed">
                "O frame não é apenas um túnel. É uma plataforma de serviços integrada."
              </p>
              <div className="gold-rule mt-6" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Context Sections */}
      <section className="border-t border-border py-16 sm:py-20 md:py-28 px-4 sm:px-6 md:px-16 lg:px-20 bg-card">
        <div className="max-w-[900px] mx-auto space-y-14 sm:space-y-20">
          {project.sections.map((section, i) => (
            <motion.div
              key={section.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease }}
            >
              <span className="section-label">SECTION {section.num}</span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground mt-3 mb-4">{section.title}</h3>
              <div className="gold-rule mb-6" />
              <p className="font-sans text-xs sm:text-sm text-muted-foreground leading-[1.85]">{section.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Project Gallery */}
      <ProjectGallery
        projectTitle={project.title}
        renderImage={project.renderImage}
        technicalImages={project.technicalImages}
        conceptImages={project.conceptImages}
      />
    </>
  );
};

export default OverviewTab;
