import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft,
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  FileText,
  Phone,
  MessageSquare,
  Star,
  XCircle,
  CheckCircle2,
  AlertCircle,
  Truck
} from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

const statusConfig: Record<string, { label: string, color: string, bgColor: string, icon: React.ComponentType<{ className?: string }> }> = {
  pending: {
    label: 'Menunggu Konfirmasi',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50 border-amber-200',
    icon: Clock
  },
  accepted: {
    label: 'Dikonfirmasi',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50 border-blue-200',
    icon: CheckCircle2
  },
  on_the_way: {
    label: 'Terapis Dalam Perjalanan',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50 border-purple-200',
    icon: Truck
  },
  in_progress: {
    label: 'Sedang Berlangsung',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50 border-emerald-200',
    icon: AlertCircle
  },
  completed: {
    label: 'Selesai',
    color: 'text-gray-700',
    bgColor: 'bg-gray-50 border-gray-200',
    icon: CheckCircle2
  },
  cancelled: {
    label: 'Dibatalkan',
    color: 'text-red-700',
    bgColor: 'bg-red-50 border-red-200',
    icon: XCircle
  }
}

export default async function BookingDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data: booking, error } = await supabase
    .from('bookings')
    .select(`
      *,
      service:services(name, duration_minutes, description),
      therapist:therapists(
        id,
        user:users(name, phone)
      ),
      address:addresses(label, full_address, notes),
      review:reviews(rating, comment)
    `)
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !booking) {
    notFound()
  }

  const status = statusConfig[booking.status] || statusConfig.pending
  const StatusIcon = status.icon

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const canCancel = ['pending', 'accepted'].includes(booking.status)
  const canReview = booking.status === 'completed' && !booking.review
  const isActive = ['pending', 'accepted', 'on_the_way', 'in_progress'].includes(booking.status)

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center gap-3">
          <Link href="/dashboard/bookings">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Detail Pesanan</h1>
            <p className="text-xs text-gray-500">
              #{booking.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Status Card */}
        <Card className={`${status.bgColor} border`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${status.bgColor}`}>
                <StatusIcon className={`h-5 w-5 ${status.color}`} />
              </div>
              <div>
                <p className={`text-sm font-semibold ${status.color}`}>
                  {status.label}
                </p>
                <p className="text-xs text-gray-500">
                  {isActive && 'Pesanan aktif'}
                  {booking.status === 'completed' && 'Terima kasih telah menggunakan layanan kami'}
                  {booking.status === 'cancelled' && 'Pesanan telah dibatalkan'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service & Therapist */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h2 className="font-semibold text-gray-900">Layanan</h2>
            
            {/* Service */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-100 flex-shrink-0">
                <FileText className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {booking.service.name}
                </p>
                <p className="text-xs text-gray-500">
                  {booking.service.duration_minutes} menit
                </p>
                {booking.service.description && (
                  <p className="text-xs text-gray-400 mt-1">
                    {booking.service.description}
                  </p>
                )}
              </div>
              <p className="text-sm font-semibold text-emerald-600">
                {formatPrice(booking.total_price)}
              </p>
            </div>

            {/* Therapist */}
            <div className="flex items-start gap-3 pt-3 border-t">
              <div className="p-2 rounded-lg bg-blue-100 flex-shrink-0">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Terapis</p>
                <p className="text-sm font-medium text-gray-900">
                  {booking.therapist.user.name}
                </p>
              </div>
              {isActive && booking.therapist.user.phone && (
                <a href={`tel:${booking.therapist.user.phone}`}>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Phone className="h-3.5 w-3.5" />
                    Hubungi
                  </Button>
                </a>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Schedule & Location */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h2 className="font-semibold text-gray-900">Jadwal & Lokasi</h2>
            
            {/* Date & Time */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-orange-100 flex-shrink-0">
                <Calendar className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {formatDate(booking.scheduled_at)}
                </p>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  {formatTime(booking.scheduled_at)}
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3 pt-3 border-t">
              <div className="p-2 rounded-lg bg-purple-100 flex-shrink-0">
                <MapPin className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {booking.address.label}
                </p>
                <p className="text-xs text-gray-500">
                  {booking.address.full_address}
                </p>
                {booking.address.notes && (
                  <p className="text-xs text-gray-400">
                    {booking.address.notes}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Complaint Notes */}
        {booking.complaint_notes && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-gray-100 flex-shrink-0">
                  <MessageSquare className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Catatan Keluhan</p>
                  <p className="text-sm text-gray-700">
                    {booking.complaint_notes}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Review */}
        {booking.review && (
          <Card>
            <CardContent className="p-4">
              <h2 className="font-semibold text-gray-900 mb-3">Ulasan Anda</h2>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < booking.review.rating 
                        ? 'fill-amber-400 text-amber-400' 
                        : 'text-gray-200'
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-600 ml-1">
                  {booking.review.rating}/5
                </span>
              </div>
              {booking.review.comment && (
                <p className="text-sm text-gray-600">{booking.review.comment}</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Payment Info */}
        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold text-gray-900 mb-3">Pembayaran</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Harga Layanan</span>
                <span className="text-gray-900">{formatPrice(booking.total_price)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Biaya Admin</span>
                <span className="text-gray-900">Rp0</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-emerald-600">{formatPrice(booking.total_price)}</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                * Pembayaran dilakukan langsung ke terapis setelah sesi selesai
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          {canReview && (
            <Link href={`/dashboard/bookings/${booking.id}/review`}>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                <Star className="h-4 w-4 mr-2" />
                Beri Ulasan
              </Button>
            </Link>
          )}
          
          {canCancel && (
            <Link href={`/dashboard/bookings/${booking.id}/cancel`}>
              <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                <XCircle className="h-4 w-4 mr-2" />
                Batalkan Pesanan
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
