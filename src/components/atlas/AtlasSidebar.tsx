import { useState, useMemo } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PanelLeft, Search, MapPin, Zap } from "lucide-react";
import type { GeoProject } from "@/components/atlas/cesium/CesiumProjectEntities";

interface AtlasSidebarProps {
  projects: GeoProject[];
  selectedProject: GeoProject | null;
  onSelectProject: (p: GeoProject) => void;
}

export default function AtlasSidebar({ projects, selectedProject, onSelectProject }: AtlasSidebarProps) {
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
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed top-20 left-4 z-50 h-9 w-9 bg-card/95 backdrop-blur-xl border-border/50 rounded-lg"
        >
          <PanelLeft className="h-4 w-4 text-primary" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 bg-card/98 backdrop-blur-2xl border-border/30 p-0">
        <div className="p-4 border-b border-border/30">
          <h3 className="font-mono text-[0.6rem] tracking-[0.25em] text-primary uppercase mb-3">
            KENSHO Project Nodes
          </h3>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="pl-8 h-8 text-xs font-mono bg-background/50 border-border/30"
            />
          </div>
          <div className="flex gap-1 mt-2 flex-wrap">
            <Button
              variant={filterStatus === null ? "default" : "ghost"}
              size="sm"
              className="h-6 px-2 text-[0.5rem] font-mono"
              onClick={() => setFilterStatus(null)}
            >
              ALL
            </Button>
            {statuses.map((s) => (
              <Button
                key={s}
                variant={filterStatus === s ? "default" : "ghost"}
                size="sm"
                className="h-6 px-2 text-[0.5rem] font-mono"
                onClick={() => setFilterStatus(filterStatus === s ? null : s)}
              >
                {s.split(" ")[0]}
              </Button>
            ))}
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(100vh-160px)]">
          {filtered.map((p) => {
            const isActive = selectedProject?.id === p.id;
            const isNPI = p.status === "Ω CLEARANCE";
            return (
              <button
                key={p.id}
                onClick={() => onSelectProject(p)}
                className={`w-full text-left px-4 py-3 border-b border-border/10 transition-colors hover:bg-primary/5 ${
                  isActive ? "bg-primary/10 border-l-2 border-l-primary" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                  <span className="font-mono text-xs font-medium text-foreground truncate">{p.name}</span>
                  {isNPI && <Zap className="h-3 w-3 text-primary shrink-0" />}
                </div>
                <div className="flex items-center gap-2 mt-1 ml-4.5">
                  <MapPin className="h-2.5 w-2.5 text-muted-foreground shrink-0" />
                  <span className="font-mono text-[0.5rem] text-muted-foreground truncate">{p.desc}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5 ml-4.5">
                  <span className="font-mono text-[0.45rem] tracking-wider text-primary/60">{p.status}</span>
                  <span className="font-mono text-[0.4rem] text-muted-foreground/50">
                    {p.lat.toFixed(1)}°, {p.lon.toFixed(1)}°
                  </span>
                </div>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div className="p-6 text-center">
              <span className="font-mono text-xs text-muted-foreground">No projects found</span>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
