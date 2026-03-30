import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Activity, User, ArrowRight, Plus } from 'lucide-react'

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

  const completedCount = bookings?.filter(b => b.status === 'completed').length || 0

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Halo, {profile?.name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="text-gray-600">Selamat datang kembali di Halo Bugar</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Link href="/services">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-emerald-100">
                  <Plus className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Buat Booking Baru</h3>
                  <p className="text-sm text-gray-500">Jadwalkan sesi terapi</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/dashboard/bookings">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-blue-100">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Riwayat Booking</h3>
                  <p className="text-sm text-gray-500">Lihat semua booking</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/dashboard/profile">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-purple-100">
                  <User className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Profil Saya</h3>
                  <p className="text-sm text-gray-500">Edit data diri</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upcoming Bookings */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Booking Mendatang</CardTitle>
                  <CardDescription>Sesi terapi yang sudah dijadwalkan</CardDescription>
                </div>
                <Link href="/dashboard/bookings">
                  <Button variant="ghost" size="sm" className="text-emerald-600">
                    Lihat Semua <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {upcomingBookings.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="p-2 rounded-lg bg-emerald-100">
                            <Activity className="h-5 w-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {booking.service?.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              dengan {booking.therapist?.user?.name}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            {new Date(booking.scheduled_at).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </p>
                          <p className="text-sm text-gray-500">
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
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500 mb-4">Belum ada booking mendatang</p>
                    <Link href="/services">
                      <Button className="bg-emerald-600 hover:bg-emerald-700">
                        Buat Booking Baru
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Sesi</p>
                    <p className="text-3xl font-bold text-gray-900">{completedCount}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-100">
                    <Activity className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Booking Aktif</p>
                    <p className="text-3xl font-bold text-gray-900">{upcomingBookings.length}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-100">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Tips Pemulihan</h3>
                <p className="text-sm text-emerald-100 mb-4">
                  Lakukan peregangan ringan setiap pagi untuk menjaga fleksibilitas tubuh.
                </p>
                <Link href="/blog/tips">
                  <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0">
                    Baca Selengkapnya
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
