import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { generateKeyPairSync } from "node:crypto";
import { existsSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  activateLicense,
  base32Decode,
  base32Encode,
  formatLicenseKey,
  generateLicenseKey,
  getLicenseStatus,
  getStoredLicense,
  setLicenseDir,
  storeLicense,
  validateLicenseKey,
} from "../license";

// Test key pair (matches the embedded public key in license.ts)
const TEST_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEIF8mlV8JQd26YUGAYQdoz1KTAXHtqGOWmA9o4HtWYtD/
-----END PRIVATE KEY-----`;

// A different key pair for "wrong key" tests
const WRONG_KEY_PAIR = generateKeyPairSync("ed25519", {
  privateKeyEncoding: { type: "pkcs8", format: "pem" },
  publicKeyEncoding: { type: "spki", format: "pem" },
});

// ── Crockford Base32 ────────────────────────────────────────────────

describe("Crockford Base32", () => {
  test("round-trips arbitrary bytes", () => {
    const data = new Uint8Array([0, 1, 127, 128, 255, 42, 99]);
    const encoded = base32Encode(data);
    const decoded = base32Decode(encoded);
    expect(decoded).toEqual(data);
  });

  test("round-trips empty data", () => {
    const data = new Uint8Array([]);
    expect(base32Decode(base32Encode(data))).toEqual(data);
  });

  test("round-trips single byte values", () => {
    for (const b of [0, 1, 127, 128, 255]) {
      const data = new Uint8Array([b]);
      expect(base32Decode(base32Encode(data))).toEqual(data);
    }
  });

  test("encode output contains only Crockford alphabet chars", () => {
    const data = new Uint8Array(256);
    for (let i = 0; i < 256; i++) {
      data[i] = i;
    }
    const encoded = base32Encode(data);
    expect(encoded).toMatch(/^[0-9A-HJ-NP-TV-Z]*$/);
  });

  test("round-trips large data (256 bytes)", () => {
    const data = new Uint8Array(256);
    for (let i = 0; i < 256; i++) {
      data[i] = i;
    }
    expect(base32Decode(base32Encode(data))).toEqual(data);
  });

  test("ignores dashes and whitespace on decode", () => {
    const data = new Uint8Array([1, 2, 3]);
    const encoded = base32Encode(data);
    const withDashes = `${encoded.slice(0, 2)}-${encoded.slice(2)}`;
    expect(base32Decode(withDashes)).toEqual(data);
    expect(base32Decode(`  ${encoded}  `)).toEqual(data);
    expect(base32Decode(`\t${encoded}\n`)).toEqual(data);
  });

  test("is case-insensitive", () => {
    const data = new Uint8Array([42, 99, 200]);
    const encoded = base32Encode(data);
    expect(base32Decode(encoded.toLowerCase())).toEqual(data);
  });

  test("handles visual confusions (O→0, I/L→1)", () => {
    expect(base32Decode("O")).toEqual(base32Decode("0"));
    expect(base32Decode("o")).toEqual(base32Decode("0"));
    expect(base32Decode("I")).toEqual(base32Decode("1"));
    expect(base32Decode("i")).toEqual(base32Decode("1"));
    expect(base32Decode("L")).toEqual(base32Decode("1"));
    expect(base32Decode("l")).toEqual(base32Decode("1"));
  });

  test("throws on invalid characters", () => {
    expect(() => base32Decode("!!!")).toThrow("Invalid Base32 character");
    expect(() => base32Decode("U")).toThrow("Invalid Base32 character");
  });
});

// ── License key format ──────────────────────────────────────────────

describe("formatLicenseKey", () => {
  test("groups into 5-char blocks with dashes", () => {
    expect(formatLicenseKey("ABCDEFGHIJKLMNO")).toBe("ABCDE-FGHIJ-KLMNO");
  });

  test("handles non-multiple-of-5 length", () => {
    expect(formatLicenseKey("ABCDEFGH")).toBe("ABCDE-FGH");
  });

  test("handles empty string", () => {
    expect(formatLicenseKey("")).toBe("");
  });

  test("handles exactly 5 chars", () => {
    expect(formatLicenseKey("ABCDE")).toBe("ABCDE");
  });
});

// ── License key generation + validation ─────────────────────────────

describe("license key generation and validation", () => {
  test("generates a valid license key", () => {
    const key = generateLicenseKey(42, TEST_PRIVATE_KEY);

    // Should contain only valid Crockford Base32 chars and dashes
    expect(key).toMatch(/^[0-9A-HJ-NP-TV-Z-]+$/);

    const result = validateLicenseKey(key);
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  test("different serials produce different keys", () => {
    const key1 = generateLicenseKey(1, TEST_PRIVATE_KEY);
    const key2 = generateLicenseKey(2, TEST_PRIVATE_KEY);
    expect(key1).not.toBe(key2);

    expect(validateLicenseKey(key1).valid).toBe(true);
    expect(validateLicenseKey(key2).valid).toBe(true);
  });

  test("serial 0 produces a valid key", () => {
    const key = generateLicenseKey(0, TEST_PRIVATE_KEY);
    expect(validateLicenseKey(key).valid).toBe(true);
  });

  test("serial 65535 (max) produces a valid key", () => {
    const key = generateLicenseKey(65535, TEST_PRIVATE_KEY);
    expect(validateLicenseKey(key).valid).toBe(true);
  });

  test("same serial is deterministic (Ed25519)", () => {
    const key1 = generateLicenseKey(123, TEST_PRIVATE_KEY);
    const key2 = generateLicenseKey(123, TEST_PRIVATE_KEY);
    expect(key1).toBe(key2);
  });

  test("key is 66 bytes raw (2 serial + 64 sig)", () => {
    const key = generateLicenseKey(1, TEST_PRIVATE_KEY);
    const raw = base32Decode(key);
    expect(raw.length).toBe(66);
  });

  test("key is case-insensitive on validation", () => {
    const key = generateLicenseKey(100, TEST_PRIVATE_KEY);
    expect(validateLicenseKey(key.toLowerCase()).valid).toBe(true);
  });

  test("key validates with extra whitespace and dashes", () => {
    const key = generateLicenseKey(200, TEST_PRIVATE_KEY);
    expect(validateLicenseKey(`  ${key}  `).valid).toBe(true);
    // Double-dashed
    expect(validateLicenseKey(key.replace(/-/g, "--")).valid).toBe(true);
  });
});

// ── Validation rejection cases ──────────────────────────────────────

describe("validateLicenseKey rejection", () => {
  test("rejects tampered key (single char flip)", () => {
    const key = generateLicenseKey(1, TEST_PRIVATE_KEY);
    const chars = key.split("");
    const idx = chars.findIndex((c) => c !== "-");
    chars[idx] = chars[idx] === "A" ? "B" : "A";
    const tampered = chars.join("");

    const result = validateLicenseKey(tampered);
    expect(result.valid).toBe(false);
  });

  test("returns 'Key too short' for short input", () => {
    const result = validateLicenseKey("AAAA");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Key too short");
  });

  test("returns 'Key too short' for empty input", () => {
    const result = validateLicenseKey("");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Key too short");
  });

  test("returns 'Invalid license key format' for non-base32 chars", () => {
    // 'U' is not in the Crockford Base32 alphabet
    const result = validateLicenseKey("U".repeat(106));
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Invalid license key format");
  });

  test("rejects key signed with a different private key", () => {
    const key = generateLicenseKey(1, WRONG_KEY_PAIR.privateKey as string);
    const result = validateLicenseKey(key);
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Invalid license key");
  });

  test("rejects a valid-length random base32 string", () => {
    // 106 random Crockford chars — overwhelmingly unlikely to be a valid sig
    const chars = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
    let random = "";
    for (let i = 0; i < 106; i++) {
      random += chars[Math.floor(Math.random() * chars.length)];
    }
    const result = validateLicenseKey(random);
    expect(result.valid).toBe(false);
  });
});

// ── Persistence (activateLicense / getLicenseStatus) ─────────────────

const TEST_DIR = join(tmpdir(), "dotlock-license-tests", `run-${Date.now()}`);

describe("license persistence", () => {
  beforeEach(() => {
    mkdirSync(TEST_DIR, { recursive: true });
    setLicenseDir(TEST_DIR);
  });

  afterEach(() => {
    setLicenseDir(null);
    if (existsSync(TEST_DIR)) {
      rmSync(TEST_DIR, { recursive: true, force: true });
    }
  });

  test("getLicenseStatus returns unlicensed when no file exists", async () => {
    const status = await getLicenseStatus();
    expect(status.licensed).toBe(false);
  });

  test("getStoredLicense returns null when no file exists", async () => {
    const stored = await getStoredLicense();
    expect(stored).toBeNull();
  });

  test("activateLicense succeeds with a valid key", async () => {
    const key = generateLicenseKey(1, TEST_PRIVATE_KEY);
    const result = await activateLicense(key);
    expect(result.success).toBe(true);
    expect(result.error).toBeUndefined();
  });

  test("activateLicense rejects an invalid key", async () => {
    const result = await activateLicense("INVALID-KEY-HERE");
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  test("activateLicense persists the key to disk", async () => {
    const key = generateLicenseKey(42, TEST_PRIVATE_KEY);
    await activateLicense(key);

    const stored = await getStoredLicense();
    expect(stored).not.toBeNull();
    expect(stored?.key).toBe(key);
    expect(stored?.activatedAt).toBeDefined();
  });

  test("getLicenseStatus returns licensed after activation", async () => {
    const key = generateLicenseKey(99, TEST_PRIVATE_KEY);
    await activateLicense(key);

    const status = await getLicenseStatus();
    expect(status.licensed).toBe(true);
  });

  test("getLicenseStatus returns unlicensed if stored key is corrupted", async () => {
    // Write a corrupted license file
    await storeLicense("CORRUPTED-GARBAGE");

    const status = await getLicenseStatus();
    expect(status.licensed).toBe(false);
  });

  test("storeLicense + getStoredLicense round-trip", async () => {
    const key = generateLicenseKey(7, TEST_PRIVATE_KEY);
    await storeLicense(key);

    const stored = await getStoredLicense();
    expect(stored).not.toBeNull();
    expect(stored?.key).toBe(key);
  });
});
