'use client';

import { motion } from 'framer-motion';
import { SectionHeader } from '../common/SectionHeader';
import { Quote } from 'lucide-react';
import Image from 'next/image';

export const Casos = ({ dict = {} }: { dict: any }) => {
  const images = ["/img/carlos.png", "/img/elena.png"];
  
  return (
    <section id="casos" className="py-12 md:py-20 px-6 md:px-10 relative bg-base">
      <div className="absolute inset-0 bg-mesh opacity-10 pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader title={dict.title} subtitle={dict.subtitle} badge={dict.badge} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {dict?.items?.map((caso: any, i: number) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 1 }}
              className="p-12 md:p-20 rounded-[4rem] glass-premium group relative overflow-hidden flex flex-col justify-between"
            >
              {/* Background Decoration */}
              <div className="absolute top-10 right-10 text-[10px] font-black uppercase tracking-[0.5em] text-primary/10 group-hover:text-primary transition-colors">PROJECT_UNIT_0{i+1}</div>
              
              <div className="relative z-10">
                <Quote className="w-16 h-16 text-primary mb-10 opacity-20 group-hover:opacity-100 transition-opacity duration-700" />
                <h4 className="text-4xl md:text-5xl font-heading font-black uppercase italic mb-12 tracking-tighter leading-none text-glow">{caso.client}</h4>
                
                <div className="flex flex-col gap-6 mb-12">
                   <div className="flex justify-between items-center text-sm border-b border-white/5 pb-4">
                      <span className="text-white/20 uppercase tracking-[0.3em] font-black italic">{dict.base_situation}</span>
                      <span className="text-white/40 font-bold uppercase tracking-tighter">{caso.before}</span>
                   </div>
                   <div className="flex justify-between items-center text-xl bg-primary/5 p-8 rounded-3xl border border-primary/10 shadow-inner">
                      <span className="text-primary uppercase tracking-[0.3em] font-black italic">{dict.zyndrix_result}</span>
                      <span className="text-white font-black text-2xl tracking-tighter">{caso.after}</span>
                   </div>
                </div>

                <div className="bg-black/30 p-10 rounded-3xl border border-white/5 backdrop-blur-3xl mb-12 shadow-2xl">
                    <div className="text-gradient-silver text-3xl font-black italic mb-4 tracking-tighter leading-tight">{caso.result}</div>
                    <p className="text-white/40 text-lg leading-relaxed font-medium italic opacity-80">{caso.desc}</p>
                </div>
              </div>

              {/* Client Face Profile */}
              <div className="flex items-center gap-6 pt-10 border-t border-white/5">
                <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 overflow-hidden shadow-xl group-hover:border-primary transition-colors">
                   <Image 
                      src={images[i]} 
                      alt={caso.client} 
                      width={80}
                      height={80}
                      className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700" 
                   />
                </div>
                <div>
                   <div className="text-white font-black uppercase italic tracking-tighter text-xl">{dict.director_label}</div>
                   <div className="text-primary font-mono text-[10px] tracking-[0.3em]">{dict.verification_label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
