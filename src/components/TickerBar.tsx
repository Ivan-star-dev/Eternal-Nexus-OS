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
  return (
    <div className="border-y border-primary/15 bg-card/60 backdrop-blur-sm overflow-hidden relative">
      <div className="flex items-center gap-6 py-3 px-6">
        {/* Label */}
        <span className="font-mono text-[0.58rem] tracking-[0.2em] text-primary uppercase whitespace-nowrap flex-shrink-0 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-dot" />
          LIVE · NPI REGISTRY
        </span>

        {/* Track */}
        <div className="overflow-hidden flex-1">
          <motion.div
            className="flex gap-12 whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span key={i} className="font-mono text-[0.62rem] text-muted-foreground">
                {item.text}{" "}
                {item.highlight && (
                  <span className="text-accent-foreground">{item.highlight}</span>
                )}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TickerBar;
