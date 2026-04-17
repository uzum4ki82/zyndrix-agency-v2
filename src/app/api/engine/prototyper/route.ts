import { NextResponse } from 'next/server';
import { calculateLeadIntelligence } from '@/lib/agent-brain';

export async function POST(request: Request) {
  try {
    const { business } = await request.json();
    
    if (!business) {
      return NextResponse.json({ error: "Business data missing" }, { status: 400 });
    }

    // El Diseñador (DesignerAgent) ya está en calculateLeadIntelligence
    const intel = await calculateLeadIntelligence(business);

    // Simulamos generación de assets (tokens, colores, fuentes sugeridas)
    const prototype = {
      layoutType: intel.proposedLayout || 'Luxury Editorial',
      primaryColor: '#6366f1',
      secondaryColor: '#a855f7',
      typography: 'Outfit, sans-serif',
      structure: [
        { section: 'Hero', focus: 'Conversion & Value Prop' },
        { section: 'Evidence', focus: 'Reviews & Maps Authority' },
        { section: 'CTA', focus: 'Lead Capture & WhatsApp' }
      ],
      estimatedLaunchTime: '48h'
    };

    return NextResponse.json({ 
      success: true, 
      intel, 
      prototype 
    });
  } catch (error) {
    console.error("Prototyper Error:", error);
    return NextResponse.json({ error: "Failed to generate prototype" }, { status: 500 });
  }
}
