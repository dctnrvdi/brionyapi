export const revalidate = 0
import AdminDashboardClient from '@/components/admin/AdminDashboardClient'
import { prisma } from '@/lib/prisma'

export default async function AdminDashboard() {
  let projectCount = 0
  let messageCount = 0
  let unreadCount = 0
  let testimonialCount = 0

  try {
    ;[projectCount, messageCount, unreadCount, testimonialCount] = await Promise.all([
      prisma.project.count(),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { read: false } }),
      prisma.testimonial.count(),
    ])
  } catch (e) { console.error(e) }

  return (
    <AdminDashboardClient
      projectCount={projectCount}
      messageCount={messageCount}
      unreadCount={unreadCount}
      testimonialCount={testimonialCount}
    />
  )
}
