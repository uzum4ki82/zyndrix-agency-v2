"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const ai_stack = [
  { name: "OpenAI", img: "/img/chatgpt-logo-clean.png" },
  { name: "Claude", img: "/img/claude-logo-clean.png" },
  { name: "n8n", img: "/img/n8n-logo-clean.png" },
  { name: "Mistral", img: "/img/mistral-logo-clean.png" },
  { name: "Llama", img: "/img/llama-logo-clean.png" },
  { name: "Perplexity", img: "/img/perplexity-logo-clean.png" },
  { name: "Grok", img: "/img/grok-logo-clean.png" },
  { name: "Veo", img: "/img/veo-logo-clean.png" },
  { name: "Sora", img: "/img/chatgpt-logo-clean.png" },
  { name: "Gemini", img: "/img/veo-logo-clean.png" }
];

export const TechStack = ({ dict }: { dict: any }) => {
  return (
    <section className="py-8 md:py-12 bg-slate-50 relative border-b border-primary/10 overflow-hidden">
      <div className="arch-grid opacity-15" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-16 group">
          <div className="flex items-center gap-6">
             <div className="w-8 h-px bg-primary/20" />
             <div className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/50 whitespace-nowrap">
               {dict.title || "IMPULSADO_POR_NÚCLEO_v4"}
             </div>
          </div>

          <div className="flex-1 flex flex-wrap items-center justify-center lg:justify-between gap-x-12 gap-y-6 md:gap-x-16 opacity-50 group-hover:opacity-100 transition-opacity duration-700">
            {ai_stack.map((tech, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="relative h-4 w-20 flex items-center justify-center grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
              >
                <Image 
                  src={tech.img} 
                  alt={tech.name} 
                  width={80}
                  height={16}
                  className="object-contain opacity-50 hover:opacity-100" 
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>


  );
};

