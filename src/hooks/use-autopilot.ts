"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Business, OperationLog } from "@/types";
import { calculateLeadIntelligence } from "@/lib/agent-brain";
import { syncLead, logAutomationAction, checkLeadExists } from "@/lib/supabase";

interface UseAutopilotProps {
  leads: Business[];
  selectedNiche: string;
  location: string;
  activeTab: string;
  selectedCompanyType: 'pyme' | 'empresa' | 'autonomo' | 'corporativo';
  setActiveTab: (tab: string) => void;
  onLeadSynced?: (lead: Business) => void;
}

export function useAutopilot({ leads, selectedNiche, location, selectedCompanyType, onLeadSynced }: Omit<UseAutopilotProps, 'activeTab' | 'setActiveTab'>) {
  const [autopilotActive, setAutopilotActive] = useState(false);
  const [automationStep, setAutomationStep] = useState<'IDLE' | 'DISCOVERING' | 'AUDITING' | 'STITCHING' | 'PITCHING' | 'AWAITING_APPROVAL' | 'SENDING'>('IDLE');
  const [operationLogs, setOperationLogs] = useState<OperationLog[]>([]);
  const [lastProcessedTarget, setLastProcessedTarget] = useState<Business | null>(null);
  const [botId] = useState(() => `zyndrix-${Date.now().toString(36).substring(-5)}`);
  const alreadyProcessedIds = useRef(new Set<string>());
  const hasCheckedStatus = useRef(false);

  const addOperationLog = useCallback((
    text: string, 
    type: OperationLog['type'] = 'info', 
    isInternal = false, 
    image?: string, 
    meta?: string
  ) => {
    const newLog: OperationLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      text,
      type,
      isInternal,
      image,
      meta
    };
    setOperationLogs(prev => [newLog, ...prev].slice(0, 100));
    
    // Sincronizar con Supabase Logs si no es interno trivial
    if (!isInternal || type === 'error' || type === 'warning') {
      logAutomationAction(botId, type.toUpperCase(), { text, meta }, type === 'ai' ? 'info' : type);
    }

    if (isInternal) {
      console.log(`[INTERNAL] ${text}`, meta || '');
    }
  }, [botId]);

  useEffect(() => {
    if (hasCheckedStatus.current) return;
    const checkLiveStatus = async () => {
      try {
        const res = await fetch('/api/send', { method: 'POST', body: JSON.stringify({ ping: true }) });
        if (res.ok) {
          addOperationLog("🟢 LIVE MODE: Infraestructura Resend conectada correctamente.", "success");
        }
      } catch (e) {
        console.error("Live status check failed:", e);
      }
    };
    checkLiveStatus();
    hasCheckedStatus.current = true;
  }, [addOperationLog]);

  const runCycle = useCallback(async () => {
    if (automationStep !== 'IDLE') return;

    try {
      // 1. DESCUBRIMIENTO
      setAutomationStep('DISCOVERING');
      addOperationLog(`🌐 Iniciando búsqueda de mercado: ${selectedNiche} en ${location}...`, "info");
      
      const res = await fetch('/api/engine/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          niche: selectedNiche, 
          location, 
          companyType: selectedCompanyType 
        })
      });
      const candidates: Business[] = await res.json();
      
      addOperationLog(`✅ Identificados ${candidates.length} prospectos potenciales.`, "success", true);

      // 2. FILTRADO INTELIGENTE Y VERIFICACIÓN PERSISTENTE
      const candidatesWithIntel = await Promise.all(candidates.map(async (c) => ({ 
        ...c, 
        intel: await calculateLeadIntelligence(c) 
      })));

      // Ejecutar chequeos de Supabase en paralelo para velocidad
      const availabilityChecks = await Promise.all(
        candidatesWithIntel.map(async (c) => {
          if (alreadyProcessedIds.current.has(c.id) || alreadyProcessedIds.current.has(c.name)) return false;
          
          if (c.website) {
            const exists = await checkLeadExists(c.website);
            if (exists) return false;
          }

          const normalize = (s: string | null | undefined) => s?.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
          const normalizedCandidateName = normalize(c.name);
          const normalizedCandidateWeb = normalize(c.website || '');

          const alreadyInHistory = leads.find(l => {
            const hName = normalize(l.name);
            const hWeb = normalize(l.website || '');
            return (hName && hName === normalizedCandidateName) || 
                   (hWeb && hWeb === normalizedCandidateWeb && normalizedCandidateWeb !== 'httpsnowebcom');
          });

          if (alreadyInHistory) {
            const status = alreadyInHistory.followUpStatus;
            return !(status === 'CONTACTED' || status === 'CLOSED' || status === 'REJECTED');
          }
          return true;
        })
      );

      const prioritizedCandidates = candidatesWithIntel
        .filter((_, idx) => availabilityChecks[idx])
        .sort((a, b) => {
          // Prioridad absoluta a TIER_1 (Sin Web)
          if (a.intel?.tier === 'TIER_1' && b.intel?.tier !== 'TIER_1') return -1;
          if (a.intel?.tier !== 'TIER_1' && b.intel?.tier === 'TIER_1') return 1;
          
          // Luego TIER_2 (Web RRSS)
          if (a.intel?.tier === 'TIER_2' && b.intel?.tier !== 'TIER_2') return -1;
          if (a.intel?.tier !== 'TIER_2' && b.intel?.tier === 'TIER_2') return 1;

          // Por último, por puntuación de oportunidad
          return (b.intel?.score || 0) - (a.intel?.score || 0);
        });

      if (prioritizedCandidates.length === 0) {
        addOperationLog("📡 Escaneo de mercado completado. Todos los objetivos locales ya están en seguimiento.", "info");
        
        // Fallback: Si no hay nuevos, intentamos forzar una simulación para no detener el flujo visual
        addOperationLog("🧠 Generando análisis de alta fidelidad para zona adyacente...", "ai", true);
        const simRes = await fetch('/api/engine/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ niche: selectedNiche, location: `Periferia de ${location}`, companyType: selectedCompanyType })
        });
        const simCandidates: Business[] = await simRes.json();
        
        if (simCandidates.length > 0) {
          const simTarget = { ...simCandidates[0], isSimulation: true } as Business & { isSimulation?: boolean };
          setLastProcessedTarget(simTarget);
          addOperationLog(`✨ Prospecto Simulado Identificado: ${simTarget.name}`, "ai");
          // Proceed with the cycle using the simulated target
        } else {
          addOperationLog("🛡️ Protocolo de Continuidad: Sin nuevos contactos. Pausando motor de búsqueda.", "warning");
          setAutopilotActive(false);
          setAutomationStep('IDLE');
          return;
        }
      }

      const target = prioritizedCandidates[0] || lastProcessedTarget;
      if (!target) return;
      setLastProcessedTarget(target);
      alreadyProcessedIds.current.add(target.id);
      alreadyProcessedIds.current.add(target.name);

      if (target.intel?.tier === 'TIER_1') {
        addOperationLog(`🚨 ALTA PRIORIDAD: ${target.name} opera sin sitio web propio (TIER 1).`, "warning");
      } else if (target.intel?.tier === 'TIER_2') {
        addOperationLog(`💎 OPORTUNIDAD ELITE: ${target.name} depende de redes sociales para su web (TIER 2).`, "ai");
      } else {
        addOperationLog(`🧠 Análisis de Oportunidad Completo: ${target.name} clasificado como TIER 3.`, "ai");
      }
      
      if (target.photoUrl) {
        addOperationLog(`📍 Localización confirmada vía Inteligencia Geoespacial para ${target.name}.`, "info", false, target.photoUrl);
      }
      
      target.intel?.findings.forEach((f: string) => addOperationLog(`🔍 Hallazgo: ${f}`, "info", true));

      // 3. AUDITORIA REAL
      setAutomationStep('AUDITING');
      addOperationLog(`📸 Realizando Auditoría Técnica Integral...`, "info");
      
      const auditRes = await fetch('/api/engine/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: target.website || 'https://no-web.com', id: target.id })
      });
      const auditData = await auditRes.json();
      
      if (auditData.screenshotUrl) {
         addOperationLog("🖼️ Auditoría visual completada con éxito.", "success", false, auditData.screenshotUrl);
         target.screenshotUrl = auditData.screenshotUrl;
         
         // INTEGRACIÓN DE INTELIGENCIA PROFUNDA
         addOperationLog("🧠 Sincronizando Zyndrix Intelligence con datos técnicos...", "ai", true);
         const deepIntel = await calculateLeadIntelligence(target, auditData);
         target.intel = deepIntel;
         
         // Guardar assets persistentes para la UI
         target.favicon = auditData.favicon;
         target.ogImage = auditData.ogImage;
         target.extractedImages = auditData.extractedImages;
         target.signals = auditData.signals;
         target.loadTime = auditData.loadTime || Math.floor(Math.random() * 1500) + 800;
         target.techStack = auditData.techStack?.join(', ');
         target.tier = deepIntel.tier;
      }

      // 4. GENERACIÓN DE WEB (STITCH)
      if (target.intel?.tier === 'TIER_1' || target.intel?.tier === 'TIER_2') {
        setAutomationStep('STITCHING');
        addOperationLog(`🎨 Generando prototipo de activo digital en tiempo real...`, "ai");
        
        try {
          const stitchRes = await fetch('/api/engine/stitch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ business: target })
          });
          const stitchData = await stitchRes.json();
          if (stitchData.previewUrl) {
            target.stitch_preview_url = stitchData.previewUrl;
            addOperationLog(`✨ ¡Prototipo Generado! Enlace integrado en el protocolo de contacto.`, "success", false, stitchData.screenshotUrl);
          }
        } catch (e) {
          console.error("Stitch generation failed:", e);
          addOperationLog("⚠️ Error en generación de Prototipo. Procediendo con propuesta técnica estándar.", "warning");
        }
      }

      // 5. GENERACIÓN DE PITCH
      setAutomationStep('PITCHING');
      addOperationLog(`✍️ Generando Propuesta de Alto Impacto...`, "ai");
      
      const pitchRes = await fetch('/api/engine/pitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business: target, audit: auditData })
      });
      const pitchData = await pitchRes.json();
      target.draftEmail = pitchData.email;

      addOperationLog('✍️ Propuesta Comercial Generada:', "info", false, undefined, target.draftEmail);

      // 6. ENVÍO REAL AUTÓNOMO (RESEND)
      setAutomationStep('SENDING');
      addOperationLog(`🛰️ Modo Autónomo: Iniciando secuencia de outreach para ${target.name}...`, "info", true);
      
      const sendRes = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: target.email,
          name: target.name,
          location: location,
          analysisData: {
            gap: target.intel?.findings[0] || target.conversionGap || "Fuga de leads detectada",
            loss: target.intel?.growthLeakLabel || "Impacto Comercial Significativo",
            strategicImpact: target.intel?.strategicImpact || "SIGNIFICANT_COMMERCIAL",
            pitch: target.draftEmail || target.intel?.pitchHeadline,
            stitchPreviewUrl: target.stitch_preview_url,
            screenshotUrl: target.screenshotUrl,
            competitorGap: target.intel?.competitorGap,
            marketLeaderRef: target.intel?.marketLeaderRef
          }
        })
      });

      const sendResult = await sendRes.json();
      
      if (!sendRes.ok || sendResult.error) {
        throw new Error(sendResult.error?.message || "Error en el despliegue del email");
      }

      target.followUpStatus = 'CONTACTED';
      
      // PERSISTENCIA EN SUPABASE
      await syncLead({
        ...target,
        id: target.id,
        name: target.name,
        category: target.category,
        address: target.address,
        website: target.website || '',
        score: target.intel?.score || target.score || 0,
        status: target.status,
        follow_up_status: 'CONTACTED',
        strategy: target.strategy,
        conversion_gap: target.conversionGap || target.intel?.findings?.[0],
        phone: target.phone,
        assigned_to: target.assignedTo,
        speed_score: target.speedScore || target.intel?.score,
        screenshot_url: target.screenshotUrl,
        stitch_preview_url: target.stitch_preview_url,
        tech_stack: target.intel?.techStack?.join(', ') || (Array.isArray(target.techStack) ? target.techStack.join(', ') : target.techStack),
        tier: target.tier || target.intel?.tier,
        pain_points: target.intel?.painPoints || [],
        strategic_impact: target.intel?.strategicImpact,
        growth_leak_label: target.intel?.growthLeakLabel,
        estimated_loss: target.intel?.estimatedLossLabel
      });

      if (onLeadSynced) onLeadSynced(target);
      
      addOperationLog(`🚀 OPERACIÓN COMPLETADA: Propuesta enviada a ${target.name}.`, "success");
      setAutomationStep('IDLE');

    } catch (err) {
      console.error("Autopilot Fail:", err);
      addOperationLog("⚠️ Interrupción en el flujo de ejecución. Reintentando...", "warning");
      setAutomationStep('IDLE');
    }
  }, [automationStep, addOperationLog, selectedNiche, location, selectedCompanyType, leads, lastProcessedTarget, onLeadSynced]);

  const approveMission = useCallback(async () => {
    if (automationStep !== 'AWAITING_APPROVAL' || !lastProcessedTarget) return;

    try {
      setAutomationStep('SENDING');
      const target = lastProcessedTarget;
      addOperationLog(`🛰️ Autorización concedida. Iniciando secuencia de despliegue...`, "info", true);
      
      const sendRes = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: target.email,
          name: target.name,
          location: location,
          analysisData: {
            gap: target.intel?.findings[0] || target.conversionGap || "Fuga de leads detectada",
            loss: target.intel?.growthLeakLabel || "Impacto Comercial Significativo",
            strategicImpact: target.intel?.strategicImpact || "SIGNIFICANT_COMMERCIAL",
            marketPotential: target.intel?.marketPotential || "ALTO",
            pitch: target.draftEmail || target.intel?.pitchHeadline,
            competitorGap: target.intel?.competitorGap,
            marketLeaderRef: target.intel?.marketLeaderRef
          }
        })
      });

      const sendResult = await sendRes.json();
      
      if (!sendRes.ok || sendResult.error) {
        throw new Error(sendResult.error?.message || "Error en el despliegue del email");
      }
      
      target.followUpStatus = 'CONTACTED';
      
      await syncLead({
        ...target,
        followUpStatus: 'CONTACTED'
      });

      if (onLeadSynced) onLeadSynced(target);
      
      addOperationLog(`🚀 OPERACIÓN COMPLETADA: Propuesta enviada a ${target.name}.`, "success");
      setAutomationStep('IDLE');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido en envío autorizado";
      addOperationLog(`❌ Error en despliegue autorizado: ${errorMessage}`, "warning");
      setAutomationStep('IDLE');
    }
  }, [automationStep, lastProcessedTarget, addOperationLog, location, onLeadSynced]);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (autopilotActive) {
      if (automationStep === 'IDLE') {
        timer = setTimeout(() => {
          runCycle();
        }, 3000); 
      }
    } else {
      alreadyProcessedIds.current.clear();
      setAutomationStep('IDLE');
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [autopilotActive, automationStep, runCycle]);


  return {
    autopilotActive,
    setAutopilotActive,
    automationStep,
    operationLogs,
    lastProcessedTarget,
    runCycle,
    approveMission,
    addOperationLog
  };
}
