import { motion } from "framer-motion";
import { Globe, Heart, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import PageTransition from "@/components/PageTransition";
import DossierCard from "@/components/home/DossierCard";
import ContributionsSection from "@/components/home/ContributionsSection";
import OrganStatusGrid from "@/components/home/OrganStatusGrid";
import ProjectsLiveSection from "@/components/home/ProjectsLiveSection";
import ProductHero from "@/components/home/ProductHero";
import { homeProjects } from "@/data/homeProjects";

const ease = [0.22, 1, 0.36, 1] as const;

const Index = () => {
  return (
    <Layout>
      <PageTransition>
        {/* ═══ HERO — Heaven Lab canonical surface ═══ */}
        <ProductHero />

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
