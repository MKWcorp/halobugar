import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  ChevronLeft, 
  Clock, 
  CheckCircle,
  Activity,
  Bone,
  HeartPulse,
  Zap,
  Star,
  Users
} from 'lucide-react'
import { ServiceCategory } from '@/types'

const categoryInfo: Record<ServiceCategory, { 
  name: string
  icon: React.ReactNode
  color: string
  bgColor: string
}> = {
  home_recovery: {
    name: 'Home Recovery',
    icon: <HeartPulse className="h-6 w-6" />,
    color: 'text-rose-600',
    bgColor: 'bg-rose-100',
  },
  injury_support: {
    name: 'Cedera & Injury',
    icon: <Bone className="h-6 w-6" />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  pain_relief: {
    name: 'Nyeri Kronis',
    icon: <Activity className="h-6 w-6" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  performance_recovery: {
    name: 'Performance',
    icon: <Zap className="h-6 w-6" />,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
  },
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price)
}

// Benefits per category
const categoryBenefits: Record<ServiceCategory, string[]> = {
  home_recovery: [
    'Pemulihan fungsi tubuh pasca operasi',
    'Latihan mobilitas bertahap di rumah',
    'Monitoring progress recovery',
    'Panduan exercise mandiri',
  ],
  injury_support: [
    'Penanganan cedera olahraga profesional',
    'Teknik terapi manual & fisioterapi',
    'Program rehabilitasi personal',
    'Pencegahan cedera berulang',
  ],
  pain_relief: [
    'Diagnosa sumber nyeri akurat',
    'Terapi manual untuk mengurangi nyeri',
    'Koreksi postur tubuh',
    'Edukasi manajemen nyeri',
  ],
  performance_recovery: [
    'Optimasi recovery untuk performa',
    'Sport massage profesional',
    'Analisis biomekanik',
    'Program latihan personal',
  ],
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch service
  const { data: service, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (error || !service) {
    notFound()
  }

  const category = categoryInfo[service.category as ServiceCategory]
  const benefits = categoryBenefits[service.category as ServiceCategory] || []

  // Fetch related services in same category
  const { data: relatedServices } = await supabase
    .from('services')
    .select('*')
    .eq('category', service.category)
    .eq('is_active', true)
    .neq('id', id)
    .limit(3)

  // Fetch available therapists count
  const { count: therapistCount } = await supabase
    .from('therapists')
    .select('*', { count: 'exact', head: true })
    .eq('is_verified', true)
    .eq('is_available', true)

  return (
    <div className="min-h-screen bg-gray-50 w-full pb-32">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="flex items-center px-4 py-3">
          <Link href="/services" className="mr-3">
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900 line-clamp-1">{service.name}</h1>
            <p className="text-xs text-gray-500">{category?.name}</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Hero Card */}
        <Card className="overflow-hidden">
          <div className={`${category?.bgColor} p-6 flex items-center justify-center`}>
            <div className={`p-4 bg-white/80 rounded-2xl ${category?.color}`}>
              {category?.icon}
            </div>
          </div>
          <CardContent className="p-4">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{service.description}</p>
            
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-1.5 text-gray-600">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{service.duration_minutes} menit</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{therapistCount || 0} terapis tersedia</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Price Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">Harga mulai dari</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {formatPrice(service.base_price)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">per sesi</p>
                <p className="text-xs text-gray-400">{service.duration_minutes} menit</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Yang Anda Dapatkan</h3>
            <div className="space-y-2.5">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-2.5">
                  <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">{benefit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* How it works */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Cara Kerja</h3>
            <div className="space-y-3">
              {[
                { step: 1, title: 'Pilih Jadwal', desc: 'Pilih tanggal dan waktu yang sesuai' },
                { step: 2, title: 'Pilih Terapis', desc: 'Pilih terapis atau biarkan sistem memilihkan' },
                { step: 3, title: 'Konfirmasi', desc: 'Isi alamat dan lakukan pembayaran' },
                { step: 4, title: 'Terapis Datang', desc: 'Terapis akan datang ke lokasi Anda' },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    {item.step}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Related Services */}
        {relatedServices && relatedServices.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Layanan Terkait</h3>
            <div className="space-y-2">
              {relatedServices.map((related) => (
                <Link key={related.id} href={`/services/${related.id}`}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{related.name}</p>
                        <p className="text-xs text-gray-500">{related.duration_minutes} menit</p>
                      </div>
                      <p className="text-sm font-semibold text-emerald-600">
                        {formatPrice(related.base_price)}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 safe-area-bottom">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <div className="flex-1">
            <p className="text-xs text-gray-500">Mulai dari</p>
            <p className="text-lg font-bold text-gray-900">{formatPrice(service.base_price)}</p>
          </div>
          <Link href={`/booking?service=${service.id}`} className="flex-1">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] h-12 text-base font-semibold">
              Booking Sekarang
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
