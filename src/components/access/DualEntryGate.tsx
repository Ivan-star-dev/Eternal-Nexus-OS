/**
 * DualEntryGate.tsx
 * Homepage dual access entry — Public path (Explore) + Premium path (Lab).
 *
 * Layout:
 *   Left  — "Explore the Platform" → /world (public, always accessible)
 *   Right — "Enter the Lab" → /lab if authenticated, else AuthModal
 *
 * Design:
 *   - Full-width dark section with radial glow behind Lab CTA
 *   - Gold fill dominant right side, outlined secondary left
 *   - Thin vertical divider + "or" separator
 *   - Mobile: stacks vertically, Lab CTA on top
 *
 * Canon: V8-DUAL-ACCESS-001 · K-04+K-07
 * @framer+@cursor | 2026-03-28
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, FlaskConical } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "./AuthModal";

const EASE = [0.22, 1, 0.36, 1] as const;

const CONTAINER = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const SLIDE_UP = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

export default function DualEntryGate() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [authOpen, setAuthOpen] = useState(false);

  const handleLabClick = () => {
    if (user) {
      navigate("/lab");
    } else {
      setAuthOpen(true);
    }
  };

  return (
    <>
      <section
        aria-label="Platform entry — choose your path"
        style={{
          background: "#07091a",
          borderTop: "0.5px solid rgba(200,164,78,0.07)",
          borderBottom: "0.5px solid rgba(200,164,78,0.07)",
          padding: "clamp(64px, 10vh, 112px) clamp(16px, 6vw, 80px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Radial ambient glow — behind Lab CTA, right side */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "50%",
            right: "8%",
            transform: "translate(30%, -50%)",
            width: "min(600px, 80vw)",
            height: "min(600px, 80vw)",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at center, hsl(42 78% 45% / 0.08) 0%, transparent 60%)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />

        <motion.div
          variants={CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          {/* Section label */}
          <motion.span
            variants={SLIDE_UP}
            style={{
              display: "block",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "9px",
              letterSpacing: "0.28em",
              color: "rgba(200,164,78,0.4)",
              textTransform: "uppercase",
              textAlign: "center",
              marginBottom: "32px",
            }}
          >
            Platform Access · Choose Your Path
          </motion.span>

          {/* Gate row */}
          <motion.div
            variants={SLIDE_UP}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              gap: "clamp(24px, 4vw, 48px)",
              alignItems: "stretch",
            }}
          >
            {/* ── Left: Explore (Public) ── */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                padding: "clamp(28px, 4vw, 44px)",
                border: "0.5px solid rgba(255,255,255,0.07)",
                background: "rgba(255,255,255,0.018)",
                position: "relative",
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "8px",
                    letterSpacing: "0.24em",
                    color: "rgba(228,235,240,0.25)",
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: "10px",
                  }}
                >
                  Public · Always accessible
                </span>
                <h3
                  style={{
                    fontFamily: "Syne, system-ui, sans-serif",
                    fontSize: "clamp(18px, 3vw, 26px)",
                    fontWeight: 700,
                    color: "rgba(228,235,240,0.82)",
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  Explore the Platform
                </h3>
                <p
                  style={{
                    fontFamily: "Syne, system-ui, sans-serif",
                    fontSize: "13px",
                    color: "rgba(228,235,240,0.38)",
                    marginTop: "10px",
                    lineHeight: 1.65,
                  }}
                >
                  Browse the global research map, live events, and active
                  missions — no account required.
                </p>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ marginTop: "auto", alignSelf: "flex-start" }}
              >
                <Link
                  to="/world"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    fontFamily: "Syne, system-ui, sans-serif",
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "rgba(228,235,240,0.65)",
                    border: "0.5px solid rgba(255,255,255,0.14)",
                    padding: "13px 24px",
                    textDecoration: "none",
                    transition: "color 0.2s, border-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.color = "rgba(228,235,240,0.9)";
                    el.style.borderColor = "rgba(255,255,255,0.28)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.color = "rgba(228,235,240,0.65)";
                    el.style.borderColor = "rgba(255,255,255,0.14)";
                  }}
                  aria-label="Explore the platform — go to World view"
                >
                  <Globe size={13} />
                  Explore the Platform
                </Link>
              </motion.div>
            </div>

            {/* ── Divider ── */}
            <div
              aria-hidden="true"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                userSelect: "none",
              }}
            >
              <div
                style={{
                  width: "0.5px",
                  flex: 1,
                  background:
                    "linear-gradient(to bottom, transparent, rgba(200,164,78,0.18), transparent)",
                }}
              />
              <span
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "9px",
                  letterSpacing: "0.2em",
                  color: "rgba(200,164,78,0.3)",
                  textTransform: "uppercase",
                }}
              >
                or
              </span>
              <div
                style={{
                  width: "0.5px",
                  flex: 1,
                  background:
                    "linear-gradient(to bottom, transparent, rgba(200,164,78,0.18), transparent)",
                }}
              />
            </div>

            {/* ── Right: Enter the Lab (Premium) ── */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                padding: "clamp(28px, 4vw, 44px)",
                border: "0.5px solid rgba(200,164,78,0.18)",
                background: "rgba(200,164,78,0.03)",
                position: "relative",
              }}
            >
              {/* Premium badge */}
              <span
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "8px",
                  letterSpacing: "0.2em",
                  color: "hsl(42 78% 52%)",
                  textTransform: "uppercase",
                  border: "0.5px solid hsl(42 78% 52% / 0.35)",
                  padding: "3px 8px",
                }}
              >
                Premium
              </span>

              <div>
                <span
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "8px",
                    letterSpacing: "0.24em",
                    color: "rgba(200,164,78,0.5)",
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: "10px",
                  }}
                >
                  For researchers & builders
                </span>
                <h3
                  style={{
                    fontFamily: "Syne, system-ui, sans-serif",
                    fontSize: "clamp(18px, 3vw, 26px)",
                    fontWeight: 700,
                    color: "rgba(228,235,240,0.92)",
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  Enter the Lab
                </h3>
                <p
                  style={{
                    fontFamily: "Syne, system-ui, sans-serif",
                    fontSize: "13px",
                    color: "rgba(228,235,240,0.42)",
                    marginTop: "10px",
                    lineHeight: 1.65,
                  }}
                >
                  Access the full Creation Lab — research tools, AI models,
                  mission builder, and real-time collaboration.
                </p>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ marginTop: "auto", alignSelf: "flex-start" }}
              >
                <button
                  onClick={handleLabClick}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    fontFamily: "Syne, system-ui, sans-serif",
                    fontSize: "12px",
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "hsl(216 50% 5%)",
                    background: "hsl(42 78% 52%)",
                    border: "none",
                    padding: "15px 32px",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "hsl(42 78% 62%)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "hsl(42 78% 52%)";
                  }}
                  aria-label={
                    user
                      ? "Enter Creation Lab"
                      : "Sign in to enter the Creation Lab"
                  }
                >
                  <FlaskConical size={14} />
                  Enter the Lab
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Auth modal — shown when unauthenticated user clicks Lab CTA */}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
