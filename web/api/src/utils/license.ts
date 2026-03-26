// Ed25519 license key generation for Cloudflare Workers (Web Crypto API)
// Base32 encode + format copied from src/bun/license.ts

const CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

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

export function formatLicenseKey(base32: string): string {
  const groups: string[] = [];
  for (let i = 0; i < base32.length; i += 5) {
    groups.push(base32.slice(i, i + 5));
  }
  return groups.join("-");
}

// Key format: [2B serial BE] [64B Ed25519 signature] = 66 bytes total
const SERIAL_SIZE = 2;

async function importPrivateKey(pem: string): Promise<CryptoKey> {
  const b64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\\n/g, "")
    .replace(/\s/g, "");
  const binaryString = atob(b64);
  const der = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    der[i] = binaryString.charCodeAt(i);
  }
  return crypto.subtle.importKey("pkcs8", der, { name: "Ed25519" }, false, [
    "sign",
  ]);
}

export async function generateLicenseKey(
  serial: number,
  privateKeyPem: string,
): Promise<string> {
  const payload = new Uint8Array(SERIAL_SIZE);
  new DataView(payload.buffer).setUint16(0, serial & 0xffff, false);

  const privateKey = await importPrivateKey(privateKeyPem);
  const sigBuffer = await crypto.subtle.sign("Ed25519", privateKey, payload);
  const sig = new Uint8Array(sigBuffer);

  const combined = new Uint8Array(SERIAL_SIZE + sig.length);
  combined.set(payload, 0);
  combined.set(sig, SERIAL_SIZE);

  return formatLicenseKey(base32Encode(combined));
}
