'use client';

import { Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-10">
      <div className="space-y-1">
        <h2 className="text-4xl font-extrabold tracking-tight text-white font-outfit uppercase tracking-tighter">Configuración</h2>
        <p className="text-slate-400 text-lg">Ajustes del <span className="text-cyan-400 font-bold">Sistema Enterprise</span>.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-[2.5rem] bg-slate-900/30 border border-slate-800/40 space-y-6">
          <h3 className="text-lg font-bold text-white uppercase tracking-tight">API Keys</h3>
          <div className="space-y-4 text-slate-500 text-sm">
            <p>Claude-3.5-Sonnet: <span className="text-emerald-500 font-mono">Conectado</span></p>
            <p>Supabase DB: <span className="text-emerald-500 font-mono">Conectado</span></p>
            <p>SMTP Server: <span className="text-emerald-500 font-mono">Conectado</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
