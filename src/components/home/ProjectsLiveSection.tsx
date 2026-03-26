/**
 * ProjectsLiveSection — Projects Gallery Layer (PLv6.2-a)
 *
 * Secção compacta na home que torna visível a Layer 2 (Supabase globe_projects).
 * Consume fetchProjectsSummary() — fetcher canónico de PLv6.1.
 * Máx 5 projectos recentes. Link para /atlas onde o portfólio completo vive.
 *
 * Propósito: Layer 2 deixa de ser só infra e passa a ser visível no produto.
 *
 * O que NÃO entra aqui:
 *   - project_metrics / KPIs financeiros
 *   - filtros / auth / user_id
 *   - redesign / dashboard
 *
 * PLv6.2-a | 2026-03-20
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchProjectsSummary, type GlobeProject } from "@/lib/projectsData";
import { EASE_OUT } from "@/lib/motion/config";

const ease = EASE_OUT;

// ── Status badge ─────────────────────────────────────────────────────────────

function statusLabel(raw: string): string {
  if (!raw) return "REGISTERED";
  const u = raw.toUpperCase();
  if (u.includes("ACTIVE") || u.includes("ACTIV") || u.includes("CLEARANCE")) return "ACTIVE";
  if (u.includes("PLAN")) return "PLANNING";
  if (u.includes("ARCH") || u.includes("CLOSE") || u.includes("CANCEL")) return "ARCHIVED";
  return raw.toUpperCase().slice(0, 12);
}

const statusClass: Record<string, string> = {
  ACTIVE: "bg-accent text-accent-foreground",
  PLANNING: "bg-primary/20 text-primary",
  ARCHIVED: "bg-secondary text-secondary-foreground",
};

function badgeClass(s: string): string {
  return statusClass[s] || "bg-secondary text-secondary-foreground";
}

// ── Skeleton card ─────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="border border-border bg-card p-5 animate-pulse">
      <div className="h-3 w-16 bg-muted rounded mb-3" />
      <div className="h-5 w-3/4 bg-muted rounded mb-2" />
      <div className="h-3 w-full bg-muted rounded mb-1" />
      <div className="h-3 w-2/3 bg-muted rounded" />
    </div>
  );
}

// ── Project card ──────────────────────────────────────────────────────────────

function ProjectCard({ project, index }: { project: GlobeProject; index: number }) {
  const label = statusLabel(project.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.08, duration: 0.6, ease }}
    >
      <Link to="/atlas" className="group block h-full">
        <div className="relative border border-border bg-card p-5 h-full transition-all duration-400 hover:border-primary/40 hover:shadow-[0_0_30px_-10px_hsl(var(--primary)/0.2)]">
          {/* Color dot from globe project */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0 mt-[3px]"
                style={{ backgroundColor: project.color || "hsl(var(--primary))" }}
              />
              <span className={`font-mono text-[0.48rem] tracking-[0.15em] px-2 py-0.5 uppercase ${badgeClass(label)}`}>
                {label}
              </span>
            </div>
            <MapPin className="w-3 h-3 text-muted-foreground/40 flex-shrink-0 mt-[2px]" />
          </div>

          <h3 className="font-serif text-base sm:text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
            {project.name}
          </h3>

          {project.description && (
            <p className="font-sans text-xs text-muted-foreground leading-relaxed line-clamp-2">
              {project.description}
            </p>
          )}

          {/* Coordinates */}
          <p className="font-mono text-[0.45rem] tracking-[0.12em] text-muted-foreground/40 mt-3 uppercase">
            {project.lat.toFixed(2)}°N · {project.lon.toFixed(2)}°E
          </p>

          {/* Hover top border */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/50 transition-all duration-500" />
        </div>
      </Link>
    </motion.div>
  );
}

// ── Section principal ─────────────────────────────────────────────────────────

const ProjectsLiveSection = () => {
  const [projects, setProjects] = useState<GlobeProject[]>([]);
  const [total, setTotal] = useState(0);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchProjectsSummary().then((summary) => {
      if (!mounted) return;
      setProjects(summary.recent);
      setTotal(summary.total);
      setIsLive(summary.isLive);
      setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  // Não renderizar se Layer 2 indisponível e não há projectos
  if (!loading && !isLive && projects.length === 0) return null;

  return (
    <section
      className="py-20 sm:py-24 px-4 sm:px-6 md:px-16 lg:px-20 border-t border-border"
      aria-label="Portfólio Atlas — Projectos registados no sistema"
    >
      <div className="max-w-[1200px] mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
        >
          <div>
            <span className="font-mono text-[0.55rem] tracking-[0.25em] text-muted-foreground uppercase block mb-3">
              Portfólio Atlas · Layer 2 — Supabase
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
              Projectos{" "}
              <span className="text-primary italic font-light">Registados</span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Live indicator */}
            {isLive && (
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="font-mono text-[0.5rem] tracking-[0.15em] text-muted-foreground uppercase">
                  {total} registado{total !== 1 ? "s" : ""}
                </span>
              </div>
            )}

            <Link
              to="/atlas"
              className="font-mono text-[0.55rem] tracking-[0.12em] border border-border text-foreground px-4 py-2 hover:bg-card hover:border-primary/30 transition-all duration-200 flex items-center gap-2 uppercase"
            >
              Ver Atlas <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </div>
        ) : (
          /* Empty state — Layer 2 activa mas sem projectos ainda */
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="border border-border bg-card/50 p-10 text-center"
          >
            <MapPin className="w-6 h-6 text-muted-foreground/30 mx-auto mb-3" />
            <p className="font-sans text-sm text-muted-foreground">
              Nenhum projecto registado ainda.
            </p>
            <Link
              to="/atlas"
              className="font-mono text-[0.55rem] tracking-[0.12em] text-primary uppercase mt-4 inline-flex items-center gap-1.5 hover:gap-2.5 transition-all"
            >
              Adicionar no Atlas <ArrowRight className="w-3 h-3" />
            </Link>
          </motion.div>
        )}

        {/* Footer hint — se há mais do que os 5 mostrados */}
        {!loading && total > projects.length && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center mt-8"
          >
            <Link
              to="/atlas"
              className="font-mono text-[0.55rem] tracking-[0.15em] text-muted-foreground uppercase hover:text-primary transition-colors inline-flex items-center gap-1.5"
            >
              + {total - projects.length} mais no Atlas <ArrowRight className="w-3 h-3" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ProjectsLiveSection;
