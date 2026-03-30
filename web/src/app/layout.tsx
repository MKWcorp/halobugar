import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Halo Bugar - Home Recovery & Fisioterapi",
  description: "Platform home recovery dan fisioterapi. Pesan fisioterapis profesional langsung ke rumah.",
  keywords: ["fisioterapi", "home recovery", "terapi", "pemulihan", "cedera olahraga"],
  authors: [{ name: "Halo Bugar" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${jakarta.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full bg-gray-50 text-gray-900" style={{ fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>
        <div className="mx-auto min-h-screen w-full sm:max-w-md bg-white sm:shadow-xl flex flex-col relative">
          {children}
        </div>
      </body>
    </html>
  );
}

