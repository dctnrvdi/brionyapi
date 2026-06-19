import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  try {
    const body = await req.json()
    const item = await prisma.testimonial.update({
      where: { id: Number(params.id) },
      data: {
        author: body.author,
        role: body.role,
        company: body.company || null,
        content: body.content,
        rating: Number(body.rating) || 5,
        avatar: body.avatar || null,
        featured: Boolean(body.featured),
        order: body.order !== undefined ? Number(body.order) : undefined,
      },
    })
    return NextResponse.json(item)
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  try {
    await prisma.testimonial.delete({ where: { id: Number(params.id) } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
