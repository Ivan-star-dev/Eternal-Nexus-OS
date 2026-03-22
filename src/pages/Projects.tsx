import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Folder } from "lucide-react";
import Layout from "@/components/Layout";
import PageTransition from "@/components/PageTransition";
import { homeProjects, type HomeProject } from "@/data/homeProjects";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import type { Database } from "@/integrations/supabase/types";

type GlobeProject = Database["public"]["Tables"]["globe_projects"]["Row"];

type StatusFilter = "all" | "active" | "research" | "planning" | "completed" | "upcoming";

const ease = [0.16, 1, 0.3, 1] as const;

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "ALL" },
  { value: "active", label: "ACTIVE" },
  { value: "research", label: "RESEARCH" },
  { value: "planning", label: "PLANNING" },
  { value: "completed", label: "COMPLETED" },
  { value: "upcoming", label: "UPCOMING" },
];

const TAG_OPTIONS = ["All", "Mobilidade", "Energia", "Ambiente", "Geotérmica", "Clima", "Planetary Eng.", "Geopolítica", "Integração", "AI", "Computing", "Deep Tech", "Sustentabilidade"];

const statusColor: Record<string, string> = {
  ACTIVE: "text-teal-light border-teal-light/30 bg-teal-light/10",
  RESEARCH: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
  PLANNING: "text-blue-400 border-blue-400/30 bg-blue-400/10",
  COMPLETED: "text-primary border-primary/30 bg-primary/10",
  UPCOMING: "text-purple-400 border-purple-400/30 bg-purple-400/10",
};

const statusDot: Record<string, string> = {
  ACTIVE: "bg-teal-light",
  RESEARCH: "bg-yellow-400",
  PLANNING: "bg-blue-400",
  COMPLETED: "bg-primary",
  UPCOMING: "bg-purple-400",
};

// Skeleton card for loading state
const SkeletonCard = ({ index }: { index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08, duration: 0.5, ease }}
    className="border border-border bg-card overflow-hidden"
  >
    <div className="h-44 bg-secondary/40 animate-pulse" />
    <div className="p-6 space-y-3">
      <div className="h-3 bg-secondary/60 animate-pulse w-1/3 rounded-sm" />
      <div className="h-5 bg-secondary/60 animate-pulse w-3/4 rounded-sm" />
      <div className="h-3 bg-secondary/40 animate-pulse w-full rounded-sm" />
      <div className="h-3 bg-secondary/40 animate-pulse w-5/6 rounded-sm" />
      <div className="flex gap-2 mt-4">
        <div className="h-4 w-16 bg-secondary/50 animate-pulse rounded-sm" />
        <div className="h-4 w-12 bg-secondary/50 animate-pulse rounded-sm" />
      </div>
    </div>
  </motion.div>
);

