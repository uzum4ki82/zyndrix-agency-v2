"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBusinesses } from "@/hooks/useBusinesses";
import { useAutopilot } from "@/hooks/use-autopilot";
import { getLeads, syncLead } from "@/lib/supabase";
import { BarChart3, ShieldCheck } from "lucide-react";

// Components
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { TargetingPanel } from "@/components/dashboard/TargetingPanel";
import { LeadsTable } from "@/components/dashboard/LeadsTable";
import { AssetsManagementTable } from "@/components/dashboard/AssetsManagementTable";
import { LeadDetailSidebar } from "@/components/dashboard/LeadDetailSidebar";
import { LiveOperationsFeed } from "@/components/dashboard/LiveOperationsFeed";
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
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [isProcessingOutreach, setIsProcessingOutreach] = useState(false);
  const [isGeneratingSite, setIsGeneratingSite] = useState(false);

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
    selectedCompanyType: 'empresa' as any,
    onLeadSynced: (synced) => {
       setLeads(prev => [synced, ...prev.filter(l => l.id !== synced.id)]);
    }
  });

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      const data = await getLeads();
      if (data) setLeads(data as any);
    };
    fetchInitialData();
  }, [setLeads]);

  const handleSearch = async () => {
    if (!niche || (!city && !province)) return;
    setIsSearching(true);
    
    // Construct exact location string
    const finalLocation = `${city || ''} ${province || ''} ${postalCode || ''} España`.trim().replace(/\s+/g, ' ');
    setLocation(finalLocation);

    autopilot.addOperationLog(`📡 Desplegando rastreo sectorial: ${niche} en ${finalLocation}...`, "ai", true);
    
    try {
      const res = await fetch('/api/engine/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, location: finalLocation })
      });
      const data = await res.json();
      if (data && data.length > 0) {
        addBusinesses(data);
        // Persist to Supabase
        for (const biz of data) {
           await syncLead(biz);
        }
        autopilot.addOperationLog(`✅ Inteligencia de mercado procesada. ${data.length} objetivos detectados.`, "success");
      }
    } catch (err) {
      autopilot.addOperationLog(`❌ Error en despliegue de rastreo.`, "error");
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

  const handleGenerateSite = async (lead: any) => {
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
        updateBusinessInLists(updated);
        await syncLead(updated);
        
        // Abrir el preview en pestaña nueva
        window.open(data.previewUrl, '_blank');
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
          {activeTab === 'commander' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-7xl mx-auto">
              <StatsGrid 
                leadsCount={leads.length} 
                highConversionCount={leads.filter(l => (l.score || 0) > 80).length}
                outreachCount={leads.filter(l => l.email_sent).length}
                efficiencyRate={`${leads.length > 0 ? Math.round((leads.filter(l => (l.score || 0) > 80).length / leads.length) * 100) : 0}%`}
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                <LiveOperationsFeed />
              </div>

              <div className="grid grid-cols-1 gap-10">
                  <LeadsTable 
                    leads={businesses.length > 0 ? 
                      businesses.slice(0, 10).map(b => ({ 
                        ...b, 
                        id: b.id?.toString() || crypto.randomUUID(), 
                        tier: (b as any).tier || 'TIER 3', 
                        score: b.score || 45 
                      })) : 
                      leads.slice(0, 10).map(l => ({
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
                  />
              </div>
            </motion.div>
          )}

          {activeTab === 'leads' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-7xl mx-auto space-y-8">
               <div className="flex flex-col gap-1">
                 <h2 className="text-2xl font-bold tracking-tight text-slate-900">Repositorio de Inteligencia Operativa</h2>
                 <p className="text-sm text-slate-500 font-medium">Historial completo de entidades detectadas y estados de prospección estratégica.</p>
               </div>
               <LeadsTable 
                 leads={leads as any} 
                 onSelectLead={setSelectedLead}
                 onSendOutreach={handleSendOutreach}
                 selectedLeadId={selectedLead?.id}
               />
            </motion.div>
          )}

          {activeTab === 'outreach' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-7xl mx-auto space-y-8">
               <div className="flex flex-col gap-1">
                 <h2 className="text-2xl font-bold tracking-tight text-slate-900">Despliegues Activos</h2>
                 <p className="text-sm text-slate-500 font-medium">Control en tiempo real de los activos digitales proyectados hacia entidades TIER 1 y TIER 2.</p>
               </div>
               <LeadsTable 
                 leads={leads.filter(l => l.email_sent) as any} 
                 onSelectLead={setSelectedLead}
                 selectedLeadId={selectedLead?.id}
               />
            </motion.div>
          )}

          {activeTab === 'sites' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto space-y-8">
               <div className="flex flex-col gap-1">
                 <h2 className="text-2xl font-bold tracking-tight text-slate-900">Consola de Activos Generados</h2>
                 <p className="text-sm text-slate-500 font-medium">Gestión administrativa de los sitios web operativos y prototipos desplegados.</p>
               </div>
               <AssetsManagementTable 
                 assets={leads.filter(l => l.stitch_preview_url) as any} 
                 onToggleStatus={handleToggleSiteStatus}
                 onPreview={(asset) => window.open(asset.stitch_preview_url, '_blank')}
               />
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-7xl mx-auto py-20 flex flex-col items-center text-center">
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
        </main>

        <AnimatePresence>
          {selectedLead && (
            <LeadDetailSidebar 
              lead={selectedLead} 
              onClose={() => setSelectedLead(null)} 
              onSendOutreach={handleSendOutreach}
              onGenerateSite={handleGenerateSite}
              isProcessing={isProcessingOutreach}
              isGenerating={isGeneratingSite}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
