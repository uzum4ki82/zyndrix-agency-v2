import { AuditResult, Business, TeamMember } from "@/types";

// --- AGENTS ---

/**
 * THE HUNTER (Auditor): Diagnóstico técnico de precisión estratégica.
 * Detecta fugas clave en la presencia digital.
 */
class HunterAgent {
  analyze(lead: Partial<Business>) {
    let score = 0;
    const findings: string[] = [];
    const painPoints: string[] = [];
    let tier: 'TIER_1' | 'TIER_2' | 'TIER_3' | 'OPTIMAL' = 'OPTIMAL';
    
    const reviewsCount = lead.reviewsCount || lead.reviews || 0;
    const rating = lead.rating || 0;

    // TIER 1: La Oportunidad de Oro (Sin Web)
    if (!lead.website || lead.website === "" || lead.website.includes("noweb")) {
      tier = 'TIER_1';
      score += 75;
      findings.push(`EMERGENCIA DIGITAL: ${lead.name} opera sin infraestructura propia.`);
      painPoints.push("Pérdida total del tráfico orgánico", "Dependencia absoluta de terceras plataformas", "Falta de credibilidad profesional");
    } 
    // TIER 2: Web en Redes Sociales (Hostage status)
    else if (lead.website.includes("facebook.com") || lead.website.includes("instagram.com") || lead.website.includes("cylex") || lead.website.includes("paginasamarillas")) {
      tier = 'TIER_2';
      score += 60;
      findings.push(`IDENTIDAD PRESTADA: Su activo digital más valioso está en manos de un tercero.`);
      painPoints.push("Escalabilidad limitada", "Imposibilidad de implementar automatizaciones avanzadas", "Distracción del cliente por publicidad externa");
    }
    // TIER 3: Web Existente (Optimización)
    else {
      tier = 'TIER_3';
      score += 35;
      findings.push(`INFRAESTRUCTURA ESTÁNDAR: Web activa pero con potencial de optimización operativa.`);
      painPoints.push("Baja tasa de conversión", "Falta de flujos de IA automatizados", "Diseño no alineado con la alta autoridad");
    }

    // Bonuses por autoridad desperdiciada
    if (reviewsCount > 50) {
      score += 15;
      findings.push(`POTENCIAL DE REPUTACIÓN: Tienen autoridad (${rating}★) que no están monetizando.`);
    }

    return { 
      score: Math.min(score, 100), 
      findings, 
      tier,
      painPoints 
    };
  }

  deepAnalyze(auditData: Partial<AuditResult>, leadData?: Partial<Business>) {
    const findings: string[] = [];
    let technicalPenalty = 0;

    const loadTime = auditData.loadTime || leadData?.speedScore || 0;
    if (loadTime > 3000) {
      technicalPenalty += 20;
      findings.push(`TIEMPO DE ESPERA ALTO: La web tarda ${(loadTime/1000).toFixed(1)}s en abrir.`);
    }

    const tech = auditData.techStack || leadData?.techStack || [];
    if (tech.includes('wordpress') || tech.includes('wix') || tech.includes('shopify')) {
      technicalPenalty += 15;
      findings.push(`PLATAFORMA LIMITADA: Usa ${tech[0]}, lo que restringe el crecimiento a medida y la conversión de lujo.`);
    }

    const signals = auditData.signals || leadData?.signals;
    if (signals && !signals.instagram) {
      technicalPenalty += 10;
      findings.push("BRECHA OMNICANAL: No hemos detectado presencia activa en Instagram, perdiendo tracción con el público local.");
    }

    if (!auditData.seo?.description && !leadData?.seo_meta?.description) {
      technicalPenalty += 15;
      findings.push("INVISIBLE EN GOOGLE: Falta de metadatos SEO críticos para el ranking local.");
    }

    return { technicalPenalty, deepFindings: findings };
  }
}

/**
 * THE STRATEGIST: Ingeniería financiera (Agency Level).
 */
