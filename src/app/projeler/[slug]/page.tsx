export const revalidate = 0
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProjeDetayClient from '@/components/ProjeDetayClient'
import { prisma } from '@/lib/prisma'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const p = await prisma.project.findUnique({ where: { slug: params.slug } })
    if (!p) return { title: 'Proje Bulunamadı' }
    return { title: p.title, description: p.description }
  } catch { return { title: 'Proje' } }
}

export default async function ProjeDetayPage({ params }: { params: { slug: string } }) {
  let project: any = null
  try {
    project = await prisma.project.findUnique({ where: { slug: params.slug } })
  } catch (e) { console.error(e) }

  if (!project) notFound()

  return (
    <>
      <Navbar />
      <ProjeDetayClient project={project} />
      <Footer />
    </>
  )
}
