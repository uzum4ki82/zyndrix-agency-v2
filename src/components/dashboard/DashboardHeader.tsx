import React from 'react';
import { Menu, Bell, Shield, Search } from 'lucide-react';

export const DashboardHeader = ({ onOpenSidebar, activeTitle }: { onOpenSidebar: () => void, activeTitle: string }) => {
  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-40">
       <div className="flex items-center gap-6">
          <button className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-all" onClick={onOpenSidebar}>
            <Menu size={20} />
          </button>
          <div className="hidden lg:block">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Control Central</p>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 capitalize">
              {activeTitle}
            </h1>
          </div>
       </div>

       <div className="flex-1 max-w-md mx-10 hidden md:block">
         <div className="relative group">
           <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
           <input 
             type="text" 
             placeholder="Buscar inteligencia técnica..." 
             className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-4 text-sm outline-none focus:border-indigo-500/50 focus:bg-white transition-all"
           />
         </div>
       </div>
       
       <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-3 px-4 py-1.5 bg-slate-50 text-slate-600 rounded-lg border border-slate-200 group cursor-default">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-bold uppercase tracking-wider group-hover:text-slate-900 transition-colors">Sistema Verificado</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-all">
               <Bell size={18} />
               <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-600 rounded-full border-2 border-white" />
            </button>
            <div className="h-9 w-9 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-lg ring-1 ring-slate-800">
              <Shield size={16} />
            </div>
          </div>
       </div>
    </header>
  );
};
