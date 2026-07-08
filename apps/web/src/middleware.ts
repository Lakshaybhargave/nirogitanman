import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@nirogitanman/supabase/middleware'

// Public routes that don't require auth
const PUBLIC_ROUTES = ['/', '/about', '/services', '/blog', '/contact', '/find-providers', '/pricing', '/faq']
const AUTH_ROUTES = ['/login', '/signup', '/forgot-password', '/reset-password']

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request)
  const { pathname } = request.nextUrl

  // If user is logged in and tries to access auth pages, redirect to their portal
  if (user && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL('https://app.nirogitanman.com/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
