/**
 * OrbitalChamberPage.tsx — /orbital route
 * ORBITAL-CHAMBER-001 | K-02 3D_VISUAL
 *
 * Immersive orbital chamber: the Globe wrapped in a sovereign
 * cinematic container with:
 *   - Auto-orbiting camera preset (fixed angle, slow drift)
 *   - Atmospheric depth rings (SVG concentric, ultra-faint)
 *   - Motion trajectory arc (animated path around sphere)
 *   - Scanline grid overlay — machine substrate
 *   - Telemetry HUD strips (top + bottom)
 *   - Entry/exit page transitions via framer-motion
 *
 * Chain: GLOBE-3D-001 ✓ → ORBITAL-CHAMBER-001 → MOTION-SYSTEM-001
 * Route: /orbital
 *
 * @antigravity | ORBITAL-CHAMBER-001 | 2026-03-29
 */

import { lazy, Suspense, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useAnimationFrame } from "framer-motion";
import OrganErrorBoundary from "@/components/shared/OrganErrorBoundary";

// Real 3D Earth from GLOBE-3D-001
const GlobeCanvas = lazy(() => import("@/components/globe/GlobeCanvas"));

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ─── Telemetry data ────────────────────────────────────────────────────────────
const TELEMETRY_TOP = [
  { label: "ORBIT", value: "GEO-SYNC" },
  { label: "ALT", value: "35 786 km" },
  { label: "PERIOD", value: "23h 56m" },
  { label: "INC", value: "0.0°" },
];

const TELEMETRY_BOTTOM = [
  { label: "LAT", value: "0.00° N" },
  { label: "LON", value: "0.00° E" },
  { label: "SPEED", value: "3.07 km/s" },
  { label: "SIGNAL", value: "NOMINAL" },
];

