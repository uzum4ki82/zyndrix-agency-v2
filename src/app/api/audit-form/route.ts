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
      message, 
      service, 
      source,
      problem 
    } = body;

    const AUDIT_WEBHOOK = 'https://n8n.zyndrix.dev/webhook/auditoria';
    
    console.log(`>>> SENDING AUDIT LEAD TO: ${AUDIT_WEBHOOK}`);

    const baseRecord = {
      ...body,
      name: name,
      email: email,
      phone: phone,
      company_name: company || body.company || 'Auditoria Directa',
      website: website,
      problem: problem || body.message,
      message: message || body.message,
      service: service || 'Auditoría IA',
      source: source || 'Landing Page Auditoria'
    };

    const n8nPayload = {
      ...baseRecord,
      record: baseRecord
    };

    const n8nResponse = await fetch(AUDIT_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(n8nPayload)
    });

    if (!n8nResponse.ok) {
        const errorText = await n8nResponse.text();
        console.error(`Failed to trigger n8n audit (${AUDIT_WEBHOOK}):`, n8nResponse.status, errorText);
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
