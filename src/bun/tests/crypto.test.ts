import { describe, expect, test } from "bun:test";
import {
  decrypt,
  deriveKey,
  encrypt,
  newKDFParams,
  parseVaultFile,
  serializeVaultFile,
} from "../crypto";

describe("deriveKey", () => {
  const params = newKDFParams();

  test("returns a 32-byte Uint8Array", () => {
    const key = deriveKey("test-password", params);
    expect(key).toBeInstanceOf(Uint8Array);
    expect(key.length).toBe(32);
  });

  test("is deterministic (same password + salt → same key)", () => {
    const key1 = deriveKey("my-password", params);
    const key2 = deriveKey("my-password", params);
    expect(key1).toEqual(key2);
  });

  test("different salt produces different key", () => {
    const params2 = newKDFParams(); // different random salt
    const key1 = deriveKey("same-password", params);
    const key2 = deriveKey("same-password", params2);
    expect(key1).not.toEqual(key2);
  });

  test("different password produces different key", () => {
    const key1 = deriveKey("password-a", params);
    const key2 = deriveKey("password-b", params);
    expect(key1).not.toEqual(key2);
  });
});

describe("encrypt / decrypt", () => {
  const params = newKDFParams();
  const key = deriveKey("test-password", params);

  test("roundtrip: encrypt then decrypt returns original data", () => {
    const plaintext = new TextEncoder().encode("hello, dotlock vault!");
    const { iv, authTag, ciphertext } = encrypt(plaintext, key);
    const decrypted = decrypt(ciphertext, key, iv, authTag);
    expect(new TextDecoder().decode(decrypted)).toBe("hello, dotlock vault!");
  });

  test("ciphertext differs from plaintext", () => {
    const plaintext = new TextEncoder().encode("secret data");
    const { ciphertext } = encrypt(plaintext, key);
    expect(ciphertext).not.toEqual(plaintext);
  });

  test("decrypt with wrong key throws", () => {
    const plaintext = new TextEncoder().encode("secret");
    const { iv, authTag, ciphertext } = encrypt(plaintext, key);
    const wrongKey = deriveKey("wrong-password", params);
    expect(() => decrypt(ciphertext, wrongKey, iv, authTag)).toThrow();
  });

  test("decrypt with tampered ciphertext throws", () => {
    const plaintext = new TextEncoder().encode("secret");
    const { iv, authTag, ciphertext } = encrypt(plaintext, key);
    const tampered = new Uint8Array(ciphertext);
    tampered[0] ^= 0xff; // flip bits
    expect(() => decrypt(tampered, key, iv, authTag)).toThrow();
  });

  test("decrypt with tampered auth tag throws", () => {
    const plaintext = new TextEncoder().encode("secret");
    const { iv, authTag, ciphertext } = encrypt(plaintext, key);
    const tampered = new Uint8Array(authTag);
    tampered[0] ^= 0xff;
    expect(() => decrypt(ciphertext, key, iv, tampered)).toThrow();
  });

  test("each encrypt produces different IV and ciphertext", () => {
    const plaintext = new TextEncoder().encode("same data");
    const result1 = encrypt(plaintext, key);
    const result2 = encrypt(plaintext, key);
    expect(result1.iv).not.toEqual(result2.iv);
    expect(result1.ciphertext).not.toEqual(result2.ciphertext);
  });
});

describe("serializeVaultFile / parseVaultFile", () => {
  test("roundtrip: serialize then parse returns same fields", () => {
    const kdfParams = newKDFParams();
    const key = deriveKey("password", kdfParams);
    const plaintext = new TextEncoder().encode('{"test": true}');
    const { iv, authTag, ciphertext } = encrypt(plaintext, key);

    const blob = serializeVaultFile(kdfParams, iv, authTag, ciphertext);
    const parsed = parseVaultFile(blob);

    expect(parsed.version).toBe(1);
    expect(parsed.kdfParams).toEqual(kdfParams);
    expect(parsed.iv).toEqual(iv);
    expect(parsed.authTag).toEqual(authTag);
    expect(parsed.ciphertext).toEqual(ciphertext);
  });

  test("full end-to-end: serialize → parse → decrypt → original data", () => {
    const kdfParams = newKDFParams();
    const key = deriveKey("my-vault-password", kdfParams);
    const originalData = JSON.stringify({ repos: [], version: 1 });
    const plaintext = new TextEncoder().encode(originalData);
    const { iv, authTag, ciphertext } = encrypt(plaintext, key);
    const blob = serializeVaultFile(kdfParams, iv, authTag, ciphertext);

    const parsed = parseVaultFile(blob);
    const key2 = deriveKey("my-vault-password", parsed.kdfParams);
    const decrypted = decrypt(
      parsed.ciphertext,
      key2,
      parsed.iv,
      parsed.authTag,
    );
    expect(new TextDecoder().decode(decrypted)).toBe(originalData);
  });

  test("bad magic bytes throws", () => {
    const bad = new Uint8Array([
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    ]);
    expect(() => parseVaultFile(bad)).toThrow("bad magic bytes");
  });

  test("truncated file throws", () => {
    const tooShort = new Uint8Array([0x44, 0x4f, 0x54, 0x4c, 0x43, 0x4b]); // just magic, no version
    expect(() => parseVaultFile(tooShort)).toThrow("too small");
  });

  test("wrong version throws", () => {
    // Build a blob with version 99
    const magic = new Uint8Array([0x44, 0x4f, 0x54, 0x4c, 0x43, 0x4b]);
    const version = new Uint8Array(2);
    new DataView(version.buffer).setUint16(0, 99, false);
    const kdfLen = new Uint8Array(4);
    new DataView(kdfLen.buffer).setUint32(0, 2, false);
    const kdf = new Uint8Array([0x7b, 0x7d]); // "{}"
    const rest = new Uint8Array(28); // iv + authTag
    const blob = new Uint8Array(
      magic.length + version.length + kdfLen.length + kdf.length + rest.length,
    );
    let off = 0;
    blob.set(magic, off);
    off += magic.length;
    blob.set(version, off);
    off += version.length;
    blob.set(kdfLen, off);
    off += kdfLen.length;
    blob.set(kdf, off);
    off += kdf.length;
    blob.set(rest, off);
    expect(() => parseVaultFile(blob)).toThrow(
      "Unsupported .dotlock format version",
    );
  });

  test("truncated KDF params throws", () => {
    const magic = new Uint8Array([0x44, 0x4f, 0x54, 0x4c, 0x43, 0x4b]);
    const version = new Uint8Array(2);
    new DataView(version.buffer).setUint16(0, 1, false);
    const kdfLen = new Uint8Array(4);
    new DataView(kdfLen.buffer).setUint32(0, 999, false); // claims 999 bytes of KDF
    const blob = new Uint8Array(magic.length + version.length + kdfLen.length);
    blob.set(magic, 0);
    blob.set(version, magic.length);
    blob.set(kdfLen, magic.length + version.length);
    expect(() => parseVaultFile(blob)).toThrow("KDF params truncated");
  });
});
