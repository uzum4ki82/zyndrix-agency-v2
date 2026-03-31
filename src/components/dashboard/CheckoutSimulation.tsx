'use client';

import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  Lock, 
  ArrowRight, 
  CheckCircle2,
  Euro,
  Globe,
  Sparkles,
  Zap,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CheckoutSimulationProps {
  isOpen: boolean;
  onClose: () => void;
  quote: {
    id: string;
    client: string;
    amount: string;
    type: string;
  } | null;
}

export default function CheckoutSimulation({ isOpen, onClose, quote }: CheckoutSimulationProps) {
  const [step, setStep] = useState<'form' | 'success'>('form');

  if (!quote) return null;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('success');
  };

  const handleClose = () => {
    setStep('form');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 lg:p-10 overflow-hidden">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="relative w-full max-w-5xl bg-white rounded-[40px] shadow-2xl flex flex-col lg:flex-row overflow-hidden border border-white/50"
          >
            {/* Left Column: Summary */}
            <div className="lg:w-2/5 bg-slate-50 p-10 lg:p-14 border-r border-slate-100 h-full flex flex-col justify-between">
               <div>
                  <div className="flex items-center gap-2 text-indigo-600 mb-12">
                     <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                        <Zap size={16} className="fill-white" />
                     </div>
                     <span className="font-black text-slate-900 text-lg uppercase tracking-tight">Zyndrix <span className="text-indigo-600 italic">Pay</span></span>
                  </div>

                  <div className="space-y-1 mb-8">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Presupuesto {quote.id}</span>
                     <h3 className="text-4xl font-black text-slate-900 leading-none">{quote.amount}</h3>
                  </div>

                  <div className="space-y-6">
                     <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                        <span>{quote.type}</span>
                        <span>{quote.amount}</span>
                     </div>
                     <div className="h-px bg-slate-200 border-dashed border-b" />
                     <div className="flex items-center justify-between text-base font-black text-slate-900">
                        <span>Total neto</span>
                        <span>{quote.amount}</span>
                     </div>
                  </div>
               </div>

               <div className="pt-10 flex flex-col gap-6">
                  <div className="flex items-center gap-3 text-slate-400">
                     <Globe size={16} />
                     <span className="text-[10px] font-black uppercase tracking-widest">Enlace Generado en Madrid, ES</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400">
                     <Lock size={16} />
                     <span className="text-[10px] font-black uppercase tracking-widest italic">Cifrado SSL 256-bits Zyndrix Neural</span>
                  </div>
               </div>
            </div>

            {/* Right Column: Payment Form */}
            <div className="flex-1 bg-white p-10 lg:p-14 relative content-center">
               <button onClick={handleClose} className="absolute top-8 right-8 p-2.5 hover:bg-slate-50 text-slate-300 hover:text-slate-900 transition-all rounded-full border border-transparent hover:border-slate-100">
                  <X size={20} />
               </button>

               <AnimatePresence mode="wait">
                  {step === 'form' ? (
                     <motion.div 
                        key="form"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="max-w-md mx-auto"
                     >
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Pagar con Tarjeta</h2>
                        <p className="text-xs text-slate-400 font-medium mb-10 leading-relaxed">Zyndrix facilita el pago seguro mediante pasarelas de pago certificadas. Por favor, introduzca los detalles para formalizar el contrato de {quote.client}.</p>
                        
                        <form onSubmit={handlePay} className="space-y-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Correo Electrónico</label>
                              <input 
                                 type="email" 
                                 required
                                 placeholder="contacto@inmobiliariasol.com"
                                 className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-900 outline-none focus:border-indigo-500 transition-all"
                              />
                           </div>

                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center justify-between">
                                 Detalles de Tarjeta
                                 <div className="flex items-center gap-1 opacity-40">
                                    <div className="w-6 h-4 bg-slate-200 rounded-sm" />
                                    <div className="w-6 h-4 bg-slate-200 rounded-sm" />
                                    <div className="w-6 h-4 bg-slate-200 rounded-sm" />
                                 </div>
                              </label>
                              <div className="relative">
                                 <input 
                                    placeholder="4242 4242 4242 4242"
                                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-900 outline-none focus:border-indigo-500 transition-all border-b-none rounded-b-none"
                                 />
                                 <div className="grid grid-cols-2">
                                    <input placeholder="MM / YY" className="p-4 bg-slate-50 border border-slate-100 rounded-bl-2xl text-xs font-bold text-slate-900 outline-none focus:border-indigo-500 transition-all border-t-0" />
                                    <input placeholder="CVC" className="p-4 bg-slate-50 border border-slate-100 rounded-br-2xl text-xs font-bold text-slate-900 outline-none focus:border-indigo-500 transition-all border-t-0 border-l-0" />
                                 </div>
                              </div>
                           </div>

                           <div className="space-y-2 pt-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Titular de la Tarjeta</label>
                              <input 
                                 placeholder="Nombre Completo"
                                 className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-900 outline-none focus:border-indigo-500 transition-all"
                              />
                           </div>

                           <button 
                             type="submit"
                             className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black text-xs flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 active:scale-95 group"
                           >
                              <ShieldCheck size={18} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                              Formalizar Pago de {quote.amount}
                           </button>
                        </form>

                        <div className="mt-10 flex items-center justify-center gap-6 opacity-30 grayscale hover:grayscale-0 transition-all">
                           <div className="text-[9px] font-black uppercase tracking-widest text-slate-500 border border-slate-300 px-2 py-1 rounded">Stripe-Ready</div>
                           <div className="text-[9px] font-black uppercase tracking-widest text-slate-500 border border-slate-300 px-2 py-1 rounded">PCI-DSS Cert</div>
                        </div>
                     </motion.div>
                  ) : (
                     <motion.div 
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20 flex flex-col items-center max-w-sm mx-auto"
                     >
                        <div className="w-24 h-24 rounded-[32px] bg-emerald-500 flex items-center justify-center text-white shadow-2xl shadow-emerald-200 mb-10 overflow-hidden relative group">
                           <CheckCircle2 size={40} className="relative z-10" />
                           <motion.div 
                              animate={{ rotate: 360 }}
                              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                              className="absolute inset-0 bg-white/20 scale-150 rotate-45"
                           />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">¡Pago Completado!</h2>
                        <p className="text-sm text-slate-400 font-medium mb-10 leading-relaxed">Su presupuesto {quote.id} ha sido formalizado. Recibirá la factura automatizada por correo electrónico de Zyndrix.</p>
                        
                        <button 
                           onClick={handleClose}
                           className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-100"
                        >
                           Volver al Dashboard
                           <ArrowRight size={16} />
                        </button>
                        <span className="text-[9px] font-bold text-slate-300 mt-6 uppercase tracking-widest">Powered by Zyndrix Neural Payments</span>
                     </motion.div>
                  )}
               </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
