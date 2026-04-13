import { readFile } from "node:fs/promises";
import { basename, join } from "node:path";
import {
  ApplicationMenu,
  BrowserView,
  BrowserWindow,
  Updater,
  Utils,
} from "electrobun/bun";
import type { DotlockRPC, Repo, RepoView } from "../shared/types";
import {
  deletePassword,
  getAccentColor,
  retrievePassword,
  storePassword,
} from "./keychain";
import {
  addKey as addKeyOp,
  deleteKey as deleteKeyOp,
  editKey as editKeyOp,
  importFile as importFileOp,
  removeRepo as removeRepoOp,
  restoreFile as restoreFileOp,
} from "./operations";
import { isValidRepoRoot } from "./paths";
import {
  addRecentVault,
  getRecentVaults,
  removeRecentVault,
} from "./recentVaults";
import {
  clearVaultRoots,
  getAllRepoRoots,
  getRepoRoot,
  removeRepoRoot,
  setRepoRoot,
} from "./repoRoots";
import { parseEnvFile, scanFolder } from "./scanner";
import { VaultManager } from "./vault";
import { fileWatcher } from "./watcher";

const DEV_SERVER_PORT = 5173;
const DEV_SERVER_URL = `http://localhost:${DEV_SERVER_PORT}`;

const vault = new VaultManager();

// Wire the watcher to use the vault's db
fileWatcher.setGetDB(() => vault.getDB());

/**
 * Attach this machine's rootPath to a Repo for RPC responses. `null` when
 * the repo is unlinked on this machine (no entry in repoRoots.json).
 */
async function toRepoView(repo: Repo): Promise<RepoView> {
  const vaultPath = vault.getVaultPath();
  const rootPath = vaultPath ? await getRepoRoot(vaultPath, repo.name) : null;
  return { ...repo, rootPath };
}

async function toRepoViewOrNull(repo: Repo | null): Promise<RepoView | null> {
  if (!repo) {
    return null;
  }
  return toRepoView(repo);
}

