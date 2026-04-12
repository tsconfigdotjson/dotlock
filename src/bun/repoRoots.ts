import { existsSync, mkdirSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { atomicWrite } from "./atomicWrite";

/**
 * Per-machine mapping of (vaultPath, repoName) → absolute repo root.
 *
 * Lives in ~/.dotlock/repo-roots.json and never travels with the vault.
 * When Alice shares a vault with Bob, Bob populates his own mapping via the
 * linkRepo flow; the vault itself only carries portable (name + relative)
 * identity for env files.
 */

type RepoRootsData = {
  [vaultPath: string]: {
    [repoName: string]: string;
  };
};

/** Override for testing — when set, used instead of ~/.dotlock. */
let dataDirOverride: string | null = null;

/** Set a custom data directory (for testing). Pass null to reset. */
export function setDataDir(dir: string | null): void {
  dataDirOverride = dir;
}

function getDataDir(): string {
  const dir = dataDirOverride ?? join(homedir(), ".dotlock");
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  return dir;
}

function getRootsPath(): string {
  return join(getDataDir(), "repo-roots.json");
}

async function readAll(): Promise<RepoRootsData> {
  try {
    const raw = await readFile(getRootsPath(), "utf-8");
    return JSON.parse(raw) as RepoRootsData;
  } catch {
    return {};
  }
}

async function writeAll(data: RepoRootsData): Promise<void> {
  const path = getRootsPath();
  const dir = dirname(path);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  await atomicWrite(path, JSON.stringify(data, null, 2));
}

/** Get the local root path for a repo in a vault, or null if unmapped. */
export async function getRepoRoot(
  vaultPath: string,
  repoName: string,
): Promise<string | null> {
  const data = await readAll();
  return data[vaultPath]?.[repoName] ?? null;
}

/** Record the local root path for a repo in a vault. */
export async function setRepoRoot(
  vaultPath: string,
  repoName: string,
  rootPath: string,
): Promise<void> {
  const data = await readAll();
  if (!data[vaultPath]) {
    data[vaultPath] = {};
  }
  data[vaultPath][repoName] = rootPath;
  await writeAll(data);
}

/** Remove the mapping for a single repo in a vault. */
export async function removeRepoRoot(
  vaultPath: string,
  repoName: string,
): Promise<void> {
  const data = await readAll();
  if (!data[vaultPath]) {
    return;
  }
  delete data[vaultPath][repoName];
  if (Object.keys(data[vaultPath]).length === 0) {
    delete data[vaultPath];
  }
  await writeAll(data);
}

/** All repo→root mappings for a given vault. */
export async function getAllRepoRoots(
  vaultPath: string,
): Promise<Record<string, string>> {
  const data = await readAll();
  return { ...(data[vaultPath] ?? {}) };
}

/** Clear every mapping for a vault (used when vault is deleted). */
export async function clearVaultRoots(vaultPath: string): Promise<void> {
  const data = await readAll();
  if (!data[vaultPath]) {
    return;
  }
  delete data[vaultPath];
  await writeAll(data);
}
