import { Business } from '@/types';

export const STITCH_PROMPTS = {
  LAYOUTS: {
    SPLIT_HERO: "A high-impact split-screen hero section. Left: Bold typography and CTA. Right: Cinematic product/service imagery with dynamic glassmorphism overlays.",
    BENTO_GRID: "A modern bento-box style layout. Organized, visually dense but clean grids showcasing features, testimonials, and brand identity in separate interactive tiles.",
    MODERN_MINIMAL: "Ultra-minimalist layout with massive whitespace, giant typography, and subtle micro-animations. Focused on a single, powerful brand message.",
    CAROUSEL_IMPERIAL: "A cinematic horizontal-scroll experience. Massive high-fidelity images transitioning with sleek parallax effects, showcasing the scale of the business."
  },

  TEMPLATES: {
    DEFAULT: {
      title: "Digital Authority",
      description: "Transforming local operations into global digital standards.",
      sections: ["Authority Visualization", "Core Expertise", "Strategic Contact"]
    },
    GASTRONOMY: {
      title: "Culinary Legacy",
      description: "An immersive digital experience that tastes as good as the food.",
      sections: ["Executive Menu Showcase", "Ambiance Gallery", "VIP Booking Engine"]
    },
    MEDICAL: {
      title: "Professional Excellence",
      description: "Trust-centric architecture for high-stakes health services.",
      sections: ["Specialist Profiles", "Patient Journey Map", "Secure Consultation Gateway"]
    },
    AUTOMOTIVE: {
      title: "Precision Engineering",
      description: "High-performance interfaces for high-performance machines.",
      sections: ["Diagnostic Excellence", "Fleet Showcase", "Real-time Service Tracker"]
    },
    REAL_ESTATE: {
      title: "Architectural Luxury",
      description: "Selling the dream through pixel-perfect property visualization.",
      sections: ["Luxury Portfolio", "Interactive Property Map", "Direct Agent Access"]
    }
  },

  MASTER_TEMPLATE: `
    System Context: You are a World-Class Creative Director at Zyndrix. Create a high-fidelity, bespoke landing page for {BUSINESS_NAME}.
    Reference Aesthetic: https://revauto.vercel.app/ (Modern, Premium, High-Impact).
    
    Contextual Intel:
    - Sector: {NICHE}
    - Location: {LOCATION}
    - Strategy: {STRATEGY}
    - Mission: {MISSION_DESCRIPTION}
    
    Layout Architecture (MANDATORY): {LAYOUT_TYPE}
    
    Design Tokens (HYPER-PERSONALIZED):
    - Primary Accent: {PRIMARY_COLOR}
    - Secondary Accent: {ACCENT_COLOR}
    - Background: {BG_COLOR}
    - Texture: Subtle glassmorphism, noise grain, and organic gradients.
    - Typography: 'Syne' or 'Clash Display' for headings (Bold/Heavy), 'Inter' for body.
    
    Core Components Required:
    1. Navigation: Minimal, floating, glassmorphism style with {BUSINESS_NAME} hidden-gem logo feel.
    2. Hero: {LAYOUT_DESCRIPTION}
    3. The '{SECTION_TITLE}' Section: {SECTION_DESCRIPTION}
    4. Industry-Specific Module: {INDUSTRY_MODULE}
    5. Social Proof: Animated testimonial slider with premium avatars and industry-specific metrics.
    6. Future-Ready CTA: A massive, unavoidable 'Contact' section with a unique interaction optimized for {LOCATION}.
    
    Content Tone: Exclusive, sophisticated, and results-driven. Avoid generic marketing Speak. Talk about 'Dominance', 'Precision', and 'Legacy'.
    
    Imagery: Use AI-generated descriptions for images that reflect: {IMAGE_PROMPT}
  `,
  
  getPromptForBusiness: (business: any) => {
    const { id, name, category, address, brand_palette, tech_stack, pain_points } = business;
    const niche = category || "Servicios Premium";
    const catLower = niche.toLowerCase();
    const location = address?.split(',')[0] || "Tu Ciudad";

    // Select Template based on category
    let template = STITCH_PROMPTS.TEMPLATES.DEFAULT;
    let industryModule = "A generic service list with 3D interactions.";
    
    if (catLower.includes('restaurante') || catLower.includes('gastronom')) {
      template = STITCH_PROMPTS.TEMPLATES. GASTRONOMY;
      industryModule = "Interactive Digital Menu with floating ingredients and parallax scroll.";
    } else if (catLower.includes('clinica') || catLower.includes('salud') || catLower.includes('dent')) {
      template = STITCH_PROMPTS.TEMPLATES.MEDICAL;
      industryModule = "A dynamic 'Health Score' calculator and trust-based certification mosaic.";
    } else if (catLower.includes('taller') || catLower.includes('auto')) {
      template = STITCH_PROMPTS.TEMPLATES.AUTOMOTIVE;
      industryModule = "A 3D parts explorer and service status visualization module.";
    } else if (catLower.includes('reforma') || catLower.includes('construc') || catLower.includes('arq')) {
      template = STITCH_PROMPTS.TEMPLATES.REAL_ESTATE;
      industryModule = "A before/after slider using deep architectural shadows and light play.";
    }

    // VARIETY: Seed based on ID to select layout
    const layoutKeys = Object.keys(STITCH_PROMPTS.LAYOUTS);
    const seed = (id?.toString().length || 0) % layoutKeys.length;
    const selectedLayoutKey = layoutKeys[seed];
    const layoutDescription = STITCH_PROMPTS.LAYOUTS[selectedLayoutKey as keyof typeof STITCH_PROMPTS.LAYOUTS];

    // Color Handling
    let primary = brand_palette?.primary || "#6366f1";
    let accent = brand_palette?.secondary || "#10b981";
    let bg = brand_palette?.background || "#020617";
    
    // Image Prompt Construction
    let imgPrompt = `Modern ${niche} establishment with premium lighting and materials, architectural photography style, 8k.`;
    if (catLower.includes('restaurante')) imgPrompt = "Gourmet dish presentation in a moody high-end restaurant, cinematic focus.";
    if (catLower.includes('med')) imgPrompt = "Modern clinical cleanroom with futuristic holographic medical displays, soft blue tones.";

    // Mission from Tech Stack (Senior Touch)
    const missionDesc = tech_stack?.includes('Wix') || tech_stack?.includes('WordPress') 
      ? `Breaking the limitations of ${tech_stack} to deliver a high-performance Next.js infrastructure.`
      : `Elevating their current ${tech_stack || 'Legacy'} stack to an industry-leading standard.`;

    const strategy = pain_points?.length > 0 
      ? `Addressing directly: ${pain_points[0]}` 
      : `Focusing on ${location} market dominance through visual superiority.`;

    return STITCH_PROMPTS.MASTER_TEMPLATE
      .replace(/{BUSINESS_NAME}/g, name)
      .replace(/{NICHE}/g, niche)
      .replace(/{LOCATION}/g, location)
      .replace(/{STRATEGY}/g, strategy)
      .replace(/{MISSION_DESCRIPTION}/g, missionDesc)
      .replace(/{LAYOUT_TYPE}/g, selectedLayoutKey)
      .replace(/{LAYOUT_DESCRIPTION}/g, layoutDescription)
      .replace(/{SECTION_TITLE}/g, template.title)
      .replace(/{SECTION_DESCRIPTION}/g, template.description)
      .replace(/{INDUSTRY_MODULE}/g, industryModule)
      .replace(/{PRIMARY_COLOR}/g, primary)
      .replace(/{ACCENT_COLOR}/g, accent)
      .replace(/{BG_COLOR}/g, bg)
      .replace(/{IMAGE_PROMPT}/g, imgPrompt);
  }
};

