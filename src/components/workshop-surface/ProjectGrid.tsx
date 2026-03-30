/**
 * ProjectGrid.tsx
 * Live dossier grid for Nexus Cria / Workshop.
 *
 * Uses canonical project dataset + pulse activity to render status and progress.
 * Routes directly to /project/:id dossiers.
 * Canon: V7-SURFACES-001 · K-04+K-06 · @framer+@cursor
 */

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import projectData from "@/data/projects";
import { useProjectPulse } from "@/hooks/useProjectPulse";

const TEAL = "hsl(172, 55%, 38%)";
const TEAL_MID = "hsla(172, 55%, 38%, 0.55)";
const TEAL_FAINT = "hsla(172, 55%, 38%, 0.12)";
const TEAL_BORDER = "hsla(172, 55%, 38%, 0.2)";
const EASE = [0.22, 1, 0.36, 1] as const;

type Category = "Design" | "Build" | "Research" | "Launch";

interface Project {
  id: string;
  title: string;
  category: Category;
  progress: number;
  country: string;
  status: string;
  route: string;
}

const CATEGORY_MAP: Record<string, Category> = {
  "deltaspine-nl": "Build",
  "geocore-power": "Build",
  "terra-lenta": "Research",
  "fusion-core": "Launch",
  "chip-fold": "Design",
};

const CATEGORY_COLORS: Record<Category, string> = {
  Design: "hsla(220, 80%, 65%, 0.75)",
  Build: TEAL_MID,
  Research: "hsla(42, 78%, 52%, 0.7)",
  Launch: "hsla(0, 75%, 60%, 0.7)",
};

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.1, duration: 0.5, ease: EASE },
  }),
};

function estimateProgress(status: string, pulseCount: number): number {
  const normalized = status.toLowerCase();
  const base = normalized.includes("active")
    ? 52
    : normalized.includes("progress")
      ? 44
      : normalized.includes("completed")
        ? 100
        : normalized.includes("planning")
          ? 28
          : 36;
  return Math.min(100, Math.max(12, base + Math.min(30, pulseCount * 2)));
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const statusColor =
    project.status.toLowerCase().includes("active")
      ? "hsl(155, 65%, 48%)"
      : project.status.toLowerCase().includes("completed")
        ? "hsl(42, 78%, 52%)"
        : "hsl(210, 14%, 65%)";
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{
        borderColor: TEAL_MID,
        backgroundColor: "hsl(var(--muted) / 0.35)",
        transition: { duration: 0.2 },
      }}
      style={{
        background: "hsl(var(--muted) / 0.04)",
        border: `1px solid ${TEAL_BORDER}`,
        borderRadius: "12px",
        padding: "22px 22px 18px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        cursor: "pointer",
        transition: "border-color 0.2s, background 0.2s",
      }}
    >
      {/* Category tag */}
      <span
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "9px",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: CATEGORY_COLORS[project.category],
          display: "inline-block",
        }}
      >
        {project.category}
      </span>

      {/* Title */}
      <h3
        style={{
          fontFamily: "Syne, system-ui, sans-serif",
          fontSize: "15px",
          fontWeight: 600,
          color: "var(--rx-text-primary)",
          margin: 0,
          letterSpacing: "-0.01em",
          lineHeight: 1.3,
        }}
      >
        {project.title}
      </h3>

      {/* Progress bar */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "6px",
          }}
        >
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "9px",
              letterSpacing: "0.12em",
              color: "var(--rx-text-ghost)",
            }}
          >
            Progress
          </span>
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "9px",
              letterSpacing: "0.08em",
              color: TEAL_MID,
            }}
          >
            {project.progress}%
          </span>
        </div>
        <div
          style={{
            height: "3px",
            background: "hsl(var(--muted) / 0.15)",
            borderRadius: "2px",
            overflow: "hidden",
          }}
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: project.progress / 100 }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.75, ease: EASE }}
            style={{
              height: "100%",
              background: TEAL,
              borderRadius: "2px",
              transformOrigin: "left",
            }}
          />
        </div>
      </div>

      {/* Footer row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "10px",
            letterSpacing: "0.08em",
            color: "var(--rx-text-ghost)",
          }}
        >
          {project.country}
        </span>

        <Link
          to={project.route}
          style={{
            display: "inline-flex",
            alignItems: "center",
            fontFamily: "Syne, system-ui, sans-serif",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: statusColor,
            background: TEAL_FAINT,
            border: `1px solid ${TEAL_BORDER}`,
            borderRadius: "6px",
            padding: "5px 14px",
            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          Open
        </Link>
      </div>
    </motion.div>
  );
}

export default function ProjectGrid() {
  const pulseIds = Object.keys(projectData);
  const { pulses } = useProjectPulse(pulseIds);
  const pulseMap = new Map(pulses.map((p) => [p.projectId, p]));
  const projects: Project[] = Object.entries(projectData).map(([id, data]) => {
    const pulse = pulseMap.get(id);
    const status = data.status ?? "active";
    return {
      id,
      title: data.title,
      category: CATEGORY_MAP[id] ?? "Research",
      progress: estimateProgress(status, pulse?.activityCount ?? 0),
      country: data.country,
      status,
      route: `/project/${id}`,
    };
  });

  return (
    <section aria-label="Projects">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
          gap: "16px",
        }}
      >
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
