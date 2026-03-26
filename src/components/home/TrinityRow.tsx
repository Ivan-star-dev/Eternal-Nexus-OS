/**
 * TrinityRow.tsx
 * Three monumental portals — School · Lab · Creation Hub
 * Each a distinct world. All children of the same mother.
 *
 * Canon: HEAVEN_LAB_REFERENCE_SURFACE.md · RUBERRA Visual Mother ID
 * Upgrade: portal scale · regime words · unique atmospheric backgrounds
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { TrinityFace } from "@/lib/memory/types";

const EASE = [0.22, 1, 0.36, 1] as const;

interface Portal {
  id: string;
  face: TrinityFace;
  index: number;
  // Surface label (Ruberra north)
  pillarName: string;
  // Regime word — temporal axis
  regimeWord: string;
  // Identity line — what it does
  identity: string;
  // Operative tags — JetBrains Mono
  tags: string;
  // Route
  path: string;
  // Unique atmospheric color for background glow
  glowColor: string;
  // Original name (preserved for session continuity)
  name: string;
}

const PORTALS: Portal[] = [
  {
    id: "heaven-lab",
    face: "heaven_lab",
    index: 1,
    pillarName: "SCHOOL",
    regimeWord: "Past",
    identity: "Where memory becomes understanding.",
    tags: "study · understand · remember",
    path: "/nexus",
    glowColor: "hsl(42 78% 45% / 0.06)",
    name: "Heaven Lab",
  },
  {
    id: "bridge-nova",
    face: "bridge_nova",
    index: 2,
    pillarName: "LAB",
    regimeWord: "Present",
    identity: "Where reality is placed under examination.",
    tags: "observe · investigate · model",
    path: "/atlas",
    glowColor: "hsl(172 55% 28% / 0.06)",
    name: "Bridge Nova",
  },
  {
    id: "nexus-cria",
    face: "nexus_cria",
    index: 3,
    pillarName: "CREATION HUB",
    regimeWord: "Future",
    identity: "Where systems gain form and authorship takes root.",
    tags: "design · build · ship",
    path: "/projects",
    glowColor: "hsl(38 80% 42% / 0.06)",
    name: "Nexus Cria",
  },
];

interface PortalNodeProps {
  portal: Portal;
  delay: number;
  isActive: boolean;
}

function PortalNode({ portal, delay, isActive }: PortalNodeProps) {
  const [hovered, setHovered] = useState(false);
  const lit = hovered || isActive;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay, duration: 0.85, ease: EASE }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex flex-col px-8 md:px-12 py-14 select-none"
      style={{ minHeight: "500px" }}
    >
      {/* Unique atmospheric background glow */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          background: `radial-gradient(ellipse at 50% 40%, ${portal.glowColor} 0%, transparent 65%)`,
          opacity: lit ? 1.6 : 1,
        }}
        aria-hidden="true"
      />

      {/* Active-face ring */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 pointer-events-none"
          style={{ border: "0.5px solid rgba(200,164,78,0.2)" }}
          aria-hidden="true"
        />
      )}

      {/* Orbital index + name header */}
      <div className="relative z-10 flex items-center gap-3 mb-4">
        <span
          className="font-mono text-[9px] tabular-nums"
          style={{ color: "rgba(200,164,78,0.3)", letterSpacing: "0.1em" }}
        >
          {String(portal.index).padStart(2, "0")}
        </span>
        <motion.span
          animate={{ color: lit ? "hsl(42 78% 52%)" : "hsl(42 78% 42% / 0.8)" }}
          transition={{ duration: 0.35 }}
          className="font-sans font-[500] uppercase"
          style={{
            fontFamily: "Syne, system-ui, sans-serif",
            fontSize: "11px",
            letterSpacing: "0.22em",
          }}
        >
          {portal.pillarName}
        </motion.span>
      </div>

      {/* Thin separator under header */}
      <div
        className="relative z-10 mb-10"
        style={{
          height: "0.5px",
          background: `linear-gradient(to right, rgba(200,164,78,${lit ? "0.3" : "0.15"}), transparent)`,
          transition: "background 0.4s",
        }}
      />

      {/* Regime word — the temporal axis */}
      <motion.span
        animate={{ opacity: lit ? 0.5 : 0.28 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 block font-serif font-[300] italic leading-none mb-8"
        style={{
          fontFamily: "Cormorant Garamond, Georgia, serif",
          fontSize: "clamp(34px, 4vw, 48px)",
          color: "#e4ebf0",
        }}
      >
        {portal.regimeWord}
      </motion.span>

      {/* Identity line */}
      <motion.p
        animate={{ opacity: lit ? 0.72 : 0.5 }}
        transition={{ duration: 0.35 }}
        className="relative z-10 font-sans font-[400] leading-relaxed mb-8"
        style={{
          fontFamily: "Syne, system-ui, sans-serif",
          fontSize: "13px",
          color: "#e4ebf0",
          maxWidth: "280px",
        }}
      >
        {portal.identity}
      </motion.p>

      {/* Regime tags */}
      <span
        className="relative z-10 block font-mono"
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "9px",
          letterSpacing: "0.18em",
          color: "hsl(172 48% 52% / 0.45)",
          marginBottom: "auto",
        }}
      >
        {portal.tags}
      </span>

      {/* Portal CTA — bottom */}
      <motion.div
        animate={{ opacity: lit ? 1 : 0.4, x: lit ? 4 : 0 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 mt-12"
      >
        <Link
          to={portal.path}
          className="inline-flex items-center gap-2 font-sans font-[400] transition-colors"
          style={{
            fontFamily: "Syne, system-ui, sans-serif",
            fontSize: "10px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: lit ? "hsl(42 78% 52%)" : "hsl(42 78% 45% / 0.55)",
          }}
        >
          <span>→</span>
          <span>Enter {portal.pillarName === "CREATION HUB" ? "Creation Hub" : portal.pillarName.charAt(0) + portal.pillarName.slice(1).toLowerCase()}</span>
        </Link>
      </motion.div>
    </motion.div>
  );
}

