/**
 * WorkshopHeader.tsx
 * Header for Nexus Cria / Workshop portal.
 *
 * Shows: logotype + teal dot · tagline · stats row
 * Canon: V7-SURFACES-001 · K-04+K-06 · @framer+@cursor
 */

import { motion } from "framer-motion";

const TEAL = "hsl(172, 55%, 38%)";
const TEAL_FAINT = "hsla(172, 55%, 38%, 0.35)";
const EASE = [0.22, 1, 0.36, 1] as const;

interface StatItem {
  value: string;
  label: string;
}

const STATS: StatItem[] = [
  { value: "4", label: "projects" },
  { value: "2", label: "active" },
  { value: "1", label: "launching" },
];

export default function WorkshopHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      aria-label="Nexus Cria header"
      style={{
        paddingBottom: "clamp(32px, 5vh, 56px)",
        borderBottom: `1px solid ${TEAL_FAINT}`,
        marginBottom: "clamp(32px, 5vh, 48px)",
      }}
    >
      {/* Logotype row */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
        <span
          style={{
            fontFamily: "Syne, system-ui, sans-serif",
            fontSize: "clamp(24px, 4vw, 36px)",
            fontWeight: 700,
            color: "rgba(228,235,240,0.92)",
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          Nexus Cria
        </span>
        {/* Teal dot indicator */}
        <motion.span
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: TEAL,
            flexShrink: 0,
            display: "block",
          }}
        />
      </div>

      {/* Tagline */}
      <p
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: "14px",
          color: "rgba(160,185,200,0.6)",
          margin: "0 0 24px",
          lineHeight: 1.5,
          letterSpacing: "0.01em",
        }}
      >
        Where ideas become real.
      </p>

      {/* Stats row */}
      <div style={{ display: "flex", gap: "clamp(20px, 4vw, 40px)", flexWrap: "wrap" }}>
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.07, duration: 0.4, ease: EASE }}
            style={{ display: "flex", alignItems: "baseline", gap: "6px" }}
          >
            <span
              style={{
                fontFamily: "Syne, system-ui, sans-serif",
                fontSize: "22px",
                fontWeight: 700,
                color: TEAL,
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              {stat.value}
            </span>
            <span
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "10px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(150,185,185,0.45)",
              }}
            >
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.header>
  );
}
