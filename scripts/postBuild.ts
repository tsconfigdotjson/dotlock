import { existsSync } from "node:fs";
import { cp, readdir } from "node:fs/promises";
import { join } from "node:path";
import { $ } from "bun";

const buildDir = process.env.ELECTROBUN_BUILD_DIR;
if (!buildDir) {
  console.error("ELECTROBUN_BUILD_DIR not set");
  process.exit(1);
}

// Find the .app bundle in the build directory
const entries = await readdir(buildDir);
const appDir = entries.find((e) => e.endsWith(".app"));
if (!appDir) {
  console.error("No .app bundle found in", buildDir);
  process.exit(1);
}

const bundlePath = join(buildDir, appDir);
const resourcesPath = join(bundlePath, "Contents", "Resources");
const helpersPath = join(bundlePath, "Contents", "Helpers");

// Compile icon.icon directly — produces Assets.car (Liquid Glass) + icon.icns (fallback)
const result =
  await $`xcrun actool icon.icon --compile ${resourcesPath} --app-icon icon --output-format human-readable-text --output-partial-info-plist /dev/null --include-all-app-icons --target-device mac --minimum-deployment-target 14.0 --platform macosx`.quiet();

if (result.exitCode !== 0) {
  console.error("actool failed:", result.stderr.toString());
  process.exit(1);
}

console.log(`[postBuild] Compiled icon.icon → ${appDir}/Contents/Resources/`);

// Set icon keys in Info.plist
const plistPath = join(bundlePath, "Contents", "Info.plist");
for (const [key, value] of [
  ["CFBundleIconName", "icon"],
  ["CFBundleIconFile", "icon"],
]) {
  try {
    await $`/usr/libexec/PlistBuddy -c "Add :${key} string ${value}" ${plistPath}`.quiet();
  } catch {
    await $`/usr/libexec/PlistBuddy -c "Set :${key} ${value}" ${plistPath}`;
  }
}

console.log("[postBuild] Updated Info.plist");

// Copy the signed keychain helper .app into Contents/Helpers/ (not MacOS/)
// so ElectroBun's signing pass doesn't re-sign it and strip its entitlements.
// buildDir is e.g. build/canary-macos-arm64/, helpers are at build/helpers/
const helperSrc = join(buildDir, "..", "helpers", "dotlock-keychain.app");
const helperDest = join(helpersPath, "dotlock-keychain.app");

if (existsSync(helperSrc)) {
  const { mkdirSync } = await import("node:fs");
  mkdirSync(helpersPath, { recursive: true });
  await cp(helperSrc, helperDest, { recursive: true });
  // Strip extended attributes so Electrobun's tar doesn't emit PAX headers
  // (its zig tar parser can't handle them → TarHeadersTooBig crash).
  await $`xattr -cr ${helperDest}`.quiet();
  console.log(
    `[postBuild] Bundled keychain helper → ${appDir}/Contents/Helpers/dotlock-keychain.app`,
  );
} else {
  console.warn("[postBuild] WARNING: keychain helper not found at", helperSrc);
  console.warn("[postBuild] Run 'bun run build:helpers' first.");
}
