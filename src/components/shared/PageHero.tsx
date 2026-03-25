import React from 'react';
import { motion } from 'framer-motion';
import { SectionLabel } from './SectionLabel';

interface PageHeroProps {
  label: string;           // mono uppercase label e.g. "ATLAS ENGINE · GEOGRAPHIC INTELLIGENCE"
  title: string;           // serif headline
  subtitle?: string;       // optional subtitle
  labelColor?: string;     // default: "text-gold/60"
  children?: React.ReactNode; // optional slot for CTAs or extra content
}

export function PageHero({ label, title, subtitle, labelColor, children }: PageHeroProps) {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 md:px-16 border-b border-white/[0.04]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <SectionLabel color={labelColor}>{label}</SectionLabel>
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-paper mt-3 mb-4">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-paper-dim/70 font-light max-w-2xl">{subtitle}</p>
        )}
        {children}
      </motion.div>
    </section>
  );
}

export default PageHero;
