'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  Webhook, 
  Key, 
  User, 
  Shield, 
  Moon, 
  Sun, 
  Save, 
  ExternalLink, 
  CheckCircle2, 
  Lock,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  Cpu,
  Monitor,
  Database
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function SettingsPage() {
  const [showKey, setShowKey] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  return (
    <div className="flex flex-col gap-8 opacity-0 translate-y-4 animate-in fill-mode-forwards duration-700 ease-out-quint">
      <header className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
             <Settings size={14} className="text-blue-500" /> System Preferences
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Configuración</h1>
        </div>
        <button className="ds-button primary shadow-lg shadow-blue-500/20">
           <Save className="w-4 h-4" />
           <span>Guardar Cambios</span>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* NAV SECTION */}
        <div className="lg:col-span-1 flex flex-col gap-2">
           <nav className="flex flex-col gap-1">
              {[
                { name: 'General', icon: Monitor, active: true },
                { name: 'Webhooks & n8n', icon: Webhook, active: false },
                { name: 'API Keys', icon: Key, active: false },
                { name: 'Neural Engine', icon: Cpu, active: false },
                { name: 'Seguridad', icon: Shield, active: false },
                { name: 'Base de Datos', icon: Database, active: false },
              ].map((item, i) => (
                <button key={i} className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all",
                  item.active ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" : "text-slate-500 hover:bg-white/[0.05] hover:text-white"
                )}>
                   <item.icon className="w-4 h-4" />
                   <span>{item.name}</span>
                </button>
              ))}
           </nav>
        </div>

        {/* CONTENT SECTION */}
        <div className="lg:col-span-3 flex flex-col gap-8">
           {/* WEBHOOKS */}
           <section className="ds-card flex flex-col gap-6 bg-white/[0.01]">
              <div className="flex items-center gap-3">
                 <Webhook className="w-5 h-5 text-blue-500" />
                 <h3 className="font-bold text-white text-lg tracking-tight uppercase font-mono">Webhooks & n8n Integration</h3>
              </div>
              <div className="flex flex-col gap-4">
                 <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">n8n Lead Scoring Webhook</label>
                    <div className="flex gap-2">
                       <input 
                         className="bg-white/[0.03] border border-white/[0.1] rounded-xl p-3 text-xs font-mono font-medium text-blue-400 flex-1 outline-none focus:border-blue-500/50 transition-all"
                         value="https://n8n.zyndrix.dev/webhook/zyndrix-lead-scoring"
                         readOnly
                       />
                       <button className="ds-button ghost p-3 bg-white/[0.05]"><ExternalLink size={16} /></button>
                    </div>
                 </div>
              </div>
           </section>

           {/* API KEYS */}
           <section className="ds-card flex flex-col gap-6 bg-white/[0.01]">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <Key className="w-5 h-5 text-purple-500" />
                    <h3 className="font-bold text-white text-lg tracking-tight uppercase font-mono">API Keys & Authentication</h3>
                 </div>
                 <button className="ds-button primary text-xs gap-2 py-1.5 shadow-sm">
                    <Plus size={14} /> Nueva Key
                 </button>
              </div>
              <div className="space-y-4">
                 {[
                   { name: 'X-ZYNDRIX-API-KEY', val: 'sk-zyndrix-4a29-b883', lastUsed: 'Hoy, 10:42' },
                   { name: 'N8N_AUTHORIZATION', val: 'Bearer q78S2...2j3L', lastUsed: 'Hace 4h' },
                 ].map((key, i) => (
                   <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.15] transition-all">
                      <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-500">
                         <Shield className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col flex-1">
                         <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{key.name}</span>
                         <span className="text-sm font-bold font-mono text-white tracking-widest leading-none mt-1">
                            {showKey ? key.val : '••••••••••••••••'}
                         </span>
                      </div>
                      <div className="flex flex-col items-end gap-1 px-4">
                         <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Last Run</span>
                         <span className="text-xs font-bold text-slate-400">{key.lastUsed}</span>
                      </div>
                      <div className="flex items-center gap-1">
                         <button 
                           onClick={() => setShowKey(!showKey)}
                           className="p-2.5 rounded-lg hover:bg-white/[0.05] text-slate-500 hover:text-white transition-all"
                         >
                           {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                         </button>
                         <button className="p-2.5 rounded-lg hover:bg-rose-500/10 text-slate-500 hover:text-rose-500 transition-all">
                            <Trash2 size={16} />
                         </button>
                      </div>
                   </div>
                 ))}
              </div>
           </section>

           {/* AI ENGINE SETTINGS */}
           <section className="ds-card flex flex-col gap-6 bg-white/[0.01]">
              <div className="flex items-center gap-3">
                 <Cpu className="w-5 h-5 text-amber-500" />
                 <h3 className="font-bold text-white text-lg tracking-tight uppercase font-mono">AI Engine Parameters</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Temperatura (Inferencia)</label>
                    <input type="range" className="w-full accent-amber-500 bg-white/[0.05] h-1.5 rounded-full" min="0" max="1" step="0.1" defaultValue="0.7" />
                    <div className="flex justify-between text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                       <span>Precisión (0.0)</span>
                       <span>Creatividad (1.0)</span>
                    </div>
                 </div>
                 <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Max Tokens Limit</label>
                    <select className="bg-white/[0.03] border border-white/[0.1] rounded-xl p-3 text-xs font-bold font-mono text-white outline-none focus:border-amber-500/50">
                       <option>2,048 Tokens</option>
                       <option>4,096 Tokens</option>
                       <option>8,192 Tokens (Max Capability)</option>
                    </select>
                 </div>
              </div>
           </section>
        </div>
      </div>
    </div>
  );
}
