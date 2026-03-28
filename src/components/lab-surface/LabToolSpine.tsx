/**
 * LabToolSpine.tsx
 * Right-side dormant tool list for Creation Lab.
 * V10 upgrade: real onToolSelect handler — each tool triggers an action.
 * Reveals on hover of the work bay area (opacity 0→1, x: 20→0).
 *
 * Canon: GAP-CLOSURE-V10-001 · Gap 3 · Creation Lab
 * @claude | 2026-03-28
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type LabToolId = "research" | "simulate" | "draft" | "archive" | "collaborate";

interface Tool {
  id: LabToolId;
  icon: string;
  label: string;
  shortcut: string;
  description: string;
  comingSoon?: boolean;
}

const TOOLS: Tool[] = [
  {
    id: "research",
    icon: "⌖",
    label: "Research",
    shortcut: "⌘R",
    description: "Start a research thread",
  },
  {
    id: "simulate",
    icon: "◈",
    label: "Simulate",
    shortcut: "⌘S",
    description: "Run a simulation",
  },
  {
    id: "draft",
    icon: "◻",
    label: "Draft",
    shortcut: "⌘D",
    description: "Create a draft document",
  },
  {
    id: "archive",
    icon: "◎",
    label: "Archive",
    shortcut: "⌘A",
    description: "View archived artifacts",
  },
  {
    id: "collaborate",
    icon: "⊞",
    label: "Collaborate",
    shortcut: "⌘C",
    description: "Invite collaborators",
    comingSoon: true,
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

const spineVariants = {
  dormant: {
    opacity: 0,
    x: 20,
    transition: { duration: 0.3, ease: [0.4, 0, 1, 1] as const },
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
  onToolSelect?: (toolId: LabToolId) => void;
}

export default function LabToolSpine({ visible, onToolSelect }: LabToolSpineProps) {
  const [tooltip, setTooltip] = useState<LabToolId | null>(null);

  const handleClick = (tool: Tool) => {
    if (tool.comingSoon) return;
    onToolSelect?.(tool.id);
  };

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
        position: "relative",
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
        <div key={tool.id} style={{ position: "relative" }}>
          <motion.button
            custom={i}
            variants={itemVariants}
            animate={visible ? "revealed" : "dormant"}
            onClick={() => handleClick(tool)}
            onMouseEnter={() => tool.comingSoon && setTooltip(tool.id)}
            onMouseLeave={() => setTooltip(null)}
            whileHover={
              !tool.comingSoon
                ? {
                    backgroundColor: "rgba(0,170,255,0.08)",
                    borderColor: "rgba(0,170,255,0.22)",
                    transition: { duration: 0.15 },
                  }
                : undefined
            }
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "10px",
              padding: "9px 12px",
              background: "rgba(0,170,255,0.02)",
              border: "1px solid rgba(0,170,255,0.07)",
              borderRadius: "8px",
              cursor: tool.comingSoon ? "default" : "pointer",
              textAlign: "left",
              width: "100%",
              opacity: tool.comingSoon ? 0.45 : 1,
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

          {/* Coming soon tooltip */}
          <AnimatePresence>
            {tooltip === tool.id && tool.comingSoon && (
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.2, ease: EASE }}
                style={{
                  position: "absolute",
                  left: "calc(100% + 10px)",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(6,12,20,0.95)",
                  border: "1px solid rgba(0,170,255,0.15)",
                  borderRadius: "6px",
                  padding: "6px 12px",
                  whiteSpace: "nowrap",
                  zIndex: 10,
                }}
              >
                <span
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "9px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "rgba(0,170,255,0.5)",
                  }}
                >
                  Solo-first · Coming soon
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </motion.aside>
  );
}
