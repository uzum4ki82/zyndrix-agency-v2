'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Zap } from 'lucide-react';

export const Planes = () => {
  const planes = [
    { 
      n: 'CORE Foundations', 
      s: '499€', 
      p: '199', 
      d: 'Puesta en marcha estratégica + Mantenimiento mensual para PYMES.', 
      f: ['1 Workflow Nuclear', 'Soporte Técnico L1', 'Auditoría Técnica Mensual', 'Integración básica WhatsApp', 'Mantenimiento Preventivo'] 
    },
    { 
      n: 'SCALE Protocol', 
      s: '950€', 
      p: '450', 
      d: 'Escalado inteligente con Agentes IA y automatización avanzada.', 
      f: ['3 Flujos de trabajo avanzados', 'Agente IA Personalizado (24/7)', 'Base de Conocimiento (RAG)', 'Soporte prioritario exclusivo', 'Escalabilidad Garantizada'], 
      m: true 
    },
    { 
      n: 'INDUSTRIAL OS', 
      s: 'Custom', 
      p: 'A medida', 
      d: 'Infraestructura propietaria de alto rendimiento y latencia cero.', 
      f: ['Agentes Autónomos Ilimitados', 'Entrenamiento LLM Privado', 'Infraestructura de Alta Latencia', 'Consultoría estratégica 1-a-1', 'SLA Garantizado 99.9%'] 
    },
  ];

  return (
    <section id="precios" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-4"
          >
            INVERSIÓN
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white mb-6 italic uppercase tracking-tighter"
          >
            Escala tu negocio <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">con IA</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {planes.map((plan, idx) => (
            <motion.div
              key={plan.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`p-10 rounded-[40px] border transition-all duration-500 flex flex-col ${plan.m ? 'bg-white/10 backdrop-blur-xl border-primary shadow-2xl shadow-primary/20 scale-105 z-20' : 'bg-white/5 backdrop-blur-md border-white/10 z-10'}`}
            >
              {plan.m && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-black text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest">
                  RECOMENDADO
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-black text-white mb-2 uppercase italic">{plan.n}</h3>
                <div className="text-primary font-mono text-sm font-bold tracking-tighter mb-1 uppercase">Setup: {plan.s}</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-white tracking-tighter">{plan.p}</span>
                  {plan.p !== 'A medida' && <span className="text-white/40 font-medium">/mes</span>}
                </div>
              </div>

              <div className="flex-grow mb-10 overflow-hidden">
                <ul className="space-y-4">
                  {plan.f.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3 text-white/70 text-sm leading-relaxed">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <a 
                href="#contacto" 
                className="w-full py-8 text-center rounded-3xl font-black uppercase italic tracking-[0.4em] text-[12px] transition-all bg-black text-white border border-primary/40 shadow-[0_0_40px_rgba(56,189,248,0.1)] hover:border-primary hover:shadow-[0_0_60px_rgba(56,189,248,0.3)] hover:scale-[1.02]"
              >
                INICIAR PROTOCOLO
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};


