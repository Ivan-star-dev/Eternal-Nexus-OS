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
        {/* ═══ HERO — Clean, Apple-level ═══ */}
        <section ref={heroRef} className="relative min-h-[100vh] flex flex-col items-center justify-center overflow-hidden" aria-label="Eternal Nexus — Visão estratégica global" role="banner">
          {/* 3D Globe background */}
          <Suspense fallback={null}>
            <InteractiveGlobe onHotspotClick={(id) => console.log("hotspot", id)} />
          </Suspense>

          {/* Radial overlay for text readability */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--background)/0.4)_0%,hsl(var(--background)/0.85)_60%,hsl(var(--background))_100%)] z-[1]" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-[1]" aria-hidden="true" />

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
              <span className="font-mono text-[0.6rem] tracking-[0.3em] text-primary/70 uppercase">
                Next Path Infra · Strategic Division
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1, ease }}
              className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground leading-[0.92] tracking-tight"
              id="main-heading"
            >
              Eternal Nexus
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8, ease }}
              className="font-serif text-lg sm:text-xl md:text-2xl text-primary/80 mt-6 italic font-light"
            >
              Projetos para o Futuro — <span className="text-morabeza">com morabeza</span>
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="font-sans text-sm sm:text-base text-muted-foreground mt-4 max-w-lg mx-auto leading-relaxed"
            >
              Criados por humanos + IA, validados por dados reais.
              5 megaprojetos que redesenham energia, computação e sistemas planetários.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-4 mt-10"
            >
              <a
                href="#dossiers"
                className="font-mono text-[0.65rem] tracking-[0.12em] bg-primary text-primary-foreground px-6 py-3 hover:bg-primary/90 hover:shadow-[0_0_24px_-4px_hsl(var(--primary)/0.5)] active:scale-[0.97] transition-all duration-200 flex items-center gap-2 uppercase"
              >
                Ver Dossiês <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <Link
                to="/atlas"
                className="font-mono text-[0.65rem] tracking-[0.12em] border border-primary/40 text-primary px-6 py-3 hover:bg-primary/10 hover:shadow-[0_0_20px_-4px_hsl(var(--primary)/0.3)] hover:border-primary/60 active:scale-[0.97] transition-all duration-200 flex items-center gap-2 uppercase"
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

        {/* ═══ CONTRIBUIÇÕES PÚBLICAS ═══ */}
        <ContributionsSection />

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
