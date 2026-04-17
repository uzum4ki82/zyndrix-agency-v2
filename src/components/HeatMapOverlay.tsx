import { motion } from 'framer-motion';

export default function HeatMapOverlay() {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none mix-blend-color-dodge">
      {/* Leak Zones */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] left-[10%] w-32 h-32 bg-red-500/30 rounded-full blur-3xl"
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-[40%] right-[15%] w-40 h-40 bg-orange-500/20 rounded-full blur-3xl"
      />
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute bottom-[20%] left-[30%] w-48 h-48 bg-red-600/25 rounded-full blur-3xl"
      />
      
      {/* Labels */}
      <div className="absolute top-[22%] left-[15%] flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,1)]" />
        <span className="text-[10px] font-black text-white uppercase tracking-widest bg-black/40 px-2 py-1 rounded backdrop-blur-sm border border-red-500/30">Fuga de Retención</span>
      </div>
      
      <div className="absolute top-[42%] right-[20%] flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,1)]" />
        <span className="text-[10px] font-black text-white uppercase tracking-widest bg-black/40 px-2 py-1 rounded backdrop-blur-sm border-orange-500/30">Carga Crítica</span>
      </div>
    </div>
  );
}