class StrategistAgent {
  private industryMetrics: Record<string, { ltv: number, leadsPerMonth: number, industryName: string, avgTicket: number }> = {
    'Clínica Dental': { ltv: 3500, leadsPerMonth: 25, industryName: 'Odontología', avgTicket: 1500 },
    'Centro Médico': { ltv: 4500, leadsPerMonth: 30, industryName: 'Salud', avgTicket: 2000 },
    'Taller Mecánico': { ltv: 1200, leadsPerMonth: 35, industryName: 'Automoción', avgTicket: 300 },
    'Restaurante': { ltv: 250, leadsPerMonth: 150, industryName: 'Hostelería', avgTicket: 45 },
    'Centro de Estética': { ltv: 850, leadsPerMonth: 45, industryName: 'Bienestar', avgTicket: 80 },
    'Inmobiliaria': { ltv: 8000, leadsPerMonth: 8, industryName: 'Real Estate', avgTicket: 6000 },
    'Abogados': { ltv: 4000, leadsPerMonth: 12, industryName: 'Legal', avgTicket: 2500 },
    'Gimnasio': { ltv: 600, leadsPerMonth: 60, industryName: 'Fitness', avgTicket: 50 },
    'Default': { ltv: 1000, leadsPerMonth: 20, industryName: 'Servicios de Empresa', avgTicket: 500 }
  };

  calculateMetrics(score: number, category: string, rating: number, deepAudit?: Partial<AuditResult>) {
    const industryKey = Object.keys(this.industryMetrics).find(k => category?.includes(k)) || 'Default';
    const industry = this.industryMetrics[industryKey];
    
    let extraLossFactor = 0;
    if (deepAudit?.loadTime && deepAudit.loadTime > 4000) extraLossFactor += 0.15;
    if (deepAudit?.findings?.some((f: string) => f.includes('SEO'))) extraLossFactor += 0.10;

    const gapFactor = Math.min((score / 100) + extraLossFactor, 1);
    const estimatedRoi = industry.leadsPerMonth * gapFactor * (industry.ltv * 0.12);
    
    const ltvEstimate = industry.ltv;
    const conversionBoost = Math.round(gapFactor * 94);

    // Qualitative assessment
    let marketPotential: 'CRÍTICO' | 'ALTO' | 'SIGNIFICATIVO' | 'MODERADO' = 'MODERADO';
    if (score >= 75) marketPotential = 'CRÍTICO';
    else if (score >= 50) marketPotential = 'ALTO';
    else if (score >= 25) marketPotential = 'SIGNIFICATIVO';

    const estimatedLossLabel = {
      'CRÍTICO': 'Impacto Financiero Masivo',
      'ALTO': 'Fuga Comercial Significativa',
      'SIGNIFICATIVO': 'Margen de Crecimiento Bloqueado',
      'MODERADO': 'Optimización de Rutina'
    }[marketPotential];

    const strategicImpactMap: Record<string, 'CRITICAL_FINANCIAL' | 'SIGNIFICANT_COMMERCIAL' | 'MODERATE_OPERATIONAL' | 'STABLE'> = {
      'CRITICAL': 'CRITICAL_FINANCIAL',
      'HIGH': 'SIGNIFICANT_COMMERCIAL',
      'MODERATE': 'MODERATE_OPERATIONAL',
      'STABLE': 'STABLE'
    };

    const intensity = this.getIntensity(score);
    const strategicImpact = strategicImpactMap[intensity] || 'STABLE';

    // COMPETITOR INTEL: Benchmarking contra líderes locales
    const competitorBenchmark = this.getCompetitorBenchmark(category, rating);

    return { 
      estimatedRoi: Math.round(estimatedRoi), 
      ltvEstimate, 
      conversionBoost, 
      marketPotential,
      estimatedLossLabel,
      strategicImpact,
      growthLeakLabel: estimatedLossLabel,
      industryName: industry.industryName,
      avgTicket: industry.avgTicket,
      competitorGap: competitorBenchmark.gap,
      marketLeaderRef: competitorBenchmark.leaderType
    };
  }

  private getCompetitorBenchmark(category: string, rating: number) {
    const isMedical = category.includes('Clínica') || category.includes('Dentist') || category.includes('Doctor');
    const isGastro = category.includes('Restaurante') || category.includes('Bar') || category.includes('Cafe');
    
    const benchmarkRating = isMedical ? 4.8 : (isGastro ? 4.6 : 4.5);
    const gap = Math.max(0, benchmarkRating - rating);
    
    return {
      gap: parseFloat(gap.toFixed(1)),
      leaderType: isMedical ? 'Clínica Premium Local' : (isGastro ? 'Referente del Barrio' : 'Competidor Digital Top')
    };
  }

