import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('connect.sid');
  const { pathname } = request.nextUrl;

  // Define public routes (accessible without authentication)
  const publicRoutes = [
    '/gm-login',
    '/gm-signup',
    '/join',
  ];

  // Define protected routes
  const protectedRoutes = [
    '/sessions',
    '/session',  // Protect /session/:id routes (select-character, etc.)
    '/character',
    '/gm/',  // Slash final pour éviter de protéger /gm-login
    '/character-creation',
    '/character-edit',
  ];

  // Check if current path is a public route
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Check if the current path starts with any protected route
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  // If protected route, not public, and no session cookie, redirect to login
  if (isProtectedRoute && !isPublicRoute && !sessionCookie) {
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
