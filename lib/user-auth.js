import crypto from 'crypto';

export const USER_SESSION_COOKIE = 'b00_user_session';
export const USER_SESSION_TTL_MS = 2 * 60 * 60 * 1000;

const DEFAULT_ACCOUNTS = [
  { username: 'student01', password: 'B00-Dragon-7391!', role: 'student' },
  { username: 'student02', password: 'B00-Tiger-4827!', role: 'student' },
  { username: 'student03', password: 'B00-Eagle-6153!', role: 'student' },
  { username: 'student04', password: 'B00-Falcon-2984!', role: 'student' },
  { username: 'student05', password: 'B00-Wolf-5748!', role: 'student' },
  { username: 'student06', password: 'B00-Lion-8263!', role: 'student' },
  { username: 'student07', password: 'B00-Bear-1547!', role: 'student' },
  { username: 'student08', password: 'B00-Fox-9482!', role: 'student' },
  { username: 'student09', password: 'B00-Hawk-3726!', role: 'student' },
  { username: 'student10', password: 'B00-Owl-6195!', role: 'student' },
  { username: 'student11', password: 'B00-Panda-4873!', role: 'student' },
  { username: 'student12', password: 'B00-Koala-7246!', role: 'student' },
  { username: 'student13', password: 'B00-Shark-3918!', role: 'student' },
  { username: 'student14', password: 'B00-Whale-5627!', role: 'student' },
  { username: 'student15', password: 'B00-Dolphin-8354!', role: 'student' },
  { username: 'student16', password: 'B00-Lotus-1429!', role: 'student' },
  { username: 'student17', password: 'B00-Bamboo-7583!', role: 'student' },
  { username: 'student18', password: 'B00-Cedar-4197!', role: 'student' },
  { username: 'student19', password: 'B00-Maple-6842!', role: 'student' },
  { username: 'student20', password: 'B00-Oak-2965!', role: 'admin' }
];

function getAccounts() {
  if (!process.env.USER_ACCOUNTS_JSON) return DEFAULT_ACCOUNTS;
  try {
    const parsed = JSON.parse(process.env.USER_ACCOUNTS_JSON);
    return Array.isArray(parsed) ? parsed : DEFAULT_ACCOUNTS;
  } catch {
    return DEFAULT_ACCOUNTS;
  }
}

function b64url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function sign(secret, payload) {
  return b64url(crypto.createHmac('sha256', secret).update(payload).digest());
}

function safeEqual(a, b) {
  const ab = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

export function verifyCredentials(username, password) {
  const account = getAccounts().find(item => item.username === username);
  if (!account) return null;
  if (!safeEqual(account.password, password)) return null;
  return { username: account.username, role: account.role };
}

export function makeUserSession(secret, user, now = Date.now()) {
  const payload = {
    username: user.username,
    role: user.role,
    createdAt: now,
    lastActivity: now,
    expiresAt: now + USER_SESSION_TTL_MS,
    token: crypto.randomBytes(16).toString('hex'),
    fingerprint: crypto.randomBytes(8).toString('hex')
  };
  const encoded = b64url(JSON.stringify(payload));
  return `${encoded}.${sign(secret, encoded)}`;
}

export function verifyUserSession(secret, value, now = Date.now()) {
  if (!value || typeof value !== 'string') return null;
  const parts = value.split('.');
  if (parts.length !== 2) return null;
  const [encoded, sig] = parts;
  if (!safeEqual(sign(secret, encoded), sig)) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    if (!payload?.username || payload.expiresAt < now) return null;
    return payload;
  } catch {
    return null;
  }
}

