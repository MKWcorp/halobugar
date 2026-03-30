'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, LayoutGrid, CalendarDays, User } from 'lucide-react'

export function Footer() {
  const pathname = usePathname()

  const tabs = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Layanan', href: '/services', icon: LayoutGrid },
    { name: 'Jadwal', href: '/dashboard', icon: CalendarDays },
    { name: 'Profil', href: '/profile', icon: User },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t pb-safe w-full max-w-md mx-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-16 px-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || (pathname !== '/' && tab.href !== '/' && pathname.startsWith(tab.href))
          const Icon = tab.icon
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'fill-emerald-50/50' : ''}`} />
              <span className="text-[10px] font-medium">{tab.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
