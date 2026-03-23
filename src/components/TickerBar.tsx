"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const tickerItems = [
  { text: "NPI-001 · DeltaSpine NL", highlight: "ACTIVE PHASE 0" },
  { text: "Netherlands · Water & Mobility Infrastructure", highlight: "" },
  { text: "Pilot investment:", highlight: "€180–240M" },
  { text: "Annual benefit:", highlight: "€460–700M" },
  { text: "Nitrogen reduction:", highlight: "–15–25% canal N load" },
  { text: "White Paper v2.0 available", highlight: "DSN-WP-2026-002" },
  { text: "Proprietor:", highlight: "Ivanildo Michel Monteiro Fernandes" },
  { text: "Platform: Next Path Infra", highlight: "Restricted access" },
];

const TickerBar = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="border-y border-white/[0.04] bg-ink-medium/20 py-2 overflow-hidden relative">
      <div className="flex items-center gap-6 px-6">
        {/* Label */}
        <span className="font-mono text-[0.5rem] tracking-[0.15em] uppercase text-paper-dim/50 whitespace-nowrap flex-shrink-0 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-dot" />
          LIVE · NPI REGISTRY
        </span>

        {/* Track */}
        <div className="overflow-hidden flex-1">
          {mounted ? (
            <motion.div
              className="flex whitespace-nowrap"
              style={{ willChange: "transform" }}
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
              {[...tickerItems, ...tickerItems].map((item, i) => (
                <span
                  key={i}
                  className="font-mono text-[0.5rem] tracking-[0.15em] uppercase text-paper-dim/50 mr-8"
                >
                  {item.text}{" "}
                  {item.highlight && (
                    <span className="text-paper-dim/50">{item.highlight}</span>
                  )}
                  <span className="mx-4 text-gold/30">·</span>
                </span>
              ))}
            </motion.div>
          ) : (
            <div className="flex whitespace-nowrap invisible">
              {tickerItems.slice(0, 1).map((item, i) => (
                <span
                  key={i}
                  className="font-mono text-[0.5rem] tracking-[0.15em] uppercase text-paper-dim/50 mr-8"
                >
                  {item.text}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TickerBar;
