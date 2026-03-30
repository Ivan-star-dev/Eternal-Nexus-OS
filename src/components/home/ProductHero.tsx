/**
 * ProductHero.tsx
 * Flagship sovereign entrance for homepage.
 * One dominant chamber: mythic scale, editorial hierarchy, mobile-first impact.
 */

import { lazy, Suspense, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import OrganErrorBoundary from "@/components/shared/OrganErrorBoundary";
import { useSession } from "@/contexts/SessionContext";
import TrinityRow from "./TrinityRow";
import HeroFirstProof from "./HeroFirstProof";

const InteractiveGlobe = lazy(() => import("@/components/globe/InteractiveGlobe"));
const EASE = [0.22, 1, 0.36, 1] as const;

function AtmosphereField() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden="true">
      <div
        className="absolute -top-[20%] left-1/2 -translate-x-1/2"
        style={{
          width: "min(110vw, 1400px)",
          height: "min(110vw, 1400px)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at center, hsl(42 78% 52% / 0.14) 0%, hsl(205 100% 52% / 0.08) 24%, hsl(172 55% 36% / 0.1) 48%, transparent 74%)",
          filter: "blur(72px)",
        }}
      />
      <div
        className="absolute -bottom-[28%] left-1/2 -translate-x-1/2"
        style={{
          width: "min(140vw, 1700px)",
          height: "min(92vw, 980px)",
          background:
            "radial-gradient(ellipse at center, hsl(205 100% 52% / 0.1) 0%, hsl(172 55% 36% / 0.07) 35%, transparent 72%)",
          filter: "blur(95px)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, hsl(var(--background) / 0.2) 0%, transparent 24%, transparent 62%, hsl(var(--background) / 0.86) 100%)",
        }}
      />
    </div>
  );
}

function MachineSubstrate() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 hidden md:block"
      aria-hidden="true"
      style={{
        backgroundImage: `
          repeating-linear-gradient(0deg, transparent, transparent 79px, var(--rx-substrate-line) 79px, var(--rx-substrate-line) 80px),
          repeating-linear-gradient(90deg, transparent, transparent 79px, var(--rx-substrate-line) 79px, var(--rx-substrate-line) 80px)
        `,
      }}
    />
  );
}

function SessionSigil() {
  const { session } = useSession();
  if (!session) return null;

  const isResume =
    session.is_resume && !!session.re_entry_point?.startsWith("resume-swarm:");
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
      className="absolute right-4 top-20 z-[6] sm:right-7 md:right-12"
      style={{
        border: `0.5px solid ${
          isResume ? "hsl(42 78% 52% / 0.35)" : "hsl(172 55% 36% / 0.35)"
        }`,
        background: "hsl(var(--background) / 0.78)",
        backdropFilter: "blur(10px)",
        padding: "7px 10px",
      }}
    >
      <span
        className="font-mono text-[8px] uppercase tracking-[0.18em]"
        style={{
          color: isResume
            ? "hsl(42 78% 52% / 0.85)"
            : "hsl(172 55% 36% / 0.9)",
        }}
      >
        {isResume ? "Retomar sessão" : "Sessão activa"}
      </span>
    </motion.div>
  );
}

function GlobeCore({ onHotspotClick }: { onHotspotClick?: (id: string) => void }) {
  return (
    <div className="absolute inset-0 z-[2]">
      <OrganErrorBoundary organName="Globe" silent>
        <Suspense
          fallback={
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.03, 1], opacity: [0.18, 0.26, 0.18] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  width: "clamp(260px, 62vw, 620px)",
                  height: "clamp(260px, 62vw, 620px)",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle at 45% 38%, hsl(42 78% 52% / 0.15) 0%, hsl(205 100% 52% / 0.13) 34%, hsl(172 55% 36% / 0.16) 58%, transparent 74%)",
                  border: "0.5px solid hsl(42 78% 52% / 0.14)",
                }}
              />
            </div>
          }
        >
          <InteractiveGlobe onHotspotClick={onHotspotClick} />
        </Suspense>
      </OrganErrorBoundary>
    </div>
  );
}

