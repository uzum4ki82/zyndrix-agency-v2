'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, Zap } from 'lucide-react';

export const Guarantee = ({ dict }: { dict: any }) => {
  return (
    <section className="py-16 px-6 relative overflow-hidden bg-base border-y border-white/5">
      <div className="absolute inset-0 bg-mesh opacity-10 pointer-events-none" />
      
      <div className="max-w-5xl mx-auto glass-premium p-10 md:p-20 rounded-[4rem] border border-primary/20 relative z-10 overflow-hidden group shadow-[0_0_80px_rgba(56,189,248,0.1)]">
        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
           <ShieldCheck className="w-64 h-64 text-primary" />
        </div>
        
        <div className="flex flex-col items-center text-center space-y-10">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="px-8 py-3 bg-primary/10 rounded-full border border-primary/30 flex items-center gap-4 shadow-xl"
          >
            <Zap className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-[12px] font-black uppercase tracking-[0.6em] text-primary">{dict.badge}</span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-heading font-black text-white uppercase italic tracking-tighter leading-none">
            {dict.title}
          </h2>

          <p className="text-white/40 text-lg md:text-xl font-medium italic uppercase tracking-tight leading-relaxed max-w-3xl">
            {dict.subtitle}
          </p>

          <div className="pt-6 w-full max-w-sm mx-auto">
            <a href="#contacto" className="btn-elite w-full group py-6 h-20 bg-primary hover:bg-white text-black hover:text-black transition-all rounded-full flex items-center justify-center gap-4">
              <span className="text-[15px] font-black">{dict.cta}</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
