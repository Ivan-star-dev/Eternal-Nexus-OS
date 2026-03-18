/**
 * MapLayerPanel — Layer toggle panel for GeopoliticsMap.
 *
 * Sacred Flow: Tribunal → Atlas visualization (layer control)
 *
 * Follows the exact pattern of EnvironmentPanel.tsx — Dark Glassmorphism,
 * font-mono labels, collapsible header. Wires visibility state to MapLibre's
 * setLayoutProperty(layer, 'visibility', 'visible'|'none').
 *
 * Task U2 (@copilot)
 */

import { useState } from 'react';
import type { RefObject } from 'react';
import { Layers, ChevronDown, ChevronUp } from 'lucide-react';
import type maplibregl from 'maplibre-gl';

/** MapLibre layer IDs controlled per logical toggle */
interface LayerConfig {
  /** Unique key for this toggle */
  id: string;
  /** Human-readable label */
  label: string;
  /** One or more MapLibre layer IDs to show/hide together */
  layerIds: string[];
  /** False when the layer doesn't exist yet (future tasks) */
  available: boolean;
}

const LAYER_CONFIGS: LayerConfig[] = [
  {
    id: 'verdict-markers',
    label: 'Verdict Markers',
    layerIds: ['verdict-glow', 'verdict-core', 'verdict-labels'],
    available: true,
  },
  {
    id: 'conflict-heatmap',
    label: 'Conflict Heatmap',
    layerIds: ['conflict-heatmap'],
    available: false, // Task C4
  },
  {
    id: 'migration-routes',
    label: 'Migration Routes',
    layerIds: ['migration-routes'],
    available: false, // Future
  },
  {
    id: 'energy-grid',
    label: 'Energy Grid',
    layerIds: ['energy-grid'],
    available: false, // Future
  },
];

interface MapLayerPanelProps {
  /** Live MapLibre map instance (may be null before load) */
  mapRef: RefObject<maplibregl.Map | null>;
  /** Whether verdict markers are initially visible */
  showVerdicts?: boolean;
}

export default function MapLayerPanel({ mapRef, showVerdicts = true }: MapLayerPanelProps) {
  const [collapsed, setCollapsed] = useState(false);

  // Per-layer visibility state (keyed by LayerConfig.id)
  const [visibility, setVisibility] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const cfg of LAYER_CONFIGS) {
      initial[cfg.id] = cfg.id === 'verdict-markers' ? showVerdicts : false;
    }
    return initial;
  });

  const handleToggle = (cfg: LayerConfig) => {
    if (!cfg.available) return;

    const map = mapRef.current;
    const next = !visibility[cfg.id];

    setVisibility((prev) => ({ ...prev, [cfg.id]: next }));

    if (!map) return;
    const vis = next ? 'visible' : 'none';
    for (const layerId of cfg.layerIds) {
      // Only call setLayoutProperty if the layer actually exists
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, 'visibility', vis);
      }
    }
  };

  return (
    <div className="bg-card/95 backdrop-blur-xl border border-border/30 rounded-lg p-3 w-52">
      {/* Header */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="flex items-center justify-between w-full gap-2 mb-0"
        aria-expanded={!collapsed}
        aria-label="Toggle layer panel"
      >
        <div className="flex items-center gap-2">
          <Layers className="h-3.5 w-3.5 text-primary flex-shrink-0" />
          <span className="font-mono text-[0.55rem] tracking-[0.2em] text-primary uppercase">
            Map Layers
          </span>
        </div>
        {collapsed ? (
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        ) : (
          <ChevronUp className="h-3 w-3 text-muted-foreground" />
        )}
      </button>

      {/* Layer list */}
      {!collapsed && (
        <div className="mt-2.5 space-y-2">
          {LAYER_CONFIGS.map((cfg) => (
            <div key={cfg.id} className="flex items-center justify-between">
              <span
                className={`font-mono text-[0.48rem] tracking-wider ${
                  cfg.available ? 'text-foreground' : 'text-muted-foreground/50'
                }`}
              >
                {cfg.label}
                {!cfg.available && (
                  <span className="ml-1 text-[0.4rem] text-primary/40 tracking-[0.15em] uppercase">
                    (soon)
                  </span>
                )}
              </span>

              {/* Toggle switch */}
              <button
                onClick={() => handleToggle(cfg)}
                disabled={!cfg.available}
                aria-checked={visibility[cfg.id]}
                role="switch"
                className={`relative inline-flex h-4 w-7 flex-shrink-0 items-center rounded-full transition-colors focus-visible:outline-none ${
                  cfg.available ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'
                } ${
                  visibility[cfg.id] && cfg.available
                    ? 'bg-primary'
                    : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-background border border-border/40 shadow-sm transition-transform ${
                    visibility[cfg.id] && cfg.available ? 'translate-x-3.5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
