/**
 * ProjectFocusPanel.tsx — V4 · System Behaviour · INTERACTION-002
 *
 * First real system behaviour: globe hotspot click → project detail panel.
 * Slides in from right. Dismisses on close or click-outside.
 *
 * Law: HEAVEN_LAB_REFERENCE_SURFACE.md — glass depth · canonical colours
 * Motion: src/lib/motion/config.ts — EASE_OUT · DUR
 */

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Radio, Activity } from "lucide-react";
import { EASE_OUT, DUR } from "@/lib/motion/config";
import type { ProjectLocation } from "@/data/projectLocations";

const STATUS_META: Record<string, { label: string; color: string; pulse: boolean }> = {
  ACTIVE:   { label: "ACTIVE",    color: "hsl(172 55% 40%)", pulse: true  },
  RESEARCH: { label: "RESEARCH",  color: "hsl(42 78% 45%)",  pulse: true  },
  PLANNING: { label: "PLANNING",  color: "rgba(255,255,255,0.35)", pulse: false },
};

interface ProjectFocusPanelProps {
  project: ProjectLocation | null;
  onClose: () => void;
}

export default function ProjectFocusPanel({ project, onClose }: ProjectFocusPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const meta = project ? (STATUS_META[project.status] ?? STATUS_META.PLANNING) : null;

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop — faint, doesn't kill globe */}
          <motion.div
            key="backdrop"
            className="absolute inset-0 z-[4] pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DUR.fast }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            key="panel"
            ref={panelRef}
            role="dialog"
            aria-label={`Project: ${project.title}`}
            className="absolute right-4 top-1/2 z-[5] w-[280px] pointer-events-auto"
            style={{ translateY: "-50%" }}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: DUR.base, ease: EASE_OUT }}
          >
            <div
              className="relative overflow-hidden"
              style={{
                background: "hsl(216 50% 5% / 0.92)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "0.5px solid rgba(255,255,255,0.09)",
                boxShadow: [
                  "0 0 0 0.5px rgba(255,255,255,0.04) inset",
                  "0 24px 64px -12px rgba(0,0,0,0.7)",
                  `0 0 40px -20px ${project.color}33`,
                ].join(", "),
              }}
            >
              {/* Colour accent — top edge */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(to right, transparent, ${project.color}88, transparent)` }}
              />

              {/* Header */}
              <div className="flex items-start justify-between p-5 pb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{
                      background: project.color,
                      boxShadow: meta?.pulse ? `0 0 6px 1px ${project.color}88` : "none",
                    }}
                  />
                  <span
                    className="font-mono text-[0.48rem] tracking-[0.18em] uppercase shrink-0"
                    style={{ color: project.color }}
                  >
                    {project.number}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="text-muted-foreground hover:text-foreground transition-colors ml-2 shrink-0"
                  aria-label="Close panel"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Body */}
              <div className="px-5 pb-6">
                {/* Title */}
                <h2
                  className="font-sans text-[15px] font-[400] uppercase leading-tight mb-1"
                  style={{
                    fontFamily: "Syne, system-ui, sans-serif",
                    letterSpacing: "0.06em",
                    color: "#e4ebf0",
                  }}
                >
                  {project.title}
                </h2>

                {/* Subtitle */}
                <p
                  className="font-serif italic font-[300] text-[12px] leading-snug mb-5"
                  style={{
                    fontFamily: "Cormorant Garamond, Georgia, serif",
                    color: "rgba(228,235,240,0.55)",
                  }}
                >
                  {project.subtitle}
                </p>

                {/* Divider */}
                <div
                  className="mb-4 h-px"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                />

                {/* Meta grid */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Status */}
                  <div className="flex flex-col gap-1">
                    <span
                      className="font-mono text-[0.44rem] tracking-[0.16em] uppercase"
                      style={{ color: "rgba(255,255,255,0.28)" }}
                    >
                      Status
                    </span>
                    <div className="flex items-center gap-1.5">
                      {meta?.pulse && (
                        <span
                          className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0"
                          style={{ background: meta.color }}
                        />
                      )}
                      <span
                        className="font-mono text-[0.5rem] tracking-[0.1em]"
                        style={{ color: meta?.color }}
                      >
                        {meta?.label}
                      </span>
                    </div>
                  </div>

                  {/* Coordinates */}
                  <div className="flex flex-col gap-1">
                    <span
                      className="font-mono text-[0.44rem] tracking-[0.16em] uppercase"
                      style={{ color: "rgba(255,255,255,0.28)" }}
                    >
                      Coordinates
                    </span>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5 shrink-0" style={{ color: "rgba(255,255,255,0.35)" }} />
                      <span
                        className="font-mono text-[0.46rem] tabular-nums"
                        style={{ color: "rgba(228,235,240,0.5)" }}
                      >
                        {project.lat.toFixed(1)}° {project.lng.toFixed(1)}°
                      </span>
                    </div>
                  </div>

                  {/* Pioneer */}
                  <div className="flex flex-col gap-1">
                    <span
                      className="font-mono text-[0.44rem] tracking-[0.16em] uppercase"
                      style={{ color: "rgba(255,255,255,0.28)" }}
                    >
                      Pioneer
                    </span>
                    <div className="flex items-center gap-1">
                      <Activity className="w-2.5 h-2.5 shrink-0" style={{ color: "rgba(255,255,255,0.35)" }} />
                      <span
                        className="font-mono text-[0.46rem]"
                        style={{ color: "rgba(228,235,240,0.5)" }}
                      >
                        Heaven Lab
                      </span>
                    </div>
                  </div>

                  {/* Signal */}
                  <div className="flex flex-col gap-1">
                    <span
                      className="font-mono text-[0.44rem] tracking-[0.16em] uppercase"
                      style={{ color: "rgba(255,255,255,0.28)" }}
                    >
                      Signal
                    </span>
                    <div className="flex items-center gap-1">
                      <Radio className="w-2.5 h-2.5 shrink-0 animate-pulse" style={{ color: "hsl(172 55% 40%)" }} />
                      <span
                        className="font-mono text-[0.46rem]"
                        style={{ color: "hsl(172 48% 52%)" }}
                      >
                        LIVE
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer stamp */}
                <div
                  className="mt-5 pt-3"
                  style={{ borderTop: "0.5px solid rgba(255,255,255,0.05)" }}
                >
                  <span
                    className="font-mono text-[0.42rem] tracking-[0.12em]"
                    style={{ color: "rgba(255,255,255,0.18)" }}
                  >
                    Eternal Nexus OS · Node {project.number}
                  </span>
                </div>
              </div>

              {/* Bottom colour accent */}
              <div
                className="absolute bottom-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(to right, transparent, ${project.color}44, transparent)` }}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
