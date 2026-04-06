'use client';

import { motion } from 'framer-motion';
import { Workflow, Cpu, BrainCircuit, BarChart3, MessageSquare, ShieldCheck, Zap } from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';

const ServiceCard = ({ icon: Icon, title, description, specs, image, className = "" }: any) => (
  <motion.div 
    whileHover={{ y: -10, scale: 1.02 }}
    transition={{ type: "spring", stiffness: 400 }}
    className={`p-10 rounded-[3.5rem] relative overflow-hidden group glass-premium group-hover:glow-border transition-all h-full flex flex-col justify-start border border-white/5 ${className}`}
  >
    {image && (
      <div className="absolute inset-0 opacity-10 group-hover:opacity-30 transition-opacity duration-1000">
        <img src={image} alt={`${title} Service Icon`} className="w-full h-full object-cover grayscale brightness-50 contrast-125" />
      </div>
    )}
    <div className="relative z-10 flex flex-col h-full">
      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-10 border border-white/10 group-hover:bg-primary/20 transition-all duration-500 shadow-lg">
        <Icon className="w-6 h-6 text-white group-hover:text-primary transition-colors" />
      </div>
      <h3 className="text-3xl font-heading font-black uppercase italic tracking-tighter mb-4 text-white leading-none">{title}</h3>
      <p className="text-white/95 text-base leading-relaxed max-w-[280px] font-medium italic mb-8 flex-grow">{description}</p>
      
      {specs && (
        <div className="grid grid-cols-1 gap-3 pt-6 border-t border-white/5">
           {specs.map((spec: string, i: number) => (
             <div key={i} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                 <span className="text-[12px] font-black uppercase tracking-widest text-[#38bdf8]">{spec}</span>
              </div>
           ))}
        </div>
      )}
    </div>
  </motion.div>
);

export const Sistemas = ({ dict }: { dict: any }) => (
  <section id="servicios" className="py-20 px-6 relative overflow-hidden bg-base">
    {/* Industrial Background Layer */}
    <div className="absolute inset-0 z-0">
      <img 
        src="/img/solution-bg.png" 
        alt="Zyndrix Solutions Background Infrastructure" 
        className="w-full h-full object-cover opacity-5 md:opacity-10 scale-110 blur-sm"
      />
      <div className="absolute inset-0 bg-base/80" />
      <div className="absolute inset-0 bg-mesh opacity-20" />
    </div>

    <div className="max-w-7xl mx-auto relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-10">
         <div className="text-left">
           <SectionHeader title={dict.title} subtitle={dict.subtitle} badge={dict.badge} centered={false} />
         </div>
         <div className="hidden lg:flex items-center gap-6 px-10 py-6 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-3xl shadow-xl group hover:border-primary/40 transition-all duration-700">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center animate-pulse">
               <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <div>
               <div className="text-[12px] font-black uppercase tracking-[0.4em] text-white/60 mb-1">PROTOCOLO_VALIDADO</div>
               <div className="text-[12px] font-black uppercase tracking-[0.2em] text-white">REVISIÓN EXTERNA VERIFICADA</div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-8 auto-rows-[450px]">
        
        {/* Card 1: Lead Gen Engine */}
        <div className="col-span-1 md:col-span-3 row-span-1 md:row-span-1">
          <ServiceCard 
            icon={Zap} 
            title={dict.cards[0].title} 
            description={dict.cards[0].description} 
            specs={dict.cards[0].specs}
            image="/img/icon-automation.png"
          />
        </div>

        {/* Card 2: Agentes Operativos */}
        <div className="col-span-1 md:col-span-3 row-span-1">
          <ServiceCard 
            icon={Cpu} 
            title={dict.cards[1].title} 
            description={dict.cards[1].description} 
            specs={dict.cards[1].specs}
            image="/img/icon-agents.png"
          />
        </div>

        {/* Card 4: Workflow Core (n8n) */}
        <div className="col-span-1 md:col-span-6 row-span-1">
          <motion.div 
            whileHover={{ scale: 1.01 }} 
            className="h-full bg-primary/10 rounded-[4rem] p-12 md:p-20 flex flex-col md:flex-row justify-between items-center relative overflow-hidden group border border-primary/20 shadow-[0_0_80px_rgba(56,189,248,0.15)]"
          >
            <div className="absolute inset-0 bg-mesh opacity-50" />
            <div className="relative z-10 flex flex-col gap-6 md:w-2/3">
              <div className="flex items-center gap-3 bg-primary/20 w-fit px-8 py-3 rounded-full border border-primary/30">
                <Workflow className="w-5 h-5 text-primary animate-pulse" />
                <span className="text-[12px] font-black uppercase tracking-[0.5em]">NÚCLEO ESTRATÉGICO</span>
              </div>
              <h3 className="text-5xl lg:text-8xl font-heading font-black uppercase italic leading-none tracking-tighter text-white">
                {dict.cards[2].title}
              </h3>
              <p className="text-white/80 font-medium italic text-xl md:text-2xl opacity-90 leading-relaxed max-w-2xl">
                {dict.cards[2].description}
              </p>
              <div className="flex gap-10 mt-6">
                {dict.cards[2].specs.map((s: string, i: number) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-primary font-black italic text-3xl tracking-tighter leading-none mb-1">{s.split(' ')[0]}</span>
                    <span className="text-[12px] font-black uppercase tracking-widest text-white/60">{s.split(' ').slice(1).join(' ')}</span>
                  </div>
                ))}
              </div>
            </div>
            <Workflow className="hidden lg:block w-72 h-72 text-primary opacity-10 group-hover:rotate-12 transition-transform duration-[1.5s] mr-10 relative z-10" />
          </motion.div>
        </div>

        {/* Card 3: Support */}
        <div className="col-span-1 md:col-span-3 row-span-1">
          <ServiceCard 
            icon={BrainCircuit} 
            title={dict.cards[3].title} 
            description={dict.cards[3].description} 
            specs={dict.cards[3].specs}
            image="/img/icon-rag.png"
          />
        </div>

        {/* Card 5: Security */}
        <div className="col-span-1 md:col-span-3 row-span-1">
          <ServiceCard 
            icon={ShieldCheck} 
            title="Soberanía Total" 
            description="Infraestructura propietaria con SLAs del 99.9% y soberanía de datos absoluta en sus propios servidores." 
            specs={["Cifrado Militar", "Hosting local", "Auditoría Continua"]}
          />
        </div>

      </div>
    </div>
  </section>
);
