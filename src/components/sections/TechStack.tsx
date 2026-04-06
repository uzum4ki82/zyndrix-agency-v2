"use client";

import { motion } from "framer-motion";

const ai_stack = [
  { name: "OpenAI", img: "/img/chatgpt-logo-clean.png" },
  { name: "Claude", img: "/img/claude-logo-clean.png" },
  { name: "Grok", img: "/img/grok-logo-clean.png" },
  { name: "n8n", img: "/img/n8n-logo-clean.png" },
  { name: "Mistral", img: "/img/mistral-logo-clean.png" },
  { name: "Llama", img: "/img/llama-logo-clean.png" },
  { name: "Perplexity", img: "/img/perplexity-logo-clean.png" }
];

export const TechStack = ({ dict }: { dict: any }) => {
  return (
    <section className="py-24 border-y border-white/[0.05] bg-[#050508]/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-10" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-primary font-black text-[12px] tracking-[0.5em] uppercase mb-6 inline-block px-6 py-2 bg-primary/5 rounded-full border border-primary/20"
          >
            {dict.title || "NÚCLEO DE PROCESAMIENTO"} ⚡
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-4xl md:text-6xl font-heading font-black text-white italic tracking-tighter uppercase leading-none drop-shadow-2xl"
          >
            POTENCIE SU MARGEN <span className="text-white/20">CON EL ESTADO DEL ARTE</span>
          </motion.h2>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-20 gap-y-16">
          {ai_stack.map((tech, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              whileHover={{ scale: 1.1, y: -5 }}
              className="flex flex-col items-center gap-6 group"
            >
              <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-6 backdrop-blur-xl group-hover:bg-primary/10 group-hover:border-primary/40 transition-all duration-500 shadow-xl">
                 <img src={tech.img} alt={tech.name} className="w-full h-full object-contain filter grayscale invert brightness-200 group-hover:grayscale-0 group-hover:invert-0 transition-all duration-700" />
              </div>
              <div className="text-[12px] font-black uppercase tracking-[0.4em] text-white/50 group-hover:text-primary transition-colors text-shadow">{tech.name}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
