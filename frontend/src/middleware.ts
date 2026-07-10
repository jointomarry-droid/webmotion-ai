import { NextResponse, type NextRequest } from 'next/server'

/**
 * Middleware - simplified for demo mode
 * The sb_publishable_ key doesn't work with createServerClient (needs JWT format)
 * So we skip server-side auth checks and handle auth client-side
 */
export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: { headers: request.headers },
  })

  // For now, allow all routes through
  // Auth is handled client-side with the demo client
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
