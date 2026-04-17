import { NextResponse } from 'next/server';
import { supabase, Lead } from '@/lib/supabase';
import { calculateLeadIntelligence } from '@/lib/agent-brain';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { lead } = body;

    if (!lead || !lead.name) {
      return NextResponse.json({ error: "Invalid lead data" }, { status: 400 });
    }

    // 1. Enriquecimiento de Inteligencia
    const intel = calculateLeadIntelligence(lead);
    
    // 2. Preparación del objeto para Supabase (Mapping CamelCase to SnakeCase)
    const leadData: Partial<Lead> = {
      name: lead.name,
      category: lead.category || 'General',
      website: lead.website || '', // IMPORTANTE: '' para que el UPSERT funcione en la restricción UNIQUE
      address: lead.address,
      neighborhood: lead.neighborhood,
      score: intel.score,
      priority_score: intel.score,
      tier: intel.tier,
      conversion_gap: intel.findings?.[0] || 'Optimización pendiente',
      strategic_impact: intel.strategicImpact,
      growth_leak_label: intel.growthLeakLabel,
      pain_points: intel.painPoints,
      ltv_estimate: intel.ltvEstimate,
      status: intel.score > 70 ? 'high' : (intel.score > 40 ? 'medium' : 'low'),
      follow_up_status: lead.followUpStatus || 'NEW',
      whatsapp_sent: false,
      email_sent: false,
      phone: lead.phone || null,
      google_place_id: lead.googlePlaceId || null,
      // Metadata de automatización
      stitch_preview_url: lead.stitch_preview_url || lead.stitchPreviewUrl,
      stitch_project_id: lead.stitch_project_id || lead.stitchProjectId,
      screenshot_url: lead.screenshot_url || lead.screenshotUrl,
      tech_stack: lead.tech_stack || lead.techStack,
      speed_score: lead.speed_score || lead.speedScore,
      load_time: lead.load_time || lead.loadTime,
      last_audit: lead.last_audit || new Date().toISOString()
    };

    // 3. Upsert en Supabase
    // Usamos el nombre y la dirección como identificador único para evitar duplicados nacionales.
    // (Asegúrate de que la restricción UNIQUE en la DB sea 'name, address')
    const { data, error } = await supabase
      .from('leads')
      .upsert(leadData, { 
        onConflict: 'name,address'
      })
      .select()
      .single();

    if (error) {
      console.error("❌ SUPABASE SYNC ERROR:", error.message, "Payload:", leadData);
      return NextResponse.json({ 
        error: error.message,
        details: "Asegúrate de haber ejecutado el script FINAL_DB_REPAIR.sql en Supabase." 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      lead: data,
      intelligence: intel
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
