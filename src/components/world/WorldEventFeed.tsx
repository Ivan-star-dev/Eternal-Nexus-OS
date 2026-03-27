/**
 * WorldEventFeed.tsx — K-07 IMPL
 * V4-WORLD-FEATURES-001 | 2026-03-27
 *
 * Vertical feed of world events with icon, location, description, timestamp.
 * Dark theme, electric blue accents.
 * Clicking an event fires onFocusRegion(lat, lng) to focus the globe camera.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Wind,
  Zap,
  FlaskConical,
  Globe,
  Waves,
  Thermometer,
  Radio,
} from "lucide-react";

export interface WorldEvent {
  id: string;
  type: "seismic" | "climate" | "infrastructure" | "research" | "signal";
  icon: React.ReactNode;
  location: string;
  lat: number;
  lng: number;
  description: string;
  timestamp: Date;
  severity: "low" | "medium" | "high";
}

interface WorldEventFeedProps {
  onFocusRegion?: (lat: number, lng: number) => void;
  className?: string;
  maxItems?: number;
}

const SEVERITY_COLOR: Record<WorldEvent["severity"], string> = {
  low: "rgba(0,170,255,0.5)",
  medium: "rgba(200,164,78,0.7)",
  high: "rgba(220,60,60,0.8)",
};

const SEVERITY_BG: Record<WorldEvent["severity"], string> = {
  low: "rgba(0,170,255,0.06)",
  medium: "rgba(200,164,78,0.06)",
  high: "rgba(220,60,60,0.06)",
};

const MOCK_EVENTS: WorldEvent[] = [
  {
    id: "ev-001",
    type: "seismic",
    icon: <AlertTriangle size={12} />,
    location: "Ring of Fire, Pacific",
    lat: 35.6762,
    lng: 139.6503,
    description: "M4.7 seismic event recorded near subduction zone boundary.",
    timestamp: new Date(Date.now() - 1000 * 60 * 4),
    severity: "medium",
  },
  {
    id: "ev-002",
    type: "climate",
    icon: <Thermometer size={12} />,
    location: "Sub-Saharan Africa",
    lat: 6.5244,
    lng: 3.3792,
    description: "Surface temperature anomaly +2.3°C above 30-year average.",
    timestamp: new Date(Date.now() - 1000 * 60 * 11),
    severity: "high",
  },
  {
    id: "ev-003",
    type: "infrastructure",
    icon: <Zap size={12} />,
    location: "Rotterdam, NL",
    lat: 51.9225,
    lng: 4.4792,
    description: "DeltaSpine NL test corridor — phase 2 magnetic coupling verified.",
    timestamp: new Date(Date.now() - 1000 * 60 * 19),
    severity: "low",
  },
  {
    id: "ev-004",
    type: "research",
    icon: <FlaskConical size={12} />,
    location: "Fogo, Cabo Verde",
    lat: 14.9305,
    lng: -24.3534,
    description: "GeoCore Power: MHD graphene efficiency measured at 44.2% in lab conditions.",
    timestamp: new Date(Date.now() - 1000 * 60 * 33),
    severity: "low",
  },
  {
    id: "ev-005",
    type: "seismic",
    icon: <Waves size={12} />,
    location: "Sumatra, Indonesia",
    lat: -0.7893,
    lng: 113.9213,
    description: "Subsurface displacement 18cm detected along Sunda Trench.",
    timestamp: new Date(Date.now() - 1000 * 60 * 48),
    severity: "medium",
  },
  {
    id: "ev-006",
    type: "climate",
    icon: <Wind size={12} />,
    location: "Gulf of Mexico",
    lat: 23.634,
    lng: -90.0,
    description: "Cat-2 storm system forming. 72h trajectory modeled with Terra Lenta inputs.",
    timestamp: new Date(Date.now() - 1000 * 60 * 62),
    severity: "high",
  },
  {
    id: "ev-007",
    type: "signal",
    icon: <Radio size={12} />,
    location: "Seoul, Republic of Korea",
    lat: 37.5665,
    lng: 126.978,
    description: "Chip Fold Lab: nanofibrillar cellulose batch yielding 94x perf baseline.",
    timestamp: new Date(Date.now() - 1000 * 60 * 87),
    severity: "low",
  },
  {
    id: "ev-008",
    type: "research",
    icon: <Globe size={12} />,
    location: "Global — Model Sync",
    lat: 0,
    lng: 0,
    description: "Fusion Core integration model v0.4 — partial output consensus reached.",
    timestamp: new Date(Date.now() - 1000 * 60 * 110),
    severity: "low",
  },
];

function formatAge(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
}

function EventRow({
  event,
  onFocusRegion,
  isSelected,
  onSelect,
}: {
  event: WorldEvent;
  onFocusRegion?: (lat: number, lng: number) => void;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const color = SEVERITY_COLOR[event.severity];
  const bg = SEVERITY_BG[event.severity];

  return (
    <motion.button
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ x: 3 }}
      onClick={() => {
        onSelect();
        onFocusRegion?.(event.lat, event.lng);
      }}
      className="w-full text-left group"
      aria-pressed={isSelected}
      aria-label={`World event: ${event.description}`}
    >
      <div
        className="flex gap-3 px-3 py-3 transition-all duration-200"
        style={{
          background: isSelected ? bg : "transparent",
          borderLeft: `2px solid ${isSelected ? color : "rgba(255,255,255,0.04)"}`,
        }}
      >
        {/* Icon */}
        <div
          className="flex-shrink-0 mt-0.5 flex items-center justify-center rounded-full"
          style={{
            width: "22px",
            height: "22px",
            background: bg,
            color,
          }}
        >
          {event.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-0.5">
            <span
              className="font-mono text-[9px] tracking-[0.14em] uppercase truncate"
              style={{ color: color }}
            >
              {event.location}
            </span>
            <span
              className="font-mono text-[8px] tracking-[0.1em] flex-shrink-0"
              style={{ color: "rgba(228,235,240,0.22)" }}
            >
              {formatAge(event.timestamp)}
            </span>
          </div>
          <p
            className="font-sans text-[11px] leading-[1.55] line-clamp-2"
            style={{ color: "rgba(228,235,240,0.62)" }}
          >
            {event.description}
          </p>
        </div>
      </div>

      {/* Bottom separator */}
      <div
        style={{
          height: "0.5px",
          background: "rgba(255,255,255,0.04)",
          marginLeft: "38px",
        }}
      />
    </motion.button>
  );
}

