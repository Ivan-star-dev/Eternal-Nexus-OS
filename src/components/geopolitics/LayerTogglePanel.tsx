/**
 * LayerTogglePanel — MapLibre layer visibility controls for GeopoliticsMap.
 *
 * Task U2: Follows the EnvironmentPanel.tsx pattern from Atlas.
 * Dark Glassmorphism visual DNA: backdrop-blur, gold borders, mono typography.
 *
 * Toggleable layers:
 * - Conflict Tension Heatmap (geopolitics source → conflictLevel)
 * - Migration Routes (migration source)
 * - Energy Grid (energy source)
 * - Verdict Markers (tribunal.verdict events)
 */

import { Layers, Flame, ArrowUpRight, Zap, Shield } from 'lucide-react';

export interface LayerVisibility {
  conflictHeatmap: boolean;
  migrationRoutes: boolean;
  energyGrid: boolean;
  verdictMarkers: boolean;
}

interface LayerTogglePanelProps {
  layers: LayerVisibility;
  onChange: (layers: LayerVisibility) => void;
}

interface LayerConfig {
  key: keyof LayerVisibility;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  activeColor: string;
}

const LAYER_CONFIGS: LayerConfig[] = [
  {
    key: 'conflictHeatmap',
    label: 'CONFLICT HEAT',
    sublabel: 'Tension gradient',
    icon: <Flame className="h-3 w-3" />,
    activeColor: 'text-red-400 border-red-500/40 bg-red-500/10',
  },
  {
    key: 'migrationRoutes',
    label: 'MIGRATION',
    sublabel: 'Population flow',
    icon: <ArrowUpRight className="h-3 w-3" />,
    activeColor: 'text-teal-400 border-teal-500/40 bg-teal-500/10',
  },
  {
    key: 'energyGrid',
    label: 'ENERGY GRID',
    sublabel: 'Power output',
    icon: <Zap className="h-3 w-3" />,
    activeColor: 'text-yellow-400 border-yellow-500/40 bg-yellow-500/10',
  },
  {
    key: 'verdictMarkers',
    label: 'VERDICTS',
    sublabel: 'Tribunal decisions',
    icon: <Shield className="h-3 w-3" />,
    activeColor: 'text-primary border-primary/40 bg-primary/10',
  },
];

export default function LayerTogglePanel({ layers, onChange }: LayerTogglePanelProps) {
  const toggle = (key: keyof LayerVisibility) => {
    onChange({ ...layers, [key]: !layers[key] });
  };

  return (
    <div
      className="bg-[#0a0a0fcc] backdrop-blur-xl border border-[#c8a84e33] rounded-none p-3 w-52"
      style={{
        boxShadow: '0 0 20px #c8a84e11, inset 0 0 20px #0a0a0f88',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#c8a84e22]">
        <Layers className="h-3.5 w-3.5 text-primary" />
        <span className="font-mono text-[0.5rem] tracking-[0.22em] text-primary uppercase">
          Layer Control
        </span>
      </div>

      {/* Layer toggles */}
      <div className="space-y-1.5">
        {LAYER_CONFIGS.map(({ key, label, sublabel, icon, activeColor }) => {
          const isActive = layers[key];
          return (
            <button
              key={key}
              onClick={() => toggle(key)}
              className={`
                w-full flex items-center gap-2 px-2 py-1.5 rounded-none
                border transition-all duration-200
                font-mono text-left
                ${isActive
                  ? activeColor
                  : 'text-muted-foreground border-border/20 bg-transparent hover:border-border/40 hover:text-foreground'
                }
              `}
            >
              <span className="shrink-0">{icon}</span>
              <div className="min-w-0">
                <div className="text-[0.45rem] tracking-[0.15em] font-bold leading-tight truncate">
                  {label}
                </div>
                <div className="text-[0.4rem] tracking-wider opacity-60 leading-tight">
                  {sublabel}
                </div>
              </div>
              {/* Active indicator */}
              <div className={`ml-auto shrink-0 w-1.5 h-1.5 rounded-full ${isActive ? 'bg-current' : 'bg-border/30'}`} />
            </button>
          );
        })}
      </div>

      {/* Active count footer */}
      <div className="mt-2 pt-2 border-t border-[#c8a84e22]">
        <span className="font-mono text-[0.4rem] tracking-[0.15em] text-muted-foreground">
          {Object.values(layers).filter(Boolean).length}/{LAYER_CONFIGS.length} ACTIVE
        </span>
      </div>
    </div>
  );
}
