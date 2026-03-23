'use client';

import React from 'react';
import { 
  Users, 
  Zap, 
  Target, 
  ArrowUpRight, 
  TrendingUp,
  Workflow,
  Plus
} from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function DashboardOverview() {
  return (
    <div className="flex flex-col gap-8 animate-in">
      <header className="flex items-center justify-between pb-2">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            Mission <span className="text-blue-500 font-mono italic">Control</span> <TrendingUp size={20} className="text-slate-700" />
          </h1>
          <p className="text-sm font-medium text-slate-500">Resumen operativo de la agencia IA y gestión de leads.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="ds-button ghost">Exportar Data</button>
          <button className="ds-button primary shadow-lg shadow-blue-500/20">
             <Workflow className="w-4 h-4" />
             <span>Configurar Workflow</span>
          </button>
        </div>
      </header>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Leads" 
          value="0" 
          trend={0} 
          icon={Users} 
          description="Sin leads este mes"
          variant="primary"
        />
        <StatCard 
          title="Conversion Rate" 
          value="0%" 
          trend={0} 
          icon={Target} 
          description="Inicia el embudo"
          variant="success"
        />
        <StatCard 
          title="AI Automations" 
          value="0" 
          trend={0} 
          icon={Zap} 
          description="Esperando activaciones"
          variant="warning"
        />
        <StatCard 
          title="Estimated Revenue" 
          value="$0" 
          trend={0} 
          icon={ArrowUpRight} 
          description="Sin datos proyectados"
          variant="info"
        />
      </div>

      {/* DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEADS TABLE MINI */}
        <div className="lg:col-span-2 ds-card p-0 flex flex-col h-full bg-white/[0.01]">
          <div className="p-6 border-b border-white/[0.05] flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users size={18} className="text-blue-500" />
              Leads en Tiempo Real
            </h3>
            <button className="text-xs font-bold text-slate-500 hover:text-blue-500 transition-colors uppercase tracking-widest">Ver Todos ›</button>
          </div>
          <div className="flex-1 overflow-x-auto min-h-[300px] flex items-center justify-center">
             <div className="flex flex-col items-center gap-4 text-center opacity-40">
                <Users size={48} className="text-slate-600" />
                <div className="flex flex-col">
                   <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No hay Leads</p>
                   <p className="text-[11px] font-medium text-slate-600 px-8 mt-1">Conecta el formulario de tu landing para empezar a recibir leads registrados.</p>
                </div>
             </div>
          </div>
        </div>

        {/* N8N ACTIVITY FEED */}
        <div className="ds-card p-0 flex flex-col h-full bg-white/[0.01]">
          <div className="p-6 border-b border-white/[0.05] flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap size={18} className="text-purple-500" />
              Actividad de n8n
            </h3>
          </div>
          <div className="p-6 flex-1 flex flex-col items-center justify-center py-20 text-center gap-4 opacity-40">
             <div className="p-4 rounded-full bg-white/[0.02] border border-white/[0.04] text-slate-700">
                <Zap size={24} />
             </div>
             <div className="flex flex-col">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Sin Actividad</p>
                <p className="text-[11px] text-slate-600 px-4 mt-1 leading-relaxed">Las ejecuciones de n8n aparecerán aquí una vez que los flujos se activen.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
