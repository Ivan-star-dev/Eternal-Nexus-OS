/**
 * ProjectBottomSheet — V5-TOUCH-003 + V5-TOUCH-004 + V5-TOUCH-005
 *
 * Mobile info panel that slides up from bottom when a project is focused.
 * Desktop: invisible (ProjectInspector handles that side).
 *
 * V5-TOUCH-003: content layer — name · location · desc · CTAs
 * V5-TOUCH-004: mode-aware CTAs — explorer / lab / school
 * V5-TOUCH-005: return logic — swipe-down · "Return" CTA · tap X
 */

import { motion } from "framer-motion";
import { X, FileText, Globe, ArrowLeft, FlaskConical, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { geoIdToRoute, hasProjectPage } from "@/lib/projectBridge";
import { audioEngine } from "@/lib/audioEngine";

export type TouchMode = "explorer" | "lab" | "school";

interface BottomSheetProject {
  id: number;
  name: string;
  lat: number;
  lon: number;
  color: string;
  desc: string;
  status: string;
}

const MODE_CONFIG: Record<TouchMode, {
  primary: { label: string; icon: React.ReactNode };
  secondary: { label: string; icon: React.ReactNode };
}> = {
  explorer: {
    primary:   { label: "View Full Dossier",      icon: <FileText size={13} /> },
    secondary: { label: "Explore on Atlas",        icon: <Globe size={13} /> },
  },
  lab: {
    primary:   { label: "Open Research Context",   icon: <FlaskConical size={13} /> },
    secondary: { label: "Analyse Data Layers",     icon: <Globe size={13} /> },
  },
  school: {
    primary:   { label: "Start Guided Tour",       icon: <GraduationCap size={13} /> },
    secondary: { label: "See Full Explanation",    icon: <FileText size={13} /> },
  },
};

export default function ProjectBottomSheet({
  project,
  mode = "explorer",
  onClose,
}: {
  project: BottomSheetProject;
  mode?: TouchMode;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const hasDossier = hasProjectPage(project.id);
  const cfg = MODE_CONFIG[mode];

  const handlePrimary = () => {
    audioEngine.play("uiConfirm");
    onClose();
    if (hasDossier) {
      navigate(geoIdToRoute(project.id));
    } else {
      navigate("/atlas");
    }
  };

  const handleSecondary = () => {
    audioEngine.play("dataStreamPulse");
    onClose();
    navigate("/atlas");
  };

  const handleClose = () => {
    audioEngine.play("uiDismiss");
    onClose();
  };

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: "0%" }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 0.4 }}
      onDragEnd={(_, info) => {
        if (info.offset.y > 72) handleClose();
      }}
      className="fixed bottom-0 left-0 right-0 z-[200] rounded-t-2xl sm:hidden"
      style={{
        background: "rgba(5, 5, 7, 0.97)",
        backdropFilter: "blur(28px)",
        borderTop: "1px solid rgba(212,175,55,0.14)",
      }}
    >
      {/* Drag handle */}
      <div className="flex justify-center pt-3 pb-1">
        <div className="w-9 h-[3px] rounded-full bg-white/15" />
      </div>

      <div className="px-5 pb-8 pt-2">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Colour beacon */}
            <div
              className="shrink-0 w-2.5 h-2.5 rounded-full mt-0.5"
              style={{
                background: project.color,
                boxShadow: `0 0 10px ${project.color}80`,
              }}
            />
            <div className="min-w-0">
              <h2 className="text-white font-semibold text-[1.05rem] leading-tight truncate">
                {project.name}
              </h2>
              <p className="font-mono text-[0.48rem] tracking-widest text-white/35 uppercase mt-0.5">
                {project.status} · {project.lat.toFixed(1)}° {project.lon.toFixed(1)}°
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="shrink-0 text-white/35 p-1 ml-2"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Mode badge */}
        <div className="mb-3">
          <span
            className="font-mono text-[0.4rem] tracking-[0.2em] uppercase px-2 py-0.5 rounded-sm"
            style={{
              background: "rgba(212,175,55,0.08)",
              border: "1px solid rgba(212,175,55,0.2)",
              color: "#D4AF37",
            }}
          >
            {mode} mode
          </span>
        </div>

        {/* Description */}
        <p className="text-white/60 text-[0.78rem] leading-relaxed mb-6">
          {project.desc}
        </p>

        {/* CTAs */}
        <div className="flex flex-col gap-2.5">
          {/* Primary CTA */}
          <button
            onClick={handlePrimary}
            className="w-full flex items-center gap-2.5 px-4 py-3 rounded-lg font-mono text-[0.7rem] tracking-wide transition-opacity active:opacity-70"
            style={{
              background: "rgba(212,175,55,0.10)",
              border: "1px solid rgba(212,175,55,0.28)",
              color: "#D4AF37",
            }}
          >
            {cfg.primary.icon}
            {hasDossier ? cfg.primary.label : cfg.secondary.label}
          </button>

          {/* Secondary CTA */}
          {hasDossier && (
            <button
              onClick={handleSecondary}
              className="w-full flex items-center gap-2.5 px-4 py-3 rounded-lg font-mono text-[0.7rem] tracking-wide text-white/55 transition-opacity active:opacity-70"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {cfg.secondary.icon}
              {cfg.secondary.label}
            </button>
          )}

          {/* Return */}
          <button
            onClick={handleClose}
            className="flex items-center gap-1.5 text-white/28 font-mono text-[0.6rem] tracking-wide pt-1"
          >
            <ArrowLeft size={10} />
            Return to Globe
          </button>
        </div>
      </div>
    </motion.div>
  );
}
