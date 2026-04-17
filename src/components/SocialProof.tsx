import { motion } from 'framer-motion';

const PARTNERS = [
  'ARCH-MODERN', 'ELITE-CONSTRUCT', 'VERTICE-STUDIO', 'URBAN-CORE', 'METRO-PRIME'
];

export default function SocialProof() {
  return (
    <div className="py-20 border-y border-white/5 bg-slate-900/10">
      <div className="max-w-7xl mx-auto px-10">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-12 text-center">
          AUTORIDAD SECTORIAL COMPARTIDA
        </p>
        
        <div className="flex flex-wrap justify-between items-center gap-12 opacity-40 grayscale contrast-125">
          {PARTNERS.map((name, i) => (
            <motion.div 
              key={name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-2xl font-black tracking-tighter italic text-slate-200 hover:text-white hover:grayscale-0 transition-all cursor-default"
            >
              {name}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
