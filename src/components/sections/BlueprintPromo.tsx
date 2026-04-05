'use client';

import { motion } from 'framer-motion';
import { Download, CheckCircle, ArrowRight } from 'lucide-react';

export const BlueprintPromo = ({ dict }: { dict: any }) => (
  <section className="py-32 px-10 relative overflow-hidden bg-[#03040a]">
    {/* Glow Background */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[160px] rounded-full pointer-events-none opacity-20" />
    
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-32">
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="lg:w-1/2 relative space-y-12"
      >
        <span className="text-primary font-black text-[11px] tracking-[0.5em] uppercase mb-6 inline-block px-8 py-3 bg-primary/5 rounded-full border border-primary/20">{dict.badge}</span>
        <h2 className="text-6xl md:text-8xl font-heading font-black text-white italic tracking-tighter leading-[0.85] uppercase">{dict.title_main} <br/><span className="text-gradient-cyan">{dict.title_highlight}</span></h2>
        
        <p className="text-2xl text-white/40 font-medium italic lowercase leading-relaxed max-w-xl">
          {dict.subtitle}
        </p>

        <div className="space-y-6">
          {dict.items.map((item: string, i: number) => (
            <div key={i} className="flex items-center gap-4 group">
               <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary transition-colors">
                  <CheckCircle className="w-4 h-4 text-primary group-hover:text-black" />
               </div>
               <span className="text-lg font-black uppercase italic tracking-tighter text-white/60 group-hover:text-white transition-colors">{item}</span>
            </div>
          ))}
        </div>

        <a href="/blueprint" className="btn-elite group h-24 px-20">
          <Download className="w-8 h-8" />
          <span className="text-[18px]">{dict.cta}</span>
          <ArrowRight className="w-8 h-8 group-hover:translate-x-3 transition-transform" />
        </a>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1.2, type: "spring" }}
        className="lg:w-1/2 relative group"
      >
        <div className="absolute inset-0 bg-primary/30 blur-[100px] opacity-0 group-hover:opacity-20 transition-opacity duration-1000" />
        <img 
          src="/img/blueprint-mockup.png" 
          alt="Zyndrix Blueprint Mockup" 
          className="w-full h-auto drop-shadow-[0_0_100px_rgba(56,189,248,0.3)] group-hover:scale-105 transition-transform duration-1000"
        />
        <div className="absolute -bottom-10 -right-10 bg-primary h-32 w-32 rounded-full flex items-center justify-center shadow-2xl animate-bounce shadow-primary/40 p-4 border-4 border-black">
           <div className="text-black font-black italic text-center text-sm leading-tight uppercase tracking-tighter">{dict.free.split(' ')[0]}<br/>{dict.free.split(' ').slice(1).join(' ')}</div>
        </div>
      </motion.div>
    </div>
  </section>
);
