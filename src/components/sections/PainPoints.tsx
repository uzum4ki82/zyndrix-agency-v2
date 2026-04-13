'use client';

import { ArrowRight } from 'lucide-react';

export const PainPoints = ({ dict, system }: { dict: any, system?: any }) => {
  return (
    <section id="razones" className="py-24 px-6 relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col mb-16 items-center text-center">
          <div className="text-[11px] font-bold uppercase tracking-[0.5em] text-primary mb-6">{dict.badge}</div>
          <h2 className="text-5xl md:text-8xl font-heading font-black text-secondary mb-10 tracking-[-0.04em] uppercase leading-[0.85]">{dict.title}</h2>
          <p className="text-xl text-secondary/40 leading-relaxed font-medium max-w-2xl">{dict.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {dict.items?.map((item: any, i: number) => (
            <div key={i} className="p-12 bg-slate-50 border border-secondary/5 rounded-[3rem] hover:border-primary/20 transition-all duration-500 group">
              <div className="bg-primary/5 w-12 h-12 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <span className="text-xl font-black italic">0{i+1}</span>
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-6 text-secondary">{item.title}</h3>
              <p className="text-secondary/50 text-lg leading-relaxed font-medium">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 flex justify-center">
            <a href="#precios" className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-primary bg-primary/5 px-12 py-6 rounded-full hover:bg-primary hover:text-white transition-all duration-500">
              EXPLORAR PLANES <ArrowRight size={16} />
            </a>
        </div>
      </div>
    </section>
  );
};
