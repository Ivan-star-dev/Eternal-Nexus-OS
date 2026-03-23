import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, lazy, Suspense } from "react";
import { ArrowRight, Globe, Heart, Github, ChevronUp, ChevronDown, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import PageTransition from "@/components/PageTransition";
import { useLanguage } from "@/contexts/LanguageContext";
import DossierCard from "@/components/home/DossierCard";
import ContributionsSection from "@/components/home/ContributionsSection";
import OrganStatusGrid from "@/components/home/OrganStatusGrid";
import ProjectsLiveSection from "@/components/home/ProjectsLiveSection";
import { homeProjects } from "@/data/homeProjects";
import OrganErrorBoundary from "@/components/shared/OrganErrorBoundary";
import WorldPulse from "@/components/home/WorldPulse";
import ScenarioComparison from "@/components/home/ScenarioComparison";
import MetricsTimeline from "@/components/home/MetricsTimeline";
import EarthLab from "@/components/home/EarthLab";

const InteractiveGlobe = lazy(() => import("@/components/globe/InteractiveGlobe"));

const ease = [0.16, 1, 0.3, 1] as const;

const Index = () => {
  const { t } = useLanguage();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <Layout>
      <PageTransition>
        {/* ═══ HERO — Strategic Observatory ═══ */}
        <section ref={heroRef} className="relative min-h-[100vh] flex flex-col items-center justify-center overflow-hidden" aria-label="Eternal Nexus — Visão estratégica global" role="banner">
          {/* 3D Globe background */}
          <OrganErrorBoundary organName="Globe" silent>
            <Suspense fallback={
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.05)_0%,transparent_70%)]" />
            }>
              <InteractiveGlobe onHotspotClick={(id) => console.log("hotspot", id)} />
            </Suspense>
          </OrganErrorBoundary>

          {/* Radial overlay for text readability */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--background)/0.4)_0%,hsl(var(--background)/0.85)_60%,hsl(var(--background))_100%)] z-[1]" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-[1]" aria-hidden="true" />

          {/* Engineering grid — Heaven Lab texture */}
          <div className="absolute inset-0 engineering-grid z-[1] pointer-events-none opacity-60" aria-hidden="true" />

          {/* Atmospheric orbs */}
          <div className="absolute pointer-events-none z-[1]" aria-hidden="true" style={{
            top: "10%", right: "-8%",
            width: "50vw", height: "50vw",
            background: "radial-gradient(ellipse at center, hsl(42 78% 45% / 0.055) 0%, transparent 62%)",
            filter: "blur(48px)",
          }} />
          <div className="absolute pointer-events-none z-[1]" aria-hidden="true" style={{
            bottom: "18%", left: "-10%",
            width: "44vw", height: "44vw",
            background: "radial-gradient(ellipse at center, hsl(172 55% 28% / 0.045) 0%, transparent 58%)",
            filter: "blur(56px)",
          }} />

          {/* Institutional classification strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 1.2 }}
            className="absolute top-0 left-0 right-0 z-[3] border-b border-white/[0.04] py-2 px-6 md:px-16 flex items-center justify-between pointer-events-none"
            aria-hidden="true"
          >
            <span className="font-mono text-[0.48rem] tracking-[0.28em] text-gold/45 uppercase">
              Next Path Infrastructure Authority · Observatory Node-01
            </span>
            <span className="hidden sm:block font-mono text-[0.48rem] tracking-[0.22em] text-muted-foreground/35 uppercase">
              2026 · Active
            </span>
          </motion.div>

          <motion.div
            style={{ scale: heroScale, opacity: heroOpacity, zIndex: 2 }}
            className="relative text-center px-6 max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease }}
              className="mb-8"
            >
              <span className="section-label">
                Eternal Nexus OS · Strategic Division
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1, ease }}
              className="font-light tracking-tight text-5xl md:text-7xl text-paper"
              id="main-heading"
            >
              Eternal Nexus
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease }}
              className="text-paper-dim text-base md:text-lg font-light mt-4"
            >
              A scientific workspace for the world
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease }}
              className="font-serif text-lg sm:text-xl md:text-2xl text-primary/80 mt-5 italic font-light"
            >
              Infra. Produto. Governança. <span className="text-morabeza not-italic font-light">— com morabeza.</span>
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="font-sans text-sm sm:text-base text-muted-foreground mt-4 max-w-lg mx-auto leading-relaxed"
            >
              Megaprojetos de infraestrutura planetária — energia, computação, sistemas globais.
              Construídos por humanos e IA. Validados por dados reais.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-4 mt-10"
            >
              {/* Primary CTA — gold outlined */}
              <a
                href="#dossiers"
                className="font-mono text-[0.65rem] tracking-[0.12em] border border-gold/60 text-gold px-6 py-3 hover:bg-gold/10 hover:shadow-[0_0_24px_-4px_hsl(42_78%_45%/0.4)] active:scale-[0.97] transition-all duration-200 flex items-center gap-2 uppercase"
              >
                Ver Dossiês <ArrowRight className="w-3.5 h-3.5" />
              </a>
              {/* Secondary CTA — ghost */}
              <Link
                to="/atlas"
                className="font-mono text-[0.65rem] tracking-[0.12em] border border-white/[0.12] text-muted-foreground px-6 py-3 hover:bg-white/[0.04] hover:text-foreground hover:border-white/20 active:scale-[0.97] transition-all duration-200 flex items-center gap-2 uppercase"
              >
                <Globe className="w-3.5 h-3.5" /> Atlas Global
              </Link>
            </motion.div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.4, duration: 1, ease }}
              className="h-px w-32 mx-auto mt-12 origin-center"
              style={{ background: "var(--gradient-gold)" }}
            />
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-5 h-8 rounded-full border border-primary/30 flex items-start justify-center pt-1.5"
            >
              <div className="w-1 h-1.5 rounded-full bg-primary/50" />
            </motion.div>
          </motion.div>
        </section>

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

        {/* ═══ EARTH LAB — V5 Research Core ═══ */}
        <EarthLab />

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
