import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    document.title = "404 — Route Not Found · Eternal Nexus OS";
  }, [location.pathname]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: "#060c14" }}
    >
      {/* Engineering grid */}
      <div className="absolute inset-0 engineering-grid pointer-events-none" style={{ opacity: 0.04 }} />

      {/* Gold atmospheric orb — top right */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 55% 50% at 80% 20%, hsl(42 78% 45% / 0.1) 0%, transparent 65%)" }}
      />
      {/* Teal orb — bottom left */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 45% 45% at 10% 85%, hsl(172 55% 30% / 0.07) 0%, transparent 60%)" }}
      />

      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.015 }}>
        {Array.from({ length: 32 }).map((_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0"
            style={{ top: `${i * 32}px`, height: "1px", background: "rgba(255,255,255,0.5)" }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-lg w-full">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: EASE }}
        >
          {/* Error code */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="font-mono text-[0.48rem] tracking-[0.32em] uppercase mb-8"
            style={{ color: "rgba(200,164,78,0.5)" }}
          >
            404 · COORDINATES NOT FOUND
          </motion.div>

          {/* Big 404 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 1.2, ease: EASE }}
            className="font-serif leading-none mb-8 select-none"
            style={{
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontSize: "clamp(96px, 16vw, 180px)",
              fontWeight: 300,
              fontStyle: "italic",
              color: "rgba(232,238,244,0.08)",
              letterSpacing: "-0.04em",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              whiteSpace: "nowrap",
              pointerEvents: "none",
            }}
          >
            404
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1.0, ease: EASE }}
            className="font-serif font-light leading-[1.05] mb-5"
            style={{
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontSize: "clamp(32px, 4.5vw, 56px)",
              color: "#e8eef4",
              letterSpacing: "-0.02em",
            }}
          >
            This territory is<br />
            <span style={{ fontStyle: "italic", color: "rgba(200,218,232,0.55)" }}>uncharted.</span>
          </motion.h1>

          {/* Separator */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.55, duration: 0.8 }}
            className="mx-auto origin-center mb-6"
            style={{ width: 48, height: "0.5px", background: "rgba(200,164,78,0.4)" }}
          />

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.8 }}
            className="font-serif italic"
            style={{ fontSize: "14px", color: "rgba(200,218,232,0.4)", marginBottom: "48px", lineHeight: 1.7 }}
          >
            The page you're looking for doesn't exist<br />in this branch of the system.
          </motion.p>

          {/* Attempted path */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75, duration: 0.7 }}
            className="font-mono mb-10"
            style={{ fontSize: "0.55rem", color: "rgba(200,218,232,0.25)", letterSpacing: "0.08em" }}
          >
            ATTEMPTED: <span style={{ color: "rgba(200,164,78,0.45)" }}>{location.pathname}</span>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7, ease: EASE }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-3 font-mono text-[0.6rem] tracking-[0.14em] uppercase transition-all duration-200"
              style={{
                border: "0.5px solid rgba(200,164,78,0.45)",
                color: "hsl(42 78% 58%)",
                padding: "12px 28px",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "rgba(200,164,78,0.06)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(200,164,78,0.7)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(200,164,78,0.45)";
              }}
            >
              ← Return to Base
            </Link>
            <Link
              to="/atlas"
              className="inline-flex items-center gap-3 font-mono text-[0.6rem] tracking-[0.14em] uppercase transition-all duration-200"
              style={{
                border: "0.5px solid rgba(38,190,150,0.3)",
                color: "rgba(38,190,150,0.7)",
                padding: "12px 28px",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "rgba(38,190,150,0.06)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(38,190,150,0.6)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(38,190,150,0.3)";
              }}
            >
              Open Atlas →
            </Link>
          </motion.div>

          {/* Canonical mark */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-16 font-mono"
            style={{ fontSize: "0.42rem", color: "rgba(255,255,255,0.12)", letterSpacing: "0.16em" }}
          >
            ETERNAL NEXUS OS · v9 · HEAVEN LAB · 2026
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
