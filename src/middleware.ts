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

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}


export const config = {
  matcher: [
    // Ignorar todos los paths internos de Next.js
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
