/**
 * MissionCard.tsx — K-07 IMPL
 * V6-MISSIONS-IMPL-001 | 2026-03-27
 *
 * Displays a single Mission: category badge, title, location, progress bar,
 * status chip, team/budget row.
 * Dark theme — electric blue (#00aaff) for active, gold for completed.
 * Framer Motion entrance animation — stagger-ready via `index` prop.
 */

import { motion } from "framer-motion";
import { MapPin, Users, DollarSign } from "lucide-react";
import type { Mission, MissionStatus, MissionCategory } from "@/lib/missions";

// ── Colour maps ────────────────────────────────────────────────────────────────

const STATUS_CHIP: Record<
  MissionStatus,
  { label: string; color: string; bg: string }
> = {
  active:    { label: "Active",     color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  planning:  { label: "Planning",   color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  completed: { label: "Completed",  color: "#14b8a6", bg: "rgba(20,184,166,0.12)" },
  paused:    { label: "Paused",     color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
};

const CATEGORY_BADGE: Record<
  MissionCategory,
  { label: string; color: string }
> = {
  climate:        { label: "Climate",        color: "#34d399" },
  infrastructure: { label: "Infrastructure", color: "#00aaff" },
  research:       { label: "Research",       color: "#a78bfa" },
  education:      { label: "Education",      color: "#fb923c" },
  health:         { label: "Health",         color: "#f472b6" },
};

// ── Progress bar fill colour ───────────────────────────────────────────────────

function progressColor(status: MissionStatus): string {
  if (status === "completed") return "#c8a44e"; // gold
  if (status === "paused")    return "#ef4444";
  return "#00aaff"; // electric blue (active / planning)
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatBudget(usd: number): string {
  if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(1)}M`;
  if (usd >= 1_000)     return `$${(usd / 1_000).toFixed(0)}K`;
  return `$${usd}`;
}

// ── Component ──────────────────────────────────────────────────────────────────

interface MissionCardProps {
  mission: Mission;
  index?: number;
}

export default function MissionCard({ mission, index = 0 }: MissionCardProps) {
  const chip     = STATUS_CHIP[mission.status];
  const badge    = CATEGORY_BADGE[mission.category];
  const barColor = progressColor(mission.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.07,
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        background: "rgba(6,12,20,0.92)",
        border: "0.5px solid rgba(0,170,255,0.12)",
        borderRadius: "2px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
      }}
    >
      {/* Top row: category badge + status chip */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Category badge */}
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "9px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: badge.color,
            borderBottom: `1px solid ${badge.color}`,
            paddingBottom: "1px",
          }}
        >
          {badge.label}
        </span>

        {/* Status chip */}
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "8px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: chip.color,
            background: chip.bg,
            padding: "2px 8px",
            borderRadius: "2px",
          }}
        >
          {chip.label}
        </span>
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: "serif",
          fontSize: "clamp(14px, 2vw, 17px)",
          fontWeight: 600,
          color: "rgba(228,235,240,0.92)",
          lineHeight: 1.3,
          margin: 0,
        }}
      >
        {mission.title}
      </h3>

      {/* Location */}
      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
        <MapPin size={10} style={{ color: "rgba(228,235,240,0.3)", flexShrink: 0 }} />
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "9px",
            letterSpacing: "0.1em",
            color: "rgba(228,235,240,0.4)",
            textTransform: "uppercase",
          }}
        >
          {mission.location}
        </span>
      </div>

      {/* Description */}
      <p
        style={{
          fontFamily: "sans-serif",
          fontSize: "11px",
          lineHeight: 1.6,
          color: "rgba(228,235,240,0.55)",
          margin: 0,
        }}
      >
        {mission.description}
      </p>

      {/* Progress bar */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "5px",
          }}
        >
          <span style={{ fontFamily: "monospace", fontSize: "8px", letterSpacing: "0.1em", color: "rgba(228,235,240,0.3)", textTransform: "uppercase" }}>
            Progress
          </span>
          <span style={{ fontFamily: "monospace", fontSize: "9px", color: barColor }}>
            {mission.progress}%
          </span>
        </div>
        {/* Track */}
        <div
          style={{
            height: "3px",
            background: "rgba(255,255,255,0.07)",
            borderRadius: "2px",
            overflow: "hidden",
          }}
        >
          {/* Fill — animated */}
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${mission.progress}%` }}
            transition={{ delay: index * 0.07 + 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{
              height: "100%",
              background: barColor,
              borderRadius: "2px",
            }}
          />
        </div>
      </div>

      {/* Team / Budget row */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          paddingTop: "6px",
          borderTop: "0.5px solid rgba(255,255,255,0.05)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <Users size={9} style={{ color: "rgba(228,235,240,0.28)" }} />
          <span style={{ fontFamily: "monospace", fontSize: "9px", color: "rgba(228,235,240,0.42)", letterSpacing: "0.08em" }}>
            {mission.teamSize} people
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <DollarSign size={9} style={{ color: "rgba(228,235,240,0.28)" }} />
          <span style={{ fontFamily: "monospace", fontSize: "9px", color: "rgba(228,235,240,0.42)", letterSpacing: "0.08em" }}>
            {formatBudget(mission.budget)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
