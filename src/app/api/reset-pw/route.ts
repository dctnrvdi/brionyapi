import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

const SECRET = 'brion-reset-7x9k2'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (token !== SECRET) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const hashed = await bcrypt.hash('Brion2025!', 12)
  await prisma.adminUser.updateMany({ data: { password: hashed } })

  return NextResponse.json({ ok: true, email: 'admin@brionyapi.com', password: 'Brion2025!' })
}
