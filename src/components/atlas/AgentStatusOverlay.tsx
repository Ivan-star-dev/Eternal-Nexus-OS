import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Zap, Activity } from "lucide-react";
import { AI_AGENTS, type AIAgent } from "./AutoWorkingAgents";

export default function AgentStatusOverlay() {
  const [agentProgress, setAgentProgress] = useState<Record<string, number>>({});
  const [expanded, setExpanded] = useState(false);

  // Simulate progress updates
  useEffect(() => {
    const interval = setInterval(() => {
      const updates: Record<string, number> = {};
      AI_AGENTS.forEach(a => {
        const t = Date.now() * 0.001;
        updates[a.id] = Math.sin(t * 0.1 + AI_AGENTS.indexOf(a) * 1.5) * 0.5 + 0.5;
      });
      setAgentProgress(updates);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-16 right-4 z-40">
      {/* Toggle button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 bg-card/90 backdrop-blur-sm border border-primary/30 rounded-lg px-3 py-2 hover:border-primary/50 transition-colors mb-2"
      >
        <Bot className="h-3.5 w-3.5 text-primary" />
        <span className="font-mono text-[0.5rem] text-primary tracking-wider">
          AI AGENTS — {AI_AGENTS.length} ATIVOS
        </span>
        <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-lg overflow-hidden"
          >
            <div className="p-3 space-y-2 max-h-[400px] overflow-y-auto">
              {AI_AGENTS.map(agent => {
                const progress = agentProgress[agent.id] || 0;
                const pct = Math.round(progress * 100);
                return (
                  <div key={agent.id} className="flex items-center gap-2 py-1.5 px-2 rounded bg-muted/20">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0 animate-pulse"
                      style={{ backgroundColor: agent.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[0.5rem] text-foreground font-semibold truncate">
                          {agent.name}
                        </span>
                        <span className="font-mono text-[0.4rem] text-muted-foreground">
                          {agent.role}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: agent.color }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 1 }}
                          />
                        </div>
                        <span className="font-mono text-[0.4rem] text-primary w-7 text-right">
                          {pct}%
                        </span>
                      </div>
                      <span className="font-mono text-[0.35rem] text-muted-foreground">
                        → {agent.projectName}
                      </span>
                    </div>
                    <Zap className="h-2.5 w-2.5 shrink-0" style={{ color: agent.color }} />
                  </div>
                );
              })}
            </div>

            <div className="border-t border-border/30 px-3 py-2 flex items-center gap-2">
              <Activity className="h-3 w-3 text-green-400" />
              <span className="font-mono text-[0.4rem] text-muted-foreground">
                Auto-execução ativa — loop contínuo
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
