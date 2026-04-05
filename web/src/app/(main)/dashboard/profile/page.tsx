'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  ChevronLeft, 
  User, 
  Mail, 
  Phone, 
  Save, 
  Loader2, 
  Check,
  LogOut,
  Camera
} from 'lucide-react'

interface UserProfile {
  id: string
  email: string
  name: string
  phone: string | null
  avatar_url: string | null
  role: string
  created_at: string
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const supabase = createClient()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  // Load profile
  useEffect(() => {
    async function loadProfile() {
      if (!user) return

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error loading profile:', error)
        setError('Gagal memuat profil')
      } else if (data) {
        setProfile(data)
        setName(data.name || '')
        setPhone(data.phone || '')
      }
      setLoading(false)
    }

    if (!authLoading) {
      if (!user) {
        router.push('/login')
      } else {
        loadProfile()
      }
    }
  }, [user, authLoading, router, supabase])

  const handleSave = async () => {
    if (!user) return

    setSaving(true)
    setError(null)
    setSuccess(false)

    const { error } = await supabase
      .from('users')
      .update({
        name,
        phone: phone || null,
      })
      .eq('id', user.id)

    if (error) {
      setError('Gagal menyimpan perubahan')
      console.error('Error updating profile:', error)
    } else {
      setSuccess(true)
      setProfile(prev => prev ? { ...prev, name, phone } : null)
      setTimeout(() => setSuccess(false), 3000)
    }

    setSaving(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Memuat profil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full pb-24">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="flex items-center px-4 py-3">
          <Link href="/dashboard" className="mr-3">
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Profil Saya</h1>
            <p className="text-xs text-gray-500">Kelola informasi akun Anda</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Avatar Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center">
                  {profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt={profile.name}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-12 w-12 text-emerald-600" />
                  )}
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-emerald-600 rounded-full text-white shadow-lg active:scale-95 transition-transform">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <h2 className="mt-3 text-lg font-semibold text-gray-900">{profile?.name}</h2>
              <p className="text-sm text-gray-500">{profile?.email}</p>
              <span className="mt-2 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full capitalize">
                {profile?.role || 'User'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Form */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Informasi Pribadi</CardTitle>
            <CardDescription className="text-xs">
              Update informasi profil Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 rounded-lg bg-emerald-50 text-emerald-700 text-sm flex items-center gap-2">
                <Check className="h-4 w-4" />
                Profil berhasil disimpan!
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm">Nama Lengkap</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  placeholder="Nama lengkap Anda"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  value={profile?.email || ''}
                  className="pl-10 bg-gray-50"
                  disabled
                />
              </div>
              <p className="text-xs text-gray-500">Email tidak dapat diubah</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm">Nomor Telepon</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10"
                  placeholder="08xxxxxxxxxx"
                  type="tel"
                />
              </div>
            </div>

            <Button 
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98]"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Simpan Perubahan
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Informasi Akun</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Member sejak</span>
              <span className="text-sm font-medium text-gray-900">
                {profile?.created_at 
                  ? new Date(profile.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })
                  : '-'
                }
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Status akun</span>
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                Aktif
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="w-full text-red-600 border-red-200 hover:bg-red-50 active:scale-[0.98]"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Keluar dari Akun
        </Button>
      </div>
    </div>
  )
}
