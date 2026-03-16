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
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 px-2 py-1.5 bg-black/50 backdrop-blur-xl border border-white/10 rounded-full font-mono select-none">
      {MODES.map(({ key, label, icon: Icon }) => {
        const isActive = mode === key;
        return (
          <button
            key={key}
            onClick={() => onModeChange(key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] tracking-wide transition-all duration-300 ${
              isActive
                ? "bg-[#d4a017]/20 text-[#f5c24a] shadow-[0_0_12px_rgba(212,160,23,0.15)]"
                : "text-white/40 hover:text-white/70 hover:bg-white/5"
            }`}
          >
            <Icon size={13} strokeWidth={isActive ? 2 : 1.5} />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
