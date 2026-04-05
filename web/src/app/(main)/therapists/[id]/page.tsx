import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  ChevronLeft, 
  Star,
  MapPin,
  Clock,
  Award,
  Calendar,
  CheckCircle,
  User
} from 'lucide-react'

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price)
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function TherapistDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch therapist with user data
  const { data: therapist, error } = await supabase
    .from('therapists')
    .select(`
      *,
      user:users(name, avatar_url, email, created_at)
    `)
    .eq('id', id)
    .eq('is_verified', true)
    .single()

  if (error || !therapist) {
    notFound()
  }

  // Fetch reviews for this therapist
  const { data: reviews } = await supabase
    .from('reviews')
    .select(`
      *,
      user:users(name, avatar_url),
      booking:bookings(
        service:services(name)
      )
    `)
    .eq('therapist_id', id)
    .order('created_at', { ascending: false })
    .limit(10)

  // Fetch services (for booking)
  const { data: services } = await supabase
    .from('services')
    .select('id, name, base_price, duration_minutes')
    .eq('is_active', true)
    .order('base_price')
    .limit(5)

  return (
    <div className="min-h-screen bg-gray-50 w-full pb-32">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="flex items-center px-4 py-3">
          <Link href="/therapists" className="mr-3">
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900">Detail Fisioterapis</h1>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Profile Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-2xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                {therapist.user?.avatar_url ? (
                  <img 
                    src={therapist.user.avatar_url} 
                    alt={therapist.user.name}
                    className="w-20 h-20 rounded-2xl object-cover"
                  />
                ) : (
                  <User className="h-10 w-10 text-emerald-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-gray-900">{therapist.user?.name}</h2>
                <p className="text-sm text-gray-500">Fisioterapis</p>
                
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    <span className="text-sm font-semibold">{therapist.rating_avg.toFixed(1)}</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <span className="text-sm text-gray-500">{therapist.total_sessions} sesi</span>
                </div>

                {therapist.is_verified && (
                  <div className="flex items-center gap-1 mt-2 text-emerald-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-xs font-medium">Terverifikasi</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-3 text-center">
              <Award className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-900">{therapist.experience_years}</p>
              <p className="text-xs text-gray-500">Tahun</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <Calendar className="h-5 w-5 text-blue-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-900">{therapist.total_sessions}</p>
              <p className="text-xs text-gray-500">Sesi</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <Star className="h-5 w-5 text-amber-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-900">{therapist.rating_avg.toFixed(1)}</p>
              <p className="text-xs text-gray-500">Rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Bio */}
        {therapist.bio && (
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Tentang</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{therapist.bio}</p>
            </CardContent>
          </Card>
        )}

        {/* Specializations */}
        {therapist.specializations?.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Spesialisasi</h3>
              <div className="flex flex-wrap gap-2">
                {therapist.specializations.map((spec: string, index: number) => (
                  <span 
                    key={index}
                    className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Service Areas */}
        {therapist.service_areas?.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Area Layanan</h3>
              <div className="flex flex-wrap gap-2">
                {therapist.service_areas.map((area: string, index: number) => (
                  <div 
                    key={index}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    <MapPin className="h-3 w-3" />
                    {area}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Price */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">Tarif per jam</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {formatPrice(therapist.hourly_rate)}
                </p>
              </div>
              <div className="flex items-center gap-1 text-gray-500">
                <Clock className="h-4 w-4" />
                <span className="text-sm">/jam</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">
              Ulasan ({reviews?.length || 0})
            </h3>
          </div>
          
          {reviews && reviews.length > 0 ? (
            <div className="space-y-3">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        {review.user?.avatar_url ? (
                          <img 
                            src={review.user.avatar_url} 
                            alt={review.user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-900">{review.user?.name}</p>
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-3 w-3 ${i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">
                          {review.booking?.service?.name} • {formatDate(review.created_at)}
                        </p>
                        {review.comment && (
                          <p className="text-sm text-gray-600">{review.comment}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <Star className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Belum ada ulasan</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 safe-area-bottom">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <div className="flex-1">
            <p className="text-xs text-gray-500">Tarif</p>
            <p className="text-lg font-bold text-gray-900">{formatPrice(therapist.hourly_rate)}/jam</p>
          </div>
          <Link href={`/booking?therapist=${therapist.id}`} className="flex-1">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] h-12 text-base font-semibold">
              Booking Sekarang
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
