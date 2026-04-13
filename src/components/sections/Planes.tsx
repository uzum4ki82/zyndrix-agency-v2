'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';

export const Planes = ({ dict = {}, system }: { dict: any, system?: any }) => {
  return (
    <section id="precios" className="py-24 px-6 relative overflow-hidden bg-secondary text-white">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[180px] opacity-20 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center mb-16 text-center">
           <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary mb-6">{dict.badge}</div>
           <h2 className="text-5xl md:text-7xl font-heading font-black text-white mb-6 tracking-[-0.04em] uppercase leading-[0.9]">{dict.title}</h2>
           <p className="text-xl text-white/40 leading-relaxed font-medium max-w-2xl">{dict.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {dict.items?.map((plan: any, idx: number) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-10 rounded-[3rem] border transition-all duration-500 flex flex-col relative group ${plan.recommended ? 'bg-white border-primary shadow-2xl scale-105 z-20' : 'bg-white/5 border-white/10 hover:border-white/20 z-10'}`}
            >
              {plan.recommended && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black px-8 py-3 rounded-full uppercase tracking-[0.2em] shadow-xl">
                  {dict.recommended}
                </div>
              )}

              <div className="mb-10">
                <div className={`font-black text-[12px] tracking-[0.4em] uppercase mb-4 ${plan.recommended ? 'text-primary' : 'text-white/40'}`}>{plan.name}</div>
                <div className={`text-[10px] font-bold tracking-[0.2em] mb-4 uppercase flex items-center gap-2 ${plan.recommended ? 'text-secondary/60' : 'text-white/20'}`}>
                   {dict.investment}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className={`text-6xl md:text-7xl font-heading font-black tracking-tighter italic ${plan.recommended ? 'text-secondary' : 'text-white'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-2xl font-black italic ${plan.recommended ? 'text-secondary/40' : 'text-white/20'}`}>€</span>
                </div>
              </div>

              <div className="flex-grow mb-12">
                <ul className="space-y-5">
                  {plan.features.map((feature: string, fIdx: number) => (
                    <li key={fIdx} className={`flex items-start gap-4 text-[14px] font-medium leading-relaxed ${plan.recommended ? 'text-secondary/70' : 'text-white/40'}`}>
                      <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.recommended ? 'text-primary' : 'text-white/20'}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <a 
                href="#contacto" 
                className={`w-full py-6 flex items-center justify-center gap-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-300 ${plan.recommended ? 'bg-primary text-white hover:bg-secondary' : 'bg-white/10 text-white hover:bg-white hover:text-secondary'}`}
              >
                <span>{dict.cta}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
