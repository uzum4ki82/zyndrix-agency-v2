'use client';

import { motion } from 'framer-motion';
import { Target, Zap, Clock, Activity } from 'lucide-react';

const icons = [Target, Clock, Zap, Activity];

export const Impacto = ({ dict = {} }: { dict: any }) => (
  <section id="impacto-stats" className="py-12 px-6 relative bg-base overflow-hidden border-t border-primary/10">
    <div className="arch-grid opacity-10" />
    
    <div className="max-w-7xl mx-auto relative z-10">
      <div className="flex flex-col mb-8 max-w-3xl">
        <div className="text-[9px] font-black uppercase tracking-[0.6em] text-slate-600 mb-8 flex items-center gap-4">
          <div className="w-8 h-[1px] bg-primary/20" />
          {dict.badge}
        </div>
        <h2 className="text-4xl md:text-8xl font-heading font-black text-primary mb-8 tracking-[-0.05em] uppercase leading-[0.85]">
          {dict.title}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {dict?.stats?.map((stat: any, i: number) => {
          const Icon = icons[i % icons.length];
          return (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-14 md:p-16 border border-primary/10 group hover:shadow-2xl transition-all duration-700 relative overflow-hidden"
            >
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="text-primary/20 group-hover:text-black transition-colors mb-12">
                    <Icon strokeWidth={1.5} size={32} />
                  </div>
                  <div className="text-6xl md:text-8xl font-heading font-black text-primary mb-8 tracking-tighter leading-none">
                    {stat.value}
                  </div>
                </div>
                <div className="text-[11px] font-black uppercase tracking-[0.5em] text-secondary/50 group-hover:text-primary transition-colors">
                  {stat.label}
                </div>
              </div>
              
              {/* ID Tag */}
              <div className="absolute top-10 right-10 text-[7px] font-black tracking-[0.5em] text-primary/5 uppercase">
                MET_VAL_0{i+1}
              </div>

              {/* Decorative progress line */}
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-primary/5 overflow-hidden">
                 <motion.div 
                   className="absolute inset-0 bg-primary"
                   initial={{ x: "-100%" }}
                   whileInView={{ x: "0%" }}
                   transition={{ duration: 1, delay: i * 0.2 }}
                 />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);
