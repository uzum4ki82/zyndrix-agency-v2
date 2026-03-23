'use client';

import React from 'react';
import { 
  Users, 
  Zap, 
  Brain, 
  Activity, 
  ArrowUpRight, 
  Mail, 
  CheckCircle2, 
  Clock, 
  MoreHorizontal,
  ChevronRight,
  Sparkles,
  BarChart3,
  Bot
} from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import { motion } from 'framer-motion';

export default function DashboardOverview() {
  return (
    <div className="flex flex-col gap-8 opacity-0 translate-y-4 animate-in fill-mode-forwards duration-700 ease-out-quint delay-0">
      <header className="flex items-center justify-between pb-2">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            Mission <span className="text-blue-500">Control</span> <BarChart3 className="w-6 h-6 text-slate-500" />
          </h1>
          <p className="text-slate-400 font-medium text-sm">Resumen operativo de la agencia IA y gestión de leads.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="ds-button ghost">
            <span>Exportar Data</span>
          </button>
          <button className="ds-button primary">
            <Zap className="w-4 h-4" />
            <span>Configurar Workflow</span>
          </button>
        </div>
      </header>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Leads" 
          value="1,248" 
          trend="+12%" 
          trendType="up" 
          icon={Users}
          color="blue"
          subValue="24 nuevos esta semana"
        />
        <StatCard 
          label="Conversion Rate" 
          value="42.3%" 
          trend="+3.2%" 
          trendType="up" 
          icon={Activity}
          color="emerald"
          subValue="Optimizado por IA"
        />
        <StatCard 
          label="AI Automations" 
          value="14" 
          trend="UPTIME" 
          trendType="up" 
          icon={Zap}
          color="purple"
          subValue="100% success rate"
        />
        <StatCard 
          label="Estimated Revenue" 
          value="$12.4k" 
          trend="-2%" 
          trendType="down" 
          icon={BarChart3}
          color="amber"
          subValue="Proyección mensual"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEADS TABLE */}
        <div className="lg:col-span-2 ds-card flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
             <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-500" />
                <h3 className="font-bold text-lg tracking-tight">Leads en Tiempo Real</h3>
             </div>
             <button className="text-xs font-bold text-blue-500 hover:underline uppercase tracking-widest flex items-center gap-1">
                Ver todos <ChevronRight className="w-3 h-3" />
             </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="pro-table">
              <thead>
                <tr>
                  <th>Nombre / Empresa</th>
                  <th>Estado</th>
                  <th>Score IA</th>
                  <th>Fecha</th>
                  <th className="text-right">Acción</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'María López', company: 'Global Tech SA', status: 'HOT', score: 9.4, date: 'Hoy, 14:20', color: 'bg-rose-500/10 text-rose-500' },
                  { name: 'Enrique Castro', company: 'Castro Logistics', status: 'WARM', score: 6.8, date: 'Ayer, 09:12', color: 'bg-amber-500/10 text-amber-500' },
                  { name: 'Jimena Fuentes', company: 'Creative Lab', status: 'COLD', score: 3.2, date: 'Marzo 21', color: 'bg-slate-500/10 text-slate-500' },
                  { name: 'Carlos Ruiz', company: 'Next Real Estate', status: 'HOT', score: 9.1, date: 'Marzo 20', color: 'bg-rose-500/10 text-rose-500' },
                ].map((lead, i) => (
                  <tr key={i}>
                    <td>
                      <div className="flex flex-col">
                        <span className="font-bold text-white leading-none mb-0.5">{lead.name}</span>
                        <span className="text-[11px] font-medium text-slate-500">{lead.company}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${lead.color} border border-white/[0.04]`}>{lead.status}</span>
                    </td>
                    <td>
                       <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                             <div className="h-full bg-blue-500" style={{ width: `${lead.score * 10}%` }} />
                          </div>
                          <span className="text-xs font-mono font-bold text-slate-300">{lead.score}</span>
                       </div>
                    </td>
                    <td>
                      <span className="text-xs text-slate-500">{lead.date}</span>
                    </td>
                    <td className="text-right">
                       <button className="p-1.5 rounded-lg hover:bg-white/[0.05] text-slate-500 transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FEED / ACTIVITY */}
        <div className="flex flex-col gap-6">
           <div className="ds-card flex flex-col gap-4">
              <div className="flex items-center gap-3 mb-2">
                 <Zap className="w-5 h-5 text-purple-500" />
                 <h3 className="font-bold text-lg tracking-tight">Actividad de n8n</h3>
              </div>
              <div className="flex flex-col gap-4">
                 {[
                   { type: 'EXECUTION', msg: 'Lead Scoring completado', time: 'hace 2m', status: 'success' },
                   { type: 'EMAIL', msg: 'Prompt generado: Maria L.', time: 'hace 14m', status: 'processing' },
                   { type: 'SYSTEM', msg: 'Webhook recibiendo data', time: 'hace 1h', status: 'success' },
                 ].map((item, i) => (
                   <div key={i} className="flex gap-4 p-3 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03] transition-colors cursor-pointer group">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center border border-white/[0.1] ${item.status === 'success' ? 'bg-emerald-500/5 text-emerald-500' : 'bg-blue-500/5 text-blue-500 animate-pulse'}`}>
                         {item.type === 'EXECUTION' ? <Zap className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                      </div>
                      <div className="flex flex-col flex-1">
                         <div className="flex justify-between items-center">
                            <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">{item.type}</span>
                            <span className="text-[10px] font-medium text-slate-600">{item.time}</span>
                         </div>
                         <p className="text-sm font-semibold text-slate-200 leading-tight mt-0.5">{item.msg}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="ds-card bg-gradient-to-br from-blue-600/20 via-transparent to-transparent border-blue-500/20 overflow-hidden relative group cursor-pointer hover:border-blue-500/40">
              <Sparkles className="absolute -top-4 -right-4 w-24 h-24 text-blue-500 opacity-[0.03] group-hover:opacity-[0.08] group-hover:rotate-12 transition-all duration-700" />
              <div className="flex flex-col gap-4 relative z-10">
                 <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-blue-500" />
                 </div>
                 <div className="flex flex-col">
                    <h4 className="font-bold text-white text-lg tracking-tight">AI Insights</h4>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">Detectamos un patrón inusual: El 80% de tus leads HOT provienen de LinkedIn Ads hoy.</p>
                 </div>
                 <button className="ds-button primary w-full justify-center mt-2 group-hover:shadow-blue-500/40">
                    Ver Informe IA
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
