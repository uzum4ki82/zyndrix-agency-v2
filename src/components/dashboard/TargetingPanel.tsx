import React from 'react';
import { Search, Loader2, Target, MapPin } from 'lucide-react';

interface TargetingPanelProps {
  query: string;
  setQuery: (q: string) => void;
  location: string;
  setLocation: (l: string) => void;
  isSearching: boolean;
  onSearch: () => void;
}

export const TargetingPanel: React.FC<TargetingPanelProps> = ({
  query,
  setQuery,
  location,
  setLocation,
  isSearching,
  onSearch
}) => {
  return (
    <div className="bg-[#0F172A] p-10 rounded-2xl text-white shadow-2xl relative overflow-hidden group border border-slate-800">
      {/* Elementos de diseño abstracto */}
      <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-indigo-500/5 to-transparent pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none opacity-50" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-3 tracking-tight">
              Configuración de Rastreo de Mercado
            </h2>
            <p className="text-slate-400 text-sm mt-1">Defina los parámetros de identificación para el motor de inteligencia.</p>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/10">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status: Sistema Operativo</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 focus-within:border-indigo-500/50 focus-within:bg-white/[0.07] transition-all group/input">
            <div className="flex items-center gap-2 mb-2">
              <Target size={12} className="text-indigo-400" />
              <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Nicho Estratégico</label>
            </div>
            <input 
              value={query} 
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent w-full text-base font-medium outline-none placeholder:text-slate-600" 
              placeholder="Ej: Consultorías de Lujo, Real Estate..." 
            />
          </div>

          <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 focus-within:border-indigo-500/50 focus-within:bg-white/[0.07] transition-all group/input">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={12} className="text-indigo-400" />
              <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Foco Geográfico</label>
            </div>
            <input 
              value={location} 
              onChange={(e) => setLocation(e.target.value)}
              className="bg-transparent w-full text-base font-medium outline-none placeholder:text-slate-600" 
              placeholder="Ej: Madrid, España" 
            />
          </div>

          <button 
            onClick={onSearch}
            disabled={isSearching}
            className="bg-indigo-600 hover:bg-white hover:text-indigo-600 px-8 py-4 lg:py-0 rounded-xl font-semibold flex items-center justify-center transition-all duration-300 active:scale-95 disabled:opacity-50 min-w-[200px] shadow-lg shadow-indigo-600/20 border border-indigo-600 group/btn"
          >
            {isSearching ? <Loader2 className="animate-spin mr-3" /> : <Search size={18} className="mr-3 group-hover/btn:scale-110 transition-transform" />}
            <span className="text-sm">Desplegar Escaneo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
