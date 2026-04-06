import { NextResponse } from 'next/server';

/**
 * ZYNDRIX AUDIT EXCLUSIVE API
 * Dedicated to: https://n8n.zyndrix.dev/webhook/auditoria
 */

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      name, 
      email, 
      phone, 
      company, 
      website, 
      problem,
      message, 
      service, 
      source,
      budget 
    } = body;

    const AUDIT_WEBHOOK = 'https://n8n.zyndrix.dev/webhook/auditoria';
    const SB_URL = 'https://vrvfftftnlspajplqjye.supabase.co';
    const SB_KEY = 'sb_publishable_04ivizRHZPLg2eH6YkQUtw_MJG7DXfE';
    
    console.log(`>>> SENDING AUDIT LEAD TO: ${AUDIT_WEBHOOK}`);

    // 1. PERSISTENCIA EN SUPABASE
    let leadId = Date.now().toString();
    try {
      const resSupabase = await fetch(`${SB_URL}/rest/v1/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SB_KEY,
          'Authorization': `Bearer ${SB_KEY}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          name: name || 'Anónimo',
          email: email,
          phone: phone || null,
          company_name: company || body.business || 'Auditoria Directa',
          message: message || problem || body.message || 'Solicitud Auditoría',
          budget: budget || null,
          service: service || 'Auditoría IA',
          language_preference: body.language || body.locale || 'es',
          niche_category: body.sector || body.niche || null,
          status: 'new'
        })
      });

      if (resSupabase.ok) {
        const leadData = await resSupabase.json();
        leadId = Array.isArray(leadData) ? (leadData?.[0]?.id || leadId) : (leadData?.id || leadId);
      }
    } catch (sbError) {
      console.warn('Error saving audit to Supabase:', sbError);
    }

    const baseRecord = {
      ...body,
      id: leadId,
      name: name,
      email: email,
      phone: phone,
      company_name: company || body.business || 'Auditoria Directa',
      website: website,
      problem: problem || body.message,
      message: message || body.message,
      service: service || 'Auditoría IA',
      budget: budget,
      source: source || 'Landing Page Auditoria'
    };

    const n8nPayload = {
      ...baseRecord,
      record: baseRecord
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const n8nResponse = await fetch(AUDIT_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(n8nPayload),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!n8nResponse.ok) {
          const errorText = await n8nResponse.text();
          console.error(`Failed to trigger n8n audit (${AUDIT_WEBHOOK}):`, n8nResponse.status, errorText);
      }
    } catch (n8nErr: any) {
      clearTimeout(timeoutId);
      console.warn('Audit Webhook Error/Timeout, continuing...');
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Escaneo de auditoría iniciado.',
      audit_url: AUDIT_WEBHOOK 
    }, { status: 200 });

  } catch (error: any) {
    console.error('Audit API Error:', error.message);
    return NextResponse.json({ error: 'Fallo en la comunicación con el núcleo' }, { status: 500 });
  }
}
