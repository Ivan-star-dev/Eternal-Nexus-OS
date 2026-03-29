// Neural Search — Google-style instant search across all organs with fuzzy matching
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Search, FileText, Globe, Shield, Info, Scale, BarChart3, Brain, Radio, Newspaper, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchResult {
  label: string;
  path: string;
  icon: React.ElementType;
  organ: string;
  organColor: string;
  keywords: string[];
}

const pages: SearchResult[] = [
  { label: "Portfolio — Active Dossiers", path: "/", icon: FileText, organ: "ROSTO", organColor: "#D4AF37", keywords: ["home", "index", "portfolio", "dossiers", "projects"] },
  { label: "DeltaSpine NL — NPI-001", path: "/project/deltaspine-nl", icon: FileText, organ: "ROSTO", organColor: "#D4AF37", keywords: ["deltaspine", "netherlands", "infrastructure", "coastal"] },
  { label: "GeoCore Power — NPI-002", path: "/project/geocore-power", icon: FileText, organ: "ROSTO", organColor: "#D4AF37", keywords: ["geocore", "geothermal", "energy", "volcanic"] },
  { label: "Terra Lenta — NPI-003", path: "/project/terra-lenta", icon: FileText, organ: "ROSTO", organColor: "#D4AF37", keywords: ["terra", "lenta", "seismic", "earthquake"] },
  { label: "Fusion Core — NPI-004", path: "/project/fusion-core", icon: FileText, organ: "ROSTO", organColor: "#D4AF37", keywords: ["fusion", "nuclear", "reactor", "energy"] },
  { label: "Chip Fold — NPI-005", path: "/project/chip-fold", icon: FileText, organ: "ROSTO", organColor: "#D4AF37", keywords: ["chip", "fold", "semiconductor", "computing"] },
  { label: "NEXUS — Parlamento AI", path: "/nexus", icon: Brain, organ: "CÉREBRO", organColor: "#22ffaa", keywords: ["nexus", "brain", "ai", "council", "parliament", "crisis"] },
  { label: "ATLAS — Globo 3D", path: "/atlas", icon: Globe, organ: "CORAÇÃO", organColor: "#4a90e2", keywords: ["atlas", "globe", "map", "3d", "earth", "projects"] },
  { label: "NEWS — Echo-Vox Broadcast", path: "/news", icon: Radio, organ: "BOCA", organColor: "#ff4444", keywords: ["news", "broadcast", "echo", "vox", "reports"] },
  { label: "Geopolitical Strategy", path: "/geopolitics", icon: Globe, organ: "OLHOS", organColor: "#e24a6f", keywords: ["geopolitics", "strategy", "energy", "flows"] },
  { label: "Investor Briefing — DeltaSpine", path: "/investor/deltaspine-nl", icon: BarChart3, organ: "SANGUE", organColor: "#ffaa22", keywords: ["investor", "briefing", "investment", "portfolio"] },
  { label: "About Next Path Infra", path: "/about", icon: Info, organ: "INFO", organColor: "#D4AF37", keywords: ["about", "mission", "team"] },
  { label: "Government Access", path: "/access", icon: Shield, organ: "SEGURANÇA", organColor: "#cc44ff", keywords: ["government", "access", "clearance", "auth"] },
  { label: "Terms & Legal", path: "/terms", icon: Scale, organ: "LEGAL", organColor: "#D4AF37", keywords: ["terms", "legal", "privacy"] },
];

function fuzzyMatch(query: string, target: string): boolean {
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  if (t.includes(q)) return true;
  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) qi++;
  }
  return qi === q.length;
}

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return pages;
    return pages.filter(p =>
      fuzzyMatch(query, p.label) ||
      p.keywords.some(k => fuzzyMatch(query, k)) ||
      fuzzyMatch(query, p.organ)
    );
  }, [query]);

  // Group by organ
  const grouped = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {};
    filtered.forEach(p => {
      if (!groups[p.organ]) groups[p.organ] = [];
      groups[p.organ].push(p);
    });
    return groups;
  }, [filtered]);

  return (
    <CommandDialog
      open={open}
      onOpenChange={(o) => { setOpen(o); if (!o) setQuery(""); }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 pt-3 pb-1">
        <Zap className="w-3.5 h-3.5 text-gold animate-pulse" />
        <span className="font-mono text-[0.42rem] tracking-[0.28em] uppercase text-paper-dim/30">
          NEURAL SEARCH — TODOS OS ÓRGÃOS
        </span>
      </div>

      {/* Search input — V3 */}
      <CommandInput
        placeholder="Buscar dossiê, órgão, seção… (fuzzy)"
        value={query}
        onValueChange={setQuery}
        className="bg-ink-medium/80 border border-white/[0.08] font-mono text-sm text-paper placeholder:text-paper-dim/30 focus:border-gold/40 focus:outline-none px-4 py-3"
      />

      <CommandList>
        {/* Empty state — V3 */}
        <CommandEmpty>
          <div className="flex flex-col items-center gap-2 py-6">
            <Search className="w-5 h-5 text-paper-dim/20" />
            <span className="font-mono text-[0.5rem] text-paper-dim/30">
              No results in this branch of the system.
            </span>
          </div>
        </CommandEmpty>

        {Object.entries(grouped).map(([organ, items]) => (
          <CommandGroup
            key={organ}
            heading={
              <span className="flex items-center gap-2">
                <span
                  className="w-1.5 h-1.5 rounded-full inline-block"
                  style={{ backgroundColor: items[0]?.organColor }}
                />
                {/* Section group label — V3 */}
                <span className="font-mono text-[0.42rem] tracking-[0.28em] uppercase text-paper-dim/30">
                  {organ}
                </span>
              </span>
            }
          >
            {items.map((p) => (
              <CommandItem
                key={p.path}
                value={p.label}
                onSelect={() => {
                  navigate(p.path);
                  setOpen(false);
                  setQuery("");
                }}
                /* Result item — V3: base + hover + active/selected states */
                className="gap-3 group font-mono text-[0.6rem] tracking-[0.08em] text-paper-dim hover:bg-ink-medium/60 hover:text-paper data-[selected=true]:bg-gold/10 data-[selected=true]:border-l-2 data-[selected=true]:border-gold/60 data-[selected=true]:text-gold"
              >
                <div
                  className="w-6 h-6 rounded flex items-center justify-center transition-colors"
                  style={{ backgroundColor: `${p.organColor}15` }}
                >
                  {(() => { const Icon = p.icon as React.FC<React.SVGProps<SVGSVGElement>>; return <Icon className="w-3.5 h-3.5" style={{ color: p.organColor }} />; })()}
                </div>
                <div className="flex-1">
                  <span className="font-mono text-[0.6rem] tracking-[0.08em]">{p.label}</span>
                </div>
                {/* Keyboard shortcut badge — V3 */}
                <span className="font-mono text-[0.42rem] border border-white/[0.08] px-1.5 py-0.5 text-paper-dim/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  ENTER ↵
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>

      {/* Footer */}
      <div className="border-t border-white/[0.08] px-4 py-2 flex items-center justify-between">
        <span className="font-mono text-[0.42rem] text-paper-dim/30">
          {filtered.length} resultados
        </span>
        {/* Keyboard shortcut badge — V3 */}
        <span className="font-mono text-[0.42rem] border border-white/[0.08] px-1.5 py-0.5 text-paper-dim/40">
          ⌘K
        </span>
      </div>
    </CommandDialog>
  );
};

export default CommandPalette;
