import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Authentication Proxy
 * Protects dashboard routes by checking for auth token
 * Redirects unauthorized users to login page
 */
export function proxy(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const { pathname } = request.nextUrl;

  // If no token and trying to access protected route, redirect to login
  if (!token) {
    // Build redirect URL with return path
    const loginUrl = new URL('/gm-login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Token exists, allow access
  return NextResponse.next();
}

/**
 * Proxy configuration
 * Applies to all protected routes under /dashboard, /characters, and /sessions
 */
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/characters/:path*',
    '/sessions/:path*',
    '/gm/:path*',
    '/gameboard/:path*',
  ],
};
