import React from 'react';

type BadgeColor = 'gold' | 'emerald' | 'blue' | 'rose';

interface DataCardProps {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: BadgeColor;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const badgeColorClassMap: Record<BadgeColor, string> = {
  gold: 'bg-gold/10 text-gold border-gold/20',
  emerald: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
  blue: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
  rose: 'bg-rose-400/10 text-rose-400 border-rose-400/20',
};

interface BadgePillProps {
  color?: BadgeColor;
  children: React.ReactNode;
}

function BadgePill({ color = 'gold', children }: BadgePillProps) {
  const colorClasses = badgeColorClassMap[color];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-sm border font-mono text-[0.42rem] tracking-[0.18em] uppercase ${colorClasses}`}
    >
      {children}
    </span>
  );
}

export function DataCard({
  title,
  subtitle,
  badge,
  badgeColor = 'gold',
  children,
  className = '',
  onClick,
}: DataCardProps) {
  return (
    <div
      className={`bg-ink-medium/60 border border-white/[0.05] rounded-sm p-5 hover:border-white/[0.12] transition-all duration-200 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {badge && <BadgePill color={badgeColor}>{badge}</BadgePill>}
      <h3 className="font-mono text-[0.55rem] tracking-[0.2em] uppercase text-paper/80 mt-2">
        {title}
      </h3>
      {subtitle && (
        <p className="text-xs text-paper-dim/60 font-light mt-1">{subtitle}</p>
      )}
      {children}
    </div>
  );
}

export default DataCard;
