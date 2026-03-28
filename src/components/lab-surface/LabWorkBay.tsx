/**
 * LabWorkBay.tsx
 * Central work area for Creation Lab.
 * Shows 3 mock project cards with stagger entrance.
 *
 * Canon: V7-SURFACES-001 · K-04+K-06 · @framer+@cursor
 */

import { motion } from "framer-motion";

interface Project {
  id: string;
  title: string;
  lastEdited: string;
  status: "active" | "paused" | "draft";
}

const PROJECTS: Project[] = [
  { id: "p1", title: "Nexus Identity System", lastEdited: "2h ago", status: "active" },
  { id: "p2", title: "Orbital Interface Spec", lastEdited: "Yesterday", status: "active" },
  { id: "p3", title: "Memory Architecture v2", lastEdited: "3 days ago", status: "draft" },
];

const STATUS_LABELS: Record<Project["status"], string> = {
  active: "Active",
  paused: "Paused",
  draft: "Draft",
};

const STATUS_COLORS: Record<Project["status"], string> = {
  active: "#00aaff",
  paused: "rgba(0,170,255,0.4)",
  draft: "rgba(0,170,255,0.25)",
};

const EASE = [0.22, 1, 0.36, 1] as const;

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.55, ease: EASE },
  }),
};

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      style={{
        background: "rgba(0,170,255,0.04)",
        border: "1px solid rgba(0,170,255,0.12)",
        borderRadius: "12px",
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        cursor: "pointer",
        transition: "border-color 0.2s, background 0.2s",
      }}
      whileHover={{
        borderColor: "rgba(0,170,255,0.35)",
        backgroundColor: "rgba(0,170,255,0.07)",
        transition: { duration: 0.2 },
      }}
    >
      {/* Status dot + label */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: STATUS_COLORS[project.status],
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "9px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: STATUS_COLORS[project.status],
          }}
        >
          {STATUS_LABELS[project.status]}
        </span>
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: "Syne, system-ui, sans-serif",
          fontSize: "16px",
          fontWeight: 600,
          color: "rgba(220,232,240,0.92)",
          margin: 0,
          letterSpacing: "-0.01em",
          lineHeight: 1.3,
        }}
      >
        {project.title}
      </h3>

      {/* Footer row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "4px",
        }}
      >
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "10px",
            color: "rgba(160,185,210,0.5)",
            letterSpacing: "0.05em",
          }}
        >
          Edited {project.lastEdited}
        </span>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          style={{
            fontFamily: "Syne, system-ui, sans-serif",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.06em",
            color: "#00aaff",
            background: "rgba(0,170,255,0.1)",
            border: "1px solid rgba(0,170,255,0.25)",
            borderRadius: "6px",
            padding: "5px 14px",
            cursor: "pointer",
            textTransform: "uppercase",
          }}
        >
          Continue
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function LabWorkBay() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: EASE }}
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "28px",
      }}
    >
      {/* Header */}
      <div>
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "9px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(0,170,255,0.45)",
            display: "block",
            marginBottom: "10px",
          }}
        >
          Creation Lab · Work Bay
        </span>
        <h2
          style={{
            fontFamily: "Syne, system-ui, sans-serif",
            fontSize: "clamp(22px, 3.5vw, 32px)",
            fontWeight: 700,
            color: "rgba(228,235,240,0.9)",
            margin: 0,
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
          }}
        >
          Creation Lab
        </h2>
        <p
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: "14px",
            color: "rgba(160,185,210,0.6)",
            margin: "8px 0 0",
            lineHeight: 1.5,
          }}
        >
          Your active projects, ready to continue
        </p>
      </div>

      {/* Project cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "16px",
        }}
      >
        {PROJECTS.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </motion.section>
  );
}
