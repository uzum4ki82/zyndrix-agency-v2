'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';

export const Planes = ({ dict = {} }: { dict: any }) => {
  return (
    <section id="precios" className="py-12 md:py-20 px-6 md:px-10 relative overflow-hidden bg-base">
      {/* Decorative center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[180px] opacity-20 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center mb-10">
           <motion.div 
             animate={{ opacity: [1, 0.4, 1] }} 
             transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
             className="font-mono text-[9px] font-black text-primary uppercase tracking-[0.5em] mb-4 flex items-center gap-4 bg-primary/5 px-6 py-2 rounded-full border border-primary/20"
           >
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping shadow-[0_0_10px_rgba(56,189,248,0.8)]" />
              SISTEMA: ANALIZANDO MODELOS DE INVERSIÓN // CALCULANDO ROI_OPTIMAL
           </motion.div>
        </div>
        <SectionHeader title={dict.title} subtitle={dict.subtitle} badge={dict.badge} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-stretch pt-12">
          {dict?.items?.map((plan: any, idx: number) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15, type: "spring", stiffness: 100 }}
              className={`p-8 md:p-14 rounded-[3.5rem] md:rounded-[4rem] border transition-all duration-700 flex flex-col relative group ${plan.recommended ? 'glass-premium border-primary/50 shadow-[0_0_100px_rgba(56,189,248,0.15)] md:scale-105 z-20' : 'bg-white/5 border-white/5 hover:border-white/20 z-10'}`}
            >
              {plan.recommended && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-primary text-black text-[11px] font-black px-10 py-3 rounded-full uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(56,189,248,0.5)]">
                  {dict.recommended}
                </div>
              )}

              <div className="mb-12 relative">
                <div className="text-primary/40 font-black text-[10px] tracking-[0.4em] uppercase mb-4">{plan.name}</div>
                <div className="text-white/20 font-mono text-[9px] font-bold tracking-[0.3em] mb-4 uppercase flex items-center gap-2">
                   <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
                   {dict.investment}: {plan.setup}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl lg:text-8xl font-heading font-black text-white tracking-tighter italic leading-none">
                    {plan.price}{!isNaN(Number(plan.price)) && <span className="text-4xl ml-1">€</span>}
                  </span>
                  {!isNaN(Number(plan.price)) && <span className="text-white/20 font-black italic uppercase text-lg">{dict.monthly_suffix}</span>}
                </div>
              </div>

              <div className="flex-grow mb-16 px-2">
                <ul className="space-y-6">
                  {plan.features.map((feature: string, fIdx: number) => (
                    <li key={fIdx} className="flex items-start gap-4 text-white/40 text-[13px] font-medium leading-relaxed group-hover:text-white transition-colors duration-500">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <a 
                href="#contacto" 
                className="btn-elite w-full group py-8 h-20"
              >
                <span className="text-[14px]">{dict.cta}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform" />
              </a>
              
              {/* Subtle background number Decoration */}
              <div className="absolute bottom-10 right-10 text-9xl font-heading font-black text-white/5 italic pointer-events-none group-hover:text-primary/5 transition-colors duration-1000">
                 0{idx + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
