import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  ChevronLeft, 
  Calendar, 
  Clock, 
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react'

const statusConfig: Record<string, { 
  label: string
  color: string
  bgColor: string
  icon: React.ReactNode 
}> = {
  pending: { 
    label: 'Menunggu', 
    color: 'text-amber-600', 
    bgColor: 'bg-amber-50',
    icon: <AlertCircle className="h-4 w-4" />
  },
  accepted: { 
    label: 'Diterima', 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-50',
    icon: <CheckCircle className="h-4 w-4" />
  },
  on_the_way: { 
    label: 'Dalam Perjalanan', 
    color: 'text-indigo-600', 
    bgColor: 'bg-indigo-50',
    icon: <MapPin className="h-4 w-4" />
  },
  arrived: { 
    label: 'Tiba di Lokasi', 
    color: 'text-purple-600', 
    bgColor: 'bg-purple-50',
    icon: <MapPin className="h-4 w-4" />
  },
  in_session: { 
    label: 'Sesi Berlangsung', 
    color: 'text-emerald-600', 
    bgColor: 'bg-emerald-50',
    icon: <Clock className="h-4 w-4" />
  },
  completed: { 
    label: 'Selesai', 
    color: 'text-green-600', 
    bgColor: 'bg-green-50',
    icon: <CheckCircle className="h-4 w-4" />
  },
  cancelled: { 
    label: 'Dibatalkan', 
    color: 'text-red-600', 
    bgColor: 'bg-red-50',
    icon: <XCircle className="h-4 w-4" />
  },
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price)
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default async function BookingsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select(`
      *,
      service:services(name, duration_minutes),
      therapist:therapists(
        user:users(name)
      ),
      address:addresses(label, full_address)
    `)
    .eq('user_id', user.id)
    .order('scheduled_at', { ascending: false })

  if (error) {
    console.error('Error fetching bookings:', error)
  }

  const activeBookings = bookings?.filter(b => 
    !['cancelled', 'completed'].includes(b.status)
  ) || []

  const pastBookings = bookings?.filter(b => 
    ['cancelled', 'completed'].includes(b.status)
  ) || []

  return (
    <div className="min-h-screen bg-gray-50 w-full pb-24">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="flex items-center px-4 py-3">
          <Link href="/dashboard" className="mr-3">
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Riwayat Booking</h1>
            <p className="text-xs text-gray-500">{bookings?.length || 0} total booking</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-6">
        {/* Active Bookings */}
        {activeBookings.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Booking Aktif</h2>
            <div className="space-y-3">
              {activeBookings.map((booking) => {
                const status = statusConfig[booking.status] || statusConfig.pending
                return (
                  <Card key={booking.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {booking.service?.name || 'Layanan'}
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {booking.therapist?.user?.name || 'Therapist'}
                            </p>
                          </div>
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${status.bgColor} ${status.color}`}>
                            {status.icon}
                            <span className="text-xs font-medium">{status.label}</span>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span>{formatDate(booking.scheduled_at)}</span>
                            <Clock className="h-4 w-4 text-gray-400 ml-2" />
                            <span>{formatTime(booking.scheduled_at)}</span>
                          </div>
                          <div className="flex items-start gap-2 text-gray-600">
                            <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-1">
                              {booking.address?.full_address || 'Alamat tidak tersedia'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                          <span className="font-semibold text-emerald-600">
                            {formatPrice(booking.total_price)}
                          </span>
                          <Button size="sm" variant="outline" className="h-8 text-xs">
                            Lihat Detail
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </section>
        )}

        {/* Past Bookings */}
        <section>
          <h2 className="text-sm font-semibold text-gray-900 mb-3">
            Riwayat {pastBookings.length > 0 ? `(${pastBookings.length})` : ''}
          </h2>
          
          {pastBookings.length > 0 ? (
            <div className="space-y-3">
              {pastBookings.map((booking) => {
                const status = statusConfig[booking.status] || statusConfig.pending
                return (
                  <Card key={booking.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-medium text-gray-900 text-sm">
                            {booking.service?.name || 'Layanan'}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {booking.therapist?.user?.name || 'Therapist'}
                          </p>
                        </div>
                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${status.bgColor} ${status.color}`}>
                          {status.icon}
                          <span className="text-xs font-medium">{status.label}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(booking.scheduled_at)}
                        </span>
                        <span className="font-medium text-gray-900">
                          {formatPrice(booking.total_price)}
                        </span>
                      </div>

                      {booking.status === 'completed' && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <Button size="sm" variant="outline" className="h-7 text-xs w-full">
                            Pesan Lagi
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">Belum ada riwayat booking</p>
                <Link href="/services">
                  <Button size="sm" className="mt-4 bg-emerald-600 hover:bg-emerald-700">
                    Buat Booking Pertama
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </div>
  )
}
