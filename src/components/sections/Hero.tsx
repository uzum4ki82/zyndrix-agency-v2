'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';
import Image from 'next/image';

export const Hero = ({ dict }: { dict: any }) => {
  return (
    <section className="relative min-h-[85vh] flex items-center pt-24 pb-16 px-6 overflow-hidden bg-white">
      {/* Subtle background element */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-1/4 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-[42%] space-y-10 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-primary/10 border border-primary/20 rounded-full">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">{dict.badge}</span>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-heading font-black text-secondary leading-[0.95] tracking-tighter uppercase">
              {dict.title_main} <br/>
              <span className="text-primary italic">{dict.title_highlight}</span>
            </h1>

            <p className="text-xl md:text-2xl text-secondary/70 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
              {dict.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
              <a 
                href="#precios"
                className="w-full sm:w-auto px-10 py-6 bg-primary hover:bg-primary/90 text-white font-bold tracking-widest uppercase flex items-center justify-center gap-3 transition-all duration-300 shadow-xl shadow-primary/20 rounded-xl"
              >
                <span>{dict.cta_primary}</span>
                <ArrowRight size={20} />
              </a>
              <div className="flex flex-col items-start gap-1">
                <span className="text-secondary font-bold text-sm">{dict.micro_copy}</span>
                <div className="flex items-center gap-1">
                   {[1,2,3,4,5].map(i => <div key={i} className="w-1 h-1 bg-accent rounded-full" />)}
                   <span className="text-[9px] font-bold text-accent uppercase tracking-widest ml-2">Garantía de éxito</span>
                </div>
              </div>
            </div>

            <div className="pt-10 flex flex-wrap justify-center lg:justify-start gap-8 opacity-60">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-accent" />
                <span className="text-xs font-bold uppercase tracking-widest text-secondary">Sin cuotas mensuales</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-accent" />
                <span className="text-xs font-bold uppercase tracking-widest text-secondary">Web en 7 días</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-accent" />
                <span className="text-xs font-bold uppercase tracking-widest text-secondary">Soporte real</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
            className="lg:w-[58%] relative"
          >
            <div className="relative aspect-square rounded-[4rem] overflow-hidden shadow-2xl border-[16px] border-white group">
                <Image
                  src="/img/hero_final.png" // Humanized neighborhood partner image
                  alt="Business Digitization"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-1000"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
                
                {/* Floating proof card */}
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1, duration: 0.6 }}
                  className="absolute bottom-12 -left-12 bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-primary/10 max-w-[240px]"
                >
                  <div className="text-primary font-black text-3xl tracking-tighter italic">"¡Vendiendo!"</div>
                  <div className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest mt-2">Cita reservada hace 2 min</div>
                </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
