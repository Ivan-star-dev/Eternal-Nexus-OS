import { useState, useEffect, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import InvestmentContext from "@/components/briefing/InvestmentContext";
import SystemPillars from "@/components/briefing/SystemPillars";
import FinancialStructure from "@/components/briefing/FinancialStructure";
import RiskAssessment from "@/components/briefing/RiskAssessment";
import { Link } from "react-router-dom";

const CanalSimulation3D = lazy(() => import("@/components/briefing/CanalSimulation3D"));

const InvestorBriefing = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    document.title = "DeltaSpine NL — Investor Briefing · Eternal Nexus";
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Layout>
      {/* Progress Bar */}
      <div className="fixed top-[92px] left-0 right-0 z-[998] h-[2px] bg-border">
        <div
          className="h-full transition-[width] duration-300"
          style={{
            width: `${scrollProgress}%`,
            background: "linear-gradient(90deg, hsl(var(--accent)), hsl(var(--primary)))",
          }}
        />
      </div>

      {/* S0: HERO */}
      <section className="relative min-h-[calc(100vh-94px)] flex flex-col justify-center bg-background overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-[42%] bg-card border-l border-border hidden lg:block" />

        <div className="relative z-10 px-8 md:px-20 py-20 max-w-[1200px]">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <span className="stamp-classified">RESTRICTED — INVESTOR DISTRIBUTION ONLY</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="font-mono text-[0.48rem] tracking-[0.28em] text-gold/60 uppercase mt-10 mb-5"
          >
            Infrastructure Investment Opportunity · Netherlands · 2026
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="font-serif text-5xl md:text-7xl lg:text-[5.5rem] font-light leading-[0.95] text-paper"
          >
            DeltaSpine<br />
            <span className="text-gold">NL</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
            className="text-sm text-paper-dim/70 font-light leading-relaxed mt-7 max-w-[620px]"
          >
            A modular, reversible subsurface framework installed along the Netherlands' 6,500 km canal
            network — simultaneously addressing the country's most critical legal, environmental and
            logistical obligations of 2026.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border border border-border mt-14 max-w-[860px]"
          >
            {[
              { val: "€200M", unit: "", label: "PILOT INVESTMENT (4 KM)", delta: "↑ 8–12 yr payback" },
              { val: "€600M", unit: "", label: "ANNUAL SAVINGS POTENTIAL", delta: "↑ Water + logistics + fines" },
              { val: "15–25%", unit: "", label: "N REDUCTION IN CANALS", delta: "↑ Deltares 2026 projection" },
              { val: "140", unit: "km/h", label: "CAPSULE CRUISE SPEED", delta: "↑ Phase 2, 2029+" },
            ].map((m) => (
              <div key={m.label} className="bg-ink-medium/60 border border-white/[0.05] rounded-sm p-6 md:p-7 hover:border-white/[0.12] transition-colors">
                <div className="font-mono text-3xl font-light text-gold">
                  {m.val}{m.unit && <span className="font-mono text-base ml-0.5">{m.unit}</span>}
                </div>
                <div className="font-mono text-[0.45rem] tracking-[0.25em] uppercase text-paper-dim/40 mt-1">{m.label}</div>
                <div className="font-mono text-[0.65rem] text-teal mt-1.5">{m.delta}</div>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="gold-rule mt-12" style={{ width: 60 }} />
        </div>
      </section>

      {/* Sections */}
      <InvestmentContext />
      <SystemPillars />
      <FinancialStructure />
      
      {/* 3D Simulation */}
      <Suspense fallback={
        <section className="border-b border-border bg-background min-h-screen flex items-center justify-center">
          <span className="font-mono text-sm text-muted-foreground animate-pulse">LOADING 3D SIMULATION...</span>
        </section>
      }>
        <CanalSimulation3D />
      </Suspense>
      
      <RiskAssessment />

      {/* ═══ OTHER PROJECTS — Live Portfolio ═══ */}
      <section className="border-t border-white/[0.04] bg-background py-16 px-8 md:px-20">
        <div className="max-w-[1200px] mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <span className="font-mono text-[0.48rem] tracking-[0.28em] text-gold/60 uppercase">
              ETERNAL NEXUS PORTFOLIO
            </span>
            <h3 className="font-serif text-3xl md:text-4xl font-light text-paper mt-2 mb-8">
              Live <span className="text-gold italic">Infrastructure</span> Pipeline
            </h3>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "GeoCore Power", loc: "Pico do Fogo, CV", val: "€1.2B", status: "α", color: "#d4a017", path: "/project/geocore-power" },
              { name: "Terra Lenta", loc: "Lisboa, PT", val: "€800M", status: "δ", color: "#8b6f47", path: "/project/terra-lenta" },
              { name: "Fusion Core", loc: "Paris, FR", val: "€3.5B", status: "ε", color: "#4a90e2", path: "/project/fusion-core" },
              { name: "Chip Fold", loc: "Tokyo, JP", val: "€2.1B", status: "ζ", color: "#c026d3", path: "/project/chip-fold" },
            ].map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={p.path} className="block group">
                  <div className="bg-ink-medium/60 border border-white/[0.05] rounded-sm p-5 transition-all duration-300 hover:border-white/[0.12]">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                      <span className="font-mono text-[0.45rem] tracking-[0.25em] uppercase text-paper-dim/40">{p.status} CLEARANCE</span>
                    </div>
                    <h4 className="font-mono text-sm font-light text-paper mb-1">{p.name}</h4>
                    <p className="font-mono text-[0.45rem] tracking-[0.25em] uppercase text-paper-dim/40 mb-3">{p.loc}</p>
                    <span className="font-mono text-3xl font-light text-gold">{p.val}</span>
                    <span className="font-mono text-[0.45rem] tracking-[0.25em] uppercase text-paper-dim/40 block mt-1">estimated pipeline</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Briefing Footer */}
      <footer className="border-t border-border bg-background py-10 px-8 md:px-20">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <h4 className="section-label mb-4">DeltaSpine NL</h4>
            <p className="font-sans text-sm font-light text-muted-foreground leading-[1.7]">
              Modular subsurface infrastructure for the Netherlands canal network. Designed for Rijkswaterstaat, Ministry of Infrastructure and Water, and National Growth Fund presentation.
            </p>
            <p className="font-mono text-[0.6rem] text-muted-foreground mt-3">REF: DSN-2026-INV-001 · March 2026</p>
          </div>
          <div>
            <h4 className="section-label mb-4">Technology Partners</h4>
            <p className="font-sans text-sm font-light text-muted-foreground leading-[1.7]">
              TU Delft · Green Basilisk · Reefy · Coastruction · ECOncrete · Boskalis · Van Oord · Gasunie
            </p>
          </div>
          <div>
            <h4 className="section-label mb-4">Regulatory Framework</h4>
            <p className="font-sans text-sm font-light text-muted-foreground leading-[1.7]">
              Wet waterbeheer · Waterwet · WFD · NAPSEA · Delta Programme · EU Nature-Based Solutions
            </p>
          </div>
          <div>
            <h4 className="section-label mb-4">Funding Available</h4>
            <p className="font-sans text-sm font-light text-muted-foreground leading-[1.7]">
              National Growth Fund · EU Innovation Fund · CEF Transport · Stikstof Funds ~€25B · PPP
            </p>
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto mt-10 pt-6 border-t border-border flex items-center justify-center gap-6">
          <Link to="/project/deltaspine-nl" className="font-mono text-[0.68rem] tracking-[0.12em] text-primary hover:underline">
            ← PROJECT DOSSIER
          </Link>
          <Link to="/nexus" className="font-mono text-[0.68rem] tracking-[0.12em] text-muted-foreground hover:text-primary hover:underline">
            NEXUS WAR ROOM →
          </Link>
          <Link to="/atlas" className="font-mono text-[0.68rem] tracking-[0.12em] text-muted-foreground hover:text-primary hover:underline">
            ATLAS GLOBAL →
          </Link>
        </div>
      </footer>
    </Layout>
  );
};

export default InvestorBriefing;
