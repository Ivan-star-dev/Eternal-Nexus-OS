// Grid de status dos órgãos — mostra atividade em tempo real de cada parte do organismo
// PLv2: id, path, label, organName, color vêm de workspace.ts (getOrgan)
// PLv3: metric/status vêm de useOrganLiveStatus — ATLAS e TRIBUNAL são fontes reais
//       isLive: true → dado vivo | isLive: false → placeholder (PLv4+)
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Brain, Globe, Scale, Radio, Newspaper, Activity } from "lucide-react";
import { getOrgan } from "@/config/workspace";
import { useOrganLiveStatus } from "@/hooks/useOrganLiveStatus";

// Ícones por órgão — puramente visual, não é dado
const ORGAN_ICONS: Record<string, React.ReactNode> = {
  nexus:       <Brain className="h-5 w-5" />,
  atlas:       <Globe className="h-5 w-5" />,
  tribunal:    <Scale className="h-5 w-5" />,
  news:        <Radio className="h-5 w-5" />,
  investor:    <Newspaper className="h-5 w-5" />,
  geopolitics: <Activity className="h-5 w-5" />,
};

// Ordem de exibição no grid — subset dos órgãos do workspace (sem index)
const GRID_ORGAN_IDS = ['nexus', 'atlas', 'tribunal', 'news', 'investor', 'geopolitics'] as const;

const ease = [0.16, 1, 0.3, 1] as const;

export default function OrganStatusGrid() {
  const liveStatus = useOrganLiveStatus();

  const organs = GRID_ORGAN_IDS.flatMap(id => {
    const config = getOrgan(id);
    const icon = ORGAN_ICONS[id];
    const live = liveStatus[id];
    if (!config || !live) return [];
    return [{ ...config, icon, ...live }];
  });

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 md:px-16 lg:px-20" aria-label="Status dos órgãos do organismo digital">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="text-center mb-16"
        >
          <span className="font-mono text-[0.55rem] tracking-[0.25em] text-muted-foreground uppercase">
            Sistema Neural Ativo
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mt-3">
            Órgãos do <span className="text-primary italic font-light">Organismo</span>
          </h2>
          <div className="h-px w-20 mx-auto mt-6" style={{ background: "var(--gradient-gold)" }} />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {organs.map((organ, i) => (
            <motion.div
              key={organ.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, ease }}
            >
              <Link to={organ.path} className="block group">
                <div className="relative bg-card border border-border/30 rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_8px_32px_-8px_hsl(var(--primary)/0.15)] overflow-hidden tribunal-approved morabeza-glow">
                  {/* Glow top bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `linear-gradient(90deg, transparent, ${organ.color}, transparent)` }}
                  />

                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="relative flex items-center justify-center w-10 h-10 rounded-xl"
                        style={{ backgroundColor: `${organ.color}12` }}
                      >
                        <span style={{ color: organ.color }}>{organ.icon}</span>
                        {/* Pulse — mais vivo quando isLive */}
                        <span
                          className="absolute w-2 h-2 rounded-full top-0 right-0 animate-pulse"
                          style={{ backgroundColor: organ.color, opacity: organ.isLive ? 1 : 0.4 }}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[0.55rem] tracking-[0.15em] text-foreground font-bold block">
                            {organ.label}
                          </span>
                          {/* Indicador LIVE — só para órgãos com fonte real */}
                          {organ.isLive && (
                            <span className="font-mono text-[0.4rem] tracking-[0.1em] text-green-500/80 uppercase">
                              live
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-[0.4rem] text-muted-foreground">
                          {organ.organName}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="font-mono text-[0.5rem] text-muted-foreground mb-3">
                    {organ.status}
                  </p>

                  <div className="flex items-baseline gap-1.5">
                    <span
                      className="font-mono text-2xl font-bold"
                      style={{ color: organ.color }}
                    >
                      {organ.metric}
                    </span>
                    <span className="font-mono text-[0.45rem] text-muted-foreground">
                      {organ.metricLabel}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
