'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export const Hero = () => (
  <section className="min-h-screen flex flex-col justify-center items-center px-10 relative overflow-hidden">
    

    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="text-center relative z-20 max-w-6xl"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-14 inline-flex items-center gap-3 px-8 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.5em] text-primary backdrop-blur-3xl animate-float-subtle"
      >
        <Sparkles className="w-4 h-4" /> 
        Rendimiento IA Industrializado
      </motion.div>

      <h1 className="text-6xl md:text-8xl font-heading font-black tracking-tighter leading-[0.9] uppercase italic mb-10 select-none">
        <span className="text-white block">ZYNDRIX:</span>
        <span className="text-gradient-cyan block mt-2 drop-shadow-[0_0_30px_rgba(56,189,248,0.3)]">SOLUCIONES IA DE ALTO RENDIMIENTO</span>
      </h1>

      <p className="max-w-3xl mx-auto text-xl md:text-3xl text-white/40 mb-20 font-medium leading-[1.4] lowercase italic text-shadow-lg">
        no instalamos herramientas. construimos infraestructura autónoma que escala tu flujo de caja un 10x mediante arquitectura ia de élite.
      </p>

      <div className="flex flex-col sm:flex-row gap-10 justify-center items-center">
        <a href="#contacto" className="btn-elite group relative h-20 px-16 group">
          <span className="relative z-10 text-[16px]">INICIAR PROTOCOLO</span>
          <ArrowRight className="w-7 h-7 relative z-10 group-hover:translate-x-3 transition-transform" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent w-[200%] -translate-x-full animate-beam group-hover:block" />
        </a>
        <a href="#soluciones" className="text-[12px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-white transition-all h-20 flex items-center px-10 border border-white/5 rounded-full hover:bg-white/5 text-shadow">
          VER SISTEMAS
        </a>
      </div>
    </motion.div>

    {/* Scroll Indicator */}
    <motion.div 
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="absolute bottom-16 left-1/2 -translate-x-1/2 opacity-20 pointer-events-none"
    >
      <div className="w-[1px] h-20 bg-gradient-to-b from-white to-transparent" />
    </motion.div>
  </section>
);
