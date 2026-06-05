import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api/')) {
    const forbiddenPatterns = ['..', '%2e%2e', '<script', 'javascript:'];
    const dangerousPath = forbiddenPatterns.some((pattern) => pathname.toLowerCase().includes(pattern));
    if (dangerousPath) {
      return NextResponse.json({ error: 'Invalid request path' }, { status: 400 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
