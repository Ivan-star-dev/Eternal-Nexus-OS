/**
 * TrinityRow.tsx
 * The three named children of the Heaven Lab system.
 *
 * Canon: HEAVEN_LAB_REFERENCE_SURFACE.md — BLOCO 2 TRINITY
 *   - 3 nodes with equal visual dignity
 *   - horizontal row, coordinated unit (not random sections)
 *   - explicit labels: Heaven Lab · Bridge Nova · Nexus Cria
 *   - staggered reveal after globe loads
 *   - hover: expand identity line + micro-detail
 *
 * Typography law (PRODUCT_FACE_TYPE):
 *   - Title: Syne 400 · 13px · tracking 0.14em · uppercase · gold
 *   - Identity line: Cormorant Garamond 300 italic · paper · opacity 0.72
 *   - Micro-detail: JetBrains Mono 10px · teal (hover only)
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EASE_OUT, DUR, STAGGER } from "@/lib/motion/config";

interface Child {
  id: string;
  name: string;
  role: string;
  micro: string;
  index: number;
}

const TRINITY: Child[] = [
  {
    id: "heaven-lab",
    name: "Heaven Lab",
    role: "O sistema que governa tudo",
    micro: "machine_intelligence · governance_core",
    index: 1,
  },
  {
    id: "bridge-nova",
    name: "Bridge Nova",
    role: "A ponte entre o sistema e o mundo",
    micro: "product_layer · proof_of_system",
    index: 2,
  },
  {
    id: "nexus-cria",
    name: "Nexus Cria",
    role: "O legado aberto · template replicável",
    micro: "open_architecture · autonomous_spawn",
    index: 3,
  },
];

function ChildNode({ child, delay }: { child: Child; delay: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay, duration: DUR.slow, ease: EASE_OUT }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={0}
      className="group relative flex-1 flex flex-col items-center text-center cursor-default select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
    >
      {/* Orbital index line + number */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0.35 }}
        transition={{ duration: DUR.fast }}
        className="mb-4 flex items-center justify-center"
      >
        <span
          className="block h-px"
          style={{
            width: "32px",
            background: hovered ? "hsl(42 78% 45% / 0.6)" : "rgba(255,255,255,0.12)",
            transition: "background 0.4s",
          }}
        />
        <span
          className="mx-3 font-mono text-[9px] tabular-nums"
          style={{
            color: hovered ? "hsl(42 78% 45% / 0.9)" : "rgba(255,255,255,0.25)",
            letterSpacing: "0.12em",
            transition: "color 0.3s",
          }}
        >
          {String(child.index).padStart(2, "0")}
        </span>
        <span
          className="block h-px"
          style={{
            width: "32px",
            background: hovered ? "hsl(42 78% 45% / 0.6)" : "rgba(255,255,255,0.12)",
            transition: "background 0.4s",
          }}
        />
      </motion.div>

      {/* Name — Syne, gold */}
      <motion.span
        animate={{ color: hovered ? "hsl(42 78% 45%)" : "hsl(42 78% 45% / 0.75)" }}
        transition={{ duration: DUR.fast }}
        className="block font-sans text-[13px] font-[400] uppercase"
        style={{ fontFamily: "Syne, system-ui, sans-serif", letterSpacing: "0.14em" }}
      >
        {child.name}
      </motion.span>

      {/* Identity line — Cormorant italic */}
      <motion.span
        animate={{ opacity: hovered ? 0.85 : 0.55 }}
        transition={{ duration: DUR.fast }}
        className="mt-2 block font-serif text-[14px] font-[300] italic leading-snug"
        style={{
          fontFamily: "Cormorant Garamond, Georgia, serif",
          color: "#e4ebf0",
          maxWidth: "200px",
        }}
      >
        {child.role}
      </motion.span>

      {/* Micro-detail — JetBrains Mono, teal, hover only */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.22, ease: EASE_OUT }}
            className="mt-2 block font-mono text-[10px]"
            style={{
              color: "hsl(172 48% 52% / 0.8)",
              letterSpacing: "0.04em",
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            {child.micro}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Glass separator — appears on hover */}
      <motion.div
        animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
        transition={{ duration: DUR.base, ease: EASE_OUT }}
        className="mt-4 origin-center"
        style={{ height: "0.5px", width: "60px", background: "hsl(42 78% 45% / 0.4)" }}
      />
    </motion.div>
  );
}

function Divider() {
  return (
    <div
      className="hidden md:block shrink-0 self-stretch"
      style={{ width: "0.5px", background: "rgba(255,255,255,0.07)", margin: "0 8px" }}
      aria-hidden="true"
    />
  );
}

export default function TrinityRow() {
  return (
    <div>
      {/* Section anchor label */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: DUR.slow }}
        className="mb-8 flex items-center justify-center gap-4"
      >
        <span className="block h-px flex-1" style={{ maxWidth: "120px", background: "rgba(255,255,255,0.07)" }} />
        <span
          className="font-sans text-[9px] font-[500] uppercase tracking-[0.24em]"
          style={{ fontFamily: "Syne, system-ui, sans-serif", color: "rgba(255,255,255,0.25)" }}
        >
          Os três filhos
        </span>
        <span className="block h-px flex-1" style={{ maxWidth: "120px", background: "rgba(255,255,255,0.07)" }} />
      </motion.div>

      {/* Trinity row — horizontal, equal dignity, glass panel */}
      <div
        className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-10 md:gap-0 rounded-sm py-8 px-6 md:px-10"
        style={{
          background: "rgba(255,255,255,0.025)",
          border: "0.5px solid rgba(255,255,255,0.065)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        {TRINITY.map((child, i) => [
          <ChildNode key={child.id} child={child} delay={STAGGER.base * i} />,
          i < TRINITY.length - 1 && <Divider key={`div-${i}`} />,
        ])}
      </div>
    </div>
  );
}
