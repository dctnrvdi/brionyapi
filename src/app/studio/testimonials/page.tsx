export const revalidate = 0
import AdminTestimonialsClient from '@/components/admin/AdminTestimonialsClient'
import { prisma } from '@/lib/prisma'

export default async function TestimonialsPage() {
  let testimonials: any[] = []
  try {
    testimonials = await prisma.testimonial.findMany({ orderBy: { order: 'asc' } })
  } catch (e) { console.error(e) }

  return <AdminTestimonialsClient testimonials={testimonials} />
}
