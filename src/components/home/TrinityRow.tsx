/**
 * TrinityRow.tsx
 * Sovereign tri-destination layer: School / Lab / Creation.
 * Distinct temporal regimes under one organism.
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
  pillar: string;
  regime: string;
  identity: string;
  ritual: string;
  path: string;
  vein: string;
  veil: string;
  threshold: string;
}

const PORTALS: Portal[] = [
  {
    id: "school",
    face: "bridge_nova",
    index: 1,
    pillar: "SCHOOL",
    regime: "Past",
    identity: "Memory becomes foundation.",
    ritual: "learn · retain · transmit",
    path: "/school",
    vein: "hsl(42 78% 52%)",
    veil: "radial-gradient(ellipse at 42% 30%, hsl(42 78% 52% / 0.16) 0%, transparent 64%)",
    threshold: "Enter Memory",
  },
  {
    id: "lab",
    face: "heaven_lab",
    index: 2,
    pillar: "LAB",
    regime: "Present",
    identity: "Reality enters examination.",
    ritual: "observe · test · decide",
    path: "/lab",
    vein: "hsl(172 55% 36%)",
    veil: "radial-gradient(ellipse at 52% 34%, hsl(172 55% 36% / 0.16) 0%, transparent 64%)",
    threshold: "Enter Examination",
  },
  {
    id: "creation",
    face: "nexus_cria",
    index: 3,
    pillar: "CREATION",
    regime: "Future",
    identity: "Form gains authorship.",
    ritual: "design · build · ship",
    path: "/workshop",
    vein: "hsl(205 100% 52%)",
    veil: "radial-gradient(ellipse at 56% 30%, hsl(205 100% 52% / 0.15) 0%, transparent 64%)",
    threshold: "Enter Authorship",
  },
];

function PortalNode({
  portal,
  delay,
  isActive,
}: {
  portal: Portal;
  delay: number;
  isActive: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const lit = hovered || isActive;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ delay, duration: 0.8, ease: EASE }}
      className="relative flex-1 overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="absolute inset-0" style={{ background: portal.veil }} aria-hidden />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, hsl(var(--background) / 0.2) 0%, transparent 22%, hsl(var(--background) / 0.55) 100%)",
        }}
        aria-hidden
      />

      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45 }}
          className="absolute inset-0"
          style={{ border: `0.5px solid ${portal.vein.replace(")", " / 0.45)")}` }}
          aria-hidden
        />
      )}

      <div
        className="relative z-10 flex h-full flex-col px-5 py-9 sm:px-7 sm:py-11 md:px-9 md:py-12"
        style={{ minHeight: "420px" }}
      >
        <div className="mb-5 flex items-center gap-3 sm:mb-7">
          <span
            className="font-mono text-[8px] tabular-nums sm:text-[9px]"
            style={{
              color: portal.vein.replace(")", " / 0.48)"),
              letterSpacing: "0.12em",
            }}
          >
            {String(portal.index).padStart(2, "0")}
          </span>
          <span
            className="font-sans text-[10px] uppercase sm:text-[11px]"
            style={{
              fontFamily: "Syne, system-ui, sans-serif",
              letterSpacing: "0.24em",
              color: lit ? portal.vein : portal.vein.replace(")", " / 0.72)"),
            }}
          >
            {portal.pillar}
          </span>
        </div>

        <div
          className="mb-8 h-px sm:mb-10"
          style={{
            background: `linear-gradient(to right, ${portal.vein.replace(")", ` / ${lit ? "0.42" : "0.18"})`)}, transparent)`,
          }}
        />

        <span
          className="mb-4 block font-serif italic leading-none sm:mb-6"
          style={{
            fontFamily: "Cormorant Garamond, Georgia, serif",
            fontSize: "clamp(2rem, 6.6vw, 3.5rem)",
            color: "hsl(var(--rx-text-prime) / 0.82)",
            opacity: lit ? 0.95 : 0.7,
          }}
        >
          {portal.regime}
        </span>

        <p
          className="max-w-[270px] font-sans text-[13px] leading-relaxed sm:text-[14px]"
          style={{
            fontFamily: "Syne, system-ui, sans-serif",
            color: "hsl(var(--rx-text-mid) / 0.96)",
          }}
        >
          {portal.identity}
        </p>

        <span
          className="mt-6 block font-mono text-[8px] uppercase sm:mt-8 sm:text-[9px]"
          style={{
            letterSpacing: "0.2em",
            color: portal.vein.replace(")", " / 0.55)"),
          }}
        >
          {portal.ritual}
        </span>

        <motion.div
          animate={{ opacity: lit ? 1 : 0.65, x: lit ? 3 : 0 }}
          transition={{ duration: 0.25 }}
          className="mt-auto pt-9"
        >
          <Link
            to={portal.path}
            className="inline-flex w-full items-center justify-between border px-3 py-2 font-sans text-[10px] uppercase sm:text-[11px]"
            style={{
              fontFamily: "Syne, system-ui, sans-serif",
              letterSpacing: "0.16em",
              color: lit ? portal.vein : "hsl(var(--rx-text-ghost) / 0.9)",
              borderColor: lit ? portal.vein.replace(")", " / 0.44)") : "hsl(var(--rx-rim) / 0.62)",
              background: "hsl(var(--background) / 0.46)",
            }}
          >
            <span>{portal.threshold}</span>
            <span aria-hidden>→</span>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

interface TrinityRowProps {
  activeFace?: TrinityFace | null;
}

export default function TrinityRow({ activeFace }: TrinityRowProps) {
  return (
    <section aria-label="Three sovereign portals">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-70px" }}
        transition={{ duration: 0.8 }}
        className="mb-8 flex items-center justify-center gap-4 sm:mb-10 sm:gap-6"
      >
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.7, ease: EASE }}
          className="block h-px origin-right"
          style={{
            width: "min(13vw, 88px)",
            background: "linear-gradient(to right, transparent, hsl(42 78% 52% / 0.3))",
          }}
        />
        <span
          className="font-sans text-[8px] uppercase sm:text-[9px]"
          style={{
            fontFamily: "Syne, system-ui, sans-serif",
            letterSpacing: "0.34em",
            color: "hsl(42 78% 52% / 0.62)",
          }}
        >
          One organism · Three portals
        </span>
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.7, ease: EASE }}
          className="block h-px origin-left"
          style={{
            width: "min(13vw, 88px)",
            background: "linear-gradient(to left, transparent, hsl(42 78% 52% / 0.3))",
          }}
        />
      </motion.div>

      <div
        className="relative overflow-hidden border"
        style={{
          borderColor: "hsl(var(--rx-rim) / 0.7)",
          background:
            "linear-gradient(180deg, hsl(var(--background) / 0) 0%, hsl(var(--background) / 0.3) 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse at 50% -12%, hsl(42 78% 52% / 0.09) 0%, transparent 62%)",
          }}
        />
        <div className="flex flex-col md:flex-row">
          {PORTALS.map((portal, i) => (
            <div
              key={portal.id}
              className={
                "relative flex-1 " +
                (i < PORTALS.length - 1
                  ? "border-b-[0.5px] border-b-[hsl(var(--rx-rim)_/_0.42)] md:border-b-0 md:border-r-[0.5px] md:border-r-[hsl(var(--rx-rim)_/_0.58)]"
                  : "")
              }
            >
              <PortalNode
                portal={portal}
                delay={i * 0.1}
                isActive={activeFace ? portal.face === activeFace : false}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
