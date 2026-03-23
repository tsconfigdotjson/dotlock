#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
OUT_DIR="$PROJECT_DIR/build/helpers"
SWIFT_SRC="$SCRIPT_DIR/keychain-helper.swift"
PROFILE="$SCRIPT_DIR/keychain-helper.provisionprofile"
APP_BUNDLE="$OUT_DIR/dotlock-keychain.app"

BUNDLE_ID="dev.dotlock.keychain-helper"

# ── Validate inputs ──────────────────────────────────────────────────

if [ ! -f "$PROFILE" ]; then
  echo "[build-helpers] ERROR: Provisioning profile not found at $PROFILE"
  echo "[build-helpers] Download it from developer.apple.com and place it there."
  exit 1
fi

# Find signing identity
IDENTITY=$(security find-identity -v -p codesigning | grep "Apple Development" | head -1 | sed 's/.*"\(.*\)"/\1/')
if [ -z "$IDENTITY" ]; then
  echo "[build-helpers] ERROR: No Apple Development certificate found."
  exit 1
fi

# Extract team ID from the provisioning profile
TEAM_ID=$(security cms -D -i "$PROFILE" 2>/dev/null | grep -A2 "<key>TeamIdentifier</key>" | grep "<string>" | sed 's/.*<string>\(.*\)<\/string>/\1/' | head -1)
if [ -z "$TEAM_ID" ]; then
  echo "[build-helpers] ERROR: Could not extract team ID from provisioning profile."
  exit 1
fi

echo "[build-helpers] Identity: $IDENTITY"
echo "[build-helpers] Team ID: $TEAM_ID"
echo "[build-helpers] Bundle ID: $BUNDLE_ID"

# ── Clean ────────────────────────────────────────────────────────────

rm -rf "$APP_BUNDLE"
mkdir -p "$APP_BUNDLE/Contents/MacOS"

# ── Compile ──────────────────────────────────────────────────────────

echo "[build-helpers] Compiling keychain-helper..."
swiftc -O \
  -o "$APP_BUNDLE/Contents/MacOS/dotlock" \
  "$SWIFT_SRC" \
  -framework Security \
  -framework LocalAuthentication

# ── Info.plist ───────────────────────────────────────────────────────

cat > "$APP_BUNDLE/Contents/Info.plist" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleIdentifier</key>
    <string>${BUNDLE_ID}</string>
    <key>CFBundleExecutable</key>
    <string>dotlock</string>
    <key>CFBundleName</key>
    <string>dotlock</string>
    <key>CFBundleDisplayName</key>
    <string>dotlock</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleVersion</key>
    <string>1</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0</string>
    <key>LSUIElement</key>
    <true/>
    <key>DotlockTeamID</key>
    <string>${TEAM_ID}</string>
</dict>
</plist>
PLIST

# ── Embed provisioning profile (must be before codesign) ─────────────

cp "$PROFILE" "$APP_BUNDLE/Contents/embedded.provisionprofile"

# ── Entitlements ─────────────────────────────────────────────────────

ENTITLEMENTS="$OUT_DIR/keychain-helper.entitlements"
cat > "$ENTITLEMENTS" <<ENTITLEMENTS_CONTENT
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.application-identifier</key>
    <string>${TEAM_ID}.${BUNDLE_ID}</string>
    <key>com.apple.developer.team-identifier</key>
    <string>${TEAM_ID}</string>
    <key>keychain-access-groups</key>
    <array>
        <string>${TEAM_ID}.${BUNDLE_ID}</string>
    </array>
</dict>
</plist>
ENTITLEMENTS_CONTENT

# ── Sign the .app bundle ────────────────────────────────────────────

echo "[build-helpers] Signing..."
codesign --force --sign "$IDENTITY" \
  --entitlements "$ENTITLEMENTS" \
  --options runtime \
  "$APP_BUNDLE"

# ── Verify ───────────────────────────────────────────────────────────

echo "[build-helpers] Verifying..."
codesign -dvv "$APP_BUNDLE" 2>&1 | grep -E "Authority|Identifier|TeamIdentifier"
echo ""
echo "[build-helpers] Entitlements:"
codesign -d --entitlements - "$APP_BUNDLE/Contents/MacOS/dotlock" 2>&1
echo ""
echo "[build-helpers] Done: $APP_BUNDLE"
echo "[build-helpers] Binary: $APP_BUNDLE/Contents/MacOS/dotlock"
