#!/usr/bin/env bun
/**
 * License key CLI for dotlock.
 *
 * Usage:
 *   bun tools/license-cli.ts keygen                      Generate a new Ed25519 key pair
 *   bun tools/license-cli.ts generate [options]           Generate a license key
 *
 * Generate options:
 *   --private-key <path>   Path to private key PEM (default: ~/.dotlock/license-private.pem)
 *   --serial <number>      Serial number 0-65535 (default: random)
 */

import { generateKeyPairSync, randomInt } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { generateLicenseKey, validateLicenseKey } from "../src/bun/license";

const args = process.argv.slice(2);
const command = args[0];

function getArg(name: string, defaultValue?: string): string | undefined {
  const idx = args.indexOf(`--${name}`);
  if (idx === -1 || idx + 1 >= args.length) {
    return defaultValue;
  }
  return args[idx + 1];
}

function getKeyDir(): string {
  const dir = join(homedir(), ".dotlock");
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  return dir;
}

if (command === "keygen") {
  const { publicKey, privateKey } = generateKeyPairSync("ed25519", {
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });

  const dir = getKeyDir();
  const pubPath = join(dir, "license-public.pem");
  const privPath = join(dir, "license-private.pem");

  writeFileSync(pubPath, publicKey);
  writeFileSync(privPath, privateKey);

  console.log("Key pair generated:");
  console.log(`  Public key:  ${pubPath}`);
  console.log(`  Private key: ${privPath}`);
  console.log();
  console.log("Embed this public key in src/bun/license.ts:");
  console.log(publicKey);
} else if (command === "generate") {
  const privKeyPath =
    getArg("private-key") ?? join(homedir(), ".dotlock", "license-private.pem");

  if (!existsSync(privKeyPath)) {
    console.error(`Private key not found: ${privKeyPath}`);
    console.error('Run "bun tools/license-cli.ts keygen" first.');
    process.exit(1);
  }

  const privateKeyPem = readFileSync(privKeyPath, "utf-8");
  const serial = Number.parseInt(
    getArg("serial") ?? String(randomInt(1, 65536)),
    10,
  );

  const key = generateLicenseKey(serial, privateKeyPem);

  console.log("License key generated:");
  console.log();
  console.log(key);
  console.log();
  console.log(`  Serial: ${serial}`);

  // Validate to confirm round-trip
  const result = validateLicenseKey(key);
  console.log(
    `  Validation: ${result.valid ? "PASS" : `FAIL — ${result.error}`}`,
  );
} else {
  console.log("dotlock license key CLI");
  console.log();
  console.log("Commands:");
  console.log("  keygen              Generate a new Ed25519 key pair");
  console.log("  generate [options]  Generate a license key");
  console.log();
  console.log("Generate options:");
  console.log("  --private-key <path>  Path to private key PEM");
  console.log(
    "  --serial <number>     Serial number 0-65535 (default: random)",
  );
}
