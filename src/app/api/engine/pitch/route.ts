import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { business } = await request.json();
    const companyType = business.companyType || 'pyme';
    
    // Generador de Propuesta Estratégica Zyndrix
    const name = business.name;
    const category = business.category;
    const hasWebsite = business.website && business.website !== 'https://no-web.com';
    
    // const marketPotential = business.intel?.marketPotential || 'ALTO';
    const lossLabel = business.intel?.estimatedLossLabel || 'Fuga de visibilidad activa';
    const score = business.intel?.score || 30;
    const findings = business.intel?.findings?.slice(0, 3) || [];
    
    let pitch = "";
    
    // Ajuste de Tono por Nivel de Empresa
    const greetings: Record<string, string> = {
      'autonomo': `Hola ${name},`,
      'pyme': `Estimados responsables de ${name},`,
      'empresa': `Atención: Departamento de Marketing / Gerencia de ${name},`,
      'corporativo': `Propuesta de Transformación Digital para ${name},`
    };
    const greeting = greetings[companyType] || `Hola equipo de ${name},`;

    const brandings: Record<string, string> = {
      'autonomo': "Atentamente,\n\n**Zyndrix Intelligence**\nTu partner tecnológico local",
      'pyme': "Saludos cordiales,\n\n**Equipo de Estrategia Zyndrix**\n[Zyndrix.dev](https://zyndrix.dev)",
      'empresa': "Quedamos a su disposición,\n\n**Dirección de Consultoría | Zyndrix**\n[Sistemas de Alta Conversión]",
      'corporativo': "Atentamente,\n\n**Unit of Enterprise Solutions | Zyndrix.dev**\nStrategic Digital Assets"
    };
    const branding = brandings[companyType] || "Atentamente,\n**Equipo Zyndrix**";

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://zyndrix-commercial.vercel.app';
    const demoUrl = `${appUrl}/demo/${business.id}`;

    if (!hasWebsite) {
      pitch = `
${greeting}

Soy del equipo estratégico de Zyndrix. He estado analizando esta mañana el potencial de los negocios en **${business.neighborhood || 'su localidad'}** y me he detenido en el vuestro por el gran margen de crecimiento que tenéis.

En lugar de mandarte una propuesta comercial tradicional, **hemos construido un prototipo real** de cómo debería verse vuestra presencia digital con nuestra tecnología Zyndrix V3 de alta conversión.

Puedes navegar tu nueva identidad aquí:
👉 **[Ver mi Demo Personalizada](${demoUrl})**

Está optimizada para cargar instantáneamente y convertir cada visita en un cliente real. Me encantaría saber qué te parece este nuevo enfoque para ${name}.

${branding}
      `.trim();
    } else {
      const painPointsList = business.intel?.painPoints?.slice(0, 2).map((p: string) => `💡 *Insight:* ${p}`).join('\n') || "";
      
      pitch = `
${greeting}

He estado auditando vuestra web actual y, aunque el producto es excelente, la tecnología que lo soporta está frenando vuestro crecimiento real (Score de Conversión: **${score}/100**).

${painPointsList}

Para que veas la diferencia real, **hemos desarrollado un prototipo de navegación fluida** específico para ${name}. Es una versión "Zyndrix High-Frequency" que carga en menos de 0.5 segundos.

Puedes interactuar con ella aquí mismo:
👉 **[Acceder a mi Prototipo Zyndrix](${demoUrl})**

Como verás, la experiencia es radicalmente superior a lo que tenéis ahora. ¿Te gustaría que comentáramos cómo activar este motor de crecimiento esta misma semana?

${branding}
      `.trim();
    }

    // Simulamos pensamiento de la IA
    await new Promise(r => setTimeout(r, 2000));

    return NextResponse.json({ email: pitch });
  } catch {
    return NextResponse.json({ error: "Pitch generation failed" }, { status: 500 });
  }
}
