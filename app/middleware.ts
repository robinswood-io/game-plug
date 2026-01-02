import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('connect.sid');
  const { pathname } = request.nextUrl;

  // Define protected routes
  const protectedRoutes = [
    '/sessions',
    '/character',
    '/gm',
    '/character-creation',
    '/character-edit',
  ];

  // Check if the current path starts with any protected route
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  // If protected route and no session cookie, redirect to login
  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL('/gm-login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
