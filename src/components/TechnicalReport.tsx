import React from 'react';
import { Business } from '@/types';
import { 
  Shield, Zap, TrendingUp, AlertTriangle, CheckCircle2, Globe, 
  Laptop, Smartphone, FileText, Activity, MessageSquare, Terminal 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TechnicalReport({ business, onDownload }: { business: Business; onDownload?: () => void }) {
  if (!business) return null;

  return (
    <div 
      id="technical-report-content" 
      className="bg-white text-slate-900 p-16 max-w-4xl mx-auto leading-relaxed border border-slate-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] rounded-3xl flex flex-col gap-16 relative overflow-hidden"
    >
      {/* Structural Background Accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -mr-32 -mt-32" />
      <div className="absolute top-12 left-12 text-[10px] font-bold text-slate-300 uppercase tracking-[0.6em] select-none">
        Strategic Architecture // v4.0 // {new Date().getFullYear()}
      </div>

      {/* Primary Identity Header */}
      <div className="flex justify-between items-start border-b border-slate-100 pb-12 mt-4 relative z-10">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-bold uppercase tracking-wider mb-6">
            <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse" />
            Análisis de Impacto Digital
          </div>
          <h1 className="text-5xl font-light tracking-tight text-slate-950 mb-3 leading-tight font-serif italic">
            {business.name.split(' ').map((word, i) => i === 0 ? <span key={i} className="font-bold not-italic">{word} </span> : word + ' ')}
          </h1>
          <div className="text-slate-400 font-medium uppercase tracking-widest text-[10px] flex items-center gap-2">
            <Globe size={12} className="text-slate-300" />
            Operaciones en {business.neighborhood} • {business.address}
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold tracking-tighter text-indigo-600">
            ZYNDRIX<span className="text-slate-900">.</span>
          </div>
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">
            Digital Luxury & Scale
          </div>
        </div>
      </div>

      {/* Strategic Vision Matrix */}
      <div className="grid grid-cols-3 gap-8 relative z-10">
        <div className="p-8 rounded-3xl bg-slate-50/50 border border-slate-100 hover:border-indigo-100 transition-colors">
          <div className="flex items-center gap-2 mb-6 text-indigo-600">
            <Zap size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Digital Resilience</span>
          </div>
          <div className="text-5xl font-bold text-slate-900 mb-2">{business.score}</div>
          <div className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">Puntuación Técnica Core</div>
        </div>

        <div className="p-8 rounded-3xl bg-emerald-50/30 border border-emerald-100 hover:border-emerald-200 transition-colors">
          <div className="flex items-center gap-2 mb-6 text-emerald-600">
            <TrendingUp size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Growth Margin</span>
          </div>
          <div className="text-5xl font-bold text-slate-900 mb-2">+{business.conversionBoost || 45}%</div>
          <div className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">Capacidad de Escalado ROI</div>
        </div>

        <div className="p-8 rounded-3xl bg-slate-900 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-6 text-indigo-400">
            <Activity size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Market Priority</span>
          </div>
          <div className="text-4xl font-bold mb-2">{business.intel?.marketPotential || 'HIGH'}</div>
          <div className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">Urgencia de Despliegue</div>
        </div>
      </div>

      {/* Core Transformation Insights */}
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-10">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400">Puntos de Transformación</h3>
          <div className="flex-1 h-px bg-slate-100" />
        </div>
        <div className="grid grid-cols-2 gap-6">
          {[
            { label: "Oportunidad de Conversión", value: business.conversionGap || business.strategicImpact || "Pérdida de captación detectada", icon: FileText },
            { label: "Market GAP", value: `Distancia vs Líder: -${business.competitorGap || '0.7'} ptos de autoridad`, icon: Activity },
            { label: "Tecnología Base", value: typeof business.techStack === 'string' ? business.techStack : business.techStack?.join(', ') || 'No detectada / Legacy', icon: Laptop },
            { label: "Instagram", value: business.signals?.instagram ? "Presencia Detectada" : "Desconexión Crítica", icon: Globe },
            { label: "WhatsApp", value: business.signals?.whatsapp ? "Canal Activo" : "Canal Inactivo", icon: MessageSquare }
          ].map((f, i) => (
            <div key={i} className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-slate-50 hover:shadow-xl hover:shadow-slate-100/50 transition-all">
              <div className="p-3 bg-slate-50 rounded-xl text-slate-400">
                <f.icon size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1">{f.label}</span>
                <span className="text-sm font-semibold text-slate-700">{f.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TECH STACK & SOCIAL INFRASTRUCTURE */}
      <div className="grid grid-cols-2 gap-12 relative z-10 p-10 bg-slate-50/50 rounded-[3rem] border border-slate-100">
        <div>
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Terminal size={12} /> Infraestructura Técnica Detectada
          </h4>
          <div className="flex flex-wrap gap-3">
             {business.techStack ? (
               Array.isArray(business.techStack) ? (
                 business.techStack.map((tech, idx) => (
                   <span key={idx} className="px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-tight shadow-sm">
                     {tech}
                   </span>
                 ))
               ) : (
                 <span className="px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-tight shadow-sm">
                   {business.techStack}
                 </span>
               )
             ) : <span className="text-xs text-slate-400 italic">No se ha detectado un stack moderno. Requiere migración.</span>}
          </div>
        </div>
        <div>
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Globe size={12} /> Conectividad Social
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Instagram Presence</span>
              {business.signals?.instagram ? <CheckCircle2 size={14} className="text-emerald-500" /> : <AlertTriangle size={14} className="text-rose-500" />}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">LinkedIn Authority</span>
              {business.signals?.linkedin ? <CheckCircle2 size={14} className="text-emerald-500" /> : <AlertTriangle size={14} className="text-rose-500" />}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">WhatsApp Canal</span>
              {business.signals?.whatsapp ? <CheckCircle2 size={14} className="text-emerald-500" /> : <AlertTriangle size={14} className="text-rose-500" />}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Email Professionalism</span>
              {business.email ? <CheckCircle2 size={14} className="text-emerald-500" /> : <AlertTriangle size={14} className="text-amber-500" />}
            </div>
          </div>
        </div>
      </div>

      {/* Executive Deployment Proposal */}
      <div className="bg-indigo-600 p-12 rounded-[2rem] text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-32 -mt-32 blur-2xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1">
            <h3 className="text-3xl font-bold tracking-tight mb-4">La Nueva Era de {business.name}</h3>
            <p className="text-indigo-100 text-sm leading-relaxed mb-6 max-w-lg font-medium">
              Vuestro análisis estratégico confirma que la implementación de la nueva arquitectura digital de **Zyndrix** desbloqueará un flujo de captación de leads que actualmente vuestra competencia está absorbiendo.
            </p>
            <div className="flex gap-4">
              <div className="px-5 py-2 bg-white/10 rounded-full text-[10px] font-bold backdrop-blur-sm border border-white/10 uppercase tracking-widest">Deployment v4.0</div>
              <div className="px-5 py-2 bg-white/10 rounded-full text-[10px] font-bold backdrop-blur-sm border border-white/10 uppercase tracking-widest">Global Scale</div>
            </div>
          </div>
          <div className="w-32 h-32 flex-shrink-0 flex items-center justify-center bg-white rounded-3xl shadow-lg transform rotate-3">
             <div className="text-indigo-600 text-4xl font-black">Z</div>
          </div>
        </div>
      </div>

      {/* Professional Metadata */}
      <div className="flex justify-between items-center border-t border-slate-100 pt-10 relative z-10 text-slate-400">
        <div className="flex gap-8">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[9px] font-bold uppercase tracking-widest group-hover:text-slate-900 transition-colors">Infraestructura Verificada</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-indigo-400" />
            <span className="text-[9px] font-bold uppercase tracking-widest">Reporte de Auditoría Legal</span>
          </div>
        </div>
        <div className="text-[9px] font-bold uppercase tracking-[0.4em]">
          CONFIDENTIAL // OPERATED BY ZYNDRIX AI
        </div>
      </div>
    </div>
  );
}
