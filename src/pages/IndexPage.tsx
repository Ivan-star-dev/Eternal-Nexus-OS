// sacred-flow: grok
import { useState } from 'react';
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

  const filteredEntries = activeCategory === 'all'
    ? entries
    : entries.filter((e) => e.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-mono p-6 flex flex-col lg:flex-row gap-6">
      {/* Main Content */}
      <div className="flex-1">
        {/* Header with Pulse Indicator */}
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#FFB347]">INDEX — ORGANISM MEMORY</h1>
          <motion.div
            className="w-3 h-3 bg-[#FFB347] rounded-full"
            animate={{ opacity: isProcessing ? [1, 0.3, 1] : 1 }}
            transition={{ duration: 1, repeat: isProcessing ? Infinity : 0 }}
          />
        </header>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={activeCategory === 'all' ? 'default' : 'outline'}
            className="text-[#FFB347] border-[#FFB347]"
            onClick={() => setActiveCategory('all')}
          >
            All ({stats.totalEntries})
          </Button>
          {Object.entries(stats.byCategory).map(([cat, count]) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? 'default' : 'outline'}
              className="text-[#FFB347] border-[#FFB347]"
              onClick={() => setActiveCategory(cat)}
            >
              <span className="mr-1">{CATEGORY_ICONS[cat]}</span>
              {cat.charAt(0).toUpperCase() + cat.slice(1)} ({count})
            </Button>
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
                <Card className="bg-gray-800 border-gray-700 hover:border-[#FFB347]/50 transition-colors">
                  <CardContent className="p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-[#FFB347]">{entry.title}</h3>
                      <div
                        className="w-2 h-6 rounded-full"
                        style={{
                          background: `linear-gradient(to top, green ${entry.severity * 100}%, yellow ${entry.severity * 100 - 50}%, red 0%)`,
                        }}
                      />
                    </div>
                    <p className="text-gray-300 text-sm">{entry.summary}</p>
                    <div className="flex flex-wrap gap-2">
                      {entry.sources.map((s, i) => (
                        <span
                          key={i}
                          className="text-xs bg-gray-700 text-[#FFB347] px-2 py-1 rounded"
                        >
                          {s.organ} ({s.confidence.toFixed(2)})
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(entry.timestamp).toLocaleTimeString()}
                      </span>
                      {entry.crossReferences.length > 0 && (
                        <span>Refs: {entry.crossReferences.join(', ')}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Sidebar with Stats */}
      <aside className="w-full lg:w-80">
        <Card className="bg-gray-800 border-gray-700 sticky top-6">
          <CardHeader>
            <CardTitle className="text-[#FFB347]">Index Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Total Entries: <span className="text-[#FFB347]">{stats.totalEntries}</span></p>
            <p>Avg Severity: <span className="text-[#FFB347]">{stats.avgSeverity.toFixed(2)}</span></p>
            <div>
              <p>By Category:</p>
              <ul className="list-disc pl-4 text-sm">
                {Object.entries(stats.byCategory).map(([cat, count]) => (
                  <li key={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}: <span className="text-[#FFB347]">{count}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p>Top Sources:</p>
              <ul className="list-disc pl-4 text-sm">
                {stats.topSources.map((src, i) => (
                  <li key={i} className="text-[#FFB347]">{src}</li>
                ))}
              </ul>
            </div>
            {lastUpdate && (
              <p className="text-xs text-gray-400">
                Last Update: {new Date(lastUpdate).toLocaleTimeString()}
              </p>
            )}
          </CardContent>
        </Card>
      </aside>
    </div>
  );
};

export default IndexPage;
