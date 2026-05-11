import crypto from 'crypto';

export const GATE_COOKIE_NAME = 'b00_gate';
export const GATE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function b64url(buf) {
  return Buffer.from(buf)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function sign(secret, payload) {
  return b64url(crypto.createHmac('sha256', secret).update(payload).digest());
}

export function makeGateCookieValue(secret, now = Date.now()) {
  const ts = String(now);
  const sig = sign(secret, ts);
  return `${ts}.${sig}`;
}

export function verifyGateCookieValue(secret, value, now = Date.now()) {
  if (!value || typeof value !== 'string') return { ok: false };
  const parts = value.split('.');
  if (parts.length !== 2) return { ok: false };
  const [tsStr, sig] = parts;
  const ts = Number(tsStr);
  if (!Number.isFinite(ts)) return { ok: false };
  if (now - ts > GATE_TTL_MS) return { ok: false, reason: 'expired' };
  if (now - ts < -5 * 60 * 1000) return { ok: false, reason: 'clock_skew' };
  const expected = sign(secret, tsStr);
  const a = Buffer.from(expected);
  const b = Buffer.from(sig);
  if (a.length !== b.length) return { ok: false };
  if (!crypto.timingSafeEqual(a, b)) return { ok: false };
  return { ok: true, ts };
}

