/**
 * OrbitalChamber.tsx — Sacred Orbital Wrapper
 *
 * The breathing container that gives the globe its sacred status.
 * Not decoration — it is the frame that declares: "this is the centre."
 *
 * Law: HEAVEN_LAB_REFERENCE_SURFACE.md — BLOCO 1 GLOBE
 *   - Glass depth (backdrop-filter)
 *   - Z-layer breathing — outer ring pulses with life
 *   - Inner sanctum — dark radial core, never competing with globe
 *   - Aurora rim — faint gold/teal edge light, appears on mount
 *
 * Motion: derives from src/lib/motion/config.ts
 * Colour: gold hsl(42 78% 45%) · teal hsl(172 55% 28%)
 */

import { motion } from "framer-motion";
import { ORBITAL_PULSE } from "@/lib/motion/config";

interface OrbitalChamberProps {
  children: React.ReactNode;
  /** Size class applied to the outer ring. Default: fills parent. */
  className?: string;
}

/**
 * Outer ring — breathing glass border
 * Pulses opacity/scale on ambient loop. Never covers the globe.
 */
function OuterRing() {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 rounded-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: ORBITAL_PULSE.opacity, scale: ORBITAL_PULSE.scale }}
      transition={ORBITAL_PULSE.transition as Parameters<typeof motion.div>[0]["transition"]}
      style={{
        border: "0.5px solid rgba(255,255,255,0.07)",
        boxShadow: [
          "inset 0 0 120px rgba(0,0,0,0.25)",
          "0 0 80px -20px hsl(42 78% 45% / 0.06)",
          "0 0 120px -40px hsl(172 55% 28% / 0.04)",
        ].join(", "),
      }}
      aria-hidden="true"
    />
  );
}

/**
 * Aurora rim — very faint gold edge light, enters once on mount
 */
function AuroraRim() {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 rounded-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1], delay: 0.8 }}
      style={{
        background: [
          "radial-gradient(ellipse 90% 40% at 50% 0%, hsl(42 78% 45% / 0.04) 0%, transparent 70%)",
          "radial-gradient(ellipse 60% 30% at 50% 100%, hsl(172 55% 28% / 0.03) 0%, transparent 70%)",
        ].join(", "),
      }}
      aria-hidden="true"
    />
  );
}

/**
 * Inner sanctum — dark radial core behind the globe.
 * Deepens perceived depth without flattening the 3D render.
 */
function InnerSanctum() {
  return (
    <div
      className="pointer-events-none absolute inset-0 rounded-full"
      style={{
        background:
          "radial-gradient(ellipse 60% 60% at 50% 50%, hsl(216 50% 4% / 0.5) 0%, transparent 70%)",
      }}
      aria-hidden="true"
    />
  );
}

export default function OrbitalChamber({ children, className = "" }: OrbitalChamberProps) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        isolation: "isolate",
      }}
    >
      <InnerSanctum />
      <AuroraRim />

      {/* Globe render — z-index above inner sanctum, below outer ring */}
      <div className="relative z-[1]">{children}</div>

      <OuterRing />
    </div>
  );
}
