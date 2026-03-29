/**
 * EarthquakeMonitor.tsx — V12 Real-Time World
 * Live seismic activity monitor. Displays 6 of 12 pooled earthquakes,
 * cycling in 1 new entry every 8 seconds.
 * sacred-flow: V12 | SEISMIC_LAYER | 2026-03-23
 */

"use client";

import { useEffect, useState } from "react";

// ─── types ────────────────────────────────────────────────────────────────────

interface QuakeEntry {
  id: string;
  magnitude: number;
  location: string;
  time: string;
  depth: number; // km
}

// ─── pool of 12 earthquakes ───────────────────────────────────────────────────

const QUAKE_POOL: QuakeEntry[] = [
  { id: "q01", magnitude: 5.1, location: "Sumatra, Indonesia",        time: "2026-03-23 04:12 UTC", depth: 18 },
  { id: "q02", magnitude: 4.8, location: "Aleutian Islands, USA",     time: "2026-03-23 03:47 UTC", depth: 25 },
  { id: "q03", magnitude: 3.9, location: "Central Italy",              time: "2026-03-23 03:21 UTC", depth: 10 },
  { id: "q04", magnitude: 6.2, location: "Tonga Trench",               time: "2026-03-23 02:55 UTC", depth: 35 },
  { id: "q05", magnitude: 4.1, location: "Anatolia, Turkey",           time: "2026-03-23 02:30 UTC", depth: 12 },
  { id: "q06", magnitude: 5.7, location: "Chile Subduction Zone",      time: "2026-03-23 01:44 UTC", depth: 30 },
  { id: "q07", magnitude: 3.6, location: "Aegean Sea, Greece",         time: "2026-03-23 01:12 UTC", depth: 10 },
  { id: "q08", magnitude: 4.4, location: "Philippine Sea",             time: "2026-03-23 00:38 UTC", depth: 20 },
  { id: "q09", magnitude: 5.3, location: "New Zealand",                time: "2026-03-22 23:54 UTC", depth: 22 },
  { id: "q10", magnitude: 4.7, location: "Cascadia, USA",              time: "2026-03-22 23:21 UTC", depth: 15 },
  { id: "q11", magnitude: 3.8, location: "Northern Algeria",           time: "2026-03-22 22:48 UTC", depth: 10 },
  { id: "q12", magnitude: 5.9, location: "Java, Indonesia",            time: "2026-03-22 22:15 UTC", depth: 28 },
];

// ─── helpers ─────────────────────────────────────────────────────────────────

function magBadgeClass(mag: number): string {
  if (mag >= 6)   return "bg-rose-500/20 text-rose-400 border border-rose-500/30";
  if (mag >= 5)   return "bg-amber-400/20 text-amber-300 border border-amber-400/30";
  if (mag >= 4)   return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
  return              "bg-blue-500/20 text-blue-400 border border-blue-500/30";
}

// ─── quake row ────────────────────────────────────────────────────────────────

function QuakeRow({ quake, isNew }: { quake: QuakeEntry; isNew: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 py-2.5 border-b border-white/[0.04] last:border-b-0 transition-all duration-700 ${
        isNew ? "bg-white/[0.03]" : ""
      }`}
    >
      {/* magnitude badge */}
      <span
        className={`shrink-0 inline-flex items-center justify-center w-12 h-6 rounded text-[11px] font-mono font-semibold tabular-nums ${magBadgeClass(
          quake.magnitude
        )}`}
      >
        M{quake.magnitude.toFixed(1)}
      </span>

      {/* location */}
      <span className="flex-1 text-[12px] text-white/70 truncate">
        {quake.location}
      </span>

      {/* depth */}
      <span className="shrink-0 text-[10px] font-mono text-white/30 tabular-nums">
        {quake.depth}km
      </span>

      {/* time */}
      <span className="shrink-0 text-[10px] font-mono text-white/30 text-right min-w-[130px]">
        {quake.time}
      </span>
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export default function EarthquakeMonitor() {
  // Start with first 6 entries; track the next pool index and the newest entry id
  const [visible, setVisible] = useState<QuakeEntry[]>(QUAKE_POOL.slice(0, 6));
  const [nextIndex, setNextIndex] = useState<number>(6);
  const [newestId, setNewestId] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setNextIndex((prev) => {
        const idx = prev % QUAKE_POOL.length;
        const incoming = QUAKE_POOL[idx];

        setVisible((current) => {
          // drop oldest, prepend newest
          const updated = [incoming, ...current.slice(0, 5)];
          return updated;
        });
        setNewestId(incoming.id);

        return idx + 1;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Clear the "new" highlight after 1 tick
  useEffect(() => {
    if (newestId === null) return;
    const t = setTimeout(() => setNewestId(null), 1200);
    return () => clearTimeout(t);
  }, [newestId]);

  return (
    <section
      aria-label="Seismic Monitor"
      className="border-y border-white/[0.04] bg-ink-medium/10 py-4 px-6 md:px-16"
    >
      {/* header */}
      <div className="mb-3 flex items-center gap-2">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rose-400" />
        </span>
        <span className="text-[9px] font-mono tracking-[0.2em] text-white/30 uppercase">
          SEISMIC MONITOR · V12 · LIVE
        </span>
      </div>

      {/* column headers */}
      <div className="flex items-center gap-3 mb-1 pb-1.5 border-b border-white/[0.06]">
        <span className="w-12 text-[9px] font-mono text-white/20 uppercase tracking-wider shrink-0">
          MAG
        </span>
        <span className="flex-1 text-[9px] font-mono text-white/20 uppercase tracking-wider">
          LOCATION
        </span>
        <span className="shrink-0 text-[9px] font-mono text-white/20 uppercase tracking-wider">
          DEPTH
        </span>
        <span className="shrink-0 min-w-[130px] text-right text-[9px] font-mono text-white/20 uppercase tracking-wider">
          TIME (UTC)
        </span>
      </div>

      {/* rows */}
      <div>
        {visible.map((q) => (
          <QuakeRow key={q.id} quake={q} isNew={q.id === newestId} />
        ))}
      </div>

      {/* footer */}
      <p className="mt-3 text-[9px] font-mono tracking-[0.15em] text-white/20 uppercase">
        USGS-COMPATIBLE DATA SCHEMA · GLOBAL SEISMIC NETWORK · V12
      </p>
    </section>
  );
}
