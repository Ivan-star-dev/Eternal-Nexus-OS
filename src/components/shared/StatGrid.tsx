import React from 'react';

interface Stat {
  value: string | number;
  label: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

interface StatGridProps {
  stats: Stat[];
  cols?: 2 | 3 | 4 | 6;
  className?: string;
}

const colsClassMap: Record<2 | 3 | 4 | 6, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-4',
  6: 'grid-cols-3 md:grid-cols-6',
};

function TrendIndicator({ trend, trendValue }: { trend: Stat['trend']; trendValue?: string }) {
  if (!trend || trend === 'neutral') {
    return trendValue ? (
      <span className="text-paper-dim/40 text-xs">{trendValue}</span>
    ) : null;
  }

  if (trend === 'up') {
    return (
      <span className="text-emerald-400 text-xs">
        ↑{trendValue ? ` ${trendValue}` : ''}
      </span>
    );
  }

  return (
    <span className="text-rose-400 text-xs">
      ↓{trendValue ? ` ${trendValue}` : ''}
    </span>
  );
}

export function StatGrid({ stats, cols = 4, className = '' }: StatGridProps) {
  const gridCols = colsClassMap[cols];

  return (
    <div
      className={`grid ${gridCols} border border-white/[0.05] rounded-sm ${className}`}
    >
      {stats.map((stat, index) => {
        const isLastInRow = (index + 1) % cols === 0;
        const isLast = index === stats.length - 1;
        const showDivider = !isLastInRow && !isLast;

        return (
          <div
            key={index}
            className={`px-5 py-4 ${showDivider ? 'border-r border-white/[0.04]' : ''}`}
          >
            <div className="font-mono text-2xl md:text-3xl font-light text-gold">
              {stat.value}
            </div>
            <div className="font-mono text-[0.42rem] tracking-[0.22em] uppercase text-paper-dim/40 mt-1">
              {stat.label}
            </div>
            {(stat.trend || stat.trendValue) && (
              <div className="mt-1">
                <TrendIndicator trend={stat.trend} trendValue={stat.trendValue} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default StatGrid;
