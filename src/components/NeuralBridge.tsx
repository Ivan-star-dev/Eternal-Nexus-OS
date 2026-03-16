// Navegação Neural Bridge — Facebook-style morabeza connection breadcrumbs
import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Globe, Radio, Scale, Newspaper, Home,
} from "lucide-react";

interface Organ {
  id: string;
  path: string;
  label: string;
  organ: string;
  icon: React.ReactNode;
  color: string;
  pulse: boolean;
}

const ORGANS: Organ[] = [
  { id: "index", path: "/", label: "INDEX", organ: "Rosto", icon: <Home className="h-3.5 w-3.5" />, color: "hsl(var(--primary))", pulse: true },
  { id: "nexus", path: "/nexus", label: "NEXUS", organ: "Cérebro", icon: <Brain className="h-3.5 w-3.5" />, color: "#22ffaa", pulse: true },
  { id: "atlas", path: "/atlas", label: "ATLAS", organ: "Coração", icon: <Globe className="h-3.5 w-3.5" />, color: "#4a90e2", pulse: true },
  { id: "tribunal", path: "/tribunal", label: "TRIBUNAL", organ: "Sistema Nervoso", icon: <Scale className="h-3.5 w-3.5" />, color: "#cc44ff", pulse: false },
  { id: "news", path: "/news", label: "NEWS", organ: "Boca", icon: <Radio className="h-3.5 w-3.5" />, color: "#ff4444", pulse: true },
  { id: "investor", path: "/investor/deltaspine-nl", label: "INVESTOR", organ: "Sangue", icon: <Newspaper className="h-3.5 w-3.5" />, color: "#ffaa22", pulse: false },
];

export default function NeuralBridge() {
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
  const [navHistory, setNavHistory] = useState<string[]>([]);
  const currentOrgan = ORGANS.find((o) => o.path === location.pathname) || ORGANS[0];

  // Track navigation history for breadcrumb trail (Facebook-style social graph)
  useEffect(() => {
    setNavHistory(prev => {
      const path = location.pathname;
      if (prev[prev.length - 1] === path) return prev;
      const next = [...prev, path].slice(-6); // Keep last 6
      return next;
    });
  }, [location.pathname]);

  const hiddenPaths = ["/atlas", "/nexus", "/tribunal"];
  if (hiddenPaths.includes(location.pathname)) return null;

  // Get organ info for a path
  const getOrgan = (path: string) => ORGANS.find(o => o.path === path);

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-2">
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="bg-card/95 backdrop-blur-xl border border-border/40 rounded-2xl p-3 shadow-[0_8px_32px_-8px_hsl(var(--primary)/0.2)] mb-2"
          >
            <span className="font-mono text-[0.4rem] tracking-[0.3em] text-muted-foreground uppercase block px-2 mb-2">
              NEURAL BRIDGE — ÓRGÃOS
            </span>

            {/* Morabeza breadcrumb trail */}
            {navHistory.length > 1 && (
              <div className="px-2 mb-3">
                <div className="flex items-center gap-1 flex-wrap">
                  {navHistory.map((path, i) => {
                    const organ = getOrgan(path);
                    if (!organ) return null;
                    return (
                      <div key={`${path}-${i}`} className="flex items-center gap-1">
                        {i > 0 && (
                          <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            className="w-3 h-px origin-left"
                            style={{ backgroundColor: organ.color, opacity: 0.5 }}
                          />
                        )}
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className="w-4 h-4 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: `${organ.color}20`,
                            border: `1px solid ${organ.color}50`,
                            boxShadow: i === navHistory.length - 1 ? `0 0 8px ${organ.color}40` : "none",
                          }}
                          title={organ.label}
                        >
                          <span className="text-[0.3rem] font-mono font-bold" style={{ color: organ.color }}>
                            {organ.label[0]}
                          </span>
                        </motion.div>
                      </div>
                    );
                  })}
                </div>
                <span className="font-mono text-[0.35rem] text-morabeza block mt-1">
                  MORABEZA TRAIL — {navHistory.length} conexões · ritmo morna
                </span>
              </div>
            )}

            <div className="flex flex-col gap-1">
              {ORGANS.map((organ) => {
                const isActive = organ.path === location.pathname;
                const visitCount = navHistory.filter(p => p === organ.path).length;
                return (
                  <Link
                    key={organ.id}
                    to={organ.path}
                    onClick={() => setExpanded(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group ${
                      isActive
                        ? "bg-primary/10 border border-primary/30"
                        : "hover:bg-muted/40"
                    }`}
                  >
                    <div
                      className="relative flex items-center justify-center w-7 h-7 rounded-lg"
                      style={{ backgroundColor: `${organ.color}15` }}
                    >
                      <span style={{ color: organ.color }}>{organ.icon}</span>
                      {organ.pulse && (
                        <span
                          className="absolute inset-0 rounded-lg animate-ping opacity-20"
                          style={{ backgroundColor: organ.color }}
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <span className="font-mono text-[0.5rem] tracking-[0.15em] text-foreground font-semibold block">
                        {organ.label}
                      </span>
                      <span className="font-mono text-[0.4rem] text-muted-foreground">
                        {organ.organ}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {visitCount > 0 && (
                        <span
                          className="font-mono text-[0.35rem] px-1 py-0.5 rounded"
                          style={{ backgroundColor: `${organ.color}15`, color: organ.color }}
                        >
                          ×{visitCount}
                        </span>
                      )}
                      {isActive && (
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: organ.color }} />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Connection flow */}
            <div className="mt-3 px-2">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              <span className="font-mono text-[0.35rem] text-muted-foreground/50 block text-center mt-1">
                FLUXO: INDEX → NEXUS → ATLAS → TRIBUNAL → NEWS
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => setExpanded(!expanded)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-12 h-12 rounded-2xl bg-card/95 backdrop-blur-xl border border-border/40 shadow-[0_4px_20px_-4px_hsl(var(--primary)/0.3)] flex items-center justify-center transition-all hover:border-primary/40"
        style={{
          boxShadow: `0 4px 24px -4px ${currentOrgan.color}40`,
        }}
      >
        <span style={{ color: currentOrgan.color }}>{currentOrgan.icon}</span>
        <span
          className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full animate-pulse"
          style={{ backgroundColor: currentOrgan.color }}
        />
        {/* Visit counter badge */}
        {navHistory.length > 1 && (
          <span className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full bg-card border border-border/50 flex items-center justify-center">
            <span className="font-mono text-[0.3rem] text-primary font-bold">{navHistory.length}</span>
          </span>
        )}
      </motion.button>
    </div>
  );
}
