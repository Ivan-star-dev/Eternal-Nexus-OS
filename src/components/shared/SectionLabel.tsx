import React from 'react';

interface SectionLabelProps {
  children: React.ReactNode;
  color?: string;  // default: "text-gold/60"
  className?: string;
}

export function SectionLabel({ children, color, className }: SectionLabelProps) {
  return (
    <span className={`font-mono text-[0.48rem] tracking-[0.28em] uppercase ${color ?? 'text-gold/60'} ${className ?? ''}`}>
      {children}
    </span>
  );
}

export default SectionLabel;