  getIntensity(score: number): 'CRITICAL' | 'HIGH' | 'MODERATE' | 'STABLE' {
    if (score >= 70) return 'CRITICAL';
    if (score >= 45) return 'HIGH';
    if (score >= 25) return 'MODERATE';
    return 'STABLE';
  }
}

/**
 * THE COPYWRITER: Conversión Empática.
 */
class CopywriterAgent {
  generateHeadline(score: number, name: string) {
    if (score > 85) return `URGENTE: Análisis de Fuga de Conversión para ${name} // Zyndrix Strategy`;
    if (score > 60) return `Arquitectura Digital y Benchmark Competitivo: Propuesta para ${name}`;
    if (score > 30) return `Optimización de Autoridad Digital: Hoja de Ruta para ${name}`;
    return `Propuesta de Evolución Digital para ${name} | Zyndrix Labs`;
  }
}

/**
 * THE DESIGNER: Arquitectura de Solución Premium.
 */
class DesignerAgent {
  proposeLayout(score: number, category: string) {
    if (score > 75) return 'Enterprise Growth Architecture';
    if (category.includes('Clínica') || category.includes('Salud')) return 'Health-Trust Authority System';
    if (category.includes('Restaurante') || category.includes('Bar')) return 'DineConnect: High-Frequency Booking';
    if (category.includes('Inmobiliaria')) return 'LuxeListing Lead Magnet API';
    return 'Conversion-First Agency Skeleton';
  }
}

// --- ORCHESTRATOR ---

export function calculateLeadIntelligence(lead: Partial<Business>, auditData?: Partial<AuditResult>): AuditResult {
  const hunter = new HunterAgent();
  const strategist = new StrategistAgent();
  const copywriter = new CopywriterAgent();
  const designer = new DesignerAgent();
  const { score: rawScore, findings: rawFindings, tier, painPoints } = hunter.analyze(lead);
  
  let score = rawScore;
  let findings = rawFindings;

  if (auditData) {
    const { technicalPenalty, deepFindings } = hunter.deepAnalyze(auditData, lead);
    score = Math.min(score + technicalPenalty, 100);
    findings = [...new Set([...findings, ...deepFindings])];
  }

  const rating = lead.rating || 0;
  const metrics = strategist.calculateMetrics(score, lead.category || 'Empresa', rating, auditData);
  const gapIntensity = strategist.getIntensity(score);
  const pitchHeadline = copywriter.generateHeadline(score, lead.name || 'Empresa');
  const proposedLayout = designer.proposeLayout(score, lead.category || '');

  return {
    score,
    gapIntensity,
    foundEmails: lead.email ? [lead.email] : [], 
    findings,
    painPoints,
    presenceQuality: lead.website ? (lead.speedScore || 70) : 15,
    pitchHeadline,
    opportunityScore: score,
    growthIndex: gapIntensity === 'STABLE' ? 'OPTIMAL' : gapIntensity,
    proposedLayout,
    ltvEstimate: metrics.ltvEstimate,
    conversionBoost: metrics.conversionBoost,
    marketPotential: metrics.marketPotential,
    estimatedLossLabel: metrics.estimatedLossLabel,
    strategicImpact: metrics.strategicImpact,
    growthLeakLabel: metrics.growthLeakLabel,
    favicon: auditData?.favicon,
    ogImage: auditData?.ogImage,
    techStack: auditData?.techStack,
    extractedImages: auditData?.extractedImages,
    signals: auditData?.signals,
    tier,
    strategy: `Implementación de ${proposedLayout} para corregir ${findings[0] || 'fuga de leads'}.`
  };
}

export function recommendTeamMember(lead: Partial<Business>, team: TeamMember[]): TeamMember {
  const isHighValue = lead.category?.includes('Clínica') || lead.category?.includes('Inmobiliaria') || (lead.score || 0) > 85;
  if (isHighValue) return team.find(m => m.role === 'CLOSER') || team[0];
  return [...team].sort((a, b) => a.activeLeads - b.activeLeads)[0];
}
