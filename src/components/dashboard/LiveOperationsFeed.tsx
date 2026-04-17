"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Terminal, Activity, Zap, ShieldAlert, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'ai' | 'error' | 'warning';
}

export const LiveOperationsFeed: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Simulamos la escucha del daemon.log o eventos reales de Supabase Realtime en el futuro
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/system/logs');
        if (res.ok) {
          const data = await res.json();
          setLogs(data);
        }
      } catch (err) {
        console.error('Failed to fetch system logs');
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getTypeStyle = (type: LogEntry['type']) => {
    switch (type) {
      case 'success': return 'text-emerald-400';
      case 'ai': return 'text-indigo-400';
      case 'error': return 'text-rose-400';
      case 'warning': return 'text-amber-400';
      default: return 'text-slate-400';
    }
  };

  const getTypeIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'success': return <CheckCircle2 size={12} />;
      case 'ai': return <Zap size={12} />;
      case 'error': return <ShieldAlert size={12} />;
      case 'warning': return <Activity size={12} />;
      default: return <ChevronRight size={12} />;
    }
  };

  return (
    <div className="bg-[#0F172A] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl h-[400px] flex flex-col">
      <div className="bg-slate-900/50 px-6 py-4 border-bottom border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <Terminal size={16} className="text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Centro de Operaciones Tácticas</h3>
            <p className="text-[10px] text-slate-500 font-medium">Logs de Actividad del Commander en Tiempo Real</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Live Engine</span>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 font-mono text-[12px] space-y-2 scrollbar-thin scrollbar-thumb-slate-800"
      >
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-4 group"
            >
              <span className="text-slate-600 shrink-0 select-none">[{log.timestamp}]</span>
              <span className={`shrink-0 mt-1 ${getTypeStyle(log.type)}`}>
                {getTypeIcon(log.type)}
              </span>
              <span className={`${log.type === 'ai' || log.type === 'success' ? 'text-slate-200' : 'text-slate-400'} leading-relaxed`}>
                {log.message}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="bg-slate-900/30 px-6 py-3 border-t border-slate-800/50 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500" />
          <span className="text-[9px] uppercase font-bold text-slate-500 tracking-tighter">AI Processing</span>
        </div>
        <div className="flex items-center gap-2 text-slate-700">|</div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[9px] uppercase font-bold text-slate-500 tracking-tighter">Sync Active</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
           <span className="text-[9px] uppercase font-bold text-slate-600 tracking-tighter">Instance: ZY-DAEMON-PROD</span>
        </div>
      </div>
    </div>
  );
};