async function watchRepoIfLinked(repoName: string): Promise<void> {
  const vaultPath = vault.getVaultPath();
  if (!vaultPath) {
    return;
  }
  const rootPath = await getRepoRoot(vaultPath, repoName);
  if (!rootPath) {
    return;
  }
  const relativePaths = vault.getDB().getWatchPaths(repoName);
  fileWatcher.watchRepo(repoName, rootPath, relativePaths);
}

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
          // Re-establish file watchers for linked repos only
          const db = vault.getDB();
          for (const repo of db.getAll()) {
            await watchRepoIfLinked(repo.name);
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

      removeRecentVault: async ({ path }) => {
        try {
          await removeRecentVault(path);
          await clearVaultRoots(path);
          return true;
        } catch {
          return false;
        }
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

      // ── Appearance ────────────────────────────────────────────────

      getAccentColor: async () => getAccentColor(),

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
        const repo: Repo = { name, envFiles };
        db.add(repo);

        // Record this machine's root for this repo + vault
        const vaultPath = vault.getVaultPath();
        if (vaultPath) {
          await setRepoRoot(vaultPath, name, folderPath);
        }

        // Start watching the env files
        await watchRepoIfLinked(name);

        await vault.save();
        return toRepoView(repo);
      },

      getRepos: async () => {
        if (vault.getState() !== "unlocked") {
          return [];
        }
        const repos = vault.getDB().getAll();
        const vaultPath = vault.getVaultPath();
        const roots = vaultPath ? await getAllRepoRoots(vaultPath) : {};
        return repos.map((r) => ({ ...r, rootPath: roots[r.name] ?? null }));
      },

      getRepo: async ({ name }) => {
        if (vault.getState() !== "unlocked") {
          return null;
        }
        return toRepoViewOrNull(vault.getDB().get(name));
      },

      removeRepo: async ({ name }) => {
        const removed = await removeRepoOp(vault, name);
        if (!removed) {
          return false;
        }
        fileWatcher.unwatchRepo(name);
        const vaultPath = vault.getVaultPath();
        if (vaultPath) {
          await removeRepoRoot(vaultPath, name);
        }
        return true;
      },

      linkRepo: async ({ repoName, rootPath }) => {
        if (vault.getState() !== "unlocked") {
          return null;
        }
        const vaultPath = vault.getVaultPath();
        if (!vaultPath) {
          return null;
        }
        const repo = vault.getDB().get(repoName);
        if (!repo) {
          return null;
        }
        if (!isValidRepoRoot(rootPath)) {
          return null;
        }
        await setRepoRoot(vaultPath, repoName, rootPath);
        await watchRepoIfLinked(repoName);
        return toRepoView(repo);
      },

      unlinkRepo: async ({ repoName }) => {
        if (vault.getState() !== "unlocked") {
          return false;
        }
        const vaultPath = vault.getVaultPath();
        if (!vaultPath) {
          return false;
        }
        fileWatcher.unwatchRepo(repoName);
        await removeRepoRoot(vaultPath, repoName);
        return true;
      },

      pickRepoFolder: async () => {
        const paths = await Utils.openFileDialog({
          startingFolder: "~/",
          allowedFileTypes: "*",
          canChooseFiles: false,
          canChooseDirectory: true,
          allowsMultipleSelection: false,
        });
        return paths[0] || null;
      },

      importFile: async ({ repoName, relativePath }) =>
        toRepoViewOrNull(await importFileOp(vault, repoName, relativePath)),

      restoreFile: async ({ repoName, relativePath }) =>
        toRepoViewOrNull(await restoreFileOp(vault, repoName, relativePath)),
      editKey: async ({ repoName, relativePath, keyName, value, provider }) =>
        toRepoViewOrNull(
          await editKeyOp(
            vault,
            repoName,
            relativePath,
            keyName,
            value,
            provider,
          ),
        ),

      deleteKey: async ({ repoName, relativePath, keyName }) =>
        toRepoViewOrNull(
          await deleteKeyOp(vault, repoName, relativePath, keyName),
        ),

      addKey: async ({ repoName, relativePath, keyName, value, provider }) =>
        toRepoViewOrNull(
          await addKeyOp(
            vault,
            repoName,
            relativePath,
            keyName,
            value,
            provider,
          ),
        ),

      // ── Shell ──────────────────────────────────────────────────────
      openExternal: async ({ url }) => {
        try {
          Bun.spawn(["open", url]);
          return true;
        } catch {
          return false;
        }
      },
    },
    messages: {},
  },
});

// Push sync status changes to the webview
fileWatcher.setOnChange((repoName) => {
  rpc.send.syncChanged({ repoName });
});

// Auto-discover new .env files appearing in watched repo directories
fileWatcher.setOnNewEnvFile(async (repoName, relativePath) => {
  if (vault.getState() !== "unlocked") {
    return false;
  }
  const vaultPath = vault.getVaultPath();
  if (!vaultPath) {
    return false;
  }
  const rootPath = await getRepoRoot(vaultPath, repoName);
  if (!rootPath) {
    return false;
  }
  const db = vault.getDB();
  const repo = db.get(repoName);
  if (!repo) {
    return false;
  }

  try {
    const absolutePath = join(rootPath, relativePath);
    const content = await readFile(absolutePath, "utf-8");
    const keys = parseEnvFile(content);
    if (keys.length === 0) {
      return false;
    }

    const name = basename(relativePath);
    const relDir = relativePath.slice(0, -name.length).replace(/\/$/, "");
    const filename = relDir ? `${name} (${relDir})` : name;

    db.addEnvFile(repoName, {
      filename,
      relativePath,
      rawContent: content,
      keys,
      syncStatus: "synced",
    });

    await vault.save();
    return true;
  } catch {
    return false;
  }
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
