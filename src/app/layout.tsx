import type { Metadata } from 'next'
import { Bebas_Neue, Syne, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { prisma } from '@/lib/prisma'
import Preloader from '@/components/Preloader'
import CustomCursor from '@/components/CustomCursor'
import './globals.css'

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-bebas',
  display: 'swap',
})

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Brion Yapı | Mühendislik & İnşaat',
    template: '%s | Brion Yapı',
  },
  description: 'Brion Yapı — güçlü temeller, kalıcı yapılar. Konut ve ticari projelerde mühendislik mükemmelliği.',
  keywords: ['inşaat', 'yapı', 'konut', 'ticari', 'brion yapı', 'istanbul', 'mühendislik'],
  authors: [{ name: 'Brion Yapı' }],
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Brion Yapı',
    title: 'Brion Yapı | Mühendislik & İnşaat',
    description: 'Güçlü temeller, kalıcı yapılar.',
  },
  robots: { index: true, follow: true },
}

async function getFaviconUrl() {
  try {
    const s = await prisma.siteSettings.findFirst({ where: { key: 'favicon_url' } })
    return s?.value || null
  } catch { return null }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const favicon = await getFaviconUrl()

  return (
    <html lang="tr" className={`${bebasNeue.variable} ${syne.variable} ${inter.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        {favicon && <link rel="icon" href={favicon} />}
      </head>
      <body>
        <CustomCursor />
        <Preloader />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
