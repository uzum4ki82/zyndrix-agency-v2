import { NextResponse } from 'next/server';
import { STITCH_PROMPTS } from '@/lib/stitch-prompts';
import { updateLeadWithServiceRole } from '@/lib/supabase';
import { extractBrandColors } from '@/lib/color-extractor';

/**
 * [FIX #2] ZYNDRIX STITCH ENGINE v3.0 - REAL INTEGRATION
 * -------------------------------------------------------
 * Generates unique, hyper-personalized landing pages via Stitch MCP.
 * Each lead gets a bespoke demo based on their niche, location, and pain points.
 */

// Helper: Build context-aware prompt for Stitch
function buildStitchPrompt(business: any): string {
  const supremePrompt = STITCH_PROMPTS.getPromptForBusiness(business);

  // Inject pain points as conversion triggers
  const painPointsContext = business.pain_points
    ? `\n\nDirect Pain Points to Address:\n${business.pain_points.map((p: string) => `- ${p}`).join('\n')}`
    : '';

  // Inject brand DNA if available
  const brandDnaContext = business.brand_palette
    ? `\n\nExtracted Brand Colors:\n- Primary: ${business.brand_palette.primary}\n- Secondary: ${business.brand_palette.secondary}`
    : '';

  return supremePrompt + painPointsContext + brandDnaContext;
}

// Helper: Call Stitch API to generate real project
async function generateStitchProject(business: any, prompt: string) {
  const STITCH_API_KEY = process.env.STITCH_API_KEY;
  const STITCH_ENDPOINT = process.env.STITCH_MCP_ENDPOINT;

  if (!STITCH_API_KEY || !STITCH_ENDPOINT) {
    console.warn('[STITCH] API credentials missing - using fallback demo URL');
    // Fallback for development
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
    console.error('[STITCH_API] Generation failed:', error);
    // Fallback to demo page
    return {
      projectId: `zyndrix_demo_${business.id.substring(0, 12)}`,
      previewUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/demo/${business.id}`,
      success: true,
      fallback: true,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function POST(request: Request) {
  try {
    const { business } = await request.json();

    if (!business || !business.id) {
      return NextResponse.json(
        { success: false, error: 'Missing business payload' },
        { status: 400 }
      );
    }

    console.log(`[FIX #2] Generating Stitch project for ${business.name}`);

    // [FIX #3] Extract brand colors from screenshot if not already extracted
    let enrichedBusiness = { ...business };
    if (!business.brand_palette && business.screenshot_url) {
      console.log(`[FIX #3] Extracting brand colors for ${business.name}...`);
      try {
        const brandPalette = await extractBrandColors(
          business.screenshot_url,
          business.name,
          business.category
        );
        enrichedBusiness.brand_palette = brandPalette;

        // Persist extracted colors to database
        const updateResult = await updateLeadWithServiceRole(business.id, {
          brand_palette: brandPalette
        });

        if (updateResult.success) {
          console.log(`[FIX #3] ✓ Brand palette persisted for ${business.name}`);
        }
      } catch (error) {
        console.warn(`[FIX #3] Color extraction failed, continuing with defaults:`, error);
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
      console.error(`[FIX #2] Failed to persist Stitch URL: ${updateResult.error}`);
      // Still return success if Stitch worked, even if persistence failed
      // Daemon will retry
    }

    console.log(`[FIX #2] ✓ Generated for ${business.name}: ${stitchResult.previewUrl}`);

    return NextResponse.json({
      success: true,
      previewUrl: stitchResult.previewUrl,
      projectId: stitchResult.projectId,
      stitchProjectId: stitchResult.projectId,
      personalized: !stitchResult.fallback,
      metadata: {
        businessName: business.name,
        tier: business.tier,
        category: business.category,
        generatedAt: new Date().toISOString(),
        usedFallback: stitchResult.fallback
      }
    });

  } catch (error) {
    console.error('[FIX #2] CRITICAL ERROR:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Generation failed'
      },
      { status: 500 }
    );
  }
}
