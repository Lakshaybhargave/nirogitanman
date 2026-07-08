'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Shield, LayoutDashboard, Users, ShieldCheck, BarChart3,
  DollarSign, Tag, Settings, FileText, Headphones, ClipboardList, LogOut,
} from 'lucide-react'
import { cn } from '@nirogitanman/ui'
import { getSupabaseBrowserClient } from '@nirogitanman/supabase'
import { useRouter } from 'next/navigation'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/users', label: 'User Management', icon: Users },
  { href: '/partners', label: 'Partner Verification', icon: ShieldCheck },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/payments', label: 'Payments', icon: DollarSign },
  { href: '/categories', label: 'Categories & Services', icon: Tag },
  { href: '/cms', label: 'CMS / Blog', icon: FileText },
  { href: '/support', label: 'Support', icon: Headphones },
  { href: '/audit-logs', label: 'Audit Logs', icon: ClipboardList },
  { href: '/settings', label: 'System Settings', icon: Settings },
]

interface AdminSidebarProps {
  user: { full_name: string; email: string; role: string }
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r bg-gray-900 text-gray-100 min-h-screen sticky top-0">
      <div className="flex h-16 items-center gap-2 px-6 border-b border-gray-800 font-bold text-lg">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shrink-0">
          <Shield className="h-5 w-5" />
        </div>
        Admin Panel
      </div>

      <div className="mx-3 mt-3 rounded-lg bg-gray-800 px-3 py-2">
        <div className="text-xs text-gray-400 uppercase tracking-wider font-medium">
          {user.role === 'super_admin' ? '⚡ Super Admin' : '🔑 Admin'}
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5" aria-label="Admin navigation">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-gray-800 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white font-semibold text-sm shrink-0">
            {user.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
          <div className="min-w-0">
            <div className="font-medium text-sm truncate text-white">{user.full_name}</div>
            <div className="text-xs text-gray-400 truncate">{user.email}</div>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
