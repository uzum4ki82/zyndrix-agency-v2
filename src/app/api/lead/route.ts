import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// MASTER CONFIG (Hardcoded for maximum reliability during launch)
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
    console.log('--- INGESTIÓN INICIADA ---', body.email);

    // 1. PERSISTENCIA EN SUPABASE (Prioridad 1)
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
        message: body.message || 'Lead v23',
        budget: body.budget || null,
        service: body.service || 'General',
        status: 'new'
      })
    });

    const leadData = await resSupabase.json();
    const leadId = leadData?.[0]?.id || null;

    if (!resSupabase.ok) {
      console.error('Supabase Fail:', leadData);
    }

    // 3. RESPUESTA INMEDIATA (Para evitar timeouts en el cliente)
    const response = NextResponse.json({ 
      success: true, 
      id: leadId,
      processed: true 
    }, { status: 201, headers: corsHeaders });

    // 4. DISPARO DE WEBHOOKS (En paralelo y ESPERANDO confirmación)
    const isMagnet = body.service?.toLowerCase().includes('blueprint');
    const n8nUrl = isMagnet 
      ? 'https://n8n.zyndrix.dev/webhook/leadmagnet'
      : 'https://n8n.zyndrix.dev/webhook/zyndrix-lead-scoring';

    const recordPayload = {
      id: leadId,
      name: body.name || 'Anónimo',
      email: body.email,
      phone: body.phone || null,
      company_name: body.company_name || body.company || null,
      message: body.message || 'Lead v25',
      budget: body.budget || null,
      service: body.service || 'General',
      status: 'new',
      ...(leadData?.[0] || {})
    };

    const payload = { source: body.service || 'landing', record: recordPayload };
    const webhooks = [n8nUrl, n8nUrl.replace('/webhook/', '/webhook-test/')];
    
    // AHORA SÍ: Esperamos a que las peticiones se ENVIEN correctamente
    try {
      await Promise.all(webhooks.map(url => 
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).then(r => console.log(`OK: ${url.includes('test') ? 'TEST' : 'LIVE'} [${r.status}]`))
          .catch(e => console.error(`ERR: ${url}`, e.message))
      ));
    } catch (e) {
      console.warn('Fallo parcial en webhooks, pero el lead ya está en Supabase.');
    }

    return response;

  } catch (err: any) {
    console.error('CRITICAL ERROR v24:', err.message);
    return NextResponse.json({ error: 'System error', details: err.message }, { status: 500, headers: corsHeaders });
  }
}
