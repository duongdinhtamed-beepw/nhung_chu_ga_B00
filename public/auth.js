// ============================================================
// auth.js - Server-backed authentication client
// Passwords are no longer stored in public JavaScript.
// ============================================================

async function login(username, password) {
    const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Đăng nhập thất bại.');
    return data.user;
}

async function logout() {
    await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
    }).catch(() => {});
    location.replace('/login.html');
}

async function getSession() {
    const res = await fetch('/api/auth/session', {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store'
    }).catch(() => null);
    if (!res || !res.ok) return null;
    const data = await res.json().catch(() => ({}));
    return data.session || null;
}

async function verifySession() {
    return getSession();
}

async function refreshSessionActivity() {
    return verifySession();
}

async function requireAuth() {
    const session = await verifySession();
    if (!session) {
        location.replace('/login.html');
        return null;
    }
    return session;
}

window.AuthModule = {
    login,
    logout,
    getSession,
    verifySession,
    requireAuth,
    refreshSessionActivity
};
