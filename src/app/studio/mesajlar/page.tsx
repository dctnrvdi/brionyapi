export const revalidate = 0
import AdminMesajlarClient from '@/components/admin/AdminMesajlarClient'
import { prisma } from '@/lib/prisma'

export default async function MesajlarPage() {
  let messages: any[] = []
  try {
    messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    })
  } catch (e) { console.error(e) }

  return <AdminMesajlarClient messages={messages} />
}
