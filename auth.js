// ============================================================
// auth.js - Authentication module
// 20 pre-defined accounts, session management, rate limiting
// NOTE: Frontend-only demo. Production requires backend + HTTPS.
// ============================================================

// Pre-defined accounts (demo). Passwords are compared using PBKDF2.
// In production, store only hashes on a server.
const ACCOUNTS_CONFIG = [
    { username: 'student01', password: 'B00-Dragon-7391!', role: 'student' },
    { username: 'student02', password: 'B00-Tiger-4827!',  role: 'student' },
    { username: 'student03', password: 'B00-Eagle-6153!',  role: 'student' },
    { username: 'student04', password: 'B00-Falcon-2984!', role: 'student' },
    { username: 'student05', password: 'B00-Wolf-5748!',   role: 'student' },
    { username: 'student06', password: 'B00-Lion-8263!',   role: 'student' },
    { username: 'student07', password: 'B00-Bear-1547!',   role: 'student' },
    { username: 'student08', password: 'B00-Fox-9482!',    role: 'student' },
    { username: 'student09', password: 'B00-Hawk-3726!',   role: 'student' },
    { username: 'student10', password: 'B00-Owl-6195!',    role: 'student' },
    { username: 'student11', password: 'B00-Panda-4873!',  role: 'student' },
    { username: 'student12', password: 'B00-Koala-7246!',  role: 'student' },
    { username: 'student13', password: 'B00-Shark-3918!',  role: 'student' },
    { username: 'student14', password: 'B00-Whale-5627!',  role: 'student' },
    { username: 'student15', password: 'B00-Dolphin-8354!', role: 'student' },
    { username: 'student16', password: 'B00-Lotus-1429!',  role: 'student' },
    { username: 'student17', password: 'B00-Bamboo-7583!', role: 'student' },
    { username: 'student18', password: 'B00-Cedar-4197!',  role: 'student' },
    { username: 'student19', password: 'B00-Maple-6842!',  role: 'student' },
    { username: 'student20', password: 'B00-Oak-2965!',    role: 'admin'   }
];

const SESSION_KEY = 'b00_session';
const SESSION_DURATION_MS = 2 * 60 * 60 * 1000; // 2 hours
const IDLE_TIMEOUT_MS = 30 * 60 * 1000;          // 30 min idle

const loginLimiter = new SecurityUtils.RateLimiter('b00_login_attempts', 5, 15 * 60 * 1000);
const globalLimiter = new SecurityUtils.RateLimiter('b00_login_global', 30, 15 * 60 * 1000);

async function login(username, password) {
    // Validate input format (prevent injection)
    if (!SecurityUtils.validateInput(username, { maxLength: 32, minLength: 3, pattern: /^[a-zA-Z0-9_]+$/ })) {
        throw new Error('Tên đăng nhập không hợp lệ.');
    }
    if (!SecurityUtils.validateInput(password, { maxLength: 128, minLength: 6 })) {
        throw new Error('Mật khẩu không hợp lệ.');
    }
    if (SecurityUtils.detectInjection(username) || SecurityUtils.detectInjection(password)) {
        throw new Error('Phát hiện ký tự nguy hiểm trong đầu vào.');
    }

    // Global rate limit (prevent distributed brute force from one client)
    const globalCheck = globalLimiter.check('global');
    if (!globalCheck.allowed) {
        throw new Error(`Quá nhiều yêu cầu. Vui lòng thử lại sau ${globalCheck.retryIn}s.`);
    }

    // Per-username rate limit
    const perUserCheck = loginLimiter.check(username);
    if (!perUserCheck.allowed) {
        const mins = Math.ceil(perUserCheck.retryIn / 60);
        throw new Error(`Tài khoản bị tạm khóa do nhập sai nhiều lần. Thử lại sau ${mins} phút.`);
    }

    // Locate account + constant-time password comparison
    const account = ACCOUNTS_CONFIG.find(a => a.username === username);
    // Always hash both sides (even if username not found) to mitigate timing attacks
    const saltFor = account ? account.username : 'dummy-salt-' + username;
    const inputHash = await SecurityUtils.pbkdf2Hash(password, saltFor);
    const targetHash = account
        ? await SecurityUtils.pbkdf2Hash(account.password, saltFor)
        : await SecurityUtils.pbkdf2Hash('dummy-password-xyz', saltFor);

    if (!account || !SecurityUtils.constantTimeEqual(inputHash, targetHash)) {
        // brief artificial delay to slow brute force
        await new Promise(r => setTimeout(r, 400 + Math.random() * 200));
        throw new Error('Tài khoản hoặc mật khẩu không đúng.');
    }

    // Success: reset rate limit
    loginLimiter.reset(username);

    // Create session token bound to fingerprint
    const fingerprint = await SecurityUtils.generateFingerprint();
    const tokenData = `${username}|${Date.now()}|${crypto.getRandomValues(new Uint32Array(4)).join('-')}`;
    const token = await SecurityUtils.sha256Hex(tokenData);

    const session = {
        username,
        role: account.role,
        token,
        fingerprint,
        createdAt: Date.now(),
        lastActivity: Date.now(),
        expiresAt: Date.now() + SESSION_DURATION_MS
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
}

function logout() {
    localStorage.removeItem(SESSION_KEY);
    // Don't wipe user-specific data - keep it for next login
    location.replace('login.html');
}

function getSession() {
    try {
        const raw = localStorage.getItem(SESSION_KEY);
        if (!raw) return null;
        const s = JSON.parse(raw);
        if (!s || !s.token || !s.username) return null;

        // Expired?
        if (s.expiresAt < Date.now()) {
            localStorage.removeItem(SESSION_KEY);
            return null;
        }
        // Idle timeout?
        if (Date.now() - s.lastActivity > IDLE_TIMEOUT_MS) {
            localStorage.removeItem(SESSION_KEY);
            return null;
        }
        return s;
    } catch { return null; }
}

async function verifySession() {
    const s = getSession();
    if (!s) return null;
    // Check fingerprint (detects session hijack / different device)
    const current = await SecurityUtils.generateFingerprint();
    if (s.fingerprint !== current) {
        localStorage.removeItem(SESSION_KEY);
        return null;
    }
    return s;
}

function refreshSessionActivity() {
    const s = getSession();
    if (!s) return;
    s.lastActivity = Date.now();
    localStorage.setItem(SESSION_KEY, JSON.stringify(s));
}

async function requireAuth() {
    const s = await verifySession();
    if (!s) {
        location.replace('login.html');
        return null;
    }
    return s;
}

// Auto-refresh activity on user interaction
if (typeof window !== 'undefined') {
    ['click', 'keydown', 'mousemove', 'touchstart'].forEach(evt => {
        let lastRefresh = 0;
        window.addEventListener(evt, () => {
            const now = Date.now();
            if (now - lastRefresh > 60000) { // throttle to 1/min
                refreshSessionActivity();
                lastRefresh = now;
            }
        }, { passive: true });
    });
}

window.AuthModule = {
    login, logout, getSession, verifySession,
    requireAuth, refreshSessionActivity,
    ACCOUNTS_CONFIG
};
