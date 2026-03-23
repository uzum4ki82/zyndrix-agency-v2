'use client';

import React from 'react';
import { 
  BookOpen, 
  Code, 
  Terminal, 
  Zap, 
  Webhook, 
  ShieldCheck, 
  Database, 
  ArrowRight,
  ChevronRight,
  ExternalLink,
  Cpu
} from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="flex flex-col gap-8 opacity-0 translate-y-4 animate-in fill-mode-forwards duration-700 ease-out-quint">
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
           <BookOpen size={14} className="text-blue-500" /> Professional SDK & API Docs
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white uppercase font-mono tracking-tight">Technical Integration</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
           {/* GUIDE 1: Webhook Integration */}
           <section className="ds-card flex flex-col gap-6 bg-white/[0.01]">
              <div className="flex items-center gap-3">
                 <Webhook className="w-5 h-5 text-blue-500" />
                 <h3 className="font-bold text-white text-lg tracking-tight uppercase font-mono">Conexión con n8n Webhooks</h3>
              </div>
              <div className="flex flex-col gap-4 text-sm font-medium text-slate-400 leading-relaxed">
                 <p>Para conectar una acción del dashboard con un flujo de n8n, sigue estos pasos:</p>
                 <ol className="list-decimal list-inside space-y-3 pl-2">
                    <li>Crea un nodo <span className="text-blue-400 font-bold">Webhook</span> en n8n seteado en <span className="bg-white/[0.05] p-1 rounded font-mono text-white">POST</span>.</li>
                    <li>Copia la <span className="text-white">Production URL</span>.</li>
                    <li>Pega la URL en la sección de <span className="text-blue-400 hover:underline">Settings</span> de este dashboard.</li>
                    <li>Asegúrate de que el body sea JSON: <span className="bg-white/[0.05] p-1 rounded font-mono text-green-400">{'{"lead_id": "XY-42", "action": "score"}'}</span>.</li>
                 </ol>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-white/[0.1] font-mono text-xs overflow-x-auto">
                 <div className="flex items-center justify-between mb-4 border-b border-white/[0.05] pb-2">
                    <span className="text-slate-500">EX_CURL_REQUEST.sh</span>
                    <Code size={14} className="text-slate-600" />
                 </div>
                 <pre className="text-emerald-400">
                    {`curl -X POST https://n8n.zyndrix.dev/webhook/lead-id \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Maria", "score": 9.4, "os": "zyndrixv4"}'`}
                 </pre>
              </div>
           </section>

           {/* GUIDE 2: API Keys Security */}
           <section className="ds-card flex flex-col gap-6 bg-white/[0.01]">
              <div className="flex items-center gap-3">
                 <ShieldCheck className="w-5 h-5 text-purple-500" />
                 <h3 className="font-bold text-white text-lg tracking-tight uppercase font-mono">Security & API Keys</h3>
              </div>
              <p className="text-sm font-medium text-slate-400 leading-relaxed">
                 Todas las peticiones entre el Dashboard y n8n viajan encriptadas mediante TLS 1.3. Se recomienda rotar las API Keys cada 30 días para mantener la integridad del sistema.
              </p>
              <div className="flex items-center gap-4">
                 <button className="ds-button ghost py-2 text-xs">Descargar PDF de Seguridad</button>
                 <button className="ds-button ghost py-2 text-xs border-blue-500/20 text-blue-400">Rotar Keys Ahora</button>
              </div>
           </section>
        </div>

        {/* SIDEBAR DOCS */}
        <div className="flex flex-col gap-6">
           <div className="ds-card bg-blue-500/5 border-blue-500/10 flex flex-col gap-4">
              <h4 className="font-bold text-blue-400 text-sm uppercase tracking-widest">Recursos Rápidos</h4>
              <nav className="flex flex-col gap-1">
                 {[
                   { name: 'Manual n8n + Webhooks', icon: ExternalLink },
                   { name: 'Schema de la Base de Datos', icon: Database },
                   { name: 'Límites de Inferencia AI', icon: Cpu },
                   { name: 'Guía de Despliegue', icon: Zap },
                 ].map((item, i) => (
                    <a key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.05] transition-all group">
                       <span className="text-xs font-bold text-slate-400 group-hover:text-white">{item.name}</span>
                       <item.icon className="w-4 h-4 text-slate-600 group-hover:text-blue-500" />
                    </a>
                 ))}
              </nav>
           </div>

           <div className="ds-card p-6 border-dashed border-white/[0.1] bg-transparent flex flex-col items-center justify-center text-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-500/5 flex items-center justify-center border border-white/[0.04] text-slate-600">
                 <Terminal size={24} />
              </div>
              <div className="flex flex-col">
                 <span className="text-xs font-bold text-white uppercase tracking-widest leading-relaxed">¿Necesitas ayuda técnica?</span>
                 <p className="text-[10px] text-slate-500 font-medium px-4 mt-1">Nuestro equipo de soporte está disponible para configurar tus n8n nodes de forma gratuita.</p>
              </div>
              <button className="ds-button primary w-full justify-center text-xs mt-2 py-2">Consultar Soporte Pro</button>
           </div>
        </div>
      </div>
    </div>
  );
}
