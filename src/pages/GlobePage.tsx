/**
 * GlobePage.tsx — /globe route
 * GLOBE-3D-001 | GLOBE-EXPERIENCE-IMPL-001
 *
 * Full-viewport real 3D Earth:
 *   - Procedural shader: ocean, landmass (fbm noise), polar ice
 *   - Two additive atmosphere shells — electric blue Fresnel limb glow
 *   - Starfield
 *   - Smooth auto-rotation + OrbitControls (drag/scroll)
 *   - Palette: deep space dark (#0a0a1a) + electric blue (#00aaff)
 *   - Target: 60fps, minimum 30fps
 *
 * Route: /globe
 *
 * @antigravity + @cursor | GLOBE-3D-001 | 2026-03-27
 */

import { lazy, Suspense, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import OrganErrorBoundary from "@/components/shared/OrganErrorBoundary";

// Real 3D Earth — GLOBE-3D-001
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
          width: "clamp(240px, 40vw, 520px)",
          height: "clamp(240px, 40vw, 520px)",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at 40% 38%, rgba(0,170,255,0.12) 0%, rgba(0,68,204,0.18) 42%, transparent 72%)",
          border: "0.5px solid rgba(0,170,255,0.15)",
        }}
      />
      <span
        className="absolute font-mono text-[0.55rem] tracking-[0.3em] uppercase"
        style={{ color: "rgba(0,170,255,0.4)" }}
      >
        INITIALISING GLOBE…
      </span>
    </div>
  );
}

export default function GlobePage() {
  useEffect(() => {
    document.title = "Globe — Eternal Nexus OS";
    return () => { document.title = "Eternal Nexus OS"; };
  }, []);

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ background: "#0a0a1a" }}
    >
      {/* ── Real 3D Earth — fills 100% viewport ─────────────────────── */}
      <OrganErrorBoundary organName="GlobeCanvas" silent>
        <Suspense fallback={<GlobeLoadingFallback />}>
          <div className="absolute inset-0">
            <GlobeCanvas />
          </div>
        </Suspense>
      </OrganErrorBoundary>

      {/* ── Top bar overlay ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.9, ease: EASE }}
        className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-4 md:px-12"
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
            Planetary Interface · Live
          </span>
        </div>
      </motion.div>

      {/* ── Bottom title overlay ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 1.1, ease: EASE }}
        className="absolute bottom-10 left-0 right-0 z-10 flex flex-col items-center gap-3 pointer-events-none"
      >
        <h1
          className="font-serif font-light italic"
          style={{
            fontSize: "clamp(18px, 2.4vw, 30px)",
            color: "rgba(200,230,255,0.65)",
            letterSpacing: "0.06em",
          }}
        >
          The World, Alive.
        </h1>
        <p
          className="font-mono uppercase"
          style={{
            fontSize: "9px",
            letterSpacing: "0.28em",
            color: "rgba(0,170,255,0.3)",
          }}
        >
          Drag to orbit · Scroll to zoom
        </p>
        <motion.div
          animate={{ scaleX: [0.6, 1.1, 0.6], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: "48px",
            height: "1px",
            background: "#00aaff",
            borderRadius: "1px",
          }}
        />
      </motion.div>
    </div>
  );
}
