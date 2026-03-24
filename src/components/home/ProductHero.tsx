import { lazy, Suspense, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import OrganErrorBoundary from "@/components/shared/OrganErrorBoundary";
import TrinityRow from "@/components/home/TrinityRow";
import HeroFirstProof from "@/components/home/HeroFirstProof";

const InteractiveGlobe = lazy(() => import("@/components/globe/InteractiveGlobe"));

const ease = [0.16, 1, 0.3, 1] as const;

// Precision grid — measurement substrate, barely visible
function MachineSubstrate() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 hidden opacity-[0.016] md:block"
      aria-hidden
    >
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <defs>
          <pattern id="product-hero-grid" width="52" height="52" patternUnits="userSpaceOnUse">
            <path
              d="M 52 0 L 0 0 0 52"
              fill="none"
              stroke="hsl(var(--foreground))"
              strokeWidth="0.3"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#product-hero-grid)" />
      </svg>
    </div>
  );
}

// Orbital atmosphere — three light fields, not competing, just present
function AtmosphericLayer() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      {/* Central chamber — the invisible gravity of the space */}
      <div className="absolute left-1/2 top-[30%] h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.055] blur-[110px] md:h-[680px] md:w-[680px]" />
      {/* Left warmth — gold edge, very low */}
      <div className="absolute -left-[22%] top-[20%] h-60 w-60 rounded-full bg-primary/[0.07] blur-[80px] md:h-80 md:w-80" />
      {/* Right cool — teal, large and spread */}
      <div className="absolute -right-[18%] bottom-[28%] h-72 w-72 rounded-full bg-teal/[0.06] blur-[96px] md:h-[400px] md:w-[400px]" />
    </div>
  );
}

/** Canonical product-face hero: globe → trinity → proof. Anatomy locked. */
const ProductHero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.97]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100vh] flex-col items-center overflow-hidden"
      aria-label="Eternal Nexus — Visão estratégica global"
      role="banner"
    >
      <MachineSubstrate />
      <AtmosphericLayer />

      {/* ── GlobeZone ── */}
      <div className="relative z-[1] mx-auto h-[clamp(480px,68vw,780px)] w-full max-w-[1400px] shrink-0">
        <OrganErrorBoundary organName="Globe" silent>
          <Suspense
            fallback={
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.05)_0%,transparent_70%)]" />
            }
          >
            <InteractiveGlobe onHotspotClick={() => undefined} />
          </Suspense>
        </OrganErrorBoundary>

        {/* Vignette — opens the center further than before, preserves depth */}
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_60%_60%_at_center,hsl(var(--background)/0.18)_0%,hsl(var(--background)/0.70)_54%,hsl(var(--background))_100%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-transparent to-background"
          aria-hidden
        />

        {/* System identifier — top, all-caps, pulse dot */}
        <div className="pointer-events-none absolute left-0 right-0 top-5 z-[2] flex justify-center px-4 sm:top-7">
          <div className="flex items-center gap-2">
            <span className="h-[5px] w-[5px] animate-pulse rounded-full bg-primary/45" />
            <span className="font-mono text-[0.46rem] tracking-[0.3em] text-primary/60">
              HEAVEN LAB · OBSERVATORY NODE-01
            </span>
          </div>
        </div>

        {/* Anchor phrase — bottom, italic whisper */}
        <div className="pointer-events-none absolute bottom-4 left-0 right-0 z-[2] flex justify-center px-4 sm:bottom-6">
          <p className="font-serif text-[0.68rem] italic tracking-wide text-muted-foreground/50 sm:text-[0.75rem]">
            O sistema e os seus filhos
          </p>
        </div>
      </div>

      {/* ── Content: h1 → TrinityRow → HeroFirstProof ── */}
      <motion.div
        style={{ scale: contentScale, opacity: contentOpacity }}
        className="relative z-[2] flex w-full flex-col items-center px-4"
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1.8, ease }}
          className="font-display text-4xl font-bold tracking-[0.06em] text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
          id="main-heading"
        >
          Eternal Nexus
        </motion.h1>

        <TrinityRow />
        <HeroFirstProof />
      </motion.div>

      {/* Scroll cue — barely there, inevitable */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 1.4, ease }}
        className="pointer-events-none absolute bottom-6 left-1/2 z-[2] -translate-x-1/2 md:bottom-8"
        aria-hidden
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-8 w-5 items-start justify-center rounded-full border border-primary/[0.16] pt-1.5"
        >
          <div className="h-1.5 w-1 rounded-full bg-primary/[0.28]" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ProductHero;
