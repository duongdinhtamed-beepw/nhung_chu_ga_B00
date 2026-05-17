import { NextResponse } from 'next/server';
import { USER_SESSION_COOKIE } from '../../../../lib/user-auth';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: USER_SESSION_COOKIE,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0
  });
  return res;
}

