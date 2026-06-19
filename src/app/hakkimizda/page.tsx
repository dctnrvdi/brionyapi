export const revalidate = 0
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HakkimizdaClient from '@/components/HakkimizdaClient'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = { title: 'Hakkımızda' }

export default async function HakkimizdaPage() {
  let settings: Record<string, string> = {}
  try {
    const rows = await prisma.siteSettings.findMany()
    rows.forEach(r => { settings[r.key] = r.value })
  } catch (e) { console.error(e) }

  return (
    <>
      <Navbar />
      <HakkimizdaClient settings={settings} />
      <Footer />
    </>
  )
}
