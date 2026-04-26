import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export default function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/v1/')) {
    const ip = request.ip || '127.0.0.1';
    const limit = 60; 
    const windowMs = 60 * 1000; 

    const now = Date.now();
    const rateLimitData = rateLimitMap.get(ip);

    if (!rateLimitData) {
      rateLimitMap.set(ip, { count: 1, lastReset: now });
    } else {
      if (now - rateLimitData.lastReset > windowMs) {
        rateLimitData.count = 1;
        rateLimitData.lastReset = now;
      } else {
        if (rateLimitData.count >= limit) {
          return new NextResponse(
            JSON.stringify({ 
              error: 'Too Many Requests', 
              message: 'Rate limit exceeded (60 req/min). Please slow down.' 
            }),
            { 
              status: 429, 
              headers: { 'Content-Type': 'application/json' } 
            }
          );
        }
        rateLimitData.count++;
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/v1/:path*',
};
