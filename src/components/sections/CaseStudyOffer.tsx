'use client';

import { motion } from 'framer-motion';
import { Star, ArrowRight } from 'lucide-react';

export const CaseStudyOffer = () => (
  <section className="py-24 px-10 relative overflow-hidden">
    <div className="max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="glass-premium p-12 md:p-20 rounded-[4rem] border border-primary/20 bg-primary/5 relative overflow-hidden text-center"
      >
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <Star className="w-40 h-40 text-primary" />
        </div>
        
        <h2 className="text-4xl md:text-7xl font-heading font-black uppercase italic tracking-tighter mb-8 leading-none">
          ¿Quieres un <span className="text-primary italic">20% de Descuento</span>?
        </h2>
        
        <p className="text-xl md:text-3xl font-medium text-white/60 mb-12 max-w-3xl mx-auto uppercase italic tracking-tight">
          Estamos buscando empresas reales para crear casos de estudio de éxito. Si nos permites documentar tu automatización, te aplicamos un descuento directo en tu infraestructura.
        </p>
        
        <div className="flex flex-col md:flex-row justify-center gap-8">
          <a href="#contacto" className="btn-elite h-20 px-12 text-sm uppercase tracking-[0.5em] group">
            <span>Aplicar para Caso de Estudio</span>
            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
          </a>
        </div>
      </motion.div>
    </div>
  </section>
);
