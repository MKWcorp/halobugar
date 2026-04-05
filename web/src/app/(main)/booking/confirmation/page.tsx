'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  CheckCircle, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  FileText,
  Home,
  ArrowRight,
  Copy,
  Check
} from 'lucide-react'

interface BookingDetails {
  id: string
  scheduled_at: string
  status: string
  complaint_notes: string | null
  total_price: number
  service: {
    name: string
    duration_minutes: number
  }
  therapist: {
    user: {
      name: string
    }
  }
  address: {
    label: string
    full_address: string
  }
}

function BookingConfirmationContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('id')
  
  const [booking, setBooking] = useState<BookingDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!bookingId) {
      router.push('/dashboard')
      return
    }

    async function fetchBooking() {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          scheduled_at,
          status,
          complaint_notes,
          total_price,
          service:services(name, duration_minutes),
          therapist:therapists(
            user:users(name)
          ),
          address:addresses(label, full_address)
        `)
        .eq('id', bookingId)
        .eq('user_id', user.id)
        .single()

      if (error || !data) {
        router.push('/dashboard')
        return
      }

      setBooking(data as unknown as BookingDetails)
      setLoading(false)
    }

    fetchBooking()
  }, [bookingId, router])

  const copyBookingId = () => {
    if (booking) {
      navigator.clipboard.writeText(booking.id)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    )
  }

  if (!booking) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Header */}
      <div className="bg-gradient-to-b from-emerald-500 to-emerald-600 px-4 pt-8 pb-16 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-lg">
          <CheckCircle className="h-10 w-10 text-emerald-500" />
        </div>
        <h1 className="text-xl font-bold text-white mb-1">
          Booking Berhasil!
        </h1>
        <p className="text-emerald-100 text-sm">
          Terapis akan segera mengkonfirmasi pesanan Anda
        </p>
      </div>

      <div className="px-4 -mt-10">
        {/* Booking ID Card */}
        <Card className="mb-4 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">ID Booking</p>
                <p className="text-sm font-mono font-semibold text-gray-900">
                  {booking.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={copyBookingId}
                className="gap-1.5"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Tersalin
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Salin
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Booking Details Card */}
        <Card className="mb-4">
          <CardContent className="p-4 space-y-4">
            <h2 className="font-semibold text-gray-900">Detail Booking</h2>
            
            {/* Service */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-100 flex-shrink-0">
                <FileText className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Layanan</p>
                <p className="text-sm font-medium text-gray-900">
                  {booking.service.name}
                </p>
                <p className="text-xs text-gray-500">
                  {booking.service.duration_minutes} menit
                </p>
              </div>
              <p className="text-sm font-semibold text-emerald-600">
                {formatPrice(booking.total_price)}
              </p>
            </div>

            {/* Therapist */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-100 flex-shrink-0">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Terapis</p>
                <p className="text-sm font-medium text-gray-900">
                  {booking.therapist.user.name}
                </p>
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-orange-100 flex-shrink-0">
                <Calendar className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Jadwal</p>
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
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-purple-100 flex-shrink-0">
                <MapPin className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Alamat</p>
                <p className="text-sm font-medium text-gray-900">
                  {booking.address.label}
                </p>
                <p className="text-xs text-gray-500">
                  {booking.address.full_address}
                </p>
              </div>
            </div>

            {/* Complaint Notes */}
            {booking.complaint_notes && (
              <div className="pt-3 border-t">
                <p className="text-xs text-gray-500 mb-1">Catatan Keluhan</p>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                  {booking.complaint_notes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status Info */}
        <Card className="mb-4 bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-100 flex-shrink-0">
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-800">
                  Menunggu Konfirmasi
                </p>
                <p className="text-xs text-amber-700 mt-0.5">
                  Terapis akan mengkonfirmasi dalam 1x24 jam. 
                  Anda akan mendapat notifikasi setelah dikonfirmasi.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What's Next */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h2 className="font-semibold text-gray-900 mb-3">Langkah Selanjutnya</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 text-xs font-medium text-emerald-600">
                  1
                </div>
                <p className="text-sm text-gray-600">
                  Tunggu konfirmasi dari terapis
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-xs font-medium text-gray-500">
                  2
                </div>
                <p className="text-sm text-gray-500">
                  Terapis akan menghubungi untuk detail lokasi
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-xs font-medium text-gray-500">
                  3
                </div>
                <p className="text-sm text-gray-500">
                  Siapkan pembayaran saat terapis datang
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-3 pb-24">
          <Link href={`/dashboard/bookings/${booking.id}`}>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
              Lihat Detail Pesanan
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
          
          <Link href="/dashboard">
            <Button variant="outline" className="w-full">
              <Home className="h-4 w-4 mr-2" />
              Kembali ke Beranda
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    }>
      <BookingConfirmationContent />
    </Suspense>
  )
}
