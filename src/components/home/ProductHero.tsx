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
      style={{
        // Globe dominates — 80vw on mid screens, caps at 900px
        height: "clamp(540px, 80vw, 900px)",
      }}
    >
      {/* Bottom fade — smooth transition to trinity below */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-[2]"
        style={{
          height: "42%",
          background:
            "linear-gradient(to bottom, transparent 0%, hsl(216 50% 5% / 0.3) 50%, hsl(216 50% 5% / 0.72) 78%, hsl(216 50% 5%) 100%)",
        }}
        aria-hidden="true"
      />
      {/* Edge vignette — left/right, lets globe breathe without bleeding */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-[2]"
        style={{
          width: "12%",
          background: "linear-gradient(to right, hsl(216 50% 5%) 0%, transparent 100%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-[2]"
        style={{
          width: "12%",
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
        style={{ borderColor: "rgba(200,164,78,0.06)" }}
      >
        <span className="font-mono text-[9px] tracking-[0.28em] uppercase" style={{ color: "rgba(200,164,78,0.38)" }}>
          Heaven Lab · Observatory Node-01
        </span>
        <span className="hidden sm:flex items-center gap-2 font-mono text-[9px] tracking-[0.2em] uppercase" style={{ color: "rgba(228,235,240,0.2)" }}>
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
          2026 · Active
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

  const isResume = session.is_resume && !!session.re_entry_point;
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

      {/* ── 2. TRINITY ROW ────────────────────────────────────────── */}
      <div className="relative z-10 px-4 sm:px-6 md:px-12 lg:px-20 pb-0 pt-8">
        <TrinityRowWithSession />
      </div>

      {/* ── 3. FIRST PROOF ────────────────────────────────────────── */}
      <div className="relative z-10 px-4 sm:px-6 md:px-12 lg:px-20 pt-24 pb-32">
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
