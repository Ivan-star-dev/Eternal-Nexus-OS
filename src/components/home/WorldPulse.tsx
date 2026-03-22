/**
 * WorldPulse.tsx — PLv7.1
 * Real-time USGS seismic events feed. Refetches every 60 seconds.
 * sacred-flow: PLv7.1 | DATA_LAYER_1 | 2026-03-22
 */

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchRecentEarthquakes, EarthquakePoint } from "@/lib/earthquakeData";

// ─── helpers ────────────────────────────────────────────────────────────────

function timeAgo(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffH = diffMs / (1000 * 60 * 60);
  if (diffH < 1) return "< 1h ago";
  if (diffH < 24) return `${Math.floor(diffH)}h ago`;
  return `${Math.floor(diffH / 24)}d ago`;
}

function magColor(mag: number): string {
  if (mag >= 6) return "bg-red-500/20 text-red-400 border border-red-500/30";
  if (mag >= 5) return "bg-amber-500/20 text-amber-400 border border-amber-500/30";
  return "bg-teal-500/20 text-teal-400 border border-teal-500/30";
}

// ─── skeleton row ────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 py-2.5 px-3 border-b border-white/[0.03]">
      <div className="w-10 h-5 rounded animate-pulse bg-white/[0.03]" />
      <div className="flex-1 h-3.5 rounded animate-pulse bg-white/[0.03]" />
      <div className="w-14 h-3 rounded animate-pulse bg-white/[0.03]" />
    </div>
  );
}

// ─── main component ──────────────────────────────────────────────────────────

export default function WorldPulse() {
  const [events, setEvents] = useState<EarthquakePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastFetch, setLastFetch] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await fetchRecentEarthquakes();
      const sorted = [...data].sort(
        (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
      );
      setEvents(sorted.slice(0, 10));
      setLastFetch(Date.now());
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 60_000);
    return () => clearInterval(interval);
  }, [load]);

  const isFresh = lastFetch !== null && Date.now() - lastFetch < 90_000;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-ink-medium/60 border border-white/[0.05] rounded-sm backdrop-blur-sm overflow-hidden"
    >
      {/* header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.05]">
        <div className="flex items-center gap-2">
          {isFresh && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
            </span>
          )}
          <span className="font-mono text-[0.48rem] tracking-[0.28em] text-gold/60 uppercase">
            Seismic Pulse · Live
          </span>
        </div>
        <span className="font-mono text-[0.4rem] tracking-[0.18em] text-white/20 uppercase">
          USGS · M4.5+
        </span>
      </div>

      {/* list */}
      <div className="max-h-64 overflow-y-auto">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
        ) : error || events.length === 0 ? (
          <div className="py-8 px-4 text-center">
            <span className="font-mono text-[0.55rem] tracking-[0.15em] text-white/20 uppercase">
              {error ? "Feed unavailable" : "No recent events"}
            </span>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {events.map((eq, i) => (
              <motion.div
                key={eq.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
                className="flex items-center gap-3 py-2.5 px-3 border-b border-white/[0.03] hover:bg-white/[0.015] transition-colors"
              >
                {/* magnitude badge */}
                <span
                  className={`font-mono text-xs font-bold rounded px-1.5 py-0.5 min-w-[2.4rem] text-center ${magColor(eq.mag)}`}
                >
                  {eq.mag.toFixed(1)}
                </span>

                {/* place */}
                <span className="flex-1 font-sans text-[0.65rem] text-paper/80 truncate min-w-0">
                  {eq.place}
                </span>

                {/* tsunami indicator */}
                {eq.tsunami && (
                  <span className="font-mono text-[0.4rem] tracking-[0.12em] text-blue-400/80 uppercase border border-blue-400/20 rounded px-1 py-0.5 shrink-0">
                    TSU
                  </span>
                )}

                {/* time ago */}
                <span className="font-mono text-[0.5rem] tracking-[0.1em] text-white/30 uppercase shrink-0">
                  {timeAgo(eq.time)}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* footer */}
      {!loading && events.length > 0 && (
        <div className="px-4 py-2 border-t border-white/[0.03]">
          <span className="font-mono text-[0.4rem] tracking-[0.15em] text-white/15 uppercase">
            {events.length} events · auto-refresh 60s
          </span>
        </div>
      )}
    </motion.div>
  );
}
