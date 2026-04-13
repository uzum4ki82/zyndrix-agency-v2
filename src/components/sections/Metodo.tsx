'use client';

import { motion } from 'framer-motion';
import { Search, Palette, Zap, Rocket, ArrowRight } from 'lucide-react';

const iconMap: { [key: string]: React.ComponentType<any> } = {
  search: Search,
  palette: Palette,
  zap: Zap,
  rocket: Rocket
};

export const Metodo = ({ dict = {} }: { dict: any }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="proceso" className="py-24 px-6 relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="flex flex-col items-center text-center mb-20"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary mb-6">{dict.badge}</div>
          <h2 className="text-5xl md:text-7xl font-heading font-black text-secondary mb-6 tracking-tight uppercase leading-[0.9]">{dict.title}</h2>
          <p className="text-xl text-secondary/40 leading-relaxed font-medium max-w-2xl">{dict.subtitle}</p>
        </motion.div>

        {/* Timeline Steps */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20 relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.15, delayChildren: 0.1 }}
        >
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-24 left-[12.5%] right-[12.5%] h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent z-0" />

          {dict.steps?.map((step: any, i: number) => {
            const Icon = iconMap[step.icon] || Search;
            return (
              <motion.div
                key={i}
                variants={itemVariants}
                className="relative z-10 flex flex-col"
              >
                {/* Number Badge */}
                <div className="mb-10">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary text-white font-heading font-black text-2xl">
                    {step.number}
                  </div>
                </div>

                {/* Icon and Content Card */}
                <div className="flex-1 p-8 bg-slate-50 border border-secondary/5 rounded-[2.5rem] hover:border-primary/20 transition-all duration-500">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    <Icon size={24} className="text-primary" />
                  </div>

                  <h3 className="text-2xl font-heading font-black uppercase tracking-tight mb-4 text-secondary">
                    {step.title}
                  </h3>

                  <p className="text-secondary/60 text-base leading-relaxed font-medium mb-6">
                    {step.description}
                  </p>

                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">
                    {step.timeline}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="mt-20 p-10 md:p-16 rounded-[3rem] bg-secondary text-white flex flex-col md:flex-row items-center justify-between gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="text-2xl md:text-3xl font-heading font-black uppercase italic tracking-tight">
            ¿Quieres ver cómo funciona?
          </div>
          <a
            href="#contacto"
            className="px-10 py-5 bg-primary text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-white hover:text-secondary transition-all duration-300 flex items-center gap-3 whitespace-nowrap"
          >
            SOLICITAR AUDITORÍA <ArrowRight size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

