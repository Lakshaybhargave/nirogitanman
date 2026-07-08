'use client'

import Link from 'next/link'
import { Bell, Sun, Moon, Menu } from 'lucide-react'
import { useState } from 'react'

interface HeaderProps {
  user: { full_name: string; avatar_url: string | null }
}

export function DashboardHeader({ user }: HeaderProps) {
  const [dark, setDark] = useState(false)

  const toggleTheme = () => {
    setDark((d) => !d)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card px-4 sm:px-6">
      {/* Mobile menu button */}
      <button className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-foreground" aria-label="Open menu">
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Notifications */}
        <Link
          href="/notifications"
          className="relative p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="View notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
        </Link>

        {/* Avatar */}
        <Link href="/profile" className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-muted transition-colors">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
            {user.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
          <span className="hidden sm:block text-sm font-medium max-w-[120px] truncate">{user.full_name}</span>
        </Link>
      </div>
    </header>
  )
}
