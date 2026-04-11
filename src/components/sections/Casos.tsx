'use client';

import { motion } from 'framer-motion';
import { SectionHeader } from '../common/SectionHeader';
import { Quote } from 'lucide-react';
import Image from 'next/image';

export const Casos = ({ dict = {} }: { dict: any }) => {
  const images = ["/img/carlos.png", "/img/elena.png"];
  
  return (
    <section id="casos" className="py-12 md:py-16 px-6 md:px-10 relative bg-base border-t border-primary/5 overflow-hidden">
      <div className="arch-grid opacity-40" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-8">
           <SectionHeader title={dict.title} subtitle={dict.subtitle} badge={dict.badge} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
          {dict?.items?.map((caso: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -6 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-10 md:p-14 border border-primary/10 group hover:shadow-2xl hover:border-primary/20 transition-all duration-700 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Quote size={120} />
              </div>

              <div className="relative z-10 w-full flex flex-col md:flex-row gap-12">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-10">
                    <Quote className="w-8 h-8 text-primary/20" />
                    <div className="text-[9px] font-black uppercase tracking-[0.5em] text-secondary/30">REP_0{i+1}</div>
                  </div>

                  <h4 className="text-4xl md:text-6xl font-heading font-black uppercase mb-12 tracking-tight text-primary leading-[0.9]">{caso.client}</h4>

                  <div className="space-y-5 mb-12">
                    <div className="flex justify-between items-center text-[11px] border-b border-primary/10 pb-4">
                        <span className="text-secondary/50 uppercase tracking-[0.3em] font-bold">{dict.base_situation}</span>
                        <span className="text-secondary font-bold uppercase">{caso.before}</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-50 p-8 border border-primary/10">
                        <span className="text-primary uppercase tracking-[0.3em] font-black">{dict.zyndrix_result}</span>
                        <span className="text-primary font-black text-2xl tracking-tighter">{caso.after}</span>
                    </div>
                  </div>

                  <div className="mb-12">
                      <div className="text-3xl font-black mb-4 tracking-tight text-primary leading-tight">{caso.result}</div>
                      <p className="text-secondary text-base md:text-lg leading-relaxed font-medium">{caso.desc}</p>
                  </div>
                </div>

                {/* Sidebar Metrics - Filling Space */}
                <div className="w-full md:w-56 flex flex-col gap-8 pt-12 md:pt-0 border-t md:border-t-0 md:border-l border-primary/10 md:pl-10">
                   <div className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.5em]">IMPACT_KPI</div>
                   {[
                     { l: "Efficiency", v: "42%" },
                     { l: "Cost Reduction", v: "28%" },
                     { l: "Delivery Speed", v: "2.4x" }
                   ].map((m, idx) => (
                      <div key={idx} className="space-y-3">
                        <div className="flex justify-between text-[11px] font-bold text-primary">
                           <span className="opacity-50">{m.l}</span>
                           <span className="text-lg tracking-tighter">{m.v}</span>
                        </div>
                        <div className="h-1 w-full bg-slate-100 relative overflow-hidden">
                           <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: "70%" }}
                              className="h-full bg-primary/40"
                           />
                        </div>
                      </div>
                   ))}
                </div>
              </div>

              <div className="flex items-center gap-8 pt-12 mt-12 border-t border-primary/10 relative z-10">
                <div className="w-20 h-20 rounded-sm bg-slate-50 border border-primary/10 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                   <Image
                      src={images[i] || "/img/hero-architectural.png"}
                      alt={caso.client}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                   />
                </div>
                <div>
                   <div className="text-primary font-black uppercase tracking-tight text-xl leading-none mb-2">{dict.director_label}</div>
                   <div className="text-secondary font-bold text-[9px] tracking-[0.4em] uppercase opacity-50">{dict.verification_label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Success Visualization Board to bridge holes */}
        <div className="mt-16 relative aspect-[21/9] md:aspect-[32/9] overflow-hidden border border-primary/10 bg-white p-3 group shadow-xl">
           <div className="relative w-full h-full overflow-hidden grayscale opacity-90 group-hover:opacity-100 transition-all duration-1000">
              <Image
                src="/img/zyndrix_success_growth_v4.png"
                alt="Zyndrix Industrial Scaling"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-1000"
              />
           </div>

           <div className="absolute inset-0 flex items-center justify-between px-24 z-10 pointer-events-none">
              <div className="max-w-lg bg-white p-14 shadow-3xl border border-primary/10">
                 <div className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-500 mb-8">GLOBAL_IMPACT_REPORT</div>
                 <h4 className="text-4xl font-heading font-black text-primary uppercase tracking-tighter mb-6 leading-none">RENDIMIENTO SISTEMÁTICO</h4>
                 <p className="text-[13px] text-slate-600 font-medium leading-relaxed">Arquitectura de IA desplegada para el control de operaciones complejas sin latencia física.</p>
              </div>

              <div className="flex flex-col gap-16 text-right hidden lg:flex">
                 {[
                   { l: "Nodes Optimized", v: "142+" },
                   { l: "Data Velocity", v: "1.2GB/s" }
                 ].map((x, idx) => (
                    <div key={idx} className="flex flex-col gap-3">
                       <span className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] leading-none">{x.l}</span>
                       <span className="text-5xl font-heading font-black text-white mix-blend-difference">{x.v}</span>
                    </div>
                 ))}
              </div>
           </div>

           <div className="absolute top-0 right-0 p-10 text-[8px] font-black text-primary/10 tracking-[0.6em] uppercase">SYSTEM_STABILITY_SECURED</div>
           <div className="absolute bottom-10 left-10 flex gap-2">
              {[1,2,3,4].map(i => <div key={i} className="w-1.5 h-4 bg-black opacity-30" />)}
           </div>
        </div>
      </div>
    </section>


  );
};
