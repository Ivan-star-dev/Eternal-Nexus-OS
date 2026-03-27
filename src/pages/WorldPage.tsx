/**
 * WorldPage.tsx — /world route
 * V4-WORLD-FEATURES-001 | K-07+K-08 | 2026-03-27
 *
 * "Living World" page:
 * - Full-viewport globe canvas
 * - WorldEventFeed sidebar (right column desktop / overlay on mobile)
 * - Globe hotspot data via useGlobeHotspots
 * - Project focus panel on hotspot selection
 */

import { lazy, Suspense, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Globe } from "lucide-react";
import OrganErrorBoundary from "@/components/shared/OrganErrorBoundary";
import WorldEventFeed from "@/components/world/WorldEventFeed";
import ProjectFocusPanel from "@/components/home/ProjectFocusPanel";
import { useGlobeHotspots } from "@/hooks/useGlobeHotspots";
import { homeProjects } from "@/data/homeProjects";
import type { HomeProject } from "@/data/homeProjects";

const GlobeCanvas = lazy(() => import("@/components/globe/GlobeCanvas"));

const EASE = [0.22, 1, 0.36, 1] as const;

function GlobeLoadingFallback() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ background: "#0a0a1a" }}
    >
      <motion.div
        animate={{ scale: [1, 1.06, 1], opacity: [0.2, 0.45, 0.2] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: "clamp(200px, 36vw, 480px)",
          height: "clamp(200px, 36vw, 480px)",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at 40% 38%, rgba(0,170,255,0.12) 0%, rgba(0,68,204,0.18) 42%, transparent 72%)",
          border: "0.5px solid rgba(0,170,255,0.15)",
        }}
      />
      <span
        className="absolute font-mono text-[0.5rem] tracking-[0.3em] uppercase"
        style={{ color: "rgba(0,170,255,0.4)" }}
      >
        INITIALISING GLOBE…
      </span>
    </div>
  );
}

export default function WorldPage() {
  const [focusedProject, setFocusedProject] = useState<HomeProject | null>(null);
  const [feedVisible, setFeedVisible] = useState(true);
  const hotspots = useGlobeHotspots();

  useEffect(() => {
    document.title = "World — Eternal Nexus OS";
    return () => {
      document.title = "Eternal Nexus OS";
    };
  }, []);

  function handleFocusRegion(_lat: number, _lng: number) {
    // Future: pass camera focus to globe via ref/context
    // For now we just register the intent; globe camera control hooks here
  }

  function handleHotspotClick(projectId: string) {
    const project = homeProjects.find((p) => p.id === projectId) ?? null;
    setFocusedProject(project);
  }

  return (
    <div
      className="fixed inset-0 overflow-hidden flex"
      style={{ background: "#060c14" }}
    >
      {/* ── Globe canvas — main area ───────────────────────────────── */}
      <div className="relative flex-1 overflow-hidden">
        <OrganErrorBoundary organName="WorldGlobe" silent>
          <Suspense fallback={<GlobeLoadingFallback />}>
            <div className="absolute inset-0">
              <GlobeCanvas />
            </div>
          </Suspense>
        </OrganErrorBoundary>

        {/* Top bar */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.9, ease: EASE }}
          className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 py-4 md:px-10"
          style={{ borderBottom: "0.5px solid rgba(0,170,255,0.06)" }}
        >
          <Link
            to="/"
            className="flex items-center gap-2 transition-opacity duration-200 hover:opacity-80"
            style={{ color: "rgba(0,170,255,0.55)" }}
          >
            <ArrowLeft size={13} />
            <span className="font-mono text-[0.5rem] tracking-[0.22em] uppercase">
              Eternal Nexus OS
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {/* Hotspot count */}
            <span
              className="font-mono text-[8px] tracking-[0.14em] uppercase hidden sm:block"
              style={{ color: "rgba(0,170,255,0.35)" }}
            >
              {hotspots.length} hotspots active
            </span>

            {/* Live indicator */}
            <div className="flex items-center gap-2">
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  display: "inline-block",
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: "#00aaff",
                }}
              />
              <span
                className="font-mono text-[0.48rem] tracking-[0.2em] uppercase"
                style={{ color: "rgba(0,170,255,0.4)" }}
              >
                World · Live
              </span>
            </div>

            {/* Toggle feed button */}
            <button
              onClick={() => setFeedVisible((v) => !v)}
              className="hidden lg:flex items-center gap-1.5 transition-opacity duration-150 hover:opacity-70"
              style={{
                color: feedVisible ? "rgba(0,170,255,0.7)" : "rgba(228,235,240,0.3)",
                border: `0.5px solid ${feedVisible ? "rgba(0,170,255,0.2)" : "rgba(255,255,255,0.08)"}`,
                padding: "4px 10px",
                fontSize: "8px",
                fontFamily: "monospace",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
              aria-pressed={feedVisible}
              aria-label="Toggle event feed"
            >
              <Globe size={9} />
              Event Feed
            </button>
          </div>
        </motion.div>

        {/* Bottom label */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1.1, ease: EASE }}
          className="absolute bottom-8 left-0 right-0 z-10 flex flex-col items-center gap-2 pointer-events-none"
          style={{ paddingRight: feedVisible ? "clamp(0px, 28vw, 340px)" : "0" }}
        >
          <h1
            className="font-serif font-light italic"
            style={{
              fontSize: "clamp(16px, 2vw, 26px)",
              color: "rgba(200,230,255,0.55)",
              letterSpacing: "0.06em",
            }}
          >
            The World, Alive.
          </h1>
          <p
            className="font-mono uppercase"
            style={{
              fontSize: "8px",
              letterSpacing: "0.28em",
              color: "rgba(0,170,255,0.28)",
            }}
          >
            Drag to orbit · Scroll to zoom
          </p>
        </motion.div>
      </div>

      {/* ── Event Feed sidebar — desktop only ─────────────────────── */}
      <motion.div
        initial={{ x: "100%", opacity: 0 }}
        animate={{
          x: feedVisible ? 0 : "100%",
          opacity: feedVisible ? 1 : 0,
        }}
        transition={{ duration: 0.42, ease: EASE }}
        className="hidden lg:block relative z-20 overflow-y-auto flex-shrink-0"
        style={{
          width: "clamp(260px, 26vw, 340px)",
          background: "rgba(6,12,20,0.95)",
          borderLeft: "0.5px solid rgba(0,170,255,0.1)",
        }}
      >
        <WorldEventFeed
          onFocusRegion={handleFocusRegion}
          className="h-full"
          maxItems={8}
        />
      </motion.div>

      {/* Project Focus Panel */}
      <ProjectFocusPanel
        project={focusedProject}
        onClose={() => setFocusedProject(null)}
      />
    </div>
  );
}
