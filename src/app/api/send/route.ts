import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, analysisData, location, isTest, ping, id } = body;
    const origin = request.headers.get('origin') || 'https://zyndrix.dev';
    
    // Use a fixed production domain for branding assets to ensure visibility during local tests
    // Use a fixed production domain for branding assets and links to ensure they work for the client
    const productionUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://zyndrix.dev';
    const logoUrl = `${productionUrl}/img/logofinal2.jpg`;
    const avatarUrl = `${productionUrl}/img/avatar-oscar.png`;
    
    // The link the client will actually click
    const demoUrl = `${productionUrl}/demo/${id}`;

    if (ping) {
      return NextResponse.json({ success: true, status: process.env.RESEND_API_KEY ? 'live' : 'mock' });
    }

    const targetEmail = isTest ? 'omontesquesada@gmail.com' : (email || 'omontesquesada@gmail.com');

    const apiKey = process.env.RESEND_API_KEY || '';
    if (!apiKey || apiKey.toLowerCase().includes('your_key') || apiKey === 're_123456789') {
      return NextResponse.json({ 
        success: true, 
        message: 'Simulated tactical send success (MOCK MODE)', 
        mock: true,
        sentTo: targetEmail 
      });
    }

    const resend = new Resend(apiKey);
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'Óscar de Zyndrix <onboarding@resend.dev>';

    // Prepare competitive stats strings
    const currentRating = analysisData?.currentRating?.toFixed(1) || '4.2';
    const marketLeader = analysisData?.marketLeaderRef?.toFixed(1) || '4.8';
    const gap = analysisData?.competitorGap?.toFixed(1) || '0.6';

    // --- TACTICAL INTELLIGENCE GENERATOR ---
    const tech = analysisData?.techStack || '';
    const signals = analysisData?.signals || {};
    
    let techComment = "He estado analizando vuestra infraestructura digital actual. Como especialistas en arquitectura de sistemas, vemos una oportunidad clara de elevar vuestra autoridad online.";
    if (tech.toLowerCase().includes('wordpress')) {
      techComment = `He notado que vuestra web actual utiliza <strong>WordPress</strong>. Aunque es funcional, en el sector de lujo esto suele penalizar la velocidad de carga y la exclusividad de la experiencia que vuestros clientes esperan.`;
    } else if (tech.toLowerCase().includes('wix') || tech.toLowerCase().includes('shopify')) {
      techComment = `Vuestra plataforma actual (${tech}) es una buena base, pero limita vuestra capacidad de implementar flujos de IA personalizados y una identidad visual verdaderamente única.`;
    }

    let signalsComment = "";
    if (signals && !signals.instagram) {
      signalsComment = "Además, he detectado una ausencia estratégica en <strong>Instagram</strong>, un canal vital para captar tráfico cualificado en vuestra zona.";
    } else if (signals && !signals.whatsapp) {
      signalsComment = "Un detalle crítico: no he visto un acceso directo a <strong>WhatsApp</strong>. En 2024, esto significa perder hasta un 40% de conversiones por falta de inmediatez.";
    }

    const { data, error } = await resend.emails.send({
      from: fromEmail, 
      to: [targetEmail],
      subject: isTest ? `[VISTA PREVIA] Propuesta de Arquitectura Digital para ${name}` : `Propuesta Estratégica: Transformación Digital ${name}`,
      tags: [
        { name: 'lead_id', value: id || 'test' }
      ],
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&display=swap');
            body { margin: 0; padding: 0; font-family: 'Inter', -apple-system, sans-serif; background-color: #fcfcfd; }
            .container { max-width: 600px; margin: 20px auto; background: #ffffff; border: 1px solid #f1f5f9; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05); }
            .content { padding: 40px 48px; }
            .header { border-bottom: 1px solid #f1f5f9; padding: 12px 48px; text-align: left; }
            .tag { display: inline-block; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #6366f1; margin-bottom: 8px; }
            .title { font-size: 28px; font-weight: 800; color: #0f172a; margin: 0; letter-spacing: -0.02em; line-height: 1.2; }
            .body-text { font-size: 15px; line-height: 1.6; color: #475569; margin: 24px 0; }
            .stat-box { background: #f8fafc; border-radius: 16px; padding: 24px; margin: 32px 0; border: 1px solid #f1f5f9; text-align: center; }
            .stat-grid { display: table; width: 100%; border-collapse: separate; border-spacing: 0; }
            .stat-col { display: table-cell; width: 50%; vertical-align: middle; }
            .stat-val { font-size: 28px; font-weight: 800; color: #0f172a; display: block; margin-bottom: 4px; }
            .stat-label { font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; }
            .button { display: inline-block; background: #0f172a; color: #ffffff !important; padding: 18px 36px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 12px; }
            .blueprint-preview { margin-top: 32px; border-radius: 16px; border: 1px solid #f1f5f9; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
            .footer { padding: 32px 48px; border-top: 1px solid #f1f5f9; background: #fafafa; }
            .signature { margin-top: 40px; border-top: 1px solid #f8fafc; padding-top: 32px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="${logoUrl}" height="40" style="display: block; border: 0; height: 40px; width: auto; background-color: #ffffff; -ms-interpolation-mode: bicubic;" alt="Zyndrix">
            </div>
            
            <div class="content">
              <p class="body-text">
                Hola al equipo de <strong>${name}</strong>,<br/><br/>
                He estado analizando el panorama digital del sector en <strong>${location}</strong>.<br/><br/>
                ${techComment} ${signalsComment}
              </p>

              <div class="stat-box">
                <div class="tag">Análisis Comparativo Local</div>
                <div class="stat-grid" style="margin-top: 16px;">
                  <div class="stat-col" style="border-right: 1px solid #e2e8f0; padding-right: 10px;">
                    <span class="stat-val">${currentRating} ★</span>
                    <span class="stat-label">Tu Posición</span>
                  </div>
                  <div class="stat-col" style="padding-left: 10px;">
                    <span class="stat-val" style="color: #6366f1;">${marketLeader} ★</span>
                    <span class="stat-label">Líder Market</span>
                  </div>
                </div>
                <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #f1f5f9;">
                  <span style="font-size: 12px; font-weight: 700; color: #ef4444;">
                    Brecha Competitiva Detectada: ${gap} puntos
                  </span>
                </div>
              </div>

              <p class="body-text">
                He desarrollado una <strong>propuesta de arquitectura digital personalizada</strong> para cerrar esta brecha. No es un PDF estático, sino un prototipo funcional diseñado para optimizar el lujo y la conversión de vuestra marca. Podéis explorarlo en el entorno interactivo que he configurado para vosotros:
              </p>
              
              <div class="blueprint-preview">
                <a href="${analysisData.stitchPreviewUrl || demoUrl}" style="text-decoration: none; display: block;">
                  <img src="${analysisData.screenshotUrl || 'https://images.unsplash.com/photo-1551288049-bbbda536339a?w=1000'}" style="width: 100%; display: block;" alt="Propuesta Zyndrix">
                  <div style="background: #0f172a; color: #ffffff; padding: 18px; text-align: center; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em;">
                    Acceder a la Experiencia Digital Interactiva
                  </div>
                </a>
              </div>

              <div class="signature">
                <table width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td width="64" valign="middle">
                      <img src="${avatarUrl}" width="54" height="54" style="border-radius: 50%; border: 1px solid #e2e8f0; padding: 2px; object-fit: cover;" alt="Óscar Montes">
                    </td>
                    <td valign="middle" style="padding-left: 16px;">
                      <div style="font-weight: 800; color: #0f172a; font-size: 15px;">Óscar Montes</div>
                      <div style="color: #6366f1; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Lead Digital Architect @ Zyndrix</div>
                    </td>
                  </tr>
                </table>
              </div>
            </div>

            <div class="footer">
              <table width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="font-size: 11px; color: #94a3b8; line-height: 1.6;">
                    <strong style="color: #6366f1; letter-spacing: 0.1em; text-transform: uppercase;">Zyndrix Labs</strong><br/>
                    Arquitectura de Sistemas Digitales Premium<br/>
                    <a href="https://zyndrix.dev" style="color: #6366f1; text-decoration: none; font-weight: 700;">www.zyndrix.dev</a>
                  </td>
                  <td align="right" valign="middle">
                    <img src="${logoUrl}" height="32" style="display: block; height: 32px; width: auto; opacity: 0.8;" alt="Zyndrix">
                  </td>
                </tr>
              </table>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('❌ [RESEND_ERROR]:', error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
