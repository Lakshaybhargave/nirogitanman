'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Heart, LayoutDashboard, Calendar, Users, FileText,
  DollarSign, BarChart3, Settings, LogOut, ShieldCheck,
} from 'lucide-react'
import { cn } from '@nirogitanman/ui'
import { getSupabaseBrowserClient } from '@nirogitanman/supabase'
import { useRouter } from 'next/navigation'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/appointments', label: 'Appointments', icon: Calendar },
  { href: '/patients', label: 'Patients', icon: Users },
  { href: '/records', label: 'Prescriptions', icon: FileText },
  { href: '/earnings', label: 'Earnings', icon: DollarSign },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/verification', label: 'Verification', icon: ShieldCheck },
]

interface PartnerSidebarProps {
  user: { full_name: string; email: string }
  partner: { business_name: string; verification_status: string; partner_types?: { name: string } } | null
}

export function PartnerSidebar({ user, partner }: PartnerSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r bg-card min-h-screen sticky top-0">
      <div className="flex h-16 items-center gap-2 px-6 border-b font-bold text-lg text-primary">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shrink-0">
          <Heart className="h-5 w-5" />
        </div>
        Partner Portal
      </div>

      {/* Verification badge */}
      {partner && (
        <div className="mx-3 mt-3 rounded-lg border p-3">
          <div className="font-medium text-sm truncate">{partner.business_name}</div>
          <div className="text-xs text-muted-foreground">{partner.partner_types?.name}</div>
          <div className={`mt-1.5 inline-flex text-xs font-medium px-2 py-0.5 rounded-full ${
            partner.verification_status === 'verified'
              ? 'bg-emerald-100 text-emerald-700'
              : partner.verification_status === 'pending'
              ? 'bg-amber-100 text-amber-700'
              : 'bg-red-100 text-red-700'
          }`}>
            {partner.verification_status === 'verified' ? '✓ Verified' : partner.verification_status}
          </div>
        </div>
      )}

      <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Partner navigation">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm shrink-0">
            {user.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
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
