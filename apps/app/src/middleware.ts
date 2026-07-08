import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@nirogitanman/supabase/middleware'

const PUBLIC_ROUTES = ['/login', '/signup']

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user, supabase } = await updateSession(request)
  const { pathname } = request.nextUrl

  const isPublic = PUBLIC_ROUTES.some((r) => pathname.startsWith(r))

  if (!user && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user && isPublic) {
    // Check role — partners and admins should not use this portal
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('auth_user_id', user.id)
      .single()

    if (profile?.role === 'partner') {
      return NextResponse.redirect(new URL('https://partner.nirogitanman.com/dashboard', request.url))
    }
    if (profile?.role === 'admin' || profile?.role === 'super_admin') {
      return NextResponse.redirect(new URL('https://admin.nirogitanman.com/dashboard', request.url))
    }
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
