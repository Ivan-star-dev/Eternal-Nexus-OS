import { ZoomIn, ZoomOut, Layers, Eye, Globe, Satellite, MapPin, Radio, ShieldCheck, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import TimelineSlider from "./TimelineSlider";
import ExportButton from "./ExportButton";
import type { LODLevel } from "./ZoomController";
import type { Scene } from "three";
import type { TileLayer } from "@/lib/atlas/tile-provider";
import { TILE_LAYERS } from "@/lib/atlas/tile-provider";
import { useState, useEffect } from "react";

interface AtlasToolbarProps {
  lod: LODLevel;
  timeline: number;
  onTimelineChange: (v: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleLayers: () => void;
  onToggleStreetView: () => void;
  showLayers: boolean;
  getScene: () => Scene | null;
  tileLayer?: TileLayer;
  onTileLayerChange?: (layer: TileLayer) => void;
  projectCount?: number;
}

export default function AtlasToolbar({
  lod,
  timeline,
  onTimelineChange,
  onZoomIn,
  onZoomOut,
  onToggleLayers,
  onToggleStreetView,
  showLayers,
  getScene,
  tileLayer = "procedural",
  onTileLayerChange,
  projectCount = 0,
}: AtlasToolbarProps) {
  const [fps, setFps] = useState(60);
  const [integrityHash, setIntegrityHash] = useState("...");

  // FPS counter
  useEffect(() => {
    let frames = 0;
    let last = performance.now();
    const tick = () => {
      frames++;
      const now = performance.now();
      if (now - last >= 1000) {
        setFps(frames);
        frames = 0;
        last = now;
      }
      raf = requestAnimationFrame(tick);
    };
    let raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Simulated integrity hash — rotates every 5s
  useEffect(() => {
    const update = () => {
      const arr = new Uint8Array(4);
      crypto.getRandomValues(arr);
      setIntegrityHash(Array.from(arr).map(b => b.toString(16).padStart(2, "0")).join(""));
    };
    update();
    const iv = setInterval(update, 5000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-auto">
      {/* Top bar — KENSHO branding + security */}
      <div className="flex items-center gap-2 bg-card/90 backdrop-blur-2xl border rounded-lg px-4 py-1.5" style={{ borderImage: 'linear-gradient(90deg, hsl(var(--primary) / 0.25), hsl(var(--primary) / 0.08)) 1' }}>
        <Radio className="h-3 w-3 text-primary animate-pulse" />
        <span className="font-mono text-[0.5rem] tracking-[0.3em] text-primary uppercase font-bold">
          ETERNAL NEXUS 2.0
        </span>
        <div className="w-px h-3 bg-border/50" />
        <ShieldCheck className="h-3 w-3 text-accent-foreground" />
        <span className="font-mono text-[0.4rem] text-muted-foreground">
          SHA:{integrityHash}
        </span>
        <div className="w-px h-3 bg-border/50" />
        <Activity className="h-3 w-3 text-accent-foreground" />
        <span className="font-mono text-[0.4rem] text-muted-foreground">
          {fps}fps
        </span>
        <span className="font-mono text-[0.4rem] text-muted-foreground ml-1">
          {projectCount} nodes
        </span>
      </div>

      {/* Main controls */}
      <div className="flex items-center gap-1.5">
        {/* LOD badge */}
        <div className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-lg px-3 py-1.5 font-mono text-[0.55rem] tracking-[0.2em] text-primary uppercase flex items-center gap-1.5">
          {lod === "street" ? <MapPin className="h-3 w-3" /> : <Globe className="h-3 w-3" />}
          {lod}
        </div>

        {/* Zoom */}
        <div className="flex bg-card/95 backdrop-blur-xl border border-border/50 rounded-lg overflow-hidden">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary rounded-none" onClick={onZoomIn}>
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary rounded-none" onClick={onZoomOut}>
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Timeline */}
        <TimelineSlider value={timeline} onChange={onTimelineChange} />

        {/* Tile layer selector */}
        {onTileLayerChange && (
          <div className="flex bg-card/95 backdrop-blur-xl border border-border/50 rounded-lg overflow-hidden">
            {TILE_LAYERS.slice(0, 3).map((layer) => (
              <Button
                key={layer.id}
                variant={tileLayer === layer.id ? "default" : "ghost"}
                size="sm"
                className="h-8 px-2 text-[0.5rem] font-mono tracking-wider rounded-none"
                onClick={() => onTileLayerChange(layer.id)}
                title={layer.label}
              >
                <Satellite className="h-3 w-3" />
              </Button>
            ))}
          </div>
        )}

        {/* Layer toggle */}
        <Button
          variant={showLayers ? "default" : "outline"}
          size="icon"
          className="h-8 w-8 rounded-lg"
          onClick={onToggleLayers}
        >
          <Layers className="h-3.5 w-3.5" />
        </Button>

        {/* Street view */}
        <Button
          variant={lod === "street" ? "default" : "outline"}
          size="icon"
          className="h-8 w-8 border-primary/30 text-primary rounded-lg"
          onClick={onToggleStreetView}
        >
          <Eye className="h-3.5 w-3.5" />
        </Button>

        {/* Export */}
        <ExportButton getScene={getScene} />
      </div>
    </div>
  );
}
