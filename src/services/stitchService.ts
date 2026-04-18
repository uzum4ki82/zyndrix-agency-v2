import { STITCH_PROMPTS } from '@/lib/stitch-prompts';
import { updateLeadWithServiceRole } from '@/lib/supabase';
import { extractBrandColors } from '@/lib/color-extractor';
import { daemonLog } from '@/lib/logger';

/**
 * [FIX #2] ZYNDRIX STITCH ENGINE v3.0 - SERVICE LAYER
 * Encapsulates all personalized demo generation logic
 */

function buildStitchPrompt(business: any): string {
  const supremePrompt = STITCH_PROMPTS.getPromptForBusiness(business);

  const painPointsContext = business.pain_points
    ? `\n\nDirect Pain Points to Address:\n${business.pain_points.map((p: string) => `- ${p}`).join('\n')}`
    : '';

  const brandDnaContext = business.brand_palette
    ? `\n\nExtracted Brand Colors:\n- Primary: ${business.brand_palette.primary}\n- Secondary: ${business.brand_palette.secondary}`
    : '';

  return supremePrompt + painPointsContext + brandDnaContext;
}

async function generateStitchProject(business: any, prompt: string) {
  const STITCH_API_KEY = process.env.STITCH_API_KEY;
  const STITCH_ENDPOINT = process.env.STITCH_MCP_ENDPOINT;

  if (!STITCH_API_KEY || !STITCH_ENDPOINT) {
    daemonLog('warning', '[STITCH] API credentials missing - using fallback demo URL');
    return {
      projectId: `zyndrix_demo_${business.id.substring(0, 12)}`,
      previewUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/demo/${business.id}`,
      success: true,
      fallback: true
    };
  }

  try {
    const response = await fetch(`${STITCH_ENDPOINT}/projects/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STITCH_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: `${business.name} - Zyndrix Demo`,
        prompt: prompt,
        config: {
          theme: 'Architectural Luxury',
          colors: business.brand_palette ? {
            primary: business.brand_palette.primary,
            secondary: business.brand_palette.secondary,
            background: '#020617'
          } : undefined,
          analytics: {
            trackPageView: true,
            trackClicks: true,
            trackTimeOnPage: true
          }
        },
        metadata: {
          businessId: business.id,
          businessName: business.name,
          tier: business.tier,
          category: business.category,
          createdBy: 'zyndrix-daemon'
        }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Stitch API error: ${response.status} - ${error}`);
    }

    const data = await response.json();

    return {
      projectId: data.projectId || `stitch_${business.id}`,
      previewUrl: data.previewUrl || `${process.env.NEXT_PUBLIC_APP_URL}/demo/${business.id}`,
      success: true,
      fallback: false
    };
  } catch (error) {
    daemonLog('error', `[STITCH_API] Generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return {
      projectId: `zyndrix_demo_${business.id.substring(0, 12)}`,
      previewUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/demo/${business.id}`,
      success: true,
      fallback: true,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function performStitchGeneration(
  business: any,
  autoTrigger: boolean = false
): Promise<{
  success: boolean;
  previewUrl: string;
  projectId: string;
  personalized: boolean;
  metadata: any;
  error?: string;
}> {
  const triggerType = autoTrigger ? '[AUTO]' : '[MANUAL]';
  daemonLog('info', `[FIX #2] ${triggerType} Generating Stitch project for ${business.name}`);

  let enrichedBusiness = { ...business };

  // [FIX #3] Extract brand colors from screenshot if not already extracted
  if (!business.brand_palette && business.screenshot_url) {
    daemonLog('info', `[FIX #3] Extracting brand colors for ${business.name}...`);
    try {
      const brandPalette = await extractBrandColors(
        business.screenshot_url,
        business.name,
        business.category
      );
      enrichedBusiness.brand_palette = brandPalette;

      const updateResult = await updateLeadWithServiceRole(business.id, {
        brand_palette: brandPalette
      });

      if (updateResult.success) {
        daemonLog('success', `[FIX #3] ✓ Brand palette persisted for ${business.name}`);
      }
    } catch (error) {
      daemonLog('warning', `[FIX #3] Color extraction failed, continuing with defaults: ${error}`);
    }
  }

  // 1. Build context-aware prompt with pain points & brand DNA
  const prompt = buildStitchPrompt(enrichedBusiness);

  // 2. Call Stitch API (or fallback to demo)
  const stitchResult = await generateStitchProject(enrichedBusiness, prompt);

  // 3. [FIX #1] Persist to database using service role
  const updateResult = await updateLeadWithServiceRole(business.id, {
    stitch_preview_url: stitchResult.previewUrl,
    stitch_project_id: stitchResult.projectId,
    status: 'GENERATED'
  });

  if (!updateResult.success) {
    daemonLog('warning', `[FIX #2] Failed to persist Stitch URL: ${updateResult.error}`);
  }

  daemonLog('success', `[FIX #2] ✓ Generated for ${business.name}: ${stitchResult.previewUrl}`);

  return {
    success: true,
    previewUrl: stitchResult.previewUrl,
    projectId: stitchResult.projectId,
    personalized: !stitchResult.fallback,
    metadata: {
      businessName: business.name,
      tier: business.tier,
      category: business.category,
      generatedAt: new Date().toISOString(),
      usedFallback: stitchResult.fallback
    },
    error: stitchResult.error
  };
}
