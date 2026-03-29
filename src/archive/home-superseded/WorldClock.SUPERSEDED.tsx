/**
 * WorldClock.tsx
 * Live multi-city clock — 6 cities, updates every second.
 * sacred-flow: WorldClock | WORLD_TIME_1 | 2026-03-23
 */

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// ─── types ───────────────────────────────────────────────────────────────────

interface City {
  name: string;
  timeZone: string;
  code: string;
}

// ─── config ──────────────────────────────────────────────────────────────────

const CITIES: City[] = [
  { name: "São Paulo", timeZone: "America/Sao_Paulo", code: "BRA" },
  { name: "London",    timeZone: "Europe/London",     code: "GBR" },
  { name: "Lagos",     timeZone: "Africa/Lagos",      code: "NGA" },
  { name: "Berlin",    timeZone: "Europe/Berlin",     code: "DEU" },
  { name: "Mumbai",    timeZone: "Asia/Kolkata",      code: "IND" },
  { name: "Tokyo",     timeZone: "Asia/Tokyo",        code: "JPN" },
];

// ─── helpers ─────────────────────────────────────────────────────────────────

function getTime(timeZone: string): string {
  return new Date().toLocaleTimeString("en-GB", {
    timeZone,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function getOffset(timeZone: string): string {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      timeZoneName: "short",
    });
    const parts = formatter.formatToParts(now);
    const tzPart = parts.find((p) => p.type === "timeZoneName");
    return tzPart ? tzPart.value : timeZone;
  } catch {
    return timeZone;
  }
}

// ─── sub-component ────────────────────────────────────────────────────────────

interface CityClockProps {
  city: City;
  time: string;
  isLast: boolean;
}

function CityClock({ city, time, isLast }: CityClockProps) {
  const offset = getOffset(city.timeZone);

  return (
    <div
      className={`flex flex-col items-center justify-center flex-1 py-4 px-4 gap-1.5 ${
        !isLast ? "border-r border-white/[0.05]" : ""
      }`}
    >
      <span className="font-mono text-[0.45rem] tracking-[0.25em] uppercase text-paper-dim/40 truncate w-full text-center">
        {city.name}
      </span>
      <span className="font-mono text-xl font-light text-paper tabular-nums">
        {time}
      </span>
      <span className="font-mono text-[0.42rem] tracking-[0.15em] text-paper-dim/30">
        {offset}
      </span>
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export function WorldClock() {
  const [times, setTimes] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const city of CITIES) {
      initial[city.timeZone] = getTime(city.timeZone);
    }
    return initial;
  });

  useEffect(() => {
    const id = setInterval(() => {
      const next: Record<string, string> = {};
      for (const city of CITIES) {
        next[city.timeZone] = getTime(city.timeZone);
      }
      setTimes(next);
    }, 1000);

    return () => clearInterval(id);
  }, []);

  return (
    <motion.section
      className="border-y border-white/[0.04] py-8 px-6 md:px-16 bg-ink-deep/40"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      {/* label */}
      <p className="font-mono text-[0.45rem] tracking-[0.3em] text-gold/40 uppercase text-center mb-6">
        WORLD TIME · SYNCHRONIZED
      </p>

      {/* city strip */}
      <div className="flex flex-col sm:flex-row w-full divide-y divide-white/[0.05] sm:divide-y-0">
        {CITIES.map((city, i) => (
          <CityClock
            key={city.timeZone}
            city={city}
            time={times[city.timeZone] ?? "--:--:--"}
            isLast={i === CITIES.length - 1}
          />
        ))}
      </div>
    </motion.section>
  );
}

export default WorldClock;
