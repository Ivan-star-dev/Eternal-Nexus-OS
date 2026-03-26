/**
 * LabPage.tsx
 * MINI-TASK 03 — Lab Hero Chamber
 *
 * Species: deep navy inquiry habitat · circular platform · suspended Earth
 *          orbital ceiling rings · calm precision intelligence
 * Feel: a sovereign investigation habitat — not a dashboard
 * Mother palette: deep navy #060c14 · teal #206358 · paper-white · premium silence
 */

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import PageTransition from "@/components/PageTransition";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ── Orbital Ceiling Rings ─────────────────────────────────────────── */
function OrbitalCeilingRings() {
  const rings = [
    { size: 220, opacity: 0.06, speed: 40, delay: 0 },
    { size: 360, opacity: 0.045, speed: 55, delay: 0.5 },
    { size: 520, opacity: 0.03, speed: 75, delay: 1.0 },
    { size: 700, opacity: 0.02, speed: 100, delay: 1.5 },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 z-[1] flex items-start justify-center overflow-hidden" aria-hidden="true">
      {rings.map((ring, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 + ring.delay, duration: 1.5, ease: EASE }}
          style={{
            position: "absolute",
            top: "8%",
            width: `${ring.size}px`,
            height: `${ring.size * 0.25}px`,
            borderRadius: "50%",
            border: `0.5px solid hsl(200 65% 55% / ${ring.opacity})`,
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: ring.speed, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
            style={{
              borderRadius: "50%",
              border: `0.5px solid transparent`,
              borderTopColor: `hsl(172 55% 45% / ${ring.opacity * 1.5})`,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}

/* ── Suspended Holographic Earth ───────────────────────────────────── */
function SuspendedEarth() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center" aria-hidden="true">
      {/* Earth orb — holographic appearance */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 2.0, ease: EASE }}
        className="relative"
      >
        {/* Outer glow ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          style={{
            width: "clamp(260px, 32vw, 420px)",
            height: "clamp(260px, 32vw, 420px)",
            borderRadius: "50%",
            border: "0.5px solid hsl(200 65% 50% / 0.08)",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Earth sphere */}
        <motion.div
          animate={{
            boxShadow: [
              "0 0 40px -10px hsl(200 65% 50% / 0.15), inset 0 0 30px -8px hsl(200 65% 50% / 0.1)",
              "0 0 60px -10px hsl(200 65% 50% / 0.2), inset 0 0 40px -8px hsl(200 65% 50% / 0.15)",
              "0 0 40px -10px hsl(200 65% 50% / 0.15), inset 0 0 30px -8px hsl(200 65% 50% / 0.1)",
            ],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: "clamp(180px, 22vw, 300px)",
            height: "clamp(180px, 22vw, 300px)",
            borderRadius: "50%",
            background: `
              radial-gradient(ellipse at 35% 30%, hsl(200 65% 35% / 0.3) 0%, transparent 50%),
              radial-gradient(ellipse at 65% 65%, hsl(172 55% 28% / 0.2) 0%, transparent 45%),
              radial-gradient(circle at 50% 50%, hsl(216 50% 12%) 0%, hsl(216 60% 6%) 100%)
            `,
            border: "0.5px solid hsl(200 65% 50% / 0.1)",
          }}
        />

        {/* Equatorial line */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "clamp(200px, 24vw, 330px)",
            height: "clamp(200px, 24vw, 330px)",
            borderRadius: "50%",
            border: "0.5px solid hsl(172 55% 45% / 0.06)",
          }}
        />
      </motion.div>
    </div>
  );
}

/* ── Circular Platform ─────────────────────────────────────────────── */
function CircularPlatform() {
  return (
    <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-[3] flex justify-center overflow-hidden" aria-hidden="true">
      {/* Main platform ellipse */}
      <div
        style={{
          width: "clamp(400px, 60vw, 800px)",
          height: "clamp(80px, 10vw, 140px)",
          borderRadius: "50%",
          background: "linear-gradient(to bottom, hsl(200 65% 15% / 0.15), transparent)",
          border: "0.5px solid hsl(200 65% 50% / 0.06)",
          transform: "translateY(50%)",
        }}
      />

      {/* Inner platform ring */}
      <div
        className="absolute"
        style={{
          bottom: 0,
          width: "clamp(240px, 36vw, 500px)",
          height: "clamp(50px, 6vw, 90px)",
          borderRadius: "50%",
          border: "0.5px solid hsl(172 55% 45% / 0.05)",
          transform: "translateY(40%)",
        }}
      />
    </div>
  );
}

/* ── Intelligence Screens ──────────────────────────────────────────── */
function IntelligenceScreens() {
  const screens = [
    { left: "6%", top: "30%", w: 100, h: 60 },
    { left: "4%", top: "50%", w: 80, h: 50 },
    { right: "6%", top: "28%", w: 100, h: 60 },
    { right: "4%", top: "52%", w: 80, h: 50 },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 z-[1] hidden lg:block" aria-hidden="true">
      {screens.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 + i * 0.3, duration: 1.2 }}
          className="absolute"
          style={{
            left: s.left,
            right: (s as any).right,
            top: s.top,
            width: `${s.w}px`,
            height: `${s.h}px`,
            background: "hsl(216 50% 8% / 0.6)",
            border: "0.5px solid hsl(200 65% 50% / 0.06)",
            backdropFilter: "blur(4px)",
          }}
        >
          {/* Scan line */}
          <motion.div
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              height: "1px",
              background: `linear-gradient(to right, transparent, hsl(172 55% 50% / 0.15), transparent)`,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}

/* ── Teal Atmosphere ───────────────────────────────────────────────── */
function TealAtmosphere() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      {/* Core teal radiance */}
      <div
        className="absolute"
        style={{
          top: "30%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "70vw",
          height: "70vw",
          maxWidth: "800px",
          maxHeight: "800px",
          background: "radial-gradient(ellipse at center, hsl(200 65% 40% / 0.05) 0%, hsl(172 55% 28% / 0.03) 35%, transparent 60%)",
          filter: "blur(50px)",
        }}
      />
      {/* Bottom deep */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "35%",
          background: "linear-gradient(to top, hsl(216 50% 4% / 0.6), transparent)",
        }}
      />
    </div>
  );
}

