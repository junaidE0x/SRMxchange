import { NextRequest, NextResponse } from 'next/server'

const attempts = new Map<string, { count: number; timestamp: number }>()
const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === '/login') {
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
    const now = Date.now()
    const record = attempts.get(ip)

    if (record) {
      // Reset window if expired
      if (now - record.timestamp > WINDOW_MS) {
        attempts.set(ip, { count: 1, timestamp: now })
      } else if (record.count >= MAX_ATTEMPTS) {
        return NextResponse.json(
          { error: 'Too many login attempts. Try again in 15 minutes.' },
          { status: 429 }
        )
      } else {
        record.count++
      }
    } else {
      attempts.set(ip, { count: 1, timestamp: now })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login']
}

