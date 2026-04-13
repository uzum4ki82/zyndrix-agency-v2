'use client';

import { motion } from 'framer-motion';
import { MapPin, ShoppingBag, Bot, Check } from 'lucide-react';
import Image from 'next/image';

const ServiceCard = ({ icon: Icon, title, description, specs, className = "" }: any) => (
  <motion.div 
    className={`p-10 rounded-[3rem] flex flex-col justify-start h-full border transition-all duration-500 overflow-hidden group ${className}`}
  >
    <div className="relative z-10 flex flex-col h-full">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-10 group-hover:bg-primary group-hover:text-white transition-all duration-500">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-3xl font-heading font-black uppercase tracking-tight mb-6 text-secondary leading-tight">{title}</h3>
      <p className="text-secondary/50 text-lg leading-relaxed mb-10 font-medium flex-grow">{description}</p>
      
      {specs && (
        <div className="space-y-4 pt-10 border-t border-secondary/5">
           {specs.map((spec: string, i: number) => (
             <div key={i} className="flex items-center gap-4">
                <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-accent" />
                </div>
                <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-secondary/60 group-hover:text-secondary transition-colors">{spec}</span>
              </div>
           ))}
        </div>
      )}
    </div>
  </motion.div>
);

export const Sistemas = ({ dict }: { dict: any }) => (
  <section id="servicios" className="py-24 px-6 relative overflow-hidden bg-white">
    <div className="max-w-7xl mx-auto relative z-10">
      <div className="flex flex-col mb-16 items-center text-center">
        <div className="text-[11px] font-bold uppercase tracking-[0.5em] text-primary mb-6">{dict.badge}</div>
        <h2 className="text-5xl md:text-7xl font-heading font-black text-secondary mb-6 tracking-[-0.04em] uppercase leading-[0.9]">{dict.title}</h2>
        <p className="text-xl text-secondary/40 leading-relaxed font-medium max-w-2xl">{dict.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {dict.cards?.map((card: any, i: number) => (
          <ServiceCard 
            key={i}
            icon={i === 0 ? MapPin : i === 1 ? ShoppingBag : Bot} 
            title={card.title} 
            description={card.description} 
            specs={card.specs}
            className={i === 1 ? "bg-primary/5 border-primary/20" : "bg-white border-secondary/5 hover:border-primary/20"}
          />
        ))}
      </div>
      
      {/* Bottom social proof image with real neighborhood background */}
      <div className="mt-16 relative aspect-[21/9] rounded-[4rem] overflow-hidden bg-secondary shadow-2xl group">
         <Image 
            src="/img/street_bg.png" 
            alt="Barrio Conectado" 
            fill 
            className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
         />
         <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10" />
         <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-center p-10">
            <span className="text-white font-black text-6xl md:text-8xl italic uppercase tracking-tighter mb-4 opacity-80 group-hover:opacity-100 transition-opacity">7 DÍAS</span>
            <span className="text-white/80 font-bold text-sm md:text-xl uppercase tracking-[0.4em]">DE LA CALLE A LA PANTALLA</span>
         </div>
      </div>
    </div>
  </section>
);

