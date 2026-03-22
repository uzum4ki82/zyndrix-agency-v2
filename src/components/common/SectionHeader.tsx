'use client';

import { motion } from 'framer-motion';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export const SectionHeader = ({ title, subtitle, centered = false }: SectionHeaderProps) => (
  <div className={`mb-20 ${centered ? 'text-center' : ''}`}>
    {subtitle && (
      <motion.span
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="text-[10px] font-black uppercase tracking-[0.5em] text-primary mb-6 block"
      >
        {subtitle}
      </motion.span>
    )}
    <motion.h2
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="text-5xl md:text-7xl font-heading font-black uppercase italic tracking-tighter leading-none"
    >
      {title}
    </motion.h2>
    <div className={`h-1 w-20 bg-primary mt-8 ${centered ? 'mx-auto' : ''}`} />
  </div>
);
