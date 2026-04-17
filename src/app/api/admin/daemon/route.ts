import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const logPath = path.resolve(process.cwd(), './daemon.log');
    if (!fs.existsSync(logPath)) {
      return NextResponse.json({ logs: [] });
    }
    
    const content = fs.readFileSync(logPath, 'utf8');
    const logs = content.split('\n').filter(Boolean).slice(-50).reverse(); // Last 50 entries
    
    return NextResponse.json({ logs });
  } catch (error) {
    return NextResponse.json({ error: "Failed to read daemon logs" }, { status: 500 });
  }
}
