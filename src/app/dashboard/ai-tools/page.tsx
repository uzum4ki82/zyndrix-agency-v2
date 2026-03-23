'use client';

import React, { useState } from 'react';
import { 
  Brain, 
  Mail, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Copy, 
  RefreshCcw, 
  Bot, 
  AlertCircle,
  Zap,
  ChevronRight,
  User,
  Layout,
  MessageSquare,
  Wand2,
  Trash2,
  Lock,
  History
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AIToolsPage() {
  const [activeTab, setActiveTab] = useState<'email' | 'classifier'>('email');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  
  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedContent(
        activeTab === 'email' 
        ? "Hola [Nombre],\n\nHe estado revisando [Empresa] y me ha impresionado vuestra presencia en el sector de [Industria]. En Zyndrix, hemos implementado soluciones de IA similares para empresas de vuestro tamaño..." 
        : "HOT: El lead muestra una intención de compra inmediata y presupuesto disponible para Q1."
      );
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-6 animate-in">
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
           <Brain size={14} className="text-blue-500" /> Zyndrix Neural Engine
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white">AI Core Tools</h1>
      </header>

      {/* TABS CONTROLLER */}
      <div className="flex items-center gap-6 border-b border-white/[0.08] mb-4">
        <button 
          onClick={() => setActiveTab('email')}
          className={cn(
            "pb-3 text-sm font-bold tracking-tight transition-all relative px-1",
            activeTab === 'email' ? "text-blue-500" : "text-slate-500 hover:text-slate-300"
          )}
        >
          Email Generator
          {activeTab === 'email' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
        </button>
        <button 
          onClick={() => setActiveTab('classifier')}
          className={cn(
            "pb-3 text-sm font-bold tracking-tight transition-all relative px-1",
            activeTab === 'classifier' ? "text-blue-500" : "text-slate-500 hover:text-slate-300"
          )}
        >
          Lead Classifier
          {activeTab === 'classifier' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* INPUT PANEL */}
        <div className="ds-card flex flex-col gap-6 bg-white/[0.01]">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                {activeTab === 'email' ? <Layout className="w-5 h-5 text-blue-500" /> : <Brain className="w-5 h-5 text-blue-500" />}
             </div>
             <div className="flex flex-col">
                <h3 className="font-bold text-white text-lg tracking-tight uppercase font-mono">
                   {activeTab === 'email' ? 'Parámetros del Email' : 'Input del Lead'}
                </h3>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-tighter">Configura el motor de inferencia</span>
             </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Lead Context / Info</label>
              <textarea 
                className="bg-white/[0.03] border border-white/[0.1] rounded-xl p-4 text-sm font-medium min-h-[140px] focus:border-blue-500/50 focus:bg-white/[0.05] outline-none transition-all"
                placeholder={activeTab === 'email' ? "Nombre: Maria Lopez\nEmpresa: Global Tech\nReto: Escalar su servicio al cliente con IA..." : "Pega aquí el texto del mensaje o la información del CRM para clasificar..."}
              />
            </div>

            {activeTab === 'email' && (
              <div className="grid grid-cols-2 gap-4">
                 <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Tono de Voz</label>
                    <select className="bg-white/[0.03] border border-white/[0.1] rounded-xl p-2.5 text-sm font-semibold outline-none focus:border-blue-500/50">
                       <option>Profesional / Directo</option>
                       <option>Persuasivo / Venta</option>
                       <option>Consultivo / Storytelling</option>
                       <option>Empático / Soporte</option>
                    </select>
                 </div>
                 <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Modelo AI</label>
                    <select className="bg-white/[0.03] border border-white/[0.1] rounded-xl p-2.5 text-sm font-semibold outline-none focus:border-blue-500/50">
                       <option>Gemini 2.0 Flash (Fast)</option>
                       <option>GPT-4o (Smart)</option>
                       <option>Claude 3.5 Sonnet (Pro)</option>
                    </select>
                 </div>
              </div>
            )}
            
            <button 
              onClick={handleGenerate}
              className={cn(
                "ds-button primary w-full justify-center h-12 shadow-lg shadow-blue-500/10 mt-2",
                isGenerating && "opacity-50 pointer-events-none"
              )}
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                   <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                   <span className="animate-pulse">Calculando Pesos Neuronales...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                   <Sparkles className="w-4 h-4" />
                   <span>Generar Output IA</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* OUTPUT PANEL */}
        <div className="ds-card flex flex-col gap-6 bg-white/[0.01] relative overflow-hidden">
           <AnimatePresence mode="wait">
             {!generatedContent && !isGenerating ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center text-center gap-4 py-12"
                >
                   <div className="w-16 h-16 rounded-full bg-slate-500/5 flex items-center justify-center text-slate-600 border border-white/[0.04]">
                      <Bot size={32} />
                   </div>
                   <div className="flex flex-col max-w-[240px]">
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">IA en Reposo</p>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed mt-2">Configura los parámetros y presiona generar para activar el motor de inferencia Zyndrix.</p>
                   </div>
                </motion.div>
             ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className={cn("flex flex-col gap-4", isGenerating && "opacity-40 grayscale blur-[1px]")}
                >
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                         <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Inference Completed</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <button className="p-2 rounded-lg hover:bg-white/[0.05] text-slate-500 hover:text-white transition-all"><Copy size={16} /></button>
                         <button className="p-2 rounded-lg hover:bg-white/[0.05] text-slate-500 hover:text-white transition-all"><RefreshCcw size={16} /></button>
                      </div>
                   </div>

                   <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] min-h-[260px] relative">
                      <pre className="text-sm font-medium text-slate-200 whitespace-pre-wrap font-sans leading-relaxed">
                         {generatedContent}
                      </pre>
                      {activeTab === 'email' && (
                         <div className="absolute top-2 right-2 flex items-center gap-2 px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-[10px] font-black tracking-widest uppercase">
                            Editable
                         </div>
                      )}
                   </div>

                   <div className="flex items-center gap-3">
                      <button className="ds-button primary flex-1 justify-center gap-3 shadow-lg shadow-blue-500/20">
                         {activeTab === 'email' ? <Send className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                         <span>{activeTab === 'email' ? 'Enviar vía n8n Webhook' : 'Guardar Score en CRM'}</span>
                      </button>
                      <button className="ds-button ghost p-3">
                         <Trash2 className="w-4 h-4" />
                      </button>
                   </div>
                </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
      
      {/* HISTORY MINI-STRIP */}
      <div className="ds-card p-4 flex items-center justify-between border-dashed bg-transparent border-white/[0.1] hover:bg-white/[0.02] cursor-pointer group">
         <div className="flex items-center gap-4">
            <History className="w-5 h-5 text-slate-500 group-hover:text-blue-500 transition-colors" />
            <div className="flex flex-col">
               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Historial de Predicciones</span>
               <p className="text-[11px] text-slate-600 font-medium">12 generaciones hoy utilizando 4,281 tokens.</p>
            </div>
         </div>
         <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-white mr-2" />
      </div>
    </div>
  );
}
