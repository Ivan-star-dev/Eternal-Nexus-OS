/**
 * QuoteBlock.tsx — Rotating quotes component
 * Auto-rotates 4 quotes every 5 seconds with Framer Motion fade transition.
 * sacred-flow: WorkFunction | rotating-quotes | 2026-03-23
 */

"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

// ─── types ────────────────────────────────────────────────────────────────────

interface Quote {
  text: string;
  author: string;
  role: string;
}

// ─── data ─────────────────────────────────────────────────────────────────────

const QUOTES: Quote[] = [
  {
    text: "The world is not a collection of countries. It is a system of interdependencies.",
    author: "Research Protocol",
    role: "Eternal Nexus OS",
  },
  {
    text: "Every metric has a story. Every story has evidence.",
    author: "Data Standard",
    role: "v1.0",
  },
  {
    text: "We do not present opinions as facts. We present facts with their uncertainty.",
    author: "Canonical Law 7",
    role: "DNA Protocol",
  },
  {
    text: "The researcher who cannot trace their claim has no claim.",
    author: "Pioneer Matrix",
    role: "WorkFunction",
  },
];

// ─── component ────────────────────────────────────────────────────────────────

export function QuoteBlock() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % QUOTES.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const current = QUOTES[index];

  return (
    <div className="w-full flex flex-col items-center gap-6 py-12 px-6 md:px-16">
      <div className="relative w-full max-w-2xl mx-auto min-h-[6rem] flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex flex-col items-center gap-3 text-center"
          >
            <blockquote className="font-serif text-lg md:text-xl text-paper/70 italic leading-relaxed">
              &quot;{current.text}&quot;
            </blockquote>
            <p className="font-mono text-[0.45rem] tracking-[0.25em] uppercase text-gold/50">
              — {current.author}, {current.role}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot indicators */}
      <div className="flex items-center gap-2" aria-hidden="true">
        {QUOTES.map((_, i) => (
          <span
            key={i}
            className={[
              "block w-1 h-1 rounded-full transition-all duration-500",
              i === index ? "bg-gold/60 w-3" : "bg-paper-dim/20",
            ].join(" ")}
          />
        ))}
      </div>
    </div>
  );
}

export default QuoteBlock;
