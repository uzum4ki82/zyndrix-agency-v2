'use client';

import { motion } from 'framer-motion';
import { Rocket, Shield, Activity, Users, ShieldCheck, Zap, TrendingUp, Cpu } from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';

const icons = [TrendingUp, ShieldCheck, Zap, Cpu];

export const Beneficios = ({ dict = {} }: { dict: any }) => (
  <section id="beneficios" className="py-32 px-10 bg-black/50 backdrop-blur-3xl relative overflow-hidden border-y border-white/5">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.05)_0%,transparent_100%)] opacity-30 pointer-events-none" />
    
    <div className="max-w-7xl mx-auto relative z-10">
      <SectionHeader title={dict.title} badge={dict.badge} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pt-20">
        {dict.items.map((benefit: any, i: number) => {
          const Icon = icons[i % icons.length];
          return (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
              className="p-12 rounded-[4rem] border border-white/5 bg-white/[0.02] group hover:bg-white/[0.05] transition-all duration-700 relative overflow-hidden"
            >
              <div className="absolute top-10 left-10 text-[60px] font-heading font-black text-white/[0.02] italic pointer-events-none group-hover:text-primary/10 transition-colors">
                 0{i + 1}
              </div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mb-10 border border-primary/20 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-500 shadow-xl shadow-primary/10">
                  <Icon className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl font-heading font-black uppercase italic text-white mb-6 tracking-tighter leading-none group-hover:text-primary transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-[13px] font-black italic lowercase tracking-[calc(-0.01em)] text-white/30 leading-relaxed group-hover:text-white/60 transition-colors">
                  {benefit.description}
                </p>
              </div>
              
              {/* Corner decor */}
              <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-primary/10 group-hover:border-primary/40 transition-colors origin-bottom-right group-hover:scale-125 duration-1000" />
            </motion.div>
          );
        })}
      </div>
    </div>
    
    {/* Global background text */}
    <div className="absolute -bottom-20 -left-20 text-[200px] font-heading font-black text-white/[0.01] uppercase italic pointer-events-none select-none tracking-tighter whitespace-nowrap">
      PROBABILITY_LOCK
    </div>
  </section>
);
