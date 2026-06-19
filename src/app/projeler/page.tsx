export const revalidate = 0
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProjelerClient from '@/components/ProjelerClient'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = { title: 'Projeler' }

export default async function ProjelerPage() {
  let projects: any[] = []
  try {
    projects = await prisma.project.findMany({ orderBy: { order: 'asc' } })
  } catch (e) { console.error(e) }

  return (
    <>
      <Navbar />
      <ProjelerClient projects={projects} />
      <Footer />
    </>
  )
}
