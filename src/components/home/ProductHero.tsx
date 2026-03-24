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
 */

import { lazy, Suspense, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import OrganErrorBoundary from "@/components/shared/OrganErrorBoundary";
import TrinityRow from "./TrinityRow";
import HeroFirstProof from "./HeroFirstProof";

const InteractiveGlobe = lazy(() => import("@/components/globe/InteractiveGlobe"));

const EASE = [0.22, 1, 0.36, 1] as const;

// Subtle atmospheric orbs — subordinate to globe, never competing
function AtmosphericLayer() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden="true">
      {/* Gold warmth — top right */}
      <div
        className="absolute"
        style={{
          top: "5%",
          right: "-5%",
          width: "55vw",
          height: "55vw",
          background:
            "radial-gradient(ellipse at center, hsl(42 78% 45% / 0.04) 0%, transparent 60%)",
          filter: "blur(56px)",
        }}
      />
      {/* Teal depth — bottom left */}
      <div
        className="absolute"
        style={{
          bottom: "10%",
          left: "-8%",
          width: "48vw",
          height: "48vw",
          background:
            "radial-gradient(ellipse at center, hsl(172 55% 28% / 0.035) 0%, transparent 58%)",
          filter: "blur(64px)",
        }}
      />
    </div>
  );
}

// Technical grid substrate — at opacity 0.04, never competes
function MachineSubstrate() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 hidden md:block"
      aria-hidden="true"
      style={{
        backgroundImage: `
          repeating-linear-gradient(0deg, transparent, transparent 47px, rgba(255,255,255,0.025) 47px, rgba(255,255,255,0.025) 48px),
          repeating-linear-gradient(90deg, transparent, transparent 47px, rgba(255,255,255,0.025) 47px, rgba(255,255,255,0.025) 48px)
        `,
      }}
    />
  );
}

// Globe presence — primary zone, large, centered
function GlobeZone({ onHotspotClick }: { onHotspotClick?: (id: string) => void }) {
  return (
    <div
      className="relative w-full"
      style={{
        // 68vw capped at 780px: large enough to feel unmistakably primary
        height: "clamp(480px, 68vw, 780px)",
      }}
    >
      {/* Radial overlay — controls text legibility below without killing globe depth */}
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, hsl(216 50% 5% / 0.55) 75%, hsl(216 50% 5%) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Globe render */}
      <div className="absolute inset-0 z-[1]">
        <OrganErrorBoundary organName="Globe" silent>
          <Suspense
            fallback={
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="h-64 w-64 rounded-full opacity-20"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, hsl(172 55% 28% / 0.6) 0%, hsl(216 50% 5%) 70%)",
                  }}
                />
              </div>
            }
          >
            <InteractiveGlobe onHotspotClick={onHotspotClick} />
          </Suspense>
        </OrganErrorBoundary>
      </div>

      {/* Institutional micro-label — very top, reads as authority stamp, not CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 1.2 }}
        className="absolute top-0 left-0 right-0 z-[3] flex items-center justify-between px-6 py-3 md:px-14"
      >
        <span className="font-mono text-[9px] tracking-[0.24em] text-paper-dim/40 uppercase">
          Heaven Lab · Observatory Node-01
        </span>
        <span className="hidden sm:block font-mono text-[9px] tracking-[0.18em] text-paper-dim/30 uppercase">
          2026 · Active
        </span>
      </motion.div>

      {/* Globe anchor label — center bottom, transitions reader to trinity */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.9, ease: EASE }}
        className="absolute bottom-6 left-0 right-0 z-[3] flex justify-center"
      >
        <span
          className="font-sans text-[10px] font-[400] tracking-[0.22em] text-paper-dim/40 uppercase"
          style={{ fontFamily: "Syne, system-ui, sans-serif" }}
        >
          O sistema e os seus filhos
        </span>
      </motion.div>
    </div>
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
  // Subtle parallax: section fades as user scrolls away from hero
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <motion.section
      ref={sectionRef}
      style={{ opacity: sectionOpacity, background: "#060c14" }}
      className="relative w-full overflow-hidden"
      aria-label="Heaven Lab — sistema e filhos"
      role="banner"
    >
      <MachineSubstrate />
      <AtmosphericLayer />

      {/* ── 1. GLOBE ZONE ─────────────────────────────────────────── */}
      <GlobeZone onHotspotClick={onHotspotClick} />

      {/* ── 2. TRINITY ROW ────────────────────────────────────────── */}
      {/* Sits directly under the globe with generous negative space */}
      <div className="relative z-10 px-4 sm:px-6 md:px-12 lg:px-20 pb-0 pt-6">
        <TrinityRow />
      </div>

      {/* ── 3. FIRST PROOF ────────────────────────────────────────── */}
      <div className="relative z-10 px-4 sm:px-6 md:px-12 lg:px-20 pt-20 pb-28">
        <HeroFirstProof />
      </div>

      {/* Gradient fade to rest of page */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-32"
        style={{
          background:
            "linear-gradient(to bottom, transparent, hsl(216 50% 5% / 0.6) 60%, hsl(216 50% 5%) 100%)",
        }}
        aria-hidden="true"
      />
    </motion.section>
  );
}
