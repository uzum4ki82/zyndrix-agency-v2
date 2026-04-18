import fs from 'fs';
import path from 'path';

/**
 * ZYNDRIX SHARED LOGGER
 * --------------------
 * Escribe logs tanto en la consola como en daemon.log para que sean visibles
 * en el "Centro de Operaciones" del dashboard en tiempo real.
 */

export type LogLevel = 'info' | 'success' | 'warning' | 'error';

export function daemonLog(level: LogLevel, message: string, context: any = {}) {
    const timestamp = new Date().toISOString();
    const entry = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    // 1. Consola (para terminal de Next.js)
    if (level === 'error') {
        console.error(entry);
    } else if (level === 'warning') {
        console.warn(entry);
    } else {
        console.log(entry);
    }

    if (context && Object.keys(context).length > 0) {
        console.log(JSON.stringify(context, null, 2));
    }

    // 2. Archivo Local (para LiveOperationsFeed en el UI)
    try {
        const root = process.cwd();
        const logPath = path.resolve(root, 'daemon.log');
        fs.appendFileSync(logPath, entry + '\n');
    } catch (err) {
        // En algunos entornos serverless process.cwd() o fs.appendFileSync pueden fallar
        // Pero en local donde corre el daemon, esto funcionará perfecto.
    }
}
