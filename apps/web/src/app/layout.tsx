import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: {
    default: 'NirogiTanman – Your Complete Healthcare Ecosystem',
    template: '%s | NirogiTanman',
  },
  description:
    'Connect with doctors, clinics, labs, pharmacies, and wellness providers across India. Book appointments, access medical records, and manage your health — all in one place.',
  keywords: ['healthcare', 'doctor', 'appointment', 'telemedicine', 'pharmacy', 'lab test'],
  metadataBase: new URL('https://nirogitanman.com'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://nirogitanman.com',
    siteName: 'NirogiTanman',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans min-h-screen`}>{children}</body>
    </html>
  )
}
