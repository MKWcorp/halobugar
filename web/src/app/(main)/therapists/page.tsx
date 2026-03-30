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
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Mobile Header */}
      <div className="bg-white border-b">
        <div className="px-4 py-3">
          <h1 className="text-lg font-bold text-gray-900">Fisioterapis</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Terverifikasi dan bersertifikat STR
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border-b">
        <div className="px-4 py-3">
          <form className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                name="search"
                placeholder="Cari fisioterapis..."
                className="pl-9 h-9 text-sm bg-gray-50"
                defaultValue={params.search}
              />
            </div>
            <Button 
              type="submit" 
              size="sm" 
              className="bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] h-9 px-4"
            >
              Cari
            </Button>
          </form>
        </div>
      </div>

      {/* Results Count */}
      <div className="px-4 py-2 bg-gray-50">
        <p className="text-xs text-gray-600">
          <span className="font-semibold text-gray-900">{filteredTherapists.length}</span> fisioterapis
        </p>
      </div>

      {/* Therapist List */}
      <div className="px-4 py-3">
        {filteredTherapists.length > 0 ? (
          <div className="space-y-3">
            {filteredTherapists.map((therapist) => (
              <TherapistCard key={therapist.id} therapist={therapist} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Tidak ada hasil</h3>
            <p className="text-xs text-gray-500 mb-3">
              {params.search 
                ? `Coba kata kunci lain`
                : 'Belum ada fisioterapis'}
            </p>
            {params.search && (
              <Link href="/therapists">
                <Button variant="outline" size="sm" className="h-8">Lihat Semua</Button>
              </Link>
            )}
          </div>
        )}
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
    <Card className="hover:shadow-md transition-shadow active:scale-[0.98]">
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {therapist.user?.avatar_url ? (
              <img
                src={therapist.user.avatar_url}
                alt={therapist.user.name}
                className="w-12 h-12 rounded-xl object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">{initials}</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 truncate">
              {therapist.user?.name}
            </h3>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex items-center">
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                <span className="ml-0.5 text-xs font-medium text-gray-900">
                  {therapist.rating_avg.toFixed(1)}
                </span>
              </div>
              <span className="text-gray-300">·</span>
              <span className="text-xs text-gray-500">
                {therapist.total_sessions} sesi
              </span>
            </div>

            {/* Specializations */}
            <div className="flex flex-wrap gap-1 mt-1.5">
              {therapist.specializations.slice(0, 2).map((spec, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-700"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="mt-3 space-y-1.5">
          <div className="flex items-center text-xs text-gray-500">
            <Award className="h-3 w-3 mr-1.5 text-gray-400" />
            {therapist.experience_years} tahun
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <MapPin className="h-3 w-3 mr-1.5 text-gray-400" />
            {therapist.service_areas.slice(0, 2).join(', ')}
            {therapist.service_areas.length > 2 && ` +${therapist.service_areas.length - 2}`}
          </div>
          <div className="flex items-center text-xs text-gray-900 font-medium">
            <Clock className="h-3 w-3 mr-1.5 text-gray-400" />
            {formatPrice(therapist.hourly_rate)}/sesi
          </div>
        </div>

        {/* Bio */}
        {therapist.bio && (
          <p className="mt-2 text-xs text-gray-600 line-clamp-2">
            {therapist.bio}
          </p>
        )}

        {/* Action */}
        <div className="mt-3 flex gap-2">
          <Link href={`/therapists/${therapist.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full h-8 text-xs active:scale-[0.98]">
              Profil
            </Button>
          </Link>
          <Link href={`/booking?therapist=${therapist.id}`} className="flex-1">
            <Button size="sm" className="w-full h-8 text-xs bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98]">
              Pesan
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
