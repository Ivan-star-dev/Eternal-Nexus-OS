import { useState, lazy, Suspense, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronRight } from "lucide-react";
import Layout from "@/components/Layout";
import PageTransition from "@/components/PageTransition";
import ProjectNotes from "@/components/ProjectNotes";
import GovernmentBids from "@/components/GovernmentBids";
import WhitepaperViewer from "@/components/WhitepaperViewer";
import ProjectChat from "@/components/ProjectChat";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AnimatedCounter from "@/components/AnimatedCounter";
import OverviewTab from "@/components/project/OverviewTab";
import TechnicalTab from "@/components/project/TechnicalTab";
import RiskTab from "@/components/project/RiskTab";
import TimelineTab from "@/components/project/TimelineTab";
import FinancialTab from "@/components/project/FinancialTab";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSession } from "@/contexts/SessionContext";
import projectData from "@/data/projects";

const AdvancedProjectInterface = lazy(() => import("@/components/AdvancedProjectInterface"));

// V3: status badge colour map
const statusBadgeClass: Record<string, string> = {
  active: "text-yellow-400 border-yellow-400/40 bg-yellow-400/10",
  completed: "text-emerald-400 border-emerald-400/40 bg-emerald-400/10",
  "in-progress": "text-blue-400 border-blue-400/40 bg-blue-400/10",
};

const ease = [0.16, 1, 0.3, 1] as const;

const ProjectPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { session, startSession, updateReEntry, updateFruit } = useSession();
  const project = id ? projectData[id] : null;

  // Restore last tab from session if the session subject matches this project.
  // Valid tabs: overview, simulation, technical, financial, risk, timeline, documents.
  const VALID_TABS = new Set(["overview", "simulation", "technical", "financial", "risk", "timeline", "documents"]);
  const restoredTab = (
    session?.subject?.toLowerCase() === project?.title?.toLowerCase() &&
    session?.re_entry_point &&
    VALID_TABS.has(session.re_entry_point)
  ) ? session.re_entry_point : "overview";

  const [activeTab, setActiveTab] = useState(restoredTab);
  // Track whether the user has actively navigated (vs. mount default)
  const [tabUserChanged, setTabUserChanged] = useState(false);

  // V3: dynamic document title
  useEffect(() => {
    document.title = project ? `${project.title} — Eternal Nexus OS` : "Project — Eternal Nexus OS";
    return () => { document.title = "Eternal Nexus OS"; };
  }, [project]);

  // Session hookup: start session with real project context on mount
  useEffect(() => {
    if (project) startSession(project.title, "project-review");
  }, [project]); // eslint-disable-line react-hooks/exhaustive-deps

  // Track tab navigation: re_entry_point + fruit (what the user last read).
  // Guard: only update re_entry_point when the user actively changed the tab.
  // On initial mount, a Nexus session's re_entry_point (resume-swarm:...) must
  // not be overwritten by the default "overview" tab value.
  useEffect(() => {
    if (!tabUserChanged) return;
    updateReEntry(activeTab);
    if (project) updateFruit(`${project.title} · ${activeTab}`);
  }, [activeTab, tabUserChanged]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!project) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-3xl font-bold text-foreground mb-4">Dossier Not Found</h1>
            <Link to="/" className="font-mono text-sm text-primary hover:underline">{t("return_portfolio")}</Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageTransition>
      {/* ═══ BREADCRUMB BAR ═══ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="border-b border-border bg-secondary/50 backdrop-blur-sm px-4 sm:px-6 md:px-12 py-3 flex items-center justify-between"
      >
        {/* V3: breadcrumb meta — font-mono text-[0.48rem] tracking-[0.15em] uppercase text-paper-dim/40 */}
        <div className="flex items-center gap-2 font-mono text-[0.48rem] tracking-[0.15em] uppercase text-paper-dim/40">
          <Link to="/" className="hover:text-primary transition-colors hidden sm:inline">NPI REGISTRY</Link>
          <ChevronRight className="w-3 h-3 opacity-40 hidden sm:inline" />
          <span className="text-primary">{project.number}</span>
          <ChevronRight className="w-3 h-3 opacity-40" />
          <span className="text-paper">{project.title}</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {/* V3: status badge — active=gold, completed=emerald, in-progress=blue */}
          <span className={`flex items-center font-mono text-[0.48rem] tracking-[0.15em] uppercase border px-2 py-0.5 ${statusBadgeClass[(project.status ?? "active").toLowerCase()] ?? statusBadgeClass["active"]}`}>
            {project.status ?? "ACTIVE"}
          </span>
          <span className="stamp-classified text-[0.45rem] sm:text-[0.5rem]">{project.classification}</span>
        </div>
      </motion.div>

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[75vh] sm:min-h-[85vh] flex flex-col justify-end overflow-hidden">
        <motion.img
          src={project.heroImage}
          alt={`${project.title} — ${project.subtitle}`}
          className="absolute inset-0 w-full h-full object-cover will-change-transform"
          loading="eager"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 14, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-background/55" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 35%, transparent 0%, hsl(var(--background)) 80%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, hsl(var(--background) / 0.3) 0%, transparent 25%, transparent 55%, hsl(var(--background)) 100%)" }} />
        <div className="absolute inset-0 scanlines pointer-events-none opacity-30" />
        <div className="absolute inset-0 engineering-grid pointer-events-none" />

        <div className="relative z-10 px-4 sm:px-6 md:px-16 lg:px-20 pb-10 sm:pb-16 max-w-[1300px]">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8, ease }} className="flex items-center gap-3 mb-4 sm:mb-6">
            <Link to="/" className="flex items-center gap-2 font-mono text-[0.6rem] sm:text-[0.65rem] tracking-[0.12em] text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> RETURN TO REGISTRY
            </Link>
          </motion.div>

          {/* V3: meta row — font-mono text-[0.48rem] tracking-[0.15em] uppercase text-paper-dim/40 */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.8, ease }} className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4">
            <span className="font-mono text-[0.48rem] tracking-[0.15em] uppercase text-paper-dim/40">{project.number} · {project.version}</span>
            <span className="font-mono text-[0.48rem] tracking-[0.15em] uppercase text-paper-dim/40">© 2026 Ivanildo Michel Monteiro Fernandes</span>
          </motion.div>

          {/* V3: hero title — font-serif font-light text-paper */}
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 1, ease }} className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-paper leading-[0.92] mb-3">
            {project.title.split(" ").slice(0, -1).join(" ")}<span className="text-primary">{project.title.split(" ").slice(-1)}</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.8, ease }} className="font-serif text-base sm:text-lg md:text-xl font-light italic text-muted-foreground max-w-2xl leading-relaxed mb-3">
            {project.subtitle}
          </motion.p>

          {/* V3: body — font-serif text-sm text-paper-dim/80 leading-relaxed */}
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.8 }} className="font-serif text-sm text-paper-dim/80 leading-relaxed max-w-xl mb-8 sm:mb-10">
            {project.summary.slice(0, 200)}…
          </motion.p>

          {/* KPI Row with Animated Counters */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 0.8, ease }} className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border border border-border max-w-4xl">
            {project.metrics.map((m, i) => (
              <motion.div key={m.label} className="bg-card/90 backdrop-blur-sm p-4 sm:p-5 md:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 + i * 0.1 }}>
                <div className="metric-value text-xl sm:text-2xl md:text-3xl">
                  <AnimatedCounter value={m.value} />
                  {m.unit && <span className="metric-unit">{m.unit}</span>}
                </div>
                <div className="metric-label text-[0.48rem] sm:text-[0.56rem]">{m.label}</div>
                {m.delta && <div className="font-mono text-[0.5rem] sm:text-[0.58rem] text-teal-light mt-1.5">{m.delta}</div>}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ TABBED NAVIGATION ═══ */}
      <div className="border-t border-border sticky top-14 z-40 bg-background/95 backdrop-blur-xl">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-16 lg:px-20">
          <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setTabUserChanged(true); }}>
            <TabsList className="bg-transparent h-auto p-0 gap-0 w-full justify-start border-b border-border rounded-none overflow-x-auto">
              {[
                { value: "overview", label: "OVERVIEW" },
                { value: "simulation", label: "SIMULATION" },
                { value: "technical", label: "TECHNICAL" },
                { value: "financial", label: "FINANCIAL" },
                { value: "risk", label: "RISK" },
                { value: "timeline", label: "TIMELINE" },
                { value: "documents", label: "DOCUMENTS" },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="font-mono text-[0.58rem] sm:text-[0.65rem] tracking-[0.15em] uppercase rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground hover:text-foreground px-4 py-3 transition-colors"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="overview" className="mt-0 animate-fade-in">
              <OverviewTab project={project} projectId={id!} />
            </TabsContent>

            <TabsContent value="simulation" className="mt-0 animate-fade-in">
              <section className="py-8 sm:py-12 px-4 sm:px-6 md:px-16 lg:px-20">
                <div className="max-w-[1200px] mx-auto">
                  <span className="section-label">CLOUD SIMULATION · NEURAL NETWORK</span>
                  <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-foreground mt-3 mb-2">
                    Advanced <span className="text-muted-foreground font-light italic">Interface</span>
                  </h2>
                  <div className="gold-rule mb-6 sm:mb-8" />
                  <Suspense fallback={<div className="h-[60vh] flex items-center justify-center"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
                    <AdvancedProjectInterface project={{ id: id!, title: project.title, subtitle: project.subtitle }} />
                  </Suspense>
                </div>
              </section>
            </TabsContent>

            <TabsContent value="technical" className="mt-0 animate-fade-in">
              <TechnicalTab project={project} projectId={id!} />
            </TabsContent>

            <TabsContent value="financial" className="mt-0 animate-fade-in">
              <FinancialTab project={project} />
            </TabsContent>

            <TabsContent value="risk" className="mt-0 animate-fade-in">
              <RiskTab project={project} />
            </TabsContent>

            <TabsContent value="timeline" className="mt-0 animate-fade-in">
              <TimelineTab project={project} />
            </TabsContent>

            <TabsContent value="documents" className="mt-0 animate-fade-in">
              <WhitepaperViewer projectId={id!} documentName={project.whitepaperName} />
              <GovernmentBids projectId={id!} />

              <section className="border-t border-border py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-16 lg:px-20">
                <div className="max-w-[1200px] mx-auto">
                  <span className="section-label">REAL-TIME COMMUNICATION</span>
                  <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-foreground mt-3 mb-2">
                    Project <span className="text-muted-foreground font-light italic">Chat</span>
                  </h2>
                  <div className="gold-rule mb-6 sm:mb-8" />
                  <ProjectChat projectId={id!} />
                </div>
              </section>

              <ProjectNotes projectId={id!} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* ═══ DOCUMENT FOOTER ═══ */}
      <section className="border-t border-border py-12 sm:py-16 px-4 sm:px-6 md:px-16 lg:px-20 bg-card">
        <div className="max-w-[800px] mx-auto text-center">
          <div className="gold-rule mx-auto mb-6 sm:mb-8" />
          <span className="font-mono text-[0.52rem] sm:text-[0.58rem] tracking-[0.2em] text-muted-foreground block mb-2">
            END OF DOSSIER · {project.number} · {project.version}
          </span>
          <span className="font-mono text-[0.48rem] sm:text-[0.52rem] tracking-[0.15em] text-destructive block mb-1">
            {project.classification} · ALL RIGHTS RESERVED · © 2026
          </span>
          <span className="font-mono text-[0.44rem] sm:text-[0.48rem] tracking-[0.1em] text-muted-foreground/50 block">
            IVANILDO MICHEL MONTEIRO FERNANDES · NEXT PATH INFRA
          </span>
          <Link
            to="/"
            className="inline-flex items-center gap-2 mt-8 sm:mt-10 font-mono text-[0.62rem] sm:text-[0.68rem] tracking-[0.12em] text-primary border border-primary px-5 sm:px-6 py-3 hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> RETURN TO REGISTRY
          </Link>
        </div>
      </section>


      </PageTransition>
    </Layout>
  );
};

export default ProjectPage;
