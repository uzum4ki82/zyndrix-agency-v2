import { Business } from '@/types';

export const STITCH_PROMPTS = {
  MASTER_TEMPLATE: `
    System Context: You are a Lead Frontend Architect at Zyndrix Systems. Your goal is to generate a WOW-factor landing page for {BUSINESS_NAME}.
    Design Philosophy: 'Architectural Luxury' + 'Industrial Precision'. 
    Visual Requirements:
    - Dark Mode Base (Vantablack/Rich Black #050505)
    - High-Contrast Accents (Color: {PRIMARY_COLOR})
    - Glassmorphism & High-Fidelity Components (Blur 12px, Border 1px White/8%)
    - Typography: Space Grotesk for Headings, Inter for Body.
    - Animation: Subtle entrance transforms, scanning lines, pulse nodes.
    - Imagery: High-resolution professional photography related to {NICHE}.
    
    Structure:
    1. Navigation: Minimalist, tracked, with 'Tactical Booking' CTA.
    2. Hero: Ultra-bold typography for {BUSINESS_NAME}, perspective text, immersive background.
    3. Intelligence Reveal: V-Analysis section showing 'Structural Gaps' found during audit.
    4. Trust Module: Tech stack visualization (React, Next.js, Edge Runtime).
    5. Final Vector: Bold CTA for {BUSINESS_NAME} to WhatsApp/Consultation.
  `,
  
  getPromptForBusiness: (business: Business) => {
    const { name, category, intel, photoUrl } = business;
    const niche = category || "General Business";
    const primaryColor = "#FFB800"; // Default Zyndrix Gold, could be dynamic
    
    let base = STITCH_PROMPTS.MASTER_TEMPLATE
      .replace(/{BUSINESS_NAME}/g, name)
      .replace(/{NICHE}/g, niche)
      .replace(/{PRIMARY_COLOR}/g, primaryColor);
    
    // Add bespoke insights based on Tier
    if (intel?.tier === 'TIER_1') {
      base += `\n\n[STRATEGIC MISSION]: This business has NO digital footprint. The landing page must emphasize 'Immediate Market Entry' and 'Professional Credibility'.`;
    } else if (intel?.tier === 'TIER_2') {
      base += `\n\n[STRATEGIC MISSION]: This business relies on Social Media. The landing page must emphasize 'Ownership of Audience' and 'Brand Independence'.`;
    }

    // Add specific findings as design elements
    if (intel?.findings && intel.findings.length > 0) {
      base += `\n\n[DESIGN ELEMENTS - SOLVING PAIN POINTS]:`;
      intel.findings.forEach((finding: string) => {
        base += `\n- Visual Section addressing: ${finding}`;
      });
    }
    
    if (photoUrl) {
      base += `\n\n[USER PERSONALIZATION]: This is a real photo of the business from Google Maps. Use it as the HERO BACKGROUND to create immediate recognition: ${photoUrl}`;
    }
    
    return base;
  }
};
