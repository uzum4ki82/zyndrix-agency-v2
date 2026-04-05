'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Activity, Shield, Cpu, Zap, MousePointer2 } from 'lucide-react';

export const Hero = ({ dict }: { dict: any }) => (
  <section className="relative min-h-screen flex flex-col justify-center items-center px-6 overflow-hidden bg-base">
    {/* Background Image with Overlay */}
    <div className="absolute inset-0 z-0">
      <img 
        src="/img/hero-bg.png" 
        alt="" 
        className="w-full h-full object-cover opacity-20 scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-base via-transparent to-base" />
      <div className="absolute inset-0 bg-mesh opacity-30" />
    </div>

    {/* Floating Technical Elements (Decorative) */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
       {[...Array(6)].map((_, i) => (
         <motion.div
           key={i}
           animate={{ 
             y: [0, -20, 0],
             opacity: [0.1, 0.3, 0.1]
           }}
           transition={{ 
             duration: 5 + i, 
             repeat: Infinity,
             delay: i * 0.5 
           }}
           className="absolute hidden lg:block"
           style={{
             left: `${15 + i * 15}%`,
             top: `${20 + (i % 3) * 20}%`
           }}
         >
           <div className="flex items-center gap-2 font-mono text-[8px] text-primary/40 uppercase tracking-[0.5em] whitespace-nowrap">
             <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
             NODE_SESSION_0{i+1} : ACTIVE
           </div>
         </motion.div>
       ))}
    </div>
    

    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="text-center relative z-20 max-w-7xl pt-20"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-14 inline-flex items-center gap-4 px-8 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.6em] text-primary backdrop-blur-3xl shadow-[0_0_30px_rgba(56,189,248,0.2)]"
      >
        <Sparkles className="w-4 h-4" /> 
        {dict.badge}
      </motion.div>

      <h1 className="text-5xl md:text-8xl font-heading font-black tracking-[calc(-0.04em)] leading-[0.82] uppercase italic mb-8 select-none drop-shadow-2xl">
        <span className="text-white block">{dict.title_main.split(':')[0]}<span className="text-primary italic">:</span></span>
        <span className="text-gradient-cyan block mt-2 text-glow">
          {dict.title_highlight || "SOLUCIONES IA ALTO RENDIMIENTO"}
        </span>
      </h1>

      <p className="max-w-4xl mx-auto text-lg md:text-3xl text-white/40 mb-16 font-medium leading-[1.2] lowercase italic tracking-tight">
        {dict.subtitle}
      </p>

      <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-32">
        <a href="#contacto" className="btn-elite group h-20 px-14 min-w-[280px]">
          <span className="relative z-10 text-[18px] font-black">{dict.cta_primary}</span>
          <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-3 transition-transform" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-[200%] -translate-x-full animate-beam" />
        </a>
        <a href="#servicios" className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-white transition-all h-20 flex items-center px-10 border border-white/10 rounded-full hover:bg-white/5 backdrop-blur-md">
          {dict.cta_secondary}
        </a>
      </div>

      {/* Trust Stats Block - More Industrial */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-0 max-w-5xl mx-auto border border-white/5 rounded-[3rem] overflow-hidden glass-premium shadow-massive"
      >
        {[
          { v: '12+', l: 'FLUJOS NUCLEARES', i: Cpu },
          { v: '99.9%', l: 'PRECISIÓN IA', i: Shield },
          { v: '10X', l: 'ESCALA OPERATIVA', i: Zap }
        ].map((stat, idx) => (
          <div key={idx} className={`p-10 text-center group hover:bg-white/[0.02] transition-colors ${idx !== 2 ? 'border-b md:border-b-0 md:border-r border-white/5' : ''}`}>
             <stat.i className="w-6 h-6 text-primary/10 mx-auto mb-6 group-hover:text-primary group-hover:scale-125 transition-all duration-700" />
             <div className="text-5xl md:text-6xl font-heading font-black text-white mb-2 tracking-tighter italic leading-none">{stat.v}</div>
             <div className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 group-hover:text-white">{stat.l}</div>
          </div>
        ))}
      </motion.div>
    </motion.div>

    {/* Scroll Indicator */}
    <motion.div 
      animate={{ y: [0, 8, 0] }}
      transition={{ repeat: Infinity, duration: 2 }}
      className="absolute bottom-8 flex flex-col items-center gap-2 text-white/10 group cursor-pointer hover:text-primary/40 transition-colors"
      onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
    >
       <span className="text-[9px] font-black uppercase tracking-[0.6em] rotate-180 [writing-mode:vertical-lr]">EXPLORAR</span>
       <MousePointer2 className="w-3 h-3 rotate-90" />
    </motion.div>

    {/* Horizontal bottom border */}
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
  </section>
);
