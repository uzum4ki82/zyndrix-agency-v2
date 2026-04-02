import { NextResponse } from 'next/server';

/**
 * ZYNDRIX LEAD CAPTURE API
 * Integrates directly with n8n and Supabase
 * Fixed: Mapping for n8n Normalizer and missing fields
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

    // 1. Log to Console for debugging
    console.log('--- NEW LEAD CAPTURED ---');
    console.log(`Source: ${source || 'Unknown'}`);
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Phone: ${phone}`);
    console.log(`Company: ${company}`);
    console.log(`Problem: ${problem}`);
    console.log(`Service: ${service}`);
    console.log(`Budget: ${body.budget || 'N/A'}`);

    // 2. Select n8n Webhook Based on Service/Source (Robust Check)
    const GENERAL_WEBHOOK = process.env.N8N_WEBHOOK_URL || 'https://n8n.zyndrix.dev/webhook/zyndrix-lead-scoring';
    const AUDIT_WEBHOOK = 'https://n8n.zyndrix.dev/webhook/auditoria';
    
    // Choose the webhook destination by checking if the service or source contains "Auditor"
    const isAuditLead = 
        (service?.toLowerCase()?.includes('auditor')) || 
        (source?.toLowerCase()?.includes('auditoria')) ||
        (body.service?.toLowerCase()?.includes('auditor'));

    const targetWebhook = isAuditLead ? AUDIT_WEBHOOK : GENERAL_WEBHOOK;
    
    console.log(`>>> ROUTING LEAD TO: ${targetWebhook} (Source: ${source}, Service: ${service})`);


    // We create a universally compatible payload.
    // Some workflows expect flat keys ($json.name), 
    // others expect 'record' ($json.record.name),
    // and others expect 'body' ($json.body.record.name).
    const baseRecord = {
      ...body,
      name: name,
      email: email,
      phone: phone,
      company_name: company || body.company || 'Direct Contact',
      website: website,
      problem: problem || body.message,
      message: message || body.message,
      service: service,
      source: source || 'Contact Form'
    };

    const n8nPayload = {
      ...baseRecord, // For flat node seekers
      record: baseRecord, // For $json.record seekers (V21)
      body: { 
        ...baseRecord, 
        record: baseRecord // For $json.body.record seekers (FIXED V12)
      }
    };




    const n8nResponse = await fetch(targetWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(n8nPayload)
    });

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error(`Failed to trigger n8n workflow (${targetWebhook}):`, n8nResponse.status, errorText);
      // We still return 200 to the client to not break UX, but log the error
    }


    return NextResponse.json({ 
      success: true, 
      message: 'Protocolo de registro completado. Iniciando auditoría.',
      debug: {
        routedTo: targetWebhook,
        isAudit: isAuditLead
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error in Lead API:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Fallo en la comunicación con el núcleo.' 
    }, { status: 500 });
  }
}

