import { Business } from '@/types';

export const STITCH_PROMPTS = {
  LAYOUTS: {
    SPLIT_HERO: "A high-impact split-screen hero section. Left: Bold typography and CTA. Right: Cinematic product/service imagery with dynamic glassmorphism overlays.",
    BENTO_GRID: "A modern bento-box style layout. Organized, visually dense but clean grids showcasing features, testimonials, and brand identity in separate interactive tiles.",
    MODERN_MINIMAL: "Ultra-minimalist layout with massive whitespace, giant typography, and subtle micro-animations. Focused on a single, powerful brand message."
  },

  MASTER_TEMPLATE: `
    System Context: You are a World-Class Creative Director at Zyndrix. Create a high-fidelity, bespoke landing page for {BUSINESS_NAME}.
    Reference Aesthetic: https://revauto.vercel.app/ (Modern, Premium, High-Impact).
    
    Contextual Intel:
    - Sector: {NICHE}
    - Location: {LOCATION}
    - Mission: Transform {BUSINESS_NAME} from a local business into a Digital Authority.
    
    Layout Architecture (MANDATORY): {LAYOUT_TYPE}
    
    Design Tokens (HYPER-PERSONALIZED):
    - Primary Accent: {PRIMARY_COLOR}
    - Secondary Accent: {ACCENT_COLOR}
    - Background: {BG_COLOR}
    - Texture: Subtle glassmorphism, noise grain, and organic gradients.
    - Typography: 'Syne' or 'Clash Display' for headings (Bold/Heavy), 'Inter' for body.
    
    Core Components Required:
    1. Navigation: Minimal, floating, glassmorphism style.
    2. Hero: {LAYOUT_DESCRIPTION}
    3. The 'Authority' Section: Showcase {BUSINESS_NAME} as the #1 choice in {LOCATION} using high-end data visualization components.
    4. Service Excellence: 3D interactive cards describing their core offerings in {NICHE}.
    5. Social Proof: Animated testimonial slider with premium avatars.
    6. Future-Ready CTA: A massive, unavoidable 'Contact' section with a unique interaction.
    
    Content Tone: Exclusive, sophisticated, and results-driven. Avoid generic marketing Speak. Talk about 'Dominance', 'Precision', and 'Legacy'.
    
    Imagery: Use AI-generated descriptions for images that reflect: {IMAGE_PROMPT}
  `,
  
  getPromptForBusiness: (business: any) => {
    const { id, name, category, address, screenshot_url, brand_palette } = business;
    const niche = category || "Servicios Premium";
    const location = address?.split(',')[0] || "Tu Ciudad";

    // VARIETY: Seed based on ID to select layout
    const layoutKeys = Object.keys(STITCH_PROMPTS.LAYOUTS);
    const seed = (id?.toString().length || 0) % layoutKeys.length;
    const selectedLayoutKey = layoutKeys[seed];
    const layoutDescription = STITCH_PROMPTS.LAYOUTS[selectedLayoutKey as keyof typeof STITCH_PROMPTS.LAYOUTS];

    // [FIX #3] EXTRACTED BRAND DNA - Priority over default colors
    let primary = "#6366f1"; // Default Indigo
    let accent = "#10b981";  // Default Emerald
    let bg = "#020617";      // Default Navy Dark
    let imgPrompt = "Modern architectural office with clean lines and luxury lighting";

    // If brand_palette was extracted via Claude Vision, use those colors
    if (brand_palette && brand_palette.primary) {
      console.log(`[STITCH_PROMPTS] Using extracted brand colors for ${name}`);
      primary = brand_palette.primary;
      accent = brand_palette.secondary || brand_palette.accent;
      bg = brand_palette.background || "#020617";
    } else {
      // Fallback: Industry-specific defaults
      const cat = category?.toLowerCase() || '';
      if (cat.includes('restaurante') || cat.includes('gastronom')) {
        primary = "#f43f5e"; // Rose
        accent = "#fbbf24";  // Amber
        imgPrompt = "High-end gourmet dish in a dark, moody luxury restaurant setting, cinematic lighting";
      } else if (cat.includes('taller') || cat.includes('auto')) {
        primary = "#f97316"; // Orange
        accent = "#3b82f6";  // Blue
        imgPrompt = "Futuristic neon-lit car workshop with high-tech diagnostic equipment, 8k resolution";
      } else if (cat.includes('clinica') || cat.includes('salud') || cat.includes('dent')) {
        primary = "#06b6d4"; // Cyan
        accent = "#10b981";  // Emerald
        imgPrompt = "Minimalist luxury medical clinic lobby, white marble, soft teal lighting, professional";
      } else if (cat.includes('reforma') || cat.includes('construc') || cat.includes('arq')) {
        primary = "#ffffff"; // White/Silver
        accent = "#64748b";  // Slate
        imgPrompt = "Ultra-modern architectural villa with glass walls at dusk, glowing interiors";
      }
    }

    let base = STITCH_PROMPTS.MASTER_TEMPLATE
      .replace(/{BUSINESS_NAME}/g, name)
      .replace(/{NICHE}/g, niche)
      .replace(/{LOCATION}/g, location)
      .replace(/{LAYOUT_TYPE}/g, selectedLayoutKey)
      .replace(/{LAYOUT_DESCRIPTION}/g, layoutDescription)
      .replace(/{PRIMARY_COLOR}/g, primary)
      .replace(/{ACCENT_COLOR}/g, accent)
      .replace(/{BG_COLOR}/g, bg)
      .replace(/{IMAGE_PROMPT}/g, imgPrompt);

    return base;
  }
};
