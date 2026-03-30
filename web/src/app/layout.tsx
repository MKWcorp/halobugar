import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Halo Bugar - Home Recovery & Fisioterapi",
  description: "Platform home recovery dan fisioterapi. Pesan fisioterapis profesional langsung ke rumah untuk pemulihan yang lebih nyaman.",
  keywords: ["fisioterapi", "home recovery", "terapi", "pemulihan", "cedera olahraga"],
  authors: [{ name: "Halo Bugar" }],
  openGraph: {
    title: "Halo Bugar - Home Recovery untuk Hidup Aktif",
    description: "Pesan fisioterapis profesional langsung ke rumah. Pulih lebih nyaman, bergerak lebih baik.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
