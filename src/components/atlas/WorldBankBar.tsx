/**
 * WorldBankBar — V4-ATLAS-001
 *
 * Fixed bottom-left overlay showing World Bank macro indicators
 * for the currently selected Atlas project's country.
 * Appears on project selection, fades in with motion.
 */

import { motion, AnimatePresence } from "framer-motion";
import { Globe, TrendingUp, Users, DollarSign, Loader2 } from "lucide-react";
import type { WorldBankProjectData } from "@/hooks/useWorldBankProject";
import { formatUSD } from "@/lib/worldBankData";
import { EASE_OUT } from "@/lib/motion/config";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatPop(value: number | null): string {
  if (value === null || isNaN(value)) return "—";
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${Math.round(value / 1e6)}M`;
  if (value >= 1e3) return `${Math.round(value / 1e3)}K`;
  return String(value);
}

// ---------------------------------------------------------------------------
// WorldBankBar
// ---------------------------------------------------------------------------

interface WorldBankBarProps {
  data: WorldBankProjectData | null;
  projectName: string;
}

const METRICS = [
  {
    key: "gdp" as const,
    label: "GDP",
    icon: TrendingUp,
    format: (d: WorldBankProjectData) => d.gdp ? `${formatUSD(d.gdp.value)} (${d.gdp.date})` : "—",
  },
  {
    key: "population" as const,
    label: "POP",
    icon: Users,
    format: (d: WorldBankProjectData) => d.population ? `${formatPop(d.population.value)} (${d.population.date})` : "—",
  },
  {
    key: "fdi" as const,
    label: "FDI",
    icon: DollarSign,
    format: (d: WorldBankProjectData) => d.fdi ? `${formatUSD(d.fdi.value)} (${d.fdi.date})` : "—",
  },
];

export default function WorldBankBar({ data, projectName }: WorldBankBarProps) {
  return (
    <AnimatePresence>
      {data && (
        <motion.div
          key={projectName}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
          className="fixed bottom-20 left-4 z-40 bg-card/90 backdrop-blur-xl border border-primary/20 rounded-lg px-3 py-2 shadow-lg min-w-[220px]"
        >
          {/* Header */}
          <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-border/20">
            <Globe className="h-3 w-3 text-primary/60" />
            <span className="font-mono text-[0.45rem] tracking-[0.2em] text-primary/60 uppercase">
              World Bank
            </span>
            <span className="font-mono text-[0.45rem] text-muted-foreground ml-auto">
              {data.countryName}
            </span>
            <span className="font-mono text-[0.4rem] text-primary/40 bg-primary/10 px-1 rounded">
              {data.countryCode}
            </span>
          </div>

          {/* Metrics */}
          {data.loading ? (
            <div className="flex items-center gap-1.5 py-1">
              <Loader2 className="h-3 w-3 animate-spin text-primary/40" />
              <span className="font-mono text-[0.45rem] text-muted-foreground">fetching indicators...</span>
            </div>
          ) : (
            <div className="space-y-1">
              {METRICS.map(({ key, label, icon: Icon, format }) => (
                <div key={key} className="flex items-center gap-2">
                  <Icon className="h-2.5 w-2.5 text-primary/40 shrink-0" />
                  <span className="font-mono text-[0.42rem] text-muted-foreground/70 w-6">{label}</span>
                  <span className="font-mono text-[0.48rem] text-foreground">
                    {format(data)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Source badge */}
          <div className="mt-1.5 pt-1 border-t border-border/10">
            <span className="font-mono text-[0.38rem] text-muted-foreground/40">
              Source: World Bank Open Data · api.worldbank.org
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
