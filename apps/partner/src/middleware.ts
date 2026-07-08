import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@nirogitanman/supabase/middleware'

const PUBLIC_ROUTES = ['/login', '/register']

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user, supabase } = await updateSession(request)
  const { pathname } = request.nextUrl
  const isPublic = PUBLIC_ROUTES.some((r) => pathname.startsWith(r))

  if (!user && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user && !isPublic) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('auth_user_id', user.id)
      .single()

    if (!profile || profile.role !== 'partner') {
      return NextResponse.redirect(new URL('https://app.nirogitanman.com/dashboard', request.url))
    }
  }

  if (user && isPublic) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
