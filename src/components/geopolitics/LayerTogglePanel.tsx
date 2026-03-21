/**
 * LayerTogglePanel — Task U2
 *
 * MapLibre layer visibility toggle panel for GeopoliticsMap.
 * Follows the EnvironmentPanel.tsx glassmorphism card pattern.
 *
 * Layers toggled:
 * - Verdict Markers (tribunal.verdict events from event bus)
 * - Conflict Heatmap (C4 — teal→orange→red tension layer)
 * - Migration Routes (atlas migration flow lines)
 * - Energy Grid (atlas energy infrastructure overlay)
 *
 * Sacred Flow: This panel controls which Atlas visualization layers are
 * visible. It does NOT affect the data pipeline — only rendering.
 */

import { useState } from 'react';
import { Layers, Map, Flame, ArrowRight, Zap, Eye, EyeOff } from 'lucide-react';

/** Layer IDs managed by this panel */
export type LayerId =
  | 'verdict-markers'
  | 'conflict-heatmap'
  | 'migration-routes'
  | 'energy-grid';

/** Visibility state for all layers */
export type LayerVisibility = Record<LayerId, boolean>;

const DEFAULT_VISIBILITY: LayerVisibility = {
  'verdict-markers': true,
  'conflict-heatmap': true,
  'migration-routes': false,
  'energy-grid': false,
};

interface LayerConfig {
  id: LayerId;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  accent: string; // tailwind text color class
}

const LAYERS: LayerConfig[] = [
  {
    id: 'verdict-markers',
    label: 'VERDICT MARKERS',
    sublabel: 'Tribunal outcomes on map',
    icon: <Map className="h-3 w-3" />,
    accent: 'text-yellow-400',
  },
  {
    id: 'conflict-heatmap',
    label: 'TENSION HEATMAP',
    sublabel: 'Conflict intensity (teal→red)',
    icon: <Flame className="h-3 w-3" />,
    accent: 'text-orange-400',
  },
  {
    id: 'migration-routes',
    label: 'MIGRATION ROUTES',
    sublabel: 'Population flow vectors',
    icon: <ArrowRight className="h-3 w-3" />,
    accent: 'text-teal-400',
  },
  {
    id: 'energy-grid',
    label: 'ENERGY GRID',
    sublabel: 'Infrastructure & output nodes',
    icon: <Zap className="h-3 w-3" />,
    accent: 'text-blue-400',
  },
];

interface LayerTogglePanelProps {
  /** Controlled visibility state — lifted to parent (GeopoliticsMap) */
  visibility: LayerVisibility;
  onToggle: (id: LayerId) => void;
  className?: string;
}

export default function LayerTogglePanel({
  visibility,
  onToggle,
  className = '',
}: LayerTogglePanelProps) {
  const [open, setOpen] = useState(true);

  const activeCount = Object.values(visibility).filter(Boolean).length;

  return (
    <div className={`bg-card/95 backdrop-blur-xl border border-border/30 rounded-lg overflow-hidden w-60 ${className}`}>
      {/* Header — always visible, click to collapse */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2 hover:bg-muted/30 transition-colors"
        aria-expanded={open}
        aria-label="Toggle layer panel"
      >
        <div className="flex items-center gap-2">
          <Layers className="h-3.5 w-3.5 text-primary" />
          <span className="font-mono text-[0.55rem] tracking-[0.2em] text-primary uppercase">
            Map Layers
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[0.45rem] text-muted-foreground">
            {activeCount}/{LAYERS.length} active
          </span>
          <span className={`font-mono text-[0.5rem] text-muted-foreground transition-transform ${open ? '' : 'rotate-180'}`}>
            ▲
          </span>
        </div>
      </button>

      {/* Layer rows */}
      {open && (
        <div className="divide-y divide-border/20">
          {LAYERS.map((layer) => {
            const active = visibility[layer.id];
            return (
              <button
                key={layer.id}
                onClick={() => onToggle(layer.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors ${
                  active ? 'hover:bg-muted/20' : 'opacity-50 hover:opacity-70 hover:bg-muted/10'
                }`}
              >
                {/* Layer icon */}
                <span className={`flex-shrink-0 ${active ? layer.accent : 'text-muted-foreground'}`}>
                  {layer.icon}
                </span>

                {/* Label */}
                <div className="flex-1 min-w-0">
                  <div className={`font-mono text-[0.5rem] tracking-widest truncate ${active ? layer.accent : 'text-muted-foreground'}`}>
                    {layer.label}
                  </div>
                  <div className="font-mono text-[0.4rem] text-muted-foreground truncate mt-0.5">
                    {layer.sublabel}
                  </div>
                </div>

                {/* Toggle indicator */}
                <span className={`flex-shrink-0 ${active ? layer.accent : 'text-muted-foreground/40'}`}>
                  {active
                    ? <Eye className="h-3 w-3" />
                    : <EyeOff className="h-3 w-3" />
                  }
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export { DEFAULT_VISIBILITY };
