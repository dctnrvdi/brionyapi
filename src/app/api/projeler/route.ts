import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const projects = await prisma.project.findMany({ orderBy: { order: 'asc' } })
    return NextResponse.json(projects)
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  try {
    const body = await req.json()
    const maxOrder = await prisma.project.aggregate({ _max: { order: true } })
    const project = await prisma.project.create({
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
        order: (maxOrder._max.order || 0) + 1,
      },
    })
    return NextResponse.json(project, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
