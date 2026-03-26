// sacred flow — Atlas mode switcher (bottom-center pill)
// 4 modes: Clean / Cinematic / Intelligence / Live
import { Eye, Film, Brain, Radio } from "lucide-react";
import type { AtlasMode } from "@/lib/atlas/atlas-state";

interface AtlasModeBarProps {
  mode: AtlasMode;
  onModeChange: (mode: AtlasMode) => void;
}

const MODES: { key: AtlasMode; label: string; icon: typeof Eye }[] = [
  { key: "clean", label: "Clean", icon: Eye },
  { key: "cinematic", label: "Cinematic", icon: Film },
  { key: "intelligence", label: "Intel", icon: Brain },
  { key: "live", label: "Live", icon: Radio },
];

export default function AtlasModeBar({ mode, onModeChange }: AtlasModeBarProps) {
  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 px-2 py-1.5 backdrop-blur-xl font-mono select-none"
      style={{
        background: "rgba(6,12,20,0.88)",
        border: "0.5px solid rgba(200,164,78,0.15)",
        borderRadius: "999px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.5), 0 0 40px rgba(200,164,78,0.04)",
      }}
    >
      {MODES.map(({ key, label, icon: Icon }) => {
        const isActive = mode === key;
        return (
          <button
            key={key}
            onClick={() => onModeChange(key)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] tracking-wide transition-all duration-300"
            style={{
              borderRadius: "999px",
              background: isActive ? "rgba(200,164,78,0.12)" : "transparent",
              color: isActive ? "hsl(42 78% 62%)" : "rgba(200,218,232,0.35)",
              boxShadow: isActive ? "0 0 12px rgba(200,164,78,0.15)" : "none",
            }}
            onMouseEnter={e => {
              if (!isActive) {
                (e.currentTarget as HTMLElement).style.color = "rgba(200,218,232,0.65)";
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
              }
            }}
            onMouseLeave={e => {
              if (!isActive) {
                (e.currentTarget as HTMLElement).style.color = "rgba(200,218,232,0.35)";
                (e.currentTarget as HTMLElement).style.background = "transparent";
              }
            }}
          >
            <Icon size={13} strokeWidth={isActive ? 2 : 1.5} />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
