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
import { ORBITAL_PULSE, EASE_OUT, DUR } from "@/lib/motion/config";

interface OrbitalChamberProps {
  children: React.ReactNode;
  /** Size class applied to the outer ring. Default: fills parent. */
  className?: string;
  /** When true (hotspot hovered/clicked), intensify the aurora rim. */
  focused?: boolean;
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
 * Aurora rim — gold/teal edge light. Intensifies when a hotspot is focused.
 */
function AuroraRim({ focused }: { focused?: boolean }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 rounded-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: focused ? 1 : 0.7 }}
      transition={{ duration: focused ? DUR.fast : DUR.cinematic, ease: EASE_OUT, delay: focused ? 0 : 0.8 }}
      style={{
        background: focused
          ? [
              "radial-gradient(ellipse 100% 50% at 50% 0%, hsl(42 78% 45% / 0.14) 0%, transparent 70%)",
              "radial-gradient(ellipse 80% 40% at 50% 100%, hsl(172 55% 28% / 0.10) 0%, transparent 70%)",
              "radial-gradient(ellipse 50% 80% at 0% 50%, hsl(172 55% 40% / 0.06) 0%, transparent 60%)",
              "radial-gradient(ellipse 50% 80% at 100% 50%, hsl(42 78% 45% / 0.06) 0%, transparent 60%)",
            ].join(", ")
          : [
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

export default function OrbitalChamber({ children, className = "", focused }: OrbitalChamberProps) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        isolation: "isolate",
      }}
    >
      <InnerSanctum />
      <AuroraRim focused={focused} />

      {/* Globe render — z-index above inner sanctum, below outer ring */}
      <div className="relative z-[1]">{children}</div>

      <OuterRing />
    </div>
  );
}
