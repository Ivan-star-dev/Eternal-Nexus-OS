/**
 * LiveEventStream.tsx — V12
 * Simulated live feed of world events. Cycles through a pool of 20 events
 * every 4 seconds. Keeps the last 8 visible; oldest drops off the bottom.
 * sacred-flow: V12 | LIVE_EVENT_STREAM | 2026-03-23
 */

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── types ───────────────────────────────────────────────────────────────────

type Category = "SEISMIC" | "ECONOMIC" | "POLITICAL" | "CLIMATE" | "TECHNOLOGY";

interface PoolEvent {
  cat: Category;
  loc: string;
  desc?: string;
  mag?: string;
}

interface LiveEvent extends PoolEvent {
  id: string;
  time: string;
}

// ─── event pool (20 events) ──────────────────────────────────────────────────

const EVENT_POOL: PoolEvent[] = [
  { cat: "SEISMIC", mag: "M4.2", loc: "Aegean Sea, Greece" },
  { cat: "ECONOMIC", loc: "Fed Reserve, USA", desc: "Interest rate decision imminent" },
  { cat: "POLITICAL", loc: "Brussels, EU", desc: "Emergency council session convened" },
  { cat: "CLIMATE", loc: "Amazon Basin, Brazil", desc: "Unusual precipitation pattern detected" },
  { cat: "TECHNOLOGY", loc: "Tokyo, Japan", desc: "Semiconductor output exceeds Q1 forecast" },
  { cat: "SEISMIC", mag: "M3.8", loc: "Pacific Ring, Philippines" },
  { cat: "ECONOMIC", loc: "Shanghai, China", desc: "Trade surplus widens 12% MoM" },
  { cat: "POLITICAL", loc: "Nairobi, Kenya", desc: "Regional summit opens — 14 heads of state" },
  { cat: "CLIMATE", loc: "North Sea, Norway", desc: "Wind generation hits seasonal record" },
  { cat: "TECHNOLOGY", loc: "Berlin, Germany", desc: "EV adoption rate crosses 40% threshold" },
  { cat: "SEISMIC", mag: "M5.1", loc: "Cascadia Subduction Zone, USA" },
  { cat: "ECONOMIC", loc: "Frankfurt, Germany", desc: "ECB signals pause in rate cycle" },
  { cat: "POLITICAL", loc: "Seoul, South Korea", desc: "Joint military exercise commences" },
  { cat: "CLIMATE", loc: "Sahel Region, Africa", desc: "Rainfall deficit reaches 30% below average" },
  { cat: "TECHNOLOGY", loc: "San Jose, USA", desc: "New chip architecture benchmark breaks record" },
  { cat: "SEISMIC", mag: "M3.4", loc: "Anatolian Fault, Turkey" },
  { cat: "ECONOMIC", loc: "Mumbai, India", desc: "Foreign capital inflows surge to 18-month high" },
  { cat: "POLITICAL", loc: "Geneva, Switzerland", desc: "Ceasefire mediation talks resume" },
  { cat: "CLIMATE", loc: "Arctic Circle, Canada", desc: "Sea ice extent 9% below decadal mean" },
  { cat: "TECHNOLOGY", loc: "Singapore", desc: "Quantum error rate drops below commercial threshold" },
];

// ─── category styling ────────────────────────────────────────────────────────

const CAT_STYLES: Record<Category, string> = {
  SEISMIC:    "bg-rose-500/15 text-rose-400 border-rose-500/30",
  ECONOMIC:   "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  POLITICAL:  "bg-blue-500/15 text-blue-400 border-blue-500/30",
  CLIMATE:    "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  TECHNOLOGY: "bg-violet-500/15 text-violet-400 border-violet-500/30",
};

// ─── helpers ─────────────────────────────────────────────────────────────────

let _uid = 0;
function uid(): string {
  return `ev-${Date.now()}-${++_uid}`;
}

function nowLabel(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
}

function buildEvent(pool: PoolEvent, idx: number): LiveEvent {
  return { ...pool, id: uid(), time: idx === 0 ? "now" : nowLabel() };
}

// ─── component ───────────────────────────────────────────────────────────────

const MAX_VISIBLE = 8;
const INTERVAL_MS = 4000;

export default function LiveEventStream() {
  const [events, setEvents] = useState<LiveEvent[]>(() => {
    // Pre-seed with first 4 events so the panel isn't empty on mount
    return EVENT_POOL.slice(0, 4).map((e, i) => buildEvent(e, i));
  });

  const poolIndexRef = useRef<number>(4 % EVENT_POOL.length);

  useEffect(() => {
    const interval = setInterval(() => {
      const idx = poolIndexRef.current;
      const next = buildEvent(EVENT_POOL[idx], -1);
      poolIndexRef.current = (idx + 1) % EVENT_POOL.length;

      setEvents((prev) => {
        const updated = [next, ...prev];
        return updated.slice(0, MAX_VISIBLE);
      });
    }, INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-ink-medium/40 border border-white/[0.05] rounded-sm backdrop-blur-sm overflow-hidden"
    >
      {/* ── header ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.05]">
        <span className="font-mono text-[0.42rem] tracking-[0.22em] text-white/40 uppercase">
          LIVE EVENT STREAM · V12
        </span>

        <div className="flex items-center gap-2">
          {/* pulsing red dot */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
          </span>
          <span className="font-mono text-[0.42rem] text-rose-400 tracking-[0.15em] uppercase">
            LIVE · UPDATING
          </span>
        </div>
      </div>

      {/* ── event list ── */}
      <div className="max-h-72 overflow-hidden">
        <AnimatePresence initial={false}>
          {events.map((ev) => (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ willChange: "transform, opacity" }}
              className="px-3 py-2.5 border-b border-white/[0.03] hover:bg-white/[0.015] transition-colors duration-200"
            >
              {/* row 1: badge · location · time */}
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`font-mono text-[0.42rem] tracking-[0.12em] uppercase px-2 py-0.5 border rounded-sm shrink-0 ${CAT_STYLES[ev.cat]}`}
                >
                  {ev.cat}
                </span>
                <span className="font-mono text-[0.5rem] tracking-[0.1em] text-paper-dim/70 truncate flex-1 min-w-0">
                  {ev.loc}
                </span>
                <span className="font-mono text-[0.42rem] text-paper-dim/30 shrink-0 ml-1">
                  {ev.time}
                </span>
              </div>

              {/* row 2: description or magnitude */}
              {(ev.desc || ev.mag) && (
                <p className="font-mono text-[0.44rem] tracking-[0.08em] text-white/35 pl-1 truncate">
                  {ev.mag ? `Magnitude ${ev.mag}` : ev.desc}
                </p>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ── footer ── */}
      <div className="px-4 py-2 border-t border-white/[0.03]">
        <span className="font-mono text-[0.38rem] tracking-[0.15em] text-white/15 uppercase">
          GLOBAL EVENT MONITOR · REAL-TIME · V12 · UPDATING EVERY 4S
        </span>
      </div>
    </motion.div>
  );
}
