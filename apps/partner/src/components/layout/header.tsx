'use client'

import Link from 'next/link'
import { Bell, Menu } from 'lucide-react'

interface PartnerHeaderProps {
  user: { full_name: string }
  partner: { business_name: string } | null
}

export function PartnerHeader({ user, partner }: PartnerHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card px-4 sm:px-6">
      <button className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-foreground" aria-label="Open menu">
        <Menu className="h-5 w-5" />
      </button>
      <div className="hidden lg:block">
        <span className="text-sm text-muted-foreground">
          {partner?.business_name ?? user.full_name}
        </span>
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <Link href="/notifications" className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Link>
        <Link href="/settings" className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-muted transition-colors">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
            {user.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
        </Link>
      </div>
    </header>
  )
}
