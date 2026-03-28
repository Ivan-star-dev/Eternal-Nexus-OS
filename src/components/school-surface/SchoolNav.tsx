/**
 * SchoolNav.tsx
 * Minimal top navigation for Bridge Nova / School portal.
 *
 * Shows: logotype · progress indicator · back link
 * Canon: V7-SURFACES-001 · K-04+K-06 · @framer+@cursor
 */

import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const GOLD = "hsl(42, 78%, 52%)";
const GOLD_FAINT = "hsla(42, 78%, 52%, 0.35)";
const EASE = [0.22, 1, 0.36, 1] as const;

export default function SchoolNav() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EASE }}
      aria-label="Bridge Nova navigation"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(10,15,30,0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: `1px solid ${GOLD_FAINT}`,
        padding: "0 clamp(16px, 4vw, 48px)",
        height: "56px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
      }}
    >
      {/* Logotype */}
      <span
        style={{
          fontFamily: "Syne, system-ui, sans-serif",
          fontSize: "17px",
          fontWeight: 700,
          color: GOLD,
          letterSpacing: "-0.01em",
          userSelect: "none",
        }}
      >
        Bridge Nova
      </span>

      {/* Progress indicator */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "3px",
            background: "rgba(255,255,255,0.08)",
            borderRadius: "2px",
            overflow: "hidden",
          }}
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 0.4 }}
            transition={{ delay: 0.4, duration: 0.8, ease: EASE }}
            style={{
              height: "100%",
              background: GOLD,
              transformOrigin: "left",
              borderRadius: "2px",
            }}
          />
        </div>
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "10px",
            letterSpacing: "0.15em",
            color: `${GOLD}99`,
          }}
        >
          2 of 5 complete
        </span>
      </div>

      {/* Back link */}
      <Link
        to="/"
        style={{
          fontFamily: "Syne, system-ui, sans-serif",
          fontSize: "12px",
          fontWeight: 500,
          color: "rgba(200,210,220,0.5)",
          textDecoration: "none",
          letterSpacing: "0.04em",
          transition: "color 0.2s",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.color =
            "rgba(200,210,220,0.85)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.color =
            "rgba(200,210,220,0.5)";
        }}
      >
        ← Platform
      </Link>
    </motion.nav>
  );
}
