'use client';

import { motion } from 'framer-motion';
import { Star, ArrowRight, Quote } from 'lucide-react';
import Image from 'next/image';

export const Casos = ({ dict = {} }: { dict: any }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="casos" className="py-24 px-6 relative bg-white overflow-hidden">
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

        {/* Testimonials Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.1 }}
        >
          {dict.items?.map((item: any, i: number) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="p-12 bg-slate-50 border border-secondary/5 rounded-[3.5rem] hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col group relative overflow-hidden"
            >
              <Quote className="absolute -top-4 -right-4 w-32 h-32 text-primary/5 opacity-20 rotate-12 group-hover:scale-110 transition-transform duration-700" />
              
              <div className="flex flex-col md:flex-row gap-10 items-start md:items-center mb-10 relative z-10">
                {/* Profile Image */}
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-40 transition-opacity" />
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden border-4 border-white shadow-xl relative z-10">
                    {item.image ? (
                      <Image 
                        src={item.image} 
                        alt={item.name} 
                        width={128} 
                        height={128} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-secondary/10 flex items-center justify-center text-secondary/40 font-black text-4xl">
                        {item.name.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} size={14} className="fill-primary text-primary" />
                    ))}
                  </div>
                  <h4 className="text-2xl font-heading font-black uppercase text-secondary mb-1 leading-none tracking-tight">
                    {item.name}
                  </h4>
                  <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary/60">
                    {item.business}
                  </p>
                </div>
              </div>

              {/* Quote */}
              <blockquote className="text-xl md:text-2xl text-secondary/70 leading-relaxed font-medium mb-12 flex-grow italic relative z-10">
                "{item.quote}"
              </blockquote>

              {/* Footer with metric */}
              <div className="flex items-center justify-between pt-10 border-t border-secondary/5 relative z-10 mt-auto">
                <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm group-hover:shadow-md transition-shadow">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-[12px] font-black uppercase tracking-[0.2em] text-secondary">
                    {item.metric}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary group-hover:translate-x-2 transition-transform">
                  HISTORIA REAL <ArrowRight size={14} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
