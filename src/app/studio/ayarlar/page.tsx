export const revalidate = 0
import AdminAyarlarClient from '@/components/admin/AdminAyarlarClient'
import { prisma } from '@/lib/prisma'

export default async function AyarlarPage() {
  let settings: Record<string, string> = {}
  try {
    const rows = await prisma.siteSettings.findMany()
    rows.forEach(r => { settings[r.key] = r.value })
  } catch (e) { console.error(e) }

  return <AdminAyarlarClient settings={settings} />
}
