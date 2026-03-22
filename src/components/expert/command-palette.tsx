'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, LayoutDashboard, Users, Send, BarChart3, Settings, Zap, MessageSquare, ShieldCheck, ArrowRight, Globe, Wind } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const items = [
    { icon: Globe, label: 'Ir a Sitio Web', href: '/', shortcut: 'WEB' },
    { icon: Wind, label: 'Ir a n8n', href: 'https://omontesquesada.app.n8n.cloud/', shortcut: 'N8N', external: true },
  ];

  const filteredItems = items.filter(item => 
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  const navigate = (item: typeof items[0]) => {
    if (item.external) {
      window.open(item.href, '_blank');
    } else {
      router.push(item.href);
    }
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-[#020617]/90 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -20 }}
            className="relative w-full max-w-2xl bg-slate-900/40 border border-slate-700/50 rounded-[2rem] shadow-2xl shadow-cyan-500/10 overflow-hidden backdrop-blur-2xl"
          >
            <div className="p-6 border-b border-slate-700/30 flex items-center gap-4 bg-slate-800/20">
              <Search className="text-cyan-400" size={20} />
              <input
                autoFocus
                placeholder="Escribe un comando o busca..."
                className="bg-transparent border-none outline-none text-white text-lg w-full placeholder:text-slate-500"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-800 rounded-lg border border-slate-700">
                <span className="text-[10px] font-bold text-slate-400">ESC</span>
              </div>
            </div>
            
            <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
              <div className="grid grid-cols-1 gap-1">
                {filteredItems.map((item, idx) => (
                  <button
                    key={item.label}
                    onClick={() => navigate(item)}
                    className="flex items-center justify-between p-4 rounded-2xl hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 rounded-xl bg-slate-800 group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-colors">
                        <item.icon size={18} />
                      </div>
                      <span className="text-sm font-bold text-slate-300 group-hover:text-white uppercase tracking-tight">
                        {item.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase py-1 px-2 bg-slate-800 rounded-md">
                        {item.shortcut}
                      </span>
                      <ArrowRight size={14} className="text-slate-600 group-hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                    </div>
                  </button>
                ))}
              </div>
              
              {filteredItems.length === 0 && (
                <div className="py-20 text-center space-y-4">
                  <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto">
                    <Command className="text-slate-600" size={32} />
                  </div>
                  <p className="text-slate-500 font-medium">No se encontraron resultados para "{query}"</p>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-slate-700/30 flex items-center gap-6 justify-center bg-slate-800/20">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <div className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">↑↓</div>
                <span>Navegar</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <div className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">ENTER</div>
                <span>Seleccionar</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
