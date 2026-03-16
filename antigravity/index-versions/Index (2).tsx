import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, lazy, Suspense } from "react";
import { ArrowRight, Shield, ChevronRight, Play, Activity, Zap, Droplets } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import GlobeBackground from "@/components/GlobeBackground";
import IntroBanner from "@/components/IntroBanner";
import TickerBar from "@/components/TickerBar";
import PlatformCapabilities from "@/components/PlatformCapabilities";
import { useLanguage } from "@/contexts/LanguageContext";
import deltaSpineRender from "@/assets/deltaspine-render.png";
import geocoreHero from "@/assets/geocore-power-hero.jpg";
import terraLentaHero from "@/assets/terra-lenta-hero.jpg";
import fusionCoreHero from "@/assets/fusion-core-hero.jpg";
import chipFoldHero from "@/assets/chip-fold-hero.jpg";

const CanalSimulation3D = lazy(() => import("@/components/briefing/CanalSimulation3D"));

const ease = [0.16, 1, 0.3, 1] as const;

const projects = [
  {
    id: "deltaspine-nl",
    number: "NPI-001",
    title: "DeltaSpine NL",
    subtitle: "Frame sub-canal modular reversível • 300 km/h maglev + tratamento N em tempo real + H₂ onboard",
    country: "NETHERLANDS",
    status: "ACTIVE",
    classification: "CONFIDENTIAL — GOV ONLY",
    sectors: ["Mobility", "Logistics", "Energy", "Environment", "Data"],
    image: deltaSpineRender,
    metrics: [
      { value: "15-25%", label: "REDUÇÃO N CANAL" },
      { value: "300 km/h", label: "CRUISE (LOW-VAC)" },
      { value: "€200M", label: "PILOT 4KM" },
      { value: "8-12 ANOS", label: "PAYBACK" },
    ],
  },
  {
    id: "geocore-power",
    number: "NPI-002",
    title: "GeoCore Power",
    subtitle: "Perfuração ultra-profunda 15–50 km • Gyrotron + Rotary híbrido • 80–150 GW por poço",
    country: "GLOBAL",
    status: "ACTIVE",
    classification: "CONFIDENTIAL — STRATEGIC",
    sectors: ["Energy", "Geothermal", "Deep Tech", "Climate"],
    image: geocoreHero,
    metrics: [
      { value: "80-150 GW", label: "POR POÇO" },
      { value: "$0.015", label: "USD/KWH" },
      { value: "50 km", label: "PROFUNDIDADE" },
      { value: "250-400%", label: "ROI 8 ANOS" },
    ],
  },
  {
    id: "terra-lenta",
    number: "NPI-003",
    title: "Terra Lenta",
    subtitle: "Redução controlada de 10% na rotação terrestre • Dia de 26,4h • +876 horas/ano",
    country: "GLOBAL",
    status: "RESEARCH",
    classification: "CONFIDENTIAL — STRATEGIC",
    sectors: ["Planetary Eng.", "Climate", "Agriculture", "Geopolitics"],
    image: terraLentaHero,
    metrics: [
      { value: "26.4h", label: "NOVO DIA" },
      { value: "+876h", label: "HORAS/ANO" },
      { value: "-20%", label: "FURACÕES" },
      { value: "+8%", label: "PIB GLOBAL" },
    ],
  },
  {
    id: "fusion-core",
    number: "NPI-004",
    title: "Fusion Core",
    subtitle: "Integração sistémica GeoCore + Terra Lenta • 1 TW limpo • Sistema auto-catalítico",
    country: "GLOBAL",
    status: "PLANNING",
    classification: "CONFIDENTIAL — STRATEGIC",
    sectors: ["Systems Integration", "Energy", "Planetary Eng.", "AI"],
    image: fusionCoreHero,
    metrics: [
      { value: "1 TW", label: "ENERGIA LIMPA" },
      { value: "+10%", label: "PIB GLOBAL" },
      { value: "-40%", label: "FOME GLOBAL" },
      { value: "20-25", label: "ANOS IMPACTO" },
    ],
  },
  {
    id: "chip-fold",
    number: "NPI-005",
    title: "Chip Fold",
    subtitle: "Computação por dobramento de celulose nanofibrilada • 100x silício • 10x mais barato",
    country: "GLOBAL",
    status: "ACTIVE",
    classification: "CONFIDENTIAL — STRATEGIC",
    sectors: ["Computing", "Deep Tech", "Sustainability", "AI"],
    image: chipFoldHero,
    metrics: [
      { value: "100x", label: "VS SILÍCIO" },
      { value: "10x", label: "MAIS BARATO" },
      { value: "-70%", label: "ENERGIA" },
      { value: "100%", label: "RECICLÁVEL" },
    ],
  },
];

