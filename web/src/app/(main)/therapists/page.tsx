import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Star, MapPin, Clock, Award, Search } from 'lucide-react'

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price)
}

export default async function TherapistsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; area?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  
  const { data: therapists, error } = await supabase
    .from('therapists')
    .select(`
      *,
      user:users(name, avatar_url)
    `)
    .eq('is_verified', true)
    .eq('is_available', true)
    .order('rating_avg', { ascending: false })

  if (error) {
    console.error('Error fetching therapists:', error)
  }

  // Filter by search if provided
  let filteredTherapists = therapists || []
  if (params.search) {
    const searchLower = params.search.toLowerCase()
    filteredTherapists = filteredTherapists.filter(t => 
      t.user?.name?.toLowerCase().includes(searchLower) ||
      t.specializations?.some((s: string) => s.toLowerCase().includes(searchLower)) ||
      t.service_areas?.some((a: string) => a.toLowerCase().includes(searchLower))
    )
  }
  if (params.area) {
    filteredTherapists = filteredTherapists.filter(t => 
      t.service_areas?.some((a: string) => a.toLowerCase().includes(params.area!.toLowerCase()))
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Fisioterapis Profesional</h1>
          <p className="text-lg text-emerald-100 max-w-2xl mb-8">
            Semua fisioterapis kami telah terverifikasi dan memiliki Surat Tanda Registrasi (STR) resmi.
          </p>
          
          {/* Search */}
          <form className="flex gap-2 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                name="search"
                placeholder="Cari nama, spesialisasi, atau area..."
                className="pl-10 bg-white text-gray-900"
                defaultValue={params.search}
              />
            </div>
            <Button type="submit" variant="secondary" className="bg-white text-emerald-600 hover:bg-gray-100">
              Cari
            </Button>
          </form>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              <span className="font-semibold text-gray-900">{filteredTherapists.length}</span> fisioterapis ditemukan
            </p>
          </div>
        </div>
      </div>

      {/* Therapist Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredTherapists.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTherapists.map((therapist) => (
              <TherapistCard key={therapist.id} therapist={therapist} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak ada fisioterapis ditemukan</h3>
            <p className="text-gray-500 mb-4">
              {params.search 
                ? `Coba cari dengan kata kunci lain`
                : 'Belum ada fisioterapis yang terdaftar'}
            </p>
            {params.search && (
              <Link href="/therapists">
                <Button variant="outline">Lihat Semua</Button>
              </Link>
            )}
          </div>
        )}
      </div>

      {/* CTA for therapists */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold mb-2">Anda Fisioterapis?</h2>
              <p className="text-gray-400">
                Bergabung dengan Halo Bugar dan raih lebih banyak klien.
              </p>
            </div>
            <Link href="/therapist/register">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                Daftar Sebagai Mitra
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function TherapistCard({ therapist }: { therapist: {
  id: string
  user: { name: string; avatar_url?: string } | null
  specializations: string[]
  experience_years: number
  hourly_rate: number
  service_areas: string[]
  rating_avg: number
  total_sessions: number
  bio?: string
}}) {
  const initials = therapist.user?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'FT'

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {therapist.user?.avatar_url ? (
              <img
                src={therapist.user.avatar_url}
                alt={therapist.user.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">{initials}</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {therapist.user?.name}
            </h3>
            
            {/* Rating */}
            <div className="flex items-center space-x-2 mt-1">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="ml-1 text-sm font-medium text-gray-900">
                  {therapist.rating_avg.toFixed(1)}
                </span>
              </div>
              <span className="text-gray-300">|</span>
              <span className="text-sm text-gray-500">
                {therapist.total_sessions} sesi
              </span>
            </div>

            {/* Specializations */}
            <div className="flex flex-wrap gap-1 mt-2">
              {therapist.specializations.slice(0, 3).map((spec, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-700"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <Award className="h-4 w-4 mr-2 text-gray-400" />
            {therapist.experience_years} tahun pengalaman
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
            {therapist.service_areas.slice(0, 2).join(', ')}
            {therapist.service_areas.length > 2 && ` +${therapist.service_areas.length - 2}`}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-2 text-gray-400" />
            Mulai {formatPrice(therapist.hourly_rate)}/sesi
          </div>
        </div>

        {/* Bio */}
        {therapist.bio && (
          <p className="mt-3 text-sm text-gray-600 line-clamp-2">
            {therapist.bio}
          </p>
        )}

        {/* Action */}
        <div className="mt-4 flex space-x-2">
          <Link href={`/therapists/${therapist.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              Lihat Profil
            </Button>
          </Link>
          <Link href={`/booking?therapist=${therapist.id}`} className="flex-1">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
              Pesan
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
