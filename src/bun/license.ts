import { sign, verify } from "node:crypto";
import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { atomicWrite } from "./atomicWrite";

// ── Embedded public key (Ed25519) ───────────────────────────────────
// The matching private key is used only by the CLI generator.
// Replace this if you regenerate the key pair.

const EMBEDDED_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEAbCdMKkRNS6EhWMiy5X4qFaCIDEux+mq+HMkadrOWQUg=
-----END PUBLIC KEY-----`;

// ── Crockford Base32 ────────────────────────────────────────────────

const CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

const DECODE_MAP = new Map<string, number>();
for (let i = 0; i < CROCKFORD.length; i++) {
  DECODE_MAP.set(CROCKFORD[i], i);
  DECODE_MAP.set(CROCKFORD[i].toLowerCase(), i);
}
// Common visual confusions
DECODE_MAP.set("O", 0);
DECODE_MAP.set("o", 0);
DECODE_MAP.set("I", 1);
DECODE_MAP.set("i", 1);
DECODE_MAP.set("L", 1);
DECODE_MAP.set("l", 1);

export function base32Encode(data: Uint8Array): string {
  let bits = 0;
  let value = 0;
  let result = "";

  for (const byte of data) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      bits -= 5;
      result += CROCKFORD[(value >> bits) & 0x1f];
    }
  }

  if (bits > 0) {
    result += CROCKFORD[(value << (5 - bits)) & 0x1f];
  }

  return result;
}

export function base32Decode(str: string): Uint8Array {
  const clean = str.replace(/[-\s]/g, "");
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];

  for (const char of clean) {
    const decoded = DECODE_MAP.get(char);
    if (decoded === undefined) {
      throw new Error(`Invalid Base32 character: ${char}`);
    }
    value = (value << 5) | decoded;
    bits += 5;
    if (bits >= 8) {
      bits -= 8;
      bytes.push((value >> bits) & 0xff);
    }
  }

  return new Uint8Array(bytes);
}

export function formatLicenseKey(base32: string): string {
  const groups: string[] = [];
  for (let i = 0; i < base32.length; i += 5) {
    groups.push(base32.slice(i, i + 5));
  }
  return groups.join("-");
}

// ── Key format ──────────────────────────────────────────────────────
// [2B serial BE] [64B Ed25519 signature] = 66 bytes total
// Encoded as Crockford Base32 → 106 chars → ~21 dash-separated groups
//
// The serial is a unique per-key identifier (up to 65 535 keys).
// No expiry, no feature flags — one-time purchase, valid forever.

const SERIAL_SIZE = 2;
const SIG_SIZE = 64;

// ── Signing (generator side) ────────────────────────────────────────

export function generateLicenseKey(
  serial: number,
  privateKeyPem: string,
): string {
  const payload = new Uint8Array(SERIAL_SIZE);
  new DataView(payload.buffer).setUint16(0, serial & 0xffff, false);

  const sig = sign(null, payload, privateKeyPem);

  const combined = new Uint8Array(SERIAL_SIZE + sig.length);
  combined.set(payload, 0);
  combined.set(new Uint8Array(sig), SERIAL_SIZE);

  return formatLicenseKey(base32Encode(combined));
}

// ── Validation (app side) ───────────────────────────────────────────

export type ValidationResult = {
  valid: boolean;
  error?: string;
};

export function validateLicenseKey(keyString: string): ValidationResult {
  try {
    const raw = base32Decode(keyString);

    if (raw.length < SERIAL_SIZE + SIG_SIZE) {
      return { valid: false, error: "Key too short" };
    }

    const payload = raw.subarray(0, SERIAL_SIZE);
    const signature = raw.subarray(SERIAL_SIZE, SERIAL_SIZE + SIG_SIZE);

    const isValid = verify(null, payload, EMBEDDED_PUBLIC_KEY, signature);
    if (!isValid) {
      return { valid: false, error: "Invalid license key" };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: "Invalid license key format" };
  }
}

// ── License persistence ─────────────────────────────────────────────

type StoredLicense = {
  key: string;
  activatedAt: string;
};

/** Override for testing — when set, used instead of ~/.dotlock. */
let dataDirOverride: string | null = null;

/** Set a custom data directory (for testing). Pass null to reset. */
export function setLicenseDir(dir: string | null): void {
  dataDirOverride = dir;
}

function getLicensePath(): string {
  const dir = dataDirOverride ?? join(homedir(), ".dotlock");
  return join(dir, "license.json");
}

export async function getStoredLicense(): Promise<StoredLicense | null> {
  const path = getLicensePath();
  try {
    const raw = await readFile(path, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function storeLicense(key: string): Promise<void> {
  const data: StoredLicense = {
    key,
    activatedAt: new Date().toISOString(),
  };
  await atomicWrite(getLicensePath(), JSON.stringify(data, null, 2));
}

// ── High-level API ──────────────────────────────────────────────────

export type LicenseInfo = {
  licensed: boolean;
};

export type ActivationResult = {
  success: boolean;
  error?: string;
};

export async function activateLicense(
  keyString: string,
): Promise<ActivationResult> {
  const result = validateLicenseKey(keyString);
  if (!result.valid) {
    return { success: false, error: result.error };
  }
  await storeLicense(keyString);
  return { success: true };
}

export async function getLicenseStatus(): Promise<LicenseInfo> {
  const stored = await getStoredLicense();
  if (!stored) {
    return { licensed: false };
  }

  const result = validateLicenseKey(stored.key);
  return { licensed: result.valid };
}
