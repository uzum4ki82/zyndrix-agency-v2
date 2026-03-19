'use client';

import { MessageSquare } from 'lucide-react';

export default function ResponsesPage() {
  return (
    <div className="space-y-10">
      <div className="space-y-1">
        <h2 className="text-4xl font-extrabold tracking-tight text-white font-outfit uppercase tracking-tighter">Respuestas</h2>
        <p className="text-slate-400 text-lg">Inbox inteligente y <span className="text-cyan-400 font-bold">Clasificación de Sentimiento</span>.</p>
      </div>

      <div className="p-12 rounded-[3rem] bg-slate-900/30 border border-slate-800/40 border-dashed flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-violet-500/10 flex items-center justify-center text-violet-400">
          <MessageSquare size={32} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white uppercase tracking-tight">Inbox Unificado</h3>
          <p className="text-slate-500 max-w-md mx-auto">Las respuestas detectadas se están clasificando mediante IA. El panel de conversación estará disponible en breve.</p>
        </div>
      </div>
    </div>
  );
}
