'use client';

import { motion } from 'framer-motion';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  centered?: boolean;
}

export const SectionHeader = ({ title, subtitle, badge, centered = true }: SectionHeaderProps) => (
  <div className={`mb-8 md:mb-12 ${centered ? 'text-center' : ''} relative`}>
    {badge && (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-slate-50 border border-primary/5 text-primary/60 text-[9px] font-bold uppercase tracking-[0.4em] mb-8"
      >
        <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
        {badge}
      </motion.div>
    )}
    
    <motion.h2
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="text-4xl md:text-6xl font-heading font-black uppercase tracking-tight text-primary leading-[0.9]"
    >
      {title}
    </motion.h2>
    
    {subtitle && (
      <p className={`text-base md:text-lg text-secondary mt-6 font-medium leading-relaxed max-w-3xl ${centered ? 'mx-auto' : ''}`}>
        {subtitle}
      </p>
    )}
    
    <div className={`h-[1px] w-20 bg-primary/10 mt-10 ${centered ? 'mx-auto' : ''}`} />
  </div>
);

