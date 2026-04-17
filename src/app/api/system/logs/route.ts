import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  try {
    const logPath = path.resolve(process.cwd(), './daemon.log');
    
    if (!fs.existsSync(logPath)) {
      return NextResponse.json([]);
    }

    const content = fs.readFileSync(logPath, 'utf8');
    const lines = content.split('\n').filter(l => l.trim().length > 0);
    
    // Convert lines to log objects
    const logs = lines.slice(-50).map((line, index) => {
      // Format: [2026-04-17T09:53:36.013Z] [INFO] Message
      const match = line.match(/^\[(.*?)\] \[(.*?)\] (.*)$/);
      if (match) {
        return {
          id: `log-${index}-${Date.now()}`,
          timestamp: new Date(match[1]).toLocaleTimeString(),
          type: match[2].toLowerCase() === 'success' ? 'success' : 
                match[2].toLowerCase() === 'error' ? 'error' :
                match[2].toLowerCase() === 'warning' ? 'warning' :
                match[3].includes('Activo Digital') || match[3].includes('Stitch') ? 'ai' : 'info',
          message: match[3]
        };
      }
      return { id: `raw-${index}`, timestamp: '--:--:--', type: 'info', message: line };
    });

    return NextResponse.json(logs);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to read logs' }, { status: 500 });
  }
}
