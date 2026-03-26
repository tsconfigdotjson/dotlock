import type { ElectrobunConfig } from "electrobun";

export default {
  app: {
    name: "dotlock",
    identifier: "dev.dotlock.app",
    version: "1.0.1",
  },
  scripts: {
    postBuild: "scripts/postBuild.ts",
    postWrap: "scripts/postWrap.ts",
  },
  build: {
    // Vite builds to dist/, we copy from there
    copy: {
      "dist/index.html": "views/mainview/index.html",
      "dist/assets": "views/mainview/assets",
    },
    // Ignore Vite output in watch mode — HMR handles view rebuilds separately
    watchIgnore: ["dist/**"],
    mac: {
      bundleCEF: false,
      codesign: true,
      notarize: true,
      entitlements: {
        "com.apple.security.app-sandbox": true,
        "com.apple.security.files.user-selected.read-write":
          "dotlock needs access to your vault file and project folders",
      },
    },
    linux: {
      bundleCEF: false,
    },
    win: {
      bundleCEF: false,
    },
  },
} satisfies ElectrobunConfig;
