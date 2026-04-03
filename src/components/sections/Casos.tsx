'use client';

import { motion } from 'framer-motion';
import { SectionHeader } from '../common/SectionHeader';

export const CasosExito = () => (
  <section className="py-60 px-10">
    <div className="max-w-7xl mx-auto">
      <SectionHeader title="Ingeniería Aplicada" subtitle="Casos de Éxito de Élite" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        {[
          {
            client: "Logística Z",
            before: "80 h/semana manual",
            after: "< 5 min/semana",
            result: "500% Más Despachos",
            desc: "Automatización total de la gestión de pedidos y asignación de rutas mediante agentes IA propietarios.",
          },
          {
            client: "Real Estate Global",
            before: "Cierre lead: 12 horas",
            after: "< 3 segundos",
            result: "Conversión de ventas +200%",
            desc: "Implementación de Lead Score Pro para cualificación y agendado instantáneo en infraestructuras autónomas.",
          }
        ].map((caso, i) => (
          <motion.div 
            whileHover={{ y: -10 }}
            key={i} 
            className="p-16 rounded-[4.5rem] glass-premium group relative overflow-hidden"
          >
            <div className="absolute top-10 right-10 text-[10px] font-black uppercase tracking-[0.4em] text-primary/30 group-hover:text-primary transition-colors">PROYECTO_0{i+1}</div>
            <h4 className="text-4xl font-heading font-black uppercase italic mb-10 tracking-tighter leading-none">{caso.client}</h4>
            
            <div className="flex flex-col gap-8 mb-12">
               <div className="flex justify-between items-center text-sm border-b border-white/5 pb-4">
                  <span className="text-white/20 uppercase tracking-widest font-black italic">Antes</span>
                  <span className="text-white/40 font-bold">{caso.before}</span>
               </div>
               <div className="flex justify-between items-center text-lg bg-primary/10 p-6 rounded-2xl border border-primary/20">
                  <span className="text-primary uppercase tracking-widest font-black italic">Después</span>
                  <span className="text-white font-black">{caso.after}</span>
               </div>
            </div>

            <div className="bg-black/40 p-10 rounded-3xl border border-white/5">
                <div className="text-gradient-silver text-3xl font-black italic mb-4">{caso.result}</div>
                <p className="text-white/30 text-base leading-relaxed font-medium italic">{caso.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
