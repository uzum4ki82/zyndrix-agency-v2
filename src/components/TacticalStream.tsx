"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Info, CheckCircle, AlertCircle, Bot, Zap, Search, Target, Mail, Activity, Terminal } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { MissionLog } from "@/types";
import Image from "next/image";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TacticalStreamProps {
  logs: MissionLog[];
}

export function TacticalStream({ logs }: TacticalStreamProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
       containerRef.current.scrollTo({
          top: containerRef.current.scrollHeight,
          behavior: "smooth"
       });
    }
  }, [logs]);

  return (
    <div 
      ref={containerRef}
      className="space-y-6 h-full overflow-y-auto pr-4 px-6 py-10 custom-scrollbar relative"
    >
      {/* Background Architectural Grid (Subtle) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#1e293b 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />

      {logs.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center opacity-20 text-indigo-900 gap-4">
           <Activity size={40} className="animate-pulse" />
           <p className="text-[10px] font-black uppercase tracking-[0.4em]">Sistemas en Espera Operacional</p>
        </div>
      ) : logs.map((log, i) => (
        <motion.div
          key={log.id || i}
          initial={{ opacity: 0, x: -10, y: 10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          className={cn(
            "p-6 rounded-[2rem] border relative transition-all duration-500",
            log.type === 'ai' 
              ? "bg-indigo-600 text-white border-indigo-500 shadow-xl shadow-indigo-100" 
              : "bg-white text-slate-900 border-slate-100 shadow-sm"
          )}
        >
          <div className="flex items-start gap-4">
            <div className={cn(
              "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
              log.type === 'ai' ? "bg-white/20 text-white" : "bg-slate-50 text-slate-400"
            )}>
              {log.type === 'ai' ? <Bot size={20} /> : <Terminal size={18} />}
            </div>
            
            <div className="flex-1 space-y-3">
              <div className="flex justify-between items-center opacity-60">
                 <span className="text-[8px] font-black uppercase tracking-widest">
                   {log.type === 'ai' ? 'Unidad de Inteligencia Zyndrix' : 
                    log.type === 'success' ? 'Protocolo Confirmado' : 
                    log.type === 'error' ? 'Alerta de Sistema' : 'Sincronización de Datos'}
                 </span>
                 <span className="text-[8px] font-bold">
                   {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                 </span>
              </div>
              
              <p className={cn(
                 "text-sm leading-relaxed font-medium",
                 log.type === 'ai' ? "text-indigo-50" : "text-slate-600"
              )}>
                {log.text}
              </p>

              {log.meta && (
                <div className={cn(
                  "mt-3 p-4 rounded-xl font-mono text-[10px] bg-black/5 overflow-hidden",
                  log.type === 'ai' ? "bg-white/10 text-white" : "border border-slate-50 text-slate-400"
                )}>
                   <div className="flex items-center gap-2 mb-2 opacity-50">
                     <Zap size={10} /> 
                     <span className="uppercase tracking-tighter">Raw Intelligence Feed</span>
                   </div>
                   <pre className="whitespace-pre-wrap break-all opacity-80">
                     {log.meta}
                   </pre>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
