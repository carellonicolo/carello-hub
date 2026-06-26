/**
 * Sessione admin basata su cookie firmato (HMAC-SHA256).
 *
 * carello-hub non usa Cloudflare Access: l'admin si autentica con una password
 * (secret ADMIN_PASSWORD). Dopo il login emettiamo un cookie `ch_session` la cui
 * integrità è garantita da una firma HMAC con SESSION_SECRET. Il cookie contiene
 * solo una scadenza: chi possiede un cookie valido e non scaduto è l'admin.
 *
 * Il file ha prefisso "_" quindi NON è instradato come endpoint: è un modulo di
 * utilità importato da _middleware.ts e dalle route di auth.
 */

export const SESSION_COOKIE = "ch_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 giorni

function bytesToBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToBytes(b64url: string): Uint8Array {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(b64url.length / 4) * 4, "=");
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function hmac(secret: string, data: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return new Uint8Array(sig);
}

/** Confronto a tempo costante per evitare timing attack sulla firma. */
function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

/** Crea il valore del cookie di sessione (payload + firma). */
export async function createSessionToken(secret: string, ttlSeconds = SESSION_TTL_SECONDS): Promise<string> {
  const payload = { exp: Math.floor(Date.now() / 1000) + ttlSeconds };
  const payloadB64 = bytesToBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const sig = await hmac(secret, payloadB64);
  return `${payloadB64}.${bytesToBase64Url(sig)}`;
}

/** Verifica un token di sessione; true se firma valida e non scaduto. */
export async function verifySessionToken(secret: string, token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payloadB64, sigB64] = parts;
  try {
    const expected = await hmac(secret, payloadB64);
    if (!timingSafeEqual(base64UrlToBytes(sigB64), expected)) return false;
    const payload = JSON.parse(new TextDecoder().decode(base64UrlToBytes(payloadB64))) as { exp?: number };
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return false;
    return true;
  } catch {
    return false;
  }
}

/** Estrae un cookie dall'header Cookie. */
export function readCookie(request: Request, name: string): string | undefined {
  const header = request.headers.get("Cookie");
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return v.join("=");
  }
  return undefined;
}

/** Header Set-Cookie per impostare o cancellare il cookie di sessione. */
export function sessionCookieHeader(value: string | null): string {
  const base = `${SESSION_COOKIE}=${value ?? ""}; Path=/; HttpOnly; Secure; SameSite=Lax`;
  return value === null ? `${base}; Max-Age=0` : `${base}; Max-Age=${SESSION_TTL_SECONDS}`;
}
