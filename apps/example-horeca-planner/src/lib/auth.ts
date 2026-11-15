/**
 * Administrator sign-in.
 *
 * This app runs only in the browser, so this check is a gate against casual edits, not security:
 * the hash below ships to every visitor and a short password can be cracked offline. Real access
 * control needs a server. The password itself is never stored here, only a salted PBKDF2 hash.
 */

export interface PasswordRecord {
  /** Base64 salt. */
  salt: string;
  iterations: number;
  /** Base64 PBKDF2-SHA-256 output, 32 bytes. */
  hash: string;
}

export const ADMIN_PASSWORD: PasswordRecord = {
  salt: 'XGA6cWwQf2f0g4B3Gyuh6Q==',
  iterations: 210000,
  hash: 'Apy3Uyg54MhBqAKcFS+YeaJKoH3i/rDIublEwd0oAsA=',
};

/** True when the browser can run the hash. WebCrypto needs https or localhost. */
export function canVerify(): boolean {
  return typeof crypto !== 'undefined' && Boolean(crypto.subtle);
}

function fromBase64(value: string): Uint8Array<ArrayBuffer> {
  const raw = atob(value);
  const bytes = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return bytes;
}

export async function hashPassword(password: string, salt: Uint8Array<ArrayBuffer>, iterations: number): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({name: 'PBKDF2', hash: 'SHA-256', salt, iterations}, key, 256);
  return new Uint8Array(bits);
}

export async function verifyPassword(password: string, record: PasswordRecord): Promise<boolean> {
  const expected = fromBase64(record.hash);
  const actual = await hashPassword(password, fromBase64(record.salt), record.iterations);
  if (actual.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < actual.length; i++) diff |= actual[i] ^ expected[i];
  return diff === 0;
}

export function verifyAdminPassword(password: string): Promise<boolean> {
  return verifyPassword(password, ADMIN_PASSWORD);
}

export const MAX_ATTEMPTS = 5;
export const LOCKOUT_SECONDS = 30;
