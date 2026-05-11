// ============================================================
// storage.js - Encrypted per-user storage + shared storage
// Uses AES-GCM for per-user data encryption
// ============================================================

async function _deriveKey(passphrase, saltStr = 'b00-aes-salt') {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        'raw', enc.encode(passphrase), 'PBKDF2', false, ['deriveKey']
    );
    return crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt: enc.encode(saltStr), iterations: 120000, hash: 'SHA-256' },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false, ['encrypt', 'decrypt']
    );
}

async function encryptString(plaintext, passphrase) {
    const key = await _deriveKey(passphrase);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder().encode(plaintext);
    const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc);
    const bytes = new Uint8Array(iv.length + cipher.byteLength);
    bytes.set(iv, 0);
    bytes.set(new Uint8Array(cipher), iv.length);
    let s = '';
    for (const b of bytes) s += String.fromCharCode(b);
    return btoa(s);
}

async function decryptString(b64, passphrase) {
    try {
        const key = await _deriveKey(passphrase);
        const bin = atob(b64);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        const iv = bytes.slice(0, 12);
        const data = bytes.slice(12);
        const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
        return new TextDecoder().decode(plain);
    } catch { return null; }
}

// Per-user encrypted key-value store
class UserStore {
    constructor(username) {
        this.ns = `b00_user_${username}`;
        this.passphrase = `b00-user-${username}-2026`;
    }
    async set(key, value) {
        const str = JSON.stringify(value);
        const enc = await encryptString(str, this.passphrase);
        localStorage.setItem(`${this.ns}:${key}`, enc);
    }
    async get(key, defaultValue = null) {
        const raw = localStorage.getItem(`${this.ns}:${key}`);
        if (!raw) return defaultValue;
        const str = await decryptString(raw, this.passphrase);
        if (str == null) return defaultValue;
        try { return JSON.parse(str); } catch { return defaultValue; }
    }
    async remove(key) {
        localStorage.removeItem(`${this.ns}:${key}`);
    }
    async listKeys() {
        const prefix = `${this.ns}:`;
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && k.startsWith(prefix)) keys.push(k.slice(prefix.length));
        }
        return keys;
    }
}

// Shared storage (for question bank + exam repo) - NOT encrypted, shared demo
// In production this should be a server-side DB.
class SharedStore {
    constructor(key) { this.key = key; }
    get(defaultValue = []) {
        try { return JSON.parse(localStorage.getItem(this.key) || 'null') ?? defaultValue; }
        catch { return defaultValue; }
    }
    set(value) {
        try {
            localStorage.setItem(this.key, JSON.stringify(value));
            return true;
        } catch (e) {
            // storage quota exceeded
            console.error('Storage quota exceeded:', e);
            return false;
        }
    }
    push(item) {
        const arr = this.get([]);
        arr.push(item);
        return this.set(arr);
    }
}

window.StorageModule = {
    UserStore, SharedStore,
    encryptString, decryptString
};

