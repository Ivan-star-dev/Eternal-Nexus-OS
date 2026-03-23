import { useState, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Shield, Activity } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";
import { cn } from "@/lib/utils";

const MiniProjectScene = lazy(() =>
  import("./MiniProjectScene").catch(() => {
    // Stale chunk retry — force reload on cache miss
    return import("./MiniProjectScene");
  })
);

export interface ProjectCardProject {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  country: string;
  status: string;
  classification: string;
  sectors: string[];
  image: string;
  metrics: { value: string; label: string }[];
  color?: string;
}

const PROJECT_COLORS: Record<string, string> = {
  "deltaspine-nl": "#D4AF37",
  "geocore-power": "#0A9396",
  "terra-lenta": "#8D6E63",
  "fusion-core": "#5C6BC0",
  "chip-fold": "#26A69A",
};

const ease = [0.16, 1, 0.3, 1] as const;

const statusStyles: Record<string, string> = {
  "Active":      "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  "In Progress": "bg-gold/10 text-gold border border-gold/30",
  "Completed":   "bg-blue-500/20 text-blue-400 border border-blue-500/30",
};

const getStatusStyle = (status: string) =>
  statusStyles[status] ??
  "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";

interface ProjectCardEnhancedProps {
  project: ProjectCardProject;
  index: number;
}

const ProjectCardEnhanced = ({ project, index }: ProjectCardEnhancedProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const color = project.color || PROJECT_COLORS[project.id] || "#D4AF37";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.08, ease }}
    >
      <Link to={`/project/${project.id}`} className="block">
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={cn(
            "group relative overflow-hidden rounded-sm transition-all duration-300",
            "bg-ink-medium/40 border border-white/[0.05]",
            isHovered
              ? "border-white/[0.12] bg-ink-medium/60"
              : ""
          )}
        >
          {/* Image / 3D Preview Area */}
          <div className="aspect-video bg-ink-medium/60 border-b border-white/[0.05] overflow-hidden relative">
            {/* Background image — always present */}
            <motion.img
              src={project.image}
              alt={project.title}
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
                isHovered ? "opacity-30" : "opacity-100"
              )}
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.7, ease }}
              loading="lazy"
            />

            {/* 3D Preview on hover */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 z-10 hidden md:block"
                >
                  <Suspense fallback={
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-mono text-[0.42rem] tracking-[0.15em] text-paper-dim/40 animate-pulse uppercase">
                        Loading 3D…
                      </span>
                    </div>
                  }>
                    <MiniProjectScene projectId={project.id} color={color} />
                  </Suspense>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink-deep via-ink-deep/50 to-transparent z-20 pointer-events-none" />

            {/* Classification badge */}
            <div className="absolute top-3 left-3 z-30">
              <span className="stamp-classified text-[0.48rem] sm:text-[0.52rem] px-2 py-0.5 flex items-center gap-1.5">
                <Shield className="w-2.5 h-2.5" />
                {project.classification}
              </span>
            </div>

            {/* Status badge */}
            <div className="absolute top-3 right-3 z-30">
              <span
                className={`font-mono text-[0.42rem] tracking-[0.12em] uppercase px-2 py-0.5 rounded-sm ${getStatusStyle(project.status)}`}
              >
                {project.status}
              </span>
            </div>
          </div>

          {/* Card body */}
          <div className="p-5 relative z-20">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                {/* Meta row */}
                <div className="font-mono text-[0.45rem] tracking-[0.15em] uppercase text-paper-dim/40 flex gap-3 mt-1">
                  <span>{project.number}</span>
                  <span>·</span>
                  <span>{project.country}</span>
                </div>

                <h3 className="font-serif text-base font-light text-paper mt-1">
                  {project.title}
                </h3>

                <p className="text-xs text-paper-dim/60 font-light leading-relaxed mt-2 max-w-lg">
                  {project.subtitle}
                </p>

                {/* Tech tags / sectors */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {project.sectors.map((sector) => (
                    <span
                      key={sector}
                      className="font-mono text-[0.42rem] tracking-[0.1em] uppercase border border-white/[0.06] px-2 py-0.5 text-paper-dim/40"
                    >
                      {sector}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA link */}
              <div className="flex items-center gap-2 font-mono text-[0.48rem] tracking-[0.15em] uppercase text-gold/70 hover:text-gold transition-colors duration-200 group-hover:gap-3">
                View Dossier <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* Animated Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.04] mt-4 border border-white/[0.05]">
              {project.metrics.map((m) => (
                <div key={m.label} className="bg-ink-medium/40 p-3">
                  <AnimatedCounter
                    value={Number(m.value)}
                    className="font-serif text-base font-light text-paper"
                  />
                  <div className="font-mono text-[0.42rem] tracking-[0.15em] text-paper-dim/40 uppercase mt-1">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hover telemetry overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-3 right-3 bg-ink-deep/95 border border-white/[0.06] backdrop-blur-sm p-3 max-w-[220px] hidden md:block z-30 rounded-sm"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-3 h-3 text-paper-dim/40" />
                  <span className="font-mono text-[0.42rem] tracking-[0.15em] uppercase text-paper-dim/40">
                    Live Telemetry
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="font-mono text-[0.48rem] text-paper-dim/60">
                    Status: <span className="text-emerald-400 font-medium">Operational</span>
                  </p>
                  <p className="font-mono text-[0.48rem] text-paper-dim/60">
                    Uptime: <span className="text-emerald-400 font-medium">99.7%</span>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom accent bar */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[2px]"
            style={{ background: color }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </Link>
    </motion.div>
  );
};

export default ProjectCardEnhanced;
