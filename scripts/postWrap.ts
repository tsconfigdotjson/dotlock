import { $ } from "bun";
import { join } from "path";

const bundlePath = process.env.ELECTROBUN_WRAPPER_BUNDLE_PATH;
if (!bundlePath) {
  console.error("ELECTROBUN_WRAPPER_BUNDLE_PATH not set");
  process.exit(1);
}

const resourcesPath = join(bundlePath, "Contents", "Resources");

// Compile icon.icon directly — produces Assets.car (Liquid Glass) + icon.icns (fallback)
const result =
  await $`xcrun actool icon.icon --compile ${resourcesPath} --app-icon icon --output-format human-readable-text --output-partial-info-plist /dev/null --include-all-app-icons --target-device mac --minimum-deployment-target 14.0 --platform macosx`.quiet();

if (result.exitCode !== 0) {
  console.error("actool failed:", result.stderr.toString());
  process.exit(1);
}

console.log("Compiled icon.icon → Assets.car + icon.icns");

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

console.log("Updated Info.plist");
