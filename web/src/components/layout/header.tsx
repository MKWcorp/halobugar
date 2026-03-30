'use client'

import Link from 'next/link'
import { useAuth } from '@/components/providers/auth-provider'
import { User } from 'lucide-react'

export function Header() {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-50 bg-white border-b h-14 sm:h-16 flex-none shadow-sm">
      <div className="flex h-full items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">HB</span>
          </div>
          <span className="font-bold text-lg text-gray-900 tracking-tight">Halo Bugar</span>
        </Link>

        {/* User Avatar */}
        <Link href={user ? '/profile' : '/login'} className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors">
          <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <User className="h-5 w-5" />
          </div>
        </Link>
      </div>
    </header>
  )
}
