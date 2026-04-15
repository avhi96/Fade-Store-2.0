import { NextResponse } from 'next/server'

export async function proxy(request) {
  // Skip maintenance check - use client-side LayoutWrapper with proper Firebase admin detection
  // Maintenance handled client-side correctly
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|admin|_next/proxy).*)',
  ],
}
