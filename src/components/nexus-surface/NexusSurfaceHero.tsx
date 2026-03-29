/**
 * NexusSurfaceHero.tsx
 * Heaven Lab face — primary hero section, first fold.
 *
 * Anatomy (top → bottom):
 *   1. Globe slot     — absolute bg layer, reserved for 3D component
 *   2. Headline       — H1 large, dark + light contrast
 *   3. Sub-headline   — single descriptor line
 *   4. CTA primary    — "Start Exploring"
 *   5. Scroll hint    — micro indicator
 *
 * Rules:
 *   - Dark theme: #0a0a1a base
 *   - Mobile-first: 375px → 390px → md → lg
 *   - Syne for headings / body, Cormorant italic accent, JetBrains Mono labels
 *   - Framer Motion: fade-in + slide-up entry, staggered per element
 *   - Globe slot: pointer-events-none, absolute positioned behind content
 *
 * Canon: NS-1-001 · K-04 SURFACE · K-05 TYPOGRAPHY · K-06 COMPONENT
 */

import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, FlaskConical } from "lucide-react";
import OrganErrorBoundary from "@/components/shared/OrganErrorBoundary";

// Globe slot — wired to InteractiveGlobe (sovereign line)
// GlobeBackground was archived (SUPERSEDED) — replaced by InteractiveGlobe
const GlobeBackground = lazy(() => import("@/components/globe/InteractiveGlobe"));

const EASE = [0.22, 1, 0.36, 1] as const;

// Stagger config for hero elements
const STAGGER_CHILDREN = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.3,
    },
  },
};

const SLIDE_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: EASE },
  },
};

const FADE_IN = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.9, ease: EASE },
  },
};