// ─── Atmospheric depth rings (SVG) ────────────────────────────────────────────
function AtmosphericRings() {
  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center z-[2]"
      aria-hidden="true"
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 900 900"
        preserveAspectRatio="xMidYMid meet"
        style={{ position: "absolute", overflow: "visible" }}
      >
        {/* Elliptical orbit arcs */}
        {[320, 400, 490, 590].map((r, i) => (
          <ellipse
            key={i}
            cx="450"
            cy="450"
            rx={r}
            ry={r * 0.28}
            fill="none"
            stroke="rgba(0,170,255,0.04)"
            strokeWidth="0.5"
          />
        ))}

        {/* Animated orbital dot */}
        <motion.circle
          r="3"
          fill="rgba(0,170,255,0.55)"
          style={{ filter: "blur(0.5px)" }}
          initial={{ offsetDistance: "0%" }}
          animate={{ offsetDistance: "100%" }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <animateMotion
            dur="18s"
            repeatCount="indefinite"
            path="M 130 450 A 320 89.6 0 1 1 130.001 450"
          />
        </motion.circle>

        {/* Second orbital dot — offset phase */}
        <motion.circle r="2" fill="rgba(0,170,255,0.3)">
          <animateMotion
            dur="18s"
            begin="-9s"
            repeatCount="indefinite"
            path="M 130 450 A 320 89.6 0 1 1 130.001 450"
          />
        </motion.circle>

        {/* Cardinal crosshair lines — subtle */}
        <line x1="450" y1="50" x2="450" y2="850" stroke="rgba(0,170,255,0.02)" strokeWidth="0.5" />
        <line x1="50" y1="450" x2="850" y2="450" stroke="rgba(0,170,255,0.02)" strokeWidth="0.5" />

        {/* Tick marks at cardinal points */}
        {[0, 90, 180, 270].map((angle) => {
          const r = 320;
          const rad = (angle * Math.PI) / 180;
          const cx = 450 + r * Math.cos(rad);
          const cy = 450 + r * 0.28 * Math.sin(rad);
          return (
            <g key={angle}>
              <circle cx={cx} cy={cy} r="2" fill="rgba(0,170,255,0.25)" />
              <circle cx={cx} cy={cy} r="6" fill="none" stroke="rgba(0,170,255,0.12)" strokeWidth="0.5" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Scanline substrate ────────────────────────────────────────────────────────
function ScanlineSubstrate() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[1]"
      aria-hidden="true"
      style={{
        backgroundImage: `
          repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,170,255,0.012) 3px, rgba(0,170,255,0.012) 4px)
        `,
      }}
    />
  );
}

// ─── HUD strip ────────────────────────────────────────────────────────────────
function HUDStrip({
  items,
  position,
}: {
  items: { label: string; value: string }[];
  position: "top" | "bottom";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: position === "top" ? -8 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.9, ease: EASE }}
      className={`absolute ${position === "top" ? "top-0" : "bottom-0"} left-0 right-0 z-10 flex items-center justify-between px-6 py-3 md:px-12`}
      style={{
        borderBottom: position === "top" ? "0.5px solid rgba(0,170,255,0.06)" : undefined,
        borderTop: position === "bottom" ? "0.5px solid rgba(0,170,255,0.06)" : undefined,
        background:
          position === "top"
            ? "linear-gradient(to bottom, rgba(10,10,26,0.85) 0%, transparent 100%)"
            : "linear-gradient(to top, rgba(10,10,26,0.85) 0%, transparent 100%)",
      }}
    >
      {items.map(({ label, value }) => (
        <div key={label} className="flex items-center gap-2">
          <span
            className="font-mono text-[7px] uppercase tracking-[0.22em]"
            style={{ color: "rgba(0,170,255,0.3)" }}
          >
            {label}
          </span>
          <span
            className="font-mono text-[8px] uppercase tracking-[0.14em] tabular-nums"
            style={{ color: "rgba(0,170,255,0.65)" }}
          >
            {value}
          </span>
        </div>
      ))}
    </motion.div>
  );
}

// ─── Globe fallback ────────────────────────────────────────────────────────────
function GlobeFallback() {
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
        INITIALISING CHAMBER…
      </span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function OrbitalChamberPage() {
  useEffect(() => {
    document.title = "Orbital Chamber — Eternal Nexus OS";
    return () => {
      document.title = "Eternal Nexus OS";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ background: "#0a0a1a" }}
    >
      {/* ── Substrate layers ──────────────────────────────────────────── */}
      <ScanlineSubstrate />

      {/* ── Real 3D Globe (from GLOBE-3D-001) ────────────────────────── */}
      <OrganErrorBoundary organName="OrbitalGlobe" silent>
        <Suspense fallback={<GlobeFallback />}>
          <div className="absolute inset-0 z-0">
            <GlobeCanvas />
          </div>
        </Suspense>
      </OrganErrorBoundary>

      {/* ── Depth vignette ────────────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0 z-[3]"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(10,10,26,0.55) 100%)",
        }}
      />

      {/* ── Atmospheric orbital rings ─────────────────────────────────── */}
      <AtmosphericRings />

      {/* ── HUD strips ───────────────────────────────────────────────── */}
      <HUDStrip items={TELEMETRY_TOP} position="top" />

      {/* ── Nav pill — back link ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.7, ease: EASE }}
        className="absolute top-12 left-6 md:left-12 z-10"
      >
        <Link
          to="/globe"
          className="flex items-center gap-2 transition-opacity duration-200 hover:opacity-70"
          style={{ color: "rgba(0,170,255,0.5)" }}
        >
          <span className="font-mono text-[0.48rem] tracking-[0.22em] uppercase">
            ← Globe View
          </span>
        </Link>
      </motion.div>

      {/* ── Center label ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1.2, ease: EASE }}
        className="absolute top-1/2 left-1/2 z-[4] pointer-events-none"
        style={{ transform: "translate(-50%, -50%)", marginTop: "-45vh" }}
      >
        <span
          className="font-mono text-[9px] tracking-[0.45em] uppercase block text-center"
          style={{ color: "rgba(0,170,255,0.18)" }}
        >
          ORBITAL · CHAMBER · I
        </span>
      </motion.div>

      {/* ── Bottom telemetry + title ──────────────────────────────────── */}
      <HUDStrip items={TELEMETRY_BOTTOM} position="bottom" />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 1.1, ease: EASE }}
        className="absolute bottom-12 left-0 right-0 z-10 flex flex-col items-center gap-2 pointer-events-none"
      >
        <h1
          className="font-serif font-light italic"
          style={{
            fontSize: "clamp(16px, 2vw, 26px)",
            color: "rgba(200,230,255,0.55)",
            letterSpacing: "0.07em",
          }}
        >
          Planetary Observation Station
        </h1>
        <motion.div
          animate={{ scaleX: [0.6, 1.1, 0.6], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: "40px",
            height: "1px",
            background: "#00aaff",
            borderRadius: "1px",
          }}
        />
      </motion.div>
    </div>
  );
}
