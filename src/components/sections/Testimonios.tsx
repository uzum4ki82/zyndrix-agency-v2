'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';

export const Testimonios = () => (
  <section id="testimonios" className="py-60 px-10 relative bg-surface-low/10">
    <div className="max-w-7xl mx-auto">
      <SectionHeader title="Casos Reales" subtitle="Autoridad Industrial" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full z-0 pointer-events-none" />

        <motion.div 
          whileHover={{ y: -15, scale: 1.02 }}
          className="glass-premium p-20 rounded-[5rem] relative overflow-hidden group shadow-2xl border border-white/5"
        >
          <Quote className="absolute top-14 right-14 w-32 h-32 text-white/5 opacity-40 rotate-[15deg] group-hover:scale-125 transition-transform" />
          <div className="relative z-10">
            <div className="flex items-center gap-10 mb-16">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/40 blur-2xl rounded-full opacity-0 group-hover:opacity-60 transition-opacity" />
                <img src="/img/test_1.png" alt="Marc Soler" className="w-28 h-28 rounded-[2.5rem] object-cover grayscale brightness-110 border-2 border-white/10 relative z-10" />
              </div>
              <div>
                <h4 className="text-3xl font-heading font-black uppercase italic tracking-tighter mb-1">Marc Soler</h4>
                <p className="text-primary text-[10px] font-black tracking-[0.4em] uppercase italic opacity-60">CEO @ TechFlow Labs</p>
              </div>
            </div>
            <p className="text-3xl font-medium italic leading-[1.4] text-white/70 mb-10 lowercase tracking-tight">
              "la arquitectura que zyndrix construyó para nuestro soporte bajó los tiempos de espera a <span className="text-primary">CERO</span>. no son programadores, son arquitectos de negocio."
            </p>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -15, scale: 1.02 }}
          className="glass-premium p-20 rounded-[5rem] relative overflow-hidden group bg-surface-high/5 shadow-2xl border border-white/5"
        >
          <Quote className="absolute top-14 right-14 w-32 h-32 text-white/5 opacity-40 rotate-[15deg] group-hover:scale-125 transition-transform" />
          <div className="relative z-10">
            <div className="flex items-center gap-10 mb-16">
              <div className="relative">
                <div className="absolute inset-0 bg-secondary/40 blur-2xl rounded-full opacity-0 group-hover:opacity-60 transition-opacity" />
                <img src="/img/test_2.png" alt="Elena Vance" className="w-28 h-28 rounded-[2.5rem] object-cover grayscale brightness-110 border-2 border-white/10 relative z-10" />
              </div>
              <div>
                <h4 className="text-3xl font-heading font-black uppercase italic tracking-tighter mb-1">Elena Vance</h4>
                <p className="text-white/40 text-[10px] font-black tracking-[0.4em] uppercase italic opacity-60">Ops Director @ PrimeReal</p>
              </div>
            </div>
            <p className="text-3xl font-medium italic leading-[1.4] text-white/70 mb-10 lowercase tracking-tight">
              "implementar el <span className="text-white">lead score core</span> fue la mejor decisión del año. escala nuestro pipeline sin contratar más personal. simplemente funciona."
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);
