import { motion } from "framer-motion";

export default function LoadingFallback() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: "#060c14" }}
    >
      {/* Atmospheric orb */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 45% 40% at 50% 45%, hsl(42 78% 45% / 0.07) 0%, transparent 65%)" }}
      />

      {/* Spinner */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "0.5px solid rgba(200,218,232,0.08)",
          borderTopColor: "rgba(200,164,78,0.65)",
          marginBottom: 24,
        }}
      />

      {/* Brand */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="flex flex-col items-center gap-2"
      >
        <span
          className="font-mono uppercase"
          style={{ fontSize: "8px", letterSpacing: "0.32em", color: "rgba(200,164,78,0.5)" }}
        >
          ETERNAL NEXUS OS
        </span>
        <span
          className="font-mono uppercase"
          style={{ fontSize: "7px", letterSpacing: "0.2em", color: "rgba(200,218,232,0.2)" }}
        >
          LOADING SYSTEM MODULE
        </span>
      </motion.div>
    </div>
  );
}
