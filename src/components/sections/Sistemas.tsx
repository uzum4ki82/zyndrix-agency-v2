'use client';

import { motion } from 'framer-motion';
import { Workflow, Cpu, BrainCircuit, ShieldCheck, Zap } from 'lucide-react';

const ServiceCard = ({ icon: Icon, title, description, specs, className = "" }: any) => (
  <motion.div 
    className={`bento-card p-10 flex flex-col justify-start h-full ${className}`}
  >
    <div className="relative z-10 flex flex-col h-full">
      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-10 border border-white/10 group-hover:bg-white group-hover:text-black transition-all duration-500">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-2xl font-heading font-black uppercase tracking-tight mb-4 text-white leading-tight">{title}</h3>
      <p className="text-white/60 text-base leading-relaxed mb-10 font-medium flex-grow">{description}</p>
      
      {specs && (
        <div className="grid grid-cols-1 gap-5 pt-10 border-t border-white/10">
           {specs.map((spec: string, i: number) => (
             <div key={i} className="flex items-start gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-white opacity-60 mt-1 flex-shrink-0" />
                 <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/50 group-hover:text-white transition-colors">{spec}</span>
              </div>
           ))}
        </div>
      )}
    </div>
  </motion.div>
);

export const Sistemas = ({ dict, system = {} }: { dict: any, system?: any }) => (
  <section id="sistemas" className="py-24 px-6 relative overflow-hidden bg-base">
    <div className="max-w-7xl mx-auto relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
         <div className="max-w-2xl">
            <div className="text-[11px] font-bold uppercase tracking-[0.5em] text-secondary mb-6">{dict.badge}</div>
            <h2 className="text-4xl md:text-6xl font-heading font-black text-white mb-6 tracking-[-0.05em] uppercase leading-[0.9]">{dict.title}</h2>
            <p className="text-lg text-white/40 leading-relaxed font-medium">{dict.subtitle}</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-6 auto-rows-[auto]">
        {/* Render first two cards */}
        {dict.cards.slice(0, 2).map((card: any, i: number) => (
          <div key={i} className="col-span-1 md:col-span-3">
            <ServiceCard 
              icon={i === 0 ? Zap : Cpu} 
              title={card.title} 
              description={card.description} 
              specs={card.specs}
            />
          </div>
        ))}

        {/* Card 3: Workflow Core (Special wide card) */}
        {dict.cards[2] && (
          <div className="col-span-1 md:col-span-6">
            <motion.div 
              className="bento-card p-12 md:p-20 flex flex-col md:flex-row justify-between items-center relative overflow-hidden group border-white/10"
            >
              <div className="relative z-10 flex flex-col gap-8 md:w-3/4">
                <div className="flex items-center gap-3 bg-white/5 w-fit px-6 py-2 rounded-full border border-white/10">
                  <Workflow className="w-4 h-4 text-white" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/60">{system.core || "NÚCLEO ESTRATÉGICO"}</span>
                </div>
                <h3 className="text-4xl lg:text-7xl font-heading font-black uppercase tracking-[-0.05em] text-white leading-[0.9]">
                  {dict.cards[2].title}
                </h3>
                <p className="text-white/50 font-medium text-lg md:text-xl leading-relaxed max-w-2xl">
                  {dict.cards[2].description}
                </p>
                <div className="flex flex-wrap gap-16 mt-8">
                  {dict.cards[2].specs.map((s: string, i: number) => (
                    <div key={i} className="flex flex-col gap-2">
                      <span className="text-white font-black text-5xl md:text-6xl tracking-tighter leading-none">{s.split(' ')[0]}</span>
                      <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-white/40">{s.split(' ').slice(1).join(' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Workflow className="hidden lg:block w-64 h-64 text-white opacity-[0.02] group-hover:rotate-12 group-hover:opacity-10 transition-all duration-[2s] relative z-10" />
            </motion.div>
          </div>
        )}

        {/* Render last two cards if they exist */}
        {dict.cards.slice(3).map((card: any, i: number) => (
          <div key={i} className="col-span-1 md:col-span-3">
            <ServiceCard
              icon={i === 0 ? BrainCircuit : ShieldCheck}
              title={card.title}
              description={card.description}
              specs={card.specs}
            />
          </div>
        ))}

        {/* Portal Systems: Strategic Web & Interface Architecture */}
        <div className="col-span-1 md:col-span-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            viewport={{ once: true }}
            className="bento-card p-14 md:p-24 flex flex-col md:flex-row justify-between items-center relative overflow-hidden group border-white/20 bg-gradient-to-br from-white/95 to-white"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl -z-1" />

            <div className="relative z-10 flex flex-col gap-10 md:w-3/4">
              <div className="flex items-center gap-4 bg-white/10 w-fit px-8 py-3 rounded-full border border-white/20 backdrop-blur-sm">
                <Workflow className="w-5 h-5 text-black" />
                <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-black/70">{"INFRAESTRUCTURA DIGITAL INTELIGENTE"}</span>
              </div>

              <div>
                <h3 className="text-5xl lg:text-8xl font-heading font-black uppercase tracking-[-0.05em] text-black leading-[0.9] mb-6">
                  PORTAL<br />SYSTEMS
                </h3>
                <p className="text-black/60 font-medium text-lg md:text-xl leading-relaxed max-w-2xl">
                  Creación y actualización de portales web con integración profunda a sistemas autónomos. Interfaces de control industrial que convierten fricción operativa en ventaja competitiva. 24/7 operativa sin intervención humana.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-8 pt-6">
                {[
                  { t: "Real-time Sync", d: "Datos sincronizados en <10ms" },
                  { t: "Zero-latency UI", d: "Respuestas instantáneas al usuario" },
                  { t: "Autonomous Ops", d: "Portal autogestionable 24/7" }
                ].map((s: string | any, i: number) => (
                  <div key={i} className="flex flex-col gap-2">
                    <span className="text-black font-black text-4xl tracking-tighter">✓</span>
                    <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-black/70">{typeof s === 'string' ? s : s.t}</span>
                    {typeof s === 'object' && <span className="text-[10px] text-black/50 font-medium">{s.d}</span>}
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-black/10 flex items-center gap-6 text-[10px] font-black text-black/40 uppercase tracking-[0.3em]">
                <div className="w-12 h-px bg-black/20" />
                DEPLOYABLE EN SERVIDORES PROPIOS • INTEGRACIÓN N8N NATIVA
              </div>
            </div>

            <Workflow className="hidden lg:block w-72 h-72 text-black opacity-[0.03] group-hover:rotate-12 group-hover:opacity-5 transition-all duration-[2s] relative z-10" />
          </motion.div>
        </div>
      </div>
    </div>
  </section>
);