// ─── Atmospheric background layers ───────────────────────────────────────────
function AtmosphericBg() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0"
      aria-hidden="true"
    >
      {/* Base gradient — deeper at top, lifts to mid */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #0a0a1a 0%, #0d0e20 40%, #0a0a1a 100%)",
        }}
      />

      {/* Gold warmth — upper right, very faint */}
      <div
        className="absolute"
        style={{
          top: "-10%",
          right: "-5%",
          width: "70vw",
          height: "70vw",
          background:
            "radial-gradient(ellipse at center, hsl(42 78% 45% / 0.05) 0%, transparent 55%)",
          filter: "blur(80px)",
        }}
      />

      {/* Teal depth — lower left */}
      <div
        className="absolute"
        style={{
          bottom: "10%",
          left: "-10%",
          width: "60vw",
          height: "60vw",
          background:
            "radial-gradient(ellipse at center, hsl(172 55% 28% / 0.04) 0%, transparent 55%)",
          filter: "blur(100px)",
        }}
      />

      {/* Grid substrate — ultra-subtle, desktop only */}
      <div
        className="hidden md:block absolute inset-0"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 63px, rgba(255,255,255,0.015) 63px, rgba(255,255,255,0.015) 64px),
            repeating-linear-gradient(90deg, transparent, transparent 63px, rgba(255,255,255,0.015) 63px, rgba(255,255,255,0.015) 64px)
          `,
        }}
      />
    </div>
  );
}

// ─── Globe slot — the 3D presence lives here ─────────────────────────────────
function GlobeSlot() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[1]"
      aria-hidden="true"
      aria-label="Globe 3D slot — reserved for interactive globe component"
      role="presentation"
    >
      {/* Concentric atmospheric rings — behind globe */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          style={{
            width: "clamp(260px, 48vw, 580px)",
            height: "clamp(260px, 48vw, 580px)",
            borderRadius: "50%",
            border: "0.5px solid rgba(200,164,78,0.04)",
            position: "absolute",
          }}
        />
        <div
          style={{
            width: "clamp(340px, 66vw, 780px)",
            height: "clamp(340px, 66vw, 780px)",
            borderRadius: "50%",
            border: "0.5px solid rgba(200,164,78,0.022)",
            position: "absolute",
          }}
        />
        <div
          style={{
            width: "clamp(420px, 84vw, 980px)",
            height: "clamp(420px, 84vw, 980px)",
            borderRadius: "50%",
            border: "0.5px solid rgba(200,164,78,0.012)",
            position: "absolute",
          }}
        />
      </div>

      {/* Actual globe render — error-bounded, lazily loaded */}
      <OrganErrorBoundary organName="HeroGlobe" silent>
        <Suspense fallback={null}>
          <GlobeBackground />
        </Suspense>
      </OrganErrorBoundary>

      {/* Bottom fade — blends globe into content below */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "50%",
          background:
            "linear-gradient(to bottom, transparent 0%, #0a0a1a 100%)",
        }}
      />

      {/* Side vignettes — frame the sphere */}
      <div
        className="absolute inset-y-0 left-0"
        style={{
          width: "12%",
          background: "linear-gradient(to right, #0a0a1a, transparent)",
        }}
      />
      <div
        className="absolute inset-y-0 right-0"
        style={{
          width: "12%",
          background: "linear-gradient(to left, #0a0a1a, transparent)",
        }}
      />
    </div>
  );
}

// ─── Status micro-label ───────────────────────────────────────────────────────
function StatusLabel() {
  return (
    <motion.div
      variants={FADE_IN}
      className="flex items-center gap-2"
      aria-label="Platform status: live"
    >
      <motion.span
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        style={{
          display: "inline-block",
          width: "5px",
          height: "5px",
          borderRadius: "50%",
          background: "hsl(172 48% 52%)",
          flexShrink: 0,
        }}
      />
      <span
        className="font-mono"
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "9px",
          letterSpacing: "0.28em",
          color: "rgba(228,235,240,0.3)",
          textTransform: "uppercase",
        }}
      >
        Nexus Lab · Live · 2026
      </span>
    </motion.div>
  );
}

// ─── Main headline ────────────────────────────────────────────────────────────
function HeroHeadline() {
  return (
    <motion.h1
      variants={SLIDE_UP}
      className="font-sans font-[700] leading-[1.08] tracking-tight text-left"
      style={{
        fontFamily: "Syne, system-ui, sans-serif",
        fontSize: "clamp(40px, 9vw, 88px)",
        color: "rgba(228, 235, 240, 0.93)",
        maxWidth: "820px",
      }}
    >
      The Living{" "}
      <span
        style={{
          background:
            "linear-gradient(90deg, hsl(42 78% 52%), hsl(172 48% 52%))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        Research
      </span>
      <br />
      Platform.
    </motion.h1>
  );
}

// ─── Sub-headline ─────────────────────────────────────────────────────────────
function HeroSubline() {
  return (
    <motion.p
      variants={SLIDE_UP}
      className="font-sans font-[400] leading-relaxed"
      style={{
        fontFamily: "Syne, system-ui, sans-serif",
        fontSize: "clamp(14px, 2.2vw, 17px)",
        color: "rgba(228,235,240,0.44)",
        maxWidth: "520px",
        letterSpacing: "0.02em",
      }}
    >
      Investigate the world, model what comes next, and build systems
      that act at planetary scale — from a single unified lab.
    </motion.p>
  );
}

// ─── CTA group ────────────────────────────────────────────────────────────────
function HeroCTAs() {
  return (
    <motion.div
      variants={SLIDE_UP}
      className="flex flex-wrap items-center gap-4"
    >
      {/* Primary CTA */}
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Link
          to="/lab"
          className="inline-flex items-center gap-2 font-sans font-[600] transition-all duration-200"
          style={{
            fontFamily: "Syne, system-ui, sans-serif",
            fontSize: "12px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "hsl(216 50% 5%)",
            background: "hsl(42 78% 52%)",
            padding: "14px 28px",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background =
              "hsl(42 78% 62%)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background =
              "hsl(42 78% 52%)";
          }}
          aria-label="Start exploring the Lab"
        >
          <FlaskConical className="w-3.5 h-3.5 flex-shrink-0" />
          Start Exploring
        </Link>
      </motion.div>

      {/* Secondary / ghost CTA */}
      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 font-sans font-[400] transition-all duration-200"
          style={{
            fontFamily: "Syne, system-ui, sans-serif",
            fontSize: "12px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(228,235,240,0.45)",
            border: "0.5px solid rgba(255,255,255,0.1)",
            padding: "14px 28px",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color =
              "rgba(228,235,240,0.78)";
            (e.currentTarget as HTMLElement).style.borderColor =
              "rgba(255,255,255,0.22)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color =
              "rgba(228,235,240,0.45)";
            (e.currentTarget as HTMLElement).style.borderColor =
              "rgba(255,255,255,0.1)";
          }}
          aria-label="View all projects"
        >
          View Projects
          <ArrowRight className="w-3 h-3" />
        </Link>
      </motion.div>
    </motion.div>
  );
}

// ─── Scroll hint ─────────────────────────────────────────────────────────────
function ScrollHint() {
  return (
    <motion.div
      variants={FADE_IN}
      className="flex items-center gap-2 mt-16 md:mt-20"
      aria-hidden="true"
    >
      <motion.div
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: "0.5px",
          height: "32px",
          background:
            "linear-gradient(to bottom, rgba(200,164,78,0.5), transparent)",
          flexShrink: 0,
        }}
      />
      <span
        className="font-mono"
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "8px",
          letterSpacing: "0.24em",
          color: "rgba(228,235,240,0.2)",
          textTransform: "uppercase",
          writingMode: "vertical-rl",
        }}
      >
        Scroll
      </span>
    </motion.div>
  );
}

// ─── Institutional micro-label top bar ───────────────────────────────────────
function TopBar() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 1.4 }}
      className="absolute top-0 left-0 right-0 z-[3] flex items-center justify-between px-5 md:px-10 pt-16 pb-3"
      style={{ borderBottom: "0.5px solid rgba(200,164,78,0.04)" }}
    >
      <span
        className="font-mono hidden sm:block"
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "8px",
          letterSpacing: "0.28em",
          color: "rgba(200,164,78,0.28)",
          textTransform: "uppercase",
        }}
      >
        ETERNAL NEXUS OS · Heaven Lab Interface
      </span>

      <motion.span
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="flex items-center gap-1.5 font-mono"
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "8px",
          letterSpacing: "0.2em",
          color: "rgba(228,235,240,0.18)",
          textTransform: "uppercase",
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: "4px",
            height: "4px",
            borderRadius: "50%",
            background: "hsl(172 48% 52%)",
          }}
        />
        LIVE · NS-1-001
      </motion.span>
    </motion.div>
  );
}

// ─── NexusSurfaceHero ─────────────────────────────────────────────────────────
export default function NexusSurfaceHero() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        minHeight: "100svh",
        background: "#0a0a1a",
      }}
      aria-label="Heaven Lab — The Living Research Platform"
      role="banner"
    >
      {/* ── Layers ── */}
      <AtmosphericBg />
      <GlobeSlot />
      <TopBar />

      {/* ── Content stack — sits above globe ── */}
      <motion.div
        variants={STAGGER_CHILDREN}
        initial="hidden"
        animate="visible"
        className="relative z-[10] flex flex-col justify-end px-5 md:px-10 lg:px-16"
        style={{
          minHeight: "100svh",
          paddingTop: "80px",
          paddingBottom: "clamp(48px, 8vh, 96px)",
        }}
      >
        <div className="flex flex-col gap-6 max-w-[860px]">
          <StatusLabel />
          <HeroHeadline />
          <HeroSubline />
          <HeroCTAs />
          <ScrollHint />
        </div>
      </motion.div>

      {/* Bottom edge fade to rest of page */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-[15]"
        style={{
          height: "120px",
          background:
            "linear-gradient(to bottom, transparent 0%, #0a0a1a 100%)",
        }}
        aria-hidden="true"
      />
    </section>
  );
}
