import { basename } from "node:path";
import {
  ApplicationMenu,
  BrowserView,
  BrowserWindow,
  Updater,
  Utils,
} from "electrobun/bun";
import type { DotlockRPC } from "../shared/types";
import { deletePassword, retrievePassword, storePassword } from "./keychain";
import {
  addKey as addKeyOp,
  deleteKey as deleteKeyOp,
  editKey as editKeyOp,
  importFile as importFileOp,
  removeRepo as removeRepoOp,
  restoreFile as restoreFileOp,
} from "./operations";
import { addRecentVault, getRecentVaults } from "./recentVaults";
import { scanFolder } from "./scanner";
import { VaultManager } from "./vault";
import { fileWatcher } from "./watcher";

const DEV_SERVER_PORT = 5173;
const DEV_SERVER_URL = `http://localhost:${DEV_SERVER_PORT}`;

const vault = new VaultManager();

// Wire the watcher to use the vault's db
fileWatcher.setGetDB(() => vault.getDB());

// Check if Vite dev server is running for HMR
async function getMainViewUrl(): Promise<string> {
  const channel = await Updater.localInfo.channel();
  if (channel === "dev") {
    try {
      await fetch(DEV_SERVER_URL, { method: "HEAD" });
      console.log(`HMR enabled: Using Vite dev server at ${DEV_SERVER_URL}`);
      return DEV_SERVER_URL;
    } catch {
      console.log(
        "Vite dev server not running. Run 'bun run dev:hmr' for HMR support.",
      );
    }
  }
  return "views://mainview/index.html";
}

