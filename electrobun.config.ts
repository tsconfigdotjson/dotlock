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
    },
    linux: {
      bundleCEF: false,
    },
    win: {
      bundleCEF: false,
    },
  },
  release: {
    baseUrl: "https://releases.dotlock.dev/",
    generatePatch: true,
  },
} satisfies ElectrobunConfig;
