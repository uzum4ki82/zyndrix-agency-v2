import { NextResponse } from 'next/server';
import { STITCH_PROMPTS } from '@/lib/stitch-prompts';

export async function POST(request: Request) {
  try {
    const { business } = await request.json();
    
    // In a real implementation, this would trigger the actual Stitch generation
    // using the Supreme Prompt calculated here.
    const supremePrompt = STITCH_PROMPTS.getPromptForBusiness(business);
    
    // Extract colors from the strategy text if present (saved during audit)
    const strategyText = business.strategy || '';
    const colorMatch = strategyText.match(/#[0-9a-f]{6}/i);
    const primaryColor = colorMatch ? colorMatch[0] : '#1a1a1a';
    
    console.log(`[STITCH_ENGINE] Generating Bespoke Assets for ${business.name}...`);
    console.log(`[STITCH_DNA] Primary Color Detected: ${primaryColor}`);
    
    await new Promise(r => setTimeout(r, 1500)); // AI Generation Cycle
    
    const previewUrl = `/demo/${business.id}`;

    return NextResponse.json({
      success: true,
      projectId: `stitch-${business.id.substring(0,8)}`,
      stitchProjectId: `stitch-${business.id.substring(0,8)}`,
      previewUrl: previewUrl,
      screenshotUrl: business.screenshot_url || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000",
      metadata: {
        theme: "Architectural Luxury",
        primaryColor: primaryColor,
        prompt: supremePrompt,
        businessName: business.name,
        personalized: true
      }
    });

  } catch (error) {
    console.error("Stitch Generation API Error:", error);
    return NextResponse.json({ error: "Failed to initiate generation" }, { status: 500 });
  }
}
