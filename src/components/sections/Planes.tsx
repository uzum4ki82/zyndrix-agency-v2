'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Zap } from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';

export const Planes = () => (
  <section className="py-60 px-10 relative overflow-hidden">
    <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    <div className="max-w-7xl mx-auto relative z-10">
      <SectionHeader title="Capacidad de Carga" subtitle="Consultoría Estratégica" centered />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[400px] bg-primary/5 blur-[150px] -z-10" />

        {[
          { 
            n: 'CORE Foundations', 
            s: '499', 
            p: '199', 
            d: 'Puesta en marcha estratégica + Mantenimiento mensual para PYMES.', 
            f: ['1 Workflow Nuclear', 'Soporte Técnico L1', 'Auditoría Técnica Mensual'] 
          },
          { 
            n: 'SCALE Protocol', 
            s: '950', 
            p: '450', 
            d: 'Escalado inteligente con Agentes IA y automatización avanzada.', 
            f: ['3 Workflows Complejos', 'Agente IA Personalizado', 'Base de Conocimiento (RAG)'], 
            m: true 
          },
          { 
            n: 'INDUSTRIAL OS', 
            s: 'A MEDIDA', 
            p: 'CONSULTAR', 
            d: 'Infraestructura propietaria de alto rendimiento y latencia cero.', 
            f: ['Entrenamiento LLM Privado', 'Arquitecto Dedicado 24/7', 'SLA Garantizado 99.9%'] 
          },
        ].map((plan, i) => (
          <motion.div 
            whileHover={{ y: -15, scale: 1.02 }}
            key={i} 
            className={`p-16 rounded-[4.5rem] glass-premium border ${plan.m ? 'border-primary/40 ring-2 ring-primary/10 shadow-[0_0_100px_rgba(56,189,248,0.15)]' : 'border-white/5'} flex flex-col justify-between transition-all group`}
          >
            <div>
              {plan.m && (
                <div className="flex items-center gap-2 mb-10 bg-primary/20 w-fit px-4 py-1 rounded-full border border-primary/30">
                  <Zap className="w-3 h-3 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">RECOMENDADO</span>
                </div>
              )}
              <h4 className="text-4xl font-heading font-black uppercase italic mb-2 tracking-tighter leading-none">{plan.n}</h4>
              
              <div className="mb-10 space-y-1">
                <div className="text-sm font-black italic text-white/40 uppercase tracking-widest leading-none">
                  Puesta en marcha: {plan.s !== 'A MEDIDA' ? `${plan.s}€` : plan.s}
                </div>
                <div className="text-4xl font-black italic text-white flex items-baseline gap-2 leading-none">
                  {plan.p !== 'CONSULTAR' ? (
                    <>
                      {plan.p}<span className="text-sm font-medium text-white/40 uppercase tracking-tighter not-italic">€/mes</span>
                    </>
                  ) : (
                    <span className="text-2xl">{plan.p}</span>
                  )}
                </div>
              </div>

              <p className="text-xs text-white/30 lowercase italic mb-12 font-medium leading-relaxed">{plan.d}</p>
              <ul className="space-y-8 mb-20 text-shadow">
                {plan.f.map(feat => (
                  <li key={feat} className="flex gap-4 text-sm font-black italic uppercase tracking-tighter text-white/60 group-hover:text-white transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 opacity-40 group-hover:opacity-100" />
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
            <a href="#contacto" className={`w-full py-8 text-center rounded-3xl font-black uppercase italic tracking-[0.4em] text-[12px] transition-all ${plan.m ? 'bg-white text-black neon-blue shadow-[0_0_40px_rgba(56,189,248,0.2)]' : 'bg-white/5 hover:bg-primary hover:text-base border border-white/10'}`}>
              INICIAR PROTOCOLO
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
