'use client';

import { motion } from 'framer-motion';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  centered?: boolean;
}

export const SectionHeader = ({ title, subtitle, badge, centered = true }: SectionHeaderProps) => (
  <div className={`mb-12 ${centered ? 'text-center' : ''} relative`}>
    <div className="absolute inset-0 bg-primary/5 blur-[120px] opacity-10 pointer-events-none" />
    
    {badge && (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-[12px] font-black uppercase tracking-[0.6em] mb-10 shadow-[0_0_20px_rgba(56,189,248,0.1)] backdrop-blur-3xl"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        {badge}
      </motion.div>
    )}
    
    <motion.h2
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="text-5xl md:text-7xl font-heading font-black uppercase italic tracking-[calc(-0.04em)] leading-[0.95] text-white drop-shadow-2xl"
    >
      {title}
    </motion.h2>
    
    {subtitle && (
      <p className={`text-lg md:text-2xl text-white/40 mt-8 font-medium italic lowercase leading-relaxed max-w-4xl ${centered ? 'mx-auto' : ''}`}>
        {subtitle}
      </p>
    )}
    
    <div className={`h-[1px] w-24 bg-gradient-to-r from-transparent via-primary/40 to-transparent mt-12 ${centered ? 'mx-auto' : ''}`} />
  </div>
);
