'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  TrendingUp, 
  Building2, 
  Target,
  ExternalLink,
  Crown,
  Activity,
  Briefcase,
  PieChart,
  ArrowUpRight,
  ShieldCheck,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import AddCustomerModal from '@/components/dashboard/AddCustomerModal';

// Sample Customers Data
const initialCustomers: any[] = [];

export default function CustomersPage() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);

  const handleAddCustomer = (newCustomer: any) => {
    setCustomers(prev => [newCustomer, ...prev]);
  };

  return (
    <div className="animate-in space-y-8 pb-10">
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
           <div className="flex items-center gap-2 text-indigo-600 mb-1">
              <ShieldCheck size={14} className="fill-indigo-600/10" />
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Cartera Global de Clientes</span>
           </div>
           <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Directorio Corporativo</h1>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3">
           <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input 
                placeholder="Buscar cliente..." 
                className="bg-white border border-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all w-full shadow-sm"
              />
           </div>
           <button 
             onClick={() => setIsAddCustomerOpen(true)}
             className="w-full sm:w-auto bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2.5 group"
           >
              <Plus size={16} className="group-hover:rotate-90 transition-transform" />
              Añadir Cliente
           </button>
        </div>
      </div>

      {/* CUSTOMER KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
            { label: 'Total Clientes', value: customers.length, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'LTV Promedio', value: '32.400 €', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Tasa Retención', value: '94%', icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Clientes VIP', value: customers.filter(c => c.ltv.split(' ')[0] > '40.000').length, icon: Crown, color: 'text-rose-600', bg: 'bg-rose-50' }
         ].map((kpi, i) => (
            <div key={i} className="ds-card p-6 bg-white hover:border-indigo-100 transition-all group">
               <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-sm", kpi.bg, kpi.color)}>
                  <kpi.icon size={20} />
               </div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none block mb-1.5">{kpi.label}</span>
               <div className="text-xl font-bold text-slate-900">{kpi.value}</div>
            </div>
         ))}
      </div>

      {/* CLIENTS TABLE */}
      <div className="ds-card p-0 bg-white overflow-hidden border-slate-100 shadow-xl shadow-slate-200/50">
         <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm italic">Base de Datos Protegida</h3>
            <div className="bg-slate-50 border border-slate-100 p-1.5 rounded-lg flex items-center gap-1">
               <button className="px-3 py-1 text-[9px] font-black uppercase text-indigo-600 bg-white rounded shadow-sm border border-slate-100">Activos</button>
               <button className="px-3 py-1 text-[9px] font-black uppercase text-slate-400">Todos</button>
            </div>
         </div>
         
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50/50">
                     <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Empresa</th>
                     <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</th>
                     <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Proyectos</th>
                     <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">LTV (Lifetime Value)</th>
                     <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Acciones</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  <AnimatePresence mode="popLayout">
                    {customers.map((customer) => (
                       <motion.tr 
                          key={customer.id} 
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="group hover:bg-slate-50/50 transition-colors"
                       >
                          <td className="p-6">
                             <div className="flex items-center gap-4">
                                <div className={cn(
                                   "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm border transition-all group-hover:scale-110",
                                   (customer as any).isSpecial ? "bg-indigo-600 text-white border-indigo-500 shadow-indigo-100" : "bg-white text-slate-400 border-slate-100"
                                )}>
                                   {customer.company[0]}
                                </div>
                                <div className="flex flex-col">
                                   <div className="flex items-center gap-2">
                                      <span className="text-xs font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{customer.company}</span>
                                      {(customer as any).isSpecial && <Crown size={12} className="text-amber-500 fill-amber-500" />}
                                   </div>
                                   <span className="text-[9px] font-black text-indigo-500/60 uppercase tracking-widest">{customer.type}</span>
                                </div>
                             </div>
                          </td>
                          <td className="p-6">
                             <div className={cn(
                                "inline-flex items-center gap-1.5 px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest",
                                customer.status === 'Activo' ? "bg-emerald-50 text-emerald-600" : 
                                customer.status === 'Pausado' ? "bg-amber-50 text-amber-600" : "bg-slate-50 text-slate-400"
                             )}>
                                <div className={cn("w-1 h-1 rounded-full", customer.status === 'Activo' ? "bg-emerald-500" : "bg-amber-500")} />
                                {customer.status}
                             </div>
                          </td>
                          <td className="p-6 text-center">
                             <span className="text-xs font-black text-slate-900 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{customer.projects}</span>
                          </td>
                          <td className="p-6">
                             <div className="flex flex-col">
                                <span className={cn(
                                   "text-[11px] font-black",
                                   (customer as any).isSpecial ? "text-indigo-600" : "text-slate-900"
                                )}>{customer.ltv}</span>
                                <div className="flex items-center gap-1 text-[8px] font-bold text-emerald-500">
                                   <ArrowUpRight size={8} />
                                   <span>+2.4% este mes</span>
                                </div>
                             </div>
                          </td>
                          <td className="p-6 text-right">
                             <div className="flex items-center justify-end gap-2">
                                <button className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><ExternalLink size={14} /></button>
                                <button className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"><MoreVertical size={14} /></button>
                             </div>
                          </td>
                       </motion.tr>
                    ))}
                  </AnimatePresence>
               </tbody>
            </table>
         </div>
      </div>

      <AddCustomerModal 
        isOpen={isAddCustomerOpen}
        onClose={() => setIsAddCustomerOpen(false)}
        onAdd={handleAddCustomer}
      />
    </div>
  );
}
