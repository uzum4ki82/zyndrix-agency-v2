'use client';

import { ShieldCheck } from 'lucide-react';

export default function ScoringPage() {
  return (
    <div className="space-y-10">
      <div className="space-y-1">
        <h2 className="text-4xl font-extrabold tracking-tight text-white font-outfit uppercase tracking-tighter">IA Scoring</h2>
        <p className="text-slate-400 text-lg">Metodología de <span className="text-cyan-400 font-bold">Clasificación Propietaria</span>.</p>
      </div>

      <div className="p-20 rounded-[3rem] bg-slate-900/30 border border-slate-800/40 border-dashed flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
          <ShieldCheck size={32} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white uppercase tracking-tight">Análisis de Score Avanzado</h3>
          <p className="text-slate-500 max-w-md mx-auto">Aquí podrás ver el desglose detallado de por qué la IA asigna cada puntuación a los prospectos.</p>
        </div>
      </div>
    </div>
  );
}
