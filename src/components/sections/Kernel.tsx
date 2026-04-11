'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Search, Zap, Activity, Shield } from 'lucide-react';

const icons: any = {
  Search,
  Zap,
  Activity,
  Shield
};

export const Kernel = ({ dict }: { dict: any }) => {
  return (
    <section id="kernel" className="py-12 px-6 relative overflow-hidden bg-base border-t border-primary/5">
      <div className="arch-grid opacity-20" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-8">
          <div className="max-w-2xl">
            <div className="text-[9px] font-bold uppercase tracking-[0.4em] text-secondary mb-4 flex items-center gap-4">
              <div className="w-8 h-[1px] bg-secondary/30" />
              {dict.badge}
            </div>
            <h2 className="text-4xl md:text-6xl font-heading font-black text-primary tracking-[-0.04em] uppercase leading-[0.9]">
              {dict.title}
            </h2>
          </div>
          <p className="text-base text-secondary font-medium max-w-sm lg:text-right leading-relaxed">
            {dict.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-6">
          {dict.cards.map((card: any, i: number) => {
            const Icon = icons[card.icon] || Zap;

            // Define a more complex bento pattern
            const colSpans = ["md:col-span-7", "md:col-span-5", "md:col-span-4", "md:col-span-8"];
            const colSpan = colSpans[i % colSpans.length];

            // Image mapping for each card
            const images = [
              "/img/zyndrix_step_01_audit.png",
              "/img/zyndrix_step_02_design.png",
              "/img/zyndrix_step_03_inject.png",
              "/img/zyndrix_step_04_scale.png"
            ];
            const imgSrc = images[i % images.length];

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`${colSpan} bg-white border border-primary/10 flex flex-col justify-between group hover:shadow-2xl hover:border-primary/20 transition-all duration-700 relative overflow-hidden min-h-[420px]`}
              >
                {/* Image Background */}
                <div className="absolute inset-0">
                  <Image
                    src={imgSrc}
                    alt={card.title}
                    fill
                    className="object-cover grayscale brightness-100 group-hover:brightness-100 group-hover:grayscale-0 transition-all duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                </div>

                <div className="relative z-10 p-10 md:p-16 flex flex-col justify-between h-full">
                  <div className="flex items-start justify-between mb-auto">
                    <div className="w-12 h-12 flex items-center justify-center bg-blue-500/20 border border-blue-400/50 text-blue-300 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500 backdrop-blur-sm">
                      <Icon strokeWidth={1.5} size={24} />
                    </div>
                    <div className="text-[9px] font-black tracking-[0.5em] text-white/30 uppercase">
                      {String(i+1).padStart(2, '0')}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-4 text-white leading-none">
                      {card.title}
                    </h3>

                    <p className="text-white/70 text-base md:text-lg leading-relaxed font-medium mb-8">
                      {card.description}
                    </p>

                    <div className="space-y-3">
                       {[1, 2].map((_, idx) => (
                          <div key={idx} className="flex items-center gap-4">
                             <div className="w-1.5 h-1.5 bg-white/50 rounded-full" />
                             <div className="h-px flex-1 bg-white/20" />
                          </div>
                       ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-8">
                     <div className="w-2 h-2 bg-white rounded-full" />
                     <div className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                     <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
                  </div>
                </div>
              </motion.div>
            );
          })}
          {/* Visual Module - Hardware Core */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-12 lg:col-span-4 bg-white border border-primary/10 relative overflow-hidden group min-h-[420px] shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all duration-700"
          >
            <Image
               src="/img/zyndrix_industrial_macro_v4.png"
               alt="Zyndrix Hardware Core"
               fill
               className="object-cover grayscale brightness-100 group-hover:brightness-100 group-hover:grayscale-0 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />

            <div className="absolute top-8 left-8 bg-white/10 backdrop-blur-sm text-white p-4 z-10 border border-white/30">
               <div className="text-[7px] font-black tracking-[0.4em] uppercase opacity-50">NÚCLEO</div>
               <div className="text-[11px] font-black uppercase tracking-widest text-white">PROCESAMIENTO</div>
            </div>

            <div className="absolute bottom-8 right-8 text-white z-10 flex gap-6">
               <div className="flex flex-col items-end">
                  <span className="text-[7px] font-black uppercase tracking-widest opacity-50">ESTADO</span>
                  <span className="text-[12px] font-black">OPERATIVO</span>
               </div>
               <div className="flex flex-col items-end border-l border-white/20 pl-6">
                  <span className="text-[7px] font-black uppercase tracking-widest opacity-50">EFICIENCIA</span>
                  <span className="text-[12px] font-black">MÁXIMA</span>
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>



  );
};
