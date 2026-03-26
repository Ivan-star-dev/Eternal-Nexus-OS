/**
 * ProductHero.tsx
 * Canonical hero anatomy for the PRODUCT FACE.
 *
 * Read order locked by HEAVEN_LAB_REFERENCE_SURFACE.md:
 *   1. Globe      — primary planetary presence
 *   2. Trinity    — three named children, horizontal
 *   3. First Proof — first evidence strip, restrained
 *
 * Law: SYSTEM_FACE_CANON.md · TYPOGRAPHY_LAW.md · BRAND_MOTHER_SYSTEM.md
 * Session touch: SESSION-AWARE-PRODUCT-INTEGRATION-001 — no new system, surface reads alive
 */

import { lazy, Suspense, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import OrganErrorBoundary from "@/components/shared/OrganErrorBoundary";
import { useSession } from "@/contexts/SessionContext";
import TrinityRow from "./TrinityRow";
import HeroFirstProof from "./HeroFirstProof";

const InteractiveGlobe = lazy(() => import("@/components/globe/InteractiveGlobe"));

const EASE = [0.22, 1, 0.36, 1] as const;

// Subtle atmospheric orbs — subordinate to globe, never competing
function AtmosphericLayer() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden="true">
      {/* Gold warmth — top right, very faint */}
      <div
        className="absolute"
        style={{
          top: "0%",
          right: "-5%",
          width: "60vw",
          height: "60vw",
          background:
            "radial-gradient(ellipse at center, hsl(42 78% 45% / 0.055) 0%, transparent 58%)",
          filter: "blur(72px)",
        }}
      />
      {/* Teal depth — bottom left */}
      <div
        className="absolute"
        style={{
          bottom: "5%",
          left: "-8%",
          width: "52vw",
          height: "52vw",
          background:
            "radial-gradient(ellipse at center, hsl(172 55% 28% / 0.04) 0%, transparent 56%)",
          filter: "blur(80px)",
        }}
      />
    </div>
  );
}

// Technical grid substrate — at ultra-low opacity, never competes
function MachineSubstrate() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 hidden md:block"
      aria-hidden="true"
      style={{
        backgroundImage: `
          repeating-linear-gradient(0deg, transparent, transparent 63px, rgba(255,255,255,0.018) 63px, rgba(255,255,255,0.018) 64px),
          repeating-linear-gradient(90deg, transparent, transparent 63px, rgba(255,255,255,0.018) 63px, rgba(255,255,255,0.018) 64px)
        `,
      }}
    />
  );
}

