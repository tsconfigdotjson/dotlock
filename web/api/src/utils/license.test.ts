import { describe, expect, test } from "bun:test";
import { generateKeyPairSync } from "node:crypto";
import { validateLicenseKey } from "../../../../src/bun/license";
import { base32Encode, formatLicenseKey, generateLicenseKey } from "./license";

// Same test private key used in the Bun-side tests — matches the embedded public key
const TEST_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEIF8mlV8JQd26YUGAYQdoz1KTAXHtqGOWmA9o4HtWYtD/
-----END PRIVATE KEY-----`;

// A different key pair for "wrong key" tests
const WRONG_KEY_PAIR = generateKeyPairSync("ed25519", {
  privateKeyEncoding: { type: "pkcs8", format: "pem" },
  publicKeyEncoding: { type: "spki", format: "pem" },
});

// ── Pure helpers ────────────────────────────────────────────────────

describe("base32Encode", () => {
  test("output contains only Crockford alphabet chars", () => {
    const data = new Uint8Array(256);
    for (let i = 0; i < 256; i++) {
      data[i] = i;
    }
    expect(base32Encode(data)).toMatch(/^[0-9A-HJ-NP-TV-Z]*$/);
  });

  test("empty input produces empty output", () => {
    expect(base32Encode(new Uint8Array([]))).toBe("");
  });
});

describe("formatLicenseKey", () => {
  test("groups into 5-char blocks with dashes", () => {
    expect(formatLicenseKey("ABCDEFGHIJKLMNO")).toBe("ABCDE-FGHIJ-KLMNO");
  });

  test("handles non-multiple-of-5 length", () => {
    expect(formatLicenseKey("ABCDEFGH")).toBe("ABCDE-FGH");
  });
});

// ── Key generation (Web Crypto) ─────────────────────────────────────

describe("generateLicenseKey (Web Crypto)", () => {
  test("generates a formatted base32 key", async () => {
    const key = await generateLicenseKey(42, TEST_PRIVATE_KEY);
    expect(key).toMatch(/^[0-9A-HJ-NP-TV-Z-]+$/);
  });

  test("different serials produce different keys", async () => {
    const key1 = await generateLicenseKey(1, TEST_PRIVATE_KEY);
    const key2 = await generateLicenseKey(2, TEST_PRIVATE_KEY);
    expect(key1).not.toBe(key2);
  });

  test("same serial is deterministic (Ed25519)", async () => {
    const key1 = await generateLicenseKey(123, TEST_PRIVATE_KEY);
    const key2 = await generateLicenseKey(123, TEST_PRIVATE_KEY);
    expect(key1).toBe(key2);
  });
});

// ── Cross-compatibility with Bun-side validator ─────────────────────

describe("Web Crypto → Node crypto cross-validation", () => {
  test("API-generated key is valid per Bun-side validateLicenseKey", async () => {
    const key = await generateLicenseKey(42, TEST_PRIVATE_KEY);
    const result = validateLicenseKey(key);
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  test("serial 0 cross-validates", async () => {
    const key = await generateLicenseKey(0, TEST_PRIVATE_KEY);
    expect(validateLicenseKey(key).valid).toBe(true);
  });

  test("serial 65535 (max) cross-validates", async () => {
    const key = await generateLicenseKey(65535, TEST_PRIVATE_KEY);
    expect(validateLicenseKey(key).valid).toBe(true);
  });

  test("key signed with wrong private key is rejected", async () => {
    const key = await generateLicenseKey(
      1,
      WRONG_KEY_PAIR.privateKey as string,
    );
    const result = validateLicenseKey(key);
    expect(result.valid).toBe(false);
  });
});
