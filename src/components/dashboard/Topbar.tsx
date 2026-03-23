'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  HelpCircle, 
  ChevronDown, 
  Command, 
  Circle,
  Activity,
  User,
  LogOut,
  Settings2,
  Lock,
  MessageSquare,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CommandPalette from './CommandPalette';

export default function Topbar() {
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  return (
    <header className="dashboard-header">
      <div className="flex items-center gap-6 flex-1">
        <button 
          onClick={() => setIsCommandOpen(true)}
          className="flex items-center gap-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl px-4 py-2 hover:bg-white/[0.06] transition-all max-w-md w-full group overflow-hidden relative cursor-text"
        >
          <Search className="w-4 h-4 text-slate-500 group-hover:text-blue-500 group-hover:scale-110 transition-all" />
          <span className="text-sm font-medium text-slate-500 flex-1 text-left group-hover:text-slate-300">Buscar leads, automatizaciones...</span>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-white/[0.05] rounded border border-white/[0.08] text-[10px] font-bold text-slate-600 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-all uppercase tracking-widest">
            <Command size={10} /> K
          </div>
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-500 group relative">
          <Circle size={8} fill="currentColor" className="animate-pulse shadow-sm shadow-emerald-500/50" />
          <span className="text-[10px] font-black uppercase tracking-widest group-hover:tracking-tighter transition-all">n8n Operational</span>
        </div>

        <div className="flex items-center gap-1.5 border-x border-white/[0.08] px-4 mx-1 h-8">
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2.5 rounded-xl hover:bg-white/[0.05] text-slate-500 hover:text-white transition-all relative group"
          >
            <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-slate-950 shadow-lg shadow-blue-500/30" />
            
            <AnimatePresence>
              {isNotifOpen && (
                 <motion.div 
                   initial={{ opacity: 0, y: 10, scale: 0.95 }}
                   animate={{ opacity: 1, y: 0, scale: 1 }}
                   exit={{ opacity: 0, y: 10, scale: 0.95 }}
                   className="absolute top-full right-0 mt-4 w-80 bg-[#121215] border border-white/[0.08] rounded-2xl shadow-2xl p-4 z-[200] overflow-hidden"
                 >
                    <div className="flex items-center justify-between mb-4 border-b border-white/[0.05] pb-3 px-1">
                       <span className="text-xs font-black uppercase tracking-widest text-white">Notificaciones</span>
                       <span className="text-[10px] bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full font-bold">1 Nueva</span>
                    </div>
                    <div className="flex flex-col gap-1">
                       <div className="p-3 rounded-xl hover:bg-white/[0.03] transition-all group flex gap-3 items-start border border-transparent hover:border-white/5">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0 animate-pulse"><Zap size={14} /></div>
                          <div className="flex flex-col text-left">
                             <span className="text-sm font-bold text-slate-200 uppercase font-mono tracking-tighter">Workflow Completed</span>
                             <p className="text-[10px] text-slate-500 leading-tight">Lead Scoring para 'María López' se ejecutó con éxito hace 2m.</p>
                          </div>
                       </div>
                    </div>
                 </motion.div>
              )}
            </AnimatePresence>
          </button>
          
          <button className="p-2.5 rounded-xl hover:bg-white/[0.05] text-slate-500 hover:text-white transition-all group">
            <HelpCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        <div className="relative group">
           <button 
             onClick={() => setIsProfileOpen(!isProfileOpen)}
             className="flex items-center gap-3 pl-2 pr-1.5 py-1.5 rounded-2xl hover:bg-white/[0.05] transition-all border border-transparent hover:border-white/[0.08]"
           >
              <div className="text-right hidden sm:flex flex-col">
                <span className="text-[11px] font-black text-white uppercase tracking-widest">Zyndrix Control</span>
                <span className="text-[9px] font-bold text-blue-500 uppercase tracking-tighter text-right">Admin Console</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center border-2 border-white/[0.05] shadow-lg shadow-blue-500/10 relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <User className="w-6 h-6 text-white relative z-10" />
              </div>
              <ChevronDown className={cn("w-4 h-4 text-slate-600 transition-transform", isProfileOpen && "rotate-180")} />
           </button>

           <AnimatePresence>
             {isProfileOpen && (
               <motion.div 
                 initial={{ opacity: 0, y: 10, scale: 0.95 }}
                 animate={{ opacity: 1, y: 0, scale: 1 }}
                 exit={{ opacity: 0, y: 10, scale: 0.95 }}
                 className="absolute top-full right-0 mt-4 w-56 bg-[#121215] border border-white/[0.08] rounded-2xl shadow-2xl p-2 z-[200] overflow-hidden"
               >
                  <div className="p-2 flex flex-col gap-1">
                     <button className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.05] text-slate-400 hover:text-white transition-all">
                        <User size={16} /> <span className="text-xs font-bold uppercase font-mono tracking-tighter">Mi Perfil</span>
                     </button>
                     <button className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.05] text-slate-400 hover:text-white transition-all">
                        <Lock size={16} /> <span className="text-xs font-bold uppercase font-mono tracking-tighter">Seguridad</span>
                     </button>
                     <div className="h-px bg-white/[0.05] my-1" />
                     <button className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-rose-500/10 text-rose-500 transition-all">
                        <LogOut size={16} /> <span className="text-xs font-bold uppercase font-mono tracking-tighter">Cerrar Sesión</span>
                     </button>
                  </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>

      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
    </header>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
