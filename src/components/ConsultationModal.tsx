import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Phone, MessageSquare, ArrowRight } from 'lucide-react';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessName: string;
}

export default function ConsultationModal({ isOpen, onClose, businessName }: ConsultationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl" 
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="relative w-full max-w-2xl bg-[#020617] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="p-12 md:p-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                Diagnóstico de {businessName}
              </div>
              
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-6 leading-none">
                Iniciar Conversión <br/>de Autoridad
              </h2>
              
              <p className="text-slate-400 font-light mb-12 text-lg">
                Agenda una consultoría estratégica de 15 minutos para activar la <span className="text-white font-medium italic underline decoration-indigo-500">Arquitectura Digital Zyndrix</span> en vuestro sector.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <a 
                  href="https://calendly.com/zyndrix" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group p-8 rounded-3xl bg-white text-black hover:bg-slate-100 transition-all flex flex-col justify-between h-56"
                >
                   <Calendar size={32} />
                   <div>
                      <p className="text-xs font-black uppercase tracking-widest leading-none mb-1 opacity-60">Sincronizar</p>
                      <h4 className="text-xl font-bold tracking-tight">Vía Calendly</h4>
                      <div className="h-[1px] w-0 group-hover:w-full bg-black transition-all duration-500 mt-2" />
                   </div>
                </a>
                
                <a 
                  href={`https://wa.me/34600000000?text=Hola,%20me%20interesa%20la%20arquitectura%20digital%20para%20${encodeURIComponent(businessName)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-8 rounded-3xl bg-emerald-600 text-white hover:bg-emerald-500 transition-all flex flex-col justify-between h-56 shadow-xl shadow-emerald-500/10"
                >
                   <MessageSquare size={32} />
                   <div>
                      <p className="text-xs font-black uppercase tracking-widest leading-none mb-1 opacity-70">Acceso Directo</p>
                      <h4 className="text-xl font-bold tracking-tight">Vía WhatsApp Business</h4>
                      <div className="h-[1px] w-0 group-hover:w-full bg-white transition-all duration-500 mt-2" />
                   </div>
                </a>
              </div>
              
              <div className="mt-12 pt-12 border-t border-white/5 flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-slate-500">
                <span>Protocolo de Exclusividad</span>
                <span className="flex items-center gap-2">Protección de Datos <Shield size={12} className="text-indigo-500" /></span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function Shield({ size, className }: { size: number, className: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    </svg>
  );
}
