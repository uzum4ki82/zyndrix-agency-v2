import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Define protected routes
  const isDashboardRoute = path.startsWith('/dashboard');
  
  // Check for auth cookie
  const authCookie = request.cookies.get('zyndrix_session');
  
  if (isDashboardRoute && !authCookie) {
    // Redirect to login if accessing dashboard without session
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
