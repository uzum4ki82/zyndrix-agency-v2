"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  MapPin, 
  Globe, 
  Mail, 
  Phone, 
  Star, 
  Shield, 
  Zap, 
  Target, 
  Sparkles, 
  ChevronRight, 
  Eye,
  ArrowRight,
  Monitor,
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  ZapOff,
  LayoutDashboard,
  Users,
  Settings,
  Bell,
  Navigation,
  Menu,
  X,
  BarChart3,
  Terminal,
  ShieldCheck,
  Download,
  Filter,
  MoreHorizontal,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Business } from "@/types";
import { MOCK_TEAM } from "@/data/mock";

// Components & Hooks
import { useAutopilot } from '@/hooks/use-autopilot';
import { BusinessCard } from '@/components/BusinessCard';
import TechnicalReport from '@/components/TechnicalReport';
import { syncLead, getLeads } from '@/lib/supabase';
import { Lead } from '@/lib/supabase';
import { useBusinesses } from "@/hooks/useBusinesses";
import { generatePDF } from '@/lib/pdf-generator';

type TabType = 'commander' | 'leads' | 'outreach' | 'analytics';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('commander');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState('Barcelona');
  const [selectedCity, setSelectedCity] = useState('Sant Antoni de Vilamajor');
  const [selectedNiche, setSelectedNiche] = useState('Taller Mecánico');
  const [selectedCompanyType, setSelectedCompanyType] = useState<'pyme' | 'empresa' | 'autonomo' | 'corporativo'>('pyme');
  const [scanning, setScanning] = useState(false);
  const [showReportPreview, setShowReportPreview] = useState(false);
  const [selectedPostalCode, setSelectedPostalCode] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [scoreFilter, setScoreFilter] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState<'all' | 'contacted' | 'pending'>('all');
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set());
  const [resendStatus, setResendStatus] = useState<'pending' | 'live' | 'mock'>('pending');
  const [tierFilter, setTierFilter] = useState<'all' | 'TIER_1' | 'TIER_2' | 'TIER_3'>('all');
  
  const {
    businessList: businesses,
    setBusinessList: setBusinesses,
    leadsList: leads,
    setLeadsList: setLeads,
    selectedBusiness,
    setSelectedBusiness,
    addBusinesses,
    updateBusinessInLists
  } = useBusinesses();

  // Stats for Analytics
  const totalLeads = leads.length;
  const contactedLeads = leads.filter(l => l.email_sent).length;
  const marketCoverage = totalLeads > 0 ? ((contactedLeads / totalLeads) * 100).toFixed(1) : "0.0";
  const potentialValue = (contactedLeads * 1250).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
  const efficiencyRate = leads.length > 0 ? (leads.filter(l => l.score && l.score > 80).length / leads.length * 100).toFixed(0) : "0";

  // Check Resend Status
  useEffect(() => {
    const checkStatus = async () => {
       try {
          const res = await fetch('/api/send', { 
             method: 'POST', 
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ ping: true }) 
          });
          const data = await res.json();
          setResendStatus(data.status);
       } catch {
          setResendStatus('mock');
       }
    };
    checkStatus();
  }, []);

  const autopilot = useAutopilot({ 
    leads: businesses, 
    selectedNiche, 
    location: `${selectedCity}, ${selectedProvince}`,
    selectedCompanyType,
    onLeadSynced: (synced) => {
       setLeads(prev => [synced, ...prev.filter(l => l.id !== synced.id)]);
     }
  });

  const processMagic = async (lead: any) => {
    if (!lead.email) {
      autopilot.addMissionLog(`⚠️ Falta email para ${lead.name}. Se requiere contacto manual.`, "error");
      return false;
    }

    autopilot.addMissionLog(`✨ Iniciando Protocolo de Prospección Elite para ${lead.name}...`, "ai");
    try {
      // 1. STITCHING 
      autopilot.addMissionLog(`🎨 Generando Prototipo de Arquitectura Digital...`, "ai");
      
      // Simulation of engine processing
      await new Promise(r => setTimeout(r, 1500));
      
      const slug = lead.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const previewUrl = `https://zyndrix-architecture-${slug}.vercel.app`;
      
      autopilot.addMissionLog(`🛰️ Prototipo desplegado en: ${previewUrl}`, "success");

      // 2. SENDING Real via Resend
      autopilot.addMissionLog(`📤 Desplegando Propuesta Estratégica via Resend...`, "ai");
      const sendRes = await fetch('/api/send', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           email: lead.email,
           name: lead.name,
           id: lead.id,
           location: selectedCity,
           analysisData: {
              gap: lead.conversion_gap || "Fuga de leads detectada",
              loss: "Impacto Comercial Significativo",
              stitchPreviewUrl: previewUrl,
              screenshotUrl: lead.photoUrl,
              strategicImpact: lead.intel?.strategicImpact || "HIGH_COMMERCIAL",
              techStack: lead.tech_stack || (Array.isArray(lead.intel?.techStack) ? lead.intel.techStack.join(', ') : ''),
              signals: lead.signals || lead.intel?.signals
           }
         })
      });

      if (!sendRes.ok) throw new Error("Fallo en el despliegue del correo");
      
      const updated = { 
         ...lead, 
         email_sent: true,
         stitch_preview_url: previewUrl,
         last_contacted_at: new Date().toISOString(),
         followUpStatus: 'CONTACTED' as any
      };
      
      updateBusinessInLists(updated);
      await syncLead(updated);
      
      autopilot.addMissionLog(`🏆 MISIÓN CUMPLIDA. Impacto estratégico notificado a ${lead.name}.`, "success");
      return true;
    } catch (err) {
      console.error("Magic fail:", err);
      autopilot.addMissionLog(`⚠️ Error procesando ${lead.name}.`, "error");
      return false;
    }
  };

  // Fetch leads from Supabase on mount
  useEffect(() => {
    const fetchLeads = async () => {
      const data = await getLeads();
      if (data && data.length > 0) {
        setLeads(data as any);
      }
    };
    fetchLeads();
  }, [setLeads]);

  const startDeepScan = async () => {
    setScanning(true);
    setBusinesses([]);
    autopilot.addMissionLog(`📡 Iniciando barrido táctico en ${selectedCity}${selectedPostalCode ? ` (CP: ${selectedPostalCode})` : ''}...`, "ai", true);
    try {
      const targetLocation = `${selectedCity}${selectedPostalCode ? `, ${selectedPostalCode}` : ''}, ${selectedProvince}`;
      const res = await fetch('/api/engine/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
           niche: selectedNiche, 
           location: targetLocation, 
           companyType: selectedCompanyType 
        })
      });
      const data = await res.json();
      if (data?.length > 0) {
        addBusinesses(data);
        // Automáticamente sincronizarlos con Supabase para persistencia
        data.forEach(async (biz: any) => {
           await syncLead(biz);
        });
        autopilot.addMissionLog(`✅ SCAN COMPLETO. ${data.length} objetivos procesados y sincronizados.`, "success");
      }
    } catch {
      autopilot.addMissionLog("❌ Error en conexión satelital.", "error");
    } finally {
      setScanning(false);
    }
  };

  const navItems = [
    { id: 'commander', label: 'Comando', icon: Navigation, desc: 'Radar & IA' },
    { id: 'leads', label: 'Baza', icon: Users, desc: 'Gestión CRM' },
    { id: 'outreach', label: 'Fuego', icon: MessageSquare, desc: 'Outreach' },
    { id: 'analytics', label: 'Métricas', icon: BarChart3, desc: 'Impacto' },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFF] overflow-hidden text-slate-900 font-sans">
      
      {/* Sidebar Desktop */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transition-transform duration-300 lg:static lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="h-20 flex items-center px-6 border-b border-slate-100 gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-sm shadow-indigo-200">
               <Navigation size={20} />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-slate-900">Zyndrix</span>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id as TabType); setIsSidebarOpen(false); }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm group",
                  activeTab === item.id 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon size={18} className={cn(activeTab === item.id ? "text-white" : "text-slate-400 group-hover:text-indigo-600")} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-100 bg-slate-50/30">
            <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-indigo-100">OM</div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-bold truncate text-slate-800">Óscar Montes</p>
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest opacity-80 leading-tight">Lead Strategist</p>
              </div>
              <Settings size={14} className="text-slate-300 cursor-pointer hover:text-indigo-600 transition-colors" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-[#fcfdfe]">
        
        {/* Header */}
        <header className="h-24 bg-white/70 backdrop-blur-xl border-b border-slate-100/60 flex items-center justify-between px-10 shrink-0 relative z-40">
           <div className="flex items-center gap-6">
              <button className="lg:hidden p-3 text-slate-400 hover:bg-slate-50 rounded-xl transition-all" onClick={() => setIsSidebarOpen(true)}>
                <Menu size={22} />
              </button>
              <div className="hidden lg:block">
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-1">Zyndrix Strategic Command</p>
                <h1 className="text-2xl font-light tracking-tight text-slate-900 font-display">
                  {navItems.find(n => n.id === activeTab)?.label}
                </h1>
              </div>
           </div>
           
           <div className="flex items-center gap-8">
              <div className="hidden xl:flex items-center gap-3 px-4 py-2 bg-indigo-50/50 text-indigo-700 rounded-full border border-indigo-100/30">
                 <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-[pulse_2.5s_infinite]" />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em]">Neural-Core Protocol Active</span>
              </div>
              
              <div className="flex items-center gap-3 border-l border-slate-100 pl-8 ml-2">
                <button className="relative p-2.5 text-slate-400 hover:text-indigo-600 transition-all hover:scale-105 active:scale-95">
                   <Bell size={22} />
                   <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
                </button>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border-2 border-white shadow-sm" />
              </div>
           </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Main Content Viewport */}
          <main className="flex-1 overflow-y-auto p-10 space-y-12 pb-32">
             <AnimatePresence mode="wait">
                
                {/* 1. COMMANDER TAB */}
                {activeTab === 'commander' && (
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-10 max-w-7xl mx-auto">
                     
                     {/* Executive Insights Strip */}
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                          { label: 'Radar de Mercado', val: leads.length, icon: Globe, color: 'bg-indigo-50 text-indigo-600' },
                          { label: 'Alta Conversión', val: leads.filter(l => (l.score || 0) > 70).length, icon: Target, color: 'bg-emerald-50 text-emerald-600' },
                          { label: 'Outreach Activo', val: leads.filter(l => l.email_sent).length, icon: Mail, color: 'bg-amber-50 text-amber-600' },
                          { label: 'Efectividad IQ', val: leads.length > 0 ? `${Math.round((leads.filter(l => (l.score || 0) > 70).length / leads.length) * 100)}%` : '0%', icon: Zap, color: 'bg-violet-50 text-violet-600' },
                        ].map((s, i) => (
                           <motion.div 
                             key={i} 
                             initial={{ opacity: 0, y: 20 }}
                             animate={{ opacity: 1, y: 0 }}
                             transition={{ delay: i * 0.1 }}
                             className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex items-center gap-6 hover:shadow-[0_15px_45px_rgb(0,0,0,0.06)] transition-all cursor-default"
                           >
                              <div className={cn("p-4 rounded-2xl", s.color)}><s.icon size={22} /></div>
                              <div>
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                                 <p className="text-2xl font-bold text-slate-900 leading-none">{s.val}</p>
                              </div>
                           </motion.div>
                        ))}
                     </div>

                     {/* Strategic Targeting Section */}
                     <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/50 rounded-full -mr-48 -mt-48 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="relative z-10">
                           <div className="flex items-center gap-3 mb-8">
                              <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-100">
                                 <Target size={20} />
                              </div>
                              <div>
                                 <h2 className="text-xl font-display font-bold text-slate-900 leading-none">Segmentación Geográfica</h2>
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5 opacity-70">Strategic Market Intelligence</p>
                              </div>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Provincia</label>
                                 <select 
                                   value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)}
                                   className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                                 >
                                    <option>Barcelona</option>
                                    <option>Girona</option>
                                    <option>Lleida</option>
                                    <option>Tarragona</option>
                                    <option>Madrid</option>
                                 </select>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ciudad / Municipio</label>
                                 <input 
                                    type="text" placeholder="Ej: Cardedeu" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}
                                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                                 />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Código Postal (Opcional)</label>
                                 <input 
                                    type="text" placeholder="Ej: 08450" value={selectedPostalCode} onChange={(e) => setSelectedPostalCode(e.target.value)}
                                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                                 />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nicho / Sector</label>
                                 <div className="relative">
                                    <select 
                                      value={selectedNiche} onChange={(e) => setSelectedNiche(e.target.value)}
                                      className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:bg-white appearance-none transition-all outline-none"
                                    >
                                       <option>Taller Mecánico</option>
                                       <option>Inmobiliaria</option>
                                       <option>Clínica Dental</option>
                                       <option>Restauración</option>
                                       <option>Gimnasio</option>
                                    </select>
                                    <Search size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                                 </div>
                              </div>
                           </div>

                           <div className="mt-8 flex flex-wrap gap-3">
                              {['pyme', 'empresa', 'autonomo', 'corporativo'].map(type => (
                                 <button 
                                   key={type} onClick={() => setSelectedCompanyType(type as any)}
                                   className={cn(
                                     "px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                                     selectedCompanyType === type ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                                   )}
                                 >
                                    Target: {type}
                                 </button>
                              ))}
                           </div>

                           <div className="mt-10 flex justify-end">
                              <button 
                                onClick={startDeepScan} disabled={scanning}
                                className="px-10 py-4 bg-slate-900 hover:bg-indigo-600 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center gap-4"
                              >
                                 {scanning ? (
                                   <>
                                     <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                     <span>Rastreando Comarca...</span>
                                   </>
                                 ) : (
                                   <>
                                     <Zap size={16} />
                                     <span>Ejecutar Barrido Satelital</span>
                                   </>
                                 )}
                              </button>
                           </div>
                        </div>
                     </div>
                     <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-8 space-y-8">
                           {/* Priority Targets Panel - Now featured more prominently */}
                           <div className="bg-white border border-slate-100 rounded-[3rem] p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.03)] overflow-hidden relative min-h-[550px]">
                              <div className="flex items-center justify-between mb-8">
                                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Objetivos en Radar - {selectedCity}</h3>
                                 <div className="p-2 bg-amber-50 rounded-full"><Sparkles size={14} className="text-amber-500" /></div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 {businesses.length === 0 ? (
                                   <div className="col-span-2 py-32 flex flex-col items-center justify-center opacity-20 text-center">
                                      <div className="p-6 bg-slate-100 rounded-full mb-4"><ZapOff size={32} /></div>
                                      <p className="text-xs font-medium text-slate-400 italic">Sistemas de rastreo en espera.</p>
                                   </div>
                                 ) : businesses.slice(0, 10).map(biz => (
                                   <div key={biz.id} className="flex gap-4 p-5 bg-slate-50/50 border border-slate-50 rounded-[2rem] hover:border-indigo-100 hover:bg-white hover:shadow-xl hover:shadow-indigo-100/30 transition-all group cursor-pointer" onClick={() => setSelectedBusiness(biz)}>
                                      <div className="w-16 h-16 rounded-2xl bg-white overflow-hidden shrink-0 shadow-sm border border-slate-100">
                                         {biz.photoUrl ? <img src={biz.photoUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-300"><Globe size={22} /></div>}
                                      </div>
                                      <div className="flex-1 min-w-0 py-1.5">
                                         <p className="text-sm font-bold truncate text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{biz.name}</p>
                                         <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{biz.neighborhood}</span>
                                            <span className="text-[9px] text-indigo-500 font-bold">V-Score: {biz.score}%</span>
                                         </div>
                                      </div>
                                      <div className="flex items-center px-1">
                                         <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-slate-100 group-hover:border-indigo-200 transition-all group-hover:scale-110">
                                            <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-500 transition-transform" />
                                         </div>
                                      </div>
                                   </div>
                                 ))}
                              </div>
                              <button onClick={() => setActiveTab('leads')} className="w-full mt-10 py-5 text-[11px] font-bold text-indigo-600 bg-indigo-50/50 hover:bg-indigo-600 hover:text-white rounded-2xl transition-all uppercase tracking-[0.2em] active:scale-95">Gestionar Baza Completa</button>
                           </div>
                        </div>

                        <div className="lg:col-span-4 space-y-8">
                           {/* Autopilot Engagement Card */}
                           <div className="bg-indigo-600 rounded-[3rem] p-8 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group h-full flex flex-col justify-between">
                              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
                              <div className="relative z-10">
                                 <div className="inline-block px-4 py-1.5 bg-white/20 rounded-full text-[9px] font-black uppercase tracking-widest mb-6 backdrop-blur-md border border-white/10">Zyndrix Autopilot</div>
                                 <p className="text-2xl font-light leading-tight mb-8 tracking-tight">Analizando métricas de penetración en tiempo real.</p>
                                 <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                       <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"><Target size={18} /></div>
                                       <div>
                                          <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Ubicación</p>
                                          <p className="text-sm font-bold">{selectedCity}</p>
                                       </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                       <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"><Zap size={18} /></div>
                                       <div>
                                          <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Status de Red</p>
                                          <p className="text-sm font-bold">Protocolo Elite Activo</p>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                              <div className="relative z-10 pt-12">
                                 <div className="flex items-center gap-3">
                                    <div className="flex -space-x-3">
                                       {[1,2,3,4].map(v => <div key={v} className="w-10 h-10 rounded-full border-2 border-indigo-600 bg-slate-200 shadow-lg ring-4 ring-indigo-400/10 flex items-center justify-center text-[10px] font-black text-indigo-600">{v}</div>)}
                                    </div>
                                 </div>
                              </div>
                              <Zap size={220} className="absolute -bottom-16 -right-16 text-white opacity-[0.05] rotate-12 group-hover:scale-110 transition-transform duration-700" />
                           </div>
                        </div>
                     </div>
                  </motion.div>
                )}

                {/* 2. LEADS TAB */}
                {activeTab === 'leads' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-7xl mx-auto">
                     <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                           <div>
                              <h2 className="text-3xl font-display font-bold text-slate-900">Base de Inteligencia</h2>
                              <p className="text-slate-400 text-sm mt-1 font-medium">Gestiona y califica tus prospectos extraídos.</p>
                           </div>
                           <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                              {/* Búsqueda Principal */}
                              <div className="flex-1 md:w-64 relative group">
                                 <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                 <input 
                                   className="w-full bg-slate-50 pl-11 pr-4 py-3 rounded-xl border border-slate-100 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-100 outline-none transition-all shadow-sm" 
                                   placeholder="Analizar por nombre o barrio..." 
                                   value={searchQuery}
                                   onChange={(e) => setSearchQuery(e.target.value)}
                                 />
                              </div>

                              {/* Acciones en Masa */}
                              {selectedLeadIds.size > 0 && (
                                <motion.div 
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="flex items-center gap-2"
                                >
                                  <button 
                                    onClick={async () => {
                                      const leadsToBlast = leads.filter(l => selectedLeadIds.has(l.id));
                                      autopilot.addMissionLog(`🚀 INICIANDO DESPLIEGUE MASIVO para ${leadsToBlast.length} objetivos...`, "ai");
                                      
                                      for (const lead of leadsToBlast) {
                                         await processMagic(lead);
                                         // Pequeño delay entre envíos para evitar rate limits
                                         await new Promise(r => setTimeout(r, 1000));
                                      }
                                      
                                      autopilot.addMissionLog(`🏁 OPERACIÓN MASIVA FINALIZADA.`, "success");
                                      setSelectedLeadIds(new Set());
                                    }}
                                    className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 flex items-center gap-2"
                                  >
                                    <Zap size={14} /> Ejecutar Magia ({selectedLeadIds.size})
                                  </button>
                                  <button 
                                    onClick={() => setSelectedLeadIds(new Set())}
                                    className="p-2.5 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 transition-all"
                                  >
                                    <X size={18} />
                                  </button>
                                </motion.div>
                              )}

                              {/* Filtro de Score */}
                              <div className="flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 shadow-sm">
                                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Score Min:</span>
                                 <div className="flex items-center gap-2">
                                    <input 
                                      type="range" min="0" max="100" step="10"
                                      className="w-20 accent-indigo-600 h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer"
                                      value={scoreFilter}
                                      onChange={(e) => setScoreFilter(parseInt(e.target.value))}
                                    />
                                    <span className="text-xs font-black text-indigo-600 w-8">{scoreFilter}%+</span>
                                 </div>
                              </div>

                              {/* Filtro de Estado */}
                              <div className="flex bg-slate-100 p-1 rounded-xl shadow-inner">
                                 {[
                                   { id: 'all', label: 'Todos' },
                                   { id: 'pending', label: 'Pendientes' },
                                   { id: 'contacted', label: 'Fuego' }
                                 ].map((f) => (
                                   <button
                                     key={f.id}
                                     onClick={() => setStatusFilter(f.id as any)}
                                     className={cn(
                                       "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all",
                                       statusFilter === f.id ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                     )}
                                   >
                                     {f.label}
                                   </button>
                                 ))}
                              </div>

                               <div className="flex items-center gap-2">
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Segmentar por Priority</p>
                                  <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
                                     {(['all', 'TIER_1', 'TIER_2', 'TIER_3'] as const).map((t) => (
                                        <button
                                           key={t}
                                           onClick={() => setTierFilter(t)}
                                           className={cn(
                                              "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                              tierFilter === t ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
                                           )}
                                        >
                                           {t === 'all' ? 'Todos' : t.replace('_', ' ')}
                                        </button>
                                     ))}
                                  </div>
                               </div>

                              <button className="p-3 bg-white text-slate-600 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"><Download size={18} /></button>
                           </div>
                        </div>

                        <div className="overflow-x-auto -mx-2">
                           <table className="w-full text-left">
                              <thead>
                                 <tr className="text-[10px] font-black text-slate-400 uppercase border-b border-slate-50">
                                    <th className="pb-6 px-4 w-10">
                                       <input 
                                         type="checkbox" 
                                         checked={selectedLeadIds.size === leads.length && leads.length > 0}
                                         onChange={(e) => {
                                           if (e.target.checked) setSelectedLeadIds(new Set(leads.map(l => l.id)));
                                           else setSelectedLeadIds(new Set());
                                         }}
                                         className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                       />
                                    </th>
                                    <th className="pb-6 px-4">Negocio</th>
                                    <th className="pb-6 px-4">Análisis V-Score</th>
                                    <th className="pb-6 px-4">Estado Operativo</th>
                                    <th className="pb-6 px-4 text-center">Último Contacto</th>
                                    <th className="pb-6 px-4 text-right">Acciones</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-50/50">
                                 {leads
                                   .filter(lead => {
                                      const searchQueryLower = searchQuery.toLowerCase();
                                      const matchesSearch = lead.name.toLowerCase().includes(searchQueryLower) || 
                                                           lead.neighborhood?.toLowerCase().includes(searchQueryLower);
                                      const matchesScore = (lead.score || 0) >= scoreFilter;
                                      const matchesStatus = statusFilter === 'all' ? true : 
                                                          statusFilter === 'contacted' ? lead.email_sent : !lead.email_sent;
                                      const matchesTier = tierFilter === 'all' ? true : (lead as any).tier === tierFilter;
                                      return matchesSearch && matchesScore && matchesStatus && matchesTier;
                                   })
                                   .map((lead, idx) => (
                                   <motion.tr 
                                      key={lead.id} 
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: idx * 0.03 }}
                                      className="group hover:bg-slate-50/80 transition-all cursor-pointer border-b border-slate-50 last:border-0" 
                                      onClick={() => setSelectedBusiness(lead)}
                                   >
                                      <td className="py-6 px-4" onClick={(e) => e.stopPropagation()}>
                                         <input 
                                           type="checkbox" 
                                           checked={selectedLeadIds.has(lead.id)}
                                           onChange={() => {
                                             const next = new Set(selectedLeadIds);
                                             if (next.has(lead.id)) next.delete(lead.id);
                                             else next.add(lead.id);
                                             setSelectedLeadIds(next);
                                           }}
                                           className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                         />
                                      </td>
                                      <td className="py-6 px-4">
                                         <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white overflow-hidden shrink-0 border border-slate-100 group-hover:border-indigo-100 transition-all shadow-sm group-hover:shadow-indigo-100/30">
                                               {lead.photoUrl ? <img src={lead.photoUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><MapPin size={20} /></div>}
                                            </div>
                                            <div>
                                               <div className="flex items-center gap-2">
                                                  <p className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors tracking-tight">{lead.name}</p>
                                                  {lead.follow_up_status === "INTERESTED" && (
                                                     <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                                                  )}
                                               </div>
                                            </div>
                                         </div>
                                      </td>
                                      <td className="py-6 px-4">
                                         <div className="flex items-center gap-4">
                                            <div className="flex-1 max-w-[100px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                               <motion.div 
                                                  initial={{ width: 0 }}
                                                  animate={{ width: `${lead.score || 85}%` }}
                                                  className={cn("h-full rounded-full transition-all duration-1000", (lead.score || 0) > 80 ? "bg-indigo-600" : "bg-amber-500")} 
                                               />
                                            </div>
                                            <span className="font-display font-black text-sm text-slate-700">{lead.score || 85}%</span>
                                         </div>
                                      </td>
                                      <td className="py-6 px-4">
                                         <span className={cn(
                                            "inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm",
                                            lead.follow_up_status === "CLOSED" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                                            lead.follow_up_status === "INTERESTED" ? "bg-emerald-600 text-white border-emerald-400 shadow-emerald-200" :
                                            lead.follow_up_status === "OPENED" ? "bg-amber-400 text-amber-950 border-amber-300" :
                                            lead.follow_up_status === "MEETING" ? "bg-indigo-50 text-indigo-700 border-indigo-100" :
                                            lead.follow_up_status === "CONTACTED" || lead.email_sent ? "bg-slate-100 text-slate-600 border-slate-200" :
                                            lead.follow_up_status === "DISCARDED" ? "bg-slate-50 text-slate-400 border-slate-100" : "bg-blue-50 text-blue-700 border-blue-100"
                                         )}>
                                            {lead.follow_up_status === "CLOSED" ? <ShieldCheck size={12} /> :
                                             lead.follow_up_status === "INTERESTED" ? <Zap size={12} className="animate-pulse" /> :
                                             lead.follow_up_status === "OPENED" ? <Eye size={12} /> :
                                             lead.follow_up_status === "MEETING" ? <Clock size={12} /> :
                                             (lead.follow_up_status === "CONTACTED" || lead.email_sent) ? <CheckCircle2 size={12} /> :
                                             <Zap size={12} className={cn(!lead.email_sent && "animate-pulse")} />}
                                            {lead.follow_up_status || (lead.email_sent ? "CONTACTED" : "NEW")}
                                         </span>
                                      </td>
                                      <td className="py-6 px-4 text-center">
                                         <p className="text-[10px] font-bold text-slate-500">
                                            {(lead as any).last_contacted_at ? new Date((lead as any).last_contacted_at).toLocaleDateString() : '---'}
                                         </p>
                                      </td>
                                      <td className="py-6 px-4 text-right">
                                         <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                            <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-lg hover:shadow-indigo-100/30 rounded-xl transition-all"><Phone size={18} /></button>
                                            <button className="w-10 h-10 flex items-center justify-center text-white bg-slate-900 hover:bg-indigo-600 rounded-xl shadow-lg transition-all"><ArrowRight size={18} /></button>
                                         </div>
                                      </td>
                                   </motion.tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     </div>
                  </motion.div>
                )}

                {/* 3. OUTREACH TAB */}
                {activeTab === 'outreach' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto space-y-8">
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1 space-y-6">
                           <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm h-full">
                              <h3 className="text-xl font-display font-bold mb-6">Pipeline de Outreach</h3>
                                      <div className="space-y-4">
                                 {leads.filter(l => !l.email_sent).slice(0, 5).map(l => (
                                   <div key={l.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 cursor-pointer transition-all" onClick={() => setSelectedBusiness(l)}>
                                      <p className="font-bold text-sm truncate">{l.name}</p>
                                      <div className="flex items-center justify-between mt-2">
                                         <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">{l.neighborhood}</span>
                                         <span className="text-[10px] font-bold text-indigo-600">Listo</span>
                                      </div>
                                   </div>
                                 ))}
                              </div>
                           </div>
                        </div>
                        <div className="lg:col-span-2">
                           <div className="bg-slate-900 rounded-[2.5rem] p-8 min-h-[500px] flex flex-col items-center justify-center text-center group">
                              <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-white/40 mb-6 group-hover:scale-110 transition-transform duration-500">
                                 <Mail size={40} />
                              </div>
                              <h3 className="text-2xl font-display font-bold text-white mb-2">Motor de Outreach Inactivo</h3>
                              <p className="text-slate-400 max-w-sm mb-8">Selecciona un lead de la lista de la izquierda para generar una propuesta supreme instantánea.</p>
                              <div className="flex gap-4">
                                 <button className="px-8 py-4 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-indigo-700 transition-colors">Configurar SMTP</button>
                                 <button className="px-8 py-4 bg-white/5 text-slate-400 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-colors">Ver Plantillas</button>
                              </div>
                           </div>
                        </div>
                     </div>
                  </motion.div>
                 )}

                 {/* 4. ANALYTICS TAB */}
                 {activeTab === 'analytics' && (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto space-y-8">
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          {[
                            { label: 'Impacto Económico Proyectado', val: potentialValue, color: 'bg-emerald-500', icon: BarChart3 },
                            { label: 'Cobertura de Mercado', val: `${marketCoverage}%`, color: 'bg-indigo-500', icon: ShieldCheck },
                            { label: 'Eficiencia de Lead Scoring', val: `${efficiencyRate}%`, color: 'bg-indigo-500', icon: Sparkles },
                          ].map((c, i) => (
                            <div key={i} className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden group">
                               <div className="relative z-10">
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{c.label}</p>
                                  <p className="text-4xl font-display font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{c.val}</p>
                               </div>
                               <c.icon size={120} className="absolute -bottom-8 -right-8 text-slate-50 opacity-[0.4] group-hover:scale-110 transition-transform duration-1000" />
                            </div>
                          ))}
                       </div>
                       
                       <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm h-96 flex items-center justify-center">
                          <div className="text-center opacity-30 italic">
                             <BarChart3 size={48} className="mx-auto mb-4" />
                             <p>Visualizando impacto operacional en tiempo real...</p>
                          </div>
                       </div>
                   </motion.div>
                 )}

              </AnimatePresence>
          </main>

          {/* SIDE-BY-SIDE DETAIL PANEL (Desktop) */}
          <AnimatePresence>
             {selectedBusiness && (
               <motion.aside 
                 initial={{ x: '100%', opacity: 0 }} 
                 animate={{ x: 0, opacity: 1 }} 
                 exit={{ x: '100%', opacity: 0 }}
                 transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                 className="fixed lg:sticky top-0 right-0 h-full w-full lg:w-[500px] bg-white lg:border-l border-slate-100 z-[100] shadow-2xl lg:shadow-none flex flex-col"
               >
                  <div className="h-20 flex items-center justify-between px-8 border-b border-slate-100 shrink-0 bg-white">
                      <div className="flex items-center gap-4">
                         <div className="h-10 border-r border-slate-100 pr-4 mr-1 flex items-center">
                            <img src="/img/logofinal2.jpg" className="h-8 w-auto object-contain" alt="Zyndrix" />
                         </div>
                         <div className="flex flex-col">
                            <span className="font-display font-black text-[11px] text-slate-900 uppercase tracking-[0.2em]">Lead Analysis</span>
                            <span className="text-[9px] text-indigo-500 font-bold uppercase tracking-widest">Zyndrix Engine v4.0</span>
                         </div>
                      </div>
                      <button onClick={() => setSelectedBusiness(null)} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-rose-500"><X size={20} /></button>
                   </div>
                  
                  <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                     <div className="flex gap-6 items-start">
                        <div className="w-24 h-24 rounded-[2rem] bg-slate-50 border border-slate-100 overflow-hidden shrink-0 shadow-lg shadow-slate-100 relative group">
                           {selectedBusiness.photoUrl ? <img src={selectedBusiness.photoUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><MapPin size={32} /></div>}
                        </div>
                        <div className="py-2">
                           <h2 className="text-2xl font-display font-bold text-slate-900 leading-tight">{selectedBusiness.name}</h2>
                           <div className="mt-2 flex items-center gap-2">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">{selectedBusiness.neighborhood}</p>
                           </div>
                        </div>
                     </div>

                     <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-indigo-200/20">
                        <div className="relative z-10 flex justify-between items-end mb-4">
                           <div>
                              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] block mb-1">Conversion Priority</span>
                              <span className="text-4xl font-display font-black tracking-tighter">{selectedBusiness.score || 85}%</span>
                           </div>
                           <ShieldCheck size={32} className="text-indigo-500/50" />
                        </div>
                        
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden relative mb-4">
                           <motion.div 
                             initial={{ width: 0 }} animate={{ width: `${selectedBusiness.score || 85}%` }} transition={{ duration: 1.5, delay: 0.2 }}
                             className="h-full bg-gradient-to-r from-indigo-500 to-indigo-300 rounded-full" 
                           />
                        </div>
                        
                        <p className="text-xs text-slate-400 font-medium italic leading-relaxed">
                           "{selectedBusiness.score && selectedBusiness.score > 80 ? "Negocio con alta presencia visual pero debilidad crítica en automatización. Oportunidad Tier 1." : "Perfil de optimización moderada. Se requiere refuerzo operativo en captación digital."}"
                        </p>
                        <Zap size={100} className="absolute -bottom-6 -right-6 text-white opacity-[0.03] group-hover:scale-125 transition-transform duration-1000" />
                     </div>

                     {/* MARKET INTELLIGENCE BLOCK */}
                     <div className="p-6 bg-indigo-50/50 rounded-[2rem] border border-indigo-100 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-4 relative z-10">
                           <p className="text-[10px] font-black text-indigo-900 uppercase tracking-[0.15em] flex items-center gap-2">
                              <BarChart3 size={12} /> Market Intelligence
                           </p>
                           <span className="px-2 py-0.5 bg-indigo-100 text-[8px] font-black text-indigo-600 rounded-md uppercase tracking-tighter">Live Benchmark</span>
                        </div>
                        <div className="grid grid-cols-2 gap-6 relative z-10">
                           <div>
                              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight mb-1">Market Leader</p>
                              <div className="flex items-center gap-1.5">
                                 <Star size={12} className="text-amber-400 fill-amber-400" />
                                 <p className="text-lg font-black text-slate-800">{selectedBusiness.marketLeaderRef || '4.8'} <span className="text-[10px] text-slate-400 uppercase">Rating</span></p>
                              </div>
                           </div>
                           <div>
                              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight mb-1">Competitive GAP</p>
                              <div className="flex items-center gap-1.5">
                                 <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                 <p className="text-lg font-black text-rose-600">-{selectedBusiness.competitorGap?.toFixed(1) || '0.6'} <span className="text-[10px] opacity-70 uppercase tracking-tighter">Ptos</span></p>
                              </div>
                           </div>
                        </div>
                        <Zap size={60} className="absolute -top-4 -right-4 text-indigo-200 opacity-20 rotate-12" />
                     </div>

                     {/* DIGITAL FOOTPRINT & TECH STACK */}
                     <div className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] space-y-4">
                        <div>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                              <Terminal size={12} /> Tech Stack Detectado
                           </p>
                           <div className="flex flex-wrap gap-2">
                              {selectedBusiness.techStack && (selectedBusiness.techStack as string[]).length > 0 ? (
                                 (selectedBusiness.techStack as string[]).map((tech: string, i: number) => (
                                    <span key={i} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-bold text-slate-600 uppercase">
                                       {tech}
                                    </span>
                                 ))
                              ) : (
                                 <span className="text-[10px] text-slate-400 italic">No se detectaron tecnologías modernas</span>
                              )}
                           </div>
                        </div>
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Presencia Social</p>
                           <div className="flex gap-3">
                              <Globe size={14} className={selectedBusiness.signals?.instagram ? "text-indigo-500" : "text-opacity-20 text-slate-400"} />
                              <Users size={14} className={selectedBusiness.signals?.linkedin ? "text-indigo-500" : "text-opacity-20 text-slate-400"} />
                              <Mail size={14} className={selectedBusiness.email ? "text-indigo-500" : "text-opacity-20 text-slate-400"} />
                           </div>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                           <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Web Status</p>
                              <div className="flex items-center gap-2 group cursor-pointer">
                                 <Globe size={14} className="text-rose-500" />
                                 <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-600 underline">No Segura</span>
                              </div>
                           </div>
                           <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Llamadas</p>
                              <div className="flex items-center gap-2">
                                 <Phone size={14} className="text-emerald-500" />
                                 <span className="text-xs font-bold text-slate-700">{selectedBusiness.phone || "No Registrado"}</span>
                              </div>
                           </div>
                        </div>
                     </div>

                     {selectedBusiness.stitch_preview_url && (
                        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-between group">
                           <div className="flex items-center gap-3">
                              <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><Globe size={16} /></div>
                              <div>
                                 <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Prototipo Listo</p>
                                 <p className="text-[9px] text-emerald-600 font-bold truncate max-w-[150px]">{selectedBusiness.stitch_preview_url}</p>
                              </div>
                           </div>
                           <a 
                             href={selectedBusiness.stitch_preview_url} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="p-2 hover:bg-emerald-100 rounded-lg text-emerald-600 transition-colors"
                           >
                              <ArrowRight size={16} />
                           </a>
                        </div>
                     )}

                     <div className="grid grid-cols-1 gap-4 pt-4">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group">
                           <div className="flex-1">
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                                 Estado del Lead <Target size={10} />
                              </p>
                              <select 
                                value={selectedBusiness.follow_up_status || (selectedBusiness.email_sent ? 'CONTACTED' : 'NEW')}
                                onChange={(e) => {
                                   const nextStatus = e.target.value;
                                   const updated = { ...selectedBusiness, follow_up_status: nextStatus };
                                   setSelectedBusiness(updated);
                                   updateBusinessInLists(updated);
                                   syncLead(updated);
                                }}
                                className="bg-transparent border-none text-xs font-bold text-slate-700 w-full focus:ring-0 p-0 cursor-pointer appearance-none"
                              >
                                 <option value="NEW">🆕 NEW (Radar)</option>
                                 <option value="CONTACTED">📩 CONTACTED (Fuego)</option>
                                 <option value="QUALIFIED">💎 QUALIFIED</option>
                                 <option value="INTERESTED">🔥 INTERESTED</option>
                                 <option value="MEETING">🤝 MEETING</option>
                                 <option value="CLOSED">🏆 CLOSED</option>
                                 <option value="DISCARDED">🌑 DISCARDED</option>
                              </select>
                           </div>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group">
                           <div className="flex-1">
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                                 Lead Email <Mail size={10} />
                              </p>
                              <div className="flex items-center gap-2">
                                 <input 
                                    type="email"
                                    value={selectedBusiness.email || ""}
                                    onChange={(e) => {
                                       const updated = { ...selectedBusiness, email: e.target.value };
                                       setSelectedBusiness(updated);
                                       updateBusinessInLists(updated);
                                    }}
                                    onBlur={() => syncLead(selectedBusiness)}
                                    placeholder="Capturar email..."
                                    className="bg-transparent border-none text-xs font-bold text-slate-700 w-full focus:ring-0 p-0 placeholder:text-slate-300"
                                 />
                                 {selectedBusiness.discovery_method === 'scraped' && (
                                    <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md uppercase tracking-tighter">AI Scraped</span>
                                 )}
                              </div>
                           </div>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                              Notas Estratégicas <MessageSquare size={10} />
                           </p>
                           <textarea 
                              value={selectedBusiness.notes || ""}
                              onChange={(e) => {
                                 const updated = { ...selectedBusiness, notes: e.target.value };
                                 setSelectedBusiness(updated);
                                 updateBusinessInLists(updated);
                              }}
                              onBlur={() => syncLead(selectedBusiness)}
                              placeholder="Añadir observaciones para el pitch..."
                              className="bg-transparent border-none text-[11px] font-medium text-slate-600 w-full focus:ring-0 p-0 placeholder:text-slate-300 min-h-[60px] resize-none"
                           />
                        </div>
                     </div>
                        <button 
                          onClick={() => setShowReportPreview(true)}
                          className="h-16 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 font-bold text-xs uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2"
                        >
                           <FileText size={18} /> Ver Auditoría Técnica
                        </button>
                        <button 
                          onClick={() => processMagic(selectedBusiness)}
                          disabled={!selectedBusiness.email}
                          className={cn(
                             "h-20 font-black text-[11px] uppercase tracking-[0.35rem] rounded-[2rem] shadow-2xl transition-all flex items-center justify-center gap-4 group active:scale-[0.98]",
                             selectedBusiness.email 
                               ? "bg-indigo-600 hover:bg-slate-900 text-white shadow-indigo-200 hover:shadow-slate-300" 
                               : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                          )}
                        >
                           <Zap size={20} className={selectedBusiness.email ? "group-hover:animate-pulse" : ""} /> 
                           <span>Ejecutar Magia</span>
                        </button>
                      </div>

                  <div className="p-8 border-t border-slate-100 bg-slate-50/50">
                     <button className="w-full h-16 bg-slate-900 text-white font-black text-xs uppercase tracking-[0.25em] rounded-2xl shadow-xl hover:translate-y-[-2px] active:scale-95 transition-all">
                        Inyectar Motor IA
                     </button>
                  </div>
               </motion.aside>
             )}
          </AnimatePresence>
        </div>

        {/* Bottom Nav Mobile */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 h-24 bg-white/80 backdrop-blur-2xl border-t border-slate-100 flex items-center justify-around z-[120] px-6 pb-4">
           {navItems.map(item => (
             <button 
               key={item.id} onClick={() => setActiveTab(item.id as TabType)}
               className={cn("flex flex-col items-center gap-1.5 transition-all duration-300", activeTab === item.id ? "text-indigo-600 scale-110" : "text-slate-400 opacity-60")}
             >
               <item.icon size={22} className={activeTab === item.id ? "drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" : ""} />
               <span className="text-[9px] font-black uppercase tracking-tighter">{item.label}</span>
             </button>
           ))}
        </div>
      </div>

      {/* Global Modals */}
      <AnimatePresence>
        {showReportPreview && selectedBusiness && (
          <div className="fixed inset-0 z-[500] bg-slate-900/40 backdrop-blur-xl flex items-center justify-center p-4">
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
               className="w-full max-w-5xl bg-white rounded-[3rem] shadow-2xl overflow-hidden relative max-h-[95vh] border border-white/20"
             >
                <div className="absolute top-8 right-8 z-50 flex items-center gap-3">
                   <button 
                     onClick={async () => {
                        if (selectedBusiness) {
                           await generatePDF('technical-report-content', `Auditoria-Tecnica-${selectedBusiness.name.replace(/\s+/g, '-')}`);
                        }
                     }}
                     className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-widest rounded-full transition-all shadow-xl shadow-indigo-200"
                   >
                     <Download size={18} /> Descargar Auditoría
                   </button>
                   <button 
                     onClick={() => setShowReportPreview(false)}
                     className="p-3 bg-slate-100/80 backdrop-blur-md hover:bg-rose-50 hover:text-rose-600 rounded-full transition-all border border-slate-200"
                   >
                     <X size={20} />
                   </button>
                </div>
                <div className="overflow-y-auto h-full p-8 md:p-12 custom-scrollbar">
                   <TechnicalReport business={selectedBusiness} onDownload={() => {}} />
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@600;700;800&display=swap');
      `}</style>
    </div>
  );
}
