import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// CONFIGURACIÓN DE RESPALDO (Hardcoded para máxima fiabilidad)
const SB_URL = 'https://vrvfftftnlspajplqjye.supabase.co';
const SB_KEY = 'sb_publishable_04ivizRHZPLg2eH6YkQUtw_MJG7DXfE';

export async function POST(req: Request) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (req.method === 'OPTIONS') return NextResponse.json({}, { headers: corsHeaders });

  try {
    const body = await req.json();
    console.log('--- INICIO PROCESAMIENTO LEAD ---', body.email);

    // 1. PERSISTENCIA EN SUPABASE
    const resSupabase = await fetch(`${SB_URL}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SB_KEY,
        'Authorization': `Bearer ${SB_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        name: body.name || 'Anónimo',
        email: body.email,
        phone: body.phone || null,
        company_name: body.company_name || null,
        message: body.message || 'Lead Blueprint v26',
        budget: body.budget || null,
        service: body.service || 'General',
        status: 'new'
      })
    });

    let leadData = null;
    let leadId = Date.now().toString(); // ID de respaldo

    try {
      const text = await resSupabase.text();
      if (text) {
        leadData = JSON.parse(text);
        leadId = Array.isArray(leadData) ? (leadData?.[0]?.id || leadId) : (leadData?.id || leadId);
      }
    } catch (e) {
      console.warn('Error parseando respuesta Supabase:', e);
    }

    if (!resSupabase.ok) {
      console.error('Supabase Error Status:', resSupabase.status);
    }

    // 2. DISPARO DE WEBHOOKS (n8n)
    const isMagnet = body.service?.toLowerCase().includes('blueprint');
    const n8nUrl = isMagnet 
      ? 'https://n8n.zyndrix.dev/webhook/leadmagnet'
      : 'https://n8n.zyndrix.dev/webhook/zyndrix-lead-scoring';

    const payload = { 
      source: body.service || 'landing', 
      record: {
        id: leadId,
        name: body.name || 'Anónimo',
        email: body.email,
        phone: body.phone || null,
        company_name: body.company_name || body.company || null,
        message: body.message || 'Lead Inyectado',
        service: body.service || 'General',
        status: 'new'
      }
    };

    // Lanzar y no esperar (para respuesta rápida al cliente)
    fetch(n8nUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(err => console.error('Error enviando a n8n:', err.message));

    // 3. RESPUESTA DE ÉXITO INMEDIATA
    return NextResponse.json({ 
      success: true, 
      id: leadId,
      processed: true 
    }, { status: 201, headers: corsHeaders });

  } catch (err: any) {
    console.error('ERROR CRÍTICO EN API LEAD:', err.message);
    return NextResponse.json({ 
      error: 'Error de servidor', 
      message: err.message 
    }, { status: 500, headers: corsHeaders });
  }
}
