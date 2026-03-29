/**
 * SchoolSurface.tsx
 * Root wrapper for Bridge Nova / School portal surface.
 *
 * Identity: Deep navy (#0a0f1e), warm gold accents (hsl 42 78% 52%).
 * Density: LOW — one concept at a time.
 * Motion: subtle — confidence-building, not flashy.
 *
 * Canon: V7-SURFACES-001 · K-04 SURFACE · K-06 COMPONENT · K-07 IMPL
 * @framer+@cursor | 2026-03-28
 */

import { useState } from "react";
import LearningPath from "./LearningPath";
import DoctrineMap from "./DoctrineMap";
import JudgmentArchitecture from "./JudgmentArchitecture";
import { usePortalIdentity } from "@/hooks/usePortalIdentity";
import { useEvolution } from "@/hooks/useEvolution";

type TrackId = "foundations" | "value-creation";

const TRACKS: { id: TrackId; label: string; sub: string }[] = [
  { id: "foundations", label: "Foundations", sub: "Systems · Research · Leadership" },
  { id: "value-creation", label: "Value Creation", sub: "Offer · Distribution · Execution · Mastery" },
];

const GOLD = "hsl(42, 78%, 52%)";
const GOLD_FAINT = "hsla(42, 78%, 52%, 0.12)";

export default function SchoolSurface() {
  const { isMotionAllowed } = usePortalIdentity();
  const { maturity } = useEvolution();
  const [activeTrack, setActiveTrack] = useState<TrackId>("foundations");

  return (
    <main
      aria-label="Bridge Nova"
      data-portal-motion={isMotionAllowed('subtle') ? "subtle" : "none"}
      style={{
        minHeight: "100vh",
        padding:
          "clamp(48px, 8vh, 96px) clamp(16px, 4vw, 48px) clamp(64px, 10vh, 120px)",
        position: "relative",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "720px", margin: "0 auto" }}>
        {/* Track selector */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "36px", flexWrap: "wrap" }}>
          {TRACKS.map(track => {
            const isActive = activeTrack === track.id;
            return (
              <button
                key={track.id}
                onClick={() => setActiveTrack(track.id)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  background: isActive ? GOLD_FAINT : "transparent",
                  border: `1px solid ${isActive ? GOLD + "66" : "hsl(var(--border))"}`,
                  borderRadius: "10px",
                  padding: "12px 18px",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span style={{ fontFamily: "Syne, system-ui, sans-serif", fontSize: "13px", fontWeight: 600, color: isActive ? "var(--rx-text-primary)" : "var(--rx-text-ghost)" }}>
                  {track.label}
                </span>
                <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "8px", letterSpacing: "0.12em", textTransform: "uppercase", color: isActive ? `${GOLD}88` : "var(--rx-text-ghost)" }}>
                  {track.sub}
                </span>
              </button>
            );
          })}
        </div>

        {activeTrack === "foundations" && <JudgmentArchitecture />}
        {activeTrack === "foundations" && <DoctrineMap />}
        <LearningPath maturityLevel={maturity.level} track={activeTrack} />
      </div>
    </main>
  );
}
