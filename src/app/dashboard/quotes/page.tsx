'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Download,
  ExternalLink,
  CreditCard,
  Zap,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import AddQuoteModal from '@/components/dashboard/AddQuoteModal';
import CheckoutSimulation from '@/components/dashboard/CheckoutSimulation';

// Sample Quotes Data
const initialQuotes: any[] = [];

export default function QuotesPage() {
  const [quotes, setQuotes] = useState(initialQuotes);
  const [isAddQuoteOpen, setIsAddQuoteOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<any>(null);

  const handleAddQuote = (newQuote: any) => {
    setEvents(prev => [newQuote, ...prev]);
  };

  const setEvents = (fn: (prev: any[]) => any[]) => {
    setQuotes(fn);
  };

  const openCheckout = (quote: any) => {
    setSelectedQuote(quote);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="animate-in space-y-8 pb-10">
      {/* FINANCIAL TOP BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
         <div>
            <div className="flex items-center gap-2 text-emerald-600 mb-1">
               <ShieldCheck size={14} className="fill-emerald-600/10" />
               <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Gestión de Ingresos Proyectados</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Presupuestos y Cotizaciones</h1>
         </div>
         
         <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsAddQuoteOpen(true)}
              className="w-full sm:w-auto bg-slate-900 text-white px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2 group"
            >
               <Plus size={16} className="group-hover:rotate-90 transition-transform" />
               Crear Presupuesto
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
         <div className="xl:col-span-8">
            {/* QUOTES LIST */}
            <div className="ds-card p-0 bg-white overflow-hidden border-slate-100 shadow-xl shadow-slate-200/50">
               <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
                  <div className="flex items-center gap-3">
                     <FileText size={18} className="text-indigo-600" />
                     <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest">Historial de Cotizaciones</h3>
                  </div>
                  <div className="flex items-center gap-2">
                     <Search size={14} className="text-slate-300" />
                     <input placeholder="Buscar por cliente o ID..." className="bg-transparent border-none outline-none text-[10px] font-bold text-slate-900 w-48 placeholder:text-slate-300" />
                  </div>
               </div>
               <div className="overflow-x-auto">
                  {/* ... table content remains ... */}
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-50">
                           <th className="p-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">ID / Fecha</th>
                           <th className="p-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">Cliente</th>
                           <th className="p-6 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Importe</th>
                           <th className="p-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">Estado</th>
                           <th className="p-6 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Cobro Online</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                        <AnimatePresence mode="popLayout">
                          {quotes.map((quote) => (
                             <motion.tr 
                                layout
                                key={quote.id} 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="group hover:bg-slate-50/50 transition-colors"
                             >
                                <td className="p-6">
                                   <div className="flex flex-col">
                                      <span className="text-xs font-black text-slate-900">{quote.id}</span>
                                      <span className="text-[9px] font-bold text-slate-400 uppercase">{quote.date}</span>
                                   </div>
                                </td>
                                <td className="p-6">
                                   <div className="flex flex-col">
                                      <span className="text-xs font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{quote.client}</span>
                                      <span className="text-[9px] font-black text-indigo-500/60 uppercase tracking-widest">{quote.type}</span>
                                   </div>
                                </td>
                                <td className="p-6 text-center">
                                   <span className="text-xs font-black text-slate-900">{quote.amount}</span>
                                </td>
                                <td className="p-6">
                                   <div className={cn(
                                      "inline-flex items-center gap-1.5 px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest",
                                      quote.status === 'aceptado' ? "bg-emerald-50 text-emerald-600" : 
                                      quote.status === 'enviado' ? "bg-indigo-50 text-indigo-600" : 
                                      quote.status === 'vencido' ? "bg-rose-50 text-rose-600" : "bg-slate-50 text-slate-400"
                                   )}>
                                      {quote.status}
                                   </div>
                                </td>
                                <td className="p-6 text-right">
                                   <div className="flex items-center justify-end gap-2">
                                      {quote.status === 'aceptado' ? (
                                         <button className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-md shadow-emerald-900/10 flex items-center gap-1.5 pointer-events-none border border-emerald-500 shadow-xl shadow-emerald-900/10">
                                            <CheckCircle2 size={12} />
                                            Pagado
                                         </button>
                                      ) : (
                                         <button 
                                            onClick={() => openCheckout(quote)}
                                            className="bg-white border border-slate-200 text-slate-900 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center gap-1.5 active:scale-95"
                                         >
                                            <CreditCard size={12} />
                                            Enlace Pago
                                         </button>
                                      )}
                                      <button className="p-2 text-slate-300 hover:text-slate-600 rounded-lg"><Download size={14} /></button>
                                   </div>
                                </td>
                             </motion.tr>
                          ))}
                        </AnimatePresence>
                     </tbody>
                  </table>
               </div>
            </div>
         </div>

         {/* STRIPE GATEWAY WIDGET (Right) */}
         <div className="xl:col-span-4 space-y-8">
            <div className="ds-card p-8 bg-slate-900 text-white overflow-hidden relative group border-none shadow-2xl shadow-indigo-900/20">
               <div className="absolute top-0 right-0 p-6 transform rotate-12 opacity-5 scale-125 group-hover:scale-110 transition-transform">
                  <CreditCard size={120} />
               </div>
               <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-[24px] bg-indigo-600 flex items-center justify-center mb-6 shadow-xl shadow-indigo-900/40 border border-white/10 group-hover:scale-110 transition-transform">
                     <Zap size={28} className="fill-white" />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-2">Pasarela Stripe Live</h3>
                  <div className="text-3xl font-black text-white mb-2 leading-none">40.900,00 €</div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-8">Ingresos Pendientes Auditados</p>
                  
                  <div className="w-full space-y-4 mb-4">
                     <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                           <span className="text-[10px] font-bold text-slate-200">Webhook Stripe</span>
                        </div>
                        <span className="text-[9px] font-black uppercase text-emerald-400">Enlazado</span>
                     </div>
                  </div>
                  <button className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center gap-2">
                     <Zap size={14} className="fill-slate-900" />
                     Sincronizar Pasarela
                  </button>
               </div>
            </div>

            <div className="ds-card p-8 bg-emerald-50/30 border-2 border-dashed border-emerald-100 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-emerald-50 transition-all">
               <div className="w-14 h-14 rounded-[28px] bg-emerald-600 flex items-center justify-center text-white mb-6 group-hover:scale-110 shadow-lg shadow-emerald-900/10 transition-transform">
                  <TrendingUp size={24} />
               </div>
               <h4 className="text-sm font-bold text-slate-900 mb-2">Previsión de Cobros</h4>
               <p className="text-[10px] text-slate-400 font-medium leading-relaxed max-w-[200px]">Estimamos un cierre de <span className="text-emerald-600 font-black">15.000 €</span> adicionales en los próximos 10 días basado en el pipeline actual.</p>
            </div>
         </div>
      </div>

      <AddQuoteModal 
        isOpen={isAddQuoteOpen}
        onClose={() => setIsAddQuoteOpen(false)}
        onAdd={handleAddQuote}
      />

      <CheckoutSimulation 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        quote={selectedQuote}
      />
    </div>
  );
}
