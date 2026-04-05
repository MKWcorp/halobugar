'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft,
  Star,
  Send,
  CheckCircle
} from 'lucide-react'

interface BookingInfo {
  id: string
  service: { name: string }
  therapist: { 
    id: string
    user: { name: string } 
  }
}

export default function ReviewPage() {
  const router = useRouter()
  const params = useParams()
  const bookingId = params.id as string
  
  const [booking, setBooking] = useState<BookingInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchBooking() {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // Check if booking exists and is completed
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          status,
          service:services(name),
          therapist:therapists(
            id,
            user:users(name)
          )
        `)
        .eq('id', bookingId)
        .eq('user_id', user.id)
        .single()

      if (error || !data || data.status !== 'completed') {
        router.push('/dashboard/bookings')
        return
      }

      // Check if already reviewed
      const { data: existingReview } = await supabase
        .from('reviews')
        .select('id')
        .eq('booking_id', bookingId)
        .single()

      if (existingReview) {
        router.push(`/dashboard/bookings/${bookingId}`)
        return
      }

      setBooking(data as unknown as BookingInfo)
      setLoading(false)
    }

    fetchBooking()
  }, [bookingId, router])

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Silakan pilih rating')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !booking) throw new Error('Unauthorized')

      const { error: reviewError } = await supabase
        .from('reviews')
        .insert({
          booking_id: bookingId,
          user_id: user.id,
          therapist_id: booking.therapist.id,
          rating,
          comment: comment.trim() || null
        })

      if (reviewError) throw reviewError

      setSubmitted(true)
    } catch (err) {
      console.error('Review error:', err)
      setError('Gagal mengirim ulasan. Silakan coba lagi.')
    } finally {
      setSubmitting(false)
    }
  }

  const ratingLabels = [
    '',
    'Sangat Buruk',
    'Buruk', 
    'Cukup',
    'Baik',
    'Sangat Baik'
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
            <CheckCircle className="h-10 w-10 text-emerald-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Terima Kasih!
          </h1>
          <p className="text-gray-500 mb-6">
            Ulasan Anda telah terkirim
          </p>
          <Link href={`/dashboard/bookings/${bookingId}`}>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              Lihat Detail Pesanan
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center gap-3">
          <Link href={`/dashboard/bookings/${bookingId}`}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-lg font-bold text-gray-900">Beri Ulasan</h1>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Booking Info */}
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full mx-auto mb-3 flex items-center justify-center">
              <span className="text-2xl font-bold text-emerald-600">
                {booking?.therapist.user.name.charAt(0)}
              </span>
            </div>
            <h2 className="font-semibold text-gray-900">
              {booking?.therapist.user.name}
            </h2>
            <p className="text-sm text-gray-500">
              {booking?.service.name}
            </p>
          </CardContent>
        </Card>

        {/* Rating */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 text-center mb-4">
              Bagaimana pengalaman Anda?
            </h3>
            
            <div className="flex justify-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-10 w-10 ${
                      star <= (hoverRating || rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            
            <p className="text-center text-sm text-gray-500 h-5">
              {ratingLabels[hoverRating || rating]}
            </p>
          </CardContent>
        </Card>

        {/* Comment */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">
              Ceritakan pengalaman Anda (opsional)
            </h3>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tulis ulasan Anda di sini..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              maxLength={500}
            />
            <p className="text-xs text-gray-400 text-right mt-1">
              {comment.length}/500
            </p>
          </CardContent>
        </Card>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-600 text-center">{error}</p>
        )}

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={submitting || rating === 0}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
        >
          {submitting ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Kirim Ulasan
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
