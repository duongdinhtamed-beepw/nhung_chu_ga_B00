import { NextResponse } from 'next/server';
import { makeGateCookieValue, GATE_COOKIE_NAME } from '../../../lib/gate';

export async function POST(req) {
  const form = await req.formData();
  const password = String(form.get('password') || '');

  const sitePassword = process.env.SITE_PASSWORD || '';
  const secret = process.env.GATE_COOKIE_SECRET || '';

  if (!sitePassword || !secret) {
    return NextResponse.json(
      { error: 'Missing SITE_PASSWORD or GATE_COOKIE_SECRET' },
      { status: 500 }
    );
  }

  if (password !== sitePassword) {
    return NextResponse.redirect(new URL('/gate?err=1', req.url), 302);
  }

  const res = NextResponse.redirect(new URL('/', req.url), 302);
  res.cookies.set({
    name: GATE_COOKIE_NAME,
    value: makeGateCookieValue(secret),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  });
  return res;
}

