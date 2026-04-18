import { AuditResult, Business, TeamMember } from "@/types";
import { extractBrandColors, BrandPalette } from "./color-extractor";

/**
 * [FIX #3] MOTOR DE INTELIGENCIA ESTRATÉGICA ZYNDRIX (BRAIN v3.0)
 * Orquestador de agentes especializados para auditoría + Visual DNA extraction
 */

class HunterAgent {
  analyze(lead: Partial<Business>, niche: string = "") {
    let score = 0;
    const findings: string[] = [];
    const painPoints: string[] = [];
    let tier: 'TIER_1' | 'TIER_2' | 'TIER_3' | 'OPTIMAL' | 'DISCARDED' = 'OPTIMAL';
    
    const hasEmail = !!lead.email;
    const hasWhatsApp = !!lead.whatsapp || !!lead.phone; // Assuming phone might be whatsapp
    const name = (lead.name || "").toLowerCase();
    const query = niche.toLowerCase();

    // [FIX #4] LACK OF CONNECTION (Section 5.1.8)
    const subEntityModifiers = ["pharmacy", "farmacia", "atm", "cajero", "garage", "taller", "clinic", "clínica", "department", "departamento"];
    const foundModifier = subEntityModifiers.find(mod => name.includes(mod));
    const queryHasModifier = subEntityModifiers.some(mod => query.includes(mod));

    if (foundModifier && !queryHasModifier) {
      tier = 'DISCARDED';
      score = 0;
      findings.push(`LACK OF CONNECTION: El resultado parece una sub-entidad (${foundModifier}) que no coincide con la intención de búsqueda principal.`);
      return { score: 0, findings, tier, painPoints };
    }

    // NEW STRICT TIER RULES
    if (!hasEmail && !hasWhatsApp) {
      tier = 'DISCARDED';
      score = 0;
      findings.push("DESCARGADO: Sin puntos de contacto detectados.");
    } else if (hasEmail && hasWhatsApp) {
      tier = 'TIER_1';
      score = 95;
      findings.push("OPORTUNIDAD VESTIGIAL: Máximo potencial de conversión detectado (Email + WhatsApp).");
    } else if (hasWhatsApp) {
      tier = 'TIER_3';
      score = 45;
      findings.push("CANAL RESTRINGIDO: Solo se detectó WhatsApp. Requiere contacto manual.");
    } else {
      // Email only? Standard TIER 2
      tier = 'TIER_2' as any;
      score = 65;
      findings.push("CANAL ESTÁNDAR: Solo se detectó Email corporativo.");
    }

    // Pain point enhancement based on website
    if (!lead.website || lead.website === "" || lead.website.includes("noweb")) {
      painPoints.push("Invisibilidad total en búsquedas locales", "Falta de credibilidad ante clientes premium", "Sin captura de datos de clientes");
      score += 10;
    } else {
      if (tier !== 'DISCARDED') {
         painPoints.push("Embudo de ventas con fugas críticas", "Arquitectura móvil deficiente", "Velocidad de carga subóptima para retención");
      }
    }

    return { score: Math.min(score, 100), findings, tier, painPoints };
  }
}

class StrategistAgent {
  private industryData: Record<string, { ltv: number, leads: number, name: string, ticket: number }> = {
    'restaurante': { ltv: 500, leads: 50, name: 'Gastronomía', ticket: 45 },
    'taller': { ltv: 2000, leads: 15, name: 'Automotriz', ticket: 350 },
    'clinica': { ltv: 4000, leads: 20, name: 'Salud', ticket: 1200 },
    'reforma': { ltv: 15000, leads: 5, name: 'Construcción', ticket: 10000 },
    'default': { ltv: 1000, leads: 20, name: 'Servicios', ticket: 500 }
  };

  projectROI(score: number, category: string) {
    const cat = category?.toLowerCase() || '';
    const key = Object.keys(this.industryData).find(k => cat.includes(k)) || 'default';
    const data = this.industryData[key];
    const gap = score / 100;

    return {
       roi: Math.round(gap * 150),
       projectedLeads: Math.round(data.leads * gap * 12),
       impact: gap > 0.8 ? 'CRÍTICO' : 'ALTO',
       industryName: data.name
    };
  }
}

// [FIX #3] Visual DNA Agent - Extracts brand colors from screenshots
class VisualDNAAgent {
  async extractBrandIdentity(lead: Partial<Business>): Promise<BrandPalette | null> {
    if (!lead.screenshot_url || lead.screenshot_url.includes('placeholder') || lead.screenshot_url.includes('undefined')) {
      console.log(`[VISUAL_DNA] No valid screenshot for ${lead.name}, skipping color extraction`);
      return null;
    }

    try {
      console.log(`[VISUAL_DNA] Extracting brand DNA for ${lead.name}...`);
      const palette = await extractBrandColors(
        lead.screenshot_url,
        lead.name || 'Unknown',
        lead.category
      );

      console.log(`[VISUAL_DNA] ✓ Extracted palette for ${lead.name}:`, {
        primary: palette.primary,
        secondary: palette.secondary,
        confidence: palette.confidence
      });

      return palette;
    } catch (error) {
      console.error(`[VISUAL_DNA] Error extracting colors for ${lead.name}:`, error);
      return null;
    }
  }
}

export async function calculateLeadIntelligence(lead: Partial<Business>, niche: string = "", auditData?: any): Promise<AuditResult & { brandPalette?: BrandPalette }> {
  const hunter = new HunterAgent();
  const strategist = new StrategistAgent();
  const visualDNA = new VisualDNAAgent();
  
  const { score: rawScore, findings, tier, painPoints } = hunter.analyze(lead, niche);
  const metrics = strategist.projectROI(rawScore, lead.category || '');

  // [FIX #3] Extract brand colors if screenshot available
  const brandPalette = await visualDNA.extractBrandIdentity(lead);

  // Consolidar inteligencia
  return {
    score: rawScore,
    tier: tier as any,
    findings,
    painPoints,
    roi: metrics.roi,
    impact: metrics.impact,
    industryName: metrics.industryName,
    foundEmails: lead.email ? [lead.email] : (auditData?.emails || []),
    techStack: auditData?.tech || ["Legacy HTML", "Sin Optimización Conversion"],
    screenshot: auditData?.screenshot || lead.screenshot_url,
    pitchHeadline: `Transformación Digital Radical: Propuesta Estratégica para ${lead.name}`,
    strategy: findings[0],
    brandPalette: brandPalette || undefined
  };
}

export function recommendTeamMember(lead: any, team: TeamMember[]): TeamMember {
  const isHighValue = lead.tier === 'TIER_1' || lead.score > 90;
  if (isHighValue) return team.find(m => m.role === 'CLOSER') || team[0];
  return team[0];
}
