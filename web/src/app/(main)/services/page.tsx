import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Activity, Bone, HeartPulse, Zap, Clock } from 'lucide-react'
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
  bgColor: string
}> = {
  home_recovery: {
    name: 'Home Recovery',
    description: 'Pemulihan pasca operasi',
    icon: <HeartPulse className="h-5 w-5" />,
    color: 'text-rose-600',
    bgColor: 'bg-rose-100',
  },
  injury_support: {
    name: 'Cedera & Injury',
    description: 'Penanganan cedera olahraga',
    icon: <Bone className="h-5 w-5" />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  pain_relief: {
    name: 'Nyeri Kronis',
    description: 'Terapi nyeri punggung & sendi',
    icon: <Activity className="h-5 w-5" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  performance_recovery: {
    name: 'Performance',
    description: 'Recovery untuk atlet',
    icon: <Zap className="h-5 w-5" />,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
  },
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const params = await searchParams
  
  // Check if environment variables are configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('Supabase environment variables are not configured!')
    console.error('Please create a .env.local file with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">Configuration Error</h2>
          <p className="text-gray-700 mb-4">
            Supabase environment variables are not configured.
          </p>
          <div className="bg-gray-100 p-3 rounded text-sm">
            <p className="font-semibold mb-1">To fix this:</p>
            <ol className="list-decimal list-inside space-y-1 text-gray-600">
              <li>Copy .env.local.example to .env.local</li>
              <li>Add your Supabase project URL and anon key</li>
              <li>Restart the development server</li>
            </ol>
          </div>
        </div>
      </div>
    )
  }

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
    console.error('Error details:', JSON.stringify(error, null, 2))
    console.error('Error code:', error.code)
    console.error('Error message:', error.message)
    console.error('Error hint:', error.hint)
    
    // Show user-friendly error page
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">Database Error</h2>
          <p className="text-gray-700 mb-4">
            {error.message || 'Unable to fetch services from the database.'}
          </p>
          {error.hint && (
            <p className="text-sm text-gray-600 mb-4 bg-yellow-50 p-3 rounded border border-yellow-200">
              <strong>Hint:</strong> {error.hint}
            </p>
          )}
          <div className="bg-gray-100 p-3 rounded text-sm">
            <p className="font-semibold mb-2">Common solutions:</p>
            <ol className="list-decimal list-inside space-y-1 text-gray-600">
              <li>Make sure your database tables are created</li>
              <li>Run the migrations in <code className="bg-gray-200 px-1 rounded">supabase/migrations/</code></li>
              <li>Check RLS policies in Supabase dashboard</li>
              <li>Verify your API keys have the correct permissions</li>
            </ol>
          </div>
          {error.code && (
            <p className="text-xs text-gray-500 mt-4">Error Code: {error.code}</p>
          )}
        </div>
      </div>
    )
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
      {/* Mobile Header */}
      <div className="bg-white px-4 pt-3 pb-3 border-b">
        <h1 className="text-xl font-bold text-gray-900">Layanan Terapi</h1>
        <p className="text-sm text-gray-500 mt-1">Pilih layanan sesuai kebutuhan</p>
      </div>

      {/* Category Filter - Horizontal Scroll */}
      <div className="bg-white border-b sticky top-14 z-40 pb-safe">
        <div className="flex overflow-x-auto px-4 py-3 gap-2 scrollbar-hide">
          <Link href="/services">
            <Button
              variant={!activeCategory ? 'default' : 'outline'}
              size="sm"
              className={`whitespace-nowrap ${!activeCategory ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
            >
              Semua
            </Button>
          </Link>
          {categories.map((cat) => (
            <Link key={cat} href={`/services?category=${cat}`}>
              <Button
                variant={activeCategory === cat ? 'default' : 'outline'}
                size="sm"
                className={`whitespace-nowrap ${activeCategory === cat ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
              >
                {categoryInfo[cat].name}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* Services List */}
      <div className="px-4 py-4">
        {activeCategory ? (
          // Single category view
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className={`p-2 rounded-xl ${categoryInfo[activeCategory].bgColor} ${categoryInfo[activeCategory].color}`}>
                {categoryInfo[activeCategory].icon}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {categoryInfo[activeCategory].name}
                </h2>
                <p className="text-xs text-gray-500">{categoryInfo[activeCategory].description}</p>
              </div>
            </div>
            <div className="space-y-3">
              {groupedServices[activeCategory]?.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        ) : (
          // All categories view
          <div className="space-y-6">
            {categories.map((category) => (
              groupedServices[category]?.length > 0 && (
                <div key={category}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-lg ${categoryInfo[category].bgColor} ${categoryInfo[category].color}`}>
                        {categoryInfo[category].icon}
                      </div>
                      <h2 className="text-base font-bold text-gray-900">
                        {categoryInfo[category].name}
                      </h2>
                    </div>
                    <Link href={`/services?category=${category}`} className="text-emerald-600 text-xs font-medium">
                      Lihat
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {groupedServices[category]?.slice(0, 2).map((service) => (
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
            {error ? (
              <div className="space-y-2">
                <p className="text-red-600 text-sm font-semibold">Gagal memuat layanan</p>
                <p className="text-gray-500 text-xs">
                  Terjadi kesalahan saat mengambil data
                </p>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Belum ada layanan tersedia</p>
            )}
          </div>
        )}
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
    <Link href={`/services/${service.id}`}>
      <Card className="hover:shadow-md transition-shadow active:scale-[0.98]">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 pr-2">
              <h3 className="font-semibold text-gray-900 text-sm mb-1">{service.name}</h3>
              <p className="text-xs text-gray-500 line-clamp-2">{service.description}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-base font-bold text-emerald-600">
                {formatPrice(service.base_price)}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center text-gray-500 text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {service.duration_minutes} menit
            </div>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-xs h-8">
              Lihat Detail
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
