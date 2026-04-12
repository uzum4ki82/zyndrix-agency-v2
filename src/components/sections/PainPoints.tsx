'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export const PainPoints = ({ dict = {}, system = {} }: { dict: any, system?: any }) => {
  return (
    <section id="problema" className="py-20 px-6 relative overflow-hidden bg-white border-y border-primary/10">
      <div className="arch-grid opacity-15" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Minimal Diagnostic Header */}
        <div className="mb-16">
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="font-mono text-[9px] font-black text-red-600 uppercase tracking-[0.5em] mb-6 flex items-center gap-3"
          >
            <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
            {system.diagnosing || "DIAGNOSTIC_SCAN"}
          </motion.div>

          <h2 className="text-5xl md:text-7xl font-heading font-black text-primary uppercase tracking-[-0.04em] leading-[0.9] mb-6">
            {dict.title || "LA FRICCIÓN"}
          </h2>
          <p className="text-lg md:text-xl text-secondary font-medium max-w-2xl leading-relaxed">
            {dict.subtitle || "Operaciones fragmentadas = valor perdido. Visualizamos exactamente dónde está el cuello de botella."}
          </p>
        </div>

        {/* Single Large Visual Diagnostic */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative group"
        >
          <div className="relative aspect-video md:aspect-[2/1] overflow-hidden border-2 border-red-200 bg-slate-100 shadow-2xl hover:shadow-3xl transition-all duration-700">
            <Image
              src="/img/zyndrix_process_flow_v5.png"
              alt="Diagnostic Process Flow"
              fill
              className="object-cover grayscale brightness-95 group-hover:brightness-100 group-hover:grayscale-0 transition-all duration-1000"
            />

            {/* Overlay Text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            <div className="absolute bottom-8 left-8 right-8 relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div>
                  <div className="text-[9px] font-black text-red-400 uppercase tracking-[0.5em] mb-3">PROCESO DIAGNOSTICADO</div>
                  <h3 className="text-3xl md:text-5xl font-heading font-black text-white uppercase leading-[0.9] tracking-tight">
                    {dict.diagnostic || "4 ETAPAS CRÍTICAS"}
                  </h3>
                </div>

                <div className="hidden md:flex flex-col items-end gap-4 border-l border-white/30 pl-8">
                  {[
                    { label: "Fricción Operativa", value: "-98%" },
                    { label: "Tiempo Manual", value: "-95%" },
                    { label: "Costes Fijos", value: "-87%" }
                  ].map((stat, i) => (
                    <div key={i}>
                      <div className="text-[10px] font-black text-white/50 uppercase tracking-widest">{stat.label}</div>
                      <div className="text-3xl font-heading font-black text-white">{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
