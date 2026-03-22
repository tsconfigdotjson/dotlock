import { basename } from "node:path";
import { readFile, writeFile } from "node:fs/promises";
import {
  ApplicationMenu,
  BrowserView,
  BrowserWindow,
  Updater,
  Utils,
} from "electrobun/bun";
import type { DotlockRPC } from "../shared/types";
import { db } from "./db";
import { parseEnvFile, scanFolder } from "./scanner";
import { fileWatcher } from "./watcher";

const DEV_SERVER_PORT = 5173;
const DEV_SERVER_URL = `http://localhost:${DEV_SERVER_PORT}`;

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
      selectFolder: async () => {
        console.log("[dotlock] selectFolder called, opening dialog...");
        const paths = await Utils.openFileDialog({
          startingFolder: "~/",
          allowedFileTypes: "*",
          canChooseFiles: false,
          canChooseDirectory: true,
          allowsMultipleSelection: false,
        });

        console.log("[dotlock] dialog returned:", paths);
        const folderPath = paths[0];
        if (!folderPath) {
          return null;
        }

        console.log("[dotlock] scanning folder:", folderPath);
        const envFiles = await scanFolder(folderPath);
        console.log("[dotlock] found env files:", envFiles.length);
        const name = basename(folderPath);
        const repo = { name, path: folderPath, envFiles };
        db.add(repo);

        // Start watching the env files
        const watchPaths = db.getWatchPaths(name);
        fileWatcher.watchRepo(name, watchPaths);

        return repo;
      },

      getRepos: () => db.getAll(),
      getRepo: ({ name }) => db.get(name),

      removeRepo: ({ name }) => {
        fileWatcher.unwatchRepo(name);
        return db.remove(name);
      },

      importFile: async ({ repoName, absolutePath }) => {
        const repo = db.get(repoName);
        if (!repo) return null;

        const envFile = repo.envFiles.find(
          (f) => f.absolutePath === absolutePath,
        );
        if (!envFile) return null;

        try {
          const content = await readFile(absolutePath, "utf-8");
          const keys = parseEnvFile(content);
          db.updateEnvFile(repoName, {
            ...envFile,
            rawContent: content,
            keys,
            syncStatus: "synced",
          });
          console.log(`[dotlock] imported ${absolutePath} from disk`);
          return db.get(repoName);
        } catch (e) {
          console.error(`[dotlock] import failed for ${absolutePath}:`, e);
          return null;
        }
      },

      restoreFile: async ({ repoName, absolutePath }) => {
        const repo = db.get(repoName);
        if (!repo) return null;

        const envFile = repo.envFiles.find(
          (f) => f.absolutePath === absolutePath,
        );
        if (!envFile) return null;

        try {
          await writeFile(absolutePath, envFile.rawContent, "utf-8");
          db.updateSyncStatus(repoName, absolutePath, "synced");
          console.log(`[dotlock] restored ${absolutePath} to disk`);
          return db.get(repoName);
        } catch (e) {
          console.error(`[dotlock] restore failed for ${absolutePath}:`, e);
          return null;
        }
      },

      dismissDrift: ({ repoName, absolutePath }) => {
        db.updateSyncStatus(repoName, absolutePath, "synced");
        return db.get(repoName);
      },
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

console.log("dotlock started!");
