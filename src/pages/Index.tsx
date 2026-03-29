import { motion } from "framer-motion";
import { FlaskConical, GraduationCap, Layers, CornerDownRight } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import PageTransition from "@/components/PageTransition";
import { useLanguage } from "@/contexts/LanguageContext";
import DossierCard from "@/components/home/DossierCard";
import ProjectsLiveSection from "@/components/home/ProjectsLiveSection";
import ProductHero from "@/components/home/ProductHero";
import { homeProjects } from "@/data/homeProjects";
import { useSession } from "@/contexts/SessionContext";
import type { TrinityFace } from "@/lib/memory/types";

const ease = [0.22, 1, 0.36, 1] as const;

const FACE_ENTRY: Record<TrinityFace, { path: string; label: string }> = {
  heaven_lab:  { path: "/lab",      label: "Lab — Retomar" },
  bridge_nova: { path: "/school",   label: "School — Retomar" },
  nexus_cria:  { path: "/workshop", label: "Creation — Retomar" },
};

function SessionAwareCTA() {
  const { session } = useSession();
  const isResume = session?.is_resume && session.re_entry_point?.startsWith('resume-swarm:');
  const resumeEntry = isResume && session ? FACE_ENTRY[session.active_face] ?? FACE_ENTRY.heaven_lab : null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {resumeEntry ? (
        <Link to={resumeEntry.path}
          className="font-mono text-[0.6rem] tracking-[0.12em] bg-primary text-primary-foreground px-6 py-3 hover:bg-primary/90 transition-all duration-200 flex items-center gap-2 uppercase">
          <CornerDownRight className="w-3.5 h-3.5" /> {resumeEntry.label}
        </Link>
      ) : (
        <Link to="/lab"
          className="font-mono text-[0.6rem] tracking-[0.12em] bg-primary text-primary-foreground px-6 py-3 hover:bg-primary/90 transition-all duration-200 flex items-center gap-2 uppercase">
          <FlaskConical className="w-3.5 h-3.5" /> Lab
        </Link>
      )}
      <Link to="/school"
        className="font-mono text-[0.6rem] tracking-[0.12em] border border-border text-foreground px-6 py-3 hover:bg-card transition-all duration-200 flex items-center gap-2 uppercase">
        <GraduationCap className="w-3.5 h-3.5" /> School
      </Link>
      <Link to="/workshop"
        className="font-mono text-[0.6rem] tracking-[0.12em] border border-border text-foreground px-6 py-3 hover:bg-card transition-all duration-200 flex items-center gap-2 uppercase">
        <Layers className="w-3.5 h-3.5" /> Creation
      </Link>
    </div>
  );
}

const Index = () => {
  const { t } = useLanguage();
  return (
    <Layout>
      <PageTransition>
        <ProductHero />
        <section id="dossiers" className="py-20 sm:py-28 px-4 sm:px-6 md:px-16 lg:px-20">
          <div className="max-w-[1200px] mx-auto">
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, ease }} className="text-center mb-16">
              <motion.span initial={{ opacity: 0, letterSpacing: "0.5em" }} whileInView={{ opacity: 1, letterSpacing: "0.25em" }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.8 }} className="font-mono text-[0.55rem] tracking-[0.25em] text-muted-foreground uppercase block">Dossiês Estratégicos</motion.span>
              <motion.h2 initial={{ opacity: 0, y: 20, scale: 0.98 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.8, ease }} className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mt-3">
                Projetos <span className="text-primary italic font-light">Ativos</span>
              </motion.h2>
              <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.8, ease }} className="h-px w-20 mx-auto mt-6 origin-center" style={{ background: "var(--gradient-gold)" }} />
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {homeProjects.map((project, i) => (
                <motion.div key={project.id} initial={{ opacity: 0, y: 60, scale: 0.95 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: i * 0.12, duration: 0.7, ease }}>
                  <DossierCard project={project} index={i} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        <ProjectsLiveSection />
        <section className="border-t border-border py-20 sm:py-28 px-4 sm:px-6 md:px-16 lg:px-20 cinematic-vignette">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8, ease }}>
              <motion.h2 initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.8, ease }} className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
                Escolhe o teu <span className="text-primary italic">domínio.</span>
              </motion.h2>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed max-w-md mx-auto mb-10">
                Três portais. Um organismo. Cada sessão constrói sobre a anterior.
              </p>
              <SessionAwareCTA />
            </motion.div>
          </div>
        </section>
      </PageTransition>
    </Layout>
  );
};

export default Index;
