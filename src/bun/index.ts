import {
  ApplicationMenu,
  BrowserView,
  BrowserWindow,
  Updater,
  Utils,
} from "electrobun/bun";
import { basename } from "node:path";
import type { DotlockRPC } from "../shared/types";
import { db } from "./db";
import { scanFolder } from "./scanner";

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
        if (!folderPath) return null;

        console.log("[dotlock] scanning folder:", folderPath);
        const envFiles = await scanFolder(folderPath);
        console.log("[dotlock] found env files:", envFiles.length);
        const name = basename(folderPath);
        const repo = { name, path: folderPath, envFiles };
        db.add(repo);
        return repo;
      },
      getRepos: () => db.getAll(),
      getRepo: ({ name }) => db.get(name),
      removeRepo: ({ name }) => db.remove(name),
    },
    messages: {},
  },
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
