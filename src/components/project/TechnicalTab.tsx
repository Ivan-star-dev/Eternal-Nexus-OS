import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { Globe, Building, Grid3X3, Users } from "lucide-react";
import type { ProjectData } from "@/data/projects";
import { EASE_OUT } from "@/lib/motion/config";

const CanalSimulation3D = lazy(() => import("@/components/briefing/CanalSimulation3D"));
const GeoCoreSimulation3D = lazy(() => import("@/components/briefing/GeoCoreSimulation3D"));
const TerraLentaSimulation3D = lazy(() => import("@/components/briefing/TerraLentaSimulation3D"));
const FusionCoreSimulation3D = lazy(() => import("@/components/briefing/FusionCoreSimulation3D"));
const ChipFoldSimulation3D = lazy(() => import("@/components/briefing/ChipFoldSimulation3D"));

const ease = EASE_OUT;

interface TechnicalTabProps {
  project: ProjectData;
  projectId: string;
}

const SimulationFallback = () => (
  <div className="min-h-[400px] sm:min-h-[500px] flex items-center justify-center bg-background">
    <span className="font-mono text-[0.55rem] tracking-[0.2em] text-muted-foreground animate-pulse uppercase">Loading 3D Simulation...</span>
  </div>
);

const TechnicalTab = ({ project, projectId }: TechnicalTabProps) => {
  return (
    <>
      {/* Technical Gallery */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-16 lg:px-20 bg-card">
        <div className="max-w-[1200px] mx-auto">
          <span className="section-label">TECHNICAL DOCUMENTATION</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mt-4 mb-2">
            Desenhos <span className="text-muted-foreground font-light italic">Técnicos</span>
          </h2>
          <div className="gold-rule mb-8 sm:mb-10" />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {project.technicalImages.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6, ease }}
                className="doc-border bg-background overflow-hidden group"
              >
                <div className="bg-secondary/50 px-3 sm:px-4 py-2 border-b border-border flex items-center justify-between">
                  <span className="font-mono text-[0.48rem] sm:text-[0.5rem] tracking-[0.15em] text-primary uppercase">SHEET {String(i + 1).padStart(2, "0")}/15</span>
                  <span className="font-mono text-[0.44rem] sm:text-[0.48rem] text-muted-foreground uppercase">{project.title}</span>
                </div>
                <div className="overflow-hidden">
                  <motion.img src={img} alt={`Technical drawing ${i + 1}`} className="w-full h-48 sm:h-64 object-cover transition-transform duration-700" whileHover={{ scale: 1.04 }} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Full-width render */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
            className="mt-6 doc-border bg-background overflow-hidden"
          >
            <div className="bg-secondary/50 px-4 sm:px-5 py-3 border-b border-border">
              <span className="font-mono text-[0.5rem] sm:text-[0.55rem] tracking-[0.18em] text-primary uppercase font-medium">CGI RENDER · CONCEPTUAL VISUALIZATION</span>
            </div>
            <img src={project.renderImage} alt={`${project.title} CGI Render`} className="w-full object-cover max-h-[400px] sm:max-h-[500px]" />
          </motion.div>
        </div>
      </section>

      {/* Concept Images */}
      {project.conceptImages && project.conceptImages.length > 0 && (
        <section className="border-t border-border py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-16 lg:px-20">
          <div className="max-w-[1200px] mx-auto">
            <span className="section-label">CONCEPT MEDIA</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mt-4 mb-2">
              Galeria <span className="text-muted-foreground font-light italic">Conceptual</span>
            </h2>
            <div className="gold-rule mb-8 sm:mb-10" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.conceptImages.map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease }}
                  className="doc-border bg-background overflow-hidden"
                >
                  <img src={img.src} alt={img.caption} className="w-full h-64 object-cover" />
                  <div className="px-4 py-3 border-t border-border">
                    <span className="font-mono text-[0.55rem] text-muted-foreground">{img.caption}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tech Specs */}
      {project.techSpecs && (
        <section className="border-t border-border py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-16 lg:px-20 bg-card">
          <div className="max-w-[1200px] mx-auto">
            <span className="section-label">TECHNICAL SPECIFICATIONS</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mt-4 mb-2">
              Especificações <span className="text-muted-foreground font-light italic">Técnicas</span>
            </h2>
            <div className="gold-rule mb-8 sm:mb-10" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
              {project.techSpecs.map((spec, i) => (
                <motion.div
                  key={spec.label}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="bg-background p-5"
                >
                  <span className="font-mono text-[0.5rem] tracking-[0.15em] text-muted-foreground uppercase block mb-2">{spec.label}</span>
                  <span className="font-serif text-xl font-bold text-primary block mb-1">{spec.value}</span>
                  {spec.detail && <span className="font-mono text-[0.55rem] text-muted-foreground">{spec.detail}</span>}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* NL Sub-sections */}
      {project.nlSubSections && (
        <section className="border-t border-border py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-16 lg:px-20">
          <div className="max-w-[1200px] mx-auto">
            <span className="section-label">SOLUÇÕES FECHADAS · HOLANDA 2026</span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mt-4 mb-2">
              Problemas <span className="text-primary">Holandeses</span> <span className="text-muted-foreground font-light italic">— Soluções Fechadas</span>
            </h2>
            <div className="gold-rule mb-10 sm:mb-12" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-border">
              {project.nlSubSections.map((sub, i) => {
                const IconMap: Record<string, any> = { building: Building, grid: Grid3X3, users: Users };
                const SubIcon = IconMap[sub.icon] || Globe;
                return (
                  <motion.div
                    key={sub.title}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="bg-background p-6 sm:p-8"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-[0.55rem] tracking-[0.2em] text-primary font-medium">WP #{i + 1}</span>
                      <SubIcon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground mb-1">{sub.title}</h3>
                    <p className="font-mono text-[0.55rem] text-muted-foreground mb-3">{sub.subtitle}</p>
                    <div className="callout-gold mb-4 p-3">
                      <span className="font-mono text-[0.5rem] text-primary">{sub.stats}</span>
                    </div>
                    <p className="font-sans text-xs text-muted-foreground leading-[1.75] mb-5">{sub.desc}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {sub.metrics.map((m) => (
                        <div key={m.label} className="border border-border/50 px-3 py-2 bg-card">
                          <span className="font-serif text-sm font-bold text-foreground block">{m.value}</span>
                          <span className="font-mono text-[0.48rem] tracking-[0.1em] text-muted-foreground uppercase">{m.label}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 3D Simulation */}
      <section className="border-t border-border">
        <Suspense fallback={<SimulationFallback />}>
          {projectId === "deltaspine-nl" && <CanalSimulation3D />}
          {projectId === "geocore-power" && <GeoCoreSimulation3D />}
          {projectId === "terra-lenta" && <TerraLentaSimulation3D />}
          {projectId === "fusion-core" && <FusionCoreSimulation3D />}
          {projectId === "chip-fold" && <ChipFoldSimulation3D />}
        </Suspense>
      </section>
    </>
  );
};

export default TechnicalTab;
