/**
 * SchoolPage.tsx
 * MINI-TASK 02 — School Hero Chamber
 *
 * Species: warm amber-gold academy · constellation ceiling · classical rotunda
 * Feel: a living archive of civilization — not an LMS
 * Mother palette: deep navy #060c14 · gold #c9870f · paper-white · premium silence
 */

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import PageTransition from "@/components/PageTransition";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ── Constellation Ceiling ─────────────────────────────────────────── */
function ConstellationCeiling() {
  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 50,
    size: Math.random() * 1.8 + 0.4,
    delay: Math.random() * 5,
    duration: Math.random() * 3 + 3,
    opacity: Math.random() * 0.4 + 0.1,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden="true">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          animate={{ opacity: [star.opacity, star.opacity * 2.5, star.opacity] }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            borderRadius: "50%",
            background: `hsl(42 ${60 + Math.random() * 20}% ${55 + Math.random() * 20}%)`,
          }}
        />
      ))}

      {/* Faint constellation lines */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.04 }}>
        <line x1="15%" y1="10%" x2="25%" y2="18%" stroke="hsl(42 78% 55%)" strokeWidth="0.5" />
        <line x1="25%" y1="18%" x2="35%" y2="12%" stroke="hsl(42 78% 55%)" strokeWidth="0.5" />
        <line x1="55%" y1="8%" x2="65%" y2="22%" stroke="hsl(42 78% 55%)" strokeWidth="0.5" />
        <line x1="65%" y1="22%" x2="78%" y2="15%" stroke="hsl(42 78% 55%)" strokeWidth="0.5" />
        <line x1="78%" y1="15%" x2="85%" y2="25%" stroke="hsl(42 78% 55%)" strokeWidth="0.5" />
        <line x1="40%" y1="20%" x2="50%" y2="30%" stroke="hsl(42 78% 55%)" strokeWidth="0.5" />
      </svg>
    </div>
  );
}

/* ── Architectural Arches ─────────────────────────────────────────── */
function ArchitecturalArches() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden" aria-hidden="true">
      {/* Left arch — ghostly classical column */}
      <div
        className="absolute left-[8%] bottom-0 hidden md:block"
        style={{
          width: "3px",
          height: "70%",
          background: "linear-gradient(to top, rgba(200,164,78,0.08), rgba(200,164,78,0.02), transparent)",
        }}
      />
      <div
        className="absolute left-[8%] hidden md:block"
        style={{
          bottom: "70%",
          width: "80px",
          height: "40px",
          borderRadius: "40px 40px 0 0",
          border: "1px solid rgba(200,164,78,0.05)",
          borderBottom: "none",
          transform: "translateX(-38px)",
        }}
      />

      {/* Right arch */}
      <div
        className="absolute right-[8%] bottom-0 hidden md:block"
        style={{
          width: "3px",
          height: "70%",
          background: "linear-gradient(to top, rgba(200,164,78,0.08), rgba(200,164,78,0.02), transparent)",
        }}
      />
      <div
        className="absolute right-[8%] hidden md:block"
        style={{
          bottom: "70%",
          width: "80px",
          height: "40px",
          borderRadius: "40px 40px 0 0",
          border: "1px solid rgba(200,164,78,0.05)",
          borderBottom: "none",
          transform: "translateX(38px)",
        }}
      />

      {/* Central arch — larger */}
      <div
        className="absolute left-1/2 -translate-x-1/2 hidden lg:block"
        style={{
          top: "5%",
          width: "240px",
          height: "120px",
          borderRadius: "120px 120px 0 0",
          border: "0.5px solid rgba(200,164,78,0.04)",
          borderBottom: "none",
        }}
      />
    </div>
  );
}

/* ── Warm Atmospheric Layer ───────────────────────────────────────── */
function WarmAtmosphere() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      {/* Warm amber radiance — core */}
      <div
        className="absolute"
        style={{
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "80vw",
          height: "80vw",
          maxWidth: "900px",
          maxHeight: "900px",
          background: "radial-gradient(ellipse at center, hsl(42 78% 45% / 0.07) 0%, hsl(36 65% 38% / 0.03) 40%, transparent 65%)",
          filter: "blur(60px)",
        }}
      />
      {/* Bottom warm wash */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "40%",
          background: "linear-gradient(to top, hsl(36 65% 38% / 0.04), transparent)",
        }}
      />
    </div>
  );
}

/* ── Central Light Pillar ─────────────────────────────────────────── */
function CentralLightPillar() {
  return (
    <motion.div
      initial={{ opacity: 0, scaleY: 0.5 }}
      animate={{ opacity: 1, scaleY: 1 }}
      transition={{ delay: 0.6, duration: 2.0, ease: EASE }}
      className="pointer-events-none absolute left-1/2 -translate-x-1/2 z-[3]"
      style={{
        bottom: 0,
        width: "2px",
        height: "50%",
        background: "linear-gradient(to top, hsl(42 78% 50% / 0.15), hsl(42 78% 50% / 0.04), transparent)",
        transformOrigin: "bottom",
      }}
      aria-hidden="true"
    />
  );
}

