/**
 * [FIX #3] VISUAL DNA EXTRACTOR
 * ============================
 * Extracts brand colors from business screenshots using Claude Vision API
 * Creates a unique visual identity for each lead's demo
 */

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export interface BrandPalette {
  primary: string;      // Main brand color (hex)
  secondary: string;    // Secondary accent (hex)
  accent: string;       // Tertiary highlight (hex)
  background?: string;  // Background base (hex)
  typography?: string;  // Recommended typography
  confidence: number;   // Confidence score (0-100)
}

/**
 * Extract dominant colors from an image URL using Claude Vision
 */
export async function extractBrandColors(
  imageUrl: string,
  businessName: string,
  businessCategory?: string
): Promise<BrandPalette> {
  try {
    if (!imageUrl || imageUrl.includes('placeholder') || imageUrl.includes('undefined')) {
      console.warn(`[COLOR_EXTRACTOR] Invalid image URL for ${businessName}, using default palette`);
      return getDefaultPaletteByCategory(businessCategory);
    }

    console.log(`[COLOR_EXTRACTOR] Analyzing visual DNA for ${businessName}...`);

    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "url",
                url: imageUrl
              }
            },
            {
              type: "text",
              text: `Analyze this business image and extract the visual DNA for a luxury brand redesign.

              Return ONLY a valid JSON response with this exact structure (no markdown, no code blocks):
              {
                "primary": "#RRGGBB",
                "secondary": "#RRGGBB",
                "accent": "#RRGGBB",
                "typography": "FontName",
                "confidence": 85,
                "analysis": "Brief one-line description"
              }

              Requirements:
              - primary: Most dominant/important brand color
              - secondary: Complementary color for depth
              - accent: Highlight color for CTAs/emphasis
              - typography: Recommended font style (e.g., "Modern Sans", "Serif Classic", "Geometric Bold")
              - confidence: How confident in the extraction (0-100)
              - ALL colors must be valid hex codes

              If the image doesn't have clear branding, use high-contrast professional colors.`
            }
          ]
        }
      ]
    });

    // Extract the text response
    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude Vision');
    }

    // Parse JSON from response
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn(`[COLOR_EXTRACTOR] Could not parse JSON response for ${businessName}`);
      return getDefaultPaletteByCategory(businessCategory);
    }

    const extracted = JSON.parse(jsonMatch[0]);

    // Validate hex colors
    const isValidHex = (color: string) => /^#[0-9A-F]{6}$/i.test(color);

    const palette: BrandPalette = {
      primary: isValidHex(extracted.primary) ? extracted.primary : '#6366f1',
      secondary: isValidHex(extracted.secondary) ? extracted.secondary : '#10b981',
      accent: isValidHex(extracted.accent) ? extracted.accent : '#f43f5e',
      background: extracted.background || '#020617',
      typography: extracted.typography || 'Modern Sans',
      confidence: Math.min(100, Math.max(0, extracted.confidence || 75))
    };

    console.log(`[COLOR_EXTRACTOR] ✓ Extracted for ${businessName}:`, {
      primary: palette.primary,
      secondary: palette.secondary,
      confidence: palette.confidence
    });

    return palette;

  } catch (error) {
    console.error(`[COLOR_EXTRACTOR] Error analyzing image for ${businessName}:`, error);
    return getDefaultPaletteByCategory(businessCategory);
  }
}

/**
 * Get default color palette based on business category
 */
function getDefaultPaletteByCategory(category?: string): BrandPalette {
  const cat = (category || '').toLowerCase();

  // Industry-specific palettes (fallback)
  if (cat.includes('restaurante') || cat.includes('gastronom')) {
    return {
      primary: '#f43f5e',      // Rose
      secondary: '#fbbf24',    // Amber
      accent: '#ec4899',       // Pink
      typography: 'Serif Elegant',
      confidence: 50
    };
  }

  if (cat.includes('taller') || cat.includes('auto')) {
    return {
      primary: '#f97316',      // Orange
      secondary: '#3b82f6',    // Blue
      accent: '#06b6d4',       // Cyan
      typography: 'Geometric Bold',
      confidence: 50
    };
  }

  if (cat.includes('clinica') || cat.includes('salud') || cat.includes('dent')) {
    return {
      primary: '#06b6d4',      // Cyan
      secondary: '#10b981',    // Emerald
      accent: '#8b5cf6',       // Purple
      typography: 'Modern Sans',
      confidence: 50
    };
  }

  if (cat.includes('reforma') || cat.includes('construc') || cat.includes('arq')) {
    return {
      primary: '#e5e7eb',      // Light Gray
      secondary: '#64748b',    // Slate
      accent: '#1f2937',       // Dark Gray
      typography: 'Minimalist Sans',
      confidence: 50
    };
  }

  // Default professional palette
  return {
    primary: '#6366f1',        // Indigo
    secondary: '#10b981',      // Emerald
    accent: '#f43f5e',         // Rose
    typography: 'Modern Sans',
    confidence: 40
  };
}

/**
 * Format brand palette as CSS variables for Stitch
 */
export function formatPaletteAsCSS(palette: BrandPalette): string {
  return `
    --color-primary: ${palette.primary};
    --color-secondary: ${palette.secondary};
    --color-accent: ${palette.accent};
    --color-background: ${palette.background || '#020617'};
    --font-display: ${palette.typography || 'system-ui, sans-serif'};
  `.trim();
}

/**
 * Format brand palette as Tailwind config
 */
export function formatPaletteAsTailwind(palette: BrandPalette): object {
  return {
    primary: {
      DEFAULT: palette.primary,
      dark: darkenColor(palette.primary)
    },
    secondary: {
      DEFAULT: palette.secondary,
      dark: darkenColor(palette.secondary)
    },
    accent: {
      DEFAULT: palette.accent,
      dark: darkenColor(palette.accent)
    }
  };
}

/**
 * Darken a hex color by 20%
 */
function darkenColor(hex: string): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * 20);
  const R = Math.max(0, (num >> 16) - amt);
  const G = Math.max(0, (num >> 8 & 0x00FF) - amt);
  const B = Math.max(0, (num & 0x0000FF) - amt);
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
}
