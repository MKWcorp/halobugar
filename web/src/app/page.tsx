import Link from 'next/link'
import { Search, Activity, Heart, Zap, Stethoscope } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function Home() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50 max-w-md mx-auto relative shadow-2xl">
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
