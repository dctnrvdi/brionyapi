export const revalidate = 0
import { notFound } from 'next/navigation'
import AdminProjeForm from '@/components/admin/AdminProjeForm'
import { prisma } from '@/lib/prisma'

export default async function EditProjePage({ params }: { params: { id: string } }) {
  let project: any = null
  try {
    project = await prisma.project.findUnique({ where: { id: Number(params.id) } })
  } catch (e) { console.error(e) }

  if (!project) notFound()
  return <AdminProjeForm mode="edit" project={project} />
}
