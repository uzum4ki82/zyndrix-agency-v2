'use client';

import { motion } from 'framer-motion';
import { Workflow, Cpu, BrainCircuit, BarChart3, MessageSquare, ShieldCheck, Zap } from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';

const ServiceCard = ({ icon: Icon, title, description, image, className = "" }: any) => (
  <motion.div 
    whileHover={{ y: -10, scale: 1.02 }}
    transition={{ type: "spring", stiffness: 400 }}
    className={`p-10 rounded-[3.5rem] relative overflow-hidden group glass-premium group-hover:glow-border transition-all h-full flex flex-col justify-start border border-white/5 ${className}`}
  >
    {image && (
      <div className="absolute inset-0 opacity-10 group-hover:opacity-30 transition-opacity duration-1000">
        <img src={image} alt="" className="w-full h-full object-cover grayscale brightness-50 contrast-125" />
      </div>
    )}
    <div className="relative z-10">
      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-10 border border-white/10 group-hover:bg-primary/20 transition-all duration-500">
        <Icon className="w-6 h-6 text-white group-hover:text-primary transition-colors" />
      </div>
      <h3 className="text-3xl font-heading font-black uppercase italic tracking-tighter mb-4 text-white leading-none">{title}</h3>
      <p className="text-white/40 text-base leading-relaxed max-w-[280px] font-medium italic">{description}</p>
    </div>
  </motion.div>
);

export const Sistemas = () => (
  <section id="soluciones" className="py-60 px-10 relative">
    <div className="max-w-7xl mx-auto">
      <SectionHeader title="Sistemas Nucleares" subtitle="Dominio de Ingeniería" />

      {/* Bento Grid Design */}
      <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-6 gap-8 mb-8 auto-rows-[300px]">
        
        <div className="col-span-1 md:col-span-3 lg:col-span-3 row-span-1 md:row-span-2">
          <ServiceCard 
            icon={Workflow} 
            title="Orquestación Total" 
            description="Automatización de extremo a extremo que elimina cuellos de botella operativos." 
            image="/img/service_automation.png"
          />
        </div>

        <div className="col-span-1 md:col-span-3 lg:col-span-3 row-span-1">
          <ServiceCard 
            icon={Cpu} 
            title="Agentes Autónomos" 
            description="Fuerza de trabajo sintética operando 24/7 sin supervisión." 
            image="/img/service_agents.png"
          />
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1">
          <ServiceCard 
            icon={BrainCircuit} 
            title="RAG Cortex" 
            description="Tu base de conocimiento conectada directamente." 
            image="/img/service_memory.png"
          />
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2">
          <motion.div whileHover={{ scale: 1.01 }} className="h-full bg-primary/20 rounded-[4rem] p-12 flex flex-col justify-end relative overflow-hidden group border border-primary/30 shadow-[0_0_80px_rgba(56,189,248,0.15)]">
            <div className="absolute top-10 right-10 opacity-20 group-hover:rotate-12 transition-transform duration-700">
              <BarChart3 className="w-48 h-48 text-primary" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6 bg-primary/20 w-fit px-4 py-1.5 rounded-full border border-primary/30">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Exponencial</span>
              </div>
              <h3 className="text-4xl lg:text-5xl font-heading font-black uppercase italic mb-6 leading-none tracking-tighter">Lead Score <br/> Pro</h3>
              <p className="text-white/70 max-w-sm font-medium italic text-lg opacity-80">Automatiza la cualificación y cierre masivo con scoring de alta intensidad.</p>
            </div>
          </motion.div>
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1">
          <ServiceCard 
            icon={ShieldCheck} 
            title="Privacidad" 
            description="Modelos locales seguros. Nada sale de tu infraestructura." 
          />
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1">
           <ServiceCard 
            icon={MessageSquare} 
            title="CX Elite" 
            description="Atención al cliente que escala tu NPS sin personal de soporte." 
          />
        </div>

      </div>
    </div>
  </section>
);
