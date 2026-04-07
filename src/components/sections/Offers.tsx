'use client';

import { motion } from 'framer-motion';
import { Tag, Clock, ArrowRight, Zap, Gem } from 'lucide-react';

export const Offers = ({ dict }: { dict: any }) => (
  <section id="ofertas" className="py-12 md:py-20 px-10 relative overflow-hidden bg-base">
    {/* Animated Background Mesh - Hot Accents */}
    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[600px] bg-primary/20 blur-[200px] opacity-20 animate-pulse pointer-events-none" />
    <div className="absolute inset-0 bg-mesh opacity-10 pointer-events-none" />
    
    <div className="max-w-6xl mx-auto relative z-10 text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="inline-flex items-center gap-3 px-8 py-3 bg-red-500/10 border border-red-500/30 rounded-full text-[11px] font-black uppercase tracking-[0.5em] text-red-400 mb-10 shadow-[0_0_30px_rgba(239,68,68,0.1)]"
      >
        <Zap className="w-4 h-4 animate-pulse" /> {dict.badge}
      </motion.div>

      <h2 className="text-6xl md:text-8xl lg:text-9xl font-heading font-black uppercase italic tracking-tighter leading-[0.8] mb-12 text-white drop-shadow-2xl">
        {dict.title_part1}<br/>
        <span className="text-gradient-cyan">{dict.title_part2}</span>
      </h2>

      <p className="max-w-3xl mx-auto text-xl md:text-3xl text-white/40 mb-20 font-medium italic lowercase leading-relaxed">
        {dict.subtitle}
      </p>

      {/* Main Offer Card */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="glass-premium p-12 md:p-24 rounded-[5rem] border border-white/10 relative overflow-hidden group shadow-[0_0_100px_rgba(0,0,0,0.5)]"
      >
        {/* Decorative corner tag */}
        <div className="absolute top-0 right-0 p-12 overflow-hidden pointer-events-none opacity-5">
           <Gem className="w-64 h-64 text-primary" />
        </div>

        <div className="flex flex-col md:flex-row items-center gap-20">
           <div className="text-left space-y-12 md:w-3/5 relative z-10">
              <div className="space-y-4">
                 <div className="flex items-center gap-3 text-primary font-black uppercase tracking-[0.4em] text-xs">
                    <Tag className="w-5 h-5" /> {dict.discount_label}
                 </div>
                 <h3 className="text-5xl md:text-7xl font-heading font-black italic tracking-tighter uppercase leading-none text-white leading-tight">
                   {dict.discount_value}
                 </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-white/5">
                 {dict.items.map((feat: string, i: number) => (
                    <div key={i} className="flex items-center gap-4 group/item">
                       <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center border border-primary/40 group-hover/item:bg-primary transition-all">
                          <Zap className="w-3 h-3 text-primary group-hover/item:text-black" />
                       </div>
                       <span className="text-[14px] font-black uppercase italic tracking-tighter text-white/40 group-hover/item:text-white transition-colors">
                          {feat}
                       </span>
                    </div>
                 ))}
              </div>
           </div>

           <div className="md:w-2/5 flex flex-col items-center justify-center space-y-8 bg-black/40 p-12 rounded-[3.5rem] border border-white/5 backdrop-blur-3xl shadow-inner relative z-10">
              <div className="text-center">
                 <div className="text-white/20 text-[10px] font-black uppercase tracking-[0.5em] mb-4">{dict.slots_label}</div>
                 <div className="text-8xl md:text-9xl font-heading font-black text-primary italic leading-none trekking-tighter">{dict.slots_value}</div>
              </div>
              <div className="flex items-center gap-4 text-red-400 font-mono text-[11px] font-bold animate-pulse">
                 <Clock className="w-4 h-4" /> {dict.reset_label}
              </div>
              <a href="#contacto" className="btn-elite w-full group py-8 h-24">
                 <span className="text-[18px]">{dict.cta}</span>
                 <ArrowRight className="w-7 h-7 group-hover:translate-x-3 transition-transform" />
              </a>
           </div>
        </div>

        {/* Ambient Progress bar at the bottom */}
        <div className="absolute bottom-0 left-0 h-[4px] bg-primary w-[60%] animate-pulse shadow-[0_0_20px_rgba(56,189,248,0.8)]" />
      </motion.div>
    </div>
  </section>
);
