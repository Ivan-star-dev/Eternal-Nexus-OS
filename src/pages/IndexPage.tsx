// sacred-flow: grok
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, AlertTriangle, Thermometer, DollarSign, Shield, Heart, Wrench } from 'lucide-react';
import { IndexEntry } from '@/types/index-organ';
import { useIndexOrgan } from '@/hooks/useIndexOrgan';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  verdict: <AlertTriangle className="h-4 w-4" />,
  climate: <Thermometer className="h-4 w-4" />,
  economy: <DollarSign className="h-4 w-4" />,
  security: <Shield className="h-4 w-4" />,
  health: <Heart className="h-4 w-4" />,
  infra: <Wrench className="h-4 w-4" />,
};

const IndexPage = () => {
  const { entries, isProcessing, lastUpdate, stats } = useIndexOrgan();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    document.title = 'Index — Organism Memory · Eternal Nexus';
  }, []);

  const filteredEntries = activeCategory === 'all'
    ? entries
    : entries.filter((e) => e.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#04040e] text-paper font-serif p-6 flex flex-col lg:flex-row gap-6">
      {/* Main Content */}
      <div className="flex-1">
        {/* Hero Header */}
        <header className="mb-8">
          <p className="font-mono text-[0.48rem] tracking-[0.28em] text-gold/60 uppercase mb-3">
            Sistema · Memória Orgânica
          </p>
          <div className="flex items-center justify-between">
            <h1 className="font-serif text-3xl md:text-4xl font-light text-paper">
              Index — Organism Memory
            </h1>
            <motion.div
              className="w-3 h-3 bg-gold/60 rounded-full"
              animate={{ opacity: isProcessing ? [1, 0.3, 1] : 1 }}
              transition={{ duration: 1, repeat: isProcessing ? Infinity : 0 }}
            />
          </div>
        </header>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            className={`border border-gold/60 text-gold font-mono text-[0.6rem] tracking-[0.12em] uppercase px-3 py-1.5 transition-colors ${activeCategory === 'all' ? 'bg-gold/10' : 'bg-transparent hover:bg-gold/5'}`}
            onClick={() => setActiveCategory('all')}
          >
            Todos ({stats.totalEntries})
          </button>
          {Object.entries(stats.byCategory).map(([cat, count]) => (
            <button
              key={cat}
              className={`inline-flex items-center gap-1 border border-gold/60 text-gold font-mono text-[0.6rem] tracking-[0.12em] uppercase px-3 py-1.5 transition-colors ${activeCategory === cat ? 'bg-gold/10' : 'bg-transparent hover:bg-gold/5'}`}
              onClick={() => setActiveCategory(cat)}
            >
              <span className="mr-0.5">{CATEGORY_ICONS[cat]}</span>
              {cat.charAt(0).toUpperCase() + cat.slice(1)} ({count})
            </button>
          ))}
        </div>

        {/* Card List */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredEntries.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <div className="bg-ink-medium/60 border border-white/[0.05] rounded-sm p-4 flex flex-col gap-3 hover:border-gold/20 transition-colors">
                  <div className="flex justify-between items-start">
                    <h3 className="font-serif text-base font-light text-gold">{entry.title}</h3>
                    <div
                      className="w-2 h-6 rounded-full"
                      style={{
                        background: `linear-gradient(to top, green ${entry.severity * 100}%, yellow ${entry.severity * 100 - 50}%, red 0%)`,
                      }}
                    />
                  </div>
                  <p className="font-serif text-sm text-paper-dim/80 leading-relaxed">{entry.summary}</p>
                  <div className="flex flex-wrap gap-2">
                    {entry.sources.map((s, i) => (
                      <span
                        key={i}
                        className="font-mono text-[0.6rem] tracking-[0.08em] bg-white/[0.04] text-gold/70 px-2 py-1 border border-white/[0.06]"
                      >
                        {s.organ} ({s.confidence.toFixed(2)})
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center font-mono text-[0.6rem] tracking-[0.08em] text-paper-dim/40">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </span>
                    {entry.crossReferences.length > 0 && (
                      <span>Refs: {entry.crossReferences.join(', ')}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Sidebar with Stats */}
      <aside className="w-full lg:w-80">
        <div className="bg-ink-medium/60 border border-white/[0.05] rounded-sm p-5 sticky top-6">
          <p className="font-mono text-[0.48rem] tracking-[0.28em] text-gold/60 uppercase mb-3">
            Painel · Estatísticas
          </p>
          <h2 className="font-serif text-xl font-light text-paper mb-5">Index Stats</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-baseline">
              <span className="font-serif text-sm text-paper-dim/80">Total de Entradas</span>
              <span className="font-mono text-3xl font-light text-gold">{stats.totalEntries}</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="font-serif text-sm text-paper-dim/80">Severidade Média</span>
              <span className="font-mono text-3xl font-light text-gold">{stats.avgSeverity.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-white/[0.05]">
              <p className="font-mono text-[0.48rem] tracking-[0.28em] text-gold/60 uppercase mb-3">Por Categoria</p>
              <ul className="space-y-2">
                {Object.entries(stats.byCategory).map(([cat, count]) => (
                  <li key={cat} className="flex justify-between items-center">
                    <span className="font-serif text-sm text-paper-dim/80">
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </span>
                    <span className="font-mono text-sm text-gold">{count}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-2 border-t border-white/[0.05]">
              <p className="font-mono text-[0.48rem] tracking-[0.28em] text-gold/60 uppercase mb-3">Principais Fontes</p>
              <ul className="space-y-1.5">
                {stats.topSources.map((src, i) => (
                  <li key={i} className="font-serif text-sm text-paper-dim/80">{src}</li>
                ))}
              </ul>
            </div>
            {lastUpdate && (
              <p className="font-mono text-[0.55rem] tracking-[0.08em] text-paper-dim/30 pt-2 border-t border-white/[0.05]">
                Última actualização: {new Date(lastUpdate).toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default IndexPage;
