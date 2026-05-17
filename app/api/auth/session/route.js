import { NextResponse } from 'next/server';
import { USER_SESSION_COOKIE, verifyUserSession } from '../../../../lib/user-auth';

export async function GET(req) {
  const secret = process.env.USER_SESSION_SECRET || process.env.GATE_COOKIE_SECRET || '';
  if (!secret) return NextResponse.json({ session: null });
  const cookie = req.cookies.get(USER_SESSION_COOKIE)?.value;
  const session = verifyUserSession(secret, cookie);
  return NextResponse.json({ session });
}

