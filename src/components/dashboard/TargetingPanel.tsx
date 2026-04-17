import React, { useState, useEffect } from 'react';
import { Search, Loader2, Target, MapPin, Hash, ChevronDown } from 'lucide-react';
import { PROVINCIAS_ESPANOLAS, CIUDADES_POR_PROVINCIA } from '@/lib/geo-data';

interface TargetingPanelProps {
  query: string;
  setQuery: (q: string) => void;
  location: string;
  setLocation: (l: string) => void;
  isSearching: boolean;
  onSearch: () => void;
  province?: string;
  setProvince?: (p: string) => void;
  city?: string;
  setCity?: (c: string) => void;
  postalCode?: string;
  setPostalCode?: (pc: string) => void;
}

export const TargetingPanel: React.FC<TargetingPanelProps> = ({
  query,
  setQuery,
  location,
  setLocation,
  isSearching,
  onSearch,
  province = '',
  setProvince,
  city = '',
  setCity,
  postalCode = '',
  setPostalCode
}) => {
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  useEffect(() => {
    if (province && CIUDADES_POR_PROVINCIA[province]) {
      setAvailableCities(CIUDADES_POR_PROVINCIA[province]);
    } else {
      setAvailableCities([]);
    }
  }, [province]);

  return (
    <div className="bg-[#0F172A] p-10 rounded-3xl text-white shadow-2xl relative overflow-hidden group border border-slate-800">
      {/* Elementos de diseño abstracto */}
      <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-indigo-500/5 to-transparent pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none opacity-50" />
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3 tracking-tight">
              Inteligencia Territorial Operativa
            </h2>
            <p className="text-slate-400 text-sm mt-1">Configuración quirúrgica para la detección de leads en sectores de alto impacto.</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/10">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nodos GPS Activos</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Nicho */}
          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-4 focus-within:border-indigo-500/50 focus-within:bg-white/[0.07] transition-all group/input">
            <div className="flex items-center gap-2 mb-2">
              <Target size={12} className="text-indigo-400" />
              <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Vertical Estratégica</label>
            </div>
            <input 
              value={query} 
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent w-full text-base font-semibold outline-none placeholder:text-slate-600" 
              placeholder="Ej: Odontología, Real Estate..." 
            />
          </div>

          {/* Provincia */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 focus-within:border-indigo-500/50 transition-all relative">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={12} className="text-indigo-400" />
              <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Provincia</label>
            </div>
            <select 
              value={province} 
              onChange={(e) => setProvince?.(e.target.value)}
              className="bg-transparent w-full text-sm font-medium outline-none appearance-none cursor-pointer"
            >
              <option value="" className="bg-slate-900">Seleccionar...</option>
              {PROVINCIAS_ESPANOLAS.map(p => (
                <option key={p} value={p} className="bg-slate-900">{p}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-4 bottom-5 text-slate-500 pointer-events-none" />
          </div>

          {/* Ciudad */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 focus-within:border-indigo-500/50 transition-all relative">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={12} className="text-indigo-600" />
              <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Ciudad</label>
            </div>
            <select 
              value={city} 
              onChange={(e) => setCity?.(e.target.value)}
              className="bg-transparent w-full text-sm font-medium outline-none appearance-none cursor-pointer"
            >
              <option value="" className="bg-slate-900">Global...</option>
              {availableCities.map(c => (
                <option key={c} value={c} className="bg-slate-900">{c}</option>
              ))}
              {province && availableCities.length === 0 && (
                <option value={province} className="bg-slate-900">Capital</option>
              )}
            </select>
            <ChevronDown size={14} className="absolute right-4 bottom-5 text-slate-500 pointer-events-none" />
          </div>

          {/* Código Postal */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 focus-within:border-indigo-500/50 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <Hash size={12} className="text-indigo-400" />
              <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Cód. Postal</label>
            </div>
            <input 
              value={postalCode} 
              onChange={(e) => setPostalCode?.(e.target.value)}
              className="bg-transparent w-full text-sm font-medium outline-none placeholder:text-slate-600" 
              placeholder="Opcional"
              maxLength={5}
            />
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <button 
            onClick={onSearch}
            disabled={isSearching}
            className="bg-indigo-600 hover:bg-white hover:text-indigo-600 px-10 py-4 rounded-xl font-bold flex items-center justify-center transition-all duration-500 active:scale-95 disabled:opacity-50 shadow-2xl shadow-indigo-600/30 border border-indigo-600 group/btn"
          >
            {isSearching ? (
              <Loader2 className="animate-spin mr-3" />
            ) : (
              <Search size={18} className="mr-3 group-hover/btn:scale-110 transition-transform" />
            )}
            <span className="text-sm uppercase tracking-widest">Ejecutar Despliegue</span>
          </button>
        </div>
      </div>
    </div>
  );
};