const Index = () => {
  const { t } = useLanguage();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [0.3, 0]);
  const [showTelemetry, setShowTelemetry] = useState(false);

  return (
    <Layout>
      <IntroBanner />
      <TickerBar />

      {/* HERO */}
      <section ref={heroRef} className="relative min-h-[90vh] flex flex-col justify-end overflow-hidden">
        <GlobeBackground />
        <div className="absolute inset-0 bg-background/70" />
        <div className="absolute inset-0 engineering-grid pointer-events-none" />
        <div className="absolute inset-0 scanlines pointer-events-none opacity-20" />

        <div className="relative z-10 px-6 md:px-20 pb-16 max-w-[1200px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5, ease }}
            className="stamp-classified inline-block mb-8"
          >
            CONFIDENTIAL • NEXT PATH INFRA
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1, ease }}
            className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[0.95] mb-4"
          >
            NEXT PATH<br />
            <motion.span
              className="text-primary inline-block"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1, duration: 0.8, ease }}
            >
              INFRA
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="font-sans text-base md:text-lg font-light text-muted-foreground max-w-xl leading-relaxed mt-6"
          >
            Compactando crises nacionais em um único backbone reversível e silencioso.
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.8, duration: 0.8, ease }}
            className="gold-rule mt-10 origin-left"
          />
        </div>
      </section>

      {/* PROJECTS — com telemetria live */}
      <section id="projects" className="border-t border-border py-20 md:py-28 px-6 md:px-20">
        <div className="max-w-[1200px] mx-auto">
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="section-label">
            {t("section_01")}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-3 mb-2"
          >
            Active <span className="text-muted-foreground font-light italic">Dossiers</span>
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="gold-rule mb-12 origin-left"
          />

          <div className="grid grid-cols-1 gap-6">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease }}
                onHoverStart={() => setShowTelemetry(true)}
                onHoverEnd={() => setShowTelemetry(false)}
                className="group relative bg-card border border-border overflow-hidden"
              >
                <Link to={`/project/${project.id}`} className="block">
                  {/* Image */}
                  <div className="relative h-64 md:h-80 overflow-hidden">
                    <motion.img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.7, ease }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="stamp-classified text-[0.55rem] px-2 py-0.5">{project.classification}</span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="font-mono text-[0.6rem] tracking-[0.2em] text-teal-light flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-dot" />
                        {project.status}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                      <div className="flex-1">
                        <span className="section-label">{project.number} · {project.country}</span>
                        <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground mt-2 group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        <p className="font-sans text-sm text-muted-foreground mt-2 leading-relaxed max-w-lg">
                          {project.subtitle}
                        </p>

                        {/* Sectors */}
                        <div className="flex flex-wrap gap-2 mt-4">
                          {project.sectors.map((sector, i) => (
                            <span
                              key={sector}
                              className="font-mono text-[0.6rem] tracking-[0.1em] text-accent-foreground bg-accent/10 border border-accent/20 px-2 py-0.5 uppercase"
                            >
                              {sector}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-primary font-mono text-[0.7rem] tracking-[0.15em] uppercase group-hover:gap-3 transition-all">
                        VIEW DOSSIER <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border mt-6 border border-border">
                      {project.metrics.map((m) => (
                        <div key={m.label} className="bg-card p-4">
                          <div className="font-serif text-lg md:text-xl font-bold text-foreground">{m.value}</div>
                          <div className="font-mono text-[0.52rem] tracking-[0.15em] text-muted-foreground uppercase mt-1">{m.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Link>

                {/* LIVE TELEMETRY PREVIEW */}
                <AnimatePresence>
                  {showTelemetry && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3 }}
                      className="absolute bottom-4 right-4 bg-background/95 border border-accent/30 backdrop-blur-sm p-4 max-w-[260px]"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Activity className="w-3 h-3 text-accent-foreground" />
                        <span className="font-mono text-[0.55rem] tracking-[0.2em] text-accent-foreground uppercase">Live Telemetry</span>
                      </div>
                      <div className="space-y-1.5">
                        <p className="font-mono text-[0.65rem] text-foreground/80">N-reduction: <span className="text-accent-foreground font-medium">−18.4%</span></p>
                        <p className="font-mono text-[0.65rem] text-foreground/80">Capsule speed: <span className="text-accent-foreground font-medium">287 km/h</span></p>
                        <p className="font-mono text-[0.65rem] text-foreground/80">H₂ generated: <span className="text-accent-foreground font-medium">412 kg/day</span></p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DELTASPINE LIVE DASHBOARD */}
      <section className="border-t border-border py-20 md:py-28 px-6 md:px-20 bg-card">
        <div className="max-w-[1200px] mx-auto">
          <span className="section-label">{t("section_02")}</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-3 mb-2">
            DeltaSpine <span className="text-muted-foreground font-light italic">Live Dashboard</span>
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="gold-rule mb-12 origin-left"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 3D Canal Simulation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease }}
              className="border border-border bg-background overflow-hidden lg:col-span-2"
            >
              <Suspense fallback={
                <div className="min-h-[500px] flex items-center justify-center bg-background">
                  <span className="font-mono text-[0.6rem] tracking-[0.2em] text-muted-foreground animate-pulse uppercase">Loading 3D Simulation...</span>
                </div>
              }>
                <CanalSimulation3D />
              </Suspense>
            </motion.div>

            {/* Real-time Telemetry */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15, ease }}
              className="border border-border bg-background p-6 md:p-8"
            >
              <div className="space-y-8">
                {/* N Load Reduction */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[0.6rem] tracking-[0.15em] text-muted-foreground uppercase">Canal N Load Reduction</span>
                    <span className="font-mono text-[0.6rem] tracking-[0.15em] text-accent-foreground uppercase">−22.7% Live</span>
                  </div>
                  <div className="w-full h-2 bg-secondary overflow-hidden">
                    <motion.div
                      className="h-full bg-accent"
                      initial={{ width: 0 }}
                      whileInView={{ width: "77.3%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease }}
                    />
                  </div>
                </div>

                {/* Capsules */}
                <div className="grid grid-cols-2 gap-px bg-border border border-border">
                  <div className="bg-card p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-3 h-3 text-primary" />
                      <span className="font-mono text-[0.52rem] tracking-[0.15em] text-muted-foreground uppercase">Capsules in Transit</span>
                    </div>
                    <div className="font-serif text-2xl font-bold text-foreground">12</div>
                  </div>
                  <div className="bg-card p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Droplets className="w-3 h-3 text-accent-foreground" />
                      <span className="font-mono text-[0.52rem] tracking-[0.15em] text-muted-foreground uppercase">H₂ Output Today</span>
                    </div>
                    <div className="font-serif text-2xl font-bold text-foreground">412 <span className="text-sm font-normal text-muted-foreground">kg</span></div>
                  </div>
                </div>

                {/* Avg Speed */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[0.6rem] tracking-[0.15em] text-muted-foreground uppercase">Avg Capsule Speed</span>
                    <span className="font-mono text-[0.6rem] tracking-[0.15em] text-primary uppercase">287 km/h</span>
                  </div>
                  <div className="w-full h-2 bg-secondary overflow-hidden">
                    <motion.div
                      className="h-full"
                      style={{ background: "var(--gradient-gold)" }}
                      initial={{ width: 0 }}
                      whileInView={{ width: "95.7%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: 0.3, ease }}
                    />
                  </div>
                </div>

                {/* Network Status */}
                <div className="flex items-center justify-between border-t border-border pt-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse-dot" />
                    <span className="font-mono text-[0.55rem] tracking-[0.15em] text-accent-foreground uppercase">Network Operational</span>
                  </div>
                  <span className="font-mono text-[0.5rem] tracking-[0.1em] text-muted-foreground/50 uppercase">Last sync: 2.4s ago</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* METHODOLOGY */}
      <section className="border-t border-border py-20 md:py-28 px-6 md:px-20">
        <div className="max-w-[1200px] mx-auto">
          <span className="section-label">{t("section_02")}</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-3 mb-2">
            {t("methodology")} <span className="text-muted-foreground font-light italic">{t("approach")}</span>
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="gold-rule mb-12 origin-left"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
            {[
              { num: "01", title: t("conceptual_design"), desc: t("conceptual_design_desc") },
              { num: "02", title: t("technical_viability"), desc: t("technical_viability_desc") },
              { num: "03", title: t("institutional_delivery"), desc: t("institutional_delivery_desc") },
            ].map((item, i) => (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12, ease }}
                className="bg-background p-8 hover:bg-card transition-colors duration-300"
              >
                <span className="font-mono text-[0.58rem] tracking-[0.2em] text-primary font-medium">{item.num}</span>
                <h3 className="font-serif text-xl font-bold text-foreground mt-4 mb-3">{item.title}</h3>
                <p className="font-sans text-sm text-muted-foreground leading-[1.75]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <PlatformCapabilities />
    </Layout>
  );
};

export default Index;
