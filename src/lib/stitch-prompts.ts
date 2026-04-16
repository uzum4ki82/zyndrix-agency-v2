import { Business } from '@/types';

export const STITCH_PROMPTS = {
  MASTER_TEMPLATE: `
    System Context: You are the Lead Design Director at Zyndrix Systems. Your mission is to generate a 'Architectural Luxury' experience for {BUSINESS_NAME}.
    
    Design Tokens:
    - Primary: {PRIMARY_COLOR} (Atmospheric Gold / Neon Amber)
    - Surface: #050505 (Deep Obsidian)
    - Glass: rgba(255, 255, 255, 0.03) with 24px backdrop-blur
    - Typography: 'Space Grotesk' (Headings, 900 weight), 'Inter' (Body, 400 weight)
    
    Magia & Micro-interactions:
    - Custom Cursor: Circle-to-dot transform on interactive elements.
    - Reveal: Grainy texture entrance for text blocks.
    - Scanning Lines: Subtle horizontal lines moving across the Hero to simulate AI audit.
    
    Content Blocks:
    1. Hero: Immersive perspective shot of {BUSINESS_NAME}'s real facade ({PHOTO_URL}) with overlayed digital diagnostic metrics.
    2. The Gap: Visualizing the commercial loss between {BUSINESS_NAME} and market leaders.
    3. Transformation: Interactive slider from 'Legacy Site' to 'Zyndrix Next-Gen'.
    4. Lead Flow: 3D visualization of customers entering the automated funnel.
    5. Tactical CTA: 'Desplegar Operación Digital' with immediate WhatsApp trigger.
  `,
  
  getPromptForBusiness: (business: any) => {
    const { name, category, tier, screenshot, photoUrl } = business;
    const niche = category || "Sector Estratégico";
    const primaryColor = tier === 'TIER 1' ? "#FFB800" : "#6366f1";
    
    let base = STITCH_PROMPTS.MASTER_TEMPLATE
      .replace(/{BUSINESS_NAME}/g, name)
      .replace(/{NICHE}/g, niche)
      .replace(/{PRIMARY_COLOR}/g, primaryColor)
      .replace(/{PHOTO_URL}/g, photoUrl || screenshot || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab");
    
    return base;
  }
};