const rpc = BrowserView.defineRPC<DotlockRPC>({
  maxRequestTime: 120_000,
  handlers: {
    requests: {
      // ── Vault lifecycle ───────────────────────────────────────────

      getVaultState: () => vault.getState(),

      getRecentVaults: async () => getRecentVaults(),

      createVault: async ({ path, password }) => {
        try {
          await vault.createVault(path, password);
          const recents = await getRecentVaults();
          const existing = recents.find((r) => r.path === path);
          await addRecentVault({
            ...existing,
            path,
            name: basename(path, ".dotlock"),
            lastOpened: new Date().toISOString(),
          });
          rpc.send.vaultStateChanged({ state: "unlocked" });
          return true;
        } catch {
          return false;
        }
      },

      openVault: async ({ path, password }) => {
        try {
          await vault.openVault(path, password);
          const recents = await getRecentVaults();
          const existing = recents.find((r) => r.path === path);
          await addRecentVault({
            ...existing,
            path,
            name: basename(path, ".dotlock"),
            lastOpened: new Date().toISOString(),
          });
          // Re-establish file watchers for all repos in the vault
          const db = vault.getDB();
          for (const repo of db.getAll()) {
            const watchPaths = db.getWatchPaths(repo.name);
            fileWatcher.watchRepo(repo.name, watchPaths);
          }
          rpc.send.vaultStateChanged({ state: "unlocked" });
          return true;
        } catch {
          return false;
        }
      },

      lockVault: () => {
        fileWatcher.unwatchAll();
        vault.lock();
        rpc.send.vaultStateChanged({ state: "locked" });
        return true;
      },

      pickVaultFile: async () => {
        const paths = await Utils.openFileDialog({
          startingFolder: "~/",
          allowedFileTypes: "dotlock",
          canChooseFiles: true,
          canChooseDirectory: false,
          allowsMultipleSelection: false,
        });
        return paths[0] || null;
      },

      pickVaultFolder: async () => {
        const paths = await Utils.openFileDialog({
          startingFolder: "~/",
          allowedFileTypes: "*",
          canChooseFiles: false,
          canChooseDirectory: true,
          allowsMultipleSelection: false,
        });
        return paths[0] || null;
      },

      // ── Keychain / Touch ID ───────────────────────────────────────

      hasKeychainPassword: async ({ vaultPath }) => {
        const recents = await getRecentVaults();
        const meta = recents.find((r) => r.path === vaultPath);
        return meta?.keychainEnabled === true;
      },

      storeInKeychain: async ({ vaultPath, password }) => {
        const ok = await storePassword(vaultPath, password);
        if (ok) {
          const recents = await getRecentVaults();
          const existing = recents.find((r) => r.path === vaultPath);
          if (existing) {
            await addRecentVault({ ...existing, keychainEnabled: true });
          }
        }
        return ok;
      },

      retrieveFromKeychain: async ({ vaultPath }) =>
        retrievePassword(vaultPath),

      removeFromKeychain: async ({ vaultPath }) => {
        const ok = await deletePassword(vaultPath);
        if (ok) {
          const recents = await getRecentVaults();
          const existing = recents.find((r) => r.path === vaultPath);
          if (existing) {
            await addRecentVault({ ...existing, keychainEnabled: false });
          }
        }
        return ok;
      },

      // ── Repo operations (require unlocked vault) ──────────────────

      selectFolder: async () => {
        if (vault.getState() !== "unlocked") {
          return null;
        }
        const db = vault.getDB();

        const paths = await Utils.openFileDialog({
          startingFolder: "~/",
          allowedFileTypes: "*",
          canChooseFiles: false,
          canChooseDirectory: true,
          allowsMultipleSelection: false,
        });

        const folderPath = paths[0];
        if (!folderPath) {
          return null;
        }

        const envFiles = await scanFolder(folderPath);
        const name = basename(folderPath);
        const repo = { name, path: folderPath, envFiles };
        db.add(repo);

        // Start watching the env files
        const watchPaths = db.getWatchPaths(name);
        fileWatcher.watchRepo(name, watchPaths);

        await vault.save();
        return repo;
      },

      getRepos: () => {
        if (vault.getState() !== "unlocked") {
          return [];
        }
        return vault.getDB().getAll();
      },

      getRepo: ({ name }) => {
        if (vault.getState() !== "unlocked") {
          return null;
        }
        return vault.getDB().get(name);
      },

      removeRepo: async ({ name }) => {
        fileWatcher.unwatchRepo(name);
        return removeRepoOp(vault, name);
      },

      importFile: async ({ repoName, absolutePath }) =>
        importFileOp(vault, repoName, absolutePath),

      restoreFile: async ({ repoName, absolutePath }) =>
        restoreFileOp(vault, repoName, absolutePath),
      editKey: async ({ repoName, absolutePath, keyName, value, provider }) =>
        editKeyOp(vault, repoName, absolutePath, keyName, value, provider),

      deleteKey: async ({ repoName, absolutePath, keyName }) =>
        deleteKeyOp(vault, repoName, absolutePath, keyName),

      addKey: async ({ repoName, absolutePath, keyName, value, provider }) =>
        addKeyOp(vault, repoName, absolutePath, keyName, value, provider),
    },
    messages: {},
  },
});

// Push sync status changes to the webview
fileWatcher.setOnChange((repoName) => {
  rpc.send.syncChanged({ repoName });
});

ApplicationMenu.setApplicationMenu([
  {
    label: "dotlock",
    submenu: [
      { role: "about" },
      { type: "separator" },
      { role: "hide" },
      { role: "hideOthers" },
      { role: "showAll" },
      { type: "separator" },
      { role: "quit", accelerator: "q" },
    ],
  },
  {
    label: "Edit",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      { role: "selectAll" },
    ],
  },
  {
    label: "Window",
    submenu: [
      { role: "minimize" },
      { role: "zoom" },
      { role: "close" },
      { type: "separator" },
      { role: "toggleFullScreen" },
    ],
  },
]);

const url = await getMainViewUrl();

new BrowserWindow({
  title: "dotlock",
  url,
  rpc,
  frame: {
    width: 900,
    height: 700,
    x: 200,
    y: 200,
  },
});
