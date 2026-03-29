/**
 * StrategicLayer.tsx
 * Strategic institutional chambers — Geopolitics · Investor Briefing · Founder Truth
 *
 * Sober. World-linked. High-trust. Editorial but alive.
 * Not promotional — factual, strategic, part of the same mother organism.
 *
 * Canon: RUBERRA Visual Mother ID · Strategic Institutional Layer
 */

import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const EASE = [0.22, 1, 0.36, 1] as const;

interface StrategicChamber {
  id: string;
  label: string;
  summary: string;
  path: string;
  ctaLabel: string;
  iconChar: string;
}

const CHAMBERS: StrategicChamber[] = [
  {
    id: "geopolitics",
    label: "GEOPOLÍTICA",
    summary:
      "Real-time geopolitical intelligence. Pressure zones, crisis signals, and planetary-scale forces under structured analysis.",
    path: "/geopolitics",
    ctaLabel: "Explore →",
    iconChar: "◦",
  },
  {
    id: "investor",
    label: "INVESTOR BRIEFING",
    summary:
      "A structured presentation of the system's architecture, capital logic, and the evidence base for sovereign infrastructure investment.",
    path: "/investor-briefing",
    ctaLabel: "View Briefing →",
    iconChar: "◦",
  },
  {
    id: "founder",
    label: "FOUNDER TRUTH",
    summary:
      "The origin, the mission, and the logic behind one organism built to govern at scale — told without simplification.",
    path: "/about",
    ctaLabel: "Read More →",
    iconChar: "◦",
  },
];

export default function StrategicLayer() {
  return (
    <section
      className="relative px-4 sm:px-6 md:px-16 lg:px-20 py-20 sm:py-28"
      aria-label="Camadas estratégicas"
    >
      {/* Section label */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8 }}
        className="flex items-center gap-5 mb-14"
      >
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.7, ease: EASE }}
          className="block h-px origin-left"
          style={{
            width: "64px",
            background: "linear-gradient(to right, rgba(200,164,78,0.3), transparent)",
          }}
        />
        <span
          className="font-sans text-[9px] font-[500] uppercase tracking-[0.3em]"
          style={{
            fontFamily: "Syne, system-ui, sans-serif",
            color: "rgba(200,164,78,0.45)",
          }}
        >
          CAMADAS ESTRATÉGICAS
        </span>
      </motion.div>

      {/* 3-column editorial grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-px"
        style={{ background: "rgba(255,255,255,0.04)" }}
      >
        {CHAMBERS.map((chamber, i) => (
          <motion.div
            key={chamber.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: i * 0.1, duration: 0.75, ease: EASE }}
            className="group relative flex flex-col px-8 py-10"
            style={{
              background: "hsl(216 40% 8% / 0.6)",
              backdropFilter: "blur(12px)",
            }}
          >
            {/* Icon character */}
            <span
              className="block font-mono mb-5"
              style={{
                fontSize: "10px",
                color: "rgba(200,164,78,0.25)",
                letterSpacing: "0.1em",
              }}
            >
              {chamber.iconChar}
            </span>

            {/* Label */}
            <span
              className="block font-sans font-[500] uppercase mb-4"
              style={{
                fontFamily: "Syne, system-ui, sans-serif",
                fontSize: "10px",
                letterSpacing: "0.2em",
                color: "rgba(200,164,78,0.7)",
              }}
            >
              {chamber.label}
            </span>

            {/* Summary */}
            <p
              className="font-sans font-[400] leading-relaxed mb-8 flex-1"
              style={{
                fontFamily: "Syne, system-ui, sans-serif",
                fontSize: "13px",
                color: "rgba(228,235,240,0.45)",
                maxWidth: "320px",
              }}
            >
              {chamber.summary}
            </p>

            {/* CTA */}
            <Link
              to={chamber.path}
              className="font-mono font-[400] transition-colors duration-200"
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "10px",
                letterSpacing: "0.12em",
                color: "rgba(200,164,78,0.4)",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.color = "rgba(200,164,78,0.8)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.color = "rgba(200,164,78,0.4)";
              }}
            >
              {chamber.ctaLabel}
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
