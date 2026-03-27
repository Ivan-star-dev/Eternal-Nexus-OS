/**
 * ProjectFocusPanel.tsx — K-07 IMPL
 * V4-WORLD-FEATURES-001 | 2026-03-27
 *
 * Slide-in panel displayed when a project hotspot is selected on the globe.
 * Desktop: slides in from right.
 * Mobile: slides up from bottom (bottom sheet).
 * Shows: name, status badge, 3 metrics, 1-line description, CTA "View Full Project".
 */

import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, MapPin, TrendingUp, Clock, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSingleProjectPulse } from "@/hooks/useProjectPulse";
import type { HomeProject } from "@/data/homeProjects";

interface ProjectMetric {
  label: string;
  value: string;
  icon: React.ReactNode;
}

const PROJECT_METRICS: Record<string, ProjectMetric[]> = {
  "deltaspine-nl": [
    { label: "Speed", value: "300 km/h", icon: <Zap size={10} /> },
    { label: "Payback", value: "8–12 yr", icon: <Clock size={10} /> },
    { label: "Trend", value: "+12% MoM", icon: <TrendingUp size={10} /> },
  ],
  "geocore-power": [
    { label: "Output", value: "80–120 MW", icon: <Zap size={10} /> },
    { label: "Efficiency", value: "40–60%", icon: <TrendingUp size={10} /> },
    { label: "Cost/kWh", value: "$0.08", icon: <Clock size={10} /> },
  ],
  "terra-lenta": [
    { label: "Target Δ", value: "−10% rot.", icon: <Zap size={10} /> },
    { label: "Day length", value: "26.4 h", icon: <Clock size={10} /> },
    { label: "Phase", value: "Research", icon: <TrendingUp size={10} /> },
  ],
  "fusion-core": [
    { label: "Output", value: "1 TW", icon: <Zap size={10} /> },
    { label: "GDP +", value: "+10% global", icon: <TrendingUp size={10} /> },
    { label: "Phase", value: "Planning", icon: <Clock size={10} /> },
  ],
  "chip-fold": [
    { label: "Perf", value: "100× Si", icon: <Zap size={10} /> },
    { label: "Energy −", value: "−70%", icon: <TrendingUp size={10} /> },
    { label: "Recyclable", value: "100%", icon: <Clock size={10} /> },
  ],
};

const STATUS_STYLE: Record<string, { color: string; bg: string; label: string }> = {
  ACTIVE: { color: "hsl(172 48% 52%)", bg: "hsl(172 55% 28% / 0.18)", label: "ACTIVE" },
  RESEARCH: { color: "hsl(42 78% 52%)", bg: "hsl(42 78% 38% / 0.18)", label: "RESEARCH" },
  PLANNING: { color: "hsl(38 80% 55%)", bg: "hsl(38 80% 42% / 0.18)", label: "PLANNING" },
};

const EASE = [0.22, 1, 0.36, 1] as const;

interface ProjectFocusPanelProps {
  project: HomeProject | null;
  onClose: () => void;
}

function LivePulseDot({ projectId }: { projectId: string }) {
  const pulse = useSingleProjectPulse(projectId);
  if (!pulse?.isLive) return null;

  return (
    <div className="flex items-center gap-1.5">
      <motion.span
        animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          display: "inline-block",
          width: "5px",
          height: "5px",
          borderRadius: "50%",
          background: "#00aaff",
          flexShrink: 0,
        }}
      />
      <span
        className="font-mono text-[8px] tracking-[0.14em] uppercase"
        style={{ color: "rgba(0,170,255,0.7)" }}
      >
        LIVE
      </span>
    </div>
  );
}

