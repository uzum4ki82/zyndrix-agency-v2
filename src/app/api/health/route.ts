import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const healthStatus = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      uptime: Math.floor(process.uptime()),
    };

    return NextResponse.json(healthStatus, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: String(error) },
      { status: 503 }
    );
  }
}
