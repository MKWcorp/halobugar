import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Calendar, MapPin, Star, Users, Zap } from "lucide-react";

const services = [
  {
    icon: Activity,
    title: "Home Recovery",
    description: "Pemulihan pasca olahraga dan aktivitas fisik di rumah",
  },
  {
    icon: Zap,
    title: "Injury Support",
    description: "Penanganan cedera ringan hingga sedang",
  },
  {
    icon: Users,
    title: "Pain Relief",
    description: "Atasi nyeri otot, punggung, dan persendian",
  },
  {
    icon: Star,
    title: "Performance Recovery",
    description: "Recovery untuk atlet dan pecinta olahraga",
  },
];

const stats = [
  { value: "50+", label: "Fisioterapis Terverifikasi" },
  { value: "500+", label: "Sesi Selesai" },
  { value: "4.8", label: "Rating Rata-rata" },
  { value: "10+", label: "Area Layanan" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-green-800">Halo Bugar</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#layanan" className="text-gray-600 hover:text-green-600">Layanan</Link>
            <Link href="#cara-kerja" className="text-gray-600 hover:text-green-600">Cara Kerja</Link>
            <Link href="/therapist" className="text-gray-600 hover:text-green-600">Untuk Terapis</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline">Masuk</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-green-600 hover:bg-green-700">Daftar</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Home Recovery untuk
            <span className="text-green-600"> Hidup Aktif</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Pesan fisioterapis profesional langsung ke rumah. Pulih lebih nyaman, bergerak lebih baik.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8">
                <Calendar className="w-5 h-5 mr-2" />
                Pesan Sekarang
              </Button>
            </Link>
            <Link href="#layanan">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Lihat Layanan
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-green-600">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">{stat.value}</div>
                <div className="text-green-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="layanan" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Layanan Kami</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Pilih layanan sesuai kebutuhanmu. Fisioterapis profesional kami siap membantu pemulihanmu di rumah.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-green-200">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <service.icon className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="cara-kerja" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Cara Kerja</h2>
          <p className="text-gray-600 text-center mb-12">
            3 langkah mudah untuk mendapatkan layanan fisioterapi di rumah
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">1</div>
              <h3 className="text-lg font-semibold mb-2">Pilih Layanan</h3>
              <p className="text-gray-600">Pilih jenis layanan sesuai keluhan atau kebutuhanmu</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">2</div>
              <h3 className="text-lg font-semibold mb-2">Atur Jadwal</h3>
              <p className="text-gray-600">Pilih fisioterapis, tanggal, dan jam yang kamu inginkan</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">3</div>
              <h3 className="text-lg font-semibold mb-2">Terapis Datang</h3>
              <p className="text-gray-600">Fisioterapis datang ke rumah, nikmati sesi pemulihanmu</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-green-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Siap Pulih di Rumah?
          </h2>
          <p className="text-green-100 mb-8 max-w-xl mx-auto">
            Pesan fisioterapis profesional sekarang dan rasakan kenyamanan treatment di rumah
          </p>
          <Link href="/booking">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              <MapPin className="w-5 h-5 mr-2" />
              Pesan Home Recovery
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-green-800">Halo Bugar</span>
            </div>
            <p className="text-gray-600 text-sm">
              © 2026 Halo Bugar. Kesehatan Anda, Prioritas Kami.
            </p>
            <div className="flex gap-4">
              <Link href="/privacy" className="text-gray-600 hover:text-green-600 text-sm">Privasi</Link>
              <Link href="/terms" className="text-gray-600 hover:text-green-600 text-sm">Syarat & Ketentuan</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

