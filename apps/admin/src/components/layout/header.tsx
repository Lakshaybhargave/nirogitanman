'use client'

import { Bell, Menu } from 'lucide-react'
import Link from 'next/link'

export function AdminHeader({ user }: { user: { full_name: string } }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card px-4 sm:px-6">
      <button className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-foreground" aria-label="Open menu">
        <Menu className="h-5 w-5" />
      </button>
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <Link href="/notifications" className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Link>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold text-xs">
          {user.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
        </div>
      </div>
    </header>
  )
}
