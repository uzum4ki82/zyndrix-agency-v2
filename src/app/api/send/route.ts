import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { updateLeadWithServiceRole } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name = "Empresa", analysisData = {}, location = "su ciudad", isTest = false, ping, id, type = 'impact' } = body;
    const origin = request.headers.get('origin') || 'https://zyndrix.dev';
    
    // Use a fixed production domain for branding assets to ensure visibility during local tests
    const productionUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://comercial-eta.vercel.app';
    const logoUrl = `${productionUrl}/img/logo_raw.png`;
    const avatarUrl = `${productionUrl}/img/avatar-final.png`;
    
    // Absolute function for payload assets - Always use production for email content to avoid broken local links
    const absolutize = (url: string) => {
      if (!url) return '';
      if (url.startsWith('http')) return url;
      
      // For email content, we MUST use the public production URL, otherwise Gmail/Clients can't see images/links
      const base = productionUrl; 
      
      return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    const demoUrl = analysisData?.stitchPreviewUrl || `${productionUrl}/demo/${id}`;

    if (ping) {
      return NextResponse.json({ success: true, status: process.env.RESEND_API_KEY ? 'live' : 'mock' });
    }

    if (!isTest && !email) {
      return NextResponse.json({ error: 'Email receptor no proporcionado' }, { status: 400 });
    }

    const targetEmail = isTest ? 'omontesquesada@gmail.com' : email;
    const apiKey = process.env.RESEND_API_KEY || '';
    
    if (!apiKey || apiKey.toLowerCase().includes('your_key') || apiKey === 're_123456789' || apiKey.length < 10) {
      console.log('⚠️ [OUTREACH] MOCK MODE ACTIVE - Skip real send');
      return NextResponse.json({ 
        success: true, 
        message: 'Simulated tactical send success (MOCK MODE)', 
        status: 'MOCK_ACTIVE',
        sentTo: targetEmail 
      });
    }

    console.log(`🚀 [OUTREACH] Triggering real send to: ${targetEmail}`);

    const resend = new Resend(apiKey);
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'Oscar Montes <onboarding@resend.dev>';

    // --- TEMPLATE LOGIC ---
    let subject = `Análisis de Autoridad Digital: ${name} — Propuesta Estratégica (${location})`;
    let htmlContent = '';

    if (type === 'followup') {
      subject = `Re: Protocolo de Blindaje Digital para ${name} - Pendiente de revisión`;
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
            body { font-family: 'Inter', sans-serif; background-color: #ffffff; color: #0f172a; line-height: 1.6; }
            .container { max-width: 600px; margin: 40px auto; padding: 40px; border: 1px solid #f1f5f9; border-radius: 20px; }
            .logo { height: 40px; margin-bottom: 40px; }
            .headline { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 24px; }
            .cta-button { display: inline-block; background: #4f46e5; color: #ffffff !important; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; margin: 32px 0; }
            .footer { margin-top: 40px; padding-top: 40px; border-top: 1px solid #f1f5f9; font-size: 14px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="container">
            <img src="${logoUrl}" class="logo" alt="Zyndrix">
            <h1 class="headline">Simplemente quería asegurarme...</h1>
            <p>Estimados directivos de <strong>${name}</strong>,</p>
            <p>Les escribo brevemente para confirmar si han tenido oportunidad de revisar la <strong>Arquitectura Digital de Alto Rendimiento</strong> que diseñamos específicamente para su negocio en ${location}.</p>
            <p>Como mencioné en mi contacto anterior, el análisis técnico detectó fugas críticas en su autoridad digital que están beneficiando directamente a su competencia.</p>
            
            <a href="${demoUrl}" class="cta-button">Acceder a la Propuesta Estratégica →</a>

            <p>¿Tienen disponibilidad para una breve llamada de 10 minutos esta semana? Me gustaría explicarles cómo este sistema puede consolidar su posición dominante en el mercado.</p>
            
            <div class="footer">
              <strong>Oscar Montes</strong><br/>
              Senior Strategy Lead @ Zyndrix Capital<br/>
              <span style="font-size: 12px;">Sistemas de Inteligencia y Despliegue de Activos Digitales</span>
            </div>
          </div>
        </body>
        </html>
      `;
    } else {
      const tech = analysisData?.techStack || '';
      let techComment = "Tras nuestro último escaneo, hemos detectado que su infraestructura digital presenta limitaciones técnicas que impiden una correcta indexación en su nicho estratégico.";
      if (tech.toLowerCase().includes('wordpress')) {
        techComment = `Su plataforma comercial actual basada en <strong>WordPress</strong> compromete la velocidad de carga crítica, lo que deriva en una pérdida directa de conversiones potenciales frente a su competencia directa.`;
      } else if (tech.toLowerCase().includes('wix') || tech.toLowerCase().includes('shopify')) {
        techComment = `El uso de sistemas de plantilla como ${tech} limita su capacidad de diferenciación en un mercado saturado, homogeneizando su propuesta de valor.`;
      }

      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
            body { margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; }
            .wrapper { width: 100%; table-layout: fixed; background-color: #f1f5f9; padding: 60px 0; }
            .container { max-width: 960px; margin: 0 auto; background: #ffffff; border-radius: 24px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.05); }
            .hero { background: #ffffff; padding: 100px 40px 60px; text-align: center; border-bottom: 1px solid #f1f5f9; }
            .logo { height: 120px; width: auto; display: block; margin: 0 auto; }
            .content { padding: 80px 100px; }
            .badge { display: inline-block; padding: 8px 16px; background: #eef2ff; color: #4f46e5; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; border-radius: 8px; margin-bottom: 32px; }
            .headline { font-size: 64px; font-weight: 800; color: #0f172a; margin: 0 0 24px; line-height: 1.05; letter-spacing: -0.04em; }
            .diagnostic-card { background: #f8fafc; border-left: 6px solid #4f46e5; border-radius: 20px; padding: 56px; margin-bottom: 64px; }
            .diagnostic-title { font-size: 14px; font-weight: 800; color: #4f46e5; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 24px; display: block; }
            .diagnostic-text { font-size: 22px; color: #0f172a; font-weight: 600; line-height: 1.5; }
            .cta-button { display: inline-block; background: #4f46e5; color: #ffffff !important; padding: 28px 60px; border-radius: 16px; text-decoration: none; font-size: 19px; font-weight: 800; box-shadow: 0 20px 40px rgba(79, 70, 229, 0.3); }
            .footer { padding: 80px 100px; background: #ffffff; border-top: 1px solid #f1f5f9; }
            .signature-avatar { border-radius: 16px; border: 1px solid #e2e8f0; width: 64px; height: 64px; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="container">
              <div class="hero">
                <a href="${productionUrl}"><img src="${logoUrl}" class="logo" alt="Zyndrix"></a>
              </div>
              <div class="content">
                <div class="badge">Auditoría Ética de Infraestructura</div>
                <h1 class="headline">Arquitectura Digital de Alto Rendimiento<br/><span style="font-size: 0.65em; color: #475569;">Diseñada para ${name}</span></h1>
                <p style="font-size: 24px; color: #475569; margin-bottom: 56px;">Estrategia de captura y blindaje de clientes potenciales en ${location}.</p>
                <div class="diagnostic-card">
                  <span class="diagnostic-title">Protocolo de Detección: Deficiencia Estructural</span>
                  <div class="diagnostic-text">${techComment}</div>
                </div>
                <div style="margin-bottom: 64px; text-align: center;">
                  <a href="${demoUrl}" style="text-decoration: none;">
                    <div style="position: relative; border-radius: 20px; overflow: hidden; border: 1.5px solid #4f46e5; box-shadow: 0 40px 80px rgba(79, 70, 229, 0.25);">
                      <img src="${analysisData?.ogImageUrl ? absolutize(analysisData.ogImageUrl) : 'https://images.unsplash.com/photo-1481487196290-c152efe083f5?w=1200'}" style="width: 100%; height: auto; display: block;">
                      <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, #0f172a, transparent); padding: 40px; text-align: left;">
                        <h3 style="color: #fff; font-size: 26px; margin: 0;">Explorar su Nueva Arquitectura Digital →</h3>
                      </div>
                    </div>
                  </a>
                </div>
                <div style="margin-top: 80px; padding-top: 40px; border-top: 1px solid #f1f5f9;">
                  <table><tr>
                    <td><img src="${avatarUrl}" class="signature-avatar"></td>
                    <td style="padding-left: 20px;">
                      <div style="font-size: 18px; font-weight: 800;">Oscar Montes</div>
                      <div style="color: #64748b; font-size: 14px;">Senior Strategy Lead @ Zyndrix Capital</div>
                    </td>
                  </tr></table>
                </div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
    }

    const { data, error } = await resend.emails.send({
      from: fromEmail, 
      to: [targetEmail],
      replyTo: 'omontesquesada@gmail.com',
      subject: subject,
      tags: [
        { name: 'lead_id', value: id || 'test' }
      ],
      html: htmlContent,
    });

    if (error) {
      console.error('❌ [RESEND_ERROR]:', error);
      return NextResponse.json({ error }, { status: 500 });
    }

    // [FIX #4] Persist email_id and initial engagement tracking
    if (id && data?.id) {
      try {
        await updateLeadWithServiceRole(id, {
          resend_email_id: data.id,
          email_sent: true,
          email_sent_at: new Date().toISOString(),
          status: 'OUTREACH_COMPLETE',
          engagement_score: 0 // Will be updated by webhook events
        });
        console.log(`[FIX #4] ✓ Email tracking initialized for lead ${id}`);
      } catch (persistError) {
        console.error(`[FIX #4] Warning: Could not persist email tracking for ${id}:`, persistError);
        // Continue anyway - email was sent successfully
      }
    }

    return NextResponse.json({
      success: true,
      data,
      emailId: data?.id
    });
  } catch (error: any) {
    console.error('CRITICAL [OUTREACH_EXCEPTION]:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal Server Error during outreach',
      details: error.details || error
    }, { status: 500 });
  }
}