function PanelContent({ project, onClose }: { project: HomeProject; onClose: () => void }) {
  const statusStyle = STATUS_STYLE[project.status] ?? STATUS_STYLE.ACTIVE;
  const metrics = PROJECT_METRICS[project.id] ?? [];

  return (
    <div
      className="flex flex-col h-full"
      style={{
        background: "rgba(6,12,20,0.97)",
        borderLeft: "0.5px solid rgba(0,170,255,0.12)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-start justify-between px-5 py-4"
        style={{ borderBottom: "0.5px solid rgba(255,255,255,0.05)" }}
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span
              className="font-mono text-[8px] tracking-[0.16em] uppercase px-2 py-0.5"
              style={{
                color: statusStyle.color,
                background: statusStyle.bg,
              }}
            >
              {statusStyle.label}
            </span>
            <LivePulseDot projectId={project.id} />
          </div>
          <h2
            className="font-serif font-bold leading-[1.2]"
            style={{
              fontSize: "clamp(16px, 2.2vw, 22px)",
              color: "rgba(228,235,240,0.92)",
            }}
          >
            {project.title}
          </h2>
          <p
            className="font-mono text-[8px] tracking-[0.14em] uppercase flex items-center gap-1"
            style={{ color: "rgba(228,235,240,0.3)" }}
          >
            <MapPin size={8} /> {project.subtitle}
          </p>
        </div>

        <button
          onClick={onClose}
          className="flex-shrink-0 mt-1 transition-opacity duration-150 hover:opacity-60"
          aria-label="Close project panel"
          style={{ color: "rgba(228,235,240,0.35)" }}
        >
          <X size={14} />
        </button>
      </div>

      {/* Description */}
      <div className="px-5 py-4" style={{ borderBottom: "0.5px solid rgba(255,255,255,0.05)" }}>
        <p
          className="font-sans text-[11px] leading-[1.7]"
          style={{ color: "rgba(228,235,240,0.55)" }}
        >
          {project.summary}
        </p>
      </div>

      {/* Metrics */}
      {metrics.length > 0 && (
        <div
          className="px-5 py-4 grid grid-cols-3 gap-3"
          style={{ borderBottom: "0.5px solid rgba(255,255,255,0.05)" }}
        >
          {metrics.map((m) => (
            <div
              key={m.label}
              className="flex flex-col gap-1.5 p-2"
              style={{ background: "rgba(255,255,255,0.025)", border: "0.5px solid rgba(255,255,255,0.06)" }}
            >
              <div
                className="flex items-center gap-1"
                style={{ color: "rgba(0,170,255,0.55)" }}
              >
                {m.icon}
                <span
                  className="font-mono text-[7px] tracking-[0.12em] uppercase"
                  style={{ color: "rgba(228,235,240,0.28)" }}
                >
                  {m.label}
                </span>
              </div>
              <span
                className="font-mono text-[11px] font-bold"
                style={{ color: "rgba(228,235,240,0.82)" }}
              >
                {m.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Tags */}
      <div className="px-5 py-3 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="font-mono text-[7px] tracking-[0.1em] uppercase px-2 py-0.5"
            style={{
              background: "rgba(255,255,255,0.05)",
              color: "rgba(228,235,240,0.35)",
              border: "0.5px solid rgba(255,255,255,0.07)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-auto px-5 pb-5 pt-2">
        <Link
          to={`/project/${project.id}`}
          className="flex items-center justify-center gap-2 w-full py-3 font-mono text-[9px] tracking-[0.18em] uppercase transition-all duration-200 group"
          style={{
            background: "rgba(0,170,255,0.09)",
            border: "0.5px solid rgba(0,170,255,0.28)",
            color: "rgba(0,170,255,0.85)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "rgba(0,170,255,0.15)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "rgba(0,170,255,0.09)";
          }}
        >
          View Full Project
          <ArrowRight
            size={10}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </div>
  );
}

export default function ProjectFocusPanel({ project, onClose }: ProjectFocusPanelProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    // Mobile: bottom sheet
    return (
      <AnimatePresence>
        {project && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40"
              style={{ background: "rgba(0,0,0,0.55)" }}
              onClick={onClose}
              aria-hidden="true"
            />

            {/* Bottom sheet */}
            <motion.div
              key="sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.38, ease: EASE }}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-lg overflow-hidden"
              style={{ maxHeight: "80vh" }}
            >
              <PanelContent project={project} onClose={onClose} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  // Desktop: right slide panel
  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop — subtle */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.28)" }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Side panel */}
          <motion.div
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.42, ease: EASE }}
            className="fixed top-0 right-0 bottom-0 z-50 overflow-y-auto"
            style={{ width: "clamp(280px, 28vw, 380px)" }}
          >
            <PanelContent project={project} onClose={onClose} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
