//
// dotlock keychain helper
//
// A signed helper binary that stores and retrieves passwords in the macOS
// Keychain with biometric (Touch ID) access control.
//
// Usage:
//   keychain-helper store   <service> <account>   (reads password from stdin)
//   keychain-helper retrieve <service> <account>   (prints password to stdout)
//   keychain-helper delete  <service> <account>
//   keychain-helper check   <service> <account>    (exit 0 if entry exists)
//

import Foundation
import Security
import LocalAuthentication

// Must match the keychain-access-groups entitlement
let keychainAccessGroup = "RQ4599WP39.dev.dotlock.keychain-helper"

// MARK: - Helpers

func fail(_ message: String) -> Never {
    fputs("error: \(message)\n", stderr)
    exit(1)
}

func readStdin() -> String {
    var input = ""
    while let line = readLine(strippingNewline: false) {
        input += line
    }
    // Strip single trailing newline if present (common from echo/piping)
    if input.hasSuffix("\n") {
        input.removeLast()
    }
    return input
}

// MARK: - Keychain Operations

func store(service: String, account: String) {
    let password = readStdin()
    guard !password.isEmpty else { fail("no password provided on stdin") }
    guard let data = password.data(using: .utf8) else { fail("invalid utf8") }

    // Delete any existing entry first (SecItemAdd fails on duplicates)
    let deleteQuery: [String: Any] = [
        kSecClass as String: kSecClassGenericPassword,
        kSecAttrService as String: service,
        kSecAttrAccount as String: account,
        kSecAttrAccessGroup as String: keychainAccessGroup,
        kSecUseDataProtectionKeychain as String: true,
    ]
    SecItemDelete(deleteQuery as CFDictionary)

    // Create access control requiring biometry
    var error: Unmanaged<CFError>?
    guard let access = SecAccessControlCreateWithFlags(
        nil,
        kSecAttrAccessibleWhenUnlockedThisDeviceOnly,
        .biometryCurrentSet,
        &error
    ) else {
        let msg = error?.takeRetainedValue().localizedDescription ?? "unknown"
        fail("SecAccessControlCreateWithFlags: \(msg)")
    }

    let addQuery: [String: Any] = [
        kSecClass as String: kSecClassGenericPassword,
        kSecAttrService as String: service,
        kSecAttrAccount as String: account,
        kSecValueData as String: data,
        kSecAttrAccessControl as String: access,
        kSecAttrAccessGroup as String: keychainAccessGroup,
    ]

    let status = SecItemAdd(addQuery as CFDictionary, nil)
    if status != errSecSuccess {
        fail("SecItemAdd: OSStatus \(status)")
    }
}

func retrieve(service: String, account: String) {
    let context = LAContext()
    context.localizedReason = "Access your dotlock vault password"

    let query: [String: Any] = [
        kSecClass as String: kSecClassGenericPassword,
        kSecAttrService as String: service,
        kSecAttrAccount as String: account,
        kSecReturnData as String: true,
        kSecMatchLimit as String: kSecMatchLimitOne,
        kSecUseAuthenticationContext as String: context,
        kSecAttrAccessGroup as String: keychainAccessGroup,
        kSecUseDataProtectionKeychain as String: true,
    ]

    var result: AnyObject?
    let status = SecItemCopyMatching(query as CFDictionary, &result)

    if status == errSecItemNotFound {
        fail("not found")
    } else if status == errSecUserCanceled || status == errSecAuthFailed {
        fail("auth cancelled or failed (OSStatus \(status))")
    } else if status != errSecSuccess {
        fail("SecItemCopyMatching: OSStatus \(status)")
    }

    guard let data = result as? Data,
          let password = String(data: data, encoding: .utf8) else {
        fail("failed to decode password data")
    }

    // Print password to stdout without trailing newline
    print(password, terminator: "")
}

func delete(service: String, account: String) {
    let query: [String: Any] = [
        kSecClass as String: kSecClassGenericPassword,
        kSecAttrService as String: service,
        kSecAttrAccount as String: account,
        kSecAttrAccessGroup as String: keychainAccessGroup,
        kSecUseDataProtectionKeychain as String: true,
    ]

    let status = SecItemDelete(query as CFDictionary)
    if status != errSecSuccess && status != errSecItemNotFound {
        fail("SecItemDelete: OSStatus \(status)")
    }
}

func check(service: String, account: String) {
    // The data protection keychain with biometric ACL does not allow existence
    // checks without authentication. This command is kept as a no-op that always
    // returns 1. The app tracks keychain-enabled vaults in its own config instead.
    exit(1)
}

// MARK: - Main

let args = CommandLine.arguments
guard args.count >= 4 else {
    fputs("usage: keychain-helper <store|retrieve|delete|check> <service> <account>\n", stderr)
    exit(1)
}

let command = args[1]
let service = args[2]
let account = args[3]

switch command {
case "store":
    store(service: service, account: account)
case "retrieve":
    retrieve(service: service, account: account)
case "delete":
    delete(service: service, account: account)
case "check":
    check(service: service, account: account)
default:
    fail("unknown command: \(command)")
}
