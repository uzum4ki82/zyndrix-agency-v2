'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { Search, Code, Zap, TrendingUp, ArrowRight } from 'lucide-react';
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
    { s: dict?.steps?.[0]?.s || "01", t: dict?.steps?.[0]?.t || "AUDIT", d: dict?.steps?.[0]?.d || "Forensic analysis of gaps.", i: Search, img: "/img/zyndrix_step_01_audit.png" },
    { s: dict?.steps?.[1]?.s || "02", t: dict?.steps?.[1]?.t || "DESIGN", d: dict?.steps?.[1]?.d || "Architecture blueprinting.", i: Code, img: "/img/zyndrix_step_02_design.png" },
    { s: dict?.steps?.[2]?.s || "03", t: dict?.steps?.[2]?.t || "INJECT", d: dict?.steps?.[2]?.d || "System core implementation.", i: Zap, img: "/img/zyndrix_step_03_inject.png" },
    { s: dict?.steps?.[3]?.s || "04", t: dict?.steps?.[3]?.t || "SCALE", d: dict?.steps?.[3]?.d || "Industrial output growth.", i: TrendingUp, img: "/img/zyndrix_step_04_scale.png" },
  ];

  return (
    <section id="proceso" ref={containerRef} className="py-12 px-10 relative overflow-hidden bg-white border-y border-primary/10">
      <div className="arch-grid opacity-10" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader title={dict.title} badge={dict.badge} subtitle={dict.subtitle} />

        {/* Technical Flow Path */}
        <div className="hidden lg:block absolute top-[440px] left-0 w-full h-[2px] z-0 opacity-10">
           <div className="w-full h-full bg-primary" />
           <motion.div 
             className="absolute top-0 left-0 h-full bg-black shadow-[0_0_15px_rgba(0,0,0,0.5)]" 
             style={{ width: "100%", originX: 0, scaleX: scrollYProgress }} 
           />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-28 relative z-10">
          {steps.map((step, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -6 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              key={idx}
              className="bg-white border border-primary/10 p-2 relative flex flex-col group hover:shadow-2xl hover:border-primary/30 transition-all duration-700"
            >
              {/* Step Image */}
              <div className="relative aspect-video overflow-hidden border-b border-primary/5 bg-slate-50 mb-8 group-hover:bg-white transition-colors">
                <Image
                  src={step.img}
                  alt={step.t}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[1.5s]"
                />
                <div className="absolute top-4 right-4 text-5xl font-heading font-black text-white mix-blend-difference opacity-20 group-hover:opacity-40 transition-opacity">
                  {step.s}
                </div>
              </div>

              <div className="p-8">
                <div className="w-14 h-14 bg-slate-50 border border-primary/10 flex items-center justify-center mb-8 group-hover:bg-black group-hover:text-white transition-all duration-500">
                  <step.i size={20} strokeWidth={1.5} />
                </div>

                <h4 className="text-base font-black uppercase tracking-tight mb-4 flex items-center gap-3 text-primary leading-none">
                  {step.t}
                  <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 flex-shrink-0" />
                </h4>

                <p className="text-slate-600 text-[13px] font-medium leading-relaxed mb-8">
                  {step.d}
                </p>

                <div className="pt-8 border-t border-primary/10 flex justify-between items-end">
                  <div className="flex flex-col gap-1">
                     <div className="w-14 h-1.5 bg-primary/10 relative overflow-hidden">
                        <motion.div
                          className="absolute inset-y-0 left-0 bg-primary"
                          animate={{ x: idx % 2 === 0 ? ["-100%", "100%"] : ["100%", "-100%"] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        />
                     </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-primary/20 group-hover:bg-primary transition-colors duration-500" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 grid lg:grid-cols-12 gap-12 items-center border-t border-primary/10 pt-24">
           <div className="lg:col-span-8 relative aspect-[21/9] overflow-hidden border border-primary/10 bg-slate-50 group shadow-lg">
              <Image
                src="/img/zyndrix_process_flow_v4.png"
                alt="Zyndrix Process Framework"
                fill
                className="object-cover grayscale opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-1000"
              />
              <div className="absolute top-10 left-10 bg-black text-white p-8 shadow-3xl">
                 <div className="text-[9px] font-black uppercase tracking-[0.6em] opacity-50 mb-3">ARCH_REVISION_6</div>
                 <h5 className="text-2xl font-heading font-black tracking-tight">FRAMEWORK_CORE</h5>
              </div>
           </div>
           
           <div className="lg:col-span-4 flex flex-col gap-12">
              {[
                { l: "Cycle Time", v: "14 Days", d: "From audit to initial injection." },
                { l: "Integration", v: "Full Native", d: "Zero friction with current stacks." },
                { l: "Deployment", v: "Autonomous", d: "Self-healing operational loops." }
              ].map((m, i) => (
                <div key={i} className="flex flex-col border-l-4 border-primary/20 pl-10 group">
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 group-hover:text-black transition-colors">{m.l}</span>
                  <span className="text-3xl font-heading font-black text-primary mb-3 italic tracking-tighter">{m.v}</span>
                  <p className="text-[12px] text-slate-600 font-medium leading-relaxed">{m.d}</p>
                </div>
              ))}
           </div>
        </div>
      </div>
    </section>

  );
};

