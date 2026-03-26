/**
 * Footer.tsx — Final Chamber
 *
 * The last chamber of the organism. Dark. Sparse. Closed. Authoritative.
 * Not a navigation grid. Not a classification wall.
 * One signature. Three links. One copyright line.
 *
 * Canon: RUBERRA Visual Mother ID · Footer as Final Chamber
 */

import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
      style={{ background: "hsl(216 60% 4%)" }}
    >
      {/* Top separator — gold accent */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{ height: "0.5px", background: "linear-gradient(to right, transparent, rgba(200,164,78,0.15), transparent)" }}
        aria-hidden="true"
      />

      <div className="flex flex-col items-center justify-center text-center py-10 px-6" style={{ minHeight: "130px" }}>
        {/* Signature */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className="font-sans font-[500] uppercase"
            style={{
              fontFamily: "Syne, system-ui, sans-serif",
              fontSize: "9px",
              letterSpacing: "0.22em",
              color: "rgba(200,164,78,0.35)",
            }}
          >
            RUBERRA
          </span>
          <span style={{ color: "rgba(255,255,255,0.1)", fontSize: "9px" }}>·</span>
          <span
            className="font-mono"
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "8px",
              letterSpacing: "0.16em",
              color: "rgba(228,235,240,0.14)",
            }}
          >
            ETERNAL NEXUS OS
          </span>
          <span style={{ color: "rgba(255,255,255,0.1)", fontSize: "9px" }}>·</span>
          <span
            className="font-mono"
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "8px",
              letterSpacing: "0.1em",
              color: "rgba(228,235,240,0.1)",
            }}
          >
            2026
          </span>
        </div>

        {/* Essential links only */}
        <div className="flex items-center gap-5 mb-4">
          {[
            { label: "Privacy", path: "/privacy" },
            { label: "Terms", path: "/terms" },
            { label: "About", path: "/about" },
          ].map((link, i) => (
            <span key={link.path} className="flex items-center gap-5">
              <Link
                to={link.path}
                className="font-mono transition-colors duration-200"
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "8px",
                  letterSpacing: "0.1em",
                  color: "rgba(228,235,240,0.16)",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.color = "rgba(228,235,240,0.45)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.color = "rgba(228,235,240,0.16)";
                }}
              >
                {link.label}
              </Link>
              {i < 2 && (
                <span style={{ color: "rgba(255,255,255,0.08)", fontSize: "8px" }}>·</span>
              )}
            </span>
          ))}
        </div>

        {/* Copyright */}
        <span
          className="font-mono"
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "7px",
            letterSpacing: "0.14em",
            color: "rgba(228,235,240,0.1)",
          }}
        >
          © 2026 · All systems governed
        </span>
      </div>
    </motion.footer>
  );
};

export default Footer;
