import { NextResponse } from 'next/server';
import { verifyGateCookieValue, GATE_COOKIE_NAME } from './lib/gate';

const PUBLIC_PATH_PREFIXES = [
  '/_next',
  '/gate',
  '/api/gate',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml'
];

export function middleware(req) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATH_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next();
  }

  const secret = process.env.GATE_COOKIE_SECRET || '';
  if (!secret) {
    return NextResponse.redirect(new URL('/gate', req.url));
  }

  const cookie = req.cookies.get(GATE_COOKIE_NAME)?.value;
  const ok = verifyGateCookieValue(secret, cookie).ok;
  if (ok) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = '/gate';
  url.search = '';
  return NextResponse.redirect(url);
}

export const config = {
  matcher: '/:path*'
};

