import { NextResponse } from 'next/server';
import { performLeadSearch } from '@/services/searchService';
import { daemonLog } from '@/lib/logger';

export async function POST(request: Request) {
  try {
    const { niche, location, companyType } = await request.json();
    daemonLog('info', `[Search API] Petición manual recibida: ${niche} en ${location} (${companyType})`);

    const leads = await performLeadSearch(niche, location, companyType);
    return NextResponse.json(leads);
  } catch (error: any) {
    daemonLog('error', `[Search API] Error Global: ${error.message || error}`);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}


