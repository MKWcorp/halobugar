import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Activity, User, ArrowRight, Plus, MapPin, Phone } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get recent bookings
  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      *,
      service:services(name),
      therapist:therapists(
        user:users(name)
      )
    `)
    .eq('user_id', user.id)
    .order('scheduled_at', { ascending: false })
    .limit(5)

  const upcomingBookings = bookings?.filter(b => 
    new Date(b.scheduled_at) > new Date() && 
    !['cancelled', 'completed'].includes(b.status)
  ) || []

  // Get active in-progress booking
  const activeBooking = bookings?.find(b => 
    ['on_the_way', 'in_progress', 'confirmed'].includes(b.status) &&
    new Date(b.scheduled_at).toDateString() === new Date().toDateString()
  )

  const completedCount = bookings?.filter(b => b.status === 'completed').length || 0

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-4 py-3">
          <h1 className="text-lg font-bold text-gray-900">
            Halo, {profile?.name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="text-xs text-gray-500">Selamat datang kembali</p>
        </div>
      </div>

      <div className="px-4 py-4">
        {/* Active Booking Card */}
        {activeBooking && (
          <Link href={`/dashboard/bookings/${activeBooking.id}`}>
            <Card className="mb-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-lg overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="text-xs font-medium text-emerald-100">
                      {activeBooking.status === 'confirmed' && 'Dikonfirmasi'}
                      {activeBooking.status === 'on_the_way' && 'Terapis dalam perjalanan'}
                      {activeBooking.status === 'in_progress' && 'Sedang berlangsung'}
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-emerald-100" />
                </div>
                
                <h3 className="font-semibold mb-1">{activeBooking.service?.name}</h3>
                <p className="text-sm text-emerald-100 mb-3">
                  Terapis: {activeBooking.therapist?.user?.name}
                </p>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-emerald-100">
                    <Clock className="h-3.5 w-3.5" />
                    {new Date(activeBooking.scheduled_at).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        )}

        {/* Quick Actions */}
        <div className="space-y-2 mb-4">
          <Link href="/services">
            <Card className="hover:shadow-md transition-shadow cursor-pointer active:scale-[0.98]">
              <CardContent className="p-3 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-100 flex-shrink-0">
                  <Plus className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900">Buat Booking Baru</h3>
                  <p className="text-xs text-gray-500">Jadwalkan sesi terapi</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/dashboard/bookings">
            <Card className="hover:shadow-md transition-shadow cursor-pointer active:scale-[0.98]">
              <CardContent className="p-3 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-100 flex-shrink-0">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900">Riwayat Booking</h3>
                  <p className="text-xs text-gray-500">Lihat semua booking</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/dashboard/profile">
            <Card className="hover:shadow-md transition-shadow cursor-pointer active:scale-[0.98]">
              <CardContent className="p-3 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-100 flex-shrink-0">
                  <User className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900">Profil Saya</h3>
                  <p className="text-xs text-gray-500">Edit data diri</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Total Sesi</p>
                  <p className="text-xl font-bold text-gray-900 mt-0.5">{completedCount}</p>
                </div>
                <div className="p-2 rounded-xl bg-emerald-100">
                  <Activity className="h-4 w-4 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Aktif</p>
                  <p className="text-xl font-bold text-gray-900 mt-0.5">{upcomingBookings.length}</p>
                </div>
                <div className="p-2 rounded-xl bg-blue-100">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Bookings */}
        <Card>
          <CardHeader className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">Booking Mendatang</CardTitle>
                <CardDescription className="text-xs">Sesi yang dijadwalkan</CardDescription>
              </div>
              <Link href="/dashboard/bookings">
                <Button variant="ghost" size="sm" className="text-emerald-600 h-7 text-xs px-2">
                  Semua <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {upcomingBookings.length > 0 ? (
              <div className="space-y-2">
                {upcomingBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg bg-emerald-100">
                        <Activity className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {booking.service?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {booking.therapist?.user?.name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-gray-900">
                        {new Date(booking.scheduled_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(booking.scheduled_at).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-10 h-10 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 mb-3">Belum ada booking</p>
                <Link href="/services">
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 h-8 text-xs active:scale-[0.98]">
                    Buat Booking
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="mt-3 bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold mb-1">Tips Pemulihan</h3>
            <p className="text-xs text-emerald-100 mb-3">
              Lakukan peregangan ringan setiap pagi untuk menjaga fleksibilitas tubuh.
            </p>
            <Link href="/blog/tips">
              <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0 h-7 text-xs active:scale-[0.98]">
                Baca Selengkapnya
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
