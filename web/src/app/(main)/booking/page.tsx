'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  ChevronLeft, 
  ChevronRight,
  Check,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { Service, Therapist } from '@/types'

type Step = 'service' | 'therapist' | 'datetime' | 'address' | 'confirm'

const steps: { id: Step; title: string }[] = [
  { id: 'service', title: 'Pilih Layanan' },
  { id: 'therapist', title: 'Pilih Fisioterapis' },
  { id: 'datetime', title: 'Pilih Waktu' },
  { id: 'address', title: 'Alamat' },
  { id: 'confirm', title: 'Konfirmasi' },
]

export default function BookingPage() {
  return (
    <Suspense fallback={<BookingLoading />}>
      <BookingContent />
    </Suspense>
  )
}

function BookingLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
    </div>
  )
}

function BookingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading: authLoading } = useAuth()
  const supabase = createClient()

  const [currentStep, setCurrentStep] = useState<Step>('service')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Booking data
  const [services, setServices] = useState<Service[]>([])
  const [therapists, setTherapists] = useState<(Therapist & { user: { name: string } })[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist & { user: { name: string } } | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [address, setAddress] = useState({
    label: 'Rumah',
    full_address: '',
    notes: '',
  })
  const [complaintNotes, setComplaintNotes] = useState('')

  // Load services
  useEffect(() => {
    async function loadServices() {
      const { data } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('category')
      if (data) setServices(data)

      // Pre-select service from URL
      const serviceId = searchParams.get('service')
      if (serviceId && data) {
        const service = data.find(s => s.id === serviceId)
        if (service) {
          setSelectedService(service)
          setCurrentStep('therapist')
        }
      }
    }
    loadServices()
  }, [searchParams])

  // Load therapists when service selected
  useEffect(() => {
    async function loadTherapists() {
      const { data } = await supabase
        .from('therapists')
        .select('*, user:users(name)')
        .eq('is_verified', true)
        .eq('is_available', true)
        .order('rating_avg', { ascending: false })
      if (data) setTherapists(data)

      // Pre-select therapist from URL
      const therapistId = searchParams.get('therapist')
      if (therapistId && data) {
        const therapist = data.find(t => t.id === therapistId)
        if (therapist) {
          setSelectedTherapist(therapist)
          if (!selectedService) {
            setCurrentStep('service')
          } else {
            setCurrentStep('datetime')
          }
        }
      }
    }
    loadTherapists()
  }, [searchParams, selectedService])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user && currentStep === 'confirm') {
      router.push(`/login?redirect=/booking`)
    }
  }, [authLoading, user, currentStep, router])

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ]

  // Get next 14 days
  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i + 1) // Start from tomorrow
    return date.toISOString().split('T')[0]
  })

  const formatPrice = (price: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)

  const formatDate = (dateStr: string) => 
    new Date(dateStr).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })

  const canProceed = () => {
    switch (currentStep) {
      case 'service': return !!selectedService
      case 'therapist': return !!selectedTherapist
      case 'datetime': return !!selectedDate && !!selectedTime
      case 'address': return !!address.full_address
      case 'confirm': return !!user
      default: return false
    }
  }

  const nextStep = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id)
    }
  }

  const prevStep = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id)
    }
  }

  const handleSubmit = async () => {
    if (!user || !selectedService || !selectedTherapist || !selectedDate || !selectedTime) {
      setError('Data tidak lengkap')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Create address first
      const { data: addressData, error: addressError } = await supabase
        .from('addresses')
        .insert({
          user_id: user.id,
          label: address.label,
          full_address: address.full_address,
          notes: address.notes,
          is_default: true,
        })
        .select()
        .single()

      if (addressError) throw addressError

      // Create booking
      const scheduledAt = new Date(`${selectedDate}T${selectedTime}:00`)
      const { error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          therapist_id: selectedTherapist.id,
          service_id: selectedService.id,
          address_id: addressData.id,
          scheduled_at: scheduledAt.toISOString(),
          complaint_notes: complaintNotes,
          total_price: selectedService.base_price,
          status: 'pending',
        })

      if (bookingError) throw bookingError

      router.push('/dashboard?booking=success')
    } catch (err) {
      console.error('Booking error:', err)
      setError('Gagal membuat booking. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isActive = step.id === currentStep
              const isPast = steps.findIndex(s => s.id === currentStep) > index
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`
                    flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                    ${isActive ? 'bg-emerald-600 text-white' : ''}
                    ${isPast ? 'bg-emerald-100 text-emerald-600' : ''}
                    ${!isActive && !isPast ? 'bg-gray-200 text-gray-500' : ''}
                  `}>
                    {isPast ? <Check className="h-4 w-4" /> : index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`hidden sm:block w-16 h-1 mx-2 ${isPast ? 'bg-emerald-200' : 'bg-gray-200'}`} />
                  )}
                </div>
              )
            })}
          </div>
          <div className="mt-4 text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              {steps.find(s => s.id === currentStep)?.title}
            </h2>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-700 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {/* Step Content */}
        <Card>
          <CardContent className="p-6">
            {/* Step 1: Service */}
            {currentStep === 'service' && (
              <div className="space-y-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className={`
                      p-4 rounded-lg border-2 cursor-pointer transition-all
                      ${selectedService?.id === service.id 
                        ? 'border-emerald-500 bg-emerald-50' 
                        : 'border-gray-200 hover:border-gray-300'}
                    `}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{service.name}</h3>
                        <p className="text-sm text-gray-500">{service.description}</p>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {service.duration_minutes} menit
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-600">{formatPrice(service.base_price)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 2: Therapist */}
            {currentStep === 'therapist' && (
              <div className="space-y-4">
                {therapists.map((therapist) => (
                  <div
                    key={therapist.id}
                    onClick={() => setSelectedTherapist(therapist)}
                    className={`
                      p-4 rounded-lg border-2 cursor-pointer transition-all
                      ${selectedTherapist?.id === therapist.id 
                        ? 'border-emerald-500 bg-emerald-50' 
                        : 'border-gray-200 hover:border-gray-300'}
                    `}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                        <span className="text-white font-bold">
                          {therapist.user?.name?.charAt(0) || 'T'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{therapist.user?.name}</h3>
                        <p className="text-sm text-gray-500">
                          {therapist.experience_years} tahun pengalaman • ⭐ {therapist.rating_avg.toFixed(1)}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {therapist.specializations.slice(0, 2).map((spec, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 3: DateTime */}
            {currentStep === 'datetime' && (
              <div className="space-y-6">
                <div>
                  <Label className="mb-3 block">Pilih Tanggal</Label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {availableDates.map((date) => (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`
                          p-3 rounded-lg text-center border-2 transition-all
                          ${selectedDate === date 
                            ? 'border-emerald-500 bg-emerald-50' 
                            : 'border-gray-200 hover:border-gray-300'}
                        `}
                      >
                        <p className="text-xs text-gray-500">
                          {new Date(date).toLocaleDateString('id-ID', { weekday: 'short' })}
                        </p>
                        <p className="font-semibold">
                          {new Date(date).getDate()}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">Pilih Waktu</Label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`
                          p-3 rounded-lg text-center border-2 transition-all
                          ${selectedTime === time 
                            ? 'border-emerald-500 bg-emerald-50' 
                            : 'border-gray-200 hover:border-gray-300'}
                        `}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Address */}
            {currentStep === 'address' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="address">Alamat Lengkap *</Label>
                  <textarea
                    id="address"
                    rows={3}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Jl. Contoh No. 123, RT/RW, Kelurahan, Kecamatan, Kota"
                    value={address.full_address}
                    onChange={(e) => setAddress({ ...address, full_address: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Catatan Lokasi</Label>
                  <Input
                    id="notes"
                    placeholder="Lantai 3, Unit 301, warna pintu hitam"
                    value={address.notes}
                    onChange={(e) => setAddress({ ...address, notes: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="complaint">Keluhan (opsional)</Label>
                  <textarea
                    id="complaint"
                    rows={3}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Jelaskan keluhan atau kondisi Anda..."
                    value={complaintNotes}
                    onChange={(e) => setComplaintNotes(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 5: Confirm */}
            {currentStep === 'confirm' && (
              <div className="space-y-6">
                {!user && !authLoading && (
                  <div className="p-4 rounded-lg bg-yellow-50 text-yellow-800">
                    <p className="font-medium">Anda perlu login untuk melanjutkan</p>
                    <Link href={`/login?redirect=/booking`}>
                      <Button className="mt-2" size="sm">Login Sekarang</Button>
                    </Link>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">{selectedService?.name}</p>
                      <p className="text-sm text-gray-500">{selectedService?.duration_minutes} menit</p>
                    </div>
                    <p className="ml-auto font-bold text-emerald-600">
                      {selectedService && formatPrice(selectedService.base_price)}
                    </p>
                  </div>

                  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <User className="h-5 w-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">{selectedTherapist?.user?.name}</p>
                      <p className="text-sm text-gray-500">Fisioterapis</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Clock className="h-5 w-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {selectedDate && formatDate(selectedDate)}
                      </p>
                      <p className="text-sm text-gray-500">Pukul {selectedTime} WIB</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">{address.label}</p>
                      <p className="text-sm text-gray-500">{address.full_address}</p>
                      {address.notes && <p className="text-sm text-gray-400">{address.notes}</p>}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-medium">Total</span>
                    <span className="font-bold text-emerald-600">
                      {selectedService && formatPrice(selectedService.base_price)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="mt-6 flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 'service'}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Kembali
          </Button>

          {currentStep === 'confirm' ? (
            <Button
              onClick={handleSubmit}
              disabled={loading || !user}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                'Konfirmasi Booking'
              )}
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Lanjut
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