export default function WorldEventFeed({
  onFocusRegion,
  className = "",
  maxItems = 8,
}: WorldEventFeedProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const events = MOCK_EVENTS.slice(0, maxItems);

  return (
    <div
      className={`flex flex-col ${className}`}
      style={{
        background: "rgba(6,12,20,0.88)",
        border: "0.5px solid rgba(0,170,255,0.1)",
        backdropFilter: "blur(16px)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "0.5px solid rgba(0,170,255,0.08)" }}
      >
        <div className="flex items-center gap-2">
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: "#00aaff",
              flexShrink: 0,
            }}
          />
          <span
            className="font-mono text-[9px] tracking-[0.22em] uppercase"
            style={{ color: "rgba(0,170,255,0.7)" }}
          >
            World Event Feed
          </span>
        </div>
        <span
          className="font-mono text-[8px] tracking-[0.12em] uppercase"
          style={{ color: "rgba(228,235,240,0.18)" }}
        >
          {events.length} signals
        </span>
      </div>

      {/* Events list */}
      <div className="overflow-y-auto" style={{ maxHeight: "420px" }}>
        <AnimatePresence initial={false}>
          {events.map((event) => (
            <EventRow
              key={event.id}
              event={event}
              onFocusRegion={onFocusRegion}
              isSelected={selectedId === event.id}
              onSelect={() =>
                setSelectedId((prev) => (prev === event.id ? null : event.id))
              }
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div
        className="px-4 py-2 flex items-center justify-between"
        style={{ borderTop: "0.5px solid rgba(255,255,255,0.04)" }}
      >
        <span
          className="font-mono text-[8px] tracking-[0.14em] uppercase"
          style={{ color: "rgba(228,235,240,0.14)" }}
        >
          Click event → focus globe
        </span>
        <span
          className="font-mono text-[8px] tracking-[0.1em] uppercase"
          style={{ color: "rgba(0,170,255,0.3)" }}
        >
          Live · {new Date().toUTCString().slice(17, 22)} UTC
        </span>
      </div>
    </div>
  );
}
