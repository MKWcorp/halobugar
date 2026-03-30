import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { AuthProvider } from '@/components/providers/auth-provider'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="flex flex-col h-screen overflow-hidden bg-gray-50 w-full relative">
        <Header />
        <main className="flex-1 pb-20 overflow-y-auto w-full">
          {children}
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}
