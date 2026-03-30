import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Activity, Bone, HeartPulse, Zap, Clock, ArrowRight } from 'lucide-react'
import { ServiceCategory } from '@/types'

interface DatabaseService {
  id: string
  name: string
  category: ServiceCategory
  description: string
  duration_minutes: number
  base_price: number
  is_active: boolean
  icon: string | null
}

const categoryInfo: Record<ServiceCategory, { 
  name: string
  description: string
  icon: React.ReactNode
  color: string
}> = {
  home_recovery: {
    name: 'Home Recovery',
    description: 'Pemulihan pasca operasi, stroke, dan patah tulang',
    icon: <HeartPulse className="h-6 w-6" />,
    color: 'bg-rose-100 text-rose-600',
  },
  injury_support: {
    name: 'Cedera & Injury',
    description: 'Penanganan cedera olahraga dan keseleo',
    icon: <Bone className="h-6 w-6" />,
    color: 'bg-orange-100 text-orange-600',
  },
  pain_relief: {
    name: 'Nyeri Kronis',
    description: 'Terapi untuk nyeri punggung, leher, dan sendi',
    icon: <Activity className="h-6 w-6" />,
    color: 'bg-blue-100 text-blue-600',
  },
  performance_recovery: {
    name: 'Performance Recovery',
    description: 'Program recovery untuk atlet dan pekerja',
    icon: <Zap className="h-6 w-6" />,
    color: 'bg-emerald-100 text-emerald-600',
  },
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price)
}

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  
  let query = supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('category')
    .order('base_price')
  
  if (params.category && params.category in categoryInfo) {
    query = query.eq('category', params.category)
  }

  const { data: services, error } = await query

  if (error) {
    console.error('Error fetching services:', error)
  }

  // Group services by category
  const groupedServices = ((services as DatabaseService[]) || []).reduce((acc, service) => {
    const category = service.category as ServiceCategory
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(service)
    return acc
  }, {} as Record<ServiceCategory, DatabaseService[]>)

  const categories = Object.keys(categoryInfo) as ServiceCategory[]
  const activeCategory = params.category as ServiceCategory | undefined

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Layanan Fisioterapi</h1>
          <p className="text-lg text-emerald-100 max-w-2xl">
            Pilih layanan yang sesuai dengan kebutuhan Anda. Semua terapi dilakukan oleh 
            fisioterapis profesional bersertifikat langsung di rumah Anda.
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto py-4 gap-2 scrollbar-hide">
            <Link href="/services">
              <Button
                variant={!activeCategory ? 'default' : 'outline'}
                size="sm"
                className={!activeCategory ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
              >
                Semua
              </Button>
            </Link>
            {categories.map((cat) => (
              <Link key={cat} href={`/services?category=${cat}`}>
                <Button
                  variant={activeCategory === cat ? 'default' : 'outline'}
                  size="sm"
                  className={activeCategory === cat ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                >
                  {categoryInfo[cat].name}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeCategory ? (
          // Single category view
          <div>
            <div className="flex items-center space-x-3 mb-8">
              <div className={`p-3 rounded-xl ${categoryInfo[activeCategory].color}`}>
                {categoryInfo[activeCategory].icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {categoryInfo[activeCategory].name}
                </h2>
                <p className="text-gray-600">{categoryInfo[activeCategory].description}</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedServices[activeCategory]?.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        ) : (
          // All categories view
          <div className="space-y-12">
            {categories.map((category) => (
              groupedServices[category]?.length > 0 && (
                <div key={category}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${categoryInfo[category].color}`}>
                        {categoryInfo[category].icon}
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {categoryInfo[category].name}
                      </h2>
                    </div>
                    <Link href={`/services?category=${category}`} className="text-emerald-600 hover:underline text-sm font-medium flex items-center">
                      Lihat semua <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groupedServices[category]?.slice(0, 3).map((service) => (
                      <ServiceCard key={service.id} service={service} />
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        )}

        {(!services || services.length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-500">Belum ada layanan yang tersedia.</p>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="bg-emerald-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Siap Memulai Pemulihan?</h2>
          <p className="text-emerald-100 mb-6 max-w-xl mx-auto">
            Pilih layanan dan jadwalkan sesi pertama Anda. Fisioterapis profesional kami siap membantu.
          </p>
          <Link href="/therapists">
            <Button size="lg" variant="secondary" className="bg-white text-emerald-600 hover:bg-gray-100">
              Cari Fisioterapis
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

function ServiceCard({ service }: { service: { 
  id: string
  name: string
  description: string
  duration_minutes: number
  base_price: number
}}) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{service.name}</CardTitle>
        <CardDescription>{service.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-gray-500 text-sm">
            <Clock className="h-4 w-4 mr-1" />
            {service.duration_minutes} menit
          </div>
          <div className="text-lg font-bold text-emerald-600">
            {formatPrice(service.base_price)}
          </div>
        </div>
        <Link href={`/booking?service=${service.id}`}>
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
            Pesan Sekarang
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
