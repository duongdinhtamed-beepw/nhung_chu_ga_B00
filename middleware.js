import { NextResponse } from 'next/server';

const GATE_COOKIE_NAME = 'b00_gate';
const GATE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const PUBLIC_PATH_PREFIXES = [
  '/_next',
  '/gate',
  '/api/gate',
  '/api/auth',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/login.html'
];

const PUBLIC_FILE_EXTENSIONS = [
  '.css',
  '.js',
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.bmp',
  '.gif',
  '.svg',
  '.ico',
  '.json',
  '.txt',
  '.woff2',
  '.woff',
  '.ttf',
  '.eot'
];

function b64url(bytes) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

async function sign(secret, payload) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  return b64url(await crypto.subtle.sign('HMAC', key, enc.encode(payload)));
}

async function verifyGateCookieValue(secret, value, now = Date.now()) {
  if (!value || typeof value !== 'string') return { ok: false };
  const parts = value.split('.');
  if (parts.length !== 2) return { ok: false };
  const [tsStr, sig] = parts;
  const ts = Number(tsStr);
  if (!Number.isFinite(ts)) return { ok: false };
  if (now - ts > GATE_TTL_MS) return { ok: false, reason: 'expired' };
  if (now - ts < -5 * 60 * 1000) return { ok: false, reason: 'clock_skew' };
  const expected = await sign(secret, tsStr);
  return { ok: expected === sig, ts };
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  if (
    PUBLIC_PATH_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/')) ||
    PUBLIC_FILE_EXTENSIONS.some((ext) => pathname.endsWith(ext))
  ) {
    return NextResponse.next();
  }

  const secret = process.env.GATE_COOKIE_SECRET || '';
  if (!secret) {
    return NextResponse.redirect(new URL('/gate', req.url));
  }

  const cookie = req.cookies.get(GATE_COOKIE_NAME)?.value;
  const ok = (await verifyGateCookieValue(secret, cookie)).ok;
  if (ok) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = '/gate';
  url.search = '';
  return NextResponse.redirect(url);
}

export const config = {
  matcher: '/:path*'
};