// Globe project card (from Supabase)
const GlobeProjectCard = ({ project, index }: { project: GlobeProject; index: number }) => {
  const normalizedStatus = project.status.toUpperCase();
  const colorClass = statusColor[normalizedStatus] ?? "text-muted-foreground border-border bg-secondary/20";
  const dotClass = statusDot[normalizedStatus] ?? "bg-muted-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.7, ease }}
      className="border border-border bg-card hover:border-primary/60 transition-all duration-300 group relative overflow-hidden"
    >
      {/* Color accent stripe */}
      <div className="h-1 w-full" style={{ backgroundColor: project.color }} />

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className="font-mono text-[0.55rem] tracking-[0.15em] text-muted-foreground uppercase">
            GLOBE PROJECT
          </span>
          <span className={`flex items-center gap-1.5 font-mono text-[0.55rem] tracking-[0.12em] border px-2 py-0.5 ${colorClass}`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse-dot ${dotClass}`} />
            {normalizedStatus}
          </span>
        </div>

        <h3 className="font-serif text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
          {project.name}
        </h3>

        {project.description && (
          <p className="font-sans text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-3">
            {project.description}
          </p>
        )}

        <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-3">
          <div>
            <div className="font-mono text-[0.5rem] tracking-[0.12em] text-muted-foreground/60 mb-0.5">LAT</div>
            <div className="font-mono text-[0.65rem] text-foreground">{project.lat.toFixed(3)}°</div>
          </div>
          <div>
            <div className="font-mono text-[0.5rem] tracking-[0.12em] text-muted-foreground/60 mb-0.5">LON</div>
            <div className="font-mono text-[0.65rem] text-foreground">{project.lon.toFixed(3)}°</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Main portfolio card (from homeProjects data)
const PortfolioCard = ({ project, index }: { project: HomeProject; index: number }) => {
  const normalizedStatus = project.status.toUpperCase();
  const colorClass = statusColor[normalizedStatus] ?? "text-muted-foreground border-border bg-secondary/20";
  const dotClass = statusDot[normalizedStatus] ?? "bg-muted-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.7, ease }}
      className="border border-border bg-card hover:border-primary/60 transition-all duration-300 group relative overflow-hidden"
    >
      <Link to={`/project/${project.id}`} className="block">
        {/* Image */}
        <div className="relative h-44 overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
          <div className="absolute top-3 right-3">
            <span className={`flex items-center gap-1.5 font-mono text-[0.55rem] tracking-[0.12em] border px-2 py-0.5 backdrop-blur-sm ${colorClass}`}>
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse-dot ${dotClass}`} />
              {normalizedStatus}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <span className="font-mono text-[0.55rem] tracking-[0.15em] text-primary/60 uppercase">
            NPI REGISTRY · DOSSIER
          </span>
          <h3 className="font-serif text-xl font-bold text-foreground mt-2 group-hover:text-primary transition-colors leading-snug">
            {project.title}
          </h3>
          <p className="font-sans text-sm text-muted-foreground/80 mt-1 italic font-light">
            {project.subtitle}
          </p>
          <p className="font-sans text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-3">
            {project.summary}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-4">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[0.55rem] tracking-[0.1em] text-muted-foreground bg-secondary/40 border border-border/60 px-2 py-0.5 uppercase"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const Projects = () => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [tagFilter, setTagFilter] = useState<string>("All");
  const [search, setSearch] = useState("");

  // Fetch globe_projects from Supabase
  const { data: globeProjects = [], isLoading: globeLoading } = useQuery({
    queryKey: ["globe_projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("globe_projects")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as GlobeProject[];
    },
  });

  // Filter portfolio (static) projects
  const filteredPortfolio = useMemo(() => {
    return homeProjects.filter((p) => {
      const matchStatus =
        statusFilter === "all" ||
        p.status.toLowerCase() === statusFilter;
      const matchTag =
        tagFilter === "All" || p.tags.includes(tagFilter);
      const matchSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.subtitle.toLowerCase().includes(search.toLowerCase()) ||
        p.summary.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchTag && matchSearch;
    });
  }, [statusFilter, tagFilter, search]);

  // Filter globe projects
  const filteredGlobe = useMemo(() => {
    return globeProjects.filter((p) => {
      const matchStatus =
        statusFilter === "all" ||
        p.status.toLowerCase() === statusFilter;
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.description ?? "").toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [globeProjects, statusFilter, search]);

  const totalCount = filteredPortfolio.length + filteredGlobe.length;
  const isEmpty = !globeLoading && totalCount === 0;

  return (
    <Layout>
      <PageTransition>
        {/* ═══ HEADER ═══ */}
        <section className="relative pt-28 pb-16 px-4 sm:px-6 md:px-16 lg:px-20 border-b border-border bg-card/30">
          <div className="absolute inset-0 engineering-grid pointer-events-none opacity-20" />
          <div className="relative max-w-[1200px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease }}
            >
              <span className="font-mono text-[0.6rem] tracking-[0.3em] text-primary/60 uppercase">
                Next Path Infra · NPI Registry
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.9, ease }}
              className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold text-foreground leading-[0.9] mt-4"
            >
              Projects<span className="text-primary">.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease }}
              className="font-serif text-lg text-muted-foreground italic font-light mt-4 max-w-xl leading-relaxed"
            >
              Portfolio of mega-projects and field operations — built by humans + AI, validated by real data.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="gold-rule mt-8"
            />
          </div>
        </section>

        {/* ═══ FILTER BAR ═══ */}
        <section className="sticky top-14 z-40 bg-background/95 backdrop-blur-xl border-b border-border">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-16 lg:px-20 py-3 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            {/* Status filter pills */}
            <div className="flex flex-wrap gap-1.5">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setStatusFilter(opt.value)}
                  className={`font-mono text-[0.55rem] tracking-[0.12em] px-3 py-1.5 border transition-all duration-200 ${
                    statusFilter === opt.value
                      ? "border-primary text-primary bg-primary/10"
                      : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary/70"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Search input */}
            <div className="relative flex-shrink-0 w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search projects…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-4 py-1.5 bg-secondary/30 border border-border text-foreground placeholder:text-muted-foreground/50 font-mono text-[0.62rem] tracking-[0.06em] focus:outline-none focus:border-primary/60 transition-colors w-full sm:w-52"
              />
            </div>
          </div>

          {/* Tag filter */}
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-16 lg:px-20 pb-3 flex gap-1.5 flex-wrap">
            {TAG_OPTIONS.map((tag) => (
              <button
                key={tag}
                onClick={() => setTagFilter(tag)}
                className={`font-mono text-[0.5rem] tracking-[0.1em] px-2 py-1 border transition-all duration-200 uppercase ${
                  tagFilter === tag
                    ? "border-primary/60 text-primary bg-primary/5"
                    : "border-border/50 text-muted-foreground/60 hover:border-border hover:text-muted-foreground"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </section>

        {/* ═══ PORTFOLIO GRID ═══ */}
        <section className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-16 lg:px-20 py-12">

          {/* NPI Dossiers */}
          <AnimatePresence mode="wait">
            {filteredPortfolio.length > 0 && (
              <motion.div
                key="portfolio-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <span className="section-label">NPI DOSSIERS · {filteredPortfolio.length} ENTRIES</span>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border mb-16">
                  {filteredPortfolio.map((project, i) => (
                    <PortfolioCard key={project.id} project={project} index={i} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Globe Projects (Supabase) */}
          <AnimatePresence mode="wait">
            {(globeLoading || filteredGlobe.length > 0) && (
              <motion.div
                key="globe-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <span className="section-label">
                    GLOBE OPERATIONS · {globeLoading ? "…" : `${filteredGlobe.length} ENTRIES`}
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {globeLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <SkeletonCard key={i} index={i} />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
                    {filteredGlobe.map((project, i) => (
                      <GlobeProjectCard key={project.id} project={project} index={i} />
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty state */}
          <AnimatePresence>
            {isEmpty && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease }}
                className="flex flex-col items-center justify-center py-32 text-center"
              >
                <Folder className="w-10 h-10 text-muted-foreground/30 mb-4" />
                <span className="font-mono text-[0.6rem] tracking-[0.2em] text-muted-foreground/50 uppercase block mb-2">
                  NO PROJECTS FOUND
                </span>
                <p className="font-sans text-sm text-muted-foreground/40 max-w-xs leading-relaxed">
                  No projects match your current filters. Try adjusting the status or search query.
                </p>
                <button
                  onClick={() => { setStatusFilter("all"); setTagFilter("All"); setSearch(""); }}
                  className="mt-6 font-mono text-[0.6rem] tracking-[0.1em] text-primary border border-primary/50 px-4 py-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  CLEAR FILTERS
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ═══ FOOTER ═══ */}
        <section className="border-t border-border py-10 px-4 sm:px-6 md:px-16 lg:px-20 bg-card/30">
          <div className="max-w-[800px] mx-auto text-center">
            <div className="gold-rule mx-auto mb-6" />
            <span className="font-mono text-[0.52rem] tracking-[0.2em] text-muted-foreground block mb-1">
              NPI REGISTRY · PROJECT PORTFOLIO · © 2026
            </span>
            <span className="font-mono text-[0.48rem] tracking-[0.12em] text-muted-foreground/50 block">
              IVANILDO MICHEL MONTEIRO FERNANDES · NEXT PATH INFRA
            </span>
            <Link
              to="/"
              className="inline-flex items-center gap-2 mt-8 font-mono text-[0.62rem] tracking-[0.12em] text-primary border border-primary px-5 py-3 hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              ← RETURN TO REGISTRY
            </Link>
          </div>
        </section>
      </PageTransition>
    </Layout>
  );
};

export default Projects;
