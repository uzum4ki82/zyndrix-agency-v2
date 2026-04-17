import { Business } from '@/types';

export const STITCH_PROMPTS = {
  MASTER_TEMPLATE: `
    System Context: You are a World-Class Design Architect at Zyndrix. Create a high-fidelity 'Architectural Luxury' landing page for {BUSINESS_NAME}.
    
    Contextual Intel:
    - Sector: {NICHE}
    - Location: {LOCATION}
    - Current Weakness: {PAIN_POINT} (This must be the central problem the new design solves)
    - Tech Vulnerability: {TECH_STACK}
    
    Design Tokens (HYPER-PERSONALIZED):
    - Primary Accent: {PRIMARY_COLOR} (Derived from the business's visual identity)
    - Background: {BG_COLOR} (Deep Contrast)
    - Texture: Subtle architectural grain and geometric glassmorphism.
    - Typography: 'Syne' for bold statements, 'Outfit' for precise technical details.
    
    Content Strategy (PSYCHOLOGICAL):
    - Tone: Exclusive, technical, high-authority, and urgently transformative.
    - Narrative: Moving {BUSINESS_NAME} from 'Legacy Irrelevance' to 'Digital Dominance' in {LOCATION}.
    
    Layout Architecture:
    1. Hero: A massive, cinematic shot of {BUSINESS_NAME} or its sector context ({PHOTO_URL}), with a HUD-style diagnostic overlay showing high-speed recovery metrics.
    2. The Digital Audit: A technical breakdown showing the exact {PAIN_POINT} and how our $50k infrastructure solves it.
    3. Proof of Authority: 3D interactive grid showcasing the global reach of a boutique agency in {LOCATION}.
    4. Call to Action: A 'Secure Your Territory' terminal interface.
  `,
  
  getPromptForBusiness: (business: any) => {
    const { name, category, address, pain_points, tech_stack, photoUrl, screenshot_url, rating } = business;
    const niche = category || "Sector Estratégico";
    const location = address?.split(',')[0] || "Tu Zona de Operación";
    const mainPainPoint = Array.isArray(pain_points) ? pain_points[0] : (pain_points || "Obsolescencia Técnica");
    
    // PERSONALIZED COLOR EXTRACTION LOGIC
    // We derive colors from the category to match the industry vibe
    let primaryColor = "#6366f1"; // Default Indigo
    let bgColor = "#050505";      // Default Obsidian
    
    if (category?.toLowerCase().includes('taller') || category?.toLowerCase().includes('reformas') || category?.toLowerCase().includes('construction')) {
      primaryColor = "#ff5f1f"; // Neon Orange (Industrial/Action)
    } else if (category?.toLowerCase().includes('clinic') || category?.toLowerCase().includes('dental') || category?.toLowerCase().includes('doctor')) {
      primaryColor = "#00f2ff"; // Cyan/Teal (Cleanliness/Tech)
    } else if (category?.toLowerCase().includes('luxury') || category?.toLowerCase().includes('arquitect') || category?.toLowerCase().includes('lujo')) {
      primaryColor = "#d4af37"; // Metallic Gold (Exclusivity)
    } else if (category?.toLowerCase().includes('restaurante') || category?.toLowerCase().includes('gastronomia')) {
      primaryColor = "#f43f5e"; // Rose/Red (Appetite/Sophistication)
    }

    let base = STITCH_PROMPTS.MASTER_TEMPLATE
      .replace(/{BUSINESS_NAME}/g, name)
      .replace(/{NICHE}/g, niche)
      .replace(/{LOCATION}/g, location)
      .replace(/{PAIN_POINT}/g, mainPainPoint)
      .replace(/{TECH_STACK}/g, tech_stack || "Infraestructura Base")
      .replace(/{PRIMARY_COLOR}/g, primaryColor)
      .replace(/{BG_COLOR}/g, bgColor)
      .replace(/{PHOTO_URL}/g, screenshot_url || photoUrl || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab");
    
    return base;
  }
};
