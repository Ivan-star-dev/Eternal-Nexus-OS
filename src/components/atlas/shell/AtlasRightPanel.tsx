// sacred flow — Atlas contextual right panel
// 3 tabs: Overview (projects), Layers (toggles), Signals (earthquake feed)
import { useState, useMemo } from "react";
import { PanelRight, Search, MapPin, Zap, Layers, Activity, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { GeoProject } from "@/components/atlas/cesium/CesiumProjectEntities";
import type { EarthquakePoint } from "@/lib/earthquakeData";

type Tab = "overview" | "layers" | "signals";

interface LayerVisibility {
  connections: boolean;
  co2: boolean;
  pollution: boolean;
  earthquakes: boolean;
  meteors: boolean;
}

interface AtlasRightPanelProps {
  projects: GeoProject[];
  selectedProject: GeoProject | null;
  onSelectProject: (p: GeoProject) => void;
  layers: LayerVisibility;
  onLayerChange: (key: keyof LayerVisibility, value: boolean) => void;
  earthquakes: EarthquakePoint[];
}

const TABS: { key: Tab; label: string; icon: typeof MapPin }[] = [
  { key: "overview", label: "Projects", icon: MapPin },
  { key: "layers", label: "Layers", icon: Layers },
  { key: "signals", label: "Signals", icon: Activity },
];

const LAYER_LABELS: Record<keyof LayerVisibility, string> = {
  connections: "Connection Arcs",
  co2: "CO\u2082 Heatmap",
  pollution: "Pollution Points",
  earthquakes: "Earthquake Circles",
  meteors: "Meteor Particles",
};

export default function AtlasRightPanel({
  projects,
  selectedProject,
  onSelectProject,
  layers,
  onLayerChange,
  earthquakes,
}: AtlasRightPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("overview");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = projects;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
    }
    if (filterStatus) {
      list = list.filter((p) => p.status === filterStatus);
    }
    return list;
  }, [projects, search, filterStatus]);

  const statuses = useMemo(() => [...new Set(projects.map((p) => p.status))], [projects]);

  return (
    <>
      {/* Toggle button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 right-4 z-50 h-9 w-9 flex items-center justify-center bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg text-white/60 hover:text-white/90 transition-colors"
        >
          <PanelRight size={16} />
        </button>
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 z-50 bg-black/60 backdrop-blur-2xl border-l border-white/10 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-1">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-mono tracking-wide transition-colors ${
                  tab === key
                    ? "bg-white/10 text-[#f5c24a]"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                <Icon size={11} />
                {label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/40 hover:text-white/80 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Tab content */}
        <ScrollArea className="h-[calc(100vh-48px)]">
          {tab === "overview" && (
            <div>
              {/* Search + filter */}
              <div className="p-3 border-b border-white/5">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-white/30" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search projects..."
                    className="pl-7 h-7 text-[11px] font-mono bg-white/5 border-white/10 text-white placeholder:text-white/20"
                  />
                </div>
                <div className="flex gap-1 mt-2 flex-wrap">
                  <button
                    className={`h-5 px-1.5 text-[9px] font-mono rounded transition-colors ${
                      filterStatus === null ? "bg-white/15 text-white/90" : "text-white/30 hover:text-white/60"
                    }`}
                    onClick={() => setFilterStatus(null)}
                  >
                    ALL
                  </button>
                  {statuses.map((s) => (
                    <button
                      key={s}
                      className={`h-5 px-1.5 text-[9px] font-mono rounded transition-colors ${
                        filterStatus === s ? "bg-white/15 text-white/90" : "text-white/30 hover:text-white/60"
                      }`}
                      onClick={() => setFilterStatus(filterStatus === s ? null : s)}
                    >
                      {s.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Project list */}
              {filtered.map((p) => {
                const isActive = selectedProject?.id === p.id;
                const isNPI = p.status === "\u03A9 CLEARANCE";
                return (
                  <button
                    key={p.id}
                    onClick={() => onSelectProject(p)}
                    className={`w-full text-left px-4 py-2.5 border-b border-white/5 transition-colors hover:bg-white/5 ${
                      isActive ? "bg-[#d4a017]/10 border-l-2 border-l-[#f5c24a]" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                      <span className="font-mono text-[11px] text-white/80 truncate">{p.name}</span>
                      {isNPI && <Zap className="h-3 w-3 text-[#f5c24a] shrink-0" />}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5 ml-4">
                      <span className="font-mono text-[9px] text-white/30 truncate">{p.desc}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 ml-4">
                      <span className="font-mono text-[8px] tracking-wider text-[#f5c24a]/50">{p.status}</span>
                      <span className="font-mono text-[8px] text-white/20">
                        {p.lat.toFixed(1)}, {p.lon.toFixed(1)}
                      </span>
                    </div>
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <div className="p-6 text-center font-mono text-[11px] text-white/30">No projects found</div>
              )}
            </div>
          )}

          {tab === "layers" && (
            <div className="p-3 space-y-1">
              {(Object.keys(LAYER_LABELS) as (keyof LayerVisibility)[]).map((key) => (
                <label
                  key={key}
                  className="flex items-center gap-3 px-3 py-2 rounded hover:bg-white/5 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={layers[key]}
                    onChange={(e) => onLayerChange(key, e.target.checked)}
                    className="accent-[#f5c24a] w-3.5 h-3.5"
                  />
                  <span className="font-mono text-[11px] text-white/70">{LAYER_LABELS[key]}</span>
                </label>
              ))}
            </div>
          )}

          {tab === "signals" && (
            <div className="p-3">
              <h4 className="font-mono text-[10px] tracking-[0.15em] text-white/40 mb-2 uppercase">
                Recent Earthquakes
              </h4>
              {earthquakes.length === 0 && (
                <div className="font-mono text-[11px] text-white/20 py-4 text-center">No data loaded</div>
              )}
              {earthquakes.slice(0, 30).map((eq, i) => (
                <div key={i} className="px-2 py-1.5 border-b border-white/5 last:border-0">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-white/70 truncate max-w-[180px]">
                      {eq.place || "Unknown"}
                    </span>
                    <span
                      className={`font-mono text-[11px] font-bold ${
                        eq.mag >= 5
                          ? "text-red-400"
                          : eq.mag >= 3
                            ? "text-amber-400"
                            : "text-emerald-400/60"
                      }`}
                    >
                      M{eq.mag.toFixed(1)}
                    </span>
                  </div>
                  <div className="font-mono text-[8px] text-white/20 mt-0.5">
                    {eq.lat.toFixed(2)}, {eq.lon.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </>
  );
}