// Globe presence — primary zone, dominates
function GlobeZone({ onHotspotClick }: { onHotspotClick?: (id: string) => void }) {
  return (
    <div
      className="relative w-full"
      style={{ height: "clamp(640px, 82vw, 920px)" }}
    >
      {/* Atmospheric concentric rings — behind globe, barely visible */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center" aria-hidden="true">
        <div style={{
          width: "clamp(380px, 52vw, 700px)",
          height: "clamp(380px, 52vw, 700px)",
          borderRadius: "50%",
          border: "0.5px solid rgba(200,164,78,0.04)",
          position: "absolute",
        }} />
        <div style={{
          width: "clamp(480px, 66vw, 880px)",
          height: "clamp(480px, 66vw, 880px)",
          borderRadius: "50%",
          border: "0.5px solid rgba(200,164,78,0.025)",
          position: "absolute",
        }} />
      </div>

      {/* Bottom fade — deeper spatial transition */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-[2]"
        style={{
          height: "60%",
          background:
            "linear-gradient(to bottom, transparent 0%, hsl(216 50% 5% / 0.2) 35%, hsl(216 50% 5% / 0.65) 68%, hsl(216 50% 5%) 100%)",
        }}
        aria-hidden="true"
      />
      {/* Edge vignette — wider for deeper immersion */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-[2]"
        style={{
          width: "18%",
          background: "linear-gradient(to right, hsl(216 50% 5%) 0%, transparent 100%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-[2]"
        style={{
          width: "18%",
          background: "linear-gradient(to left, hsl(216 50% 5%) 0%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* Globe render */}
      <div className="absolute inset-0 z-[1]">
        <OrganErrorBoundary organName="Globe" silent>
          <Suspense
            fallback={
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.04, 1], opacity: [0.14, 0.22, 0.14] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    width: "clamp(300px, 42vw, 560px)",
                    height: "clamp(300px, 42vw, 560px)",
                    borderRadius: "50%",
                    background:
                      "radial-gradient(ellipse at 40% 38%, hsl(42 78% 45% / 0.1) 0%, hsl(172 55% 28% / 0.15) 42%, transparent 72%)",
                    border: "0.5px solid rgba(200,164,78,0.1)",
                  }}
                />
              </div>
            }
          >
            <InteractiveGlobe onHotspotClick={onHotspotClick} />
          </Suspense>
        </OrganErrorBoundary>
      </div>

      {/* Institutional micro-label — authority stamp, top bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1.6 }}
        className="absolute top-0 left-0 right-0 z-[3] flex items-center justify-between px-6 py-4 md:px-14 border-b"
        style={{ borderColor: "rgba(200,164,78,0.05)" }}
      >
        <span className="font-mono text-[9px] tracking-[0.28em] uppercase" style={{ color: "rgba(200,164,78,0.32)" }}>
          ETERNAL NEXUS OS · Planetary Interface
        </span>
        <span className="hidden sm:flex items-center gap-2 font-mono text-[9px] tracking-[0.2em] uppercase" style={{ color: "rgba(228,235,240,0.18)" }}>
          <motion.span
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: "hsl(172 48% 52%)",
            }}
          />
          LIVE · 2026
        </span>
      </motion.div>

      {/* Globe anchor label — center bottom, transitions reader to trinity */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.0, duration: 1.2, ease: EASE }}
        className="absolute bottom-12 left-0 right-0 z-[3] flex flex-col items-center gap-3"
      >
        <motion.div
          animate={{ opacity: [0.25, 0.55, 0.25], scaleX: [0.8, 1.1, 0.8] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: "36px",
            height: "0.5px",
            background: "rgba(200,164,78,0.55)",
          }}
        />
        <span
          className="font-sans text-[10px] font-[400] tracking-[0.3em] uppercase"
          style={{ fontFamily: "Syne, system-ui, sans-serif", color: "rgba(228,235,240,0.3)" }}
        >
          O sistema e os seus filhos
        </span>
      </motion.div>
    </div>
  );
}

// Sovereign text block — between globe and trinity
function SovereignText() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 1.1, ease: EASE }}
      className="relative z-10 flex flex-col items-center text-center px-6 pt-4 pb-16"
    >
      {/* Headline */}
      <h1
        className="font-serif font-[300] italic leading-[1.15] mb-5"
        style={{
          fontFamily: "Cormorant Garamond, Georgia, serif",
          fontSize: "clamp(32px, 4.5vw, 58px)",
          color: "rgba(228,235,240,0.88)",
          maxWidth: "820px",
        }}
      >
        The world, studied.{" "}
        <span style={{ color: "rgba(200,164,78,0.75)" }}>The future, built.</span>
      </h1>

      {/* Sub-line */}
      <p
        className="font-sans font-[400] mb-10"
        style={{
          fontFamily: "Syne, system-ui, sans-serif",
          fontSize: "11px",
          letterSpacing: "0.18em",
          color: "rgba(228,235,240,0.38)",
          maxWidth: "560px",
          lineHeight: "1.8",
          textTransform: "uppercase",
        }}
      >
        A sovereign operating system for perceiving, investigating, and creating at planetary scale.
      </p>

      {/* CTAs */}
      <div className="flex items-center gap-4 flex-wrap justify-center">
        <Link
          to="/access"
          className="font-sans font-[500] transition-colors duration-200"
          style={{
            fontFamily: "Syne, system-ui, sans-serif",
            fontSize: "10px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "hsl(36 65% 50%)",
            border: "1px solid hsl(36 65% 38% / 0.5)",
            padding: "13px 28px",
            borderRadius: 0,
            display: "inline-block",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = "hsl(36 65% 38% / 0.1)";
            (e.currentTarget as HTMLElement).style.borderColor = "hsl(36 65% 50% / 0.7)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.borderColor = "hsl(36 65% 38% / 0.5)";
          }}
        >
          Enter the System
        </Link>
        <Link
          to="/projects"
          className="font-sans font-[400] transition-colors duration-200"
          style={{
            fontFamily: "Syne, system-ui, sans-serif",
            fontSize: "10px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(228,235,240,0.35)",
            padding: "13px 28px",
            borderRadius: 0,
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.color = "rgba(228,235,240,0.75)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.color = "rgba(228,235,240,0.35)";
          }}
        >
          Explore Projects
        </Link>
      </div>
    </motion.div>
  );
}