/* ── Floor Concentric Rings ───────────────────────────────────────── */
function FloorRings() {
  return (
    <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-[2] flex justify-center" aria-hidden="true">
      {[280, 400, 540].map((size, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            bottom: `-${size / 4}px`,
            width: `${size}px`,
            height: `${size / 2}px`,
            borderRadius: "50%",
            border: `0.5px solid rgba(200,164,78,${0.06 - i * 0.015})`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Main Page ────────────────────────────────────────────────────── */
export default function SchoolPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <Layout>
      <PageTransition>
        {/* ═══ SCHOOL HERO CHAMBER ═══ */}
        <motion.div
          ref={heroRef}
          style={{ opacity: heroOpacity, y: heroY, background: "#060c14" }}
          className="relative w-full overflow-hidden"
        >
          {/* Full viewport chamber */}
          <div className="relative" style={{ minHeight: "100vh" }}>
            <WarmAtmosphere />
            <ConstellationCeiling />
            <ArchitecturalArches />
            <CentralLightPillar />
            <FloorRings />

            {/* ── Nav context bar ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 1.2 }}
              className="absolute top-0 left-0 right-0 z-[10] flex items-center justify-between px-6 py-4 md:px-14 border-b"
              style={{ borderColor: "rgba(200,164,78,0.06)" }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="font-mono text-[9px] tracking-[0.28em] uppercase"
                  style={{ color: "rgba(200,164,78,0.4)" }}
                >
                  SCHOOL · Academy of the Past
                </span>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  to="/atlas"
                  className="font-mono text-[9px] tracking-[0.14em] uppercase transition-colors"
                  style={{ color: "rgba(228,235,240,0.25)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(228,235,240,0.7)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(228,235,240,0.25)"; }}
                >
                  LAB →
                </Link>
                <Link
                  to="/projects"
                  className="font-mono text-[9px] tracking-[0.14em] uppercase transition-colors"
                  style={{ color: "rgba(228,235,240,0.25)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(228,235,240,0.7)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(228,235,240,0.25)"; }}
                >
                  CREATION HUB →
                </Link>
              </div>
            </motion.div>

            {/* ── Sovereign Chamber Content ── */}
            <div className="absolute inset-0 z-[5] flex flex-col items-center justify-center text-center px-6">
              {/* Regime identifier */}
              <motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 1.0, ease: EASE }}
                className="font-sans font-[500] uppercase mb-6"
                style={{
                  fontFamily: "Syne, system-ui, sans-serif",
                  fontSize: "10px",
                  letterSpacing: "0.3em",
                  color: "rgba(200,164,78,0.5)",
                }}
              >
                SCHOOL · PAST
              </motion.span>

              {/* Chamber title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 1.2, ease: EASE }}
                className="font-serif font-[300] italic leading-[1.15] mb-6"
                style={{
                  fontFamily: "Cormorant Garamond, Georgia, serif",
                  fontSize: "clamp(32px, 5vw, 64px)",
                  color: "rgba(228,235,240,0.9)",
                  maxWidth: "700px",
                  textShadow: "0 2px 40px rgba(6,12,20,0.6)",
                }}
              >
                Where memory becomes{" "}
                <span style={{ color: "rgba(200,164,78,0.75)" }}>understanding</span>
              </motion.h1>

              {/* Sub-line */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0, duration: 1.0, ease: EASE }}
                className="font-sans font-[400] mb-10"
                style={{
                  fontFamily: "Syne, system-ui, sans-serif",
                  fontSize: "12px",
                  letterSpacing: "0.12em",
                  color: "rgba(228,235,240,0.4)",
                  maxWidth: "480px",
                  lineHeight: "1.8",
                }}
              >
                A living archive of civilization. Study the structures that shaped the world.
                Navigate knowledge as architecture.
              </motion.p>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.8, ease: EASE }}
              >
                <Link
                  to="/nexus"
                  className="font-sans font-[500] transition-all duration-200 inline-block"
                  style={{
                    fontFamily: "Syne, system-ui, sans-serif",
                    fontSize: "11px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "hsl(42 78% 52%)",
                    border: "1px solid hsl(42 78% 45% / 0.35)",
                    padding: "13px 36px",
                    borderRadius: 0,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "hsl(42 78% 45% / 0.08)";
                    (e.currentTarget as HTMLElement).style.borderColor = "hsl(42 78% 52% / 0.6)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.borderColor = "hsl(42 78% 45% / 0.35)";
                  }}
                >
                  Enter the Academy
                </Link>
              </motion.div>
            </div>

            {/* Bottom gradient fade */}
            <div
              className="pointer-events-none absolute bottom-0 left-0 right-0 z-[6] h-48"
              style={{
                background: "linear-gradient(to bottom, transparent, #060c14)",
              }}
              aria-hidden="true"
            />
          </div>
        </motion.div>

        {/* ═══ Below-fold: Academy promise ═══ */}
        <section
          className="relative py-24 px-6 md:px-16"
          style={{ background: "#060c14" }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <p
                className="font-serif font-[300] italic leading-relaxed"
                style={{
                  fontFamily: "Cormorant Garamond, Georgia, serif",
                  fontSize: "clamp(18px, 2.5vw, 26px)",
                  color: "rgba(228,235,240,0.55)",
                }}
              >
                The School is not a course platform. It is a monumental rotunda of thought —
                where constellations of knowledge overhead guide the paths across
                the floor like rivers of memory.
              </p>
            </motion.div>
          </div>
        </section>
      </PageTransition>
    </Layout>
  );
}
