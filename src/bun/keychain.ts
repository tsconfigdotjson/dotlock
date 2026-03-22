/**
 * macOS Keychain integration with Touch ID via the Security framework.
 *
 * Uses inline Swift scripts executed via `swift -e` to call SecItemAdd/
 * SecItemCopyMatching/SecItemDelete with biometric access control.
 * This ensures Touch ID is required to retrieve the stored password.
 */

const SERVICE = "dev.dotlock.vault";

/** Store a vault password in Keychain with Touch ID protection. */
export async function storePassword(
  vaultPath: string,
  password: string,
): Promise<boolean> {
  // First delete any existing entry (SecItemAdd fails on duplicates)
  await deletePassword(vaultPath);

  const swift = `
import Foundation
import Security

let service = "${escapeSwift(SERVICE)}"
let account = "${escapeSwift(vaultPath)}"
let passwordData = "${escapeSwift(password)}".data(using: .utf8)!

guard let access = SecAccessControlCreateWithFlags(
    nil,
    kSecAttrAccessibleWhenUnlockedThisDeviceOnly,
    .biometryCurrentSet,
    nil
) else {
    exit(1)
}

let query: [String: Any] = [
    kSecClass as String: kSecClassGenericPassword,
    kSecAttrService as String: service,
    kSecAttrAccount as String: account,
    kSecValueData as String: passwordData,
    kSecAttrAccessControl as String: access,
]

let status = SecItemAdd(query as CFDictionary, nil)
exit(status == errSecSuccess ? 0 : 1)
`;

  return await runSwift(swift);
}

/** Retrieve a vault password from Keychain. Triggers Touch ID prompt. */
export async function retrievePassword(
  vaultPath: string,
): Promise<string | null> {
  const swift = `
import Foundation
import Security
import LocalAuthentication

let service = "${escapeSwift(SERVICE)}"
let account = "${escapeSwift(vaultPath)}"

let context = LAContext()
context.localizedReason = "Unlock your dotlock vault"

let query: [String: Any] = [
    kSecClass as String: kSecClassGenericPassword,
    kSecAttrService as String: service,
    kSecAttrAccount as String: account,
    kSecReturnData as String: true,
    kSecMatchLimit as String: kSecMatchLimitOne,
    kSecUseAuthenticationContext as String: context,
]

var result: AnyObject?
let status = SecItemCopyMatching(query as CFDictionary, &result)

if status == errSecSuccess, let data = result as? Data, let password = String(data: data, encoding: .utf8) {
    print(password, terminator: "")
    exit(0)
} else {
    exit(1)
}
`;

  const proc = Bun.spawn(["swift", "-e", swift], {
    stdout: "pipe",
    stderr: "pipe",
  });
  const code = await proc.exited;
  if (code !== 0) {
    return null;
  }
  const text = await new Response(proc.stdout).text();
  return text || null;
}

/** Delete a vault password from Keychain. */
export async function deletePassword(vaultPath: string): Promise<boolean> {
  const swift = `
import Foundation
import Security

let service = "${escapeSwift(SERVICE)}"
let account = "${escapeSwift(vaultPath)}"

let query: [String: Any] = [
    kSecClass as String: kSecClassGenericPassword,
    kSecAttrService as String: service,
    kSecAttrAccount as String: account,
]

let status = SecItemDelete(query as CFDictionary)
exit(status == errSecSuccess || status == errSecItemNotFound ? 0 : 1)
`;

  return await runSwift(swift);
}

/** Check if a password is stored for a vault (without triggering Touch ID). */
export async function hasStoredPassword(
  vaultPath: string,
): Promise<boolean> {
  const swift = `
import Foundation
import Security

let service = "${escapeSwift(SERVICE)}"
let account = "${escapeSwift(vaultPath)}"

let query: [String: Any] = [
    kSecClass as String: kSecClassGenericPassword,
    kSecAttrService as String: service,
    kSecAttrAccount as String: account,
    kSecReturnAttributes as String: true,
    kSecMatchLimit as String: kSecMatchLimitOne,
    kSecUseAuthenticationUI as String: kSecUseAuthenticationUISkip,
]

var result: AnyObject?
let status = SecItemCopyMatching(query as CFDictionary, &result)
// errSecInteractionNotAllowed means item exists but needs auth (Touch ID)
exit(status == errSecSuccess || status == errSecInteractionNotAllowed ? 0 : 1)
`;

  return await runSwift(swift);
}

// ── helpers ─────────────────────────────────────────────────────────

async function runSwift(code: string): Promise<boolean> {
  try {
    const proc = Bun.spawn(["swift", "-e", code], {
      stdout: "pipe",
      stderr: "pipe",
    });
    const exitCode = await proc.exited;
    return exitCode === 0;
  } catch {
    return false;
  }
}

/** Escape a string for embedding in a Swift string literal. */
function escapeSwift(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\0/g, "\\0");
}
