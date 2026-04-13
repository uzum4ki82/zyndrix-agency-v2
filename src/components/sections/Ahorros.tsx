'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Clock, DollarSign, Zap } from 'lucide-react';

export const Ahorros = ({ dict = {} }: { dict: any }) => {
  const metricIcons = [Clock, DollarSign, TrendingUp, Zap];

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="py-24 px-6 relative bg-slate-50 overflow-hidden">
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

        {/* Metrics Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.1 }}
        >
          {dict.items?.map((item: any, i: number) => {
            const Icon = metricIcons[i % metricIcons.length];
            return (
              <motion.div
                key={i}
                variants={itemVariants}
                className="p-10 bg-white border border-secondary/5 rounded-[2.5rem] hover:border-primary/20 hover:shadow-lg transition-all duration-500 flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Icon size={28} className="text-primary group-hover:text-white" />
                </div>

                <div className="mb-6">
                  <div className="text-5xl md:text-6xl font-heading font-black text-primary mb-2">
                    {item.metric}
                  </div>
                </div>

                <p className="text-secondary/60 text-lg leading-relaxed font-medium">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <button className="px-12 py-6 bg-primary text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-secondary transition-all duration-300 shadow-lg shadow-primary/20">
            {dict.cta}
          </button>
        </motion.div>
      </div>
    </section>
  );
};
