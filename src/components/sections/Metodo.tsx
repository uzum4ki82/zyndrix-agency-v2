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
          className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20 relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.15, delayChildren: 0.1 }}
        >
          {/* Connecting Line - Adjusted for new icon position */}
          <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-[1px] bg-gradient-to-r from-transparent via-secondary/10 to-transparent z-0" />

          {dict.steps?.map((step: any, i: number) => {
            const Icon = iconMap[step.icon] || Search;
            return (
              <motion.div
                key={i}
                variants={itemVariants}
                className="relative z-10 flex flex-col items-center text-center"
              >
                {/* Protocol Icon: The new visual anchor */}
                <div className="mb-8 relative">
                    <div className="w-24 h-24 rounded-[2rem] bg-white border border-secondary/5 shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex items-center justify-center text-primary relative z-10 transition-all duration-500 hover:border-primary/30">
                        <Icon size={32} strokeWidth={1.5} />
                    </div>
                    {/* Subtle Number Indicator */}
                    <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center text-[10px] font-black tracking-tighter z-20 shadow-xl border-4 border-white">
                        {step.number}
                    </div>
                </div>

                {/* Content Card */}
                <div className="flex-1 w-full p-6 rounded-[3rem] transition-all duration-500 hover:bg-slate-50/50">
                  <h3 className="text-2xl font-heading font-black uppercase tracking-tight mb-4 text-secondary">
                    {step.title}
                  </h3>

                  <p className="text-secondary/60 text-base leading-relaxed font-medium mb-6">
                    {step.description}
                  </p>

                  <div className="inline-block px-4 py-2 bg-primary/5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">
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

