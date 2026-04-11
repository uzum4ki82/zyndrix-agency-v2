'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Activity } from 'lucide-react';
import Image from 'next/image';

export const Hero = ({ dict }: { dict: any }) => {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 md:pt-32 pb-16 md:pb-24 px-6 overflow-hidden bg-base">
      <div className="arch-grid opacity-40" />
      
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 md:gap-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:w-4/7 space-y-6 md:space-y-8 text-center lg:text-left relative"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-blue-700">{dict.badge}</span>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-[8.5rem] font-heading font-black text-primary leading-[0.85] tracking-[-0.05em] uppercase">
              {dict.title_main} <br/>
              <span className="opacity-20">{dict.title_highlight}</span>
            </h1>

            <div className="flex flex-col lg:flex-row gap-10 items-center lg:items-start pt-6">
              <p className="text-xl md:text-2xl text-secondary font-medium leading-relaxed max-w-xl mx-auto lg:mx-0 italic">
                {dict.subtitle}
              </p>
              
              <div className="hidden xl:flex flex-col gap-3 border-l border-primary/10 pl-8 text-left">
                  {["Análisis Profundo", "Respuestas Instantáneas", "Optimización Inteligente"].map((spec, i) => (
                    <div key={i} className="flex items-center gap-3">
                       <div className="w-1 h-1 bg-primary" />
                       <span className="text-[10px] font-black text-secondary tracking-widest uppercase">{spec}</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-6">
              <button className="w-full sm:w-auto px-12 h-18 md:h-20 shadow-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold tracking-widest uppercase flex items-center justify-center gap-3 transition-all duration-300">
                <span>{dict.cta_primary}</span>
                <ArrowRight size={18} />
              </button>
              <button className="flex items-center gap-4 px-8 py-5 text-[10px] font-bold uppercase tracking-[0.3em] text-primary/40 hover:text-primary transition-colors group">
                <div className="w-10 h-10 flex items-center justify-center rounded-full border border-primary/5 group-hover:border-primary/20 transition-all">
                   <Play className="w-3 h-3 text-primary fill-primary" />
                </div>
                <span>{dict.cta_secondary_video}</span>
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "circOut" }}
            className="lg:w-3/7 relative group"
          >
            <div className="relative aspect-square overflow-hidden border border-primary/10 shadow-[0_0_100px_rgba(0,0,0,0.1)] bg-white p-2">
                <div className="absolute inset-0 z-20 border-[15px] border-white pointer-events-none" />
                <div className="relative w-full h-full overflow-hidden">
                   <Image
                     src="/img/zyndrix_hero_architectural_v4.png"
                     alt="Zyndrix Intelligence Architecture"
                     fill
                     className="object-cover grayscale brightness-100 contrast-[1.1] group-hover:scale-110 group-hover:brightness-100 transition-all duration-[2000ms]"
                     priority
                   />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-40 z-10" />
            </div>
            
          </motion.div>
        </div>

        <div className="mt-24 md:mt-32 bg-white border border-primary/10 p-8 md:p-12 flex flex-wrap justify-between items-center gap-12 shadow-sm">
          <div className="flex gap-16 md:gap-32">
            {dict.stats?.map((stat: any, i: number) => (
              <div key={i} className="flex flex-col gap-2">
                <span className="text-3xl md:text-4xl font-heading font-black text-primary tracking-tighter uppercase leading-none">{stat.v}</span>
                <span className="text-[9px] font-bold tracking-[0.4em] text-secondary uppercase opacity-70">{stat.l}</span>
              </div>
            ))}
          </div>
          
          <div className="flex items-center gap-12">
              <div className="hidden lg:flex flex-col items-end gap-1 text-right">
                  <span className="text-[8px] font-bold tracking-[0.4em] text-secondary uppercase opacity-30">HQ</span>
                  <span className="text-[10px] font-black text-primary">BARCELONA</span>
              </div>
              <div className="flex flex-col items-end gap-1 text-right border-l border-green-200 pl-8">
                  <span className="text-[8px] font-bold tracking-[0.4em] text-green-600 uppercase opacity-70">STATUS</span>
                  <div className="flex items-center gap-3">
                     <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                     <span className="text-[10px] font-black text-green-700 uppercase">ONLINE</span>
                  </div>
              </div>
          </div>
        </div>
      </div>
    </section>

  );
};
