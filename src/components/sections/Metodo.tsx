'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { Search, Code, Zap, TrendingUp, CircleDollarSign, Clock, Cpu } from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';

export const Metodo = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const steps = [
    { s: '01', t: 'Auditoría Total', d: 'Mapeo masivo de ineficiencias y puntos de fuga en tu flujo operativo.', i: Search },
    { s: '02', t: 'Arquitectura IA', d: 'Diseño de blueprints técnicos de infraestructura autónoma.', i: Code },
    { s: '03', t: 'Inyección SPRINT', d: 'Despliegues técnicos de alto impacto en ráfagas de 2 semanas.', i: Zap },
    { s: '04', t: 'Escalado Industrial', d: 'Monitoreo de latencia y ROI para crecimiento ilimitado.', i: TrendingUp },
  ];

  return (
    <section id="proceso" ref={containerRef} className="py-60 px-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader title="El Protocolo" subtitle="Ingeniería Industrial" centered />

        {/* Animated Connecting Line SVG */}
        <div className="hidden lg:block absolute top-[280px] left-0 w-full h-[150px] z-0 opacity-20">
          <svg width="100%" height="100" viewBox="0 0 1000 100" fill="none" preserveAspectRatio="none">
            <motion.path 
              d="M0 50 Q 250 100 500 50 T 1000 50" 
              stroke="white" 
              strokeWidth="4"
              style={{ pathLength }}
            />
          </svg>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 relative z-10">
          {steps.map((step, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.8 }}
              key={idx} 
              className="text-center group"
            >
              <div className="w-48 h-48 bg-base/50 glass-premium border border-white/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-12 group-hover:glow-border transition-all rotate-2 group-hover:rotate-0 group-hover:scale-105 duration-500 shadow-2xl">
                <step.i className="w-16 h-16 text-white group-hover:text-primary transition-colors" />
                <span className="absolute -top-6 -right-6 w-14 h-14 bg-primary text-base flex items-center justify-center rounded-2xl font-black italic shadow-[0_0_20px_rgba(56,189,248,0.4)]">{step.s}</span>
              </div>
              <h4 className="text-3xl font-heading font-black uppercase italic mb-4 tracking-tighter leading-none">{step.t}</h4>
              <p className="text-white/30 text-base leading-relaxed max-w-[200px] mx-auto opacity-70 italic font-medium">{step.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Impacto = () => (
  <section id="stats" className="py-60 px-10">
    <div className="max-w-7xl mx-auto glass-premium p-32 rounded-[5rem] border border-white/5 flex flex-col lg:flex-row justify-between items-center gap-24 relative overflow-hidden group">
      <div className="absolute inset-0 opacity-5 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] transition-opacity duration-1000 group-hover:opacity-10" />
      {[
        { v: '85%', l: 'Reducción Costes Op.', i: CircleDollarSign },
        { v: '10X', l: 'Escala Eficiencia', i: Zap },
        { v: '24/7', l: 'Ejecución Autónoma', i: Clock },
        { v: '0.4s', l: 'Latencia Núcleo', i: Cpu }
      ].map((s, i) => (
        <div key={i} className="text-center relative z-10 group/stat">
          <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-10 border border-primary/10 group-hover/stat:bg-primary/20 transition-all duration-700">
             <s.i className="w-6 h-6 text-primary" />
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-7xl lg:text-9xl font-heading font-black tracking-[calc(-0.06em)] mb-6 text-gradient-silver italic leading-none"
          >
            {s.v}
          </motion.div>
          <div className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 group-hover/stat:text-primary transition-colors duration-700">{s.l}</div>
        </div>
      ))}
    </div>
  </section>
);
