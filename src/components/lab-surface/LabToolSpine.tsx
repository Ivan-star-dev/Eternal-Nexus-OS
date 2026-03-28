/**
 * LabToolSpine.tsx
 * Right-side dormant tool list for Creation Lab.
 * Reveals on hover of the work bay area (opacity 0→1, x: 20→0).
 *
 * Canon: V7-SURFACES-001 · K-04+K-06 · @framer+@cursor
 */

import { motion } from "framer-motion";

interface Tool {
  id: string;
  icon: string;
  label: string;
  shortcut: string;
}

const TOOLS: Tool[] = [
  { id: "research", icon: "⌖", label: "Research", shortcut: "⌘R" },
  { id: "simulate", icon: "◈", label: "Simulate", shortcut: "⌘S" },
  { id: "draft", icon: "◻", label: "Draft", shortcut: "⌘D" },
  { id: "archive", icon: "◎", label: "Archive", shortcut: "⌘A" },
  { id: "collaborate", icon: "⊞", label: "Collaborate", shortcut: "⌘C" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

const spineVariants = {
  dormant: {
    opacity: 0,
    x: 20,
    transition: { duration: 0.3, ease: [0.4, 0, 1, 1] },
  },
  revealed: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: EASE },
  },
};

const itemVariants = {
  dormant: { opacity: 0, x: 12 },
  revealed: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: EASE },
  }),
};

interface LabToolSpineProps {
  visible: boolean;
}

export default function LabToolSpine({ visible }: LabToolSpineProps) {
  return (
    <motion.aside
      variants={spineVariants}
      animate={visible ? "revealed" : "dormant"}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        paddingTop: "4px",
        minWidth: "160px",
        alignSelf: "flex-start",
      }}
      aria-label="Lab tools"
    >
      <span
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "8px",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "rgba(0,170,255,0.3)",
          marginBottom: "8px",
          display: "block",
        }}
      >
        Tools
      </span>

      {TOOLS.map((tool, i) => (
        <motion.button
          key={tool.id}
          custom={i}
          variants={itemVariants}
          animate={visible ? "revealed" : "dormant"}
          whileHover={{
            backgroundColor: "rgba(0,170,255,0.08)",
            borderColor: "rgba(0,170,255,0.2)",
            transition: { duration: 0.15 },
          }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "10px",
            padding: "9px 12px",
            background: "rgba(0,170,255,0.02)",
            border: "1px solid rgba(0,170,255,0.07)",
            borderRadius: "8px",
            cursor: "pointer",
            textAlign: "left",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                fontSize: "13px",
                color: "rgba(0,170,255,0.55)",
                lineHeight: 1,
              }}
            >
              {tool.icon}
            </span>
            <span
              style={{
                fontFamily: "Syne, system-ui, sans-serif",
                fontSize: "12px",
                fontWeight: 500,
                color: "rgba(200,220,235,0.75)",
                letterSpacing: "0.01em",
              }}
            >
              {tool.label}
            </span>
          </div>

          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "9px",
              color: "rgba(0,170,255,0.3)",
              letterSpacing: "0.05em",
              flexShrink: 0,
            }}
          >
            {tool.shortcut}
          </span>
        </motion.button>
      ))}
    </motion.aside>
  );
}
