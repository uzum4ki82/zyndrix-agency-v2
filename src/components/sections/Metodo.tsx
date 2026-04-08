'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { Search, Code, Zap, TrendingUp } from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';

export const Metodo = ({ dict }: { dict: any }) => {
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
    { s: dict?.steps?.[0]?.s || "01", t: dict?.steps?.[0]?.t || "", d: dict?.steps?.[0]?.d || "", i: Search },
    { s: dict?.steps?.[1]?.s || "02", t: dict?.steps?.[1]?.t || "", d: dict?.steps?.[1]?.d || "", i: Code },
    { s: dict?.steps?.[2]?.s || "03", t: dict?.steps?.[2]?.t || "", d: dict?.steps?.[2]?.d || "", i: Zap },
    { s: dict?.steps?.[3]?.s || "04", t: dict?.steps?.[3]?.t || "", d: dict?.steps?.[3]?.d || "", i: TrendingUp },
  ];

  return (
    <section id="proceso" ref={containerRef} className="py-12 md:py-20 px-10 relative overflow-hidden bg-base">
      <div className="absolute inset-0 bg-mesh opacity-5 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader title={dict.title} badge={dict.badge} subtitle={dict.subtitle} />

        {/* Animated Connecting Line SVG */}
        <div className="hidden lg:block absolute top-[350px] left-0 w-full h-[200px] z-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 1000 200" fill="none" preserveAspectRatio="none">
            <motion.path 
              d="M0 100 Q 250 180 500 100 T 1000 100" 
              stroke="white" 
              strokeWidth="2"
              strokeDasharray="10,20"
              style={{ pathLength }}
            />
          </svg>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-20 pt-24 relative z-10">
          {steps.map((step, idx) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 1, type: "spring", stiffness: 80 }}
              key={idx} 
              className="text-center group relative"
            >
              <div className="w-56 h-56 bg-base/50 glass-premium border border-white/5 rounded-[4rem] flex items-center justify-center mx-auto mb-14 group-hover:glow-border transition-all rotate-3 group-hover:rotate-0 group-hover:scale-105 duration-1000 shadow-[0_0_80px_rgba(0,0,0,0.5)]">
                <step.i className="w-16 h-16 text-white/40 group-hover:text-primary transition-colors duration-500" />
                <div className="absolute -top-8 -right-8 w-16 h-16 bg-primary text-black flex items-center justify-center rounded-3xl font-heading font-black italic shadow-[0_0_30px_rgba(56,189,248,0.5)] group-hover:scale-110 transition-transform">
                   {step.s}
                </div>
              </div>
              
              <h4 className="text-3xl font-heading font-black uppercase italic mb-6 tracking-tighter leading-[0.95] group-hover:text-primary transition-colors duration-500">
                {step.t}
              </h4>
              <p className="text-white/20 text-[14px] leading-relaxed max-w-[220px] mx-auto italic font-medium uppercase tracking-tight group-hover:text-white/60 transition-colors duration-500">
                {step.d}
              </p>
              
              {/* Bottom pulse decoration */}
              <div className="w-4 h-4 bg-primary/20 rounded-full mx-auto mt-12 animate-ping" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
