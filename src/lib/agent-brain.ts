import { AuditResult, Business, TeamMember } from "@/types";

/**
 * MOTOR DE INTELIGENCIA ESTRATÉGICA ZYNDRIX (BRAIN v2.0)
 * Orquestador de agentes especializados para la auditoría y conversión de leads.
 */

class HunterAgent {
  analyze(lead: Partial<Business>) {
    let score = 0;
    const findings: string[] = [];
    const painPoints: string[] = [];
    let tier: 'TIER_1' | 'TIER_2' | 'TIER_3' | 'OPTIMAL' = 'OPTIMAL';
    
    const reviewsCount = lead.reviewsCount || lead.reviews || 0;
    const rating = lead.rating || 0;

    // TIER 1: Anemia Digital Absoluta (Sin Web)
    if (!lead.website || lead.website === "" || lead.website.includes("noweb")) {
      tier = 'TIER_1';
      score += 75;
      findings.push(`EMERGENCIA DIGITAL: ${lead.name} opera sin infraestructura propia.`);
      painPoints.push("Pérdida total de leads orgánicos", "Dependencia de plataformas de terceros", "Falta de autoridad profesional");
    } 
    // TIER 2: Identidad Prestada (Web en RS o Directorios)
    else if (lead.website?.includes("facebook.com") || lead.website?.includes("instagram.com") || lead.website?.includes("cylex")) {
      tier = 'TIER_2';
      score += 60;
      findings.push(`ESTRATEGIA REHÉN: Su activo digital principal pertenece a Meta/Google.`);
      painPoints.push("Escalabilidad nula", "Falta de control sobre el embudo", "Distracción del cliente");
    }
    // TIER 3: Obsolescencia Técnica (Web Propia pero Obsoleta)
    else {
      tier = 'TIER_3';
      score += 35;
      findings.push(`DESGASTE DIGITAL: Infraestructura activa pero con erosión de conversión.`);
      painPoints.push("Baja velocidad de carga", "Arquitectura pre-IA", "Diseño no alineado con el ticket promedio");
    }

    // High Impact Bonus (Muchos reviews, poca tecnología)
    if (reviewsCount > 50 && (tier as any) !== 'OPTIMAL') {
      score += 15;
      findings.push(`AUTORIDAD DESPERDICIADA: Poseen ${reviewsCount} reseñas (${rating}★) que no están monetizando digitalmente.`);
    }

    return { score: Math.min(score, 100), findings, tier, painPoints };
  }
}

class StrategistAgent {
  private industryData: Record<string, { ltv: number, leads: number, name: string, ticket: number }> = {
    'Clínica Dental': { ltv: 3500, leads: 25, name: 'Dental', ticket: 1200 },
    'Inmobiliaria': { ltv: 12000, leads: 10, name: 'Real Estate', ticket: 8000 },
    'Taller Mecánico': { ltv: 1500, leads: 40, name: 'Automoción', ticket: 400 },
    'Centro Médico': { ltv: 5000, leads: 30, name: 'Salud', ticket: 2000 },
    'Default': { ltv: 1000, leads: 20, name: 'Servicios', ticket: 500 }
  };

  projectROI(score: number, category: string) {
    const data = this.industryData[Object.keys(this.industryData).find(k => category?.includes(k)) || 'Default'];
    const gap = score / 100;
    const projectedGrowth = Math.round(data.leads * gap * 12); // Leads anuales adicionales
    const roiLabel = gap > 0.7 ? 'CRÍTICO' : gap > 0.4 ? 'ALTO' : 'SIGNIFICATIVO';

    return {
       roi: Math.round(gap * 85), // % de mejora estimada
       projectedLeads: projectedGrowth,
       impact: roiLabel,
       industryName: data.name
    };
  }
}

export function calculateLeadIntelligence(lead: Partial<Business>, auditData?: any): AuditResult {
  const hunter = new HunterAgent();
  const strategist = new StrategistAgent();
  
  const { score: rawScore, findings, tier, painPoints } = hunter.analyze(lead);
  const metrics = strategist.projectROI(rawScore, lead.category || '');

  // Consolidar inteligencia
  return {
    score: rawScore,
    tier,
    findings,
    painPoints,
    roi: metrics.roi,
    impact: metrics.impact,
    industryName: metrics.industryName,
    foundEmails: lead.email ? [lead.email] : (auditData?.emails || []),
    techStack: auditData?.tech || [],
    screenshot: auditData?.screenshot,
    pitchHeadline: `Informe de Impacto Digital para ${lead.name} // Zyndrix Strategy`,
    strategy: `Despliegue de Arquitectura Zyndrix para corregir: ${findings[0]}`
  };
}

export function recommendTeamMember(lead: any, team: TeamMember[]): TeamMember {
  const isPriority = lead.tier === 'TIER_1' || (lead.score || 0) > 80;
  if (isPriority) return team.find(m => m.role === 'CLOSER') || team[0];
  return team[0];
}
