import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const isLogin = req.nextUrl.pathname === '/studio/login'

  if (!token && !isLogin) {
    return NextResponse.redirect(new URL('/studio/login', req.url))
  }
  if (token && isLogin) {
    return NextResponse.redirect(new URL('/studio', req.url))
  }
  return NextResponse.next()
}

export const config = { matcher: ['/studio/:path*'] }
