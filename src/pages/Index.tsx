import { motion } from "framer-motion";
import { Globe, Heart, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import PageTransition from "@/components/PageTransition";
import { useLanguage } from "@/contexts/LanguageContext";
import DossierCard from "@/components/home/DossierCard";
import ContributionsSection from "@/components/home/ContributionsSection";
import OrganStatusGrid from "@/components/home/OrganStatusGrid";
import ProjectsLiveSection from "@/components/home/ProjectsLiveSection";
import { homeProjects } from "@/data/homeProjects";
import WorldPulse from "@/components/home/WorldPulse";
import ScenarioComparison from "@/components/home/ScenarioComparison";
import MetricsTimeline from "@/components/home/MetricsTimeline";
import EarthLab from "@/components/home/EarthLab";
import LearningPathway from "@/components/home/LearningPathway";
import CollaborationHub from "@/components/home/CollaborationHub";
import EcosystemMap from "@/components/home/EcosystemMap";
import ManifestoSection from "@/components/home/ManifestoSection";
import WorldClock from "@/components/home/WorldClock";
import V10Proof from "@/components/home/V10Proof";
import PlatformStats from "@/components/home/PlatformStats";
import ResearchCallout from "@/components/home/ResearchCallout";
import RoadmapTimeline from "@/components/home/RoadmapTimeline";
import QuoteBlock from "@/components/home/QuoteBlock";
import ProductHero from "@/components/home/ProductHero";

const ease = [0.16, 1, 0.3, 1] as const;

const Index = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      <PageTransition>
        {/* ═══ HERO — Product Face canonical anatomy ═══
            Law: HEAVEN_LAB_REFERENCE_SURFACE.md
            Read order: 1. Globe  2. Trinity  3. First Proof
        */}
        <ProductHero
          onHotspotClick={(id) => {
            if (process.env.NODE_ENV !== "production") {
              console.log("hotspot", id);
            }
          }}
        />

        {/* ═══ PLATFORM STATS — Live Activity Strip ═══ */}
        <PlatformStats />

        {/* ═══ DOSSIÊS — Apple-style staggered scroll reveals ═══ */}
        <section id="dossiers" className="py-20 sm:py-28 px-4 sm:px-6 md:px-16 lg:px-20" aria-label="Dossiês estratégicos dos projetos ativos">
          <div className="max-w-[1200px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease }}
              className="text-center mb-16"
            >
              <motion.span
                initial={{ opacity: 0, letterSpacing: "0.5em" }}
                whileInView={{ opacity: 1, letterSpacing: "0.25em" }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="font-mono text-[0.55rem] tracking-[0.25em] text-muted-foreground uppercase block"
              >
                Dossiês Estratégicos
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.8, ease }}
                className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mt-3"
              >
                Projetos <span className="text-primary italic font-light">Ativos</span>
              </motion.h2>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8, ease }}
                className="h-px w-20 mx-auto mt-6 origin-center"
                style={{ background: "var(--gradient-gold)" }}
              />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {homeProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 60, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.12, duration: 0.7, ease }}
                >
                  <DossierCard project={project} index={i} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ PORTFÓLIO ATLAS — Layer 2 Supabase ═══ */}
        <ProjectsLiveSection />

        {/* ═══ ÓRGÃOS DO ORGANISMO ═══ */}
        <OrganStatusGrid />

        {/* ═══ RESEARCH CALLOUT — Methodology ═══ */}
        <section className="relative py-8 px-6 md:px-16 max-w-7xl mx-auto w-full">
          <ResearchCallout />
        </section>

        {/* ═══ EARTH LAB — V5 Research Core ═══ */}
        <EarthLab />

        {/* ═══ LEARNING PATHWAY — V6 Mastery ═══ */}
        <section className="relative py-16 px-6 md:px-16 max-w-7xl mx-auto w-full">
          <LearningPathway />
        </section>

        {/* ═══ COLLABORATION HUB — V7 Intelligence ═══ */}
        <section className="relative py-16 px-6 md:px-16 max-w-7xl mx-auto w-full">
          <CollaborationHub />
        </section>

        {/* ═══ ECOSYSTEM MAP — V8 Convergence ═══ */}
        <EcosystemMap />

        {/* ═══ ROADMAP TIMELINE — V1→V10 Progress ═══ */}
        <section className="relative py-16 px-6 md:px-16 max-w-7xl mx-auto w-full">
          <RoadmapTimeline />
        </section>

        {/* ═══ MANIFESTO — V9 Category Power ═══ */}
        <ManifestoSection />

        {/* ═══ WORLD CLOCK — Live Global Sync ═══ */}
        <WorldClock />

        {/* ═══ V10 PROOF — Universal Factory Proof ═══ */}
        <V10Proof />

        {/* ═══ QUOTE BLOCK — Rotating Manifesto ═══ */}
        <section className="relative py-16 px-6 md:px-16 max-w-3xl mx-auto w-full">
          <QuoteBlock />
        </section>

        {/* ═══ CONTRIBUIÇÕES PÚBLICAS ═══ */}
        <ContributionsSection />

        {/* ═══ OBSERVATORY DATA ═══ */}
        <section className="relative py-16 px-6 md:px-16 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto w-full">
          <WorldPulse />
          <ScenarioComparison />
        </section>

        {/* ═══ HISTORICAL METRICS ═══ */}
        <section className="relative py-8 px-6 md:px-16 max-w-7xl mx-auto w-full">
          <MetricsTimeline />
        </section>

        {/* ═══ CTA FOOTER — Apple-style reveal ═══ */}
        <section className="border-t border-border py-20 sm:py-28 px-4 sm:px-6 md:px-16 lg:px-20 cinematic-vignette">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease }}
            >
              <motion.h2
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.8, ease }}
                className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4"
              >
                Contribua. <span className="text-primary italic">Colabore.</span>
              </motion.h2>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed max-w-md mx-auto mb-10">
                Doe tempo, recursos ou ideias. Cada sugestão validada entra no ciclo Nexus → Atlas → Execução.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/nexus"
                  className="font-mono text-[0.6rem] tracking-[0.12em] bg-primary text-primary-foreground px-6 py-3 hover:bg-primary/90 hover:shadow-[0_0_24px_-4px_hsl(var(--primary)/0.5)] active:scale-[0.97] transition-all duration-200 flex items-center gap-2 uppercase"
                >
                  <Heart className="w-3.5 h-3.5" /> Nexus — Parlamento AI
                </Link>
                <Link
                  to="/tribunal"
                  className="font-mono text-[0.6rem] tracking-[0.12em] border border-border text-foreground px-6 py-3 hover:bg-card hover:border-primary/30 hover:shadow-[0_0_16px_-4px_hsl(var(--primary)/0.2)] active:scale-[0.97] transition-all duration-200 flex items-center gap-2 uppercase"
                >
                  <Globe className="w-3.5 h-3.5" /> Tribunal Geopolítico
                </Link>
                <Link
                  to="/news"
                  className="font-mono text-[0.6rem] tracking-[0.12em] border border-border text-foreground px-6 py-3 hover:bg-card hover:border-primary/30 hover:shadow-[0_0_16px_-4px_hsl(var(--primary)/0.2)] active:scale-[0.97] transition-all duration-200 flex items-center gap-2 uppercase"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> News Portal
                </Link>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="font-serif text-lg sm:text-xl text-morabeza italic mt-16"
            >
              Cure o mundo. Um ponto por vez. <span className="text-morabeza-sunset">Morabeza.</span>
            </motion.p>
          </div>
        </section>
      </PageTransition>
    </Layout>
  );
};

export default Index;
