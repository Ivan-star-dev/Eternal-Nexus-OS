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
    path: "/school",
    glowColor: "hsl(42 78% 45% / 0.08)",
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
    path: "/lab",
    glowColor: "hsl(200 65% 40% / 0.08)",
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
    glowColor: "hsl(38 80% 42% / 0.07)",
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
    <Link to={portal.path} className="block flex-1" style={{ textDecoration: "none" }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ delay, duration: 1.0, ease: EASE }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex flex-col items-center justify-end text-center select-none overflow-hidden"
        style={{
          minHeight: "340px",
          borderRadius: "50% 50% 0 0 / 20% 20% 0 0",
          cursor: "pointer",
        }}
      >
        {/* Atmospheric chamber glow — rising from below like a world peeking up */}
        <div
          className="pointer-events-none absolute inset-0 transition-all duration-700"
          style={{
            background: `
              radial-gradient(ellipse at 50% 80%, ${portal.glowColor.replace(/[\d.]+\)$/, (m) => `${parseFloat(m) * (lit ? 2.5 : 1.5)})`)} 0%, transparent 70%),
              radial-gradient(ellipse at 50% 100%, rgba(6,12,20,0.3) 0%, transparent 50%)
            `,
          }}
          aria-hidden="true"
        />

        {/* Fine arc border at top — architectural arc */}
        <div
          className="pointer-events-none absolute top-0 left-[10%] right-[10%] transition-opacity duration-500"
          style={{
            height: "1px",
            background: `linear-gradient(to right, transparent, ${lit ? "rgba(200,164,78,0.3)" : "rgba(200,164,78,0.1)"}, transparent)`,
            borderRadius: "50%",
          }}
          aria-hidden="true"
        />

        {/* Active-face subtle ring */}
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              border: "0.5px solid rgba(200,164,78,0.15)",
              borderRadius: "50% 50% 0 0 / 20% 20% 0 0",
            }}
            aria-hidden="true"
          />
        )}

        {/* Content — positioned at bottom third */}
        <div className="relative z-10 pb-10 pt-24 px-6">
          {/* Pillar name — golden uppercase, bold */}
          <motion.h3
            animate={{ color: lit ? "hsl(42 78% 55%)" : "hsl(42 78% 45% / 0.85)" }}
            transition={{ duration: 0.35 }}
            className="font-sans font-[600] uppercase mb-1"
            style={{
              fontFamily: "Syne, system-ui, sans-serif",
              fontSize: "14px",
              letterSpacing: "0.2em",
            }}
          >
            {portal.pillarName}
          </motion.h3>

          {/* Regime word — temporal axis */}
          <motion.span
            animate={{ opacity: lit ? 0.6 : 0.35 }}
            transition={{ duration: 0.4 }}
            className="block font-sans font-[400] uppercase mb-0"
            style={{
              fontFamily: "Syne, system-ui, sans-serif",
              fontSize: "11px",
              letterSpacing: "0.16em",
              color: "#e4ebf0",
            }}
          >
            {portal.regimeWord}
          </motion.span>
        </div>
      </motion.div>
    </Link>
  );
}

interface TrinityRowProps {
  activeFace?: TrinityFace | null;
}

export default function TrinityRow({ activeFace }: TrinityRowProps) {
  return (
    <div className="relative">
      {/* Three arc-shaped chambers — worlds peeking up through the page */}
      <div className="relative flex flex-col md:flex-row w-full gap-3 md:gap-5">
        {PORTALS.map((portal, i) => (
          <PortalNode
            key={portal.id}
            portal={portal}
            delay={0.15 * i}
            isActive={activeFace ? portal.face === activeFace : false}
          />
        ))}
      </div>
    </div>
  );
}
