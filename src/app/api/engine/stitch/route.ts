import { NextResponse } from 'next/server';
import { STITCH_PROMPTS } from '@/lib/stitch-prompts';

export async function POST(request: Request) {
  try {
    const { business } = await request.json();
    
    // In a real implementation, this would trigger the actual Stitch generation
    // using the Supreme Prompt calculated here.
    const supremePrompt = STITCH_PROMPTS.getPromptForBusiness(business);

    console.log(`[STITCH_ENGINE] Generated Supreme Prompt for ${business.name}:`);
    console.log(supremePrompt);
    
    await new Promise(r => setTimeout(r, 2000)); // Simulate deep generation
    
    const previewUrl = `/demo/${business.id}`;

    return NextResponse.json({
      success: true,
      projectId: `stitch-${business.name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`,
      previewUrl: previewUrl,
      screenshotUrl: business.screenshotUrl || business.screenshot || business.photoUrl || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000",
      metadata: {
        theme: "Architectural Luxury",
        prompt: supremePrompt,
        businessName: business.name
      }
    });

  } catch (error) {
    console.error("Stitch Generation API Error:", error);
    return NextResponse.json({ error: "Failed to initiate generation" }, { status: 500 });
  }
}
