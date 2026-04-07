'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Users, Zap, BarChart3, Clock, Database, Globe, Layers } from 'lucide-react';

const icons = [TrendingUp, Users, Zap, BarChart3, Clock, Database, Globe, Layers];

export const Impacto = ({ dict = {} }: { dict: any }) => (
  <section id="impacto" className="py-12 md:py-20 px-6 md:px-10 relative overflow-hidden bg-base">
    {/* Animated Background Mesh */}
    <div className="absolute inset-0 bg-mesh opacity-20 pointer-events-none" />
    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-20" />
    
    <div className="max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-16 flex flex-col items-center">
        <motion.span 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="text-primary font-black text-[10px] tracking-[0.5em] uppercase mb-6 inline-block px-8 py-3 bg-primary/5 rounded-full border border-primary/20 shadow-[0_0_20px_rgba(56,189,248,0.1)]"
        >
          {dict.badge || "INDICADORES NUCLEARES"}
        </motion.span>
        <motion.h2 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           className="text-5xl md:text-7xl font-heading font-black uppercase italic text-white tracking-tighter leading-none mb-4 drop-shadow-2xl"
        >
          {dict.title}
        </motion.h2>
        <div className="w-24 h-1 bg-primary/30 rounded-full mt-4 animate-glow" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pt-10">
        {dict?.stats?.map((stat: any, i: number) => {
          const Icon = icons[i % icons.length];
          return (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="glass-premium p-10 rounded-[3.5rem] border border-white/5 text-left group hover:bg-white/[0.03] transition-all duration-700 relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-20 transition-opacity">
                 <Icon className="w-32 h-32 text-primary" />
              </div>
              
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/10 group-hover:bg-primary/20 group-hover:border-primary/40 transition-all duration-500 shadow-xl relative z-10">
                <Icon className="w-6 h-6 text-white group-hover:text-primary transition-colors" />
              </div>
              
              <div className="text-5xl md:text-6xl font-heading font-black text-white mb-2 italic tracking-tighter text-glow drop-shadow-2xl relative z-10">
                 {stat.value}
              </div>
              
              <div className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40 group-hover:text-white transition-colors relative z-10 leading-relaxed max-w-[150px]">
                 {stat.label}
              </div>
              
              <div className="absolute bottom-8 left-10 h-[2px] w-6 bg-primary/20 group-hover:w-16 transition-all duration-700" />
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);
