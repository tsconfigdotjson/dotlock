import type { Dirent } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import type { EnvFile, KeyEntry } from "../shared/types";

const IGNORE_DIRS = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  ".nuxt",
  "__pycache__",
  "vendor",
  ".venv",
  "venv",
  ".electrobun",
]);

function isEnvFilename(name: string): boolean {
  return name === ".env" || name.startsWith(".env.");
}

export function parseEnvFile(content: string): KeyEntry[] {
  const keys: KeyEntry[] = [];
  const today = new Date().toISOString().split("T")[0];

  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const match = trimmed.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)=(.*)/);
    if (!match) {
      continue;
    }

    const [, name, rawValue] = match;
    let value = rawValue;

    // Strip surrounding quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    keys.push({ name, value, addedAt: today });
  }

  return keys;
}

export async function scanFolder(folderPath: string): Promise<EnvFile[]> {
  const envFiles: EnvFile[] = [];

  async function walk(dir: string) {
    let entries: Dirent[];
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (!IGNORE_DIRS.has(entry.name)) {
          await walk(join(dir, entry.name));
        }
      } else if (entry.isFile() && isEnvFilename(entry.name)) {
        try {
          const fullPath = join(dir, entry.name);
          const content = await readFile(fullPath, "utf-8");
          const keys = parseEnvFile(content);
          if (keys.length > 0) {
            const relDir = relative(folderPath, dirname(fullPath));
            const filename = relDir ? `${entry.name} (${relDir})` : entry.name;
            envFiles.push({
              filename,
              absolutePath: fullPath,
              rawContent: content,
              keys,
              syncStatus: "synced",
            });
          }
        } catch {
          // Skip unreadable files
        }
      }
    }
  }

  await walk(folderPath);
  return envFiles;
}
