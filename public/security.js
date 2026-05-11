// ============================================================
// security.js - Security utilities
// XSS sanitize, input validation, SHA-256, rate limiting
// ============================================================

function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = String(str == null ? '' : str);
    return div.innerHTML;
}

function sanitizeFilename(name) {
    return String(name).replace(/[^\w\-. ()]/g, '_').slice(0, 200);
}

function sanitizeText(str, maxLen = 10000) {
    return String(str == null ? '' : str).slice(0, maxLen);
}

function validateInput(value, { maxLength = 1000, minLength = 0, pattern = null } = {}) {
    const v = String(value == null ? '' : value);
    if (v.length < minLength) return false;
    if (v.length > maxLength) return false;
    if (pattern && !pattern.test(v)) return false;
    return true;
}

// SHA-256 via SubtleCrypto
async function sha256Hex(text) {
    const buf = new TextEncoder().encode(String(text));
    const hash = await crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

// PBKDF2 hash for password (stronger than plain SHA-256)
async function pbkdf2Hash(password, salt, iterations = 100000) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        'raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']
    );
    const bits = await crypto.subtle.deriveBits(
        { name: 'PBKDF2', salt: enc.encode(salt), iterations, hash: 'SHA-256' },
        keyMaterial, 256
    );
    return Array.from(new Uint8Array(bits))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

// Rate limiter using localStorage (persists across reload)
class RateLimiter {
    constructor(storageKey, max, windowMs) {
        this.storageKey = storageKey;
        this.max = max;
        this.windowMs = windowMs;
    }
    _load() {
        try { return JSON.parse(localStorage.getItem(this.storageKey) || '{}'); }
        catch { return {}; }
    }
    _save(data) {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }
    check(key) {
        const now = Date.now();
        const data = this._load();
        const arr = (data[key] || []).filter(t => now - t < this.windowMs);
        if (arr.length >= this.max) {
            const oldest = Math.min(...arr);
            const retryIn = Math.ceil((oldest + this.windowMs - now) / 1000);
            return { allowed: false, retryIn };
        }
        arr.push(now);
        data[key] = arr;
        this._save(data);
        return { allowed: true };
    }
    reset(key) {
        const data = this._load();
        delete data[key];
        this._save(data);
    }
}

// Constant-time string comparison (prevent timing attacks)
function constantTimeEqual(a, b) {
    const sa = String(a);
    const sb = String(b);
    if (sa.length !== sb.length) return false;
    let result = 0;
    for (let i = 0; i < sa.length; i++) {
        result |= sa.charCodeAt(i) ^ sb.charCodeAt(i);
    }
    return result === 0;
}

// Simple CSRF-like token for forms
function generateCSRFToken() {
    const arr = new Uint8Array(32);
    crypto.getRandomValues(arr);
    return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Detect common attack patterns in input
function detectInjection(str) {
    const patterns = [
        /<script[\s>]/i,
        /javascript:/i,
        /on(click|error|load|mouseover)\s*=/i,
        /<iframe[\s>]/i,
        /<object[\s>]/i,
        /<embed[\s>]/i,
        /document\.cookie/i,
        /eval\s*\(/i
    ];
    return patterns.some(p => p.test(String(str)));
}

// Session fingerprinting (basic device binding)
async function generateFingerprint() {
    const parts = [
        navigator.userAgent,
        navigator.language,
        String(screen.width) + 'x' + String(screen.height),
        String(new Date().getTimezoneOffset())
    ];
    return (await sha256Hex(parts.join('|'))).slice(0, 32);
}

// Expose to window for cross-file access
window.SecurityUtils = {
    sanitizeHTML, sanitizeFilename, sanitizeText,
    validateInput, sha256Hex, pbkdf2Hash,
    RateLimiter, constantTimeEqual, generateCSRFToken,
    detectInjection, generateFingerprint
};

