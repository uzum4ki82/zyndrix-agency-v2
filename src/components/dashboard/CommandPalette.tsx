'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Terminal, 
  Zap, 
  Users, 
  Settings, 
  Command,
  X,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function CommandPalette({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        isOpen ? onClose() : onClose(); // This is handled by parent but I keep logic clear
      }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleDown);
    return () => window.removeEventListener('keydown', handleDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    { name: 'Ir a Dashboard', icon: Terminal, href: '/dashboard' },
    { name: 'Ver Leads CRM', icon: Users, href: '/dashboard/leads' },
    { name: 'Automatizaciones', icon: Zap, href: '/dashboard/automations' },
    { name: 'AI Core Generator', icon: Sparkles, href: '/dashboard/ai-tools' },
    { name: 'Configuración', icon: Settings, href: '/dashboard/settings' },
  ].filter(a => a.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-md flex items-start justify-center pt-[15vh] p-4"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: -20 }}
          className="w-full max-w-xl bg-[#09090b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 p-4 border-b border-white/5">
            <Search className="w-5 h-5 text-slate-500" />
            <input 
              autoFocus
              className="flex-1 bg-transparent border-none outline-none text-slate-200 placeholder:text-slate-600 font-medium"
              placeholder="Escribe un comando o busca algo..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded border border-white/10 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
               Esc
            </div>
          </div>

          <div className="p-2 flex flex-col gap-1 max-h-[400px] overflow-y-auto">
            {actions.length > 0 ? actions.map((action, i) => (
              <button 
                key={i}
                onClick={() => { router.push(action.href); onClose(); }}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-blue-400 border border-white/5">
                    <action.icon size={16} />
                  </div>
                  <span className="text-sm font-bold text-slate-400 group-hover:text-white">{action.name}</span>
                </div>
                <ArrowRight size={14} className="text-slate-700 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
              </button>
            )) : (
              <div className="p-8 text-center text-slate-600 text-sm font-medium">
                 No se han encontrado resultados para "{query}"
              </div>
            )}
          </div>

          <div className="p-3 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
                   <Command size={10} /> + K para cerrar
                </div>
             </div>
             <span className="text-[10px] font-black text-blue-500/50 uppercase tracking-widest">Zyndrix Neural Search</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
