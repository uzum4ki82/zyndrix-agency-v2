import { NextResponse } from 'next/server';
import { performStitchGeneration } from '@/services/stitchService';

export async function POST(request: Request) {
  try {
    const { business, autoTrigger = false } = await request.json();

    if (!business || !business.id) {
      return NextResponse.json(
        { success: false, error: 'Missing business payload' },
        { status: 400 }
      );
    }

    const result = await performStitchGeneration(business, autoTrigger);

    return NextResponse.json({
      success: result.success,
      previewUrl: result.previewUrl,
      projectId: result.projectId,
      stitchProjectId: result.projectId,
      personalized: result.personalized,
      metadata: result.metadata,
      error: result.error
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
