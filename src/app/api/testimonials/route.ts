import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const items = await prisma.testimonial.findMany({ orderBy: { order: 'asc' } })
    return NextResponse.json(items)
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  try {
    const body = await req.json()
    const max = await prisma.testimonial.aggregate({ _max: { order: true } })
    const item = await prisma.testimonial.create({
      data: {
        author: body.author,
        role: body.role,
        company: body.company || null,
        content: body.content,
        rating: Number(body.rating) || 5,
        avatar: body.avatar || null,
        featured: body.featured !== false,
        order: (max._max.order || 0) + 1,
      },
    })
    return NextResponse.json(item, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
