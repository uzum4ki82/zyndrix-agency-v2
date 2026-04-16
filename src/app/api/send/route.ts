import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name = "Empresa", analysisData = {}, location = "su ciudad", isTest = false, ping, id } = body;
    const origin = request.headers.get('origin') || 'https://zyndrix.dev';
    
    // Use a fixed production domain for branding assets to ensure visibility during local tests
    const productionUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://comercial-eta.vercel.app';
    const logoUrl = `${productionUrl}/logo-zyndrix.png`;
    const avatarUrl = `${productionUrl}/img/avatar-oscar.png`;
    
    // Absolute function for payload assets - Smart resolving for local/prod
    const absolutize = (url: string) => {
      if (!url) return '';
      if (url.startsWith('http')) return url;
      
      const isLocalHost = origin.includes('localhost') || origin.includes('127.0.0.1');
      const base = isLocalHost ? 'http://127.0.0.1:3000' : productionUrl;
      
      return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    const demoUrl = absolutize(`/demo/${id}`);

    if (ping) {
      return NextResponse.json({ success: true, status: process.env.RESEND_API_KEY ? 'live' : 'mock' });
    }

    const targetEmail = isTest ? 'omontesquesada@gmail.com' : (email || 'omontesquesada@gmail.com');
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

    // --- TACTICAL INTELLIGENCE GENERATOR ---
    const tech = analysisData?.techStack || '';
    const signals = analysisData?.signals || {};

    let techComment = "Tras nuestro último escaneo, hemos detectado que su infraestructura digital presenta limitaciones técnicas que impiden una correcta indexación en su nicho estratégico.";
    if (tech.toLowerCase().includes('wordpress')) {
      techComment = `Su plataforma comercial actual basada en <strong>WordPress</strong> compromete la velocidad de carga crítica, lo que deriva en una pérdida directa de conversiones potenciales frente a su competencia directa.`;
    } else if (tech.toLowerCase().includes('wix') || tech.toLowerCase().includes('shopify')) {
      techComment = `El uso de sistemas de plantilla como ${tech} limita su capacidad de diferenciación en un mercado saturado, homogeneizando su propuesta de valor.`;
    }

    const { data, error } = await resend.emails.send({
      from: fromEmail, 
      to: [targetEmail],
      subject: `Dictamen de Capital Digital: ${name}`,
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
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
            body { 
              margin: 0; 
              padding: 0; 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              background-color: #f8fafc; 
              -webkit-font-smoothing: antialiased;
            }
            .wrapper { width: 100%; table-layout: fixed; background-color: #f1f5f9; padding: 60px 0; }
            .container { 
              max-width: 960px; 
              margin: 0 auto; 
              background: #ffffff; 
              border-radius: 24px; 
              border: 1px solid #e2e8f0;
              overflow: hidden; 
              box-shadow: 0 20px 50px rgba(0, 0, 0, 0.05);
            }
            .hero {
              background: #0f172a;
              padding: 80px 100px;
              text-align: left;
            }
            .logo { height: 48px; width: auto; display: block; filter: brightness(100); }
            
            .content { padding: 80px 100px; }
            
            .badge { 
              display: inline-block; 
              padding: 8px 16px; 
              background: #eef2ff; 
              color: #4f46e5; 
              font-size: 12px; 
              font-weight: 800; 
              text-transform: uppercase; 
              letter-spacing: 0.15em; 
              border-radius: 8px;
              margin-bottom: 32px;
            }
            
            .headline { 
              font-size: 64px; 
              font-weight: 800; 
              color: #0f172a; 
              margin: 0 0 24px; 
              line-height: 1.05; 
              letter-spacing: -0.04em; 
            }
            
            .subheadline { 
              font-size: 24px; 
              color: #475569; 
              margin: 0 0 56px; 
              font-weight: 400; 
              line-height: 1.4;
              max-width: 80%;
            }
            
            .paragraph { 
              font-size: 20px; 
              line-height: 1.7; 
              color: #334155; 
              margin-bottom: 48px; 
            }
            
            .diagnostic-card {
              background: #f8fafc;
              border-left: 6px solid #4f46e5;
              border-radius: 20px;
              padding: 56px;
              margin-bottom: 64px;
            }
            
            .diagnostic-title {
              font-size: 14px;
              font-weight: 800;
              color: #4f46e5;
              text-transform: uppercase;
              letter-spacing: 0.2em;
              margin-bottom: 24px;
              display: block;
            }
            
            .diagnostic-text {
              font-size: 22px;
              color: #0f172a;
              font-weight: 600;
              line-height: 1.5;
            }
            
            .cta-wrapper { margin: 64px 0; }
            
            .cta-button { 
              display: inline-block; 
              background: #4f46e5; 
              color: #ffffff !important; 
              padding: 28px 60px; 
              border-radius: 16px; 
              text-decoration: none; 
              font-size: 19px; 
              font-weight: 800; 
              box-shadow: 0 20px 40px rgba(79, 70, 229, 0.3);
              transition: all 0.3s ease;
            }
            
            .footer { 
              padding: 80px 100px; 
              background: #ffffff; 
              border-top: 1px solid #f1f5f9; 
            }
            
            .signature-table { width: 100%; border-spacing: 0; }
            .signature-avatar { border-radius: 16px; border: 1px solid #e2e8f0; width: 64px; height: 64px; }
            .signature-name { font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
            .signature-title { font-size: 14px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="container">
              <div class="hero">
                <img src="${logoUrl}" class="logo" alt="Zyndrix">
              </div>
              
              <div class="content">
                <div class="badge">Dictamen de Inteligencia de Mercado</div>
                <h1 class="headline">Arquitectura Estratégica Dominante: ${name}</h1>
                <p class="subheadline">Análisis de viabilidad para el despliegue de activos de alta conversión en el sector de ${location}.</p>
                
                <p class="paragraph">
                  Estimados directivos de <strong>${name}</strong>,<br/><br/>
                  Tras procesar vuestra infraestructura digital mediante nuestros modelos de análisis predictivo, hemos identificado una brecha crítica de autoridad que está delegando vuestro mercado potencial a competidores con menor capacidad técnica.
                </p>
                
                <div class="diagnostic-card">
                  <span class="diagnostic-title">Protocolo de Detección: Deficiencia Estructural</span>
                  <div class="diagnostic-text">
                    ${techComment}
                  </div>
                </div>
                
                <p class="paragraph">
                  Hemos configurado un ecosistema digital personalizado que no solo resuelve estos puntos de fricción, sino que reposiciona a <strong>${name}</strong> como la autoridad tecnológica indiscutible en su área de influencia.
                </p>
                
                <div class="cta-wrapper">
                  <a href="${demoUrl}" class="cta-button">
                    SOLICITAR ACCESO A LA NUEVA ARQUITECTURA →
                  </a>
                  <p style="margin-top: 32px; font-size: 14px; color: #94a3b8; font-style: italic; font-weight: 500;">
                    * El enlace anterior expira en 48 horas. Se requiere acceso desde un entorno seguro.
                  </p>
                </div>

                <div style="margin-top: 100px; padding-top: 60px; border-top: 1px solid #f1f5f9;">
                  <table class="signature-table">
                    <tr>
                      <td width="84" valign="top">
                        <img src="${avatarUrl}" class="signature-avatar" alt="Oscar Montes">
                      </td>
                      <td valign="top" style="padding-left: 20px;">
                        <div class="signature-name">Oscar Montes</div>
                        <div class="signature-title">Senior Strategy Lead @ Zyndrix Capital</div>
                        <div style="margin-top: 12px; font-size: 13px; color: #94a3b8; font-weight: 500;">
                          Consultoría Comercial de Alto Impacto
                        </div>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
              
              <div class="footer">
                <table width="100%">
                  <tr>
                    <td style="font-size: 14px; color: #94a3b8; font-weight: 500;">
                      © ${new Date().getFullYear()} Zyndrix Capital Systems.<br/>
                      <span style="font-size: 12px; margin-top: 4px; display: block; opacity: 0.7;">
                        Sistemas de Inteligencia y Despliegue de Activos Digitales.
                      </span>
                    </td>
                    <td align="right">
                      <img src="${logoUrl}" height="32" style="display: block; opacity: 0.6;" alt="Zyndrix">
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('❌ [RESEND_ERROR]:', error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      data 
    });
  } catch (error: any) {
    console.error('CRITICAL [OUTREACH_EXCEPTION]:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal Server Error during outreach',
      details: error.details || error
    }, { status: 500 });
  }
}
