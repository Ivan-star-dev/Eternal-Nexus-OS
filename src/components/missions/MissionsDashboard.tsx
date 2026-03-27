/**
 * MissionsDashboard.tsx — K-07 IMPL
 * V6-MISSIONS-IMPL-001 | 2026-03-27
 *
 * Grid of MissionCards with header stats + filter tabs.
 * AnimatePresence on filter change.
 * Dark theme, mobile responsive (2 cols desktop / 1 col mobile).
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { MOCK_MISSIONS, type Mission, type MissionStatus } from "@/lib/missions";
import MissionCard from "./MissionCard";

// ── Filter tab config ──────────────────────────────────────────────────────────

type FilterTab = "all" | MissionStatus;

const TABS: { id: FilterTab; label: string }[] = [
  { id: "all",       label: "All" },
  { id: "active",    label: "Active" },
  { id: "planning",  label: "Planning" },
  { id: "completed", label: "Completed" },
];

// ── Stats helpers ──────────────────────────────────────────────────────────────

function computeStats(missions: Mission[]) {
  const total      = missions.length;
  const active     = missions.filter((m) => m.status === "active").length;
  const completed  = missions.filter((m) => m.status === "completed").length;
  const rate       = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { total, active, rate };
}

// ── Component ──────────────────────────────────────────────────────────────────

interface MissionsDashboardProps {
  /** When true, show "View All Missions →" link at bottom (default: true) */
  showViewAll?: boolean;
}

export default function MissionsDashboard({ showViewAll = true }: MissionsDashboardProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const stats = computeStats(MOCK_MISSIONS);

  const filtered: Mission[] =
    activeTab === "all"
      ? MOCK_MISSIONS
      : MOCK_MISSIONS.filter((m) => m.status === activeTab);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

      {/* ── Stats row ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1px",
          background: "rgba(0,170,255,0.08)",
          border: "0.5px solid rgba(0,170,255,0.1)",
        }}
      >
        {[
          { value: stats.total,        label: "Total Missions" },
          { value: stats.active,       label: "Active Now" },
          { value: `${stats.rate}%`,   label: "Completion Rate" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: "rgba(6,12,20,0.94)",
              padding: "18px 20px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: "serif",
                fontSize: "clamp(22px, 3vw, 28px)",
                fontWeight: 700,
                color: "#00aaff",
                lineHeight: 1,
              }}
            >
              {stat.value}
            </span>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "8px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(228,235,240,0.35)",
              }}
            >
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* ── Filter tabs ── */}
      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                fontFamily: "monospace",
                fontSize: "9px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                padding: "6px 14px",
                border: isActive
                  ? "0.5px solid rgba(0,170,255,0.5)"
                  : "0.5px solid rgba(255,255,255,0.08)",
                background: isActive ? "rgba(0,170,255,0.1)" : "transparent",
                color: isActive ? "#00aaff" : "rgba(228,235,240,0.38)",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Cards grid ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 380px), 1fr))",
            gap: "16px",
          }}
        >
          {filtered.length === 0 ? (
            <p
              style={{
                fontFamily: "monospace",
                fontSize: "11px",
                color: "rgba(228,235,240,0.3)",
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "40px 0",
              }}
            >
              No missions in this category.
            </p>
          ) : (
            filtered.map((mission, i) => (
              <MissionCard key={mission.id} mission={mission} index={i} />
            ))
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── View all link ── */}
      {showViewAll && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <Link
            to="/missions"
            style={{
              fontFamily: "monospace",
              fontSize: "9px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#00aaff",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 0",
              textDecoration: "none",
              opacity: 0.7,
              transition: "opacity 0.2s ease",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.7")}
          >
            View All Missions <ArrowRight size={11} />
          </Link>
        </motion.div>
      )}
    </div>
  );
}
