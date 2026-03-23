/**
 * macOS Keychain + Touch ID integration via a signed helper binary.
 *
 * The helper at dotlock-keychain.app/Contents/MacOS/dotlock uses
 * SecAccessControl with .biometryCurrentSet for OS-enforced Touch ID.
 * It must be compiled and signed via tools/build-helpers.sh.
 */

import { existsSync } from "node:fs";
import { dirname, join } from "node:path";

const SERVICE = "dev.dotlock.vault";

function getHelperPath(): string | null {
  const helperRelative = join(
    "dotlock-keychain.app",
    "Contents",
    "MacOS",
    "dotlock",
  );

  // Walk up from import.meta.dir to find project root (contains package.json)
  let dir = import.meta.dir;
  for (let i = 0; i < 10; i++) {
    if (existsSync(join(dir, "package.json"))) {
      const p = join(dir, "build", "helpers", helperRelative);
      if (existsSync(p)) {
        return p;
      }
    }
    const parent = dirname(dir);
    if (parent === dir) {
      break;
    }
    dir = parent;
  }

  // Bundled: next to the main executable in Contents/MacOS/
  const bundled = join(dirname(process.execPath), helperRelative);
  if (existsSync(bundled)) {
    return bundled;
  }

  return null;
}

/** Store a vault password in Keychain with Touch ID protection. */
export async function storePassword(
  vaultPath: string,
  password: string,
): Promise<boolean> {
  const helper = getHelperPath();
  if (!helper) {
    return false;
  }

  try {
    const proc = Bun.spawn([helper, "store", SERVICE, vaultPath], {
      stdin: "pipe",
      stdout: "pipe",
      stderr: "pipe",
    });
    proc.stdin.write(password);
    proc.stdin.end();
    const code = await proc.exited;
    return code === 0;
  } catch {
    return false;
  }
}

/** Retrieve a vault password from Keychain. Triggers Touch ID prompt. */
export async function retrievePassword(
  vaultPath: string,
): Promise<string | null> {
  const helper = getHelperPath();
  if (!helper) {
    return null;
  }

  try {
    const proc = Bun.spawn([helper, "retrieve", SERVICE, vaultPath], {
      stdout: "pipe",
      stderr: "pipe",
    });
    const code = await proc.exited;
    if (code !== 0) {
      return null;
    }
    const text = await new Response(proc.stdout).text();
    return text || null;
  } catch {
    return null;
  }
}

/** Delete a vault password from Keychain. */
export async function deletePassword(vaultPath: string): Promise<boolean> {
  const helper = getHelperPath();
  if (!helper) {
    return false;
  }

  try {
    const proc = Bun.spawn([helper, "delete", SERVICE, vaultPath], {
      stdout: "pipe",
      stderr: "pipe",
    });
    const code = await proc.exited;
    return code === 0;
  } catch {
    return false;
  }
}

/**
 * Check if a password is stored for a vault.
 *
 * The data protection keychain with biometric ACL doesn't support existence
 * checks without authentication. We track this in recentVaults metadata instead.
 * This function always returns false — use VaultMeta.keychainEnabled.
 */
export async function hasStoredPassword(_vaultPath: string): Promise<boolean> {
  return false;
}

/** Returns true if the signed keychain helper binary is available. */
export function isHelperAvailable(): boolean {
  return getHelperPath() !== null;
}
