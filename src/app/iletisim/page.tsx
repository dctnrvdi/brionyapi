export const revalidate = 0
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import IletisimClient from '@/components/IletisimClient'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = { title: 'İletişim' }

export default async function IletisimPage() {
  let settings: Record<string, string> = {}
  try {
    const rows = await prisma.siteSettings.findMany()
    rows.forEach(r => { settings[r.key] = r.value })
  } catch (e) { console.error(e) }

  return (
    <>
      <Navbar />
      <IletisimClient settings={settings} />
      <Footer />
    </>
  )
}
