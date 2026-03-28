/**
 * ProjectGrid.tsx
 * 2-col project grid (1-col mobile) for Nexus Cria / Workshop.
 *
 * 4 mock projects + New Project button (dashed).
 * Progress bar per project (teal fill).
 * Canon: V7-SURFACES-001 · K-04+K-06 · @framer+@cursor
 */

import { motion } from "framer-motion";

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
  team: number;
}

const PROJECTS: Project[] = [
  { id: "w1", title: "Nexus Interface System", category: "Design", progress: 72, team: 3 },
  { id: "w2", title: "Orbital Data Layer", category: "Build", progress: 48, team: 2 },
  { id: "w3", title: "Ruberra Market Study", category: "Research", progress: 91, team: 4 },
  { id: "w4", title: "Beta Launch Package", category: "Launch", progress: 25, team: 5 },
];

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

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{
        borderColor: TEAL_MID,
        backgroundColor: "rgba(30, 50, 50, 0.35)",
        transition: { duration: 0.2 },
      }}
      style={{
        background: "rgba(255,255,255,0.025)",
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
          color: "rgba(220,232,240,0.9)",
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
              color: "rgba(150,185,185,0.4)",
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
            background: "rgba(255,255,255,0.07)",
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
            color: "rgba(150,185,185,0.35)",
          }}
        >
          {project.team} member{project.team !== 1 ? "s" : ""}
        </span>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          style={{
            fontFamily: "Syne, system-ui, sans-serif",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: TEAL,
            background: TEAL_FAINT,
            border: `1px solid ${TEAL_BORDER}`,
            borderRadius: "6px",
            padding: "5px 14px",
            cursor: "pointer",
          }}
        >
          Open
        </motion.button>
      </div>
    </motion.div>
  );
}

function NewProjectCard() {
  return (
    <motion.button
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5, ease: EASE }}
      whileHover={{
        borderColor: TEAL_MID,
        backgroundColor: TEAL_FAINT,
        transition: { duration: 0.2 },
      }}
      style={{
        background: "transparent",
        border: `1.5px dashed ${TEAL_BORDER}`,
        borderRadius: "12px",
        padding: "22px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        cursor: "pointer",
        minHeight: "140px",
        transition: "border-color 0.2s, background 0.2s",
        width: "100%",
      }}
    >
      <span
        aria-hidden
        style={{
          width: "22px",
          height: "22px",
          borderRadius: "50%",
          border: `1.5px solid ${TEAL_BORDER}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: TEAL_MID,
          fontSize: "16px",
          lineHeight: 1,
          flexShrink: 0,
        }}
      >
        +
      </span>
      <span
        style={{
          fontFamily: "Syne, system-ui, sans-serif",
          fontSize: "13px",
          fontWeight: 600,
          color: "rgba(150,185,185,0.5)",
          letterSpacing: "0.02em",
        }}
      >
        New Project
      </span>
    </motion.button>
  );
}

export default function ProjectGrid() {
  return (
    <section aria-label="Projects">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
          gap: "16px",
        }}
      >
        {PROJECTS.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
        <NewProjectCard />
      </div>
    </section>
  );
}
