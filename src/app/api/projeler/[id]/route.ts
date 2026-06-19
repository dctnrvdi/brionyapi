import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const project = await prisma.project.findUnique({ where: { id: Number(params.id) } })
    if (!project) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })
    return NextResponse.json(project)
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  try {
    const body = await req.json()
    const project = await prisma.project.update({
      where: { id: Number(params.id) },
      data: {
        title: body.title,
        slug: body.slug,
        category: body.category,
        location: body.location,
        year: Number(body.year),
        area: body.area,
        description: body.description,
        coverImage: body.coverImage || '',
        images: body.images || '[]',
        featured: Boolean(body.featured),
        order: body.order !== undefined ? Number(body.order) : undefined,
      },
    })
    return NextResponse.json(project)
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  try {
    await prisma.project.delete({ where: { id: Number(params.id) } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
