import Link from 'next/link'
import { Search, Activity, Heart, Zap, Stethoscope, Star, ArrowRight } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

// Placeholder featured therapists data
const featuredTherapists = [
  { id: '1', name: 'Siti Rahmawati', specialty: 'Deep Tissue', rating: 4.9, reviews: 124, image: null },
  { id: '2', name: 'Ahmad Yusuf', specialty: 'Sports Recovery', rating: 4.8, reviews: 98, image: null },
  { id: '3', name: 'Dewi Kartika', specialty: 'Relaxation', rating: 4.9, reviews: 156, image: null },
]

export default function Home() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50 w-full relative">
      <Header />
      
      <main className="flex-1 pb-20 overflow-y-auto w-full">
        {/* Welcome Section */}
        <section className="bg-white px-4 pt-6 pb-4 rounded-b-3xl shadow-sm border-b border-gray-100">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Halo, Budi! 👋</h1>
            <p className="text-gray-500 mt-1">Mau pijat hari ini?</p>
          </div>

          {/* Quick Search */}
          <div className="relative mb-2">
            <div className="flex items-center bg-gray-100 rounded-2xl px-4 py-3">
              <Search className="w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Cari layanan pijat & fisioterapi..." 
                className="bg-transparent border-none outline-none ml-3 w-full text-sm text-gray-700 placeholder-gray-400 focus:ring-0"
              />
            </div>
          </div>
        </section>

        {/* Quick Actions / Categories */}
        <section className="px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Layanan Kami</h2>
            <Link href="/services" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">Lihat Semua</Link>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Link href="/services/home-recovery" className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center gap-2 h-28 hover:bg-emerald-50 active:scale-95 transition-all">
              <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
                <Heart className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-gray-800">Home Recovery</span>
            </Link>

            <Link href="/services/injury-support" className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center gap-2 h-28 hover:bg-emerald-50 active:scale-95 transition-all">
              <div className="bg-orange-100 p-3 rounded-full text-orange-600">
                <Activity className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-gray-800">Cedera Olahraga</span>
            </Link>

            <Link href="/services/pain-relief" className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center gap-2 h-28 hover:bg-emerald-50 active:scale-95 transition-all">
              <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                <Stethoscope className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-gray-800">Nyeri Kronis</span>
            </Link>

            <Link href="/services/performance" className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center gap-2 h-28 hover:bg-emerald-50 active:scale-95 transition-all">
              <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
                <Zap className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-gray-800">Performa Atlet</span>
            </Link>
          </div>
        </section>

        {/* Featured Therapists */}
        <section className="px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Terapis Pilihan</h2>
            <Link href="/therapists" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              Lihat Semua
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {featuredTherapists.map((therapist) => (
              <Link 
                key={therapist.id} 
                href={`/therapists/${therapist.id}`}
                className="flex-shrink-0 w-36"
              >
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 hover:shadow-md transition-shadow">
                  <div className="w-full aspect-square bg-emerald-100 rounded-xl mb-2 flex items-center justify-center">
                    <span className="text-3xl font-bold text-emerald-600">
                      {therapist.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm text-gray-900 truncate">
                    {therapist.name}
                  </h3>
                  <p className="text-xs text-gray-500 truncate mb-1">
                    {therapist.specialty}
                  </p>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-medium text-gray-700">
                      {therapist.rating}
                    </span>
                    <span className="text-xs text-gray-400">
                      ({therapist.reviews})
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Promo Card */}
        <section className="px-4 pb-6 mt-2">
           <div className="bg-emerald-600 rounded-3xl p-5 text-white shadow-md relative overflow-hidden">
             <div className="relative z-10 w-2/3">
               <h3 className="font-bold text-lg mb-1">Booking Cepat!</h3>
               <p className="text-emerald-50 text-sm mb-4">Dapatkan terapis ke rumah dalam 60 menit.</p>
               <button className="bg-white text-emerald-600 text-sm font-semibold py-2 px-4 rounded-full active:scale-95 transition-transform shadow-sm">
                 Pesan Sekarang
               </button>
             </div>
             <div className="absolute -right-4 -bottom-4 opacity-20">
               <Activity className="w-32 h-32" />
             </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
