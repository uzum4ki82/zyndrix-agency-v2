"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBusinesses } from "@/hooks/useBusinesses";
import { useAutopilot } from "@/hooks/use-autopilot";
import { supabase, getLeads, syncLead } from "@/lib/supabase";
import { BarChart3, ShieldCheck, Palette, Zap } from "lucide-react";

// Components
import { Business } from "@/types";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { TargetingPanel } from "@/components/dashboard/TargetingPanel";
import { LeadsTable } from "@/components/dashboard/LeadsTable";
import { AssetsManagementTable } from "@/components/dashboard/AssetsManagementTable";
import { LeadDetailSidebar } from "@/components/dashboard/LeadDetailSidebar";
import { LiveOperationsFeed } from "@/components/dashboard/LiveOperationsFeed";
import { ImmersivePreview } from "@/components/dashboard/ImmersivePreview";
import { navItems } from "@/lib/constants";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'commander' | 'leads' | 'sites' | 'outreach' | 'analytics'>('commander');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [niche, setNiche] = useState('Auditorías de Lujo');
  const [location, setLocation] = useState('Sant Antoni de Vilamajor, Barcelona');
  const [province, setProvince] = useState('Barcelona');
  const [city, setCity] = useState('Sant Antoni de Vilamajor');
  const [postalCode, setPostalCode] = useState('');
  const [selectedLead, setSelectedLead] = useState<Business | null>(null);
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [isProcessingOutreach, setIsProcessingOutreach] = useState(false);
  const [isGeneratingSite, setIsGeneratingSite] = useState(false);
  const [fullPreviewUrl, setFullPreviewUrl] = useState<string | null>(null);

  const {
    businessList: businesses,
    setBusinessList: setBusinesses,
    leadsList: leads,
    setLeadsList: setLeads,
    addBusinesses,
    updateBusinessInLists
  } = useBusinesses();

  const autopilot = useAutopilot({ 
    leads: businesses, 
    selectedNiche: niche, 
    location: location,
    selectedCompanyType: 'empresa' as 'empresa' | 'pyme' | 'autonomo' | 'corporativo',
    onLeadSynced: (synced) => {
       setLeads(prev => [synced, ...prev.filter(l => l.id !== synced.id)]);
    }
  });

  // Initial data fetch and real-time subscription
  useEffect(() => {
    const fetchInitialData = async () => {
      const data = await getLeads();
      if (data) setLeads(data as Business[]);
    };
    fetchInitialData();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('public:leads')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setLeads(prev => [payload.new as Business, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setLeads(prev => prev.map(l => l.id === payload.new.id ? { ...l, ...payload.new } : l));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [setLeads]);

  const handleSearch = async () => {
    if (!niche || (!city && !province)) return;
    setIsSearching(true);
    
    // Construct exact location string avoiding duplicates
    const finalLocation = Array.from(new Set([city, province, postalCode, 'España']))
      .filter(Boolean)
      .join(' ')
      .trim()
      .replace(/\s+/g, ' ');
    
    setLocation(finalLocation);

    autopilot.addOperationLog(`📡 Desplegando rastreo sectorial: ${niche} en ${finalLocation}...`, "ai", true);
    
    try {
      const res = await fetch('/api/engine/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, location: finalLocation, companyType: 'empresa' })
      });
      
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }
      
      const data = await res.json();
      if (data && data.length > 0) {
        addBusinesses(data);
        // Persist to Supabase
        for (const biz of data) {
           await syncLead(biz);
        }
        autopilot.addOperationLog(`✅ Inteligencia de mercado procesada. ${data.length} objetivos detectados.`, "success");
      } else {
        autopilot.addOperationLog(`⚠️ No se detectaron objetivos válidos para esta configuración.`, "warning");
      }
    } catch (err: any) {
      console.error('Search Error:', err);
      autopilot.addOperationLog(`❌ Error en despliegue: ${err.message || 'Fallo de conexión'}`, "error");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSendOutreach = async (leadId: string, type: string = 'impact') => {
    const lead = leads.find(l => l.id === leadId) || businesses.find(b => b.id === leadId);
    if (!lead) return;

    setIsProcessingOutreach(true);
    const logMsg = type === 'followup' 
      ? `🛰️ Re-impactando a ${lead.name} con Protocolo de Seguimiento...` 
      : `🛰️ Generando Activo Digital Strategic para ${lead.name}...`;
    
    autopilot.addOperationLog(logMsg, "ai");

    try {
      // 1. Obtener o Generar preview con Stitch
      let previewUrl = lead.stitch_preview_url;
      let screenshot = lead.screenshot_url;

      if (!previewUrl) {
        const stitchRes = await fetch('/api/engine/stitch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ business: lead })
        });
        const stitchData = await stitchRes.json();
        previewUrl = stitchData.previewUrl;
        screenshot = stitchData.screenshotUrl || lead.screenshot_url;
      }

      // 2. Enviar email (Impacto o Seguimiento)
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: lead.email,
          name: lead.name,
          id: lead.id,
          type: type,
          location: lead.neighborhood || lead.address || location,
          isTest: false,
          analysisData: {
             strategicImpact: 'HIGH_CONVERSION',
             techStack: lead.tech_stack || 'Legacy Infrastructure',
             stitchPreviewUrl: previewUrl,
             screenshotUrl: screenshot,
             signals: lead.signals || (lead.intel && lead.intel.signals)
          }
        })
      });

      if (res.ok) {
        const successLog = type === 'followup'
          ? `✅ Refuerzo estratégico enviado a ${lead.name}.`
          : `🚀 Propuesta estratégica desplegada con éxito.`;
          
        autopilot.addOperationLog(successLog, "success");
        
        const now = new Date().toISOString();
        const updated = { 
          ...lead, 
          email_sent: true, 
          last_outreach_at: now,
          stitch_preview_url: previewUrl,
          screenshot_url: screenshot
        };
        
        updateBusinessInLists(updated);
        await syncLead(updated);
        
        // Update selected lead to refresh UI
        if (selectedLead?.id === leadId) {
          setSelectedLead(updated);
        }
      }
    } catch (error) {
       autopilot.addOperationLog(`⚠️ Error en operación de outreach.`, "error");
    } finally {
      setIsProcessingOutreach(false);
    }
  };

  const handleGenerateSite = async (lead: Business) => {
    setIsGeneratingSite(true);
    autopilot.addOperationLog(`🎨 Iniciando modelado arquitectónico para ${lead.name}...`, "ai");

    try {
      const res = await fetch('/api/engine/stitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business: lead })
      });
      const data = await res.json();
      
      if (data.success) {
        autopilot.addOperationLog(`🏛️ Activo Digital "${data.projectId}" generado en el motor Stitch.`, "success");
        const updated = { 
          ...lead, 
          stitch_preview_url: data.previewUrl, 
          stitch_project_id: data.stitchProjectId,
          projectId: data.projectId 
        };
        setLeads(prev => prev.map(l => l.id === lead.id ? updated : l));
        
        // Entrar en modo inmersivo directamente
        setFullPreviewUrl(data.previewUrl);
      }
    } catch (error) {
      autopilot.addOperationLog(`⚠️ Fallo en la generación del activo.`, "error");
    } finally {
      setIsGeneratingSite(false);
    }
  };

  const handleToggleSiteStatus = async (leadId: string, currentStatus: boolean) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    const updated = { ...lead, site_active: !currentStatus };
    updateBusinessInLists(updated);
    
    autopilot.addOperationLog(`🔄 Cambiando estado del activo ${lead.name}: ${!currentStatus ? 'ACTIVADO' : 'DESACTIVADO'}`, "info");
    
    try {
      await syncLead(updated);
    } catch (err) {
      autopilot.addOperationLog(`⚠️ Error al sincronizar estado del activo.`, "error");
    }
  };

  return (
    <div className="flex h-screen bg-[#FDFDFF] overflow-hidden">
      <DashboardSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />

      <div className="flex-1 flex flex-col min-w-0 relative">
        <DashboardHeader 
          onOpenSidebar={() => setIsSidebarOpen(true)} 
          activeTitle={navItems.find(n => n.id === activeTab)?.label || activeTab} 
        />

        <main className="flex-1 overflow-y-auto p-8 space-y-8">
          <AnimatePresence mode="wait">
            {activeTab === 'commander' && (
              <motion.div key="commander" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8 max-w-7xl mx-auto">
              <StatsGrid 
                leadsCount={leads.length} 
                highConversionCount={leads.filter(l => (l.score || 0) > 80).length}
                outreachCount={leads.filter(l => l.email_sent).length}
                efficiencyRate={`${leads.length > 0 ? Math.round((leads.filter(l => (l.score || 0) > 80).length / leads.length) * 100) : 0}%`}
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="backdrop-blur-md bg-white/30 border border-white/20 rounded-2xl p-6 shadow-xl">
                  <TargetingPanel
                    query={niche}
                    setQuery={setNiche}
                    location={location}
                    setLocation={setLocation}
                    province={province}
                    setProvince={setProvince}
                    city={city}
                    setCity={setCity}
                    postalCode={postalCode}
                    setPostalCode={setPostalCode}
                    isSearching={isSearching}
                    onSearch={handleSearch}
                  />
                </div>
                <div className="backdrop-blur-md bg-white/30 border border-white/20 rounded-2xl shadow-xl overflow-hidden">
                  <LiveOperationsFeed />
                </div>
              </div>

              {selectedLead?.extracted_colors && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="backdrop-blur-md bg-white/30 border border-white/20 rounded-2xl p-8 shadow-xl"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Palette className="text-indigo-600" size={24} />
                    <h3 className="text-lg font-bold text-slate-900">Visual DNA - {selectedLead.name}</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-16 h-16 rounded-xl shadow-lg mb-3 border-2 border-white/40"
                        style={{ backgroundColor: selectedLead.extracted_colors.primary || '#6366f1' }}
                      />
                      <p className="text-xs font-medium text-slate-600">Primary</p>
                      <p className="text-xs text-slate-500">{selectedLead.extracted_colors.primary || '#6366f1'}</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div
                        className="w-16 h-16 rounded-xl shadow-lg mb-3 border-2 border-white/40"
                        style={{ backgroundColor: selectedLead.extracted_colors.secondary || '#10b981' }}
                      />
                      <p className="text-xs font-medium text-slate-600">Secondary</p>
                      <p className="text-xs text-slate-500">{selectedLead.extracted_colors.secondary || '#10b981'}</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div
                        className="w-16 h-16 rounded-xl shadow-lg mb-3 border-2 border-white/40"
                        style={{ backgroundColor: selectedLead.extracted_colors.background || '#020617' }}
                      />
                      <p className="text-xs font-medium text-slate-600">Background</p>
                      <p className="text-xs text-slate-500">{selectedLead.extracted_colors.background || '#020617'}</p>
                    </div>
                  </div>
                  {selectedLead.business_dna && (
                    <div className="mt-6 pt-6 border-t border-white/20 flex items-start gap-3">
                      <Zap className="text-amber-500 mt-1 flex-shrink-0" size={20} />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{selectedLead.business_dna.strategic_angle}</p>
                        <p className="text-xs text-slate-600 mt-1">Vibe: {selectedLead.business_dna.vibe}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              <div className="grid grid-cols-1 gap-10">
                  <LeadsTable
                    leads={leads.map(l => ({
                        ...l,
                        id: l.id.toString(),
                        tier: (l as any).tier || 'TIER 2',
                        score: l.score || 85,
                        email_sent: l.email_sent
                      }))
                    }
                    onSelectLead={setSelectedLead}
                    onSendOutreach={handleSendOutreach}
                    selectedLeadId={selectedLead?.id}
                    selectedLeadIds={selectedLeadIds}
                    onToggleSelect={(id) => {
                      setSelectedLeadIds(prev =>
                        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
                      );
                    }}
                    onSelectAll={(ids) => setSelectedLeadIds(ids)}
                    onPreview={(asset) => setFullPreviewUrl(asset.stitch_preview_url || null)}
                  />
              </div>
            </motion.div>
          )}

            {activeTab === 'leads' && (
              <motion.div key="leads" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-7xl mx-auto space-y-8">
               <div className="flex flex-col gap-1">
                 <h2 className="text-2xl font-bold tracking-tight text-slate-900">Repositorio de Inteligencia Operativa</h2>
                 <p className="text-sm text-slate-500 font-medium">Historial completo de entidades detectadas y estados de prospección estratégica.</p>
               </div>
               <LeadsTable 
                 leads={leads} 
                 onSelectLead={setSelectedLead}
                 onSendOutreach={handleSendOutreach}
                 selectedLeadId={selectedLead?.id}
                 onPreview={(asset) => setFullPreviewUrl(asset.stitch_preview_url || null)}
               />
            </motion.div>
          )}

            {activeTab === 'outreach' && (
              <motion.div key="outreach" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-7xl mx-auto space-y-8">
               <div className="flex flex-col gap-1">
                 <h2 className="text-2xl font-bold tracking-tight text-slate-900">Despliegues Activos</h2>
                 <p className="text-sm text-slate-500 font-medium">Control en tiempo real de los activos digitales proyectados hacia entidades TIER 1 y TIER 2.</p>
               </div>
               <LeadsTable 
                 leads={leads.filter(l => l.email_sent)} 
                 onSelectLead={setSelectedLead}
                 onSendOutreach={handleSendOutreach}
                 selectedLeadId={selectedLead?.id}
                 onPreview={(asset) => setFullPreviewUrl(asset.stitch_preview_url || null)}
               />
            </motion.div>
          )}

            {activeTab === 'sites' && (
              <motion.div key="sites" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-7xl mx-auto space-y-8">
               <div className="flex flex-col gap-1">
                 <h2 className="text-2xl font-bold tracking-tight text-slate-900">Consola de Activos Generados</h2>
                 <p className="text-sm text-slate-500 font-medium">Gestión administrativa de los sitios web operativos y prototipos desplegados.</p>
               </div>
               <AssetsManagementTable 
                 assets={leads.filter(l => l.stitch_preview_url)} 
                 onToggleStatus={handleToggleSiteStatus}
                 onPreview={(asset) => setFullPreviewUrl(asset.stitch_preview_url || null)}
               />
            </motion.div>
          )}

            {activeTab === 'analytics' && (
              <motion.div key="analytics" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="max-w-7xl mx-auto py-20 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 mb-8 border border-indigo-100 shadow-sm">
                <BarChart3 size={40} />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">Inteligencia y Métricas Avanzadas</h2>
              <p className="text-slate-500 max-w-lg mx-auto font-medium leading-relaxed">
                El sistema de modelado predictivo está procesando actualmente la huella digital del sector seleccionado. Los KPI de conversión se activarán automáticamente tras el primer despliegue masivo.
              </p>
              <div className="mt-12 group cursor-pointer">
                 <div className="px-8 py-3 bg-[#0F172A] text-white rounded-xl text-sm font-bold shadow-xl hover:bg-slate-800 transition-all flex items-center gap-3">
                   <ShieldCheck size={18} className="text-indigo-400" />
                   Solicitar Reporte de Viabilidad Exclusivo
                 </div>
              </div>
            </motion.div>
            )}
          </AnimatePresence>
        </main>

        <AnimatePresence>
          {selectedLead && (
            <LeadDetailSidebar 
              lead={selectedLead} 
              onClose={() => setSelectedLead(null)} 
              onSendOutreach={handleSendOutreach}
              onGenerateSite={handleGenerateSite}
              onPreview={(asset) => setFullPreviewUrl(asset.stitch_preview_url || null)}
              isProcessing={isProcessingOutreach}
              isGenerating={isGeneratingSite}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {fullPreviewUrl && (
            <ImmersivePreview 
              url={fullPreviewUrl} 
              onClose={() => setFullPreviewUrl(null)} 
              businessName={leads.find(l => l.stitch_preview_url === fullPreviewUrl)?.name || "Bespoke Demo"}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
