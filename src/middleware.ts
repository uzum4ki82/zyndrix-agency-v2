import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

let locales = ['en', 'es'];
let defaultLocale = 'en';

function getLocale(request: NextRequest) {
  const acceptLanguage = request.headers.get('accept-language');
  // Lógica: Si el usuario tiene 'es' en sus headers, entregamos 'es'. 
  // Cualquier otro escenario (Inglés o países no hispanos), forzamos 'en'.
  if (acceptLanguage && acceptLanguage.toLowerCase().includes('es')) return 'es';
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Ignorar archivos estáticos, favicon y APIs
  if (
    pathname.includes('.') || 
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/videos') ||
    pathname.startsWith('/img')
  ) {
    return;
  }

  // 2. Obtener el locale detectado
  const locale = getLocale(request);

  // 3. Inyectar el locale en los headers para que los Server Components lo lean
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-zyndrix-lang', locale);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // 4. SECURITY HEADERS - CLASE EJECUTIVA
  // Protección contra Clickjacking, XSS y Sniffing de contenido.
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Nota: CSP se omite aquí por ser muy restrictiva para Vercel Analytics/Scripts externos, 
  // pero se recomienda configurar una básica si se añaden más scripts externos.

  return response;
}


export const config = {
  matcher: [
    // Ignorar todos los paths internos de Next.js
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