// Connects TrinityRow to active session face — no new UI, just real state
function TrinityRowWithSession() {
  const { session } = useSession();
  return <TrinityRow activeFace={session?.active_face ?? null} />;
}

// Session-aware live indicator — uses existing session state.
// On hover: reveals next_expected_step (one line, truncated) — real continuity signal.
function SessionPulse() {
  const { session } = useSession();
  const [hovered, setHovered] = useState(false);

  if (!session) return null;

  // Only signal "Retomar" for real Nexus sessions, not project tab residue
  const isResume = session.is_resume && !!session.re_entry_point?.startsWith('resume-swarm:');
  const nextStep =
    typeof session.next_expected_step === "string" ? session.next_expected_step : "";
  // Truncate to ~52 chars for the hover strip
  const stepDisplay = nextStep.length > 52 ? nextStep.slice(0, 52) + "…" : nextStep;

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.2, duration: 0.9, ease: EASE }}
      className="absolute right-6 md:right-14 z-[4]"
      style={{ top: "calc(100% - 52px)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={0}
      aria-label={isResume ? "Sessão retomada" : "Sessão activa"}
      aria-expanded={hovered && !!stepDisplay}
    >
      <motion.div
        animate={{ width: hovered && stepDisplay ? "auto" : "auto" }}
        className="flex flex-col gap-1"
        style={{
          background: "rgba(6,12,20,0.78)",
          border: `0.5px solid ${isResume ? "rgba(200,164,78,0.2)" : "rgba(32,153,120,0.2)"}`,
          backdropFilter: "blur(14px)",
          padding: "6px 10px",
        }}
      >
        {/* Status row */}
        <div className="flex items-center gap-2">
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              flexShrink: 0,
              background: isResume ? "hsl(42 78% 52%)" : "hsl(172 48% 52%)",
            }}
          />
          <span
            className="font-mono text-[8px] uppercase tracking-[0.18em] whitespace-nowrap"
            style={{ color: isResume ? "rgba(200,164,78,0.65)" : "rgba(32,153,120,0.9)" }}
          >
            {isResume ? "Retomar" : "Sessão live"}
          </span>
        </div>

        {/* Next step — only on hover, only when available */}
        <AnimatePresence>
          {hovered && stepDisplay && (
            <motion.span
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: EASE }}
              className="font-mono text-[8px] leading-[1.5] overflow-hidden"
              style={{
                color: "rgba(228,235,240,0.38)",
                maxWidth: "220px",
                letterSpacing: "0.06em",
                display: "block",
              }}
            >
              {stepDisplay}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

interface ProductHeroProps {
  onHotspotClick?: (id: string) => void;
}

export default function ProductHero({ onHotspotClick }: ProductHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  // Elegant parallax: fades as user scrolls — slow, sovereign
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);
  const sectionY = useTransform(scrollYProgress, [0, 1], [0, 40]);

  return (
    <motion.section
      ref={sectionRef}
      style={{ opacity: sectionOpacity, y: sectionY, background: "#060c14" }}
      className="relative w-full overflow-hidden"
      aria-label="Heaven Lab — sistema e filhos"
      role="banner"
    >
      <MachineSubstrate />
      <AtmosphericLayer />

      {/* ── 1. GLOBE ZONE ─────────────────────────────────────────── */}
      <div className="relative">
        <GlobeZone onHotspotClick={onHotspotClick} />
        <SessionPulse />
      </div>

      {/* ── 2. SOVEREIGN TEXT + CTAs ─────────────────────────────── */}
      <SovereignText />

      {/* ── 3. TRINITY ROW ────────────────────────────────────────── */}
      <div className="relative z-10 px-4 sm:px-6 md:px-12 lg:px-20 pb-0 pt-0">
        <TrinityRowWithSession />
      </div>

      {/* ── 4. FIRST PROOF ────────────────────────────────────────── */}
      <div className="relative z-10 px-4 sm:px-6 md:px-12 lg:px-20 pt-16 pb-32">
        <HeroFirstProof />
      </div>

      {/* Gradient fade to rest of page */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-40"
        style={{
          background:
            "linear-gradient(to bottom, transparent, hsl(216 50% 5% / 0.5) 55%, hsl(216 50% 5%) 100%)",
        }}
        aria-hidden="true"
      />
    </motion.section>
  );
}
