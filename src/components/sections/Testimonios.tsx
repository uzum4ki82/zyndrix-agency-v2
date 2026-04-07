'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';

export const Testimonios = ({ dict }: { dict: any }) => (
  <section id="testimonios" className="py-60 px-10 relative">
    <div className="max-w-7xl mx-auto">
      <SectionHeader title={dict.title} subtitle={dict.subtitle} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 relative">

        {dict.items.map((item: any, i: number) => (
          <motion.div 
            key={i}
            whileHover={{ y: -15, scale: 1.02 }}
            className={`glass-premium p-20 rounded-[5rem] relative overflow-hidden group shadow-2xl border border-white/5 ${i === 1 ? 'bg-surface-high/5' : ''}`}
          >
            <Quote className="absolute top-14 right-14 w-32 h-32 text-white/5 opacity-40 rotate-[15deg] group-hover:scale-125 transition-transform" />
            <div className="relative z-10">
              <div className="flex items-center gap-10 mb-16">
                <div className="relative">
                  <div className={`absolute inset-0 ${i === 0 ? 'bg-primary/40' : 'bg-secondary/40'} blur-2xl rounded-full opacity-0 group-hover:opacity-60 transition-opacity`} />
                  <img src={`/img/test_${i+1}.png`} alt={item.name} className="w-32 h-32 rounded-[3rem] object-cover grayscale brightness-110 border-2 border-white/10 relative z-10" />
                </div>
                <div>
                  <h4 className="text-3xl font-heading font-black uppercase italic tracking-tighter mb-1">{item.name}</h4>
                  <p className={`${i === 0 ? 'text-primary' : 'text-white/40'} text-[10px] font-black tracking-[0.4em] uppercase italic opacity-60`}>{item.role}</p>
                </div>
              </div>
              <p className="text-3xl font-medium italic leading-[1.4] text-white/70 mb-10 lowercase tracking-tight">
                {item.quote}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
