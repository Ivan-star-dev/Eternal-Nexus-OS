import { Globe, Activity } from "lucide-react";

interface LayerState {
  projects: boolean;
  seismic: boolean;
}

interface GlobeLayerSelectorProps {
  layers: LayerState;
  onToggle: (layer: keyof LayerState) => void;
}

interface LayerButtonProps {
  label: string;
  active: boolean;
  icon: React.ReactNode;
  onClick: () => void;
}

function LayerButton({ label, active, icon, onClick }: LayerButtonProps) {
  return (
    <button
      onClick={onClick}
      className={[
        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-all duration-200",
        "font-mono text-[0.55rem] tracking-widest uppercase",
        "border",
        active
          ? "border-[#c8a44e] text-[#c8a44e]"
          : "border-white/10 text-white/40 hover:text-white/70 hover:border-white/20",
      ].join(" ")}
    >
      <span className="w-3 h-3 flex-shrink-0">{icon}</span>
      {label}
    </button>
  );
}

const GlobeLayerSelector = ({ layers, onToggle }: GlobeLayerSelectorProps) => {
  return (
    <div
      className="absolute bottom-6 left-6 z-10 flex flex-col gap-1.5 p-2.5 rounded-xl bg-black/60 backdrop-blur-sm border border-white/10"
      style={{ pointerEvents: "auto" }}
    >
      <span className="font-mono text-[0.45rem] tracking-[0.2em] uppercase text-white/25 px-1 pb-0.5">
        Layers
      </span>
      <LayerButton
        label="Projects"
        active={layers.projects}
        icon={<Globe size={12} />}
        onClick={() => onToggle("projects")}
      />
      <LayerButton
        label="Seismic"
        active={layers.seismic}
        icon={<Activity size={12} />}
        onClick={() => onToggle("seismic")}
      />
    </div>
  );
};

export default GlobeLayerSelector;
