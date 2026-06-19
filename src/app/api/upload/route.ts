import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Vercel Hobby: 4.5MB request limit — allow up to 4MB here
export const maxDuration = 60

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'Dosya bulunamadı.' }, { status: 400 })

    // Reject files over 4MB to stay within Vercel's 4.5MB body limit
    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json({ error: 'Dosya 4MB\'dan büyük olamaz.' }, { status: 413 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`

    const result = await cloudinary.uploader.upload(base64, {
      folder: 'brion-yapi',
      resource_type: 'auto',
    })

    return NextResponse.json({ url: result.secure_url })
  } catch (e) {
    console.error('Upload hatası:', e)
    return NextResponse.json({ error: 'Yükleme başarısız.' }, { status: 500 })
  }
}
