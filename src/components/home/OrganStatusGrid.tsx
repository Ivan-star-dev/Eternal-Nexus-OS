// Grid de status dos órgãos — mostra atividade em tempo real de cada parte do organismo
// PLv2: id, path, label, organName, color vêm de workspace.ts (getOrgan)
// icon, status, metric, metricLabel são dados de display local (ainda não vivos)
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Brain, Globe, Scale, Radio, Newspaper, Activity } from "lucide-react";
import { getOrgan } from "@/config/workspace";

interface OrganDisplay {
  icon: React.ReactNode;
  status: string;
  metric: string;
  metricLabel: string;
}

// Dados de display local — icon + status/metric são placeholders até integração viva (PLv3+)
const ORGAN_DISPLAY: Record<string, OrganDisplay> = {
  nexus:       { icon: <Brain className="h-5 w-5" />,    status: "3 EIs debatendo",   metric: "847",   metricLabel: "simulações" },
  atlas:       { icon: <Globe className="h-5 w-5" />,    status: "12 projetos ativos", metric: "60fps", metricLabel: "rendering" },
  tribunal:    { icon: <Scale className="h-5 w-5" />,    status: "5 juízes online",    metric: "24",    metricLabel: "narrativas" },
  news:        { icon: <Radio className="h-5 w-5" />,    status: "Echo-Vox ativo",     metric: "6",     metricLabel: "alertas hoje" },
  investor:    { icon: <Newspaper className="h-5 w-5" />, status: "DeltaSpine NL",    metric: "$2.8B", metricLabel: "pipeline" },
  geopolitics: { icon: <Activity className="h-5 w-5" />, status: "Mapa vivo",          metric: "147",   metricLabel: "países" },
};

// Ordem de exibição no grid — subset dos órgãos do workspace (sem index)
const GRID_ORGAN_IDS = ['nexus', 'atlas', 'tribunal', 'news', 'investor', 'geopolitics'] as const;

// Combina config canônica (workspace) com dados de display local
const organs = GRID_ORGAN_IDS.flatMap(id => {
  const config = getOrgan(id);
  const display = ORGAN_DISPLAY[id];
  if (!config || !display) return [];
  return [{ ...config, ...display }];
});

const ease = [0.16, 1, 0.3, 1] as const;

export default function OrganStatusGrid() {
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
                        {/* Pulse */}
                        <span
                          className="absolute w-2 h-2 rounded-full top-0 right-0 animate-pulse"
                          style={{ backgroundColor: organ.color }}
                        />
                      </div>
                      <div>
                        <span className="font-mono text-[0.55rem] tracking-[0.15em] text-foreground font-bold block">
                          {organ.label}
                        </span>
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