// Vertical divider between portals
function PortalDivider() {
  return (
    <div
      className="hidden md:block flex-shrink-0 self-stretch"
      style={{ width: "0.5px", background: "rgba(255,255,255,0.05)" }}
      aria-hidden="true"
    />
  );
}

interface TrinityRowProps {
  activeFace?: TrinityFace | null;
}

export default function TrinityRow({ activeFace }: TrinityRowProps) {
  return (
    <div>
      {/* Section orbital label */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1.0 }}
        className="mb-8 flex items-center justify-center gap-5"
      >
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8, ease: EASE }}
          className="block h-px origin-right"
          style={{ width: "80px", background: "linear-gradient(to right, transparent, rgba(200,164,78,0.25))" }}
        />
        <span
          className="font-sans text-[9px] font-[500] uppercase tracking-[0.32em]"
          style={{ fontFamily: "Syne, system-ui, sans-serif", color: "rgba(200,164,78,0.4)" }}
        >
          OS TRÊS PILARES
        </span>
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8, ease: EASE }}
          className="block h-px origin-left"
          style={{ width: "80px", background: "linear-gradient(to left, transparent, rgba(200,164,78,0.25))" }}
        />
      </motion.div>

      {/* Monumental portals — 3 columns separated by fine dividers */}
      <div
        className="relative flex flex-col md:flex-row w-full overflow-hidden"
        style={{
          background: "linear-gradient(180deg, rgba(6,12,20,0) 0%, rgba(6,12,20,0.4) 100%)",
          border: "0.5px solid rgba(255,255,255,0.04)",
        }}
      >
        {PORTALS.map((portal, i) => (
          <div key={portal.id} className="flex-1 flex flex-col md:flex-row">
            <PortalNode
              portal={portal}
              delay={0.12 * i}
              isActive={activeFace ? portal.face === activeFace : false}
            />
            {i < PORTALS.length - 1 && <PortalDivider />}
          </div>
        ))}
      </div>
    </div>
  );
}
