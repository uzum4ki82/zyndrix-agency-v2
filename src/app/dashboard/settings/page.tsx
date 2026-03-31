'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Shield, 
  Zap, 
  Globe, 
  Mail, 
  Database, 
  Lock, 
  ChevronRight, 
  Save, 
  Bell, 
  Monitor, 
  Laptop, 
  Palette,
  CreditCard,
  Key,
  ShieldCheck,
  Activity,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const [activeSegment, setActiveSegment] = useState('agencia');

  const settingsSegments = [
    { id: 'perfil', label: 'Mi Perfil', icon: User },
    { id: 'agencia', label: 'Agencia & Marca', icon: Globe },
    { id: 'ia', label: 'Configuración AI', icon: Zap },
    { id: 'facturacion', label: 'Facturación y Pagos', icon: CreditCard },
    { id: 'avanzado', label: 'Avanzado', icon: Database },
  ];

  return (
    <div className="animate-in space-y-8">
      {/* PAGE HEADER */}
      <div className="flex items-center justify-between mb-2">
         <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Configuración del Sistema</h1>
            <div className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest border border-slate-200">Panel Central</div>
         </div>
         <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-xl text-[11px] font-bold shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 group">
            <Save size={14} className="group-hover:scale-110 transition-transform" />
            <span>Guardar Cambios</span>
         </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
         {/* Navigation Sidebar (Left) */}
         <div className="xl:col-span-3 space-y-2">
            {settingsSegments.map((seg) => (
               <button 
                  key={seg.id}
                  onClick={() => setActiveSegment(seg.id)}
                  className={cn(
                     "w-full flex items-center justify-between p-4 rounded-xl transition-all group",
                     activeSegment === seg.id ? "bg-white shadow-xl shadow-slate-200/50 border border-slate-100 text-slate-900" : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                  )}
               >
                  <div className="flex items-center gap-3">
                     <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                        activeSegment === seg.id ? "bg-indigo-50 text-indigo-600" : "bg-slate-50 text-slate-300"
                     )}>
                        <seg.icon size={18} />
                     </div>
                     <span className="text-xs font-bold">{seg.label}</span>
                  </div>
                  <ChevronRight size={14} className={cn(activeSegment === seg.id ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 transition-all")} />
               </button>
            ))}
         </div>

         {/* Main Settings Content (Right) */}
         <div className="xl:col-span-9 space-y-8 min-h-[600px]">
            <AnimatePresence mode="wait">
               {activeSegment === 'agencia' && (
                  <motion.div 
                     key="agencia"
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="space-y-8"
                  >
                     <div className="ds-card p-8 bg-white border-slate-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 transform rotate-12 opacity-5 translate-x-12 -translate-y-12 transition-transform">
                           <Globe size={160} />
                        </div>
                        <h3 className="text-sm font-black text-slate-900 mb-8 border-b border-slate-50 pb-4 uppercase tracking-widest flex items-center gap-3">
                           <Palette size={18} className="text-indigo-600" />
                           Marca e Identidad Visual
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Nombre Agencia</label>
                              <input defaultValue="Zyndrix Intelligence AI" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-900 outline-none focus:border-indigo-500 transition-all font-display" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Dominio Principal</label>
                              <input defaultValue="zyndrix.ai" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-900 outline-none focus:border-indigo-500 transition-all font-display" />
                           </div>
                        </div>
                     </div>
                  </motion.div>
               )}

               {activeSegment === 'facturacion' && (
                  <motion.div 
                     key="facturacion"
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="space-y-8"
                  >
                     <div className="ds-card p-8 bg-slate-900 text-white relative overflow-hidden group border-none shadow-2xl shadow-indigo-900/20">
                        <div className="absolute top-0 right-0 p-10 transform rotate-12 opacity-10 transition-transform">
                           <CreditCard size={180} />
                        </div>
                        <h3 className="text-sm font-black mb-8 border-b border-white/5 pb-4 uppercase tracking-widest flex items-center gap-3 text-indigo-400">
                           <Zap size={18} />
                           Configuración de Pasarela (Stripe)
                        </h3>
                        <div className="space-y-8">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                                    <Key size={12} className="text-indigo-400" />
                                    Stripe Publishable Key
                                 </label>
                                 <input placeholder="pk_live_..." className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold text-white outline-none focus:border-indigo-500 transition-all" />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                                    <Lock size={12} className="text-indigo-400" />
                                    Stripe Secret Key
                                 </label>
                                 <input type="password" placeholder="sk_live_..." className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold text-white outline-none focus:border-indigo-500 transition-all" />
                              </div>
                           </div>
                           <div className="p-6 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                                    <ShieldCheck size={20} />
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="text-xs font-bold">Estado de la Conexión</span>
                                    <span className="text-[10px] text-slate-400 uppercase font-black">Simulado / Pendiente de Claves</span>
                                 </div>
                              </div>
                              <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                 <span className="text-[9px] font-black uppercase text-emerald-400">Sandbox Ready</span>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="ds-card p-8 bg-white border-slate-100">
                        <h3 className="text-sm font-black text-slate-900 mb-8 border-b border-slate-50 pb-4 uppercase tracking-widest flex items-center gap-3">
                           <DollarSign size={18} className="text-emerald-600" />
                           Impuestos y Moneda Operativa
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Moneda del Sistema</label>
                              <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-900 outline-none focus:border-indigo-500 transition-all">
                                 <option>Euro (€) - EUR</option>
                                 <option>Dólar ($) - USD</option>
                              </select>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">IVA / Tax (%)</label>
                              <input defaultValue="21" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-900 outline-none focus:border-indigo-500 transition-all" />
                           </div>
                        </div>
                     </div>
                  </motion.div>
               )}
               
               {activeSegment === 'perfil' && (
                  <motion.div key="perfil" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="ds-card p-12 bg-white flex flex-col items-center justify-center text-center">
                     <div className="w-24 h-24 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center border-4 border-white shadow-2xl mb-6 font-black text-3xl">AD</div>
                     <h3 className="text-xl font-bold text-slate-900 mb-1">Zyndrix Admin</h3>
                     <p className="text-sm text-slate-400 mb-8">Gestión de cuenta maestra de la plataforma.</p>
                     <button className="bg-slate-50 border border-slate-200 text-slate-600 px-8 py-3 rounded-2xl text-xs font-bold hover:bg-white hover:shadow-lg transition-all">Editar Información Privada</button>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
}
