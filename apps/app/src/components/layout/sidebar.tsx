'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Heart, LayoutDashboard, Calendar, FileText, ShoppingBag,
  Bell, User, Search, LogOut, X, ChevronRight,
} from 'lucide-react'
import { cn } from '@nirogitanman/ui'
import { getSupabaseBrowserClient } from '@nirogitanman/supabase'
import { useRouter } from 'next/navigation'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/find-providers', label: 'Find Providers', icon: Search },
  { href: '/appointments', label: 'Appointments', icon: Calendar },
  { href: '/records', label: 'Medical Records', icon: FileText },
  { href: '/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/profile', label: 'Profile', icon: User },
]

interface SidebarProps {
  user: { full_name: string; avatar_url: string | null; email: string }
}

export function DashboardSidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const initials = user.full_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r bg-card min-h-screen sticky top-0">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-6 border-b font-bold text-lg text-primary">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shrink-0">
          <Heart className="h-5 w-5" />
        </div>
        NirogiTanman
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Client navigation">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User footer */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="font-medium text-sm truncate">{user.full_name}</div>
            <div className="text-xs text-muted-foreground truncate">{user.email}</div>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
