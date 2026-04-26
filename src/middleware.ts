import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory rate limit for the edge (Note: Resets on cold start)
// For high-scale production, we would use Redis (Upstash)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export function middleware(request: NextRequest) {
  // Only apply to our API relay routes
  if (request.nextUrl.pathname.startsWith('/api/v1/')) {
    const ip = request.ip || '127.0.0.1';
    const limit = 60; // Max requests per window
    const windowMs = 60 * 1000; // 1 minute window

    const now = Date.now();
    const rateLimitData = rateLimitMap.get(ip);

    if (!rateLimitData) {
      rateLimitMap.set(ip, { count: 1, lastReset: now });
    } else {
      if (now - rateLimitData.lastReset > windowMs) {
        // Reset window
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

// Ensure middleware only runs on API routes for performance
export const config = {
  matcher: '/api/v1/:path*',
};
