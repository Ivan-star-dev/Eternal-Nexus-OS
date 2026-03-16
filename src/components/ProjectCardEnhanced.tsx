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
            "group relative overflow-hidden border transition-all duration-500",
            "bg-card",
            isHovered
              ? "border-primary/40 shadow-2xl shadow-primary/5"
              : "border-border"
          )}
        >
          {/* Image / 3D Preview Area */}
          <div className="relative h-52 sm:h-64 md:h-72 overflow-hidden">
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
                      <span className="font-mono text-[0.5rem] tracking-[0.2em] text-muted-foreground animate-pulse uppercase">
                        LOADING 3D…
                      </span>
                    </div>
                  }>
                    <MiniProjectScene projectId={project.id} color={color} />
                  </Suspense>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent z-20 pointer-events-none" />

            {/* Classification badge */}
            <div className="absolute top-3 left-3 z-30">
              <span className="stamp-classified text-[0.48rem] sm:text-[0.52rem] px-2 py-0.5 flex items-center gap-1.5">
                <Shield className="w-2.5 h-2.5" />
                {project.classification}
              </span>
            </div>

            {/* Status indicator */}
            <div className="absolute top-3 right-3 z-30">
              <span className="font-mono text-[0.52rem] sm:text-[0.58rem] tracking-[0.2em] text-teal-light flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-dot" />
                {project.status}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 sm:p-6 md:p-8 relative z-20">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 sm:gap-6">
              <div className="flex-1">
                <span className="section-label">{project.number} · {project.country}</span>
                <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-foreground mt-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed max-w-lg">
                  {project.subtitle}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {project.sectors.map((sector) => (
                    <span
                      key={sector}
                      className="font-mono text-[0.5rem] sm:text-[0.55rem] tracking-[0.1em] text-accent-foreground bg-accent/10 border border-accent/20 px-1.5 py-0.5 uppercase"
                    >
                      {sector}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 text-primary font-mono text-[0.62rem] sm:text-[0.68rem] tracking-[0.15em] uppercase group-hover:gap-3 transition-all">
                VIEW DOSSIER <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Animated Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border mt-5 border border-border">
              {project.metrics.map((m) => (
                <div key={m.label} className="bg-card p-3 sm:p-4">
                  <AnimatedCounter
                    value={m.value}
                    className="font-serif text-base sm:text-lg md:text-xl font-bold text-foreground"
                  />
                  <div className="font-mono text-[0.45rem] sm:text-[0.5rem] tracking-[0.15em] text-muted-foreground uppercase mt-1">
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
                className="absolute bottom-3 right-3 bg-background/95 border border-accent/30 backdrop-blur-sm p-3 max-w-[220px] hidden md:block z-30"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-3 h-3 text-accent-foreground" />
                  <span className="font-mono text-[0.5rem] tracking-[0.18em] text-accent-foreground uppercase">Live Telemetry</span>
                </div>
                <div className="space-y-1">
                  <p className="font-mono text-[0.58rem] text-foreground/80">Status: <span className="text-accent-foreground font-medium">Operational</span></p>
                  <p className="font-mono text-[0.58rem] text-foreground/80">Uptime: <span className="text-accent-foreground font-medium">99.7%</span></p>
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
