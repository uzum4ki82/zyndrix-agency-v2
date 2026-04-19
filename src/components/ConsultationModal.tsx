import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Phone, MessageSquare, ArrowRight, Shield } from 'lucide-react';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessName: string;
}

export default function ConsultationModal({ isOpen, onClose, businessName }: ConsultationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md" 
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-[#0a0f1e] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl"
          >
            <button 
              onClick={onClose}
              className="absolute top-10 right-10 text-slate-500 hover:text-white transition-colors"
            >
              <X size={28} />
            </button>
            
            <div className="p-12 md:p-20">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-10">
                Línea Directa Directa
              </div>
              
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase mb-8 leading-none text-white">
                Contactar con <br/>{businessName}
              </h2>
              
              <p className="text-slate-400 font-light mb-14 text-xl leading-relaxed">
                Estamos listos para atenderte. Elige el canal que prefieras para una atención inmediata y personalizada.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <a 
                  href="https://calendly.com/zyndrix" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group p-10 rounded-[2.5rem] bg-white text-black hover:bg-slate-100 transition-all flex flex-col justify-between h-64"
                >
                   <div className="w-14 h-14 rounded-2xl bg-black/5 flex items-center justify-center">
                     <Calendar size={28} />
                   </div>
                   <div>
                      <p className="text-xs font-black uppercase tracking-widest leading-none mb-1 opacity-40">Agenda</p>
                      <h4 className="text-2xl font-bold tracking-tight">Cita Previa</h4>
                      <div className="h-[2px] w-0 group-hover:w-full bg-black transition-all duration-500 mt-3" />
                   </div>
                </a>
                
                <a 
                  href={`https://wa.me/34600000000?text=Hola,%20me%20gustaría%20solicitar%20información%20sobre%20los%20servicios%20de%20${encodeURIComponent(businessName)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-10 rounded-[2.5rem] bg-[#25D366] text-white hover:bg-[#22c35e] transition-all flex flex-col justify-between h-64 shadow-xl shadow-emerald-500/10"
                >
                   <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center font-bold">
                     <MessageSquare size={28} />
                   </div>
                   <div>
                      <p className="text-xs font-black uppercase tracking-widest leading-none mb-1 opacity-70">Mensaje</p>
                      <h4 className="text-2xl font-bold tracking-tight">WhatsApp</h4>
                      <div className="h-[2px] w-0 group-hover:w-full bg-white transition-all duration-500 mt-3" />
                   </div>
                </a>
              </div>
              
              <div className="mt-16 pt-10 border-t border-white/5 flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-slate-600">
                <span className="flex items-center gap-2">Protección de Datos <Shield size={14} className="text-indigo-500" /></span>
                <span>Atención 24h</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
