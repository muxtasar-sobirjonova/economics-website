import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextResponse } from 'next/server';
import { ratelimit } from './lib/ratelimit';

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const ip = req.ip ?? "127.0.0.1";
  
  // Apply rate limiting
  const { success } = await ratelimit.limit(ip);
  if (!success) {
    return new NextResponse("Too many requests", { status: 429 });
  }

  // Next NextResponse
  const response = NextResponse.next();

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://images.unsplash.com https://cdn.sanity.io;
    font-src 'self' https://fonts.gstatic.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `;

  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, ' ')
    .trim()

  response.headers.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue
  )

  return response;
});

export const config = {
  matcher: [
    '/home',
    '/lessons/:path*',
    '/roadmap',
    '/saved',
    '/topics/:path*'
  ],
};
