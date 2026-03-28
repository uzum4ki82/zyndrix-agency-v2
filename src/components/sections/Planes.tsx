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
      f: ['3 Flujos de trabajo avanzados', 'Agente IA Personalizado (24/7)', 'Base de Conocimiento (RAG)', 'Dashboard de ROI real-time', 'Soporte prioritario exclusivo'], 
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
    <section id="precios" className="py-24 relative overflow-hidden bg-slate-50">
      {/* Background accents for light theme */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30">
        <div className="absolute top-1/4 -left-1/4 w-[50%] h-[50%] bg-cyan-400/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 -right-1/4 w-[50%] h-[50%] bg-blue-400/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-600 text-[10px] font-black uppercase tracking-[0.3em] mb-4"
          >
            INVERSIÓN
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-slate-900 mb-6 italic uppercase tracking-tighter"
          >
            Capacidad de <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-600">Carga IA</span>
          </motion.h2>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium text-sm md:text-base">
            Modelos de inversión escalables diseñados para maximizar el ROI de PYMES y grandes corporaciones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {planes.map((plan, idx) => (
            <motion.div
              key={plan.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`relative p-10 rounded-[40px] border transition-all duration-500 flex flex-col group ${
                plan.m 
                ? 'bg-white/80 backdrop-blur-2xl border-cyan-200 shadow-2xl shadow-cyan-500/10 scale-105 z-20' 
                : 'bg-white/60 backdrop-blur-xl border-slate-200 hover:border-cyan-200 z-10'
              }`}
            >
              {plan.m && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-[0.3em] shadow-lg flex items-center gap-2">
                  <Zap className="w-3 h-3 text-cyan-400" />
                  RECOMENDADO
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-3xl font-black text-slate-900 mb-2 uppercase italic tracking-tighter">{plan.n}</h3>
                <div className="text-cyan-600 font-mono text-[11px] font-bold tracking-widest mb-2 uppercase opacity-80">Setup: {plan.s}</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-slate-900 tracking-tighter">{plan.p}</span>
                  {plan.p !== 'A medida' && <span className="text-slate-400 font-bold text-sm tracking-widest uppercase">€/mes</span>}
                </div>
              </div>

              <div className="flex-grow mb-10">
                <ul className="space-y-4">
                  {plan.f.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3 text-slate-600 text-sm font-medium leading-relaxed group-hover:text-slate-900 transition-colors">
                      <CheckCircle2 className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5 opacity-60 group-hover:opacity-100" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <a 
                href="#contacto" 
                className={`w-full py-8 text-center rounded-3xl font-black uppercase italic tracking-[0.4em] text-[12px] transition-all ${
                  plan.m 
                  ? 'bg-black text-white shadow-xl shadow-slate-900/10 hover:shadow-cyan-500/30' 
                  : 'bg-slate-100 text-slate-500 hover:bg-black hover:text-white'
                }`}
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

