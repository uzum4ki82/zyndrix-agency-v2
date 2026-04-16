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
    
    // For the demo "Taller Xapi", we return the high-fidelity prototype path
    const isTallerXapi = business.name.toLowerCase().includes('xapi');
    const previewUrl = isTallerXapi 
      ? "/demo-taller.html" 
      : `https://stitch.zyndrix.dev/preview/${business.id}?theme=supreme`;

    return NextResponse.json({
      success: true,
      projectId: `stitch-${business.name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`,
      previewUrl: previewUrl,
      screenshotUrl: business.photoUrl || (isTallerXapi ? "/assets/demo/hero.png" : "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800"),
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
