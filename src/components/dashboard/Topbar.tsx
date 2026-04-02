'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  HelpCircle, 
  ChevronDown, 
  Command, 
  User, 
  LogOut, 
  Settings2, 
  Menu, 
  Plus,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CommandPalette from './CommandPalette';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

interface TopbarProps {
  onMenuClick?: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('ES');
  const pathname = usePathname();

  // Get current page title translation
  const pageTitle = pathname.split('/').pop() || 'Resumen';
  const displayTitle = pageTitle === 'leads' ? 'Embudo CRM' : 
                       pageTitle === 'automations' ? 'Automatización' :
                       pageTitle === 'ai-tools' ? 'Herramientas IA' : 
                       pageTitle === 'dashboard' ? 'Panel Control' : 'General';

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-[100] shadow-sm shadow-slate-200/20">
      {/* Mobile Menu Button */}
      <button 
        onClick={onMenuClick}
        className="lg:hidden p-2 -ml-2 mr-2 text-slate-500 hover:text-indigo-600 border border-slate-100 rounded-lg hover:bg-slate-50 transition-all"
      >
        <Menu size={20} />
      </button>

      {/* SEARCH AND NAVIGATION */}
      <div className="flex items-center gap-4 lg:gap-10 flex-1 min-w-0">
        <div className="hidden xl:flex flex-col">
           <h1 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2 text-nowrap">
              {displayTitle}
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest pl-2 border-l border-slate-100">Control Zyndrix</span>
           </h1>
        </div>

        <button 
          onClick={() => setIsCommandOpen(true)}
          className="flex items-center gap-2 lg:gap-4 bg-slate-50 border border-slate-100 rounded-lg px-3 lg:px-4 py-2 hover:bg-slate-100 transition-all max-w-[40px] sm:max-w-sm w-full group cursor-text overflow-hidden"
        >
          <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors flex-shrink-0" />
          <span className="hidden sm:block text-[11px] font-bold text-slate-400 flex-1 text-left group-hover:text-slate-600 truncate">Búsqueda rápida...</span>
          <div className="hidden lg:flex items-center gap-1.5 px-1.5 py-1 bg-white rounded border border-slate-100 text-[9px] font-bold text-slate-400 group-hover:text-indigo-600 transition-all uppercase tracking-widest">
            <Command size={10} /> K
          </div>
        </button>
      </div>

      {/* ACTIONS AND PROFILE */}
      <div className="flex items-center gap-4">
        {/* Language Switcher */}
        <button 
          onClick={() => setCurrentLang(currentLang === 'ES' ? 'EN' : 'ES')}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-md text-[10px] font-black text-slate-600 hover:bg-white hover:text-indigo-600 transition-all uppercase tracking-widest group"
        >
           <Globe size={14} className="text-indigo-500 group-hover:rotate-12 transition-transform" />
           <span>{currentLang}</span>
        </button>

        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-md text-[10px] font-bold text-indigo-600 cursor-pointer hover:bg-indigo-100 transition-all shadow-sm shadow-indigo-100/50 group active:scale-95">
           <Plus size={14} className="group-hover:rotate-90 transition-transform" />
           <span>Añadir al Panel</span>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 border-x border-slate-100 px-2 sm:px-4 mx-1 sm:mx-2 h-8">
           <button 
             onClick={() => setIsNotifOpen(!isNotifOpen)}
             className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-indigo-600 transition-all relative group"
           >
             <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
             <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white shadow-lg shadow-rose-500/30" />
           </button>
           
           <button className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-indigo-600 transition-all group">
             <HelpCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
           </button>
        </div>

        <div className="relative group">
           <button 
             onClick={() => setIsProfileOpen(!isProfileOpen)}
             className="flex items-center gap-3 py-1 px-1 rounded-full hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
           >
              <div className="w-9 h-9 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center p-0.5 group">
                 <img src="https://i.pravatar.cc/100?u=zyndrix_main_admin" alt="Zyndrix Admin" className="w-full h-full rounded-full object-cover transition-transform group-hover:scale-110" />
              </div>
              <ChevronDown className={cn("w-4 h-4 text-slate-300 transition-transform", isProfileOpen && "rotate-180")} />
           </button>

           <AnimatePresence>
             {isProfileOpen && (
               <motion.div 
                 initial={{ opacity: 0, y: 10, scale: 0.95 }}
                 animate={{ opacity: 1, y: 0, scale: 1 }}
                 exit={{ opacity: 0, y: 10, scale: 0.95 }}
                 className="absolute top-full right-0 mt-4 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 p-2 z-[200] overflow-hidden"
               >
                  <div className="p-3 border-b border-slate-50 mb-2">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Identificado como</p>
                     <p className="text-xs font-bold text-slate-900 truncate">admin@zyndrix.ai</p>
                  </div>
                  <div className="flex flex-col gap-1">
                     <button className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-indigo-600 transition-all">
                        <User size={16} /> <span className="text-xs font-bold">Perfil Cliente</span>
                     </button>
                     <button className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-indigo-600 transition-all">
                        <Settings2 size={16} /> <span className="text-xs font-bold">Preferencias</span>
                     </button>
                     <div className="h-px bg-slate-50 my-1" />
                     <button className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-rose-50 text-rose-600 transition-all">
                        <LogOut size={16} /> <span className="text-xs font-bold">Cerrar Sesión</span>
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
