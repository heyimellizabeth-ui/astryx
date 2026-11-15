import {describe, expect, it} from 'vitest';
import {ADMIN_PASSWORD, hashPassword, verifyAdminPassword, verifyPassword, type PasswordRecord} from '../src/lib/auth';

const toBase64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes));

async function recordFor(password: string): Promise<PasswordRecord> {
  const salt = new Uint8Array(new ArrayBuffer(16)).map((_, i) => i * 7 + 3);
  const iterations = 1000;
  return {salt: toBase64(salt), iterations, hash: toBase64(await hashPassword(password, salt, iterations))};
}

describe('password check', () => {
  it('accepts the password a record was made from and nothing else', async () => {
    const record = await recordFor('correct horse battery staple');
    expect(await verifyPassword('correct horse battery staple', record)).toBe(true);
    expect(await verifyPassword('correct horse battery stapl', record)).toBe(false);
    expect(await verifyPassword('', record)).toBe(false);
  });

  it('depends on the salt, so equal passwords do not share a hash', async () => {
    const saltA = new Uint8Array(new ArrayBuffer(16)).fill(1);
    const saltB = new Uint8Array(new ArrayBuffer(16)).fill(2);
    const hashA = toBase64(await hashPassword('same password', saltA, 1000));
    const hashB = toBase64(await hashPassword('same password', saltB, 1000));
    expect(hashA).not.toBe(hashB);
    expect(await verifyPassword('same password', {salt: toBase64(saltB), iterations: 1000, hash: hashA})).toBe(false);
  });

  it('rejects a record whose hash has the wrong length', async () => {
    const record = await recordFor('pw');
    expect(await verifyPassword('pw', {...record, hash: toBase64(new Uint8Array(8))})).toBe(false);
  });

  it('keeps the administrator password as a slow salted hash, never plain text', async () => {
    expect(ADMIN_PASSWORD.iterations).toBeGreaterThanOrEqual(100_000);
    expect(atob(ADMIN_PASSWORD.hash)).toHaveLength(32);
    expect(atob(ADMIN_PASSWORD.salt).length).toBeGreaterThanOrEqual(16);
    expect(await verifyAdminPassword('not the password')).toBe(false);
    expect(await verifyAdminPassword('')).toBe(false);
  });
});
