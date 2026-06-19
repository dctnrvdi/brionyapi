export const revalidate = 0
import AdminProjelerClient from '@/components/admin/AdminProjelerClient'
import { prisma } from '@/lib/prisma'

export default async function AdminProjelerPage() {
  let projects: any[] = []
  try {
    projects = await prisma.project.findMany({ orderBy: { order: 'asc' } })
  } catch (e) { console.error(e) }

  return <AdminProjelerClient projects={projects} />
}
