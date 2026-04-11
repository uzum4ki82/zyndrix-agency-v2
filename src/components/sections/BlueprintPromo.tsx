'use client';

import { motion } from 'framer-motion';
import { FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

export const BlueprintPromo = ({ dict }: { dict: any }) => (
    <section className="py-12 px-6 md:px-10 relative bg-white border-t border-primary/10 overflow-hidden">
      <div className="arch-grid opacity-20" />
      
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 md:gap-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:w-1/2 space-y-12 md:space-y-16 text-center lg:text-left"
        >
          <div className="flex flex-col gap-8">
            <div className="text-[11px] font-black uppercase tracking-[0.6em] text-slate-500 flex items-center justify-center lg:justify-start gap-4">
              <div className="w-12 h-[2px] bg-primary/30" />
              {dict.badge}
            </div>

            <h2 className="text-5xl md:text-8xl font-heading font-black text-primary tracking-[-0.05em] uppercase leading-[0.85]">
              {dict.title_main} <br className="hidden md:block"/>
              <span className="text-slate-400">{dict.title_highlight}</span>
            </h2>
          </div>

          <div className="relative p-12 md:p-16 border-l-4 border-black bg-slate-100 backdrop-blur-sm shadow-xl">
             <p className="text-xl md:text-2xl text-slate-800 font-medium tracking-tight leading-relaxed max-w-xl mx-auto lg:mx-0">
               {dict.subtitle}
             </p>
             <div className="absolute top-4 right-6 text-[8px] font-black text-primary/30 tracking-[0.5em] uppercase">VERIFIED_PROTOCOL_v4</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
            {dict.items.map((item: string, i: number) => (
              <div key={i} className="flex items-center gap-6 group bg-white p-8 border border-primary/10 shadow-sm hover:shadow-2xl hover:border-primary/30 transition-all duration-500">
                  <ShieldCheck className="w-6 h-6 text-primary/50 group-hover:text-black transition-colors flex-shrink-0" />
                  <span className="text-[12px] md:text-[13px] font-black uppercase tracking-tight text-slate-700 group-hover:text-black transition-colors">
                    {item}
                  </span>
              </div>
            ))}
          </div>

          <div className="pt-10 flex flex-col md:flex-row items-center gap-12">
            <button className="btn-executive w-full md:w-auto px-20 h-24 flex items-center justify-center gap-8 group shadow-3xl bg-black text-white rounded-sm font-black text-[13px] uppercase tracking-[0.3em]">
              <span>{dict.cta}</span>
              <ArrowRight size={22} className="group-hover:translate-x-4 transition-transform duration-700" />
            </button>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] max-w-[160px] leading-relaxed text-center md:text-left hidden md:block">
               INITIAL_VALUATION_TIME: <br/><span className="text-black text-2xl tracking-tighter font-heading block mt-2">48 HORAS</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "circOut" }}
          className="lg:w-1/2 relative group w-full"
        >
          {/* Decorative Technical Layer */}
          <div className="absolute inset-0 bg-primary/5 blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <div className="relative border border-primary/10 p-4 bg-white shadow-3xl">
            <div className="relative w-full aspect-[4/3] md:aspect-video overflow-hidden border border-primary/10 bg-slate-50 group">
               <Image 
                 src="/img/zyndrix_technical_blueprint_v4.png" 
                 alt="Zyndrix Architecture Workflow" 
                 fill
                 className="object-cover grayscale opacity-95 transition-all duration-1000 group-hover:scale-105 group-hover:opacity-100"
               />
               <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
            </div>
            
            <div className="absolute -top-4 -right-4 md:-top-10 md:-right-10 bg-black text-white p-8 md:p-14 flex flex-col items-center justify-center border border-black shadow-3xl transform group-hover:scale-105 transition-transform duration-700">
               <div className="text-[9px] font-black uppercase tracking-[0.4em] mb-3 opacity-40">PRIORITY_ACCESS</div>
               <div className="text-4xl md:text-5xl font-heading font-black tracking-tighter uppercase">{dict.free.split(' ')[0]}</div>
               <div className="text-[8px] font-bold text-white/30 tracking-[0.2em] mt-3 uppercase">SEATS_REMAINING: 04</div>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-10">
               {[
                 { l: "Security", v: "MAX" },
                 { l: "Auth", v: "LEVEL_4" },
                 { l: "Status", v: "LIVE" }
               ].map((x, idx) => (
                  <div key={idx} className="flex flex-col border-l-2 border-primary/10 pl-6">
                     <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">{x.l}</span>
                     <span className="text-[11px] font-black text-black uppercase">{x.v}</span>
                  </div>
               ))}
            </div>
          </div>
          
          <div className="absolute top-0 left-0 w-24 h-[2px] bg-black animate-pulse" />
          <div className="absolute top-0 left-0 w-[2px] h-24 bg-black animate-pulse" />
        </motion.div>
      </div>
    </section>




);

