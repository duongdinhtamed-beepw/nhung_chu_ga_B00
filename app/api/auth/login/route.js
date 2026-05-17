import { NextResponse } from 'next/server';
import { makeUserSession, USER_SESSION_COOKIE, USER_SESSION_TTL_MS, verifyCredentials } from '../../../../lib/user-auth';

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const username = String(body.username || '').trim();
  const password = String(body.password || '');
  const secret = process.env.USER_SESSION_SECRET || process.env.GATE_COOKIE_SECRET || '';

  if (!secret) {
    return NextResponse.json({ error: 'Server chưa cấu hình USER_SESSION_SECRET' }, { status: 500 });
  }

  if (!/^[a-zA-Z0-9_]{3,32}$/.test(username) || password.length < 6 || password.length > 128) {
    return NextResponse.json({ error: 'Thông tin đăng nhập không hợp lệ.' }, { status: 400 });
  }

  const user = verifyCredentials(username, password);
  if (!user) {
    await new Promise(resolve => setTimeout(resolve, 450));
    return NextResponse.json({ error: 'Tài khoản hoặc mật khẩu không đúng.' }, { status: 401 });
  }

  const session = makeUserSession(secret, user);
  const res = NextResponse.json({ user });
  res.cookies.set({
    name: USER_SESSION_COOKIE,
    value: session,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: Math.floor(USER_SESSION_TTL_MS / 1000)
  });
  return res;
}

