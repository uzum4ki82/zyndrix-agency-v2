import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Rutas internas que no tienen autenticación real en servidor (el dashboard solo comprueba localStorage
 * y estas API no piden credenciales). Quedan bloqueadas salvo que se active ENABLE_INTERNAL_DASHBOARD=true
 * en un entorno controlado. Pendiente: proteger con autenticación de servidor antes de reactivarlas.
 */
const BLOCKED_PREFIXES = ['/dashboard', '/api/auth', '/api/lead/leads', '/api/webhook/dashboard-sync', '/api/audit-form'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (process.env.ENABLE_INTERNAL_DASHBOARD !== 'true' && BLOCKED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return new NextResponse('Not found', { status: 404, headers: { 'X-Robots-Tag': 'noindex' } });
  }

  const requestHeaders = new Headers(request.headers);
  // Se mantiene por compatibilidad con componentes antiguos que leen el idioma; la web pública es solo en español.
  requestHeaders.set('x-zyndrix-lang', 'es');

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|img/|videos/|.*\\.(?:png|jpg|jpeg|webp|svg|ico|pdf|mp4)$).*)'],
};
