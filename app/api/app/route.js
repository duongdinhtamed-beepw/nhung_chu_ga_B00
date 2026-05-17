import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { verifyGateCookieValue, GATE_COOKIE_NAME } from '../../../lib/gate';

export async function GET(req) {
  // Check auth - verify gate cookie
  const secret = process.env.GATE_COOKIE_SECRET || '';
  const cookie = req.cookies.get(GATE_COOKIE_NAME)?.value;
  
  if (!secret) {
    return NextResponse.json(
      { error: 'Server chưa cấu hình GATE_COOKIE_SECRET' },
      { status: 500 }
    );
  }

  if (!cookie || !verifyGateCookieValue(secret, cookie).ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Read public/index.html
    const indexPath = join(process.cwd(), 'public', 'index.html');
    const html = readFileSync(indexPath, 'utf-8');
    
    // Return HTML with proper content-type
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    console.error('Error reading index.html:', error);
    return NextResponse.json(
      { error: 'Failed to load app' },
      { status: 500 }
    );
  }
}
