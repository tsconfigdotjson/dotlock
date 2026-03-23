import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from "node:crypto";

// ── .dotlock binary format ──────────────────────────────────────────
// [6B magic "DOTLCK"] [2B version u16BE] [4B kdf-len u32BE] [kdf JSON]
// [12B IV] [16B auth-tag] [ciphertext…]

const MAGIC = new Uint8Array([0x44, 0x4f, 0x54, 0x4c, 0x43, 0x4b]); // "DOTLCK"
const FORMAT_VERSION = 1;
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

export type KDFParams = {
  algorithm: "scrypt";
  salt: string; // hex-encoded
  N: number;
  r: number;
  p: number;
};

const DEFAULT_KDF: Omit<KDFParams, "salt"> = {
  algorithm: "scrypt",
  N: 2 ** 17, // 131 072
  r: 8,
  p: 1,
};

/** Generate fresh KDF params with a random 32-byte salt. */
export function newKDFParams(): KDFParams {
  return {
    ...DEFAULT_KDF,
    salt: hexEncode(randomBytes(32)),
  };
}

/** Derive a 32-byte encryption key from a password + KDF params. */
export function deriveKey(password: string, params: KDFParams): Uint8Array {
  const salt = hexDecode(params.salt);
  const key = scryptSync(password, salt, 32, {
    N: params.N,
    r: params.r,
    p: params.p,
    maxmem: 256 * 1024 * 1024, // 256 MB — enough for N=2^17, r=8
  });
  return new Uint8Array(key as unknown as ArrayBuffer);
}

/** AES-256-GCM encrypt. Returns IV, auth tag, and ciphertext. */
export function encrypt(
  plaintext: Uint8Array,
  key: Uint8Array,
): { iv: Uint8Array; authTag: Uint8Array; ciphertext: Uint8Array } {
  const iv = new Uint8Array(randomBytes(IV_LENGTH));
  const cipher = createCipheriv("aes-256-gcm", key as never, iv);
  const part1 = cipher.update(plaintext as never);
  const part2 = cipher.final();
  const encrypted = concatBytes([
    new Uint8Array(part1 as unknown as ArrayBuffer),
    new Uint8Array(part2 as unknown as ArrayBuffer),
  ]);
  const tag = cipher.getAuthTag();
  return {
    iv,
    authTag: new Uint8Array(tag as unknown as ArrayBuffer),
    ciphertext: encrypted,
  };
}

/** AES-256-GCM decrypt. Throws on wrong key or tampered data. */
export function decrypt(
  ciphertext: Uint8Array,
  key: Uint8Array,
  iv: Uint8Array,
  authTag: Uint8Array,
): Uint8Array {
  const decipher = createDecipheriv("aes-256-gcm", key as never, iv);
  decipher.setAuthTag(authTag as never);
  const part1 = decipher.update(ciphertext as never);
  const part2 = decipher.final();
  return concatBytes([
    new Uint8Array(part1 as unknown as ArrayBuffer),
    new Uint8Array(part2 as unknown as ArrayBuffer),
  ]);
}

/** Assemble a .dotlock binary blob. */
export function serializeVaultFile(
  kdfParams: KDFParams,
  iv: Uint8Array,
  authTag: Uint8Array,
  ciphertext: Uint8Array,
): Uint8Array {
  const kdfJSON = new TextEncoder().encode(JSON.stringify(kdfParams));

  const kdfLen = new Uint8Array(4);
  new DataView(kdfLen.buffer).setUint32(0, kdfJSON.length, false); // big-endian

  const version = new Uint8Array(2);
  new DataView(version.buffer).setUint16(0, FORMAT_VERSION, false); // big-endian

  return concatBytes([
    MAGIC,
    version,
    kdfLen,
    kdfJSON,
    iv,
    authTag,
    ciphertext,
  ]);
}

/** Parse a .dotlock binary blob. Validates magic bytes and structure. */
export function parseVaultFile(data: Uint8Array): {
  version: number;
  kdfParams: KDFParams;
  iv: Uint8Array;
  authTag: Uint8Array;
  ciphertext: Uint8Array;
} {
  if (data.length < MAGIC.length + 2) {
    throw new Error("File too small to be a valid .dotlock vault");
  }

  const magic = data.subarray(0, MAGIC.length);
  if (!bytesEqual(magic, MAGIC)) {
    throw new Error("Not a valid .dotlock file (bad magic bytes)");
  }

  let offset = MAGIC.length;
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);

  const version = view.getUint16(offset, false);
  offset += 2;

  if (version !== FORMAT_VERSION) {
    throw new Error(
      `Unsupported .dotlock format version: ${version} (expected ${FORMAT_VERSION})`,
    );
  }

  if (data.length < offset + 4) {
    throw new Error("Truncated .dotlock file (missing KDF params length)");
  }
  const kdfLen = view.getUint32(offset, false);
  offset += 4;

  if (data.length < offset + kdfLen) {
    throw new Error("Truncated .dotlock file (KDF params truncated)");
  }
  const kdfJSON = data.subarray(offset, offset + kdfLen);
  offset += kdfLen;

  const kdfParams: KDFParams = JSON.parse(new TextDecoder().decode(kdfJSON));

  if (data.length < offset + IV_LENGTH) {
    throw new Error("Truncated .dotlock file (missing IV)");
  }
  const iv = data.subarray(offset, offset + IV_LENGTH);
  offset += IV_LENGTH;

  if (data.length < offset + AUTH_TAG_LENGTH) {
    throw new Error("Truncated .dotlock file (missing auth tag)");
  }
  const authTag = data.subarray(offset, offset + AUTH_TAG_LENGTH);
  offset += AUTH_TAG_LENGTH;

  const ciphertext = data.subarray(offset);

  return { version, kdfParams, iv, authTag, ciphertext };
}

// ── helpers ─────────────────────────────────────────────────────────

function concatBytes(arrays: Uint8Array[]): Uint8Array {
  const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

function bytesEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

function hexEncode(data: Uint8Array | Buffer): string {
  return Array.from(new Uint8Array(data as unknown as ArrayBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexDecode(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) {
    throw new Error("Invalid hex string: odd length");
  }
  if (!/^[0-9a-fA-F]*$/.test(hex)) {
    throw new Error("Invalid hex string: contains non-hex characters");
  }
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = Number.parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}
