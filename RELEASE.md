# Release Setup

## Prerequisites

### 1. Developer ID Application Certificate

A **Developer ID Application** certificate is required for distribution outside the App Store. The current "Apple Development" certificate only works for local development.

Create one in Xcode: Settings → Accounts → Manage Certificates → "+" → Developer ID Application.

### 2. Developer ID Provisioning Profile (Keychain Helper)

The keychain helper (`dev.dotlock.keychain-helper`) uses `kSecUseDataProtectionKeychain` and `keychain-access-groups`, which require a provisioning profile even for Developer ID distribution.

The current profile ("dotlock dev test") is a development profile limited to a single device. For distribution:

1. Go to [developer.apple.com](https://developer.apple.com) → Certificates, Identifiers & Profiles
2. Ensure App ID `dev.dotlock.keychain-helper` has the **Keychain Sharing** capability
3. Create a new **Developer ID** provisioning profile for that App ID
4. Download and replace `tools/keychain-helper.provisionprofile`

### 3. ElectroBun Environment Variables

Add these to `~/.zshrc` (or set them in CI):

```bash
export ELECTROBUN_DEVELOPER_ID="Lee Rosen (RQ4599WP39)"  # name from your Developer ID cert
export ELECTROBUN_TEAMID="RQ4599WP39"
export ELECTROBUN_APPLEID="your@email.com"
export ELECTROBUN_APPLEIDPASS="xxxx-xxxx-xxxx-xxxx"       # app-specific password from account.apple.com
```

Create the app-specific password at [account.apple.com](https://account.apple.com) → Sign-In and Security → App-Specific Passwords.

Alternatively, for CI (avoids 2FA issues), use App Store Connect API keys:

```bash
export ELECTROBUN_APPLEAPIKEYPATH="/path/to/AuthKey_XXXXXXXX.p8"
export ELECTROBUN_APPLEAPIKEY="XXXXXXXX"
export ELECTROBUN_APPLEAPIISSUER="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

`ELECTROBUN_DEVELOPER_ID` and `ELECTROBUN_TEAMID` are still required regardless of auth method.

## Building for Release

```bash
# Build the signed keychain helper first
bun run build:helpers

# Canary build (produces DMG + artifacts)
bun run build:canary
```

The `postBuild` hook automatically copies the signed keychain helper into the app bundle at `Contents/MacOS/dotlock-keychain.app/`.

## How Signing Works

- **Main app** (`dev.dotlock.app`): Signed and notarized by ElectroBun using the Developer ID Application certificate. No provisioning profile needed.
- **Keychain helper** (`dev.dotlock.keychain-helper`): Signed separately by `build-helpers.sh` with its own provisioning profile and entitlements (keychain-access-groups). Bundled into the main app during `postBuild`.
- Both the inner app bundle and the self-extracting wrapper are independently signed and notarized.
- `build-helpers.sh` prefers "Developer ID Application" certificates, falling back to "Apple Development" for local dev builds.