function EntranceCopy() {
  return (
    <div className="relative z-[5] mx-auto flex w-full max-w-[1080px] flex-col items-center px-5 text-center sm:px-8 md:px-14">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8, ease: EASE }}
        className="mb-5 flex flex-col items-center gap-3 sm:mb-7"
      >
        <span
          className="font-mono text-[8px] uppercase tracking-[0.32em] sm:text-[9px]"
          style={{ color: "hsl(42 78% 52% / 0.58)" }}
        >
          ETERNAL NEXUS OS · Sovereign Entry
        </span>
        <span
          className="font-mono text-[8px] uppercase sm:text-[9px]"
          style={{ letterSpacing: "0.2em", color: "hsl(var(--rx-text-ghost) / 0.88)" }}
        >
          Past · Present · Future
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1.0, ease: EASE }}
        className="font-serif italic leading-[0.98]"
        style={{
          fontFamily: "Cormorant Garamond, Georgia, serif",
          fontSize: "clamp(2.5rem, 11vw, 6.7rem)",
          color: "hsl(var(--rx-text-prime))",
          letterSpacing: "-0.02em",
          maxWidth: "980px",
        }}
      >
        Sovereign entry.
        <br />
        <span style={{ color: "hsl(42 78% 52% / 0.9)" }}>One truth, three powers.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.85, ease: EASE }}
        className="mt-5 max-w-[720px] font-sans leading-relaxed sm:mt-7"
        style={{
          fontFamily: "Syne, system-ui, sans-serif",
          fontSize: "clamp(0.92rem, 3.5vw, 1.2rem)",
          color: "hsl(var(--rx-text-mid) / 0.94)",
          letterSpacing: "0.01em",
        }}
      >
        A governed operating surface where memory, examination, and creation
        converge as one authored system.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.62, duration: 0.8, ease: EASE }}
        className="mt-8 flex w-full flex-wrap items-center justify-center gap-3 sm:mt-10 sm:gap-4"
      >
        <Link
          to="/access"
          className="inline-flex w-full items-center justify-center border px-6 py-3 font-sans uppercase transition-colors sm:w-auto sm:px-8"
          style={{
            fontFamily: "Syne, system-ui, sans-serif",
            fontSize: "11px",
            letterSpacing: "0.17em",
            color: "hsl(var(--background))",
            borderColor: "hsl(42 78% 52% / 0.82)",
            background: "linear-gradient(135deg, hsl(42 78% 52%), hsl(35 90% 64%))",
          }}
        >
          Enter the System
        </Link>
        <Link
          to="/lab"
          className="inline-flex w-full items-center justify-center border px-6 py-3 font-mono uppercase transition-colors sm:w-auto sm:px-8"
          style={{
            fontSize: "11px",
            letterSpacing: "0.14em",
            color: "hsl(var(--rx-text-prime) / 0.8)",
            borderColor: "hsl(var(--rx-rim) / 0.95)",
            background: "hsl(var(--background) / 0.45)",
          }}
        >
          Continue in Lab
        </Link>
      </motion.div>
    </div>
  );
}

function EntranceChamber({ onHotspotClick }: { onHotspotClick?: (id: string) => void }) {
  return (
    <div
      className="relative flex w-full items-center justify-center overflow-hidden"
      style={{ minHeight: "max(100svh, 760px)" }}
    >
      <MachineSubstrate />
      <AtmosphereField />
      <GlobeCore onHotspotClick={onHotspotClick} />

      <div
        className="pointer-events-none absolute inset-0 z-[4]"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 10%, hsl(var(--background) / 0.26) 56%, hsl(var(--background) / 0.86) 100%)",
        }}
      />

      <SessionSigil />
      <EntranceCopy />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 1.0 }}
        className="pointer-events-none absolute bottom-4 left-1/2 z-[6] -translate-x-1/2 sm:bottom-8"
        aria-hidden="true"
      >
        <span
          className="font-mono text-[8px] uppercase tracking-[0.26em]"
          style={{ color: "hsl(var(--rx-text-ghost) / 0.85)" }}
        >
          School · Lab · Creation
        </span>
      </motion.div>
    </div>
  );
}

function TrinityRowWithSession() {
  const { session } = useSession();
  return <TrinityRow activeFace={session?.active_face ?? null} />;
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
  const opacity = useTransform(scrollYProgress, [0, 0.92], [1, 0.9]);

  return (
    <motion.section
      ref={sectionRef}
      style={{ opacity, background: "hsl(var(--background))" }}
      className="relative w-full overflow-hidden"
      aria-label="Sovereign homepage entry"
      role="banner"
    >
      <EntranceChamber onHotspotClick={onHotspotClick} />

      <div className="relative z-10 mx-auto w-full max-w-[1320px] px-4 pb-0 pt-10 sm:px-6 md:px-10 lg:px-16">
        <TrinityRowWithSession />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1120px] px-4 pb-28 pt-14 sm:px-6 md:px-10 lg:px-14">
        <HeroFirstProof />
      </div>

      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-48"
        style={{
          background:
            "linear-gradient(to bottom, transparent, hsl(var(--background) / 0.55) 52%, hsl(var(--background)) 100%)",
        }}
        aria-hidden="true"
      />
    </motion.section>
  );
}