/* ── Main Page ────────────────────────────────────────────────────── */
export default function LabPage() {
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
        {/* ═══ LAB HERO CHAMBER ═══ */}
        <motion.div
          ref={heroRef}
          style={{ opacity: heroOpacity, y: heroY, background: "#060c14" }}
          className="relative w-full overflow-hidden"
        >
          <div className="relative" style={{ minHeight: "100vh" }}>
            <TealAtmosphere />
            <OrbitalCeilingRings />
            <SuspendedEarth />
            <CircularPlatform />
            <IntelligenceScreens />

            {/* ── Nav context bar ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 1.2 }}
              className="absolute top-0 left-0 right-0 z-[10] flex items-center justify-between px-6 py-4 md:px-14 border-b"
              style={{ borderColor: "rgba(32,153,120,0.08)" }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="font-mono text-[9px] tracking-[0.28em] uppercase"
                  style={{ color: "hsl(172 48% 52% / 0.5)" }}
                >
                  LAB · Investigation Habitat
                </span>
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
              </div>
              <div className="flex items-center gap-4">
                <Link
                  to="/school"
                  className="font-mono text-[9px] tracking-[0.14em] uppercase transition-colors"
                  style={{ color: "rgba(228,235,240,0.25)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(228,235,240,0.7)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(228,235,240,0.25)"; }}
                >
                  ← SCHOOL
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
                transition={{ delay: 0.5, duration: 1.0, ease: EASE }}
                className="font-sans font-[500] uppercase mb-6"
                style={{
                  fontFamily: "Syne, system-ui, sans-serif",
                  fontSize: "10px",
                  letterSpacing: "0.3em",
                  color: "hsl(172 48% 52% / 0.5)",
                }}
              >
                LAB · PRESENT
              </motion.span>

              {/* Chamber title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 1.2, ease: EASE }}
                className="font-serif font-[300] italic leading-[1.15] mb-6"
                style={{
                  fontFamily: "Cormorant Garamond, Georgia, serif",
                  fontSize: "clamp(32px, 5vw, 64px)",
                  color: "rgba(228,235,240,0.9)",
                  maxWidth: "720px",
                  textShadow: "0 2px 40px rgba(6,12,20,0.6)",
                }}
              >
                Where reality is placed under{" "}
                <span style={{ color: "hsl(172 48% 60%)" }}>examination</span>
              </motion.h1>

              {/* Sub-line */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 1.0, ease: EASE }}
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
                A sovereign investigation habitat. Observe the world. Model its forces.
                Test hypotheses against evidence.
              </motion.p>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.8, ease: EASE }}
              >
                <Link
                  to="/atlas"
                  className="font-sans font-[500] transition-all duration-200 inline-block"
                  style={{
                    fontFamily: "Syne, system-ui, sans-serif",
                    fontSize: "11px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "hsl(172 48% 55%)",
                    border: "1px solid hsl(172 55% 35% / 0.4)",
                    padding: "13px 36px",
                    borderRadius: 0,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "hsl(172 55% 35% / 0.08)";
                    (e.currentTarget as HTMLElement).style.borderColor = "hsl(172 48% 55% / 0.6)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.borderColor = "hsl(172 55% 35% / 0.4)";
                  }}
                >
                  Enter the Lab
                </Link>
              </motion.div>
            </div>

            {/* Bottom gradient */}
            <div
              className="pointer-events-none absolute bottom-0 left-0 right-0 z-[6] h-48"
              style={{ background: "linear-gradient(to bottom, transparent, #060c14)" }}
              aria-hidden="true"
            />
          </div>
        </motion.div>

        {/* ═══ Below-fold: Lab promise ═══ */}
        <section className="relative py-24 px-6 md:px-16" style={{ background: "#060c14" }}>
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
                The Lab is not a dashboard. It is a circular platform suspended
                in inquiry — where the globe becomes an instrument, not a decoration,
                and every signal arranges itself around the question you are asking.
              </p>
            </motion.div>
          </div>
        </section>
      </PageTransition>
    </Layout>
  );
}
