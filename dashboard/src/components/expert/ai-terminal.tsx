'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Zap, Search, Send, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

type LogEntry = {
  id: string;
  type: 'system' | 'ai' | 'success' | 'warning';
  message: string;
  time: string;
};

export function AITerminal({ externalLog }: { externalLog?: LogEntry | null }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const initialLogs: LogEntry[] = [
    { id: '1', type: 'system', message: 'ZYNDRIX-OS v3.0 iniciado correctamente.', time: new Date().toLocaleTimeString('es-ES', { hour12: false }) },
    { id: '2', type: 'system', message: 'Monitor de orquestación en escucha activa...', time: new Date().toLocaleTimeString('es-ES', { hour12: false }) },
  ];

  const randomMessages = [
    { type: 'system', message: 'Sincronizando base de datos Supabase...' },
    { type: 'system', message: 'Verificando estado de agentes autónomos...' },
    { type: 'system', message: 'Monitor de red: Conectado a n8n Cloud.' },
    { type: 'system', message: 'Pipeline en modo STANDBY.' },
  ];

  useEffect(() => {
    if (externalLog) {
      setLogs(prev => [...prev.slice(-24), externalLog]);
    }
  }, [externalLog]);

  useEffect(() => {
    setLogs(initialLogs);
    
    const interval = setInterval(() => {
      const msgTemplate = randomMessages[Math.floor(Math.random() * randomMessages.length)];
      const newLog: LogEntry = {
        id: Math.random().toString(36).substr(2, 9),
        type: msgTemplate.type as any,
        message: msgTemplate.message,
        time: new Date().toLocaleTimeString('es-ES', { hour12: false }),
      };
      
      setLogs(prev => [...prev.slice(-19), newLog]);
    }, 6000); // Slower simulation to leave room for real events

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const icons = {
    system: <Zap size={12} className="text-slate-500" />,
    ai: <Sparkles size={12} className="text-cyan-400" />,
    success: <CheckCircle2 size={12} className="text-emerald-400" />,
    warning: <Loader2 size={12} className="text-amber-400 animate-spin" />,
  };

  const colors = {
    system: 'text-slate-500',
    ai: 'text-cyan-400',
    success: 'text-emerald-400',
    warning: 'text-amber-400',
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-950/40 border border-slate-800/60 backdrop-blur-xl h-full flex flex-col font-mono">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800/40 pb-4">
        <div className="flex items-center gap-2">
          <Terminal size={16} className="text-cyan-400" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Live IA Orquestación</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
          <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2"
      >
        <AnimatePresence mode="popLayout">
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-3"
            >
              <span className="text-[10px] text-slate-700 whitespace-nowrap pt-0.5">[{log.time}]</span>
              <div className="pt-0.5">{icons[log.type]}</div>
              <p className={`text-[11px] leading-relaxed ${colors[log.type]} font-medium uppercase tracking-tight`}>
                {log.message}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-800/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)] animate-pulse" />
          <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest">Sistema Operativo</span>
        </div>
        <span className="text-[9px] font-bold text-slate-600 uppercase">ZYNDRIX-OS v3.0.0</span>
      </div>
    </div>
  );
}
