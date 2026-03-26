/**
 * GlobeLayerSelector.tsx — Globe Layer Control
 *
 * Minimal layer toggle for the globe — projects · seismic · air quality.
 * Sits bottom-right of the globe zone. Never competes with the globe.
 *
 * Typography: JetBrains Mono · 9px · tracking 0.14em
 * Color: active = teal · inactive = paper-dim/30
 */

import { motion } from "framer-motion";

interface Layers {
  projects: boolean;
  seismic: boolean;
}

interface GlobeLayerSelectorProps {
  layers: Layers;
  onToggle: (layer: string) => void;
}

const LAYER_LABELS: { key: keyof Layers; label: string }[] = [
  { key: "projects", label: "Projects" },
  { key: "seismic", label: "Seismic" },
];

export default function GlobeLayerSelector({ layers, onToggle }: GlobeLayerSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.8, duration: 0.7 }}
      className="absolute bottom-14 right-6 z-[4] flex flex-col gap-1.5"
      aria-label="Globe layer controls"
    >
      {LAYER_LABELS.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onToggle(key)}
          className="flex items-center gap-2 group cursor-pointer"
          aria-pressed={layers[key]}
          aria-label={`Toggle ${label} layer`}
        >
          {/* Indicator dot */}
          <span
            className="block w-1.5 h-1.5 rounded-full transition-all duration-300"
            style={{
              background: layers[key]
                ? "hsl(172 48% 52%)"
                : "rgba(255,255,255,0.2)",
              boxShadow: layers[key]
                ? "0 0 6px hsl(172 48% 52% / 0.6)"
                : "none",
            }}
          />
          <span
            className="font-mono text-[9px] uppercase transition-colors duration-200"
            style={{
              fontFamily: "JetBrains Mono, monospace",
              letterSpacing: "0.14em",
              color: layers[key]
                ? "hsl(172 48% 52% / 0.8)"
                : "rgba(255,255,255,0.25)",
            }}
          >
            {label}
          </span>
        </button>
      ))}
    </motion.div>
  );
}
